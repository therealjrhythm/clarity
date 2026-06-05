import { Check, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStep } from "@/lib/design/workflow";

const statusLabel = {
  active: "In progress",
  coming_soon: "Coming soon",
  complete: "Complete",
  final_check: "Final check",
  in_review: "In review",
  locked: "Upcoming",
  ready: "Ready",
  upcoming: "Upcoming",
} satisfies Record<NonNullable<WorkflowStep["status"]>, string>;

export function WorkflowStepCard({ step }: { step: WorkflowStep }) {
  const status = step.status || "upcoming";
  const Icon =
    status === "complete" ? Check : status === "ready" ? Sparkles : Circle;

  return (
    <article
      className={cn(
        "rounded-[var(--radius)] border bg-background/45 p-4 transition-colors",
        status === "ready" ||
          status === "active" ||
          status === "in_review" ||
          status === "final_check"
          ? "border-accent/40"
          : "border-line",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
            status === "complete"
              ? "border-success/35 bg-success/15 text-success"
              : "border-line bg-surface text-accent",
          )}
        >
          <Icon size={15} aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{step.label}</h3>
            <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-ink-muted">
              {statusLabel[status]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-5 text-ink-muted">{step.description}</p>
          <p className="mt-3 text-xs font-semibold text-accent">{step.phase}</p>
        </div>
      </div>
    </article>
  );
}
