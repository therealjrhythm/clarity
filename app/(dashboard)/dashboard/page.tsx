import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectGrid } from "@/components/projects/project-grid";
import { requireUser } from "@/lib/auth/require-user";
import { listProjects } from "@/lib/projects/queries";

export default async function DashboardPage() {
  const user = await requireUser();
  const projects = await listProjects(user.id);

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Project workspace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            Phase 1 supports secure project creation and ownership-scoped
            management. Future workflow steps remain locked until later phases.
          </p>
        </div>
        <ButtonLink href="/projects/new">
          <Plus size={16} aria-hidden />
          New Project
        </ButtonLink>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius)] border border-line bg-surface p-4">
          <p className="text-sm text-ink-muted">Active projects</p>
          <p className="mt-2 text-3xl font-semibold">{projects.length}</p>
        </div>
        <div className="rounded-[var(--radius)] border border-line bg-surface p-4">
          <p className="text-sm text-ink-muted">Credits</p>
          <p className="mt-2 text-3xl font-semibold">Scaffold</p>
        </div>
        <div className="rounded-[var(--radius)] border border-line bg-surface p-4">
          <p className="text-sm text-ink-muted">Current phase</p>
          <p className="mt-2 text-3xl font-semibold">Foundation</p>
        </div>
      </section>

      {projects.length ? (
        <ProjectGrid projects={projects} />
      ) : (
        <EmptyState
          action={
            <ButtonLink href="/projects/new">
              <Plus size={16} aria-hidden />
              Create first project
            </ButtonLink>
          }
          description="Create a simple Phase 1 project record. Conversational onboarding, palettes, references, DESIGN.md, generation, and exports are intentionally deferred."
          title="No projects yet"
        />
      )}
    </div>
  );
}
