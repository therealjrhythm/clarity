import { z } from "zod";

export const foundationBlockIdSchema = z.enum([
  "intent",
  "audience",
  "feel",
  "requirements",
]);

const answerListSchema = z
  .array(z.string().trim().max(1200))
  .max(8)
  .transform((answers) => answers.filter(Boolean));

export const foundationAnswersSchema = z.object({
  intent: answerListSchema.default([]),
  audience: answerListSchema.default([]),
  feel: answerListSchema.default([]),
  requirements: answerListSchema.default([]),
});

export const foundationQuestionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  prompt: z.string().trim().min(8).max(240),
  semantic: z.enum(["projectName"]).optional(),
});

export const foundationQuestionBlockSchema = z.object({
  id: foundationBlockIdSchema,
  title: z.string().trim().min(2).max(80),
  detail: z.string().trim().min(8).max(240),
  captured: z.string().trim().min(2).max(80),
  questions: z.array(foundationQuestionSchema).min(1).max(4),
  chips: z.array(z.string().trim().min(2).max(40)).max(8).default([]),
});

export const projectUnderstandingSchema = z.object({
  brandOrProjectName: z.string().trim().max(120).optional(),
  businessType: z.string().trim().max(120).optional(),
  confidence: z.enum(["low", "medium", "high"]),
  inferredButUnconfirmed: z
    .array(z.string().trim().min(2).max(220))
    .max(10)
    .default([]),
  knownDetails: z.array(z.string().trim().min(2).max(220)).min(1).max(12),
  likelyAudience: z
    .array(z.string().trim().min(2).max(160))
    .min(1)
    .max(10),
  likelyGoals: z.array(z.string().trim().min(2).max(180)).min(1).max(10),
  missingDetails: z
    .array(z.string().trim().min(2).max(180))
    .min(1)
    .max(10),
  normalizedPromptSummary: z.string().trim().min(8).max(900),
  originalPrompt: z.string().trim().min(1).max(1200),
  projectSubtype: z.string().trim().max(120).optional(),
  projectType: z.string().trim().min(2).max(80),
  recommendedFoundationBlocks: z
    .array(z.string().trim().min(2).max(80))
    .min(4)
    .max(8),
  userRole: z.string().trim().max(120).optional(),
});

export const foundationQuestionSetSchema = z.object({
  blocks: z.array(foundationQuestionBlockSchema).length(4),
  generatedAt: z.string().trim().min(1),
  keywords: z.array(z.string().trim().min(2).max(40)).max(12).default([]),
  projectUnderstanding: projectUnderstandingSchema,
  projectType: z.string().trim().min(2).max(80),
  source: z.literal("api"),
  suggestedName: z.string().trim().max(100),
  summary: z.string().trim().max(1200),
});

const briefListSchema = z
  .array(z.string().trim().min(1).max(220))
  .min(1)
  .max(8);

export const brandBriefContentSchema = z.object({
  antiPatterns: briefListSchema,
  audience: z.string().trim().min(8).max(1200),
  brandPersonality: briefListSchema,
  constraints: briefListSchema,
  emotionalDirection: z.string().trim().min(8).max(1200),
  functionalRequirements: briefListSchema,
  keyMessages: briefListSchema,
  nextQuestions: briefListSchema,
  primaryGoal: z.string().trim().min(8).max(1200),
  signatureMoment: z.string().trim().min(8).max(1200),
  summary: z.string().trim().min(8).max(1200),
});

export const brandBriefResultSchema = z.object({
  brief: brandBriefContentSchema,
  generatedAt: z.string().trim().min(1),
  model: z.string().trim().min(1).nullable(),
  source: z.literal("api"),
});

export const brandBriefSummarySchema = z.object({
  archetypeGuidance: z.string().trim().min(24).max(1600),
  approvedAt: z.string().trim().min(1).optional(),
  audience: z.string().trim().min(20).max(1400),
  cohesionNotes: z.array(z.string().trim().min(8).max(360)).min(1).max(8),
  creativeDirection: z.string().trim().min(20).max(1400),
  generatedAt: z.string().trim().min(1),
  keyRequirements: z.array(z.string().trim().min(4).max(260)).min(1).max(10),
  overview: z.string().trim().min(24).max(1600),
  positioning: z.string().trim().min(20).max(1400),
  projectIntent: z.string().trim().min(20).max(1400),
  readiness: z.enum(["ready", "ready_with_suggestions"]),
  risksOrOpenQuestions: z.array(z.string().trim().min(4).max(360)).max(8),
  toneAndFeel: z.string().trim().min(20).max(1400),
});

