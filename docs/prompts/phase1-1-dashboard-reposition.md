# Clarity Phase 1.1 Implementation Prompt  
## Dashboard Reposition + DESIGN.md Alignment + Future Workflow Preparation

You are working inside an existing Git repository for **Clarity**, an AI-powered design application.

Clarity’s tagline is:

> Design with intention. Build with intelligence.

Clarity helps users turn project intent, brand context, references, color stories, typography, layout direction, motion direction, and design strategy into production-ready design systems and interfaces.

The current repo already includes a Phase 1 Modern Foundation build using:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase SSR auth with `@supabase/ssr`
- Supabase Postgres
- Supabase Storage
- Zod validation where useful
- Basic dashboard
- Project creation
- Project detail page
- Authenticated project ownership

The current build is intentionally foundation-only. Do **not** break auth, project ownership, Supabase SSR, or the existing project creation flow.

---

# Primary Goal

Implement **Phase 1.1: Dashboard Reposition + Workflow Preparation**.

The app currently feels like a light scaffold/admin dashboard. Update it so Clarity feels like a dark, moody, sleek, premium, modern design-system workspace.

The product should feel like:

```text
A creative command center for building intentional design systems.
Dark, atmospheric, sleek, editorial, intelligent, and premium.
```

Do not make it look like a generic SaaS dashboard.

Do not make it look like a basic Supabase scaffold.

Do not implement full AI generation yet unless existing infrastructure already supports it safely.

---

# Critical Source of Truth Rule

Use the project’s `DESIGN.md` framework as the **truth** for Clarity’s design intelligence.

If a `DESIGN.md` file does not exist in the repo yet, create one at:

```text
docs/DESIGN.md
```

This file should represent Clarity’s internal design brain and should include or preserve the following concepts:

- Approval Gate
- Consultative Design Intake
- Brand Archetype System
- Dynamic Color Story Picker
- Dynamic Typography Picker
- Visual Hierarchy System
- Layout Composition System
- Spacing and Rhythm System
- Art Direction System
- Shape Language
- Texture and Material Direction
- Motion and Animation System
- Interaction State System
- Voice and Copy Direction
- Conversion Strategy
- Responsive Behavior
- Accessibility Requirements
- Reference Interpretation Rules
- Anti-Repetition Rule
- Template Recipes
- Design Tokens and Export Format
- Clarity App Brain Format

Do not delete or ignore the existing docs. Preserve important information from:

```text
AGENTS.md
architecture.md
database-schema.md
product-spec-v2.md
README.md
docs/decisions/*
```

If any new decisions are made, add an ADR in:

```text
docs/decisions/
```

Suggested ADR:

```text
0003-use-design-md-v4-as-clarity-brain.md
```

The ADR should state that Clarity uses `DESIGN.md` as the durable design-intelligence source of truth for brand intake, palette generation, typography, layout, motion, tokens, preview, and export.

---

# Current Build Rule

Focus on Phase 1.1 only.

You may update:

- Dashboard page
- Project cards
- Project detail page
- Workflow sidebar/stepper
- Visual style/theme
- App shell/nav
- Copywriting
- Placeholder components for future phases
- TypeScript types/interfaces for future modules
- Docs/changelog
- Basic UI-only model selector placeholder
- Basic UI-only “Get help with AI” affordances
- Basic UI-only typography and palette placeholders

Do **not** fully implement:

- Live AI generation routes
- Reference image analysis
- Palette generation backend
- Typography API integration
- DESIGN.md compiler backend
- Figma export
- Webflow export
- One-click deployment
- Billing
- Team collaboration
- Unsafe iframe/code execution
- Public storage buckets for private user content

It is okay to scaffold future-ready folders/types/components, but do not ship fake backend functionality as if it works.

If a feature is not functional yet, label it clearly as:

```text
Coming soon
```

or

```text
Prepared for Phase 2
```

Do not use “Deferred” or “Locked” as the main user-facing language. Use friendlier language like:

- Ready
- Next
- Upcoming
- In progress
- Complete
- Coming soon

---

# Visual Direction

Redesign the dashboard and project detail experience to be:

