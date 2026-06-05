"use client";

import { useEffect, useMemo, useState } from "react";
import {
  inferFoundationDefaults,
  readPendingFoundation,
  type PendingFoundationContext,
} from "@/lib/design/pending-foundation";
import type {
  FoundationQuestionHelpActionResult,
  FoundationQuestionsActionResult,
} from "@/lib/briefs/actions";
import type { FoundationQuestionHelpRequest } from "@/lib/briefs/types";
import { GuidedProjectFoundation } from "@/components/projects/guided-project-foundation";
import { ProjectForm } from "@/components/projects/project-form";

export function ProjectFoundation({
  action,
  fromPreparation,
  generateQuestions,
  getQuestionHelp,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fromPreparation: boolean;
  generateQuestions?: (prompt: string) => Promise<FoundationQuestionsActionResult>;
  getQuestionHelp?: (
    request: FoundationQuestionHelpRequest,
  ) => Promise<FoundationQuestionHelpActionResult>;
}) {
  const [pendingContext, setPendingContext] =
    useState<PendingFoundationContext | null>(null);

  useEffect(() => {
    if (!fromPreparation) {
      setPendingContext(null);
      return;
    }

    setPendingContext(readPendingFoundation());
  }, [fromPreparation]);

  const defaults = useMemo(
    () => inferFoundationDefaults(pendingContext),
    [pendingContext],
  );
  const hasPreparationContext = Boolean(fromPreparation && pendingContext);

  if (hasPreparationContext && pendingContext) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[980px] justify-center px-6 pb-16 pt-8">
        <GuidedProjectFoundation
          action={action}
          context={pendingContext}
          generateQuestions={generateQuestions}
          getQuestionHelp={getQuestionHelp}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] space-y-6 px-6 pb-16 pt-8">
      <header className="rounded-[18px] border border-line bg-surface p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.13em] text-accent">
            Project Foundation
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em]">
            Confirm the foundation
          </h1>
          <p className="mt-3 max-w-[560px] text-sm leading-6 text-ink-muted">
            Start with the essentials Clarity needs to shape your design
            direction.
          </p>
        </div>
      </header>

      <section className="rounded-[18px] border border-line bg-surface p-6">
        <ProjectForm
          action={action}
          defaults={defaults}
          key="empty-foundation"
          submitLabel="Create project"
        />
      </section>
    </div>
  );
}
