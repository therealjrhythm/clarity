"use client";

import Link from "next/link";
import { Compass, Image, Palette, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_AI_MODEL_OPTION_ID } from "@/lib/ai/model-options";
import { PromptBox } from "@/components/dashboard/prompt-box";
import { PreparationChecklist } from "@/components/dashboard/preparation-checklist";
import { PreparationPreview } from "@/components/dashboard/preparation-preview";
import {
  defaultDashboardGreetingParts,
  getDashboardGreetingParts,
} from "@/components/dashboard/dashboard-greeting";
import type {
  FoundationQuestionHelpActionResult,
  FoundationQuestionsActionResult,
} from "@/lib/briefs/actions";
import type { FoundationQuestionHelpRequest } from "@/lib/briefs/types";
import {
  clearPendingFoundation,
  type PendingFoundationContext,
  type PendingFoundationSource,
} from "@/lib/design/pending-foundation";
import type { Project } from "@/types/project";

type QuickAction = {
  icon: typeof Sparkles;
  label: string;
  prompt: string;
};

type PreparationState = "home" | "preparing" | "preview";
type PreparedQuestions = Extract<FoundationQuestionsActionResult, { ok: true }>;

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
  action,
  generateQuestions,
  getQuestionHelp,
  latestProject,
  name,
  resetKey,
}: {
  action: (formData: FormData) => void | Promise<void>;
  generateQuestions?: (prompt: string) => Promise<FoundationQuestionsActionResult>;
  getQuestionHelp?: (
    request: FoundationQuestionHelpRequest,
  ) => Promise<FoundationQuestionHelpActionResult>;
  latestProject?: Project;
  name: string;
  resetKey?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_AI_MODEL_OPTION_ID);
  const [preparationState, setPreparationState] =
    useState<PreparationState>("home");
  const [pendingSetup, setPendingSetup] =
    useState<PendingFoundationContext | null>(null);
  const [preparedQuestions, setPreparedQuestions] =
    useState<PreparedQuestions | null>(null);
  const [preparationError, setPreparationError] = useState("");
  const [analysisRunId, setAnalysisRunId] = useState(0);
  const [greetingParts, setGreetingParts] = useState(() =>
    defaultDashboardGreetingParts(name),
  );

  const resetPreparation = useCallback(() => {
    clearPendingFoundation();
    setPrompt("");
    setPendingSetup(null);
    setPreparedQuestions(null);
    setPreparationError("");
    setPreparationState("home");
  }, []);

  const showPreparationPreview = useCallback(() => {
    setPreparationState("preview");
  }, []);

  useEffect(() => {
    resetPreparation();
  }, [resetKey, resetPreparation]);

  useEffect(() => {
    const maxRenderedLength = window.innerWidth < 900 ? 28 : undefined;

    setGreetingParts(
      getDashboardGreetingParts(
        name,
        window.localStorage,
        new Date(),
        maxRenderedLength,
      ),
    );
  }, [name]);

  function startPreparation(title: string, source: PendingFoundationSource) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setPendingSetup({
      createdAt: Date.now(),
      modelId,
      source,
      title: trimmedTitle,
    });
    setPreparedQuestions(null);
    setPreparationError("");
    setAnalysisRunId(Date.now());
    setPreparationState("preparing");
  }

  function retryAnalysis() {
    setPreparedQuestions(null);
    setPreparationError("");
    setAnalysisRunId(Date.now());
    setPreparationState("preparing");
  }

  useEffect(() => {
    if (preparationState !== "preparing" || !pendingSetup) {
      return;
    }

    let active = true;
    if (!generateQuestions) {
      setPreparationError(
        "Clarity couldn’t analyze your project. Please try again.",
      );
      return () => {
        active = false;
      };
    }

    generateQuestions(pendingSetup.title)
      .then((result) => {
        if (!active) {
          return;
        }

        if (result.ok) {
          setPreparedQuestions(result);
          return;
        }

        setPreparationError(result.error.message);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setPreparationError(
          "Clarity couldn’t analyze your project. Please try again.",
        );
      });

    return () => {
      active = false;
    };
  }, [
    analysisRunId,
    generateQuestions,
    pendingSetup,
    pendingSetup?.createdAt,
    pendingSetup?.title,
    preparationState,
  ]);

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
          {preparationError ? (
            <section className="w-full max-w-[560px] animate-[fadeUp_0.3s_ease] rounded-[22px] border border-line bg-surface p-6 text-left shadow-[0_24px_90px_rgba(0,0,0,0.3)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                Project Analysis
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">
                Clarity couldn’t analyze your project.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {preparationError} Check your connection or try rephrasing your
                prompt.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-[#efbd78]"
                  onClick={retryAnalysis}
                  type="button"
                >
                  Retry analysis
                </button>
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-line-strong hover:bg-surface-muted"
                  onClick={resetPreparation}
                  type="button"
                >
                  Back to prompt
                </button>
              </div>
            </section>
          ) : isPreparing ? (
            <PreparationChecklist
              analysisReady={Boolean(preparedQuestions)}
              onDone={showPreparationPreview}
              title={pendingSetup.title}
            />
          ) : (
            <PreparationPreview
              action={action}
              context={pendingSetup}
              generateQuestions={generateQuestions}
              getQuestionHelp={getQuestionHelp}
              initialQuestionResult={preparedQuestions}
              onBack={resetPreparation}
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

      <section className="relative z-10 flex w-full max-w-[860px] flex-col items-center text-center">
        <h1 className="mb-[26px] max-w-full whitespace-nowrap text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[34px] xl:text-[38px]">
          {greetingParts.map((part, index) => (
            <span
              className={part.accent ? "text-accent" : undefined}
              key={`${part.text}-${index}`}
            >
              {part.text}
            </span>
          ))}
        </h1>

        <div className="w-full max-w-[720px]">
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
