"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AIHelpPanel } from "@/components/ai/ai-help-panel";
import { Button } from "@/components/ui/button";

export function AIHelpButton({
  description,
  sectionName,
  variant = "ghost",
}: {
  description: string;
  sectionName: string;
  variant?: "secondary" | "ghost";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="shrink-0"
        onClick={() => setOpen(true)}
        type="button"
        variant={variant}
      >
        <Sparkles size={16} aria-hidden />
        Get help with AI
      </Button>
      {open ? (
        <AIHelpPanel
          description={description}
          onClose={() => setOpen(false)}
          sectionName={sectionName}
        />
      ) : null}
    </>
  );
}
