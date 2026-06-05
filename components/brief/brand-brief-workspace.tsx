"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, RefreshCw, Save, Sparkles } from "lucide-react";
import { useActionState, useMemo } from "react";
import {
  initialBriefActionState,
  type BriefActionState,
} from "@/lib/briefs/action-state";
import type { BrandBriefContent, ProjectBrief } from "@/lib/briefs/types";
import { getBriefStatusLabel } from "@/lib/briefs/workflow";
import type { Project } from "@/types/project";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type BriefServerAction = (
  previousState: BriefActionState,
  formData: FormData,
) => Promise<BriefActionState>;

function lines(values: string[] | undefined) {
  return (values || []).join("\n");
}

function Field({
  defaultValue,
  label,
  name,
  rows = 4,
}: {
  defaultValue: string;
  label: string;
  name: keyof BrandBriefContent;
  rows?: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <Textarea
        className="min-h-0 resize-none"
        defaultValue={defaultValue}
        name={name}
        rows={rows}
      />
    </label>
  );
}

function ActionMessage({ state }: { state: BriefActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      className={`rounded-[14px] border px-4 py-3 text-sm font-medium ${
        state.status === "error"
          ? "border-danger/35 bg-danger/10 text-foreground"
          : "border-accent/30 bg-accent-soft text-foreground"
      }`}
    >
      {state.message}
    </p>
  );
}

