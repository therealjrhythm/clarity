"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Sparkles } from "lucide-react";
import {
  AI_MODEL_OPTIONS,
  DEFAULT_AI_MODEL_OPTION_ID,
  type AIModelOption,
} from "@/lib/ai/model-options";

function formatProvider(provider: AIModelOption["provider"]) {
  return provider[0].toUpperCase() + provider.slice(1);
}

export function ModelSelector({ compact = false }: { compact?: boolean }) {
  const [selectedId, setSelectedId] = useState(DEFAULT_AI_MODEL_OPTION_ID);
  const selectedModel = useMemo(
    () =>
      AI_MODEL_OPTIONS.find((model) => model.id === selectedId) ||
      AI_MODEL_OPTIONS[0],
    [selectedId],
  );

  return (
    <div className={compact ? "min-w-0" : "space-y-3"}>
      <label
        className="text-xs font-semibold uppercase text-ink-muted"
        htmlFor={compact ? "model-selector-compact" : "model-selector"}
      >
        Preferred model
      </label>
      <select
        className="mt-2 min-h-10 w-full rounded-[var(--radius)] border border-line bg-surface px-3 text-sm font-semibold text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        id={compact ? "model-selector-compact" : "model-selector"}
        onChange={(event) => setSelectedId(event.target.value)}
        value={selectedId}
      >
        {AI_MODEL_OPTIONS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
      {!compact ? (
        <div className="rounded-[var(--radius)] border border-line bg-background/45 p-3 text-xs leading-5 text-ink-muted">
          <p className="font-semibold text-foreground">
            {selectedModel.label} · {formatProvider(selectedModel.provider)}
          </p>
          <p className="mt-1">{selectedModel.strengths.join(" · ")}</p>
          <p className="mt-2 text-ink-subtle">UI preference only. AI assistance is prepared for Phase 2.</p>
        </div>
      ) : null}
    </div>
  );
}

export function ModelPillSelector({
  selectedId,
  setSelectedId,
}: {
  selectedId: string;
  setSelectedId: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectedModel = useMemo(
    () =>
      AI_MODEL_OPTIONS.find((model) => model.id === selectedId) ||
      AI_MODEL_OPTIONS[0],
    [selectedId],
  );

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="inline-flex h-[34px] items-center gap-[7px] whitespace-nowrap rounded-full border border-line bg-surface-muted px-[11px] text-[13px] font-medium text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-foreground"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Sparkles size={13} aria-hidden className="text-accent" />
        <span>{selectedModel.label}</span>
        <ChevronsUpDown size={13} aria-hidden className="shrink-0" />
      </button>
      {open ? (
        <div className="absolute bottom-[calc(100%+8px)] left-0 z-20 w-[212px] rounded-[13px] border border-line bg-elevated p-1.5 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.7)]">
          <p className="px-2.5 pb-[5px] pt-[7px] font-mono text-[10px] uppercase tracking-[0.13em] text-ink-subtle">
            Preferred model
          </p>
          <div className="grid gap-1">
            {AI_MODEL_OPTIONS.map((model) => (
              <button
                className="flex w-full items-center justify-between gap-3 rounded-[9px] px-2.5 py-[9px] text-left text-[13.5px] text-ink-muted transition-colors duration-[120ms] hover:bg-surface hover:text-foreground"
                key={model.id}
                onClick={() => {
                  setSelectedId(model.id);
                  setOpen(false);
                }}
                type="button"
              >
                <span>{model.label}</span>
                {model.id === selectedId ? (
                  <Check size={15} aria-hidden className="text-accent" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
