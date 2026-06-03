"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AI_MODEL_OPTIONS } from "@/lib/ai/model-options";
import {
  type PendingFoundationSource,
  writePendingFoundation,
} from "@/lib/design/pending-foundation";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "in",
  "of",
  "on",
  "the",
  "to",
  "with",
]);

const TERMINAL_PRODUCT_TERMS = new Set([
  "app",
  "brand",
  "dashboard",
  "deck",
  "generator",
  "guide",
  "identity",
  "interface",
  "kit",
  "logo",
  "page",
  "palette",
  "platform",
  "site",
  "system",
  "tool",
  "typography",
  "website",
]);

const PHRASE_KEYWORD_SCORE: Record<string, number> = {
  "brand identity": 208,
  "chord progression": 228,
  "color palette": 212,
  "design system": 212,
  "generator app": 166,
  "landing page": 190,
  "mobile app": 190,
  "music producers": 224,
  "teddy bear": 198,
  "teddy wear": 226,
  "type system": 192,
  "web app": 190,
};

const DESIGN_KEYWORD_SCORE: Record<string, number> = {
  app: 120,
  brand: 115,
  clothing: 76,
  dashboard: 112,
  generator: 108,
  identity: 116,
  interface: 112,
  logo: 114,
  page: 106,
  palette: 118,
  platform: 108,
  references: 104,
  system: 116,
  tool: 106,
  typography: 118,
  website: 110,
  color: 92,
  design: 92,
  music: 78,
  producers: 74,
  chord: 78,
  progression: 74,
  teddy: 70,
  wear: 70,
};

function cleanWord(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isLikelyNameWord(word: string) {
  const trimmed = word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");

  return /^[A-Z0-9]/.test(trimmed) && trimmed.length > 1;
}

function getAccentIndexes(words: string[]) {
  const cleaned = words.map(cleanWord);
  const candidates: Array<{ indexes: number[]; score: number }> = [];
  const forIndex = cleaned.lastIndexOf("for");
  const lastKeywordIndex = cleaned.findLastIndex(
    (word) => word && !STOP_WORDS.has(word),
  );

  const addCandidate = (indexes: number[], baseScore: number) => {
    const afterForBoost = forIndex >= 0 && indexes[0] > forIndex ? 34 : 0;
    const directForBoost =
      indexes[0] > 0 && cleaned[indexes[0] - 1] === "for" ? 16 : 0;

    candidates.push({
      indexes,
      score: baseScore + afterForBoost + directForBoost + indexes[0] * 1.5,
    });
  };

  for (let index = 0; index < cleaned.length; index += 1) {
    const first = cleaned[index];
    const second = cleaned[index + 1];

    if (!first || !second || STOP_WORDS.has(first) || STOP_WORDS.has(second)) {
      continue;
    }

    const phrase = `${first} ${second}`;
    const phraseScore = PHRASE_KEYWORD_SCORE[phrase];
    if (phraseScore) {
      addCandidate([index, index + 1], phraseScore);
    }

    if (isLikelyNameWord(words[index]) && isLikelyNameWord(words[index + 1])) {
      addCandidate([index, index + 1], 220);
    }

    if (TERMINAL_PRODUCT_TERMS.has(second)) {
      addCandidate(
        [index, index + 1],
        Math.max(
          DESIGN_KEYWORD_SCORE[first] || 42,
          DESIGN_KEYWORD_SCORE[second] || 88,
        ) + 48,
      );
    }
  }

  if (candidates.length) {
    candidates.sort((a, b) => b.score - a.score);
    return new Set(candidates[0].indexes);
  }

  let bestIndex = Math.max(0, lastKeywordIndex);
  let bestScore = Number.NEGATIVE_INFINITY;

  cleaned.forEach((word, index) => {
    if (!word || STOP_WORDS.has(word)) {
      return;
    }

    const score =
      (DESIGN_KEYWORD_SCORE[word] || 30) +
      index * 2 +
      (index === lastKeywordIndex ? 16 : 0) -
      (TERMINAL_PRODUCT_TERMS.has(word) ? 12 : 0);

    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });

  return new Set([bestIndex]);
}

function HighlightTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const accentIndexes = getAccentIndexes(words);

  return (
    <>
      {words.map((word, index) => (
        <span
          className={accentIndexes.has(index) ? "text-accent" : undefined}
          key={`${word}-${index}`}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export function PreparationPreview({
  modelId,
  onBack,
  source,
  title,
}: {
  modelId: string;
  onBack: () => void;
  source: PendingFoundationSource;
  title: string;
}) {
  const router = useRouter();
  const model =
    AI_MODEL_OPTIONS.find((option) => option.id === modelId) || AI_MODEL_OPTIONS[0];
  const steps = [
    {
      label: "Brief",
      detail: "Audience, mood, constraints, and the memorable moment.",
      status: "In progress",
    },
    {
      label: "Archetype",
      detail: "Primary and secondary brand archetype direction.",
    },
    {
      label: "Color Story",
      detail: "Three palettes scored against your intent.",
    },
    {
      label: "Typography",
      detail: "Heading, body, and mono pairings.",
    },
  ];

  function continueToFoundation() {
    writePendingFoundation({
      createdAt: Date.now(),
      modelId,
      source,
      title,
    });
    router.push("/projects/new?from=preparation");
  }

  return (
    <div className="w-full max-w-[720px] animate-[fadeUp_0.45s_ease] pt-2">
      <button
        className="mb-6 inline-flex items-center gap-[7px] whitespace-nowrap text-[13px] text-ink-subtle transition-colors duration-150 hover:text-foreground"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to start
      </button>

      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
        New project · {model.label}
      </p>
      <h1 className="mb-[14px] text-[30px] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground">
        <HighlightTitle text={title} />
      </h1>
      <p className="mb-[30px] max-w-[560px] text-base leading-[1.55] text-ink-muted">
        Clarity is preparing your workspace. Your design direction will build
        out across these steps.
      </p>

      <div className="mb-[18px] grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <article
            className={`relative flex items-start gap-[14px] rounded-[14px] border bg-surface p-[18px] ${
              index === 0
                ? "border-accent/40 bg-[linear-gradient(180deg,var(--surface),var(--accent-soft))]"
                : "border-line"
            }`}
            key={step.label}
          >
            <span className="pt-0.5 font-mono text-[13px] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="mb-[5px] text-[15px] font-semibold">
                {step.label}
              </h2>
              <p className="text-[13px] leading-[1.45] text-ink-muted">
                {step.detail}
              </p>
            </div>
            {step.status ? (
              <span className="absolute right-3.5 top-3.5 rounded-md bg-[rgba(217,161,94,0.1)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                {step.status}
              </span>
            ) : null}
          </article>
        ))}
      </div>

      <div className="grid h-40 place-items-center rounded-2xl border border-dashed border-line bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,rgba(255,255,255,0.018)_11px,rgba(255,255,255,0.018)_22px)]">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
          DESIGN.md preview
        </span>
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_12px_34px_rgba(216,161,93,0.18)] transition hover:bg-[#efbd78]"
          onClick={continueToFoundation}
          type="button"
        >
          Continue to Project Foundation
          <ArrowRight size={16} aria-hidden />
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
          onClick={onBack}
          type="button"
        >
          Back to start
        </button>
      </div>
    </div>
  );
}
