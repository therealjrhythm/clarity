import { notFound } from "next/navigation";
import { getOwnedProject } from "@/lib/projects/queries";

export async function requireOwnedProject(projectId: string, userId: string) {
  const project = await getOwnedProject(projectId, userId);

  if (!project) {
    notFound();
  }

  return project;
}
