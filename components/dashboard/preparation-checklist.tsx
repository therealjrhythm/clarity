"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const CHECKLIST_STEPS = [
  "Reading your intent",
  "Mapping the brand archetype",
  "Composing color stories",
  "Setting the typography system",
  "Preparing your workspace",
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PreparationChecklist({
  onDone,
  title,
}: {
  onDone: () => void;
  title: string;
}) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setActiveStep(CHECKLIST_STEPS.length);
      const done = window.setTimeout(onDone, 260);
      return () => window.clearTimeout(done);
    }

    const stepMs = 430;
    const doneMs = stepMs * CHECKLIST_STEPS.length + 260;
    const stepInterval = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, CHECKLIST_STEPS.length));
    }, stepMs);
    const done = window.setTimeout(onDone, doneMs);

    return () => {
      window.clearInterval(stepInterval);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      aria-live="polite"
      className="flex w-full max-w-[720px] animate-[fadeUp_0.4s_ease] flex-col items-center gap-[30px]"
    >
      <div className="max-w-[560px] self-end rounded-[16px_16px_4px_16px] border border-line bg-surface px-5 py-3.5 text-base leading-[1.5] text-foreground">
        {title}
      </div>

      <div className="flex min-w-[286px] gap-4 self-center">
        <span className="mt-[5px] h-[11px] w-[11px] shrink-0 animate-[pulse_1.1s_ease-in-out_infinite] rounded-full bg-accent motion-reduce:animate-none" />
        <div className="flex flex-col gap-[11px]">
          {CHECKLIST_STEPS.map((step, index) => {
            const done = index < activeStep;
            const active = index === activeStep;

            return (
              <div
                className={`flex items-center gap-2.5 text-[15.5px] transition-colors duration-300 ${
                  done
                    ? "text-ink-muted opacity-100"
                    : active
                      ? "text-foreground opacity-100"
                      : "text-ink-subtle opacity-55"
                }`}
                key={step}
              >
                {done ? (
                  <Check size={14} aria-hidden className="text-accent" />
                ) : (
                  <span
                    className={`h-3.5 w-3.5 rounded-full border ${
                      active
                        ? "border-accent shadow-[0_0_0_4px_rgba(217,161,94,0.12)]"
                        : "border-ink-subtle"
                    }`}
                  />
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
