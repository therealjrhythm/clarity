import { AiError, logAiError, toAiError } from "@/lib/ai/errors";
import { generateGeminiJson, getGeminiModel } from "@/lib/ai/gemini";
import {
  assertBrandBriefQuality,
  assertBrandBriefSummaryQuality,
  assertFoundationQuestionHelpQuality,
  assertFoundationQuestionSetQuality,
  assertOverviewSectionReviewQuality,
} from "@/lib/briefs/quality";
import type {
  BrandBriefResult,
  BrandBriefSummary,
  BriefProjectInput,
  FoundationAnswers,
  FoundationQuestionHelpRequest,
  FoundationQuestionHelpResult,
  FoundationQuestionSet,
  OverviewSectionReview,
  ProjectBrief,
} from "@/lib/briefs/types";
import {
  brandBriefResultSchema,
  brandBriefSummarySchema,
  foundationQuestionHelpResultSchema,
  foundationQuestionSetSchema,
  overviewSectionReviewSchema,
} from "@/lib/briefs/validators";

export type BriefAiState = {
  model: string;
  mode: "api";
  repaired: boolean;
};

type GenerateValidatedJsonOptions<T> = {
  actionName: string;
  maxOutputTokens: number;
  parse: (value: unknown, model: string) => T;
  prompt: string;
  quality: (value: T) => void;
  repairPrompt: string;
  temperature: number;
};

