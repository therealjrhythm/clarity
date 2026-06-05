import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DesignDirectionBoard } from "@/components/projects/design-direction-board";
import { ProjectPhaseRail } from "@/components/projects/project-phase-rail";
import { getWorkflowStepsForProject } from "@/lib/design/workflow";
import type { ProjectBrief } from "@/lib/briefs/types";
import type { Project } from "@/types/project";

export function ProjectOverviewBoard({
  project,
  projectBrief,
}: {
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const phases = getWorkflowStepsForProject(project.status, projectBrief);

  return (
    <main className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-[1280px] overflow-visible px-6 pb-20 pt-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
            Overview Board
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
            See everything
          </h1>
        </div>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius)] border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
          href={`/projects/${project.id}`}
        >
          <ArrowLeft size={16} aria-hidden />
          Back to focus
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <DesignDirectionBoard project={project} projectBrief={projectBrief} />
        <div className="xl:sticky xl:top-6 xl:self-start">
          <ProjectPhaseRail phases={phases} status={project.status} />
        </div>
      </div>
    </main>
  );
}
