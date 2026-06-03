export type AIProvider = "openai" | "anthropic" | "google";

export type AIModelOption = {
  id: string;
  label: string;
  provider: AIProvider;
  strengths: string[];
  recommendedFor?: string[];
  enabled: boolean;
};

export const AI_MODEL_OPTIONS: AIModelOption[] = [
  {
    id: "gemini-3-5-flash",
    label: "Gemini 3.5 Flash",
    provider: "google",
    strengths: ["fast ideation", "lightweight generation", "cost-efficient drafts"],
    recommendedFor: ["quick direction", "early project shaping"],
    enabled: true,
  },
  {
    id: "claude-opus-4-8",
    label: "Claude Opus 4.8",
    provider: "anthropic",
    strengths: ["deep creative direction", "brand reasoning", "long-form design analysis"],
    recommendedFor: ["brand strategy", "DESIGN.md planning"],
    enabled: true,
  },
  {
    id: "claude-opus-4-7",
    label: "Claude Opus 4.7",
    provider: "anthropic",
    strengths: ["strategic reasoning", "complex design-system writing"],
    recommendedFor: ["system direction", "creative critique"],
    enabled: true,
  },
  {
    id: "claude-sonnet-latest",
    label: "Claude Sonnet Latest",
    provider: "anthropic",
    strengths: ["balanced speed and quality", "UI copy", "structured design generation"],
    recommendedFor: ["workspace assistance", "copy and structure"],
    enabled: true,
  },
  {
    id: "gpt-5-5",
    label: "GPT-5.5",
    provider: "openai",
    strengths: [
      "high-quality creative reasoning",
      "design-system generation",
      "code-aware interface planning",
    ],
    recommendedFor: ["interface planning", "code-aware direction"],
    enabled: true,
  },
];

export const DEFAULT_AI_MODEL_OPTION_ID = "gemini-3-5-flash";
