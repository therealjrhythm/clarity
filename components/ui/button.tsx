import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-foreground shadow-[0_12px_34px_rgba(216,161,93,0.18)] hover:bg-[#efbd78]",
  secondary:
    "border-line bg-surface text-foreground hover:border-line-strong hover:bg-surface-muted",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-surface-muted/75",
  danger:
    "border-danger bg-danger text-white hover:bg-[#c95757]",
};

const base =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius)] border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className={cn(base, variants[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
