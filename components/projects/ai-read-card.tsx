import { AIHelpButton } from "@/components/ai/ai-help-button";
import type { Project } from "@/types/project";

export function AIReadCard({ project }: { project: Project }) {
  const hasDescription = Boolean(project.description);

  return (
    <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-accent">AI Read</p>
          <h2 className="mt-2 text-2xl font-semibold">Brand cue interpretation</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {hasDescription
              ? "Clarity can use this project foundation to prepare a sharper brand brief in Phase 2."
              : "Clarity will interpret this project's brand cues in the Brief phase."}
          </p>
        </div>
        <AIHelpButton
          description="In Phase 2, Clarity will interpret project cues, identify design risks, and suggest a direction before palette, typography, and references."
          sectionName="AI Read"
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          ["Inferred traits", hasDescription ? "Intent available" : "Awaiting brief"],
          ["Design risks", "Prepared for Phase 2"],
          ["Design goal", "Clarify before generation"],
        ].map(([label, value]) => (
          <div
            className="rounded-[var(--radius)] border border-line bg-background/45 p-3"
            key={label}
          >
            <p className="text-sm text-ink-muted">{label}</p>
            <p className="mt-2 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
