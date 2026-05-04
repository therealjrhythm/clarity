import Link from "next/link";
import { Settings } from "lucide-react";
import { ProjectPhaseRail } from "@/components/projects/project-phase-rail";
import { ButtonLink } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { requireUser } from "@/lib/auth/require-user";
import { requireOwnedProject } from "@/lib/projects/ownership";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const project = await requireOwnedProject(projectId, user.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-[var(--radius)] border border-line bg-surface p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold">{project.name}</h1>
              <StatusPill status={project.status} />
            </div>
            <p className="mt-2 text-sm text-ink-muted">{project.type}</p>
          </div>
          <ButtonLink href={`/projects/${project.id}/settings`} variant="secondary">
            <Settings size={16} aria-hidden />
            Settings
          </ButtonLink>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Project intent
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-muted">
            {project.description ||
              "No project description has been added yet. Update basic metadata in settings."}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            "Conversational brief",
            "Archetype direction",
            "Color Palette Picker",
            "Reference board",
            "DESIGN.md compiler",
            "Preview and export",
          ].map((item) => (
            <div
              className="rounded-[var(--radius)] border border-line bg-background p-4 opacity-65"
              key={item}
            >
              <p className="text-sm font-semibold">{item}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
                Deferred
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-muted">
          Back to{" "}
          <Link className="font-semibold text-accent" href="/dashboard">
            dashboard
          </Link>
        </p>
      </section>

      <ProjectPhaseRail />
    </div>
  );
}
