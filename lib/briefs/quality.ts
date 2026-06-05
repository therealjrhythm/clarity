import type {
  BrandBriefSummary,
  BrandBriefResult,
  FoundationQuestionHelpResult,
  FoundationQuestionSet,
  OverviewSectionReview,
} from "@/lib/briefs/types";

const LOW_QUALITY_PATTERNS = [
  /\bshould focus this\b/i,
  /\blanding page around landing page\b/i,
  /\banswer the question\b/i,
  /\belevate your brand\b/i,
  /\bwe provide value\b/i,
  /\bstrong digital experience\b/i,
  /\bprofessional and modern\b/i,
  /\bmarketing project\b/i,
];

const GENERIC_TERMS = new Set([
  "brand",
  "business",
  "customer",
  "customers",
  "digital",
  "experience",
  "marketing",
  "modern",
  "professional",
  "project",
  "value",
]);

const HELP_CONTEXT_STOP_WORDS = new Set([
  ...GENERIC_TERMS,
  "answer",
  "answers",
  "block",
  "clarity",
  "focus",
  "focused",
  "goal",
  "main",
  "page",
  "primary",
  "question",
  "should",
  "this",
  "what",
  "with",
  "your",
]);

function normalize(value: string | null | undefined) {
  return (value || "").trim().replace(/\s+/g, " ");
}

function lower(value: string | null | undefined) {
  return normalize(value).toLowerCase();
}

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenStrings);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(flattenStrings);
  }

  return [];
}

function includesAny(text: string, terms: string[]) {
  const normalized = lower(text);
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

function extractSpecificPromptTerms(prompt: string) {
  return lower(prompt)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !GENERIC_TERMS.has(word));
}

function extractHelpContextTerms(values: unknown[]) {
  const seen = new Set<string>();

  for (const value of values) {
    for (const word of flattenStrings(value).join(" ").toLowerCase().split(/[^a-z0-9-]+/)) {
      if (word.length <= 3 || HELP_CONTEXT_STOP_WORDS.has(word)) {
        continue;
      }

      seen.add(word);
    }
  }

  return Array.from(seen);
}

function reject(reason: string): never {
  throw new Error(`AI low quality response: ${reason}`);
}

function assertNoBadPatterns(text: string, label: string) {
  const badPattern = LOW_QUALITY_PATTERNS.find((pattern) => pattern.test(text));

  if (badPattern) {
    reject(`${label} contains low-quality phrasing.`);
  }
}

function assertNotQuestionEcho(answer: string, questionPrompt: string) {
  const answerText = lower(answer);
  const questionText = lower(questionPrompt);

  if (!answerText || answerText === questionText) {
    reject("answer echoes the question.");
  }
}

export function assertFoundationQuestionSetQuality(
  questionSet: FoundationQuestionSet,
  originalPrompt: string,
) {
  const allText = flattenStrings(questionSet).join(" ");
  const promptTerms = extractSpecificPromptTerms(originalPrompt);
  const matchedTerms = promptTerms.filter((term) => includesAny(allText, [term]));
  const understandingText = flattenStrings(questionSet.projectUnderstanding).join(" ");

  assertNoBadPatterns(allText, "foundation questions");

  if (!questionSet.projectUnderstanding.originalPrompt) {
    reject("missing original prompt in project understanding.");
  }

  if (!questionSet.projectUnderstanding.projectType) {
    reject("missing project type in project understanding.");
  }

  if (questionSet.projectUnderstanding.knownDetails.length < 1) {
    reject("project understanding does not include enough known details.");
  }

  if (matchedTerms.length < Math.min(3, promptTerms.length)) {
    reject("project understanding ignores specific prompt details.");
  }

  if (
    originalPrompt.toLowerCase().includes("music producer") &&
    !lower(understandingText).includes("music producer")
  ) {
    reject("project understanding missed the user's role.");
  }

  if (
    originalPrompt.toLowerCase().includes("landing page") &&
    !lower(questionSet.projectUnderstanding.projectType).includes("landing page")
  ) {
    reject("project understanding missed the project type.");
  }

  if (
    questionSet.blocks[0]?.questions.some((question) =>
      /^what are you (building|creating)\??$/i.test(question.prompt.trim()),
    )
  ) {
    reject("intent questions ask generic information already in the prompt.");
  }
}

