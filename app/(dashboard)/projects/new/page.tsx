import { ProjectForm } from "@/components/projects/project-form";
import { createProject } from "@/lib/projects/actions";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Phase 1
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create project</h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          This is a simple project metadata form. The conversational brief starts
          in Phase 2.
        </p>
      </header>
      <section className="mt-8 rounded-[var(--radius)] border border-line bg-surface p-6">
        <ProjectForm action={createProject} submitLabel="Create project" />
      </section>
    </div>
  );
}
