import { ArrowRight } from "lucide-react";
import { OverviewAIReviewButton } from "@/components/ai/overview-ai-review-button";
import { ButtonLink } from "@/components/ui/button";
import type { ProjectBrief } from "@/lib/briefs/types";
import type { Project } from "@/types/project";

export function NextStepCard({
  project,
  projectBrief,
}: {
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const hasBrief = Boolean(projectBrief?.brief);
  const sectionContent = hasBrief
    ? JSON.stringify(projectBrief?.brief)
    : project.description || "The project foundation is ready for a Brand Brief.";

  return (
    <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-accent">Next Step</p>
          <h2 className="mt-2 text-2xl font-semibold">Brand Brief</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {hasBrief
              ? "The Brand Brief is saved. Refine it before moving into archetype direction."
              : "The project foundation is ready. The next product step is a guided brief that turns intent into creative direction."}
          </p>
        </div>
        <OverviewAIReviewButton
          description="Clarity writes and refines the Brand Brief, then prepares archetype, palette, typography, and reference direction."
          projectId={project.id}
          sectionContent={sectionContent}
          sectionId="next-step"
          sectionTitle="Next Step"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink href={`/projects/${project.id}/brief`}>
          {hasBrief ? "Edit brief" : "Prepare brief"}
          <ArrowRight size={16} aria-hidden />
        </ButtonLink>
        <ButtonLink href={`/projects/${project.id}/settings`} variant="secondary">
          Refine foundation
        </ButtonLink>
        <span className="inline-flex min-h-10 items-center rounded-[var(--radius)] border border-accent/30 bg-accent-soft px-3 text-sm font-semibold">
          {hasBrief ? "Brief saved" : "Ready"}
        </span>
      </div>
    </section>
  );
}
