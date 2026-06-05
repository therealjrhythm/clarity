"use client";

import { GuidedProjectFoundation } from "@/components/projects/guided-project-foundation";
import type {
  FoundationQuestionHelpActionResult,
  FoundationQuestionsActionResult,
} from "@/lib/briefs/actions";
import type { FoundationQuestionHelpRequest } from "@/lib/briefs/types";
import type {
  PendingFoundationContext,
  PendingFoundationSource,
} from "@/lib/design/pending-foundation";

export function PreparationPreview({
  action,
  context,
  generateQuestions,
  getQuestionHelp,
  initialQuestionResult,
  onBack,
}: {
  action: (formData: FormData) => void | Promise<void>;
  context: PendingFoundationContext;
  generateQuestions?: (prompt: string) => Promise<FoundationQuestionsActionResult>;
  getQuestionHelp?: (
    request: FoundationQuestionHelpRequest,
  ) => Promise<FoundationQuestionHelpActionResult>;
  initialQuestionResult?: Extract<FoundationQuestionsActionResult, { ok: true }> | null;
  onBack: () => void;
}) {
  return (
    <GuidedProjectFoundation
      action={action}
      context={context}
      generateQuestions={generateQuestions}
      getQuestionHelp={getQuestionHelp}
      initialQuestionResult={initialQuestionResult}
      onBack={onBack}
    />
  );
}

export type { PendingFoundationContext, PendingFoundationSource };
