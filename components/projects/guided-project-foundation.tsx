"use client";

import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FoundationQuestionHelpActionResult,
  FoundationQuestionsActionResult,
} from "@/lib/briefs/actions";
import type {
  FoundationAnswers,
  FoundationBlockId,
  FoundationQuestion,
  FoundationQuestionBlock,
  FoundationQuestionHelpRequest,
  FoundationQuestionHelpResult,
  FoundationQuestionSet,
  ProjectUnderstanding,
} from "@/lib/briefs/types";
import {
  clearPendingFoundation,
  type PendingFoundationContext,
} from "@/lib/design/pending-foundation";

type PreparedFoundationQuestionsResult = Extract<
  FoundationQuestionsActionResult,
  { ok: true }
>;

type QuestionHelpState =
  | {
      results: FoundationQuestionHelpResult[];
      status: "loading";
    }
  | {
      results: FoundationQuestionHelpResult[];
      status: "success";
    }
  | {
      message: string;
      results: FoundationQuestionHelpResult[];
      status: "error";
    };

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

function createInitialAnswers(blocks: FoundationQuestionBlock[]): FoundationAnswers {
  return blocks.reduce((nextAnswers, block) => {
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
  blocks: FoundationQuestionBlock[],
) {
  const answerText = blocks
    .flatMap((block) => answers[block.id])
    .map(normalizeText)
    .filter(Boolean);
  const descriptionParts = [context.title, ...answerText.slice(0, 5)];

  return {
    description: limitDescription(descriptionParts.join(" ")),
    name: inferProjectName(context.title),
    type: inferProjectType(context.title),
  };
}

function getChips(
  title: string,
  blockId: FoundationBlockId,
  blockChips: string[],
) {
  if (blockChips.length) {
    return blockChips;
  }

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

function blockHasAnswers(
  block: FoundationQuestionBlock,
  answers: FoundationAnswers,
) {
  return answers[block.id].some((answer) => answer.trim().length > 0);
}

function GuidedQuestionPanel({
  allAnswers,
  answers,
  block,
  contextTitle,
  getQuestionHelp,
  onChangeAnswer,
  onClose,
  onRefineUnderstanding,
  onSave,
  onSelectChip,
  projectUnderstanding,
  projectType,
}: {
  allAnswers: FoundationAnswers;
  answers: string[];
  block: FoundationQuestionBlock;
  contextTitle: string;
  getQuestionHelp?: (
    request: FoundationQuestionHelpRequest,
  ) => Promise<FoundationQuestionHelpActionResult>;
  onChangeAnswer: (questionIndex: number, value: string) => void;
  onClose: () => void;
  onRefineUnderstanding?: (
    clarification: string,
  ) => Promise<{ message?: string; ok: boolean }>;
  onSave: () => boolean;
  onSelectChip: (questionIndex: number, chip: string) => void;
  projectUnderstanding: ProjectUnderstanding;
  projectType: string;
}) {
  const chips = getChips(contextTitle, block.id, block.chips);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const firstUnanswered = answers.findIndex((answer) => !answer.trim());
    return firstUnanswered >= 0 ? firstUnanswered : 0;
  });
  const [helpByQuestionId, setHelpByQuestionId] = useState<
    Record<string, QuestionHelpState>
  >({});
  const [followUpByQuestionId, setFollowUpByQuestionId] = useState<
    Record<string, string>
  >({});
  const [understandingConfirmed, setUnderstandingConfirmed] = useState(
    block.id !== "intent",
  );
  const [isEditingUnderstanding, setIsEditingUnderstanding] = useState(false);
  const [understandingDraft, setUnderstandingDraft] = useState(
    projectUnderstanding.normalizedPromptSummary,
  );
  const [understandingError, setUnderstandingError] = useState("");
  const [understandingLoading, setUnderstandingLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const currentQuestion =
    block.questions[currentQuestionIndex] || block.questions[0];
  const currentAnswer = answers[currentQuestionIndex] || "";
  const currentHelpState = currentQuestion
    ? helpByQuestionId[currentQuestion.id]
    : undefined;
  const currentHelpResults = currentHelpState?.results || [];
  const latestHelpResult = currentHelpResults.at(-1);
  const currentFollowUp = currentQuestion
    ? followUpByQuestionId[currentQuestion.id] || ""
    : "";
  const currentAnswered = currentAnswer.trim().length > 0;
  const isLastQuestion = currentQuestionIndex === block.questions.length - 1;

  async function requestQuestionHelp(
    question: FoundationQuestion,
    questionIndex: number,
    userFollowUp = "",
  ) {
    if (!getQuestionHelp) {
      return;
    }

    const previousResults = helpByQuestionId[question.id]?.results || [];
    setHelpByQuestionId((currentHelp) => ({
      ...currentHelp,
      [question.id]: {
        results: currentHelp[question.id]?.results || [],
        status: "loading",
      },
    }));

    const helpRequest: FoundationQuestionHelpRequest = {
      allAnswers,
      blockId: block.id,
      blockTitle: block.title,
      currentAnswer: answers[questionIndex] || "",
      currentBlockAnswers: answers,
      currentQuestionIndex: questionIndex,
      initialPrompt: contextTitle,
      previousAiSuggestions: previousResults,
      projectUnderstanding,
      projectType,
      questionId: question.id,
      questionPrompt: question.prompt,
      selectedChips: chips,
      totalQuestions: block.questions.length,
      userFollowUp,
    };

    try {
      const result = await getQuestionHelp(helpRequest);

      if (!result.ok) {
        setHelpByQuestionId((currentHelp) => ({
          ...currentHelp,
          [question.id]: {
            message: result.error.message,
            results: currentHelp[question.id]?.results || [],
            status: "error",
          },
        }));
        return;
      }

      setHelpByQuestionId((currentHelp) => ({
        ...currentHelp,
        [question.id]: {
          results: [
            ...(currentHelp[question.id]?.results || []),
            result.data,
          ],
          status: "success",
        },
      }));
      setFollowUpByQuestionId((currentFollowUps) => ({
        ...currentFollowUps,
        [question.id]: "",
      }));
    } catch {
      setHelpByQuestionId((currentHelp) => ({
        ...currentHelp,
        [question.id]: {
          message:
            "Clarity couldn’t generate AI help for this answer. You can try again or write your answer manually.",
          results: currentHelp[question.id]?.results || [],
          status: "error",
        },
      }));
    }
  }

  async function refineUnderstanding() {
    if (!onRefineUnderstanding || !understandingDraft.trim()) {
      return;
    }

    setUnderstandingLoading(true);
    setUnderstandingError("");
    const result = await onRefineUnderstanding(understandingDraft.trim());
    setUnderstandingLoading(false);

    if (!result.ok) {
      setUnderstandingError(
        result.message ||
          "Clarity couldn’t update the project understanding. Please try again.",
      );
      return;
    }

    setUnderstandingConfirmed(true);
    setIsEditingUnderstanding(false);
  }

  function goToPreviousQuestion() {
    setValidationMessage("");
    setCurrentQuestionIndex((index) => Math.max(0, index - 1));
  }

  function goToNextQuestion() {
    if (!currentAnswered) {
      setValidationMessage("Add an answer to continue.");
      return;
    }

    setValidationMessage("");
    setCurrentQuestionIndex((index) =>
      Math.min(block.questions.length - 1, index + 1),
    );
  }

  function finishBlock() {
    if (!currentAnswered) {
      setValidationMessage("Add an answer to continue.");
      return;
    }

    const saved = onSave();
    if (!saved) {
      setValidationMessage("Answer every question before finishing this block.");
    }
  }

  function setQuestionAnswer(answer: string) {
    onChangeAnswer(currentQuestionIndex, answer);
    if (answer.trim()) {
      setValidationMessage("");
    }
  }

  function setCurrentFollowUp(value: string) {
    if (!currentQuestion) {
      return;
    }

    setFollowUpByQuestionId((currentFollowUps) => ({
      ...currentFollowUps,
      [currentQuestion.id]: value,
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-5 py-8 backdrop-blur-md">
      <section className="max-h-[calc(100vh-64px)] w-full max-w-[660px] animate-[fadeUp_0.28s_ease] overflow-y-auto rounded-[20px] border border-accent/45 bg-[rgba(18,19,26,0.96)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.42)] ring-1 ring-accent/30">
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

        {block.id === "intent" && !understandingConfirmed ? (
          <div className="space-y-4">
            <section className="rounded-[16px] border border-accent/30 bg-accent/10 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                Confirm Understanding
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground">
                I understand that you want to build{" "}
                <span className="font-semibold">
                  {projectUnderstanding.projectType}
                </span>
                {projectUnderstanding.businessType
                  ? ` for ${projectUnderstanding.businessType}`
                  : ""}
                {projectUnderstanding.userRole
                  ? ` as a ${projectUnderstanding.userRole}`
                  : ""}
                .
              </p>
              {projectUnderstanding.missingDetails.length ? (
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  I still need to confirm{" "}
                  {projectUnderstanding.missingDetails.slice(0, 3).join(", ")}.
                </p>
              ) : null}
            </section>

            {isEditingUnderstanding ? (
              <div className="space-y-3">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-foreground">
                    Clarify the project understanding
                  </span>
                  <textarea
                    className="min-h-[118px] w-full resize-none rounded-[16px] border border-line bg-background/65 px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-ink-subtle focus:border-accent/50 focus:bg-background/80"
                    onChange={(event) =>
                      setUnderstandingDraft(event.target.value)
                    }
                    placeholder="Clarify what Clarity should understand before asking foundation questions..."
                    value={understandingDraft}
                  />
                </label>
                {understandingError ? (
                  <p className="rounded-[12px] border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-foreground">
                    {understandingError}
                  </p>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-[#efbd78] disabled:cursor-wait disabled:opacity-60"
                    disabled={understandingLoading || !understandingDraft.trim()}
                    onClick={refineUnderstanding}
                    type="button"
                  >
                    {understandingLoading
                      ? "Updating understanding..."
                      : "Update understanding"}
                  </button>
                  <button
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
                    onClick={() => setIsEditingUnderstanding(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-[#efbd78]"
                  onClick={() => setUnderstandingConfirmed(true)}
                  type="button"
                >
                  Yes, continue
                </button>
                <button
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
                  onClick={() => setIsEditingUnderstanding(true)}
                  type="button"
                >
                  Edit understanding
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Question {currentQuestionIndex + 1} of {block.questions.length}
            </p>
            <p className="text-xs text-ink-subtle">
              All answers are required.
            </p>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-200"
              style={{
                width: `${((currentQuestionIndex + 1) / block.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label
            className="block text-[18px] font-semibold leading-[1.35] tracking-[-0.015em] text-foreground"
            htmlFor={`${block.id}-${currentQuestion.id}`}
          >
            {currentQuestion.prompt}
          </label>
          <textarea
            id={`${block.id}-${currentQuestion.id}`}
            className="min-h-[118px] w-full resize-none rounded-[16px] border border-line bg-background/65 px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-ink-subtle focus:border-accent/50 focus:bg-background/80"
            onChange={(event) => setQuestionAnswer(event.target.value)}
            placeholder="Add a focused answer..."
            value={currentAnswer}
          />
          {!currentAnswered ? (
            <p className="text-xs text-ink-subtle">
              {validationMessage || "Add an answer to continue."}
            </p>
          ) : validationMessage ? (
            <p className="text-xs text-ink-subtle">{validationMessage}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {getQuestionHelp ? (
              <button
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-3 text-[11px] font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/15 disabled:cursor-wait disabled:opacity-70"
                disabled={currentHelpState?.status === "loading"}
                onClick={() =>
                  requestQuestionHelp(currentQuestion, currentQuestionIndex)
                }
                type="button"
              >
                <Sparkles size={13} aria-hidden />
                {currentHelpState?.status === "loading"
                  ? "Thinking..."
                  : "Help with AI"}
              </button>
            ) : null}
            {chips.map((chip) => (
              <button
                className="inline-flex h-8 items-center rounded-full border border-line bg-surface px-3 text-xs font-medium text-ink-muted transition hover:border-accent/50 hover:text-foreground"
                key={chip}
                onClick={() => onSelectChip(currentQuestionIndex, chip)}
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {latestHelpResult ||
        currentHelpState?.status === "loading" ||
        currentHelpState?.status === "error" ? (
          <section className="mt-5 rounded-[16px] border border-accent/25 bg-accent/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
                AI inspiration for this answer
              </p>
              {latestHelpResult ? (
                <span className="text-[11px] text-ink-subtle">AI-assisted</span>
              ) : null}
            </div>

            {latestHelpResult ? (
              <div className="space-y-3">
                <p className="text-sm leading-6 text-ink-muted">
                  {latestHelpResult.intro}
                </p>
                <div className="space-y-2">
                  {latestHelpResult.options.map((option) => (
                    <article
                      className="rounded-[13px] border border-line bg-background/45 p-3"
                      key={option.id}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-foreground">
                          {option.label}
                        </h3>
                        <button
                          className="inline-flex h-7 shrink-0 items-center rounded-full border border-accent/35 px-2.5 text-[11px] font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/10"
                          onClick={() => setQuestionAnswer(option.answer)}
                          type="button"
                        >
                          Use this answer
                        </button>
                      </div>
                      <p className="text-sm leading-6 text-ink-muted">
                        {option.answer}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-ink-subtle">
                        {option.rationale}
                      </p>
                    </article>
                  ))}
                </div>
                <article className="rounded-[13px] border border-accent/35 bg-background/55 p-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      Best fit
                    </h3>
                    <button
                      className="inline-flex h-7 shrink-0 items-center rounded-full border border-accent/35 bg-accent/10 px-2.5 text-[11px] font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/15"
                      onClick={() => setQuestionAnswer(latestHelpResult.bestFit.answer)}
                      type="button"
                    >
                      Use this answer
                    </button>
                  </div>
                  <p className="text-sm leading-6 text-ink-muted">
                    {latestHelpResult.bestFit.answer}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-ink-subtle">
                    {latestHelpResult.bestFit.rationale}
                  </p>
                </article>
                {latestHelpResult.followUpQuestion ? (
                  <p className="rounded-[12px] border border-line bg-background/35 px-3 py-2 text-sm leading-6 text-ink-muted">
                    {latestHelpResult.followUpQuestion}
                  </p>
                ) : null}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-medium text-ink-muted"
                    htmlFor={`${block.id}-${currentQuestion.id}-follow-up`}
                  >
                    Ask a follow-up for this answer
                  </label>
                  <textarea
                    className="min-h-[62px] w-full resize-none rounded-[13px] border border-line bg-background/65 px-3 py-2 text-sm leading-5 text-foreground outline-none transition placeholder:text-ink-subtle focus:border-accent/50"
                    id={`${block.id}-${currentQuestion.id}-follow-up`}
                    onChange={(event) => setCurrentFollowUp(event.target.value)}
                    placeholder="Make this more premium, combine options, or sharpen the audience..."
                    value={currentFollowUp}
                  />
                  <button
                    className="inline-flex min-h-9 items-center justify-center rounded-full border border-accent/35 px-3 text-xs font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
                    disabled={
                      !currentFollowUp.trim() ||
                      currentHelpState?.status === "loading"
                    }
                    onClick={() =>
                      requestQuestionHelp(
                        currentQuestion,
                        currentQuestionIndex,
                        currentFollowUp,
                      )
                    }
                    type="button"
                  >
                    Ask follow-up
                  </button>
                </div>
              </div>
            ) : null}

            {currentHelpState?.status === "loading" ? (
              <p className="text-sm leading-6 text-ink-muted">
                Clarity is preparing focused answer options...
              </p>
            ) : null}
            {currentHelpState?.status === "error" ? (
              <div className="mt-3 rounded-[12px] border border-line bg-surface px-3 py-3">
                <p className="text-xs leading-5 text-ink-muted">
                  {currentHelpState.message}
                </p>
                <button
                  className="mt-3 inline-flex h-8 items-center rounded-full border border-accent/35 px-3 text-xs font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/10"
                  onClick={() =>
                    requestQuestionHelp(currentQuestion, currentQuestionIndex)
                  }
                  type="button"
                >
                  Try again
                </button>
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
            onClick={onClose}
            type="button"
          >
            Back to foundation
          </button>
          {currentQuestionIndex > 0 ? (
            <button
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
              onClick={goToPreviousQuestion}
              type="button"
            >
              Previous
            </button>
          ) : null}
          <button
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_12px_34px_rgba(216,161,93,0.18)] transition enabled:hover:bg-[#efbd78] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!currentAnswered}
            onClick={isLastQuestion ? finishBlock : goToNextQuestion}
            type="button"
          >
            {isLastQuestion ? "Finish" : "Next"}
            {isLastQuestion ? (
              <Check size={16} aria-hidden />
            ) : (
              <ArrowRight size={16} aria-hidden />
            )}
          </button>
        </div>
          </>
        )}
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
  generateQuestions,
  getQuestionHelp,
  initialQuestionResult,
  onBack,
}: {
  action: (formData: FormData) => void | Promise<void>;
  context: PendingFoundationContext;
  generateQuestions?: (prompt: string) => Promise<FoundationQuestionsActionResult>;
  getQuestionHelp?: (
    request: FoundationQuestionHelpRequest,
  ) => Promise<FoundationQuestionHelpActionResult>;
  initialQuestionResult?: PreparedFoundationQuestionsResult | null;
  onBack?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [questionSet, setQuestionSet] = useState<FoundationQuestionSet | null>(
    () => initialQuestionResult?.data || null,
  );
  const [questionStatus, setQuestionStatus] = useState<"api" | "error" | "loading">(
    initialQuestionResult ? "api" : "loading",
  );
  const [questionError, setQuestionError] = useState("");
  const [analysisRunId, setAnalysisRunId] = useState(0);
  const [answers, setAnswers] = useState<FoundationAnswers>(() =>
    questionSet ? createInitialAnswers(questionSet.blocks) : ({} as FoundationAnswers),
  );
  const [completedBlocks, setCompletedBlocks] = useState<FoundationBlockId[]>(
    [],
  );
  const [activeBlockId, setActiveBlockId] = useState<FoundationBlockId | null>(
    null,
  );
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const foundationBlocks = useMemo(() => questionSet?.blocks || [], [questionSet]);
  const activeBlock =
    foundationBlocks.find((block) => block.id === activeBlockId) || null;
  const firstIncompleteBlock =
    foundationBlocks.find((block) => !completedBlocks.includes(block.id)) ||
    null;
  const projectFields = useMemo(
    () => buildProjectFields(context, answers, foundationBlocks),
    [answers, context, foundationBlocks],
  );

  useEffect(() => {
    let active = true;

    if (initialQuestionResult) {
      setQuestionSet(initialQuestionResult.data);
      setAnswers(createInitialAnswers(initialQuestionResult.data.blocks));
      setCompletedBlocks([]);
      setActiveBlockId(null);
      setQuestionError("");
      setQuestionStatus("api");

      return () => {
        active = false;
      };
    }

    if (!generateQuestions) {
      setQuestionStatus("error");
      setQuestionError(
        "Clarity couldn’t analyze your project. Please try again.",
      );
      return () => {
        active = false;
      };
    }

    setQuestionStatus("loading");
    setQuestionError("");
    generateQuestions(context.title)
      .then((result) => {
        if (!active) {
          return;
        }

        if (!result.ok) {
          setQuestionStatus("error");
          setQuestionError(result.error.message);
          return;
        }

        setQuestionSet(result.data);
        setAnswers(createInitialAnswers(result.data.blocks));
        setCompletedBlocks([]);
        setActiveBlockId(null);
        setQuestionStatus("api");
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setQuestionStatus("error");
        setQuestionError(
          "Clarity couldn’t analyze your project. Please try again.",
        );
      });

    return () => {
      active = false;
    };
  }, [analysisRunId, context.title, generateQuestions, initialQuestionResult]);

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

  function retryAnalysis() {
    setQuestionSet(null);
    setQuestionError("");
    setQuestionStatus("loading");
    setAnalysisRunId(Date.now());
  }

  async function refineUnderstanding(clarification: string) {
    if (!generateQuestions) {
      return {
        message: "Clarity couldn’t update the project understanding. Please try again.",
        ok: false,
      };
    }

    const refinedPrompt = `${context.title}\n\nUser clarification:\n${clarification}`;
    const result = await generateQuestions(refinedPrompt);

    if (!result.ok) {
      return {
        message: result.error.message,
        ok: false,
      };
    }

    setQuestionSet(result.data);
    setAnswers(createInitialAnswers(result.data.blocks));
    setCompletedBlocks([]);
    setActiveBlockId("intent");
    setQuestionError("");
    setQuestionStatus("api");

    return { ok: true };
  }

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

  function appendChip(questionIndex: number, chip: string) {
    if (!activeBlock) {
      return;
    }

    setAnswers((currentAnswers) => {
      const blockAnswers = [...currentAnswers[activeBlock.id]];
      const currentValue = blockAnswers[questionIndex] || "";
      blockAnswers[questionIndex] = currentValue
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
      return false;
    }

    const trimmedAnswers = answers[activeBlock.id].map(normalizeText);
    if (
      trimmedAnswers.length < activeBlock.questions.length ||
      trimmedAnswers.some((answer) => !answer)
    ) {
      return false;
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [activeBlock.id]: trimmedAnswers,
    }));
    setCompletedBlocks((currentBlocks) =>
      currentBlocks.includes(activeBlock.id)
        ? currentBlocks
        : [...currentBlocks, activeBlock.id],
    );
    setActiveBlockId(null);
    return true;
  }

  function continueToProject() {
    if (firstIncompleteBlock || !questionSet) {
      return;
    }

    setIsSynthesizing(true);
  }

  if (!questionSet || questionStatus === "loading" || questionStatus === "error") {
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
          Project Foundation · AI-guided
        </p>
        <h1 className="mb-[14px] max-w-[720px] text-[30px] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground">
          <HighlightTitle text={context.title} />
        </h1>

        {questionStatus === "error" ? (
          <section className="mt-7 rounded-[22px] border border-line bg-surface p-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-semibold tracking-[-0.02em]">
              Clarity couldn’t analyze your project.
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              {questionError ||
                "Please try again. If this keeps happening, try rephrasing your prompt."}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-[#efbd78]"
                onClick={retryAnalysis}
                type="button"
              >
                Retry analysis
              </button>
              {onBack ? (
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
                  onClick={onBack}
                  type="button"
                >
                  Back to prompt
                </button>
              ) : null}
            </div>
          </section>
        ) : (
          <section className="mt-7 rounded-[22px] border border-line bg-surface p-6 shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Project Analysis
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
              Clarity is reading your intent.
            </h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              The guided foundation will appear once Clarity has a valid project
              understanding.
            </p>
          </section>
        )}
      </div>
    );
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
        Project Foundation · AI-guided
      </p>
      <h1 className="mb-[14px] max-w-[720px] text-[30px] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground">
        <HighlightTitle text={context.title} />
      </h1>
      <p className="mb-[30px] max-w-[620px] text-base leading-[1.55] text-ink-muted">
        Clarity will ask a few focused questions to shape the foundation of
        your project before creating your workspace.
      </p>
      <p className="mb-4 text-sm font-medium text-ink-subtle">
        Clarity has analyzed your prompt. Confirm the essentials before creating
        your workspace.
      </p>

      <div className="mb-[18px] grid gap-3 sm:grid-cols-2">
        {foundationBlocks.map((block, index) => {
          const complete = completedBlocks.includes(block.id);
          const active = firstIncompleteBlock?.id === block.id && !complete;
          const locked = !complete && index > completedBlocks.length;
          const status = complete
            ? "Complete"
            : locked
              ? "Upcoming"
              : active
                ? "In progress"
                : "Ready";

          return (
            <button
              className={`relative flex min-h-[118px] items-start gap-[14px] rounded-[14px] border bg-surface p-[18px] text-left transition ${
                active
                  ? "border-accent/45 bg-[linear-gradient(180deg,var(--surface),var(--accent-soft))] ring-1 ring-accent/35"
                  : "border-line"
              } ${
                locked
                  ? "cursor-not-allowed opacity-45"
                  : "hover:border-accent/40"
              }`}
              disabled={locked}
              key={block.id}
              onClick={() => {
                if (!locked) {
                  setActiveBlockId(block.id);
                }
              }}
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
          {foundationBlocks.map((block) => {
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
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[0_12px_34px_rgba(216,161,93,0.18)] transition enabled:hover:bg-[#efbd78] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={Boolean(firstIncompleteBlock)}
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
        <input
          name="foundation_answers"
          readOnly
          value={JSON.stringify(answers)}
        />
        <input
          name="prompt_analysis"
          readOnly
          value={JSON.stringify(questionSet)}
        />
        <textarea
          name="description"
          readOnly
          value={projectFields.description}
        />
      </form>

      {activeBlock ? (
        <GuidedQuestionPanel
          allAnswers={answers}
          answers={answers[activeBlock.id]}
          block={activeBlock}
          contextTitle={context.title}
          getQuestionHelp={getQuestionHelp}
          key={`${activeBlock.id}-${questionSet.generatedAt}`}
          onChangeAnswer={updateAnswer}
          onClose={() => setActiveBlockId(null)}
          onRefineUnderstanding={refineUnderstanding}
          onSave={saveActiveBlock}
          onSelectChip={appendChip}
          projectUnderstanding={questionSet.projectUnderstanding}
          projectType={questionSet.projectType}
        />
      ) : null}
    </div>
  );
}
