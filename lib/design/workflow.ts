import type { ProjectStatus } from "@/types/project";

export type WorkflowStepId =
  | "foundation"
  | "brief"
  | "archetype"
  | "palette"
  | "typography"
  | "references"
  | "layout"
  | "motion"
  | "design-md"
  | "preview"
  | "export";

export type WorkflowStatus = "complete" | "active" | "ready" | "upcoming" | "coming_soon";

export type WorkflowStep = {
  id: WorkflowStepId;
  label: string;
  description: string;
  status?: WorkflowStatus;
  phase: string;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "foundation",
    label: "Foundation",
    description: "Project metadata, ownership, and secure workspace setup.",
    phase: "Phase 1",
  },
  {
    id: "brief",
    label: "Brief",
    description: "Clarify audience, goal, mood, constraints, and the memorable moment.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "archetype",
    label: "Archetype",
    description: "Shape the brand personality and creative direction.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "palette",
    label: "Color Story",
    description: "Create a color story with semantic token roles.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "typography",
    label: "Typography",
    description: "Choose heading, body, accent, and mono type roles.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "references",
    label: "References",
    description: "Collect inspiration and anti-patterns with private storage.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "layout",
    label: "Layout",
    description: "Define composition, hierarchy, spacing, and responsive behavior.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "motion",
    label: "Motion",
    description: "Set animation intensity, interaction rhythm, and reduced-motion behavior.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "design-md",
    label: "DESIGN.md",
    description: "Compile the durable design-system source of truth.",
    phase: "Prepared for Phase 2",
  },
  {
    id: "preview",
    label: "Preview",
    description: "Generate and inspect interface directions safely.",
    phase: "Upcoming",
  },
  {
    id: "export",
    label: "Export",
    description: "Package code, tokens, and design documentation.",
    phase: "Upcoming",
  },
];

const activeStepByProjectStatus: Record<ProjectStatus, WorkflowStepId> = {
  draft: "brief",
  briefing: "brief",
  visual_direction: "archetype",
  palette: "palette",
  references: "references",
  design_system: "design-md",
  generating: "preview",
  ready: "preview",
  exported: "export",
  archived: "foundation",
};

export function getWorkflowStepsForStatus(status: ProjectStatus): WorkflowStep[] {
  const activeStepId = activeStepByProjectStatus[status];
  const activeIndex = WORKFLOW_STEPS.findIndex((step) => step.id === activeStepId);

  return WORKFLOW_STEPS.map((step, index) => {
    let stepStatus: WorkflowStatus = "upcoming";

    if (step.id === "foundation") {
      stepStatus = status === "archived" ? "active" : "complete";
    } else if (index < activeIndex) {
      stepStatus = "complete";
    } else if (index === activeIndex) {
      stepStatus = status === "draft" ? "ready" : "active";
    }

    return {
      ...step,
      status: stepStatus,
    };
  });
}
