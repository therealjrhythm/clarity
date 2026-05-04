import type { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>
        <Input
          defaultValue={project?.name}
          id="name"
          name="name"
          placeholder="Acme launch system"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Project type</Label>
        <Input
          defaultValue={project?.type}
          id="type"
          name="type"
          placeholder="Landing page, dashboard, SaaS app"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Short description</Label>
        <Textarea
          defaultValue={project?.description || ""}
          id="description"
          name="description"
          placeholder="What is this project meant to become?"
        />
      </div>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
