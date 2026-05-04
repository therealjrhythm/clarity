import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/require-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

function SetupRequired() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <section className="rounded-[var(--radius)] border border-line bg-surface p-6">
        <h1 className="text-2xl font-semibold">Supabase configuration required</h1>
        <p className="mt-3 text-sm leading-6 text-ink-muted">
          Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to
          your local environment to use authenticated dashboard routes. The app
          is structured so missing credentials do not block build-time checks.
        </p>
      </section>
    </main>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const user = await requireUser();

  return <AppShell email={user.email}>{children}</AppShell>;
}
