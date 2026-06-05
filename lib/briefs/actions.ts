"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import {
  generateBrandBriefSummary,
  generateFoundationQuestionSet,
  getFoundationQuestionHelp,
  reviewOverviewSection,
  synthesizeBrandBrief,
  type OverviewSectionReviewInput,
} from "@/lib/briefs/ai";
import { getPublicAiError, type PublicAiError } from "@/lib/ai/errors";
import type { BriefActionState } from "@/lib/briefs/action-state";
import { getProjectBrief } from "@/lib/briefs/queries";
import { isProjectBriefsStorageMissing } from "@/lib/briefs/storage-errors";
import type {
  BrandBriefContent,
  BrandBriefSummary,
  FoundationAnswers,
  FoundationQuestionHelpRequest,
  FoundationQuestionHelpResult,
  FoundationQuestionSet,
  OverviewSectionReview,
} from "@/lib/briefs/types";
import {
  brandBriefContentSchema,
  foundationQuestionHelpRequestSchema,
  parseBrandBriefEditForm,
} from "@/lib/briefs/validators";
import { requireOwnedProject } from "@/lib/projects/ownership";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export type FoundationQuestionsActionResult =
  | {
      aiState: Awaited<ReturnType<typeof generateFoundationQuestionSet>>["aiState"];
      data: FoundationQuestionSet;
      ok: true;
    }
  | {
      error: PublicAiError;
      ok: false;
    };
export type FoundationQuestionHelpActionResult =
  | {
      data: FoundationQuestionHelpResult;
      ok: true;
    }
  | {
      error: PublicAiError;
      ok: false;
	    };

export type OverviewSectionReviewActionResult =
  | {
      data: OverviewSectionReview;
      ok: true;
    }
  | {
      error: PublicAiError;
      ok: false;
    };

function json(value: unknown): Json {
  return value as Json;
}

function emptyFoundationAnswers(): FoundationAnswers {
  return {
    audience: [],
    feel: [],
    intent: [],
    requirements: [],
  };
}

function summaryForBrief(brief: BrandBriefContent) {
  return brief.summary.slice(0, 1200);
}

function clearBrandBriefSummary(aiState: Record<string, unknown>) {
  const {
    brandBriefSummary,
    brandBriefSummaryApprovedAt,
    brandBriefSummaryGeneratedAt,
    brandBriefSummaryStatus,
    ...rest
  } = aiState;

  void brandBriefSummary;
  void brandBriefSummaryApprovedAt;
  void brandBriefSummaryGeneratedAt;
  void brandBriefSummaryStatus;

  return rest;
}

function setBrandBriefSummaryState({
  aiState,
  status,
  summary,
}: {
  aiState: Record<string, unknown>;
  status: "approved" | "final_check";
  summary: BrandBriefSummary;
}) {
  return {
    ...aiState,
    brandBriefSummary: summary,
    brandBriefSummaryApprovedAt: summary.approvedAt || null,
    brandBriefSummaryGeneratedAt: summary.generatedAt,
    brandBriefSummaryStatus: status,
  };
}

function storageNotReadyMessage() {
  return "Brand Brief storage is not ready. Apply the Phase 2 project_briefs migration, then try again.";
}

function isNextRedirect(error: unknown) {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false;
  }

  return String((error as { digest?: unknown }).digest).startsWith(
    "NEXT_REDIRECT",
  );
}

export async function generateFoundationQuestionsAction(prompt: string) {
  await requireUser();
  try {
    const result = await generateFoundationQuestionSet(prompt);
    return {
      ...result,
      ok: true,
    } satisfies FoundationQuestionsActionResult;
  } catch (error) {
    return {
      error: getPublicAiError(error),
      ok: false,
    } satisfies FoundationQuestionsActionResult;
  }
}

export async function getFoundationQuestionHelpAction(
  request: FoundationQuestionHelpRequest,
) {
  await requireUser();
  try {
    const parsed = foundationQuestionHelpRequestSchema.parse(request);
    const result = await getFoundationQuestionHelp(parsed);
    return {
      data: result,
      ok: true,
    } satisfies FoundationQuestionHelpActionResult;
  } catch (error) {
    return {
      error: getPublicAiError(error),
      ok: false,
    } satisfies FoundationQuestionHelpActionResult;
  }
}

