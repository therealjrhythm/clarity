import type { BriefAiState } from "@/lib/briefs/ai";
import type { BrandBriefContent } from "@/lib/briefs/types";

export type BriefActionState = {
  brief?: BrandBriefContent;
  generatedAt?: string | null;
  message?: string;
  mode?: BriefAiState["mode"];
  model?: string | null;
  status: "idle" | "success" | "error";
};

export const initialBriefActionState: BriefActionState = {
  status: "idle",
};
