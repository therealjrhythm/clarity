import Link from "next/link";
import { ArrowLeft, LayoutGrid, Sparkles } from "lucide-react";
import type { ProjectBrief } from "@/lib/briefs/types";
import { isBrandBriefApproved } from "@/lib/briefs/workflow";
import type { Project } from "@/types/project";
import { ButtonLink } from "@/components/ui/button";

export function BrandArchetypeShell({
  project,
  projectBrief,
}: {
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const approved = isBrandBriefApproved(projectBrief);
  const summary = projectBrief?.brand_brief_summary;

  if (!approved) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[820px] flex-col justify-center px-6 pb-16 pt-8">
        <section className="rounded-[24px] border border-line bg-surface p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
            Brand Archetype
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
            Final check comes first
          </h1>
          <p className="mt-3 max-w-[620px] text-sm leading-6 text-ink-muted">
            Brand Archetype unlocks after your Brand Brief final check is
            approved.
          </p>
          <ButtonLink className="mt-6" href={`/projects/${project.id}/brief`}>
            Go to Brand Brief
          </ButtonLink>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[900px] flex-col px-6 pb-16 pt-8">
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-foreground"
        href={`/projects/${project.id}`}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to focus
      </Link>

      <section className="rounded-[24px] border border-accent/35 bg-[linear-gradient(180deg,var(--surface),rgba(217,161,94,0.08))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
              Brand Archetype
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Archetype direction is ready
            </h1>
            <p className="mt-3 max-w-[680px] text-sm leading-6 text-ink-muted">
              Your approved Brand Brief is ready to guide strategic personality
              and creative identity direction.
            </p>
          </div>
          <span className="inline-flex min-h-9 items-center rounded-full border border-accent/30 bg-accent-soft px-3 text-xs font-semibold text-accent">
            Archetype — Ready
          </span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-[18px] border border-line bg-background/45 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Overview
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground">
              {summary?.overview || project.description}
            </p>
          </article>
          <article className="rounded-[18px] border border-line bg-background/45 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Archetype guidance
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground">
              {summary?.archetypeGuidance}
            </p>
          </article>
          <article className="rounded-[18px] border border-line bg-background/45 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Tone and feel
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground">
              {summary?.toneAndFeel}
            </p>
          </article>
          <article className="rounded-[18px] border border-line bg-background/45 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Audience
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground">
              {summary?.audience}
            </p>
          </article>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-[var(--radius)] border border-accent/45 bg-accent/70 px-5 py-2 text-sm font-semibold text-accent-foreground opacity-80"
            disabled
            type="button"
          >
            <Sparkles size={16} aria-hidden />
            Begin Archetype Direction
            <span className="text-xs opacity-80">Coming next</span>
          </button>
          <ButtonLink href={`/projects/${project.id}?view=overview`} variant="secondary">
            <LayoutGrid size={16} aria-hidden />
            Back to overview
          </ButtonLink>
          <ButtonLink href={`/projects/${project.id}/brief/summary`} variant="secondary">
            View Brand Brief Summary
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
