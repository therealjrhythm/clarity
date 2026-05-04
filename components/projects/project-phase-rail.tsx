const phases = [
  { name: "Foundation", status: "active" },
  { name: "Brief", status: "locked" },
  { name: "Archetype", status: "locked" },
  { name: "Palette", status: "locked" },
  { name: "References", status: "locked" },
  { name: "DESIGN.md", status: "locked" },
  { name: "Preview", status: "locked" },
  { name: "Export", status: "locked" },
];

export function ProjectPhaseRail() {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-surface p-4">
      <h2 className="text-sm font-semibold">Workflow</h2>
      <div className="mt-4 grid gap-2">
        {phases.map((phase) => (
          <div
            className="flex items-center justify-between rounded-[var(--radius)] border border-line bg-background px-3 py-2"
            key={phase.name}
          >
            <span className="text-sm font-medium">{phase.name}</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {phase.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
