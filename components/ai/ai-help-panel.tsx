"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/ai/model-selector";

export function AIHelpPanel({
  description,
  onClose,
  sectionName,
}: {
  description: string;
  onClose: () => void;
  sectionName: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/55 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <section
        aria-modal="true"
        className="w-full max-w-lg rounded-[var(--radius)] border border-line bg-surface p-5 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-accent">
              Get help with AI
            </p>
            <h2 className="mt-2 text-xl font-semibold">AI Help for {sectionName}</h2>
          </div>
          <Button aria-label="Close AI help" onClick={onClose} type="button" variant="ghost">
            <X size={16} aria-hidden />
          </Button>
        </div>

        <p className="mt-4 text-sm leading-6 text-ink-muted">{description}</p>

        <div className="mt-5">
          <ModelSelector />
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase text-ink-muted">
          Prompt
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-[var(--radius)] border border-line bg-background/45 px-3 py-3 text-sm text-ink-muted outline-none"
            disabled
            placeholder="AI assistance is prepared for Phase 2."
          />
        </label>

        <div className="mt-5 rounded-[var(--radius)] border border-accent/25 bg-accent-soft px-3 py-2 text-sm text-foreground">
          Prepared for Phase 2. Your project workspace stays unchanged from this panel.
        </div>
      </section>
    </div>
  );
}
