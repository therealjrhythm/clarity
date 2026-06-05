"use client";

import Link from "next/link";
import { ArrowLeft, Check, RefreshCw, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useActionState } from "react";
import {
  initialBriefActionState,
  type BriefActionState,
} from "@/lib/briefs/action-state";
import type { ProjectBrief } from "@/lib/briefs/types";
import type { Project } from "@/types/project";
import { Button, ButtonLink } from "@/components/ui/button";

type SummaryAction = (
  previousState: BriefActionState,
  formData: FormData,
) => Promise<BriefActionState>;

type ApproveAction = (formData: FormData) => Promise<void>;

function SummarySection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-[18px] border border-line bg-background/40 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
        {title}
      </p>
      <div className="mt-3 text-sm leading-6 text-foreground">{children}</div>
    </section>
  );
}

export function BrandBriefSummaryWorkspace({
  approveAction,
  generateSummaryAction,
  project,
  projectBrief,
}: {
  approveAction: ApproveAction;
  generateSummaryAction: SummaryAction;
  project: Project;
  projectBrief: ProjectBrief | null;
}) {
  const [summaryState, summaryFormAction, isGenerating] = useActionState(
    generateSummaryAction,
    initialBriefActionState,
  );
  const summary = projectBrief?.brand_brief_summary;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[920px] flex-col px-6 pb-16 pt-8">
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-foreground"
        href={`/projects/${project.id}/brief`}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to Brand Brief
      </Link>

      <section className="rounded-[24px] border border-line bg-surface p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
              Brand Brief Summary
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Final check
            </h1>
            <p className="mt-3 max-w-[680px] text-sm leading-6 text-ink-muted">
              Review what Clarity understands about {project.name} before this
              direction guides Brand Archetype.
            </p>
          </div>
          <span className="inline-flex min-h-9 items-center rounded-full border border-accent/30 bg-accent-soft px-3 text-xs font-semibold text-accent">
            Final check
          </span>
        </div>

        {!projectBrief?.brief ? (
          <div className="mt-7 rounded-[18px] border border-line bg-background/45 p-5">
            <p className="text-sm leading-6 text-ink-muted">
              Generate a Brand Brief before preparing the final check.
            </p>
            <ButtonLink className="mt-4" href={`/projects/${project.id}/brief`}>
              Prepare Brand Brief
            </ButtonLink>
          </div>
        ) : !summary ? (
          <div className="mt-7 rounded-[18px] border border-line bg-background/45 p-5">
            <p className="text-sm leading-6 text-ink-muted">
              Clarity needs to prepare the final Brand Brief summary before
              Archetype can start.
            </p>
            <form action={summaryFormAction} className="mt-4">
              <input name="regenerate" type="hidden" value="true" />
              <Button disabled={isGenerating} type="submit">
                <Sparkles size={16} aria-hidden />
                {isGenerating ? "Preparing summary..." : "Prepare Final Check"}
              </Button>
            </form>
            {summaryState.status === "error" && summaryState.message ? (
              <p className="mt-4 rounded-[14px] border border-danger/35 bg-danger/10 px-4 py-3 text-sm text-foreground">
                {summaryState.message}
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mt-7 grid gap-4">
              <SummarySection title="Overview">
                <p>{summary.overview}</p>
              </SummarySection>
              <div className="grid gap-4 md:grid-cols-2">
                <SummarySection title="Project intent">
                  <p>{summary.projectIntent}</p>
                </SummarySection>
                <SummarySection title="Audience">
                  <p>{summary.audience}</p>
                </SummarySection>
                <SummarySection title="Positioning">
                  <p>{summary.positioning}</p>
                </SummarySection>
                <SummarySection title="Tone and feel">
                  <p>{summary.toneAndFeel}</p>
                </SummarySection>
              </div>
              <SummarySection title="Key requirements">
                <ul className="space-y-2">
                  {summary.keyRequirements.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <Check className="mt-1 shrink-0 text-accent" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SummarySection>
              <SummarySection title="Creative direction">
                <p>{summary.creativeDirection}</p>
              </SummarySection>
              <SummarySection title="Cohesion notes">
                <ul className="space-y-2">
                  {summary.cohesionNotes.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SummarySection>
              <SummarySection title="Risks or open questions">
                {summary.risksOrOpenQuestions.length ? (
                  <ul className="space-y-2">
                    {summary.risksOrOpenQuestions.map((item) => (
                      <li className="flex gap-2" key={item}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No major open questions are blocking the next step.</p>
                )}
              </SummarySection>
              <SummarySection title="Archetype guidance">
                <p>{summary.archetypeGuidance}</p>
              </SummarySection>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <form action={approveAction}>
                <Button type="submit">
                  <Sparkles size={16} aria-hidden />
                  Approve and Start Archetype
                </Button>
              </form>
              <ButtonLink href={`/projects/${project.id}/brief`} variant="secondary">
                Edit Brief
              </ButtonLink>
              <form action={summaryFormAction}>
                <input name="regenerate" type="hidden" value="true" />
                <Button disabled={isGenerating} type="submit" variant="secondary">
                  <RefreshCw size={16} aria-hidden />
                  Regenerate Summary
                </Button>
              </form>
            </div>

            {summaryState.status === "error" && summaryState.message ? (
              <p className="mt-4 rounded-[14px] border border-danger/35 bg-danger/10 px-4 py-3 text-sm text-foreground">
                {summaryState.message}
              </p>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
