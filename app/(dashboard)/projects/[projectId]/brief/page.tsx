import { BrandBriefWorkspace } from "@/components/brief/brand-brief-workspace";
import { requireUser } from "@/lib/auth/require-user";
import {
  generateBrandBriefAction,
  generateBrandBriefSummaryAction,
  regenerateBrandBriefAction,
  saveBrandBriefAction,
} from "@/lib/briefs/actions";
import { getProjectBrief } from "@/lib/briefs/queries";
import { requireOwnedProject } from "@/lib/projects/ownership";

export default async function ProjectBriefPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const project = await requireOwnedProject(projectId, user.id);
  const projectBrief = await getProjectBrief(projectId, user.id);

  return (
    <BrandBriefWorkspace
      generateAction={generateBrandBriefAction.bind(null, projectId)}
      project={project}
      projectBrief={projectBrief}
      regenerateAction={regenerateBrandBriefAction.bind(null, projectId)}
      saveAction={saveBrandBriefAction.bind(null, projectId)}
      summaryAction={generateBrandBriefSummaryAction.bind(null, projectId)}
    />
  );
}
