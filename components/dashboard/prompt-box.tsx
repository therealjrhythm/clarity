"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Mic, Plus } from "lucide-react";
import { ModelPillSelector } from "@/components/ai/model-selector";

export function PromptBox({
  modelId,
  onSubmit,
  setModelId,
  setValue,
  value,
}: {
  modelId: string;
  onSubmit: () => void;
  setModelId: (id: string) => void;
  setValue: (value: string) => void;
  value: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = value.trim().length > 0;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [value]);

  return (
    <section
      className="w-full rounded-[24px] border border-line bg-surface p-[8px_8px_8px_4px] shadow-[0_24px_70px_-28px_rgba(217,161,94,0.2),0_12px_40px_-20px_rgba(0,0,0,0.7)] transition-[border-color,box-shadow] duration-[180ms] focus-within:border-[#34373f] focus-within:shadow-[0_0_0_2px_rgba(217,161,94,0.045),0_24px_70px_-28px_rgba(217,161,94,0.2),0_12px_40px_-20px_rgba(0,0,0,0.7)]"
      data-clarity-prompt
    >
      <textarea
        className="block max-h-[220px] w-full resize-none border-none bg-transparent p-[14px_16px_6px] text-[16.5px] leading-[1.5] text-foreground outline-none placeholder:text-ink-subtle"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Describe what you want to design…"
        ref={textareaRef}
        rows={1}
        value={value}
      />
      <div className="flex items-center justify-between p-[2px_6px_2px_10px]">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            aria-label="Attach references"
            className="grid h-[34px] w-[34px] place-items-center rounded-[9px] text-ink-subtle transition-colors duration-150 hover:bg-white/[0.05] hover:text-foreground"
            type="button"
          >
            <Plus size={19} aria-hidden />
          </button>
          <ModelPillSelector selectedId={modelId} setSelectedId={setModelId} />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Voice input"
            className="grid h-[34px] w-[34px] place-items-center rounded-[9px] text-ink-subtle transition-colors duration-150 hover:bg-white/[0.05] hover:text-foreground"
            type="button"
          >
            <Mic size={18} aria-hidden />
          </button>
          <button
            aria-label="Prepare workspace"
            className="grid h-[38px] w-[38px] place-items-center rounded-full bg-surface-muted text-ink-subtle transition duration-[180ms] enabled:bg-accent enabled:text-accent-foreground enabled:shadow-[0_4px_16px_-4px_rgba(217,161,94,0.5)] enabled:hover:-translate-y-px enabled:hover:brightness-[1.06] disabled:cursor-default"
            disabled={!canSubmit}
            onClick={onSubmit}
            type="button"
          >
            <ArrowUp size={18} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
