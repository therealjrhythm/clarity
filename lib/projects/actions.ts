"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import { parseProjectForm } from "@/lib/projects/validators";
import { requireOwnedProject } from "@/lib/projects/ownership";

export async function createProject(formData: FormData) {
  const user = await requireUser();
  const payload = parseProjectForm(formData);
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
