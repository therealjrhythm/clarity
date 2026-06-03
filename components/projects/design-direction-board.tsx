import Link from "next/link";
import { Settings } from "lucide-react";
import { AIHelpButton } from "@/components/ai/ai-help-button";
import { PaletteStoryCard } from "@/components/palette/palette-story-card";
import { AIReadCard } from "@/components/projects/ai-read-card";
import { NextStepCard } from "@/components/projects/next-step-card";
import { WorkflowStepCard } from "@/components/projects/workflow-step-card";
import { TypographyRecommendationCard } from "@/components/typography/typography-recommendation-card";
import { ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { getWorkflowStepsForStatus } from "@/lib/design/workflow";
import type { Project } from "@/types/project";

export function DesignDirectionBoard({ project }: { project: Project }) {
  const workflow = getWorkflowStepsForStatus(project.status);

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] border border-line bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-accent">Design Direction Board</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                {project.name}
              </h1>
              <StatusPill status={project.status} />
            </div>
            <p className="mt-2 text-sm text-ink-muted">{project.type}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AIHelpButton
              description="In Phase 2, Clarity will help read the project foundation and recommend the next creative decision."
              sectionName="Project Header"
              variant="secondary"
            />
            <ButtonLink href={`/projects/${project.id}/settings`} variant="secondary">
              <Settings size={16} aria-hidden />
              Settings
            </ButtonLink>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold">Project Intent</h2>
            <AIHelpButton
              description="In Phase 2, Clarity will turn this intent into a concise brand brief with audience, goal, mood, constraints, and anti-patterns."
              sectionName="Project Intent"
            />
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted">
            {project.description ||
              "No project description has been added yet. Refine the foundation before moving into the brief."}
          </p>
        </div>
      </section>

      <NextStepCard project={project} />
      <AIReadCard project={project} />

      <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-accent">Workflow</p>
            <h2 className="mt-2 text-2xl font-semibold">Design system path</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              Foundation is active now. Later steps are visible so the project
              feels like a design system record from the start.
            </p>
          </div>
          <AIHelpButton
            description="In Phase 2, Clarity will recommend workflow order and help decide when a project is ready to move from brief to direction, palette, typography, and references."
            sectionName="Workflow"
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {workflow.map((step) => (
            <WorkflowStepCard key={step.id} step={step} />
          ))}
        </div>
      </section>

      <TypographyRecommendationCard />
      <PaletteStoryCard />
      <p className="text-sm text-ink-muted">
        Back to{" "}
        <Link className="font-semibold text-accent" href="/dashboard">
          dashboard
        </Link>
      </p>
    </div>
  );
}
