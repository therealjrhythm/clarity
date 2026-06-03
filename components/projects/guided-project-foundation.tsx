"use client";

import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AI_MODEL_OPTIONS } from "@/lib/ai/model-options";
import {
  clearPendingFoundation,
  type PendingFoundationContext,
} from "@/lib/design/pending-foundation";

type FoundationBlockId = "intent" | "audience" | "feel" | "requirements";

type FoundationQuestion = {
  id: string;
  prompt: string;
};

type FoundationBlock = {
  id: FoundationBlockId;
  title: string;
  detail: string;
  captured: string;
  questions: FoundationQuestion[];
};

type FoundationAnswers = Record<FoundationBlockId, string[]>;

const FOUNDATION_BLOCKS: FoundationBlock[] = [
  {
    id: "intent",
    title: "Project Intent",
    detail: "What are we creating, and what should it accomplish?",
    captured: "Project intent captured",
    questions: [
      { id: "creating", prompt: "What are you creating?" },
      { id: "goal", prompt: "What is the main goal of this project?" },
      {
        id: "outcome",
        prompt: "What should someone do after experiencing it?",
      },
    ],
  },
  {
    id: "audience",
    title: "Audience",
    detail: "Who is this for, and what do they need?",
    captured: "Audience direction captured",
    questions: [
      { id: "who", prompt: "Who is this for?" },
      {
        id: "cares",
        prompt: "What does this audience care about most?",
      },
      {
        id: "moment",
        prompt: "What problem, desire, or moment brings them here?",
      },
    ],
  },
  {
    id: "feel",
    title: "Brand Feel",
    detail: "What should the project feel like?",
    captured: "Brand feel captured",
    questions: [
      { id: "feeling", prompt: "What should the project feel like?" },
      {
        id: "references",
        prompt:
          "Are there brands, visuals, artists, websites, or references that capture the direction?",
      },
    ],
  },
  {
    id: "requirements",
    title: "Requirements",
    detail: "What needs to be included or avoided?",
    captured: "Requirements captured",
    questions: [
      {
        id: "included",
        prompt: "What content, sections, or features need to be included?",
      },
      {
        id: "constraints",
        prompt:
          "Are there any constraints, must-haves, or things to avoid?",
      },
    ],
  },
];

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

const TYPE_PATTERNS: Array<[RegExp, string]> = [
  [/\blanding\s+page\b/i, "Landing page"],
  [/\bwebsite\b|\bweb\s+site\b/i, "Website"],
  [/\bdashboard\b/i, "Dashboard"],
  [/\bmobile\s+app\b/i, "Mobile app"],
  [/\bweb\s+app\b|\bapp\b/i, "App"],
  [/\bcolor\s+palette\b|\bpalette\b/i, "Color palette"],
  [/\breferences?\b|\bmoodboard\b/i, "References"],
  [/\bbrand\s+identity\b|\bidentity\b|\bbrand\b/i, "Brand identity"],
  [/\bdesign\s+system\b|\bsystem\b/i, "Design system"],
];

const SYNTHESIS_STEPS = [
  "Synthesizing foundation",
  "Shaping project direction",
  "Preparing focused workspace",
];

