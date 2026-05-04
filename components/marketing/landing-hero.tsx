import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Clarity
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
          Design with intention. Build with intelligence.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
          Turn project intent into a durable design-system foundation. Phase 1
          establishes the secure workspace where future brief, palette,
          reference, and generation workflows will live.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/signup">
            Start a Design System
            <ArrowRight size={16} aria-hidden />
          </ButtonLink>
          <ButtonLink href="/login" variant="secondary">
            Sign In
          </ButtonLink>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-full rounded-[var(--radius)] border border-line bg-surface p-4 shadow-sm">
          <div className="grid gap-3">
            {[
              "Project brief",
              "Archetype direction",
              "Color story",
              "Private references",
              "DESIGN.md system",
              "Generated preview",
            ].map((item, index) => (
              <div
                className="flex items-center justify-between rounded-[var(--radius)] border border-line bg-background px-4 py-3"
                key={item}
              >
                <span className="text-sm font-semibold">{item}</span>
                <span className="font-mono text-xs text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
