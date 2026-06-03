import { ProjectFoundation } from "@/components/projects/project-foundation";
import { createProject } from "@/lib/projects/actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  return (
    <ProjectFoundation
      action={createProject}
      fromPreparation={resolvedSearchParams.from === "preparation"}
    />
  );
}
