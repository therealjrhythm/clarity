export type FoundationBlockId = "intent" | "audience" | "feel" | "requirements";

export type FoundationQuestion = {
  id: string;
  prompt: string;
  semantic?: "projectName";
};

export type FoundationQuestionBlock = {
  id: FoundationBlockId;
  title: string;
  detail: string;
  captured: string;
  questions: FoundationQuestion[];
  chips: string[];
};

export type FoundationAnswers = Record<FoundationBlockId, string[]>;

export type FoundationQuestionSet = {
  blocks: FoundationQuestionBlock[];
  generatedAt: string;
  keywords: string[];
  projectUnderstanding: ProjectUnderstanding;
  projectType: string;
  source: "api";
  suggestedName: string;
  summary: string;
};

export type ProjectUnderstanding = {
  brandOrProjectName?: string;
  businessType?: string;
  confidence: "high" | "low" | "medium";
  inferredButUnconfirmed: string[];
  knownDetails: string[];
  likelyAudience: string[];
  likelyGoals: string[];
  missingDetails: string[];
  normalizedPromptSummary: string;
  originalPrompt: string;
  projectSubtype?: string;
  projectType: string;
  recommendedFoundationBlocks: string[];
  userRole?: string;
};

export type FoundationQuestionHelpRequest = {
  allAnswers: FoundationAnswers;
  blockId: FoundationBlockId;
  blockTitle: string;
  currentBlockAnswers: string[];
  currentAnswer: string;
  currentQuestionIndex: number;
  initialPrompt: string;
  previousAiSuggestions: FoundationQuestionHelpResult[];
  projectUnderstanding: ProjectUnderstanding;
  projectType: string;
  questionId: string;
  questionPrompt: string;
  selectedChips: string[];
  totalQuestions: number;
  userFollowUp?: string;
};

export type FoundationQuestionHelpOption = {
  id: string;
  label: string;
  rationale: string;
  answer: string;
};

export type FoundationQuestionHelpResult = {
  intro: string;
  options: FoundationQuestionHelpOption[];
  bestFit: {
    rationale: string;
    answer: string;
  };
  followUpQuestion?: string;
  model: string;
  source: "api";
};

export type BrandBriefContent = {
  antiPatterns: string[];
  audience: string;
  brandPersonality: string[];
  constraints: string[];
  emotionalDirection: string;
  functionalRequirements: string[];
  keyMessages: string[];
  nextQuestions: string[];
  primaryGoal: string;
  signatureMoment: string;
  summary: string;
};

export type BrandBriefResult = {
  brief: BrandBriefContent;
  generatedAt: string;
  model: string | null;
  source: "api";
};

export type BrandBriefSummary = {
  archetypeGuidance: string;
  approvedAt?: string;
  audience: string;
  cohesionNotes: string[];
  creativeDirection: string;
  generatedAt: string;
  keyRequirements: string[];
  overview: string;
  positioning: string;
  projectIntent: string;
  readiness: "ready" | "ready_with_suggestions";
  risksOrOpenQuestions: string[];
  toneAndFeel: string;
};

export type OverviewSectionReview = {
  followUpQuestion?: string;
  quickRead: string;
  suggestedRefinement?: string;
  suggestions: string[];
  verdict: "could_be_stronger" | "looks_good" | "needs_attention";
  whatWorks: string[];
};

export type ProjectBriefStatus = "draft" | "generated" | "edited";

export type ProjectBrief = {
  id: string;
  project_id: string;
  foundation_answers: FoundationAnswers | null;
  prompt_analysis: FoundationQuestionSet | null;
  brief: BrandBriefContent | null;
  summary: string | null;
  brand_brief_summary: BrandBriefSummary | null;
  brand_brief_summary_status: "approved" | "final_check" | null;
  status: ProjectBriefStatus;
  model: string | null;
  ai_state: Record<string, unknown>;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BriefProjectInput = {
  description: string | null;
  name: string;
  type: string;
};
