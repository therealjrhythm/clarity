"use client";

import Link from "next/link";
import { ArrowRight, Check, LayoutGrid, Settings } from "lucide-react";
import { useMemo } from "react";
import { ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { getWorkflowStepsForProject } from "@/lib/design/workflow";
import type { ProjectBrief } from "@/lib/briefs/types";
import { getBriefWorkflowStage } from "@/lib/briefs/workflow";
import type { Project } from "@/types/project";

export function ProjectFocusView({
  project,
  projectBrief,
}: {
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const progress = useMemo(
    () => getWorkflowStepsForProject(project.status, projectBrief).slice(0, 4),
    [project.status, projectBrief],
  );
  const stage = getBriefWorkflowStage(projectBrief);
  const focusCopy = {
    brief_complete: {
      body: "Use the approved Brand Brief to shape the strategic personality and creative identity direction.",
      cta: "Start Archetype",
      href: `/projects/${project.id}/archetype`,
      kicker: "Approved direction",
      summaryLabel: "Archetype guidance",
      title: "Brand Archetype",
    },
    brief_in_review: {
      body: "Review and approve the generated Brand Brief before moving into archetype direction.",
      cta: "Review Brand Brief",
      href: `/projects/${project.id}/brief`,
      kicker: "Brief summary",
      summaryLabel: "Brief summary",
      title: "Review Brand Brief",
    },
    brief_ready: {
      body: "Prepare the Brand Brief from your completed Foundation.",
      cta: "Prepare Brand Brief",
      href: `/projects/${project.id}/brief`,
      kicker: "Project intent",
      summaryLabel: "Project intent",
      title: "Brand Brief",
    },
    final_check: {
      body: "Review Clarity's summary of your brand direction before starting Archetype.",
      cta: "Continue Final Check",
      href: `/projects/${project.id}/brief/summary`,
      kicker: "Final check",
      summaryLabel: "Brand Brief Summary",
      title: "Final Check",
    },
  }[stage];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[860px] flex-col justify-center px-6 pb-16 pt-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
            Project Focus
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              {project.name}
            </h1>
            <StatusPill status={project.status} />
          </div>
          <p className="mt-2 text-sm text-ink-muted">{project.type}</p>
        </div>
        <ButtonLink href={`/projects/${project.id}/settings`} variant="secondary">
          <Settings size={16} aria-hidden />
          Settings
        </ButtonLink>
      </div>

      <section className="rounded-[24px] border border-accent/35 bg-[linear-gradient(180deg,var(--surface),rgba(217,161,94,0.08))] p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
          Recommended next
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em]">
	          {focusCopy.title}
        </h2>
        <p className="mt-3 max-w-[610px] text-base leading-7 text-ink-muted">
	          {focusCopy.body}
        </p>

        <div className="mt-6 rounded-[16px] border border-line bg-background/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-subtle">
	            {focusCopy.summaryLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
	            {projectBrief?.brand_brief_summary?.archetypeGuidance ||
	              projectBrief?.summary ||
	              project.description ||
	              "Add the audience, mood, constraints, and memorable moment before moving forward."}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink
            className="min-h-11 px-5"
	            href={focusCopy.href}
	          >
	            {focusCopy.cta}
            <ArrowRight size={16} aria-hidden />
          </ButtonLink>
          <ButtonLink
            href={`/projects/${project.id}?view=overview`}
            variant="secondary"
          >
            <LayoutGrid size={16} aria-hidden />
            See everything
          </ButtonLink>
        </div>
      </section>

      <section className="mt-6 rounded-[18px] border border-line bg-surface p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
              Progress
            </p>
            <h2 className="mt-2 text-lg font-semibold">Compact path</h2>
          </div>
          <Link
            className="text-sm font-semibold text-accent transition hover:text-foreground"
            href={`/projects/${project.id}?view=overview`}
          >
            Open overview
          </Link>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {progress.map((step) => (
            <div
              className="rounded-[12px] border border-line bg-background/45 p-3"
              key={step.id}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-accent/35 bg-accent-soft text-accent">
                  {step.status === "complete" ? (
                    <Check size={12} aria-hidden />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {step.label}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-ink-muted">
	                {step.status === "complete"
	                  ? "Complete"
	                  : step.status === "ready"
	                    ? "Recommended next"
	                    : step.status === "in_review"
	                      ? "In review"
	                      : step.status === "final_check"
	                        ? "Final check"
	                        : step.status === "locked"
	                          ? "Upcoming"
	                          : "Upcoming"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
