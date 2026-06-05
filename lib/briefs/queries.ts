import { requireOwnedProject } from "@/lib/projects/ownership";
import { createClient } from "@/lib/supabase/server";
import { isProjectBriefsStorageMissing } from "@/lib/briefs/storage-errors";
import type { Database } from "@/types/database";
import type { ProjectBrief } from "@/lib/briefs/types";
import {
  brandBriefContentSchema,
  brandBriefSummarySchema,
  foundationAnswersSchema,
  foundationQuestionSetSchema,
} from "@/lib/briefs/validators";

type ProjectBriefRow = Database["public"]["Tables"]["project_briefs"]["Row"];

function objectFromJson(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function normalizeProjectBrief(row: ProjectBriefRow): ProjectBrief {
  const foundationAnswers = foundationAnswersSchema.safeParse(
    row.foundation_answers,
  );
  const promptAnalysis = foundationQuestionSetSchema.safeParse(
    row.prompt_analysis,
  );
  const brief = brandBriefContentSchema.safeParse(row.brief);
  const aiState = objectFromJson(row.ai_state);
  const brandBriefSummary = brandBriefSummarySchema.safeParse(
    aiState.brandBriefSummary,
  );
  const brandBriefSummaryStatus =
    aiState.brandBriefSummaryStatus === "approved" ||
    aiState.brandBriefSummaryStatus === "final_check"
      ? aiState.brandBriefSummaryStatus
      : null;

  return {
    ai_state: aiState,
    brief: brief.success ? brief.data : null,
    brand_brief_summary: brandBriefSummary.success
      ? brandBriefSummary.data
      : null,
    brand_brief_summary_status: brandBriefSummary.success
      ? brandBriefSummaryStatus
      : null,
    created_at: row.created_at,
    foundation_answers: foundationAnswers.success
      ? foundationAnswers.data
      : null,
    generated_at: row.generated_at,
    id: row.id,
    model: row.model,
    project_id: row.project_id,
    prompt_analysis: promptAnalysis.success ? promptAnalysis.data : null,
    status: row.status,
    summary: row.summary,
    updated_at: row.updated_at,
  };
}

export async function getProjectBrief(projectId: string, userId: string) {
  await requireOwnedProject(projectId, userId);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_briefs")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) {
    if (isProjectBriefsStorageMissing(error)) {
      return null;
    }

    throw new Error(error.message);
  }

  return data ? normalizeProjectBrief(data) : null;
}
