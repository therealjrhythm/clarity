"use client";

import Link from "next/link";
import { ArrowRight, Check, LayoutGrid, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { getWorkflowStepsForStatus } from "@/lib/design/workflow";
import type { Project } from "@/types/project";

export function ProjectFocusView({ project }: { project: Project }) {
  const [messageVisible, setMessageVisible] = useState(false);
  const progress = useMemo(
    () => getWorkflowStepsForStatus(project.status).slice(0, 4),
    [project.status],
  );

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
          Brand Brief
        </h2>
        <p className="mt-3 max-w-[610px] text-base leading-7 text-ink-muted">
          Do this now: turn the project foundation into a sharper brief before
          Clarity moves into archetype, color story, typography, and references.
        </p>

        <div className="mt-6 rounded-[16px] border border-line bg-background/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-subtle">
            Project intent
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {project.description ||
              "Add the audience, mood, constraints, and memorable moment before moving forward."}
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            className="min-h-11 px-5"
            onClick={() => setMessageVisible(true)}
            type="button"
          >
            Prepare Brand Brief
            <ArrowRight size={16} aria-hidden />
          </Button>
          <ButtonLink
            href={`/projects/${project.id}?view=overview`}
            variant="secondary"
          >
            <LayoutGrid size={16} aria-hidden />
            See everything
          </ButtonLink>
        </div>

        {messageVisible ? (
          <p className="mt-4 rounded-[12px] border border-accent/25 bg-accent-soft px-4 py-3 text-sm font-medium text-foreground">
            This guided step is prepared next.
          </p>
        ) : null}
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
                    : "Upcoming"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
