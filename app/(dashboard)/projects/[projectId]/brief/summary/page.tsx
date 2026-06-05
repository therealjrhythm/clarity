import { BrandBriefSummaryWorkspace } from "@/components/brief/brand-brief-summary-workspace";
import { requireUser } from "@/lib/auth/require-user";
import {
  approveBrandBriefSummaryAction,
  generateBrandBriefSummaryAction,
} from "@/lib/briefs/actions";
import { getProjectBrief } from "@/lib/briefs/queries";
import { requireOwnedProject } from "@/lib/projects/ownership";

export default async function ProjectBriefSummaryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const project = await requireOwnedProject(projectId, user.id);
  const projectBrief = await getProjectBrief(projectId, user.id);

  return (
    <BrandBriefSummaryWorkspace
      approveAction={approveBrandBriefSummaryAction.bind(null, projectId)}
      generateSummaryAction={generateBrandBriefSummaryAction.bind(null, projectId)}
      project={project}
      projectBrief={projectBrief}
    />
  );
}
