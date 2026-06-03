import { ArrowRight } from "lucide-react";
import { AIHelpButton } from "@/components/ai/ai-help-button";
import { Button, ButtonLink } from "@/components/ui/button";
import type { Project } from "@/types/project";

export function NextStepCard({ project }: { project: Project }) {
  return (
    <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-accent">Next Step</p>
          <h2 className="mt-2 text-2xl font-semibold">Brand Brief</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            The project foundation is ready. The next product step is a guided
            brief that turns intent into creative direction.
          </p>
        </div>
        <AIHelpButton
          description="In Phase 2, Clarity will help write and refine the brand brief, then recommend archetype, palette, typography, and reference direction."
          sectionName="Next Step"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled type="button">
          Prepare brief
          <ArrowRight size={16} aria-hidden />
        </Button>
        <ButtonLink href={`/projects/${project.id}/settings`} variant="secondary">
          Refine foundation
        </ButtonLink>
        <span className="inline-flex min-h-10 items-center rounded-[var(--radius)] border border-accent/30 bg-accent-soft px-3 text-sm font-semibold">
          Prepared for Phase 2
        </span>
      </div>
    </section>
  );
}
