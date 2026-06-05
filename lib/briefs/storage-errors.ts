export function isProjectBriefsStorageMissing(error: { message?: string } | null) {
  const message = error?.message?.toLowerCase() || "";

  return (
    message.includes("project_briefs") &&
    (message.includes("schema cache") ||
      message.includes("does not exist") ||
      message.includes("could not find"))
  );
}
