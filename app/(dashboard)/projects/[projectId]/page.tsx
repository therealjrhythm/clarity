import { ProjectFocusView } from "@/components/projects/project-focus-view";
import { ProjectOverviewBoard } from "@/components/projects/project-overview-board";
import { requireUser } from "@/lib/auth/require-user";
import { getProjectBrief } from "@/lib/briefs/queries";
import { requireOwnedProject } from "@/lib/projects/ownership";

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<{ view?: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const project = await requireOwnedProject(projectId, user.id);
  const projectBrief = await getProjectBrief(projectId, user.id);

  if (resolvedSearchParams.view === "overview") {
    return <ProjectOverviewBoard project={project} projectBrief={projectBrief} />;
  }

  return <ProjectFocusView project={project} projectBrief={projectBrief} />;
}
