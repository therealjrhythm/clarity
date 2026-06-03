import type { ProjectStatus } from "@/types/project";
import {
  getWorkflowStepsForStatus,
  type WorkflowStep,
} from "@/lib/design/workflow";

const statusLabel = {
  complete: "Complete",
  active: "In progress",
  ready: "Ready",
  upcoming: "Upcoming",
  coming_soon: "Coming soon",
} satisfies Record<NonNullable<WorkflowStep["status"]>, string>;

export function ProjectPhaseRail({ status = "draft" }: { status?: ProjectStatus }) {
  const phases = getWorkflowStepsForStatus(status);

  return (
    <aside className="rounded-[var(--radius)] border border-line bg-surface p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <h2 className="text-sm font-semibold">Workflow Progress</h2>
      <p className="mt-2 text-sm leading-5 text-ink-muted">
        The next creative modules are visible now and prepared for Phase 2.
      </p>
      <div className="mt-4 grid gap-2">
        {phases.map((phase) => (
          <div
            className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-line bg-background/45 px-3 py-2"
            key={phase.id}
          >
            <span className="text-sm font-medium">{phase.label}</span>
            <span className="text-xs font-semibold text-ink-muted">
              {statusLabel[phase.status || "upcoming"]}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
