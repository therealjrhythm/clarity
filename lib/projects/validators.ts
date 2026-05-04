import { z } from "zod";

export const projectFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must be 100 characters or fewer"),
  type: z
    .string()
    .trim()
    .min(2, "Project type is required")
    .max(80, "Project type must be 80 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer")
    .optional()
    .transform((value) => value || null),
});

export function parseProjectForm(formData: FormData) {
  return projectFormSchema.parse({
    name: formData.get("name"),
    type: formData.get("type"),
    description: formData.get("description"),
  });
}
