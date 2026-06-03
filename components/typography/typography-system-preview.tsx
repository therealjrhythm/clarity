import type { TypographyDirection } from "@/lib/design/types";

export function TypographySystemPreview({
  direction,
}: {
  direction: TypographyDirection;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-line bg-background/45 p-4">
      <p className="text-xs font-semibold uppercase text-accent">
        Live sample
      </p>
      <h4
        className="mt-3 text-3xl font-semibold leading-tight"
        style={{ fontFamily: direction.headingFont }}
      >
        Shape a design system with intention.
      </h4>
      <p
        className="mt-3 text-sm leading-6 text-ink-muted"
        style={{ fontFamily: direction.bodyFont }}
      >
        Typography previews will help users compare voice, hierarchy, buttons,
        product cards, and data labels before a design direction is approved.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className="rounded-full border border-accent/30 bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
          style={{ fontFamily: direction.accentFont || direction.bodyFont }}
        >
          Approve direction
        </span>
        <span className="font-mono text-xs text-ink-muted">
          Prepared for Phase 2
        </span>
      </div>
    </div>
  );
}
