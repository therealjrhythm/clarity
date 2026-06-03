import type { ColorStory } from "@/lib/design/types";

function tokenValue(story: ColorStory, role: string, fallback: string) {
  return story.tokens.find((token) => token.role === role)?.value || fallback;
}

export function PaletteMiniUI({ story }: { story: ColorStory }) {
  const background = tokenValue(story, "background", "#08090D");
  const surface = tokenValue(story, "surface", "#151720");
  const accent = tokenValue(story, "primaryAccent", "#D8A15D");
  const text = tokenValue(story, "primaryText", "#F5F2EA");
  const muted = tokenValue(story, "secondaryText", "#A8A29A");

  return (
    <div
      className="rounded-[var(--radius)] border border-line p-3"
      style={{ backgroundColor: background, color: text }}
    >
      <div className="rounded-[var(--radius)] p-3" style={{ backgroundColor: surface }}>
        <p className="text-xs font-semibold uppercase" style={{ color: accent }}>
          Mini preview
        </p>
        <h4 className="mt-2 text-lg font-semibold">Design direction card</h4>
        <p className="mt-1 text-sm leading-5" style={{ color: muted }}>
          Palette roles previewed on a realistic card, button, and data label.
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: accent, color: background }}>
            Primary action
          </span>
          <span className="font-mono text-xs" style={{ color: muted }}>
            92% ready
          </span>
        </div>
      </div>
    </div>
  );
}
