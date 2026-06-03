"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { clearPendingFoundation } from "@/lib/design/pending-foundation";

export function NewProjectEntry({
  ariaLabel = "New project",
  children,
  className,
}: {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();

  function startNewProject() {
    clearPendingFoundation();
    router.push(`/dashboard?new=${Date.now()}`);
  }

  return (
    <button
      aria-label={ariaLabel}
      className={className}
      onClick={startNewProject}
      type="button"
    >
      {children}
    </button>
  );
}
