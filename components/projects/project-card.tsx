import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import type { Project } from "@/types/project";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      className="group block rounded-[var(--radius)] border border-line bg-background/45 p-5 transition hover:border-accent/55 hover:bg-background/65 hover:shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
      href={`/projects/${project.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] border border-line bg-surface text-accent">
            <Layers3 size={17} aria-hidden />
          </div>
          <h2 className="text-lg font-semibold leading-snug">{project.name}</h2>
          <p className="mt-1 text-sm text-ink-muted">{project.type}</p>
        </div>
        <StatusPill status={project.status} />
      </div>
      <p className="mt-5 line-clamp-2 min-h-10 text-sm leading-5 text-ink-muted">
        {project.description || "Project foundation ready for a sharper design direction."}
      </p>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-ink-muted">
        <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-accent">
          Open <ArrowRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
