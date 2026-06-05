import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/require-user";
import { listProjects } from "@/lib/projects/queries";
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

type AuthUser = Awaited<ReturnType<typeof requireUser>>;

function metadataValue(user: AuthUser, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function firstNameFromUser(user: AuthUser) {
  const metadataName =
    metadataValue(user, "first_name") ||
    metadataValue(user, "name") ||
    metadataValue(user, "full_name");
  const defaultName = user.email?.split("@")[0].split(/[._-]/)[0] || "Designer";
  const displayName = metadataName.trim() || defaultName;

  return displayName.split(/\s+/)[0] || "Designer";
}

function fullNameFromUser(user: AuthUser) {
  const firstName = metadataValue(user, "first_name");
  const lastName = metadataValue(user, "last_name");
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    metadataValue(user, "full_name") ||
    metadataValue(user, "name");

  return fullName || firstNameFromUser(user);
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
  const projects = await listProjects(user.id);
  const name = fullNameFromUser(user);

  return (
    <AppShell email={user.email} name={name} projects={projects}>
      {children}
    </AppShell>
  );
}
