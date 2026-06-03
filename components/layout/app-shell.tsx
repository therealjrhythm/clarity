import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { NewProjectEntry } from "@/components/layout/new-project-entry";
import type { Project } from "@/types/project";

export function AppShell({
  email,
  name,
  projects,
  children,
}: {
  email?: string | null;
  name: string;
  projects: Project[];
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar email={email} name={name} projects={projects} />
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        <header className="relative z-30 flex h-14 shrink-0 items-center justify-between px-[18px]">
          <div />
          <NewProjectEntry
            aria-label="New project"
            className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] text-ink-subtle transition-colors duration-150 hover:bg-white/[0.05] hover:text-foreground"
          >
            <Pencil size={18} aria-hidden />
          </NewProjectEntry>
        </header>
        {children}
      </main>
    </div>
  );
}