export async function generateBrandBriefAction(
  projectId: string,
  previousState: BriefActionState,
  formData: FormData,
): Promise<BriefActionState> {
  void previousState;
  void formData;

  try {
    const user = await requireUser();
    const project = await requireOwnedProject(projectId, user.id);
    const existingBrief = await getProjectBrief(projectId, user.id);
    const foundationAnswers =
      existingBrief?.foundation_answers || emptyFoundationAnswers();
    const promptAnalysis = existingBrief?.prompt_analysis?.projectUnderstanding
      ? existingBrief.prompt_analysis
      : (
          await generateFoundationQuestionSet(
            project.description || `${project.name} ${project.type}`,
          )
        ).data;
    const { aiState, data } = await synthesizeBrandBrief({
      foundationAnswers,
      project: {
        description: project.description,
        name: project.name,
        type: project.type,
      },
      promptAnalysis,
    });
    const supabase = await createClient();

	    const { error } = await supabase.from("project_briefs").upsert(
	      {
	        ai_state: json({
	          ...clearBrandBriefSummary(existingBrief?.ai_state || {}),
	          brief: aiState,
	          lastGeneratedAt: data.generatedAt,
	        }),
        brief: json(data.brief),
        foundation_answers: json(foundationAnswers),
        generated_at: data.generatedAt,
        model: data.model,
        project_id: projectId,
        prompt_analysis: json(promptAnalysis),
        status: "generated",
        summary: summaryForBrief(data.brief),
      },
      { onConflict: "project_id" },
    );

	    if (error) {
	      if (isProjectBriefsStorageMissing(error)) {
	        throw new Error(storageNotReadyMessage());
	      }

      throw new Error(error.message);
    }

    const { error: projectError } = await supabase
      .from("projects")
      .update({ status: "briefing" })
      .eq("id", projectId)
      .eq("owner_id", user.id);

    if (projectError) {
      throw new Error(projectError.message);
    }

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath("/dashboard");

    return {
      brief: data.brief,
      generatedAt: data.generatedAt,
      message:
        aiState.repaired
          ? "Brand Brief generated after Clarity refined the AI response."
          : "Brand Brief generated.",
      mode: aiState.mode,
      model: data.model,
      status: "success",
    };
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    const publicError = getPublicAiError(error);
    return {
      message:
        error instanceof Error &&
        error.message.includes("Brand Brief storage is not ready")
          ? error.message
          : publicError.message,
      status: "error",
    };
  }
}

export async function regenerateBrandBriefAction(
  projectId: string,
  previousState: BriefActionState,
  formData: FormData,
) {
  return generateBrandBriefAction(projectId, previousState, formData);
}

