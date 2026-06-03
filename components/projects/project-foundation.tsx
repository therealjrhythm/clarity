"use client";

import { useEffect, useMemo, useState } from "react";
import { AI_MODEL_OPTIONS } from "@/lib/ai/model-options";
import {
  inferFoundationDefaults,
  readPendingFoundation,
  type PendingFoundationContext,
} from "@/lib/design/pending-foundation";
import { ProjectForm } from "@/components/projects/project-form";

export function ProjectFoundation({
  action,
  fromPreparation,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fromPreparation: boolean;
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
  const model = pendingContext
    ? AI_MODEL_OPTIONS.find((option) => option.id === pendingContext.modelId)
    : null;
  const hasPreparationContext = Boolean(fromPreparation && pendingContext);
  const formKey = hasPreparationContext
    ? `${pendingContext?.createdAt}-${pendingContext?.title}`
    : "empty-foundation";

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
            {hasPreparationContext
              ? "Confirm the essentials before Clarity creates your workspace."
              : "Start with the essentials Clarity needs to shape your design direction."}
          </p>
        </div>

        {hasPreparationContext ? (
          <div className="mt-5 rounded-[14px] border border-line bg-background/45 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-subtle">
              Prepared from {pendingContext?.source === "prompt" ? "prompt" : "quick action"}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {pendingContext?.title}
            </p>
            {model ? (
              <p className="mt-2 text-xs text-ink-muted">{model.label}</p>
            ) : null}
          </div>
        ) : null}
      </header>

      <section className="rounded-[18px] border border-line bg-surface p-6">
        <ProjectForm
          action={action}
          defaults={defaults}
          key={formKey}
          submitLabel="Create project"
        />
      </section>
    </div>
  );
}