```yaml
visual_direction:
  mood:
    - dark
    - moody
    - sleek
    - premium
    - intelligent
    - creative
    - atmospheric
    - modern design-system workspace
  style:
    - dark studio interface
    - subtle glow
    - elegant panel system
    - strong typography
    - premium design tool energy
    - restrained gradients
    - clear workflow hierarchy
  avoid:
    - generic SaaS dashboard
    - flat admin UI
    - overly bright palette
    - childish colors
    - excessive glassmorphism
    - random neon overload
    - scaffold copy
```

Recommended Clarity app palette:

```css
:root {
  --clarity-bg: #08090D;
  --clarity-bg-soft: #101116;
  --clarity-panel: rgba(20, 22, 30, 0.86);
  --clarity-panel-strong: rgba(28, 31, 42, 0.94);
  --clarity-text: #F5F2EA;
  --clarity-text-muted: #A8A29A;
  --clarity-text-subtle: #756F66;
  --clarity-line: rgba(245, 242, 234, 0.10);
  --clarity-line-strong: rgba(245, 242, 234, 0.18);
  --clarity-accent: #D8A15D;
  --clarity-accent-2: #7C9DFF;
  --clarity-accent-3: #8EE6C9;
  --clarity-danger: #E06A6A;
  --clarity-success: #88D498;
}
```

Use the palette in Tailwind-compatible form if the project uses Tailwind tokens.

The interface should include atmospheric details but stay tasteful:

- Dark gradient background
- Subtle grid/noise texture if easy and performant
- Soft amber/blue highlights
- Elevated panels
- Premium shadows
- Elegant borders
- Micro-interactions on cards/buttons
- Clear focus states

Respect `prefers-reduced-motion`.

---

# Typography Direction for Clarity App Itself

For the Clarity product UI, use a premium design-tool typography system.

Recommended:

```yaml
clarity_app_typography:
  heading_font: "Instrument Serif or Geist"
  body_font: "Inter, Manrope, or Geist Sans"
  mono_font: "IBM Plex Mono or Geist Mono"
```

If importing Google Fonts, avoid overloading the app with too many font files.

The app UI should feel refined and highly readable.

---

# Dashboard Redesign Requirements

Replace the current dashboard feel with a premium creative workspace.

## Dashboard Should Include

1. Top app shell/nav
2. Dark moody background
3. Workspace hero/header
4. Primary CTA: `New Project` or `Start a Design System`
5. Secondary CTA: `Import References` or `Explore Workflow`
6. Project summary cards
7. Continue Working section
8. Project Library
9. Clarity Pipeline module
10. Optional right rail or bottom panel with design guidance
11. “Get help with AI” button/affordance in every major section

## Dashboard Copy

Avoid internal scaffold language.

Replace wording like:

```text
Phase 1 supports secure project creation and ownership-scoped management.
Future workflow steps remain locked until later phases.
```

With product-facing copy like:

```text
Turn rough ideas into clear design systems, visual directions, and production-ready interfaces.
```

Or:

```text
Your workspace for shaping brand intent, color stories, typography systems, references, and interface direction.
```

## Suggested Dashboard Structure

```text
Top Nav
  - Clarity logo
  - Search or command placeholder
  - Model selector placeholder
  - Get help with AI
  - New Project
  - Account

Hero / Workspace Header
  - Welcome back
  - “What are we designing today?”
  - Short Clarity value statement
  - Start a Design System CTA
  - Import References CTA

Stats / Snapshot
  - Active projects
  - Ready to continue
  - Design systems
  - Credits

Main Content
  - Continue Working card
  - Project Library cards

Right Rail / Pipeline
  - Clarity Pipeline
  - Brief → Direction → Palette → Typography → References → DESIGN.md → Preview → Export
  - Current recommended next step
```

---

# Project Card Requirements

Project cards should feel like mini design-system records, not admin rows.

For each project card show:

- Project name
- Project type
- Status
- Short description
- Last updated
- Current phase
- Next recommended step
- Optional placeholder AI read
- Eventually color chips if palette exists
- Continue/Open action

For now, if no AI read exists, derive a lightweight non-AI placeholder from the description or show:

