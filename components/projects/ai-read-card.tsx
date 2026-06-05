import { OverviewAIReviewButton } from "@/components/ai/overview-ai-review-button";
import type { ProjectBrief } from "@/lib/briefs/types";
import type { Project } from "@/types/project";

export function AIReadCard({
  project,
  projectBrief,
}: {
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const hasDescription = Boolean(project.description);
  const hasBrief = Boolean(projectBrief?.brief);

  return (
    <section className="rounded-[var(--radius)] border border-line bg-surface p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-accent">AI Read</p>
          <h2 className="mt-2 text-2xl font-semibold">Brand cue interpretation</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            {hasBrief
              ? "Clarity has a structured Brand Brief to guide the next design direction step."
              : hasDescription
                ? "Clarity can use this project foundation to prepare a sharper Brand Brief."
                : "Clarity will interpret this project's brand cues in the Brief step."}
          </p>
        </div>
        <OverviewAIReviewButton
          description="Clarity interprets project cues, identifies design risks, and prepares a direction before palette, typography, and references."
          projectId={project.id}
          sectionContent={JSON.stringify({
            antiPatterns: projectBrief?.brief?.antiPatterns,
            brandPersonality: projectBrief?.brief?.brandPersonality,
            description: project.description,
            primaryGoal: projectBrief?.brief?.primaryGoal,
          })}
          sectionId="ai-read"
          sectionTitle="AI Read"
        />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[
          [
            "Inferred traits",
            hasBrief
              ? projectBrief?.brief?.brandPersonality.slice(0, 2).join(", ")
              : hasDescription
                ? "Intent available"
                : "Awaiting brief",
          ],
          [
            "Design risks",
            hasBrief
              ? projectBrief?.brief?.antiPatterns[0]
              : "Ready for brief synthesis",
          ],
          [
            "Design goal",
            hasBrief
              ? projectBrief?.brief?.primaryGoal
              : "Clarify before generation",
          ],
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