export async function saveBrandBriefAction(
  projectId: string,
  _previousState: BriefActionState,
  formData: FormData,
): Promise<BriefActionState> {
  try {
    const user = await requireUser();
    await requireOwnedProject(projectId, user.id);
    const payload = parseBrandBriefEditForm(formData);
    const parsed = brandBriefContentSchema.parse(payload);
    const current = await getProjectBrief(projectId, user.id);
    const supabase = await createClient();

    const { error } = await supabase.from("project_briefs").upsert(
      {
        ai_state: json({
          ...clearBrandBriefSummary(current?.ai_state || {}),
          lastEditedAt: new Date().toISOString(),
        }),
        brief: json(parsed),
        foundation_answers: json(
          current?.foundation_answers || emptyFoundationAnswers(),
        ),
        generated_at: current?.generated_at || new Date().toISOString(),
        model: current?.model,
        project_id: projectId,
        prompt_analysis: json(current?.prompt_analysis || {}),
        status: "edited",
        summary: summaryForBrief(parsed),
      },
      { onConflict: "project_id" },
    );

    if (error) {
      if (isProjectBriefsStorageMissing(error)) {
        throw new Error(storageNotReadyMessage());
      }

      throw new Error(error.message);
    }

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/brief`);

    return {
      brief: parsed,
      generatedAt: current?.generated_at,
      message: "Brand Brief saved.",
      mode: "api",
      model: current?.model,
      status: "success",
    };
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Clarity could not save the Brand Brief.",
      status: "error",
    };
  }
}

export async function generateBrandBriefSummaryAction(
  projectId: string,
  previousState: BriefActionState,
  formData: FormData,
): Promise<BriefActionState> {
  void previousState;

  try {
    const forceRegenerate = formData.get("regenerate") === "true";
    const user = await requireUser();
    const project = await requireOwnedProject(projectId, user.id);
    const current = await getProjectBrief(projectId, user.id);

    if (!current?.brief) {
      return {
        message: "Generate a Brand Brief before starting the final check.",
        status: "error",
      };
    }

    if (
      current.brand_brief_summary &&
      current.brand_brief_summary_status !== "approved" &&
      !forceRegenerate
    ) {
      redirect(`/projects/${projectId}/brief/summary`);
    }

    const { aiState, data } = await generateBrandBriefSummary({
      previousSummary: current.brand_brief_summary,
      project: {
        description: project.description,
        name: project.name,
        type: project.type,
      },
      projectBrief: current,
    });
    const supabase = await createClient();
    const nextAiState = setBrandBriefSummaryState({
      aiState: {
        ...(current.ai_state || {}),
        brandBriefSummaryGeneration: aiState,
      },
      status: "final_check",
      summary: data,
    });

    const { error } = await supabase
      .from("project_briefs")
      .update({
        ai_state: json(nextAiState),
      })
      .eq("project_id", projectId);

    if (error) {
      if (isProjectBriefsStorageMissing(error)) {
        throw new Error(storageNotReadyMessage());
      }

      throw new Error(error.message);
    }

    revalidatePath(`/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}/brief`);
    revalidatePath(`/projects/${projectId}/brief/summary`);
    revalidatePath(`/projects/${projectId}?view=overview`);

    redirect(`/projects/${projectId}/brief/summary`);
	  } catch (error) {
	    if (isNextRedirect(error)) {
	      throw error;
	    }

	    const publicError = getPublicAiError(error);
    return {
      message:
        error instanceof Error &&
        error.message.includes("Brand Brief storage is not ready")
          ? error.message
          : publicError.message,
      status: "error",
    };
  }
}

export async function approveBrandBriefSummaryAction(
  projectId: string,
  formData?: FormData,
) {
  void formData;
  const user = await requireUser();
  const project = await requireOwnedProject(projectId, user.id);
  const current = await getProjectBrief(projectId, user.id);

  if (!current?.brand_brief_summary) {
    redirect(`/projects/${projectId}/brief`);
  }

  const approvedAt = new Date().toISOString();
  const approvedSummary = {
    ...current.brand_brief_summary,
    approvedAt,
  };
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_briefs")
    .update({
      ai_state: json(
        setBrandBriefSummaryState({
          aiState: current.ai_state || {},
          status: "approved",
          summary: approvedSummary,
        }),
      ),
    })
    .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: projectError } = await supabase
    .from("projects")
    .update({ status: "visual_direction" })
    .eq("id", project.id)
    .eq("owner_id", user.id);

  if (projectError) {
    throw new Error(projectError.message);
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/brief`);
  revalidatePath(`/projects/${projectId}/brief/summary`);
  revalidatePath(`/projects/${projectId}/archetype`);
  revalidatePath(`/projects/${projectId}?view=overview`);

  redirect(`/projects/${projectId}/archetype`);
}

export async function reviewOverviewSectionAction(
  projectId: string,
  input: OverviewSectionReviewInput,
): Promise<OverviewSectionReviewActionResult> {
  try {
    const user = await requireUser();
    const project = await requireOwnedProject(projectId, user.id);
    const projectBrief = await getProjectBrief(projectId, user.id);
    const result = await reviewOverviewSection({
      input,
      project: {
        description: project.description,
        name: project.name,
        type: project.type,
      },
      projectBrief,
    });

    return {
      data: result,
      ok: true,
    };
  } catch (error) {
    return {
      error: getPublicAiError(error),
      ok: false,
    };
  }
}
