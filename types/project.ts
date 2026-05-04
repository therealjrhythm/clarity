export const projectStatuses = [
  "draft",
  "briefing",
  "visual_direction",
  "palette",
  "references",
  "design_system",
  "generating",
  "ready",
  "exported",
  "archived",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Project = {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  description: string | null;
  status: ProjectStatus;
  thumbnail_path: string | null;
  current_design_system_version_id: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};
