import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/types/project";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
