import { Archive } from "lucide-react";
import { archiveProject } from "@/lib/projects/actions";
import { Button } from "@/components/ui/button";

export function ProjectActions({ projectId }: { projectId: string }) {
  const archive = archiveProject.bind(null, projectId);

  return (
    <form action={archive}>
      <Button variant="danger">
        <Archive size={16} aria-hidden />
        Archive Project
      </Button>
    </form>
  );
}
