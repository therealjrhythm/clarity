"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Sparkles, X } from "lucide-react";
import { reviewOverviewSectionAction } from "@/lib/briefs/actions";
import type { OverviewSectionReview } from "@/lib/briefs/types";
import { Button } from "@/components/ui/button";

type ReviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { message: string; status: "error" }
  | { data: OverviewSectionReview; status: "success" };

export function OverviewAIReviewButton({
  description,
  projectId,
  sectionContent,
  sectionId,
  sectionTitle,
  variant = "ghost",
}: {
  description: string;
  projectId: string;
  sectionContent: string;
  sectionId: string;
  sectionTitle: string;
  variant?: "ghost" | "secondary";
}) {
  const [open, setOpen] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [state, setState] = useState<ReviewState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  function runReview(nextFollowUp = followUp) {
    setOpen(true);
    setState({ status: "loading" });
    startTransition(async () => {
      const result = await reviewOverviewSectionAction(projectId, {
        followUp: nextFollowUp.trim() || undefined,
        sectionContent,
        sectionId,
        sectionTitle,
      });

      if (result.ok) {
        setState({ data: result.data, status: "success" });
      } else {
        setState({ message: result.error.message, status: "error" });
      }
    });
  }

  return (
    <>
      <Button
        className="shrink-0"
        onClick={() => runReview("")}
        type="button"
        variant={variant}
      >
        <Sparkles size={16} aria-hidden />
        Get help with AI
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-sm">
          <button
            aria-label="Close AI review"
            className="absolute inset-0 cursor-default"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside
            aria-modal="true"
            className="relative flex h-full w-full max-w-[460px] flex-col border-l border-line bg-surface shadow-2xl"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                  AI Review
                </p>
                <h2 className="mt-2 text-xl font-semibold">{sectionTitle}</h2>
              </div>
              <Button
                aria-label="Close AI review"
                onClick={() => setOpen(false)}
                type="button"
                variant="ghost"
              >
                <X size={16} aria-hidden />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <p className="text-sm leading-6 text-ink-muted">{description}</p>

              {state.status === "loading" || isPending ? (
                <div className="mt-6 rounded-[18px] border border-line bg-background/45 p-5">
                  <p className="text-sm font-semibold">Reviewing this section...</p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Clarity is checking this section against the saved project
                    context.
                  </p>
                </div>
              ) : null}

              {state.status === "error" ? (
                <div className="mt-6 rounded-[18px] border border-danger/35 bg-danger/10 p-5">
                  <p className="text-sm font-semibold">
                    Clarity couldn&apos;t review this section.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    {state.message}
                  </p>
                  <Button className="mt-4" onClick={() => runReview()} type="button">
                    <RefreshCw size={16} aria-hidden />
                    Retry
                  </Button>
                </div>
              ) : null}

              {state.status === "success" ? (
                <div className="mt-6 space-y-4">
                  <section className="rounded-[18px] border border-line bg-background/45 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                      Quick read
                    </p>
                    <p className="mt-3 text-sm leading-6 text-foreground">
                      {state.data.quickRead}
                    </p>
                  </section>
                  <section className="rounded-[18px] border border-line bg-background/45 p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                      What is working
                    </p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
                      {state.data.whatWorks.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                  {state.data.suggestions.length ? (
                    <section className="rounded-[18px] border border-line bg-background/45 p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                        Suggestions
                      </p>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
                        {state.data.suggestions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {state.data.suggestedRefinement ? (
                    <section className="rounded-[18px] border border-accent/30 bg-accent-soft p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-accent">
                        Suggested refinement
                      </p>
                      <p className="mt-3 text-sm leading-6 text-foreground">
                        {state.data.suggestedRefinement}
                      </p>
                    </section>
                  ) : null}
                  {state.data.followUpQuestion ? (
                    <p className="rounded-[16px] border border-line bg-background/35 p-4 text-sm leading-6 text-ink-muted">
                      {state.data.followUpQuestion}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="border-t border-line p-5">
              <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Follow-up
                <textarea
                  className="mt-2 min-h-20 w-full resize-none rounded-[14px] border border-line bg-background/45 px-3 py-3 text-sm text-foreground outline-none focus:border-accent/50"
                  onChange={(event) => setFollowUp(event.target.value)}
                  placeholder="Ask Clarity to make the review more specific..."
                  value={followUp}
                />
              </label>
              <Button
                className="mt-3 w-full"
                disabled={isPending || !followUp.trim()}
                onClick={() => runReview(followUp)}
                type="button"
              >
                Ask follow-up
              </Button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
