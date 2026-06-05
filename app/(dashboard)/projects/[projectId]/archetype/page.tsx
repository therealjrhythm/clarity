import { BrandArchetypeShell } from "@/components/projects/brand-archetype-shell";
import { requireUser } from "@/lib/auth/require-user";
import { getProjectBrief } from "@/lib/briefs/queries";
import { requireOwnedProject } from "@/lib/projects/ownership";

export default async function ProjectArchetypePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const project = await requireOwnedProject(projectId, user.id);
  const projectBrief = await getProjectBrief(projectId, user.id);

  return <BrandArchetypeShell project={project} projectBrief={projectBrief} />;
}
