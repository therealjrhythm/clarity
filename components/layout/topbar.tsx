import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export function Topbar({ email }: { email?: string | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/82 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3 font-semibold" href="/dashboard">
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] border border-accent/35 bg-accent-soft text-sm text-accent">
            C
          </span>
          <span>Clarity</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden max-w-56 truncate text-sm text-ink-muted sm:block">
            {email}
          </span>
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
