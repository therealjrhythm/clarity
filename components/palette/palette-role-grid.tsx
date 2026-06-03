import type { ColorToken } from "@/lib/design/types";

export function PaletteRoleGrid({ tokens }: { tokens: ColorToken[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {tokens.map((token) => (
        <div
          className="flex items-center gap-3 rounded-[var(--radius)] border border-line bg-background/45 p-2"
          key={token.role}
        >
          <span
            className="h-8 w-8 shrink-0 rounded-[6px] border border-white/15"
            style={{ backgroundColor: token.value }}
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground">{token.name}</p>
            <p className="font-mono text-xs text-ink-muted">{token.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
