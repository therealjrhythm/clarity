import Link from "next/link";
import { Settings } from "lucide-react";
import { OverviewAIReviewButton } from "@/components/ai/overview-ai-review-button";
import { PaletteStoryCard } from "@/components/palette/palette-story-card";
import { AIReadCard } from "@/components/projects/ai-read-card";
import { NextStepCard } from "@/components/projects/next-step-card";
import { WorkflowStepCard } from "@/components/projects/workflow-step-card";
import { TypographyRecommendationCard } from "@/components/typography/typography-recommendation-card";
import { ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { getWorkflowStepsForProject } from "@/lib/design/workflow";
import type { ProjectBrief } from "@/lib/briefs/types";
import type { Project } from "@/types/project";

function answerText(projectBrief: ProjectBrief | null) {
  const answers = projectBrief?.foundation_answers;

  if (!answers) {
    return "Foundation answers are not available yet.";
  }

  const rows: Array<[string, string[]]> = [
    ["Project Intent", answers.intent],
    ["Audience", answers.audience],
    ["Brand Feel", answers.feel],
    ["Requirements", answers.requirements],
  ];

  return rows
    .map(([label, values]) =>
      `${label}: ${values.join(" ") || "Not answered yet."}`,
    )
    .join("\n");
}

export function DesignDirectionBoard({
  project,
  projectBrief,
}: {
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const workflow = getWorkflowStepsForProject(project.status, projectBrief);
  const foundationText = answerText(projectBrief);

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
            <OverviewAIReviewButton
              description="Clarity can use the saved Brand Brief to guide the next creative decision."
              projectId={project.id}
              sectionContent={`${project.name}\n${project.type}\n${project.description || ""}`}
              sectionId="project-header"
              sectionTitle="Project Header"
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
	            <OverviewAIReviewButton
	              description="Clarity turns this intent and foundation answers into an editable Brand Brief."
		              projectId={project.id}
		              sectionContent={project.description || "No project description."}
		              sectionId="project-intent"
		              sectionTitle="Project Intent"
		            />
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted">
            {project.description ||
              "No project description has been added yet. Refine the foundation before moving into the brief."}
          </p>
        </div>
	      </section>

	      <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
	        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
	          <div>
	            <p className="text-sm font-semibold text-accent">Foundation</p>
	            <h2 className="mt-2 text-2xl font-semibold">Saved answers</h2>
	            <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-6 text-ink-muted">
	              {foundationText}
	            </p>
	          </div>
	          <OverviewAIReviewButton
	            description="Clarity reviews the saved foundation answers before the brief and archetype steps use them."
	            projectId={project.id}
	            sectionContent={foundationText}
	            sectionId="foundation-answers"
	            sectionTitle="Foundation Answers"
	          />
	        </div>
	      </section>

	      <NextStepCard project={project} projectBrief={projectBrief} />
	      <AIReadCard project={project} projectBrief={projectBrief} />

	      {projectBrief?.brand_brief_summary ? (
	        <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
	          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
	            <div>
	              <p className="text-sm font-semibold text-accent">
	                Brand Brief Summary
	              </p>
	              <h2 className="mt-2 text-2xl font-semibold">Final check</h2>
	              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
	                {projectBrief.brand_brief_summary.overview}
	              </p>
	            </div>
	            <OverviewAIReviewButton
	              description="Clarity reviews the final-check summary and how well it prepares the archetype step."
	              projectId={project.id}
	              sectionContent={JSON.stringify(projectBrief.brand_brief_summary)}
	              sectionId="brand-brief-summary"
	              sectionTitle="Brand Brief Summary"
	            />
	          </div>
	        </section>
	      ) : null}

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
	            <OverviewAIReviewButton
	            description="Clarity uses the Brand Brief as the next decision record before archetype, palette, typography, and references."
	            projectId={project.id}
		            sectionContent={workflow
		              .map((step) => `${step.label}: ${step.status}`)
		              .join("\n")}
		            sectionId="workflow"
		            sectionTitle="Workflow"
		          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {workflow.map((step) => (
            <WorkflowStepCard key={step.id} step={step} />
          ))}
        </div>
      </section>

      <TypographyRecommendationCard projectId={project.id} />
      <PaletteStoryCard projectId={project.id} />
      <p className="text-sm text-ink-muted">
        Back to{" "}
        <Link className="font-semibold text-accent" href="/dashboard">
          dashboard
        </Link>
      </p>
    </div>
  );
}
