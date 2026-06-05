import type { ProjectBrief } from "@/lib/briefs/types";

export type BriefWorkflowStage =
  | "brief_complete"
  | "brief_in_review"
  | "brief_ready"
  | "final_check";

export function getBriefWorkflowStage(
  projectBrief: ProjectBrief | null,
): BriefWorkflowStage {
  if (projectBrief?.brand_brief_summary_status === "approved") {
    return "brief_complete";
  }

  if (projectBrief?.brand_brief_summary) {
    return "final_check";
  }

  if (projectBrief?.brief) {
    return "brief_in_review";
  }

  return "brief_ready";
}

export function isBrandBriefApproved(projectBrief: ProjectBrief | null) {
  return getBriefWorkflowStage(projectBrief) === "brief_complete";
}

export function getBriefStatusLabel(projectBrief: ProjectBrief | null) {
  const stage = getBriefWorkflowStage(projectBrief);

  if (stage === "brief_complete") {
    return "Complete";
  }

  if (stage === "final_check") {
    return "Final check";
  }

  if (stage === "brief_in_review") {
    return "In review";
  }

  return "Ready";
}

export function getArchetypeStatusLabel(projectBrief: ProjectBrief | null) {
  return isBrandBriefApproved(projectBrief) ? "Ready" : "Upcoming";
}
