import { OverviewAIReviewButton } from "@/components/ai/overview-ai-review-button";
import { FontPairingPreview } from "@/components/typography/font-pairing-preview";
import { TypographySystemPreview } from "@/components/typography/typography-system-preview";
import { Button } from "@/components/ui/button";
import type { TypographyDirection } from "@/lib/design/types";

export const SAMPLE_TYPOGRAPHY_DIRECTION: TypographyDirection = {
  id: "modern-heirloom",
  name: "Modern Heirloom",
  headingFont: "Cormorant Garamond, Georgia, serif",
  bodyFont: "Manrope, Inter, Arial, sans-serif",
  accentFont: "Manrope, Inter, Arial, sans-serif",
  monoFont: "Geist Mono, SFMono-Regular, Consolas, monospace",
  source: "google",
  emotionalRead: ["elegant", "editorial", "refined", "fashion-forward"],
  bestFor: ["premium brands", "editorial commerce", "soft luxury systems"],
  rationale:
    "A refined serif heading paired with a clean sans body creates enough contrast for premium creative work without sacrificing product usability.",
  watchOut: "Keep body copy practical and avoid overusing display type in dense panels.",
};

export function TypographyRecommendationCard({
  direction = SAMPLE_TYPOGRAPHY_DIRECTION,
  projectId,
}: {
  direction?: TypographyDirection;
  projectId: string;
}) {
  return (
    <article className="rounded-[var(--radius)] border border-line bg-surface p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase text-accent">
            Typography system
          </p>
          <h3 className="mt-2 text-xl font-semibold">{direction.name}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{direction.rationale}</p>
        </div>
        <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-foreground">
          Prepared for Phase 2
        </span>
      </div>
      <div className="mt-4">
        <OverviewAIReviewButton
          description="Clarity reviews how the typography placeholder relates to the saved brief direction without generating typography yet."
          projectId={projectId}
          sectionContent={JSON.stringify(direction)}
          sectionId="typography"
          sectionTitle="Typography System"
          variant="secondary"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1fr]">
        <FontPairingPreview direction={direction} />
        <TypographySystemPreview direction={direction} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {direction.emotionalRead.map((trait) => (
          <span
            className="rounded-full border border-line bg-background/45 px-3 py-1 text-xs text-ink-muted"
            key={trait}
          >
            {trait}
          </span>
        ))}
      </div>

      <p className="mt-4 rounded-[var(--radius)] border border-line bg-background/45 px-3 py-2 text-sm text-ink-muted">
        Google Fonts browser/search is prepared for Phase 2.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled type="button" variant="secondary">
          Preview
        </Button>
        <Button disabled type="button" variant="secondary">
          Mix roles
        </Button>
        <Button disabled type="button" variant="secondary">
          Browse fonts
        </Button>
      </div>
    </article>
  );
}
