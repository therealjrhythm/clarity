import type { ColorStory } from "@/lib/design/types";

export function PalettePreview({ story }: { story: ColorStory }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-line">
      <div className="grid grid-cols-6">
        {story.tokens.slice(0, 6).map((token) => (
          <div
            className="h-12"
            key={`${story.id}-${token.role}`}
            style={{ backgroundColor: token.value }}
            title={`${token.name} ${token.value}`}
          />
        ))}
      </div>
      <div className="bg-background/55 px-3 py-2 text-xs text-ink-muted">
        {story.emotionalRead.join(" · ")}
      </div>
    </div>
  );
}
