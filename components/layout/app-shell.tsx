import type { ReactNode } from "react";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({
  email,
  children,
}: {
  email?: string | null;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Topbar email={email} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
