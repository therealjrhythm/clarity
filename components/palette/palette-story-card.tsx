import { OverviewAIReviewButton } from "@/components/ai/overview-ai-review-button";
import { PaletteMiniUI } from "@/components/palette/palette-mini-ui";
import { PalettePreview } from "@/components/palette/palette-preview";
import { PaletteRoleGrid } from "@/components/palette/palette-role-grid";
import { Button } from "@/components/ui/button";
import type { ColorStory } from "@/lib/design/types";

export const SAMPLE_COLOR_STORY: ColorStory = {
  id: "heirloom-honey",
  name: "Heirloom Honey",
  bestFor: "soft premium projects that need warmth, polish, and tactile charm",
  emotionalRead: ["warm", "giftable", "premium", "approachable"],
  rationale:
    "A warm foundation with honeyed accents gives Clarity a clear way to preview semantic color roles without implying a generated palette has been saved.",
  watchOut: "Avoid letting warmth become generic beige; pair it with crisp contrast and clear hierarchy.",
  source: "ai",
  tokens: [
    { role: "background", name: "Background", value: "#F7EFE3", usage: "page base" },
    { role: "surface", name: "Surface", value: "#FFF9F1", usage: "cards and panels" },
    { role: "surfaceElevated", name: "Elevated", value: "#FFFFFF", usage: "focused panels" },
    { role: "primaryText", name: "Primary text", value: "#2D241C", usage: "headings" },
    { role: "secondaryText", name: "Secondary text", value: "#7D6A58", usage: "body copy" },
    { role: "primaryAccent", name: "Primary accent", value: "#B9824A", usage: "actions" },
  ],
};

export function PaletteStoryCard({
  projectId,
  story = SAMPLE_COLOR_STORY,
}: {
  projectId: string;
  story?: ColorStory;
}) {
  return (
    <article className="rounded-[var(--radius)] border border-line bg-surface p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase text-accent">
            Color story
          </p>
          <h3 className="mt-2 text-xl font-semibold">{story.name}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{story.bestFor}</p>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-foreground">
          Prepared for Phase 2
        </span>
      </div>
      <div className="mt-4">
        <OverviewAIReviewButton
          description="Clarity reviews how the color-story placeholder relates to the saved brief direction without generating a palette yet."
          projectId={projectId}
          sectionContent={JSON.stringify(story)}
          sectionId="color-story"
          sectionTitle="Color Story"
          variant="secondary"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1fr]">
        <div className="space-y-4">
          <PalettePreview story={story} />
          <PaletteMiniUI story={story} />
        </div>
        <div className="space-y-4">
          <PaletteRoleGrid tokens={story.tokens} />
          <p className="text-sm leading-6 text-ink-muted">{story.rationale}</p>
          {story.watchOut ? (
            <p className="rounded-[var(--radius)] border border-line bg-background/45 px-3 py-2 text-sm text-ink-muted">
              Watch out: {story.watchOut}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled type="button" variant="secondary">
          Preview
        </Button>
        <Button disabled type="button" variant="secondary">
          Customize
        </Button>
        <Button disabled type="button" variant="secondary">
          Generate variations
        </Button>
      </div>
    </article>
  );
}