export function BrandBriefWorkspace({
  generateAction,
  project,
  projectBrief,
  regenerateAction,
  saveAction,
  summaryAction,
}: {
  generateAction: BriefServerAction;
  project: Project;
  projectBrief: ProjectBrief | null;
  regenerateAction: BriefServerAction;
  saveAction: BriefServerAction;
  summaryAction: BriefServerAction;
}) {
  const [generateState, generateFormAction, isGenerating] = useActionState(
    generateAction,
    initialBriefActionState,
  );
  const [regenerateState, regenerateFormAction, isRegenerating] = useActionState(
    regenerateAction,
    initialBriefActionState,
  );
  const [saveState, saveFormAction, isSaving] = useActionState(
    saveAction,
    initialBriefActionState,
  );
  const [summaryState, summaryFormAction, isPreparingSummary] = useActionState(
    summaryAction,
    initialBriefActionState,
  );
  const activeBrief = useMemo(
    () =>
      saveState.brief ||
      regenerateState.brief ||
      generateState.brief ||
      projectBrief?.brief ||
      null,
    [generateState.brief, projectBrief?.brief, regenerateState.brief, saveState.brief],
  );
  const actionState =
    summaryState.status !== "idle"
      ? summaryState
      : saveState.status !== "idle"
      ? saveState
      : regenerateState.status !== "idle"
        ? regenerateState
        : generateState;
  const formKey =
    activeBrief?.summary || projectBrief?.updated_at || project.id;
  const briefStatusLabel = getBriefStatusLabel(projectBrief);

  return (
    <main className="mx-auto flex h-[calc(100vh-56px)] w-full max-w-[880px] flex-col justify-start overflow-y-auto px-6 pb-16 pt-8">
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-foreground"
        href={`/projects/${project.id}`}
      >
        <ArrowLeft size={16} aria-hidden />
        Back to focus
      </Link>

      <section className="rounded-[24px] border border-line bg-surface p-7 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
          Brand Brief
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              {project.name}
            </h1>
            <p className="mt-3 max-w-[620px] text-sm leading-6 text-ink-muted">
              Generate a concise Brand Brief from the saved Project Foundation,
              then refine it before Clarity moves into archetype direction.
            </p>
          </div>
	          <span className="inline-flex min-h-9 items-center rounded-full border border-accent/30 bg-accent-soft px-3 text-xs font-semibold text-accent">
	            Brief — {briefStatusLabel}
	          </span>
        </div>

        <div className="mt-6 rounded-[16px] border border-line bg-background/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-subtle">
            Project intent
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {project.description ||
              "Use the saved foundation answers to prepare the brief."}
          </p>
        </div>

	        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
	          <form action={generateFormAction}>
	            <Button disabled={isGenerating} type="submit">
	              <Sparkles size={16} aria-hidden />
	              {activeBrief ? "Generate again" : "Generate Brand Brief"}
	            </Button>
	          </form>
	          {activeBrief ? (
	            <>
	              {projectBrief?.brand_brief_summary_status === "approved" ? (
	                <ButtonLink href={`/projects/${project.id}/archetype`}>
	                  View Archetype
	                  <ArrowRight size={16} aria-hidden />
	                </ButtonLink>
	              ) : projectBrief?.brand_brief_summary ? (
	                <ButtonLink href={`/projects/${project.id}/brief/summary`}>
	                  Continue Final Check
	                  <ArrowRight size={16} aria-hidden />
	                </ButtonLink>
	              ) : (
	                <form action={summaryFormAction}>
	                  <Button disabled={isPreparingSummary} type="submit">
	                    <Sparkles size={16} aria-hidden />
	                    {isPreparingSummary
	                      ? "Preparing final check..."
	                      : "Approve Brief & Continue"}
	                  </Button>
	                </form>
	              )}
	              <form action={regenerateFormAction}>
	                <Button disabled={isRegenerating} type="submit" variant="secondary">
	                  <RefreshCw size={16} aria-hidden />
	                  Regenerate
	                </Button>
	              </form>
	            </>
	          ) : null}
	        </div>

        <div className="mt-5">
          <ActionMessage state={actionState} />
        </div>
      </section>

      {activeBrief ? (
        <section className="mt-6 rounded-[22px] border border-line bg-surface p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                Editable Brief
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Refine the direction</h2>
            </div>
            <p className="text-xs text-ink-subtle">
              {projectBrief?.generated_at
                ? `Generated ${new Date(projectBrief.generated_at).toLocaleDateString()}`
                : "Prepared in this session"}
            </p>
          </div>

          <form action={saveFormAction} className="space-y-5" key={formKey}>
            <Field
              defaultValue={activeBrief.summary}
              label="Summary"
              name="summary"
              rows={5}
            />
            <Field
              defaultValue={activeBrief.audience}
              label="Audience"
              name="audience"
            />
            <Field
              defaultValue={activeBrief.primaryGoal}
              label="Primary goal"
              name="primaryGoal"
            />
            <Field
              defaultValue={activeBrief.emotionalDirection}
              label="Emotional direction"
              name="emotionalDirection"
            />
            <Field
              defaultValue={activeBrief.signatureMoment}
              label="Signature moment"
              name="signatureMoment"
            />
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                defaultValue={lines(activeBrief.brandPersonality)}
                label="Brand personality"
                name="brandPersonality"
              />
              <Field
                defaultValue={lines(activeBrief.keyMessages)}
                label="Key messages"
                name="keyMessages"
              />
              <Field
                defaultValue={lines(activeBrief.functionalRequirements)}
                label="Functional requirements"
                name="functionalRequirements"
              />
              <Field
                defaultValue={lines(activeBrief.constraints)}
                label="Constraints"
                name="constraints"
              />
              <Field
                defaultValue={lines(activeBrief.antiPatterns)}
                label="Anti-patterns"
                name="antiPatterns"
              />
              <Field
                defaultValue={lines(activeBrief.nextQuestions)}
                label="Next questions"
                name="nextQuestions"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button disabled={isSaving} type="submit">
                <Save size={16} aria-hidden />
                Save Brand Brief
              </Button>
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
                href={`/projects/${project.id}?view=overview`}
              >
                See overview
              </Link>
            </div>
          </form>
        </section>
      ) : (
        <section className="mt-6 rounded-[22px] border border-dashed border-line bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,rgba(255,255,255,0.018)_11px,rgba(255,255,255,0.018)_22px)] p-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-subtle">
            Brand Brief Preview
          </p>
          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-6 text-ink-muted">
            Clarity will synthesize the saved foundation into a structured
            brief. If generation fails, Clarity will ask you to try again
            rather than showing a weaker draft.
          </p>
        </section>
      )}
    </main>
  );
}
