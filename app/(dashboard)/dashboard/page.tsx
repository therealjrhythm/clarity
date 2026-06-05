import { CommandCenterHome } from "@/components/dashboard/command-center-home";
import { requireUser } from "@/lib/auth/require-user";
import {
  generateFoundationQuestionsAction,
  getFoundationQuestionHelpAction,
} from "@/lib/briefs/actions";
import { createProject } from "@/lib/projects/actions";
import { listProjects } from "@/lib/projects/queries";

type AuthUser = Awaited<ReturnType<typeof requireUser>>;

function metadataValue(user: AuthUser, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function firstNameFromUser(user: AuthUser) {
  const metadataName =
    metadataValue(user, "first_name") ||
    metadataValue(user, "name") ||
    metadataValue(user, "full_name");
  const defaultName = user.email?.split("@")[0].split(/[._-]/)[0] || "there";
  const displayName = metadataName.trim() || defaultName;

  return displayName.split(/\s+/)[0] || "there";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const projects = await listProjects(user.id);
  const latestProject = projects[0];
  const name = firstNameFromUser(user);

  return (
    <CommandCenterHome
      action={createProject}
      generateQuestions={generateFoundationQuestionsAction}
      getQuestionHelp={getFoundationQuestionHelpAction}
      latestProject={latestProject}
      name={name}
      resetKey={resolvedSearchParams.new}
    />
  );
}
