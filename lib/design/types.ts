export type BrandBrief = {
  projectName: string;
  audience?: string;
  primaryGoal?: string;
  emotionalCore?: string[];
  antiPatterns?: string[];
  signatureMoment?: string;
};

export type BrandArchetype = {
  id: string;
  name: string;
  mood: string[];
  bestFor: string[];
  risks: string[];
};

export type ColorRole =
  | "background"
  | "surface"
  | "surfaceElevated"
  | "primaryText"
  | "secondaryText"
  | "mutedText"
  | "primaryAccent"
  | "secondaryAccent"
  | "highlight"
  | "border"
  | "success"
  | "warning"
  | "danger";

export type ColorToken = {
  role: ColorRole;
  name: string;
  value: string;
  usage: string;
};

export type ColorStory = {
  id: string;
  name: string;
  bestFor: string;
  emotionalRead: string[];
  tokens: ColorToken[];
  rationale: string;
  watchOut?: string;
  source: "ai" | "manual" | "reference" | "hybrid";
  selected?: boolean;
};

export type TypographyRole = "heading" | "body" | "accent" | "mono";

export type FontSource = "google" | "system" | "custom";

export type TypographyDirection = {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  accentFont?: string;
  monoFont?: string;
  source: FontSource;
  emotionalRead: string[];
  bestFor: string[];
  rationale: string;
  watchOut?: string;
};

export type LayoutDirection = {
  id: string;
  name: string;
  structure: string;
  hierarchy: string[];
  spacingMode: "compact" | "balanced" | "spacious" | "editorial";
};

export type MotionDirection = {
  id: string;
  name: string;
  intensity: "none" | "subtle" | "expressive";
  behaviors: string[];
  reducedMotionFallback: string;
};

export type ArtDirection = {
  id: string;
  name: string;
  mood: string[];
  materials: string[];
  imageDirection?: string;
};

export type DesignTokens = {
  colors: ColorToken[];
  typography?: TypographyDirection;
  layout?: LayoutDirection;
  motion?: MotionDirection;
};

export type DesignSystemVersion = {
  id: string;
  projectId: string;
  versionNumber: number;
  designMd: string;
  tokens: DesignTokens;
  createdAt: string;
};