export function assertFoundationQuestionHelpQuality(
  result: FoundationQuestionHelpResult,
  {
    context = [],
    projectType,
    questionPrompt,
  }: {
    context?: unknown[];
    projectType: string;
    questionPrompt: string;
  },
) {
  const optionAnswers = result.options.map((option) => option.answer);
  const allAnswers = [...optionAnswers, result.bestFit.answer];
  const allText = flattenStrings(result).join(" ");
  const contextTerms = extractHelpContextTerms([
    projectType,
    questionPrompt,
    ...context,
  ]);
  const matchedContextTerms = contextTerms.filter((term) =>
    lower(allText).includes(term),
  );

  if (result.options.length !== 3) {
    reject("help response did not return three options.");
  }

  assertNoBadPatterns(allText, "question help");

  if (
    contextTerms.length > 0 &&
    matchedContextTerms.length < Math.min(2, contextTerms.length)
  ) {
    reject("help response ignores the project context.");
  }

  for (const answer of allAnswers) {
    const text = lower(answer);
    assertNotQuestionEcho(answer, questionPrompt);

    if (text.length < 40) {
      reject("answer is too short to be useful.");
    }

    if (
      contextTerms.length >= 3 &&
      !contextTerms.some((term) => text.includes(term))
    ) {
      reject("answer ignores the project context.");
    }
  }
}

export function assertBrandBriefQuality(
  result: BrandBriefResult,
  {
    projectType,
    requiredTerms,
  }: {
    projectType: string;
    requiredTerms: string[];
  },
) {
  const allText = flattenStrings(result.brief).join(" ");
  const normalized = lower(allText);
  const matchedRequiredTerms = requiredTerms.filter((term) =>
    normalized.includes(term.toLowerCase()),
  );

  assertNoBadPatterns(allText, "brand brief");

  if (!normalized.includes(lower(projectType).split(/\s+/)[0])) {
    reject("brand brief ignores project type.");
  }

  if (matchedRequiredTerms.length < Math.min(2, requiredTerms.length)) {
    reject("brand brief ignores required project context.");
  }
}

export function assertBrandBriefSummaryQuality(
  summary: BrandBriefSummary,
  {
    context,
  }: {
    context: unknown[];
  },
) {
  const allText = flattenStrings(summary).join(" ");
  const normalized = lower(allText);
  const contextTerms = extractHelpContextTerms(context);
  const matchedTerms = contextTerms.filter((term) => normalized.includes(term));

  assertNoBadPatterns(allText, "brand brief summary");

  if (!summary.archetypeGuidance || summary.archetypeGuidance.length < 24) {
    reject("summary is missing archetype guidance.");
  }

  if (normalized.includes("gemini") || normalized.includes("api")) {
    reject("summary exposes implementation details.");
  }

  if (
    contextTerms.length > 0 &&
    matchedTerms.length < Math.min(3, contextTerms.length)
  ) {
    reject("summary ignores saved project context.");
  }
}

export function assertOverviewSectionReviewQuality(
  review: OverviewSectionReview,
  {
    context,
    sectionContent,
  }: {
    context: unknown[];
    sectionContent: string;
  },
) {
  const allText = flattenStrings(review).join(" ");
  const normalized = lower(allText);
  const sectionTerms = extractHelpContextTerms([sectionContent]);
  const contextTerms = extractHelpContextTerms(context);
  const matchedSectionTerms = sectionTerms.filter((term) =>
    normalized.includes(term),
  );
  const matchedContextTerms = contextTerms.filter((term) =>
    normalized.includes(term),
  );

  assertNoBadPatterns(allText, "overview section review");

  if (normalized.includes("gemini") || normalized.includes("api")) {
    reject("overview review exposes implementation details.");
  }

  if (
    sectionTerms.length > 0 &&
    matchedSectionTerms.length < Math.min(1, sectionTerms.length)
  ) {
    reject("overview review ignores the active section.");
  }

  if (
    contextTerms.length > 0 &&
    matchedContextTerms.length < Math.min(2, contextTerms.length)
  ) {
    reject("overview review ignores project context.");
  }
}
