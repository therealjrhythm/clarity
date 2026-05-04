import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent bg-accent text-accent-foreground hover:bg-[#1b463d]",
  secondary:
    "border-line bg-surface text-foreground hover:border-foreground/35 hover:bg-white",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-surface-muted",
  danger:
    "border-danger bg-danger text-white hover:bg-[#812525]",
};

const base =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius)] border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

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
