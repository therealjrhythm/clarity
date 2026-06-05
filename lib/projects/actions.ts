"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { parseProjectForm } from "@/lib/projects/validators";
import { requireOwnedProject } from "@/lib/projects/ownership";
import {
  parseFoundationAnswersField,
  parsePromptAnalysisField,
} from "@/lib/briefs/validators";
import { isProjectBriefsStorageMissing } from "@/lib/briefs/storage-errors";
import type { Json } from "@/types/database";

function json(value: unknown): Json {
  return value as Json;
}

export async function createProject(formData: FormData) {
  const user = await requireUser();
  const payload = parseProjectForm(formData);
  const foundationAnswers = parseFoundationAnswersField(formData);
  const promptAnalysis = parsePromptAnalysisField(formData);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: user.id,
      name: payload.name,
      type: payload.type,
      description: payload.description,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (foundationAnswers) {
    const { error: briefError } = await supabase.from("project_briefs").insert({
      ai_state: json({
        foundation: {
          source: promptAnalysis?.source || "api",
        },
      }),
      foundation_answers: json(foundationAnswers),
      project_id: data.id,
      prompt_analysis: json(promptAnalysis || {}),
      status: "draft",
      summary: promptAnalysis?.summary || payload.description,
    });

    if (briefError && !isProjectBriefsStorageMissing(briefError)) {
      throw new Error(briefError.message);
    }
  }

  revalidatePath("/dashboard");
  redirect(`/projects/${data.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  const user = await requireUser();
  await requireOwnedProject(projectId, user.id);
  const payload = parseProjectForm(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      name: payload.name,
      type: payload.type,
      description: payload.description,
    })
    .eq("id", projectId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function archiveProject(projectId: string) {
  const user = await requireUser();
  await requireOwnedProject(projectId, user.id);
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function archiveProjectFromForm(formData: FormData) {
  const projectId = String(formData.get("projectId") || "").trim();

  if (!projectId) {
    throw new Error("Project id is required.");
  }

  await archiveProject(projectId);
}