```text
AI Read prepared for Phase 2
```

For Teddy Wear example, card could show:

```text
Teddy Wear
Website · Draft

Luxury clothing for teddy bears.

Likely direction:
Playful luxury · Soft premium · Giftable

Next:
Complete Brand Brief
```

Do not fake persistent AI-generated results unless the data exists. UI placeholders are okay.

---

# Project Detail Page Redesign Requirements

The project detail page should feel like a **Design Direction Board**, not a lock screen.

Current cards like:

```text
Conversational brief — Deferred
Archetype direction — Deferred
Color Palette Picker — Deferred
Reference board — Deferred
DESIGN.md compiler — Deferred
Preview and export — Deferred
```

Should become something like:

```text
Brand Brief — Ready
Archetype Direction — Upcoming
Color Story — Upcoming
Typography System — Upcoming
Reference Board — Upcoming
Layout Direction — Upcoming
Motion & Interaction — Upcoming
DESIGN.md Compiler — Upcoming
Preview — Upcoming
Export — Upcoming
```

Add missing steps from the new DESIGN.md framework:

- Typography System
- Layout Direction
- Motion & Interaction
- Tokens, either as its own step or under DESIGN.md

Preferred workflow:

```text
Foundation
Brief
Archetype
Palette
Typography
References
Layout
Motion
DESIGN.md
Preview
Export
```

If you need to group steps, use:

```text
Foundation
Brief
Creative Direction
  - Archetype
  - Palette
  - Typography
  - References
Design System
  - Layout
  - Motion
  - Tokens
  - DESIGN.md
Preview
Export
```

The project detail page should include:

1. Project header
2. Project intent
3. AI Read / Brand Cue Interpretation placeholder
4. Next recommended step card
5. Workflow grid/cards
6. Workflow side panel or progress rail
7. Get help with AI button in each section
8. Settings button preserved
9. Back to dashboard link preserved

---

# AI Help Button Requirement

Add a visible **Get help with AI** button or small AI help affordance in every major section:

- Dashboard hero
- Continue Working
- Project Library
- Project detail header
- Project Intent
- AI Read
- Workflow grid
- Each future workflow step card if reasonable
- Palette placeholder
- Typography placeholder
- References placeholder
- DESIGN.md placeholder

For now, the AI help button can open a modal, drawer, or popover with placeholder content.

Example placeholder:

```text
AI Help is prepared for Phase 2.

Soon, Clarity will help you answer this section, generate options, explain recommendations, and refine your design system.
```

The modal/drawer should include a model selector UI placeholder.

Do not implement live provider calls yet unless the project already has secure AI routing.

---

# AI Model Selection Requirements

Prepare a future-ready model selector.

The user should eventually be able to choose their preferred AI model.

Required model labels/options:

```yaml
ai_models:
  - id: "gemini-3-5-flash"
    label: "Gemini 3.5 Flash"
    provider: "google"
    strengths:
      - "fast ideation"
      - "lightweight generation"
      - "cost-efficient drafts"

  - id: "claude-opus-4-8"
    label: "Claude Opus 4.8"
    provider: "anthropic"
    strengths:
      - "deep creative direction"
      - "brand reasoning"
      - "long-form design analysis"

  - id: "claude-opus-4-7"
    label: "Claude Opus 4.7"
    provider: "anthropic"
    strengths:
      - "strategic reasoning"
      - "complex design-system writing"

  - id: "claude-sonnet-latest"
    label: "Claude Sonnet Latest"
    provider: "anthropic"
    strengths:
      - "balanced speed and quality"
      - "UI copy"
      - "structured design generation"

  - id: "gpt-5-5"
    label: "GPT-5.5"
    provider: "openai"
    strengths:
      - "high-quality creative reasoning"
      - "design-system generation"
      - "code-aware interface planning"
```

Important implementation rule:

Do not hard-code provider SDK calls into UI components.

Create a provider-agnostic model config file such as:

```text
lib/ai/model-options.ts
```

or

```text
src/lib/ai/model-options.ts
```

Export model metadata from there.

Example TypeScript shape:

```ts
export type AIProvider = "openai" | "anthropic" | "google";

export type AIModelOption = {
  id: string;
  label: string;
  provider: AIProvider;
  strengths: string[];
  recommendedFor?: string[];
  enabled: boolean;
};

export const AI_MODEL_OPTIONS: AIModelOption[] = [
  // models here
];
```

The selected model can be UI-only for now.

If there is already a settings table or profile preferences table, store a placeholder selected model only if it fits the existing architecture safely. Otherwise keep it local component state and note future persistence in docs.

---

# Typography System Feature Preparation

The Typography System is a major Clarity feature.

Do not bury typography inside `DESIGN.md` only. It needs to become a visible product step.

For now, create robust UI scaffolding and types.

## Typography Feature Requirements

Users should eventually be able to:

1. Receive 3 AI-recommended font systems based on project context.
2. Choose from all available Google Fonts.
3. Preview fonts live.
4. Mix and match heading, body, accent, and mono fonts.
5. See how fonts look in real UI fragments.
6. Approve a typography system into the project’s design system.
7. Export font choices into `DESIGN.md`, tokens, CSS variables, and generated code.

## Current Phase 1.1 Scope

Build UI placeholders/components/types that prepare this feature, but do not implement full Google Fonts API integration unless easy and safe.

Create components such as:

```text
components/typography/TypographySystemPreview.tsx
components/typography/TypographyRecommendationCard.tsx
components/typography/FontPairingPreview.tsx
```

or use the existing project structure naming conventions.

Create future-ready types:

```ts
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
```

## Typography UI Should Show

For each recommendation:

- Name
- Heading font
- Body font
- Accent font
- Mono font
- Emotional read
- Why it works
- Watch out
- Live sample:
  - Hero headline
  - Paragraph
  - Button
  - Product card title
  - Data label

## Example Typography Recommendations for Teddy Wear

Do not hard-code these as universal. Use them only as sample/placeholder content if needed.

```yaml
option_1:
  name: "Boutique Soft Luxury"
  heading_font: "Fraunces"
  body_font: "Nunito Sans"
  accent_font: "Fraunces"
  emotional_read:
    - soft
    - charming
    - premium
    - tactile

option_2:
  name: "Modern Heirloom"
  heading_font: "Cormorant Garamond"
  body_font: "Manrope"
  accent_font: "Manrope"
  emotional_read:
    - elegant
    - editorial
    - refined
    - fashion-forward

option_3:
  name: "Playful Premium"
  heading_font: "Lora"
  body_font: "Plus Jakarta Sans"
  accent_font: "Plus Jakarta Sans"
  emotional_read:
    - polished
    - approachable
    - warm
    - modern
```

## Google Fonts Requirement

Eventually, the user must be able to choose from all available Google Fonts.

For Phase 1.1, add a clear placeholder or architecture note:

```text
Google Fonts browser/search prepared for Phase 2.
```

Do not ship a tiny fixed font list as if it is final.

A small starter list is acceptable only as fallback/mock data.

---

# Color Palette Picker Feature Preparation

The Color Palette Picker is a signature Clarity feature.

It should eventually lay out palettes beautifully and help users understand how the colors work together.

## Palette Feature Requirements

Users should eventually be able to:

1. Receive AI-recommended color stories based on brand/project context.
2. See 3 or more palette options.
3. Understand why each palette works.
4. View hex codes and color roles.
5. Preview each palette on UI fragments.
6. Create their own palette manually.
7. Lock colors and ask AI to generate variations.
8. Generate light/dark variants.
9. Check accessibility/contrast.
10. Save the selected palette into `DESIGN.md` and design tokens.

## Current Phase 1.1 Scope

Build UI placeholders/components/types only.

Create components such as:

```text
components/palette/PaletteStoryCard.tsx
components/palette/PalettePreview.tsx
components/palette/PaletteRoleGrid.tsx
components/palette/PaletteMiniUI.tsx
```

Create future-ready types:

```ts
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
```

## Palette UI Should Show

For each palette:

- Palette name
- Emotional read
- Best for
- Full color strip
- Role-based swatches
- Hex codes
- Mini hero preview
- Button preview
- Card preview
- Accessibility placeholder/check area
- Actions:
  - Preview
  - Select
  - Customize
  - Generate variations with AI

For Phase 1.1, actions may be disabled or marked `Coming soon`.

## Example Palette Placeholder for Teddy Wear

Use sample content only if helpful:

```yaml
name: "Heirloom Honey"
background: "#F7EFE3"
surface: "#FFF9F1"
primary_text: "#2D241C"
secondary_text: "#7D6A58"
primary_accent: "#B9824A"
secondary_accent: "#E7CFA9"
highlight: "#F3DDAE"
success: "#7E9F78"
warning: "#C98A3D"
danger: "#B65C55"
```

Do not make this the universal default for all projects.

---

# Workflow Step Updates

Update workflow labels and internal step definitions to include the full Clarity/DESIGN.md direction.

Recommended workflow steps:

```ts
export const WORKFLOW_STEPS = [
  {
    id: "foundation",
    label: "Foundation",
    description: "Project metadata and ownership.",
  },
  {
    id: "brief",
    label: "Brief",
    description: "Clarify audience, goal, mood, and constraints.",
  },
  {
    id: "archetype",
    label: "Archetype",
    description: "Choose the brand/design personality.",
  },
  {
    id: "palette",
    label: "Palette",
    description: "Create a color story and token roles.",
  },
  {
    id: "typography",
    label: "Typography",
    description: "Select heading, body, accent, and mono fonts.",
  },
  {
    id: "references",
    label: "References",
    description: "Collect visual references and anti-patterns.",
  },
  {
    id: "layout",
    label: "Layout",
    description: "Define page structure, spacing, and hierarchy.",
  },
  {
    id: "motion",
    label: "Motion",
    description: "Set animation and interaction behavior.",
  },
  {
    id: "design-md",
    label: "DESIGN.md",
    description: "Compile the durable design-system source of truth.",
  },
  {
    id: "preview",
    label: "Preview",
    description: "Generate and inspect interface output.",
  },
  {
    id: "export",
    label: "Export",
    description: "Export code, tokens, and design docs.",
  },
] as const;
```

Statuses:

```ts
export type WorkflowStatus =
  | "complete"
  | "active"
  | "ready"
  | "upcoming"
  | "coming_soon";
```

Avoid using `locked` as primary UI language unless there is a real permission or billing lock.

---

# Design Direction Board Preparation

Prepare the project detail page to eventually become a Design Direction Board.

Even before the real features exist, structure the page around:

```text
Project Intent
AI Read
Next Step
Workflow
Design System Preview
```

AI Read placeholder should map to `DESIGN.md` brand cue interpretation:

```yaml
brand_cue_interpretation:
  inferred_traits: []
  design_risks: []
  design_goal: []
```

If no AI data exists, show a tasteful placeholder:

```text
Clarity will interpret this project’s brand cues in the Brief phase.
```

---

# Data Model / Types Preparation

Do not create unnecessary database migrations unless required.

But do create TypeScript types/interfaces that prepare the future architecture.

Suggested file:

```text
lib/design/types.ts
```

or project-appropriate path.

Include types for:

- ClarityProject
- WorkflowStep
- WorkflowStatus
- BrandBrief
- BrandArchetype
- ColorStory
- TypographyDirection
- LayoutDirection
- MotionDirection
- ArtDirection
- DesignTokens
- DesignSystemVersion
- AIModelOption

Do not store all future data on the existing `projects` table.

Respect existing database guidance:

> Future generated outputs should not be stored directly on the `projects` table.

If adding migration notes, propose future tables:

```text
project_briefs
visual_directions
color_stories
typography_directions
reference_assets
reference_analyses
layout_directions
motion_directions
design_system_versions
design_tokens
generation_jobs
exports
```

But do not implement all migrations unless instructed.

---

# Documentation Updates

Update relevant docs after implementation:

1. `README.md`
2. `docs/changelog.md` or existing changelog location
3. `docs/architecture.md` if UI structure or types changed
4. `docs/database-schema.md` only if schema changed
5. `AGENTS.md` if current build rule changes
6. Add ADR if creating `docs/DESIGN.md`

