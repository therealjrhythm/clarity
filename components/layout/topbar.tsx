import Link from "next/link";
import { LogOut, Plus } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { Button, ButtonLink } from "@/components/ui/button";

export function Topbar({ email }: { email?: string | null }) {
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="font-semibold tracking-wide" href="/dashboard">
          Clarity
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-56 truncate text-sm text-ink-muted sm:block">
            {email}
          </span>
          <ButtonLink href="/projects/new" variant="secondary">
            <Plus size={16} aria-hidden />
            New Project
          </ButtonLink>
          <form action={signOut}>
            <Button aria-label="Sign out" variant="ghost">
              <LogOut size={16} aria-hidden />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