function createInitialAnswers(): FoundationAnswers {
  return FOUNDATION_BLOCKS.reduce((nextAnswers, block) => {
    return {
      ...nextAnswers,
      [block.id]: block.questions.map(() => ""),
    };
  }, {} as FoundationAnswers);
}

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

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ""}${word.slice(1)}`)
    .join(" ");
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function inferProjectType(title: string) {
  const match = TYPE_PATTERNS.find(([pattern]) => pattern.test(title));
  return match?.[1] || "Other";
}

function inferProjectName(title: string) {
  const normalizedTitle = normalizeText(title);
  const forMatch = normalizedTitle.match(/\bfor\s+([^,.;!?]+)/i);

  if (forMatch?.[1]) {
    const candidate = normalizeText(
      forMatch[1].replace(/\b(a|an|the)\b/gi, ""),
    );
    const words = candidate.split(/\s+/).filter(Boolean);
    const hasNameLikeWord = words.some((word) => /^[A-Z0-9]/.test(word));

    if (candidate && (hasNameLikeWord || words.length <= 3)) {
      return titleCase(candidate);
    }
  }

  const beforeAudience = normalizeText(
    normalizedTitle
      .replace(/\bfor\s+.+$/i, "")
      .replace(/^(build|create|make|start|design|generate)\s+/i, "")
      .replace(/^(a|an|the)\s+/i, ""),
  );

  return beforeAudience ? titleCase(beforeAudience) : "Untitled system";
}

function limitDescription(value: string) {
  const normalized = normalizeText(value);
  if (normalized.length <= 500) {
    return normalized;
  }

  return `${normalized.slice(0, 497).trim()}...`;
}

function buildProjectFields(
  context: PendingFoundationContext,
  answers: FoundationAnswers,
) {
  const answerText = FOUNDATION_BLOCKS.flatMap((block) => answers[block.id])
    .map(normalizeText)
    .filter(Boolean);
  const descriptionParts = [context.title, ...answerText.slice(0, 5)];

  return {
    description: limitDescription(descriptionParts.join(" ")),
    name: inferProjectName(context.title),
    type: inferProjectType(context.title),
  };
}

function getChips(title: string, blockId: FoundationBlockId) {
  const lowerTitle = title.toLowerCase();
  const landingPageChips = [
    "Premium clients",
    "Case studies",
    "Services",
    "Contact CTA",
    "Editorial",
    "Minimal",
    "Warm",
    "Bold",
  ];

  if (lowerTitle.includes("landing page")) {
    return landingPageChips;
  }

  if (blockId === "intent") {
    return ["Design system", "Landing page", "Brand direction", "Website", "App"];
  }

  if (blockId === "audience") {
    return [
      "Creative teams",
      "Founders",
      "Premium clients",
      "Music producers",
      "Operators",
    ];
  }

  if (blockId === "feel") {
    return ["Editorial", "Minimal", "Warm", "Bold", "Premium", "Calm"];
  }

  return [
    "Case studies",
    "Services",
    "Contact CTA",
    "References",
    "Mobile layout",
    "Avoid clutter",
  ];
}

function blockHasAnswers(block: FoundationBlock, answers: FoundationAnswers) {
  return answers[block.id].some((answer) => answer.trim().length > 0);
}

function GuidedQuestionPanel({
  answers,
  block,
  contextTitle,
  onChangeAnswer,
  onClose,
  onSave,
  onSelectChip,
}: {
  answers: string[];
  block: FoundationBlock;
  contextTitle: string;
  onChangeAnswer: (questionIndex: number, value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onSelectChip: (chip: string) => void;
}) {
  const chips = getChips(contextTitle, block.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-5 py-8 backdrop-blur-md">
      <section className="w-full max-w-[620px] animate-[fadeUp_0.28s_ease] rounded-[20px] border border-line bg-[rgba(18,19,26,0.96)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)]">
        <div className="mb-5 flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
              Guided Foundation
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
              {block.title}
            </h2>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              {block.detail}
            </p>
          </div>
          <button
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        <div className="space-y-4">
          {block.questions.map((question, index) => (
            <label className="block space-y-2" key={question.id}>
              <span className="text-sm font-medium text-foreground">
                {question.prompt}
              </span>
              <textarea
                className="min-h-[74px] w-full resize-none rounded-[14px] border border-line bg-background/65 px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-ink-subtle focus:border-accent/50 focus:bg-background/80"
                onChange={(event) => onChangeAnswer(index, event.target.value)}
                placeholder="Add a focused answer..."
                value={answers[index] || ""}
              />
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              className="inline-flex h-8 items-center rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink-muted transition hover:border-accent/50 hover:text-foreground"
              key={chip}
              onClick={() => onSelectChip(chip)}
              type="button"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_12px_34px_rgba(216,161,93,0.18)] transition hover:bg-[#efbd78]"
            onClick={onSave}
            type="button"
          >
            Save {block.title}
            <Check size={16} aria-hidden />
          </button>
          <button
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
            onClick={onClose}
            type="button"
          >
            Back to foundation
          </button>
        </div>
      </section>
    </div>
  );
}

function SynthesisChecklist() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setActiveStep(SYNTHESIS_STEPS.length);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, SYNTHESIS_STEPS.length));
    }, 330);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      aria-live="polite"
      className="mt-6 rounded-[18px] border border-accent/35 bg-[linear-gradient(180deg,var(--surface),var(--accent-soft))] p-5"
    >
      <div className="space-y-3">
        {SYNTHESIS_STEPS.map((step, index) => {
          const complete = index < activeStep;
          const active = index === activeStep;

          return (
            <div
              className={`flex items-center gap-3 text-sm ${
                complete || active ? "text-foreground" : "text-ink-subtle"
              }`}
              key={step}
            >
              {complete ? (
                <Check size={15} aria-hidden className="text-accent" />
              ) : (
                <span
                  className={`h-3.5 w-3.5 rounded-full border ${
                    active
                      ? "border-accent shadow-[0_0_0_4px_rgba(217,161,94,0.12)]"
                      : "border-ink-subtle"
                  }`}
                />
              )}
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GuidedProjectFoundation({
  action,
  context,
  onBack,
}: {
  action: (formData: FormData) => void | Promise<void>;
  context: PendingFoundationContext;
  onBack?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<FoundationAnswers>(() =>
    createInitialAnswers(),
  );
  const [completedBlocks, setCompletedBlocks] = useState<FoundationBlockId[]>(
    [],
  );
  const [activeBlockId, setActiveBlockId] = useState<FoundationBlockId | null>(
    null,
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const model =
    AI_MODEL_OPTIONS.find((option) => option.id === context.modelId) ||
    AI_MODEL_OPTIONS[0];
  const activeBlock =
    FOUNDATION_BLOCKS.find((block) => block.id === activeBlockId) || null;
  const firstIncompleteBlock =
    FOUNDATION_BLOCKS.find((block) => !completedBlocks.includes(block.id)) ||
    null;
  const projectFields = useMemo(
    () => buildProjectFields(context, answers),
    [answers, context],
  );

  useEffect(() => {
    if (!isSynthesizing) {
      return;
    }

    const delay = prefersReducedMotion() ? 220 : 1260;
    const submitTimer = window.setTimeout(() => {
      clearPendingFoundation();
      formRef.current?.requestSubmit();
    }, delay);

    return () => window.clearTimeout(submitTimer);
  }, [isSynthesizing]);

  function updateAnswer(questionIndex: number, value: string) {
    if (!activeBlock) {
      return;
    }

    setAnswers((currentAnswers) => {
      const blockAnswers = [...currentAnswers[activeBlock.id]];
      blockAnswers[questionIndex] = value;

      return {
        ...currentAnswers,
        [activeBlock.id]: blockAnswers,
      };
    });
  }

  function appendChip(chip: string) {
    if (!activeBlock) {
      return;
    }

    setAnswers((currentAnswers) => {
      const blockAnswers = [...currentAnswers[activeBlock.id]];
      const blankIndex = blockAnswers.findIndex((answer) => !answer.trim());
      const targetIndex =
        blankIndex >= 0 ? blankIndex : Math.max(0, blockAnswers.length - 1);
      const currentValue = blockAnswers[targetIndex] || "";
      blockAnswers[targetIndex] = currentValue
        ? `${currentValue}, ${chip}`
        : chip;

      return {
        ...currentAnswers,
        [activeBlock.id]: blockAnswers,
      };
    });
  }

  function saveActiveBlock() {
    if (!activeBlock) {
      return;
    }

    setCompletedBlocks((currentBlocks) =>
      currentBlocks.includes(activeBlock.id)
        ? currentBlocks
        : [...currentBlocks, activeBlock.id],
    );
    setActiveBlockId(null);
  }

  function continueToProject() {
    if (firstIncompleteBlock) {
      setActiveBlockId(firstIncompleteBlock.id);
      return;
    }

    setIsSynthesizing(true);
  }

  return (
    <div className="w-full max-w-[780px] animate-[fadeUp_0.45s_ease] pt-2">
      {onBack ? (
        <button
          className="mb-6 inline-flex items-center gap-[7px] whitespace-nowrap text-[13px] text-ink-subtle transition-colors duration-150 hover:text-foreground"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={16} aria-hidden />
          Back to start
        </button>
      ) : null}

      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
        Project Foundation · {model.label}
      </p>
      <h1 className="mb-[14px] max-w-[720px] text-[30px] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground">
        <HighlightTitle text={context.title} />
      </h1>
      <p className="mb-[30px] max-w-[620px] text-base leading-[1.55] text-ink-muted">
        Clarity will ask a few focused questions to shape the foundation of
        your project before creating your workspace.
      </p>

      <div className="mb-[18px] grid gap-3 sm:grid-cols-2">
        {FOUNDATION_BLOCKS.map((block, index) => {
          const complete = completedBlocks.includes(block.id);
          const active = firstIncompleteBlock?.id === block.id && !complete;
          const status = complete ? "Complete" : active ? "In progress" : "Ready";

          return (
            <button
              className={`relative flex min-h-[118px] items-start gap-[14px] rounded-[14px] border bg-surface p-[18px] text-left transition hover:border-accent/40 ${
                active
                  ? "border-accent/40 bg-[linear-gradient(180deg,var(--surface),var(--accent-soft))]"
                  : "border-line"
              }`}
              key={block.id}
              onClick={() => setActiveBlockId(block.id)}
              type="button"
            >
              <span className="pt-0.5 font-mono text-[13px] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="mb-[5px] block text-[15px] font-semibold">
                  {block.title}
                </span>
                <span className="block text-[13px] leading-[1.45] text-ink-muted">
                  {block.detail}
                </span>
              </span>
              <span className="absolute right-3.5 top-3.5 rounded-md bg-[rgba(217,161,94,0.1)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                {status}
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-2xl border border-dashed border-line bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,rgba(255,255,255,0.018)_11px,rgba(255,255,255,0.018)_22px)] p-5">
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
          DESIGN.md Preview
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {FOUNDATION_BLOCKS.map((block) => {
            const complete = completedBlocks.includes(block.id);
            return (
              <div
                className="rounded-[12px] border border-line bg-background/35 px-3.5 py-3 text-sm"
                key={block.id}
              >
                <span className="flex items-center gap-2 text-foreground">
                  {complete ? (
                    <Check size={14} aria-hidden className="text-accent" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-ink-subtle" />
                  )}
                  {complete ? block.captured : `Awaiting ${block.title}`}
                </span>
                {blockHasAnswers(block, answers) ? (
                  <span className="mt-1 block truncate text-xs text-ink-muted">
                    {answers[block.id].filter(Boolean).join(" · ")}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {isSynthesizing ? (
        <SynthesisChecklist />
      ) : (
        <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_12px_34px_rgba(216,161,93,0.18)] transition hover:bg-[#efbd78]"
            onClick={continueToProject}
            type="button"
          >
            Continue to Project
            <ArrowRight size={16} aria-hidden />
          </button>
          {onBack ? (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
              onClick={onBack}
              type="button"
            >
              Back to start
            </button>
          ) : null}
        </div>
      )}

      <form action={action} aria-hidden className="hidden" ref={formRef}>
        <input name="name" readOnly value={projectFields.name} />
        <input name="type" readOnly value={projectFields.type} />
        <textarea
          name="description"
          readOnly
          value={projectFields.description}
        />
      </form>

      {activeBlock ? (
        <GuidedQuestionPanel
          answers={answers[activeBlock.id]}
          block={activeBlock}
          contextTitle={context.title}
          onChangeAnswer={updateAnswer}
          onClose={() => setActiveBlockId(null)}
          onSave={saveActiveBlock}
          onSelectChip={appendChip}
        />
      ) : null}
    </div>
  );
}