Add a changelog entry:

```markdown
## Unreleased

- Repositioned dashboard as a dark premium design-system workspace.
- Added future-ready workflow steps for typography, layout, motion, DESIGN.md, preview, and export.
- Added AI Help affordances as Phase 2 placeholders.
- Added provider-agnostic AI model option metadata.
- Added future-ready color story and typography direction UI scaffolds/types.
- Added or aligned `docs/DESIGN.md` as Clarity’s design-intelligence source of truth.
```

---

# Quality Requirements

Before finishing:

- Run TypeScript checks if available.
- Run lint if available.
- Ensure no broken imports.
- Ensure dashboard works for authenticated users.
- Ensure project creation still works.
- Ensure project detail page still loads.
- Ensure unauthenticated users are still redirected appropriately.
- Ensure no private project data is exposed client-side beyond the authenticated user’s scope.
- Ensure UI is responsive enough for desktop, tablet, and mobile.
- Ensure buttons and links are keyboard focusable.
- Ensure major interactions have visible focus states.
- Respect `prefers-reduced-motion`.

---

# Implementation Priorities

Work in this order:

1. Inspect existing file structure and routes.
2. Identify dashboard route and project detail route.
3. Preserve existing Supabase/auth/project fetching logic.
4. Add or update theme styling for dark Clarity workspace.
5. Create reusable UI components:
   - `AIHelpButton`
   - `AIHelpPanel` or modal/drawer
   - `ModelSelector`
   - `WorkflowProgress`
   - `ProjectCard`
   - `ClarityPipeline`
   - `AIReadCard`
   - `PaletteStoryCard` placeholder
   - `TypographyRecommendationCard` placeholder
6. Update dashboard layout.
7. Update project detail layout.
8. Add workflow steps/types.
9. Add model options config.
10. Add future-ready design types.
11. Add/update `docs/DESIGN.md`.
12. Update docs/changelog.
13. Run checks.

---

# Important UX Details

Every major section should have a `Get help with AI` button.

The button should not dominate the UI. It should feel like an assistive control.

Suggested labels:

```text
Get help with AI
Ask Clarity
Help me decide
```

For consistency, use:

```text
Get help with AI
```

The AI help panel should include:

- The section name
- A short explanation of what AI will eventually help with
- Model selector
- Disabled prompt input or coming-soon prompt input
- Clear Phase 2 messaging

Example:

```text
AI Help for Color Palette

In Phase 2, Clarity will recommend color stories, explain palette choices, generate variations, and help you lock or adjust colors.

Preferred model:
[Model selector]

AI assistance is prepared for Phase 2.
```

---

# Product Voice

Use a calm, premium, design-literate voice.

Avoid:

- “Scaffold”
- “Deferred”
- “Locked” unless truly permission-locked
- “AI magic”
- “Revolutionary”
- Generic hype

Prefer:

- Intentional
- Direction
- System
- Palette
- Typography
- References
- Preview
- Export
- Continue
- Upcoming
- Ready
- Prepared for Phase 2

---

# Final Expected Outcome

After this implementation, Clarity should feel like:

```text
A dark, premium creative workspace for building design systems.
```

The user should be able to:

1. Log in.
2. See a polished dark dashboard.
3. Create/open projects.
4. Understand the Clarity workflow.
5. See Teddy Wear and other projects as design-system projects, not admin records.
6. Open a project and see a Design Direction Board structure.
7. See upcoming workflow modules:
   - Brief
   - Archetype
   - Palette
   - Typography
   - References
   - Layout
   - Motion
   - DESIGN.md
   - Preview
   - Export
8. Use or see `Get help with AI` affordances throughout.
9. See a model selector placeholder with:
   - Gemini 3.5 Flash
   - Claude Opus 4.8
   - Claude Opus 4.7
   - Claude Sonnet Latest
   - GPT-5.5
10. See robust future-ready placeholders for:
   - Typography recommendations and Google Fonts selection
   - Color Palette Picker and palette previews
11. Know that `DESIGN.md` is the source of truth for the system.

Do not overbuild beyond Phase 1.1.