function stringifyForPrompt(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function asAiGenerationError(error: unknown) {
  const aiError = toAiError(error);

  if (
    aiError.code === "AI_UNKNOWN_ERROR" &&
    error instanceof Error &&
    error.message.startsWith("AI low quality response:")
  ) {
    return new AiError({
      cause: error,
      code: "AI_LOW_QUALITY_RESPONSE",
      message: error.message,
    });
  }

  if (aiError.code === "AI_UNKNOWN_ERROR") {
    return new AiError({
      cause: error,
      code: "AI_INVALID_RESPONSE",
      message:
        error instanceof Error
          ? error.message
          : "The AI response could not be validated.",
    });
  }

  return aiError;
}

async function generateValidatedJson<T>({
  actionName,
  maxOutputTokens,
  parse,
  prompt,
  quality,
  repairPrompt,
  temperature,
}: GenerateValidatedJsonOptions<T>) {
  const model = getGeminiModel();
  const attempts = [
    {
      label: "initial" as const,
      prompt,
      temperature,
    },
    {
      label: "repair" as const,
      prompt: repairPrompt,
      temperature: Math.max(0.1, temperature - 0.12),
    },
  ];

  for (const attempt of attempts) {
    try {
      const result = await generateGeminiJson<unknown>({
        maxOutputTokens,
        model,
        prompt: attempt.prompt,
        temperature: attempt.temperature,
      });
      const parsed = parse(result.value, result.model);
      quality(parsed);

      return {
        model: result.model,
        repaired: attempt.label === "repair",
        value: parsed,
      };
    } catch (error) {
      const aiError = asAiGenerationError(error);
      logAiError({
        action: actionName,
        attempt: attempt.label,
        error: aiError,
        model,
      });

      if (attempt.label === "repair") {
        throw aiError;
      }
    }
  }

  throw new AiError({
    code: "AI_UNKNOWN_ERROR",
    message: "AI generation failed.",
  });
}

function projectUnderstandingShape() {
  return `{
  "originalPrompt": "...",
  "normalizedPromptSummary": "...",
  "projectType": "landing page",
  "projectSubtype": "personal brand landing page",
  "userRole": "music producer",
  "businessType": "personal brand",
  "brandOrProjectName": "",
  "knownDetails": ["..."],
  "inferredButUnconfirmed": ["..."],
  "missingDetails": ["..."],
  "likelyGoals": ["..."],
  "likelyAudience": ["..."],
  "recommendedFoundationBlocks": ["Project Intent", "Audience", "Brand Feel", "Requirements"],
  "confidence": "low | medium | high"
}`;
}

function foundationQuestionSetShape() {
  return `{
  "projectUnderstanding": ${projectUnderstandingShape()},
  "blocks": [
    {
      "id": "intent",
      "title": "Project Intent",
      "detail": "What are we creating, and what should it accomplish?",
      "captured": "Project intent captured",
      "questions": [{"id": "intent-1", "prompt": "..."}],
      "chips": ["..."]
    },
    {
      "id": "audience",
      "title": "Audience",
      "detail": "Who is this for, and what do they need?",
      "captured": "Audience direction captured",
      "questions": [{"id": "audience-1", "prompt": "..."}],
      "chips": ["..."]
    },
    {
      "id": "feel",
      "title": "Brand Feel",
      "detail": "What should the project feel like?",
      "captured": "Brand feel captured",
      "questions": [{"id": "feel-1", "prompt": "..."}],
      "chips": ["..."]
    },
    {
      "id": "requirements",
      "title": "Requirements",
      "detail": "What needs to be included or avoided?",
      "captured": "Requirements captured",
      "questions": [{"id": "requirements-1", "prompt": "..."}],
      "chips": ["..."]
    }
  ],
  "generatedAt": "ISO timestamp",
  "keywords": ["..."],
  "projectType": "...",
  "source": "api",
  "suggestedName": "...",
  "summary": "..."
}`;
}

function foundationPrompt(prompt: string) {
  return `You are Clarity, a senior brand strategist, product strategist, UX strategist, and creative director.

Analyze the user's initial project prompt and return structured project understanding plus contextual Project Foundation questions.

Rules:
- Return JSON only.
- Use the user's actual prompt details. Do not reduce specific prompts into generic marketing language.
- If the user already says what they are building, do not ask "What are you building?".
- Keep exactly four blocks with ids: intent, audience, feel, requirements.
- Each block should have 1-3 concise questions.
- If the prompt does not clearly name the product, company, team, brand, or working project, the first Project Intent question must ask for that name in a context-aware way.
- Questions must be specific to the project type, user role, audience, and missing details.
- Do not generate a Brand Brief, palette, typography, references, layouts, code, exports, or websites.
- Avoid "deferred", "disabled", and "scaffold".
- Use source "api".
- Use ISO text for generatedAt.

For this example prompt:
"I am a music producer, and I need to design a landing page for my personal brand."
Valid understanding includes:
- projectType: landing page
- userRole: music producer
- businessType/purpose: personal brand
- missingDetails: brand/project name, primary audience, main CTA, music style/tone
- likelyGoals: introduce artist identity, showcase music, drive contact/bookings/collaboration/listens

Required JSON shape:
${foundationQuestionSetShape()}

User prompt:
${prompt}`;
}

function repairFoundationPrompt(prompt: string) {
  return `${foundationPrompt(prompt)}

The previous response was invalid or too generic. Repair it now:
- Include a complete projectUnderstanding object.
- Preserve the user's specific role, project type, and purpose.
- Reject generic "marketing project" language.
- Do not ask questions already answered by the prompt.
- Return only valid JSON in the required shape.`;
}

export async function generateFoundationQuestionSet(
  prompt: string,
): Promise<{ aiState: BriefAiState; data: FoundationQuestionSet }> {
  const result = await generateValidatedJson<FoundationQuestionSet>({
    actionName: "generateFoundationQuestionSet",
    maxOutputTokens: 4200,
    parse: (value) =>
      foundationQuestionSetSchema.parse({
        ...(value as Record<string, unknown>),
        generatedAt: new Date().toISOString(),
        source: "api",
      }),
    prompt: foundationPrompt(prompt),
    quality: (value) => assertFoundationQuestionSetQuality(value, prompt),
    repairPrompt: repairFoundationPrompt(prompt),
    temperature: 0.32,
  });

  return {
    aiState: {
      mode: "api",
      model: result.model,
      repaired: result.repaired,
    },
    data: result.value,
  };
}

function helpPrompt(request: FoundationQuestionHelpRequest) {
  return `You are Clarity, a senior creative strategy assistant helping the user answer one Foundation question for a real design project.

Your job is to produce answer options the user could actually place into the answer field.

Use all available context:
- original prompt
- structured project understanding
- current block
- current question
- current answer
- previous block answers
- current block answers
- selected chips
- previous AI suggestions
- user follow-up request

Rules:
- Return JSON only.
- Stay scoped to this one question. Do not answer other blocks.
- Be specific to the project type and prior answers.
- If key details are missing, offer realistic answer directions and ask one useful follow-up question.
- If userFollowUp is present, respond directly and refine/combine prior suggestions when helpful.
- Do not awkwardly repeat the original prompt.
- Do not write a full Brand Brief.
- Do not generate palette, typography, references, layouts, code, exports, or websites.
- Do not mention Gemini, APIs, prompts, implementation, or internal state.
- Return concise, field-ready answers.
- Avoid "deferred", "disabled", and "scaffold".
- Use source "api".

Required JSON shape:
{
  "intro": "Brief setup sentence.",
  "options": [
    {
      "id": "option_1",
      "label": "Short option label",
      "rationale": "Why this option fits.",
      "answer": "Field-ready answer text."
    },
    {
      "id": "option_2",
      "label": "Short option label",
      "rationale": "Why this option fits.",
      "answer": "Field-ready answer text."
    },
    {
      "id": "option_3",
      "label": "Short option label",
      "rationale": "Why this option fits.",
      "answer": "Field-ready answer text."
    }
  ],
  "bestFit": {
    "rationale": "Why this is the strongest answer.",
    "answer": "Field-ready answer text."
  },
  "followUpQuestion": "Optional useful question if more context would improve the answer.",
  "model": "${getGeminiModel()}",
  "source": "api"
}

Initial prompt:
${request.initialPrompt}

Project type:
${request.projectType}

Project understanding:
${stringifyForPrompt(request.projectUnderstanding)}

Foundation block:
${request.blockTitle}

Question ${request.currentQuestionIndex + 1} of ${request.totalQuestions}:
${request.questionPrompt}

Current answer:
${request.currentAnswer || "(empty)"}

Current block answers:
${stringifyForPrompt(request.currentBlockAnswers)}

Selected chips:
${stringifyForPrompt(request.selectedChips)}

Previous AI suggestions for this question:
${stringifyForPrompt(request.previousAiSuggestions)}

User follow-up request:
${request.userFollowUp || "(none)"}

All foundation answers:
${stringifyForPrompt(request.allAnswers)}`;
}

function repairHelpPrompt(request: FoundationQuestionHelpRequest) {
  return `${helpPrompt(request)}

The previous response was invalid or too generic. Repair it now:
- Return exactly 3 options and 1 best fit.
- Each answer must be field-ready, not advice.
- Include a rationale for every option and best fit.
- Avoid broken grammar and repeated project terms.
- Use the project understanding and previous answers.
- Return only valid JSON in the required shape.`;
}

export async function getFoundationQuestionHelp(
  request: FoundationQuestionHelpRequest,
): Promise<FoundationQuestionHelpResult> {
  const result = await generateValidatedJson<FoundationQuestionHelpResult>({
    actionName: "getFoundationQuestionHelp",
    maxOutputTokens: 3000,
    parse: (value, model) =>
      foundationQuestionHelpResultSchema.parse({
        ...(value as Record<string, unknown>),
        model,
        source: "api",
      }),
    prompt: helpPrompt(request),
    quality: (value) =>
      assertFoundationQuestionHelpQuality(value, {
        context: [
          request.initialPrompt,
          request.projectUnderstanding,
          request.currentBlockAnswers,
          request.selectedChips,
          request.allAnswers,
          request.previousAiSuggestions,
        ],
        projectType: request.projectType,
        questionPrompt: request.questionPrompt,
      }),
    repairPrompt: repairHelpPrompt(request),
    temperature: 0.4,
  });

  return result.value;
}

function brandBriefPrompt({
  foundationAnswers,
  project,
  promptAnalysis,
}: {
  foundationAnswers: FoundationAnswers;
  project: BriefProjectInput;
  promptAnalysis: FoundationQuestionSet;
}) {
  const requestedModel = getGeminiModel();

  return `You are Clarity, a senior brand strategist, product strategist, UX strategist, and creative director.

Synthesize the completed Project Foundation answers into a structured Brand Brief.

Rules:
- Return JSON only.
- This is the Brand Brief only. Do not generate palettes, typography systems, references, layouts, code, exports, or websites.
- Use the project understanding and foundation answers. Do not invent unrelated details.
- Be specific to the user's intent and answers.
- Use confident creative strategy language, not generic SaaS or marketing filler.
- Avoid "deferred", "disabled", and "scaffold".
- Set source to "api".
- Set model to "${requestedModel}".

Required JSON shape:
{
  "brief": {
    "antiPatterns": ["..."],
    "audience": "...",
    "brandPersonality": ["..."],
    "constraints": ["..."],
    "emotionalDirection": "...",
    "functionalRequirements": ["..."],
    "keyMessages": ["..."],
    "nextQuestions": ["..."],
    "primaryGoal": "...",
    "signatureMoment": "...",
    "summary": "..."
  },
  "generatedAt": "ISO timestamp",
  "model": "${requestedModel}",
  "source": "api"
}

Project:
${stringifyForPrompt(project)}

Project understanding and prompt analysis:
${stringifyForPrompt(promptAnalysis)}

Foundation answers:
${stringifyForPrompt(foundationAnswers)}`;
}

function repairBrandBriefPrompt(input: {
  foundationAnswers: FoundationAnswers;
  project: BriefProjectInput;
  promptAnalysis: FoundationQuestionSet;
}) {
  return `${brandBriefPrompt(input)}

The previous response was invalid or too generic. Repair it now:
- Ground the brief in the project type, user role, audience, and foundation answers.
- Do not use generic "professional and modern" filler.
- Return every required Brand Brief field.
- Return only valid JSON in the required shape.`;
}

function requiredBriefTerms(promptAnalysis: FoundationQuestionSet) {
  const understanding = promptAnalysis.projectUnderstanding;
  return Array.from(
    new Set(
      [
        ...promptAnalysis.keywords,
        understanding.projectType,
        understanding.userRole,
        understanding.businessType,
        ...understanding.knownDetails,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3),
    ),
  ).slice(0, 8);
}

export async function synthesizeBrandBrief({
  foundationAnswers,
  project,
  promptAnalysis,
}: {
  foundationAnswers: FoundationAnswers;
  project: BriefProjectInput;
  promptAnalysis: FoundationQuestionSet;
}): Promise<{ aiState: BriefAiState; data: BrandBriefResult }> {
  const promptInput = { foundationAnswers, project, promptAnalysis };
  const result = await generateValidatedJson<BrandBriefResult>({
    actionName: "synthesizeBrandBrief",
    maxOutputTokens: 5600,
    parse: (value, model) =>
      brandBriefResultSchema.parse({
        ...(value as Record<string, unknown>),
        generatedAt: new Date().toISOString(),
        model,
        source: "api",
      }),
    prompt: brandBriefPrompt(promptInput),
    quality: (value) =>
      assertBrandBriefQuality(value, {
        projectType: promptAnalysis.projectUnderstanding.projectType,
        requiredTerms: requiredBriefTerms(promptAnalysis),
      }),
    repairPrompt: repairBrandBriefPrompt(promptInput),
    temperature: 0.46,
  });

  return {
    aiState: {
      mode: "api",
      model: result.model,
      repaired: result.repaired,
    },
    data: result.value,
  };
}

function brandBriefSummaryPrompt({
  project,
  projectBrief,
  previousSummary,
}: {
  previousSummary?: BrandBriefSummary | null;
  project: BriefProjectInput;
  projectBrief: ProjectBrief;
}) {
  return `You are Clarity, a senior brand strategist and creative director.

Prepare a read-only Brand Brief Summary / Final Check before the user moves into Brand Archetype.

Rules:
- Return JSON only.
- Summarize what Clarity understands so far.
- Use the original prompt, project understanding, foundation answers, and saved Brand Brief.
- Do not create a full design system, palette, typography system, layout, code, or archetype recommendations.
- Do not mention Gemini, APIs, prompts, implementation, or internal state.
- Be specific, cohesive, and useful for the next archetype step.
- If context is imperfect, use risksOrOpenQuestions instead of inventing facts.

Required JSON shape:
{
  "overview": "...",
  "projectIntent": "...",
  "audience": "...",
  "positioning": "...",
  "toneAndFeel": "...",
  "keyRequirements": ["..."],
  "creativeDirection": "...",
  "cohesionNotes": ["..."],
  "risksOrOpenQuestions": ["..."],
  "archetypeGuidance": "...",
  "readiness": "ready | ready_with_suggestions",
  "generatedAt": "ISO timestamp"
}

Project:
${stringifyForPrompt(project)}

Prompt analysis:
${stringifyForPrompt(projectBrief.prompt_analysis)}

Foundation answers:
${stringifyForPrompt(projectBrief.foundation_answers)}

Saved Brand Brief:
${stringifyForPrompt(projectBrief.brief)}

Previous summary, if regenerating:
${stringifyForPrompt(previousSummary || null)}`;
}

function repairBrandBriefSummaryPrompt(input: {
  previousSummary?: BrandBriefSummary | null;
  project: BriefProjectInput;
  projectBrief: ProjectBrief;
}) {
  return `${brandBriefSummaryPrompt(input)}

The previous response was invalid, generic, or did not connect the brief to the next archetype step. Repair it now:
- Include every required section.
- Ground the summary in the saved Brand Brief and foundation answers.
- Include useful archetype guidance without generating archetype recommendations.
- Return only valid JSON in the required shape.`;
}

export async function generateBrandBriefSummary({
  previousSummary,
  project,
  projectBrief,
}: {
  previousSummary?: BrandBriefSummary | null;
  project: BriefProjectInput;
  projectBrief: ProjectBrief;
}): Promise<{ aiState: BriefAiState; data: BrandBriefSummary }> {
  const promptInput = { previousSummary, project, projectBrief };
  const result = await generateValidatedJson<BrandBriefSummary>({
    actionName: "generateBrandBriefSummary",
    maxOutputTokens: 4200,
    parse: (value) =>
      brandBriefSummarySchema.parse({
        ...(value as Record<string, unknown>),
        generatedAt: new Date().toISOString(),
      }),
    prompt: brandBriefSummaryPrompt(promptInput),
    quality: (value) =>
      assertBrandBriefSummaryQuality(value, {
        context: [
          project,
          projectBrief.prompt_analysis,
          projectBrief.foundation_answers,
          projectBrief.brief,
        ],
      }),
    repairPrompt: repairBrandBriefSummaryPrompt(promptInput),
    temperature: 0.38,
  });

  return {
    aiState: {
      mode: "api",
      model: result.model,
      repaired: result.repaired,
    },
    data: result.value,
  };
}

export type OverviewSectionReviewInput = {
  followUp?: string;
  sectionContent: string;
  sectionId: string;
  sectionTitle: string;
};

function overviewSectionReviewPrompt({
  input,
  project,
  projectBrief,
}: {
  input: OverviewSectionReviewInput;
  project: BriefProjectInput;
  projectBrief: ProjectBrief | null;
}) {
  return `You are Clarity, a senior creative strategy reviewer.

Review one section of the project Overview Board. Give concise feedback only. Do not edit or overwrite saved content.

Rules:
- Return JSON only.
- Stay scoped to the active section while using surrounding project context.
- Be project-specific and practical.
- Do not write a full Brand Brief.
- Do not generate archetype recommendations, palette, typography, layouts, code, exports, or websites.
- Do not mention Gemini, APIs, prompts, implementation, or internal state.
- If the section looks good, say so and include one useful way it could become sharper.

Required JSON shape:
{
  "verdict": "looks_good | needs_attention | could_be_stronger",
  "quickRead": "...",
  "whatWorks": ["..."],
  "suggestions": ["..."],
  "suggestedRefinement": "...",
  "followUpQuestion": "..."
}

Project:
${stringifyForPrompt(project)}

Project context:
${stringifyForPrompt(projectBrief)}

Active section:
${stringifyForPrompt(input)}`;
}

function repairOverviewSectionReviewPrompt(input: {
  input: OverviewSectionReviewInput;
  project: BriefProjectInput;
  projectBrief: ProjectBrief | null;
}) {
  return `${overviewSectionReviewPrompt(input)}

The previous response was invalid or too generic. Repair it now:
- Reference the active section content.
- Reference the project context.
- Keep it concise and review-focused.
- Return only valid JSON in the required shape.`;
}

export async function reviewOverviewSection({
  input,
  project,
  projectBrief,
}: {
  input: OverviewSectionReviewInput;
  project: BriefProjectInput;
  projectBrief: ProjectBrief | null;
}): Promise<OverviewSectionReview> {
  const promptInput = { input, project, projectBrief };
  const result = await generateValidatedJson<OverviewSectionReview>({
    actionName: "reviewOverviewSection",
    maxOutputTokens: 2600,
    parse: (value) =>
      overviewSectionReviewSchema.parse(value),
    prompt: overviewSectionReviewPrompt(promptInput),
    quality: (value) =>
      assertOverviewSectionReviewQuality(value, {
        context: [project, projectBrief],
        sectionContent: input.sectionContent,
      }),
    repairPrompt: repairOverviewSectionReviewPrompt(promptInput),
    temperature: 0.34,
  });

  return result.value;
}
