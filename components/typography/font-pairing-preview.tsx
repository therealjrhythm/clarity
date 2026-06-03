import type { TypographyDirection } from "@/lib/design/types";

export function FontPairingPreview({ direction }: { direction: TypographyDirection }) {
  return (
    <div className="grid gap-3 rounded-[var(--radius)] border border-line bg-background/45 p-4 sm:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase text-ink-muted">
          Heading
        </p>
        <p className="mt-2 text-2xl font-semibold" style={{ fontFamily: direction.headingFont }}>
          {direction.headingFont}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-ink-muted">
          Body
        </p>
        <p className="mt-2 text-lg" style={{ fontFamily: direction.bodyFont }}>
          {direction.bodyFont}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-ink-muted">
          Accent
        </p>
        <p className="mt-2 text-lg font-semibold" style={{ fontFamily: direction.accentFont || direction.bodyFont }}>
          {direction.accentFont || direction.bodyFont}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-ink-muted">
          Mono
        </p>
        <p className="mt-2 font-mono text-sm">{direction.monoFont || "System Mono"}</p>
      </div>
    </div>
  );
}