export const overviewSectionReviewSchema = z.object({
  followUpQuestion: z.string().trim().min(8).max(300).optional(),
  quickRead: z.string().trim().min(20).max(900),
  suggestedRefinement: z.string().trim().min(20).max(1200).optional(),
  suggestions: z.array(z.string().trim().min(6).max(360)).max(8),
  verdict: z.enum(["looks_good", "needs_attention", "could_be_stronger"]),
  whatWorks: z.array(z.string().trim().min(6).max(360)).min(1).max(8),
});

const foundationQuestionHelpOptionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(2).max(80),
  rationale: z.string().trim().min(8).max(500),
  answer: z.string().trim().min(20).max(900),
});

const foundationQuestionHelpResultCoreSchema = z.object({
  intro: z.string().trim().min(12).max(900),
  options: z.array(foundationQuestionHelpOptionSchema).length(3),
  bestFit: z.object({
    rationale: z.string().trim().min(8).max(500),
    answer: z.string().trim().min(20).max(900),
  }),
  followUpQuestion: z.string().trim().min(8).max(300).optional(),
  model: z.string().trim().min(1),
  source: z.literal("api"),
});

export const foundationQuestionHelpRequestSchema = z.object({
  allAnswers: foundationAnswersSchema,
  blockId: foundationBlockIdSchema,
  blockTitle: z.string().trim().min(2).max(80),
  currentBlockAnswers: z.array(z.string().trim().max(1200)).max(8).default([]),
  currentAnswer: z.string().trim().max(1200),
  currentQuestionIndex: z.number().int().min(0).max(12),
  initialPrompt: z.string().trim().min(1).max(1200),
  previousAiSuggestions: z
    .array(
      z.object({
        intro: z.string().trim().min(1).max(900),
        options: z
          .array(
            foundationQuestionHelpOptionSchema,
          )
          .max(3),
        bestFit: z.object({
          rationale: z.string().trim().min(8).max(500),
          answer: z.string().trim().min(20).max(900),
        }),
        model: z.string().trim().min(1),
        followUpQuestion: z.string().trim().min(8).max(300).optional(),
        source: z.literal("api"),
      }),
    )
    .max(6)
    .default([]),
  projectUnderstanding: projectUnderstandingSchema,
  projectType: z.string().trim().min(2).max(80),
  questionId: z.string().trim().min(1).max(80),
  questionPrompt: z.string().trim().min(8).max(240),
  selectedChips: z.array(z.string().trim().min(2).max(40)).max(12).default([]),
  totalQuestions: z.number().int().min(1).max(12),
  userFollowUp: z.string().trim().max(900).optional(),
});

export const foundationQuestionHelpResultSchema =
  foundationQuestionHelpResultCoreSchema;

function parseJsonField(formData: FormData, fieldName: string) {
  const rawValue = formData.get(fieldName);
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return null;
  }

  return JSON.parse(rawValue);
}

export function parseFoundationAnswersField(formData: FormData) {
  const parsed = parseJsonField(formData, "foundation_answers");
  return parsed ? foundationAnswersSchema.parse(parsed) : null;
}

export function parsePromptAnalysisField(formData: FormData) {
  const parsed = parseJsonField(formData, "prompt_analysis");
  return parsed ? foundationQuestionSetSchema.parse(parsed) : null;
}

export function parseBrandBriefEditForm(formData: FormData) {
  return brandBriefContentSchema.parse({
    antiPatterns: splitLines(formData.get("antiPatterns")),
    audience: formData.get("audience"),
    brandPersonality: splitLines(formData.get("brandPersonality")),
    constraints: splitLines(formData.get("constraints")),
    emotionalDirection: formData.get("emotionalDirection"),
    functionalRequirements: splitLines(formData.get("functionalRequirements")),
    keyMessages: splitLines(formData.get("keyMessages")),
    nextQuestions: splitLines(formData.get("nextQuestions")),
    primaryGoal: formData.get("primaryGoal"),
    signatureMoment: formData.get("signatureMoment"),
    summary: formData.get("summary"),
  });
}

function splitLines(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
