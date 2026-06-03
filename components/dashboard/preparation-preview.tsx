"use client";

import { GuidedProjectFoundation } from "@/components/projects/guided-project-foundation";
import type {
  PendingFoundationContext,
  PendingFoundationSource,
} from "@/lib/design/pending-foundation";

export function PreparationPreview({
  action,
  context,
  onBack,
}: {
  action: (formData: FormData) => void | Promise<void>;
  context: PendingFoundationContext;
  onBack: () => void;
}) {
  return (
    <GuidedProjectFoundation
      action={action}
      context={context}
      onBack={onBack}
    />
  );
}

export type { PendingFoundationContext, PendingFoundationSource };
