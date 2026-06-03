"use client";

import Link from "next/link";
import { Compass, Image, Palette, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_AI_MODEL_OPTION_ID } from "@/lib/ai/model-options";
import { PromptBox } from "@/components/dashboard/prompt-box";
import { PreparationChecklist } from "@/components/dashboard/preparation-checklist";
import { PreparationPreview } from "@/components/dashboard/preparation-preview";
import {
  clearPendingFoundation,
  type PendingFoundationSource,
} from "@/lib/design/pending-foundation";
import type { Project } from "@/types/project";

type QuickAction = {
  icon: typeof Sparkles;
  label: string;
  prompt: string;
};

type PreparationState = "home" | "preparing" | "preview";

type PendingSetup = {
  source: PendingFoundationSource;
  title: string;
};

const quickActions: QuickAction[] = [
  {
    icon: Sparkles,
    label: "Start a design system",
    prompt: "Start a design system",
  },
  {
    icon: Image,
    label: "Import references",
    prompt: "Import references",
  },
  {
    icon: Palette,
    label: "Build a color palette",
    prompt: "Build a color palette",
  },
];

export function CommandCenterHome({
  latestProject,
  name,
  resetKey,
}: {
  latestProject?: Project;
  name: string;
  resetKey?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_AI_MODEL_OPTION_ID);
  const [preparationState, setPreparationState] =
    useState<PreparationState>("home");
  const [pendingSetup, setPendingSetup] = useState<PendingSetup | null>(null);
  const greeting = useMemo(() => "Let's find the direction", []);

  const resetPreparation = useCallback(() => {
    clearPendingFoundation();
    setPrompt("");
    setPendingSetup(null);
    setPreparationState("home");
  }, []);

  const showPreparationPreview = useCallback(() => {
    setPreparationState("preview");
  }, []);

  useEffect(() => {
    resetPreparation();
  }, [resetKey, resetPreparation]);

  function startPreparation(title: string, source: PendingFoundationSource) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setPendingSetup({
      source,
      title: trimmedTitle,
    });
    setPreparationState("preparing");
  }

  if (preparationState !== "home" && pendingSetup) {
    const isPreparing = preparationState === "preparing";

    return (
      <main
        className={`relative z-20 flex min-h-[calc(100vh-56px)] justify-center overflow-y-auto px-8 pb-[60px] pt-6 ${
          isPreparing ? "items-center" : "items-start"
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[38%] z-0 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(217,161,94,0.14),rgba(217,161,94,0.04)_42%,transparent_70%)] blur-[8px]"
        />
        <div className="relative z-10 flex w-full justify-center">
          {isPreparing ? (
            <PreparationChecklist
              onDone={showPreparationPreview}
              title={pendingSetup.title}
            />
          ) : (
            <PreparationPreview
              modelId={modelId}
              onBack={resetPreparation}
              source={pendingSetup.source}
              title={pendingSetup.title}
            />
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-20 flex min-h-[calc(100vh-56px)] items-center justify-center overflow-y-auto px-8 pb-[60px] pt-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] z-0 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(217,161,94,0.14),rgba(217,161,94,0.04)_42%,transparent_70%)] blur-[8px]"
      />

      <section className="relative z-10 flex w-full max-w-[720px] flex-col items-center text-center">
        <h1 className="mb-[26px] max-w-[620px] text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[38px]">
          {greeting}, <span className="text-accent">{name}</span>.
        </h1>

        <div className="w-full">
          <PromptBox
            modelId={modelId}
            onSubmit={() => {
              if (prompt.trim()) {
                startPreparation(prompt, "prompt");
              }
            }}
            setModelId={setModelId}
            setValue={setPrompt}
            value={prompt}
          />
        </div>

        <div className="mt-[22px] flex flex-wrap justify-center gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                className="inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-[15px] text-[13.5px] font-medium text-ink-muted transition-colors duration-150 hover:border-line-strong hover:bg-surface-muted hover:text-foreground"
                key={action.label}
                onClick={() => setPrompt(action.prompt)}
                type="button"
              >
                <Icon size={15} aria-hidden className="text-accent" />
                {action.label}
              </button>
            );
          })}
          {latestProject ? (
            <Link
              className="inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-[15px] text-[13.5px] font-medium text-ink-muted transition-colors duration-150 hover:border-line-strong hover:bg-surface-muted hover:text-foreground"
              href={`/projects/${latestProject.id}`}
            >
              <Compass size={15} aria-hidden className="text-accent" />
              Continue {latestProject.name}
            </Link>
          ) : (
            <button
              className="inline-flex h-[38px] items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-[15px] text-[13.5px] font-medium text-ink-muted transition-colors duration-150 hover:border-line-strong hover:bg-surface-muted hover:text-foreground"
              onClick={() => setPrompt("Start a design system")}
              type="button"
            >
              <Compass size={15} aria-hidden className="text-accent" />
              Start a Design System
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
