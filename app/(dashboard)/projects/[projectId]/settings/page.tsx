import { ProjectActions } from "@/components/projects/project-actions";
import { ProjectForm } from "@/components/projects/project-form";
import { updateProject } from "@/lib/projects/actions";
import { requireUser } from "@/lib/auth/require-user";
import { requireOwnedProject } from "@/lib/projects/ownership";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const project = await requireOwnedProject(projectId, user.id);
  const update = updateProject.bind(null, project.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-sm font-semibold text-accent">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Edit project</h1>
      </header>

      <section className="rounded-[var(--radius)] border border-line bg-surface p-6">
        <ProjectForm action={update} project={project} submitLabel="Save changes" />
      </section>

      <section className="rounded-[var(--radius)] border border-danger/25 bg-surface p-6">
        <h2 className="text-lg font-semibold">Archive project</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Archiving hides this project from the dashboard without hard-deleting
          future phase data.
        </p>
        <div className="mt-5">
          <ProjectActions projectId={project.id} />
        </div>
      </section>
    </div>
  );
}
