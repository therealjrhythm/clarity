import { cn } from "@/lib/utils";

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold capitalize text-ink-muted",
        className,
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
