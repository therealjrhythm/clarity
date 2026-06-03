# Clarity Phase 1.1 Implementation Prompt
## Dashboard Reposition + DESIGN.md Alignment + Legacy Methodology Preservation

You are working inside an existing Git repository for **Clarity**, an AI-powered design application.

Clarity’s tagline is:

> Design with intention. Build with intelligence.

Clarity helps users turn project intent, brand context, references, color stories, typography, layout direction, motion direction, visual strategy, and design-system reasoning into production-ready interfaces and exports.

This repository already has a Git history and an existing application foundation. Do **not** restart the project. Do **not** create a new app from scratch. Inspect the current file structure first and adapt to the existing codebase.

---

# 1. Product Definition

Clarity is not a generic “AI makes a webpage” tool.

Clarity is an **AI visual identity compiler** and **design-system workspace**.

The product helps users move through a structured creative process:

```text
Project intent
  ↓
Conversational brief
  ↓
Approval Gate
  ↓
Archetype direction
  ↓
Color story
  ↓
Typography system
  ↓
Reference board
  ↓
Layout direction
  ↓
Motion and interaction direction
  ↓
DESIGN.md compiler
  ↓
Tokens
  ↓
Preview
  ↓
Export
```

The app should feel like a guided creative director and design-system engineer working together.

The app should help users make better design decisions before generating code.

The durable source of truth for each design system is `DESIGN.md`.

---

# 2. Current Phase

Implement **Phase 1.1: Dashboard Reposition + Workflow Preparation**.

The current app already supports Phase 1 Modern Foundation, including:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase SSR auth
- Supabase Postgres
- Supabase Storage conventions
- User dashboard
- Project creation
- Project detail page
- Project ownership/security
- Basic project metadata

Do not break the foundation.

Phase 1.1 is about improving the product experience, visual direction, source-of-truth clarity, documentation organization, and future-ready UI scaffolding.

---

# 3. Current Build Rule

Focus on Phase 1.1 only.

You may update:

- Dashboard UI
- Dashboard layout
- Dashboard copy
- Project cards
- Project detail page
- Workflow sidebar/stepper
- App shell/nav visual style
- Theme styles
- Reusable UI components
- Placeholder components for future modules
- TypeScript types/interfaces for future design intelligence modules
- Provider-agnostic AI model metadata
- UI-only model selector
- UI-only AI help buttons/modal/drawer
- UI-only typography recommendation scaffolds
- UI-only palette picker scaffolds
- Documentation
- ADRs
- Changelog
- Legacy documentation organization

Do **not** fully implement:

- Live AI generation routes
- Live AI provider SDK calls
- Reference image analysis
- Palette generation backend
- Typography API integration
- Google Fonts API integration as a production feature
- DESIGN.md compiler backend
- Token compiler backend
- Preview generation backend
- Figma export
- Webflow export
- One-click deployment
- Billing
- Team collaboration
- Public storage for private references
- Unsafe iframe/code execution
- Any client-side privileged writes

If a future feature is represented in the UI but not functional yet, label it clearly as:

```text
Prepared for Phase 2
```

or:

```text
Coming soon
```

Avoid using:

```text
Deferred
Locked
Scaffold
```

as user-facing language unless there is a real permission, subscription, or access lock.

Use friendlier status language:

```text
Ready
Next
Upcoming
In progress
Complete
Coming soon
Prepared for Phase 2
```

---

# 4. Source-of-Truth Priority

There may be several docs in this repository, including current v2 docs and older v1 methodology prompts.

Use this source-of-truth priority:

```text
1. Existing application code and database conventions
2. AGENTS.md
3. docs/product-spec-v2.md
4. docs/DESIGN.md
5. docs/architecture.md
6. docs/database-schema.md
7. docs/decisions/*
8. Legacy v1 files as methodology/reference only
```

If these sources conflict, prefer the newer v2 architecture and `DESIGN.md` direction over older v1 implementation prompts.

Do not blindly implement old v1 instructions if they conflict with v2.

---

# 5. DESIGN.md as Truth

`DESIGN.md` is the durable design-intelligence source of truth for Clarity.

If `docs/DESIGN.md` already exists, preserve it and align with it.

If `docs/DESIGN.md` does not exist, create it at:

```text
docs/DESIGN.md
```

The file should document Clarity’s internal design brain and should include these sections:

```text
1. Prime Directive
2. Approval Gate
3. Consultative Design Intake
4. AI Design Brief
5. Brand Archetype System
6. Dynamic Color Story Picker
7. Dynamic Typography Picker
8. Visual Hierarchy System
9. Layout Composition System
10. Spacing and Rhythm System
11. Art Direction System
12. Shape Language
13. Texture and Material Direction
14. Motion and Animation System
15. Interaction State System
16. Voice and Copy Direction
17. Conversion Strategy
18. Responsive Behavior
19. Accessibility Requirements
20. Reference Interpretation Rules
21. Anti-Repetition Rule
22. Template Recipes
23. Design Tokens and Export Format
24. Clarity App Brain Format
25. Master Prompt for AI Agents
```

`DESIGN.md` should explain that Clarity does not simply generate pages. Clarity guides users through a design-intelligence process and compiles the result into a durable design-system artifact that informs palette, typography, layout, motion, components, tokens, preview, and export.

Do not expose a giant 60-page super-prompt as the primary product experience.

The user-facing product should feel like:

```text
Guided decisions → clear direction → durable DESIGN.md → preview/export
```

not:

```text
Fill out giant prompt → hope AI generates something good
```

---

# 6. Legacy Methodology Handling

The repository may contain older v1 planning prompts and methodology files such as:

```text
clarity-ai-coding-prompt-phase1.md
clarity-ai-coding-prompt-phase2.md
clarity-ai-coding-prompt-phase3.md
clarity-ai-coding-prompt-phases4-7.md
design-super-prompt-template-v3.md
clarity-master-build-guide.md
```

Treat these as **legacy methodology references**, not current implementation instructions.

They contain valuable product DNA and should not be deleted.

Preserve the useful methodology:

- Reference-first design process
- Emotional architecture
- Style archetypes
- Archetype blending
- Anti-pattern capture
- Conversational onboarding
- Design-system thinking
- “One memorable moment”
- Atmosphere and mood definition
- Reference categories
- Motion references
- Layout references
- Color references
- Visual constraints
- Preview/export ambition
- Quality-focused creative direction

Do **not** implement outdated technical assumptions from those files.

---

# 7. Explicit Conflicts to Avoid

The older v1 files may include assumptions that conflict with the current v2 build. Avoid these conflicts.

## 7.1 Supabase Auth Helpers

Do not use deprecated Supabase auth helpers.

Avoid:

```text
@supabase/auth-helpers-nextjs
```

Use:

```text
@supabase/ssr
```

unless the existing codebase already has another approved modern pattern.

---

## 7.2 User Table

Do not create or use a new `public.users` table if the current v2 schema uses `profiles`.

Avoid:

```text
public.users
```

Prefer:

```text
profiles
```

Do not create naming confusion with Supabase Auth’s `auth.users`.

---

## 7.3 One Giant Projects Table

Do not store all project state on the `projects` table.

The `projects` table should remain mostly metadata and ownership-oriented.

Future generated outputs and design intelligence should use separate tables, such as:

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

Do not implement all of these migrations in Phase 1.1 unless already planned. It is okay to document and type them.

---

## 7.4 Public Storage

Do not use public buckets for private user/client references.

References and exports should be private by default.

Use private storage conventions and signed URLs in future phases.

Do not implement public reference-image URLs from old prompts.

---

## 7.5 Hard-Coded Claude-Only Architecture

Do not hard-code Claude as the only AI provider.

Clarity should be model/provider agnostic.

The user should eventually be able to select a preferred model from options including Gemini, Claude, and GPT.

In Phase 1.1, implement model metadata and UI placeholders only.

---

## 7.6 User-Facing Super-Prompt

Do not make the 60-page super-prompt the main user-facing artifact.

The older v3 super-prompt methodology should be distilled into:

```text
DESIGN.md
Design Direction Board
Design tokens
Preview
Export
```

The methodology remains internal.

The product experience should remain guided and approachable.

---

## 7.7 Figma/Webflow/Deploy Scope

Do not implement Figma export, Webflow export, or one-click deployment in Phase 1.1.

These are future features.

---

## 7.8 Live AI Routes

Do not implement live AI routes or provider SDK integrations during Phase 1.1 unless existing secure infrastructure already exists and the task explicitly requires it.

For this phase, AI help can be UI-only and marked as prepared for Phase 2.

---

# 8. File Organization Instructions

Organize legacy documents so future agents do not confuse old v1 implementation instructions with current v2 build rules.

If legacy files are currently at the repo root or mixed with current docs, move or copy them into appropriate folders.

Recommended docs structure:

```text
docs/
  DESIGN.md
  product-spec-v2.md
  architecture.md
  database-schema.md
  changelog.md

  methodology/
    design-super-prompt-template-v3.md
    v3-to-design-md-v4-map.md

  legacy/
    clarity-ai-coding-prompt-phase1.md
    clarity-ai-coding-prompt-phase2.md
    clarity-ai-coding-prompt-phase3.md
    clarity-ai-coding-prompt-phases4-7.md
    clarity-master-build-guide.md

  decisions/
    0001-use-design-md.md
    0002-private-reference-storage.md
    0003-use-design-md-v4-as-clarity-brain.md
    0004-treat-v1-prompts-as-methodology-not-implementation.md
```

If the repo already has a docs structure, adapt this structure without unnecessarily breaking links.

Do not delete the older files. Preserve them.

If moving files, update any references in README or docs as needed.

---

# 9. Methodology Map File

Create a methodology mapping document if it does not exist:

```text
docs/methodology/v3-to-design-md-v4-map.md
```

This file should explain how the old `design-super-prompt-template-v3.md` maps into the newer `DESIGN.md` system.

Include a mapping table like:

```markdown
| v3 Super-Prompt Section | DESIGN.md / Clarity v2 Equivalent |
|---|---|
| Project Objective | Prime Directive / AI Design Brief |
| Brand Philosophy | Consultative Intake / Brand Brief |
| Target Audience | Brand Brief / Conversion Strategy |
| Business Goals | Conversion Strategy |
| Emotional Architecture | Brand Archetype / Art Direction / Voice |
| One Thing | Signature Interaction / Memorable Moment |
| Atmosphere/Mood | Art Direction / Texture / Motion |
| Visual Style Archetype | Brand Archetype System |
| Reference Collection | Reference Interpretation Rules |
| Anti-Patterns | Anti-Repetition / Avoid Rules |
| Typography Constraints | Dynamic Typography Picker |
| Color Constraints | Dynamic Color Story Picker |
| Layout Constraints | Layout Composition System |
| Motion Constraints | Motion and Animation System |
| Design System | Tokens / DESIGN.md Compiler |
| Creative Execution | Template Recipes / Preview Generation |
```

The map should make it clear that v3 remains valuable methodology, but v2 and `DESIGN.md` are the current product architecture.

---

# 10. ADR Creation

Create a new ADR if it does not already exist:

```text
docs/decisions/0003-use-design-md-v4-as-clarity-brain.md
```

Suggested content:

```markdown
# 0003: Use DESIGN.md v4 as Clarity's Design Intelligence Brain

## Status

Accepted

## Context

Clarity needs a durable source of truth for design intelligence. Earlier versions relied on a large user-facing super-prompt methodology. Product Spec v2 shifts Clarity toward a guided design-system compiler where project inputs become a persistent design artifact.

## Decision

Clarity will use `docs/DESIGN.md` as the internal design-intelligence brain. The system will use it to guide brand intake, approval gates, archetypes, color stories, typography systems, references, layout, motion, accessibility, tokens, preview, and export.

## Consequences

- Clarity becomes a design-system compiler rather than a generic AI page generator.
- The app can generate consistent outputs across sessions.
- Future AI routes should reference `DESIGN.md`.
- User-facing UX should show concise direction boards, not giant prompts.
```

Also create a new ADR if it does not already exist:

```text
docs/decisions/0004-treat-v1-prompts-as-methodology-not-implementation.md
```

Suggested content:

```markdown
# 0004: Treat v1 Prompts as Methodology, Not Implementation

## Status

Accepted

## Context

The repository contains legacy Clarity v1 planning and AI coding prompts. These documents contain valuable methodology, including reference-first design, emotional architecture, archetype selection, anti-pattern capture, visual references, and design-system thinking.

However, some implementation assumptions are outdated. They reference deprecated Supabase helpers, public storage, a `public.users` table, Claude-only generation, one giant projects table, and a user-facing super-prompt flow.

## Decision

Clarity will preserve v1 methodology as internal product intelligence, but current implementation must follow Product Spec v2, the current application codebase, and `DESIGN.md`.

Legacy files may be stored in `docs/legacy/` or `docs/methodology/`.

## Consequences

- v1 methodology remains available.
- Coding agents should not implement v1 technical assumptions.
- `DESIGN.md` becomes the durable source of truth.
- Clarity evolves from a super-prompt generator into a design-system compiler.
```

---

# 11. Visual Direction for Phase 1.1

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
    - design-system command center
  avoid:
    - generic SaaS dashboard
    - flat admin UI
    - bright scaffold interface
    - childish colors
    - excessive glassmorphism
    - random neon overload
    - boilerplate copy
    - obvious template feel
```

The dashboard should feel like:

```text
A creative command center for building intentional design systems.
```

Not:

```text
A basic admin panel.
```

Not:

```text
A default Supabase scaffold.
```

---

# 12. Suggested Clarity App Palette

Use a dark, premium, moody color system.

Suggested CSS variables:

```css
:root {
  --clarity-bg: #08090D;
  --clarity-bg-soft: #101116;
  --clarity-bg-elevated: #151720;
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

Use Tailwind-compatible configuration or CSS variables based on the existing project setup.

Atmospheric treatments are allowed if tasteful and performant:

- Subtle radial gradients
- Subtle grid texture
- Soft amber/blue glow
- Elevated dark panels
- Thin premium borders
- Gentle hover lift
- Strong focus states
- Soft shadow depth
- Optional noise texture if easy and performant

Avoid excessive effects.

Respect `prefers-reduced-motion`.

---

# 13. Typography Direction for Clarity App UI

The Clarity app interface should use a premium design-tool typography system.

Recommended app UI font direction:

```yaml
heading_font: "Geist, Instrument Serif, or similar refined display/system font"
body_font: "Inter, Manrope, Geist Sans, or similar readable sans"
mono_font: "IBM Plex Mono, Geist Mono, or similar precision mono"
```

Do not overload the app with too many font imports.

For Phase 1.1, prioritize legibility and premium feel.

---

# 14. Dashboard Redesign Requirements

Update the dashboard from a simple project workspace into a premium creative workspace.

## 14.1 Dashboard Should Include

1. Top app shell/nav
2. Dark moody background
3. Workspace hero/header
4. Primary CTA:
   - `New Project`
   - or `Start a Design System`
5. Secondary CTA:
   - `Import References`
   - or `Explore Workflow`
6. Project summary cards
7. Continue Working section
8. Project Library
9. Clarity Pipeline module
10. Optional right rail or lower panel with guidance
11. `Get help with AI` button in every major section
12. Model selector placeholder in the app shell or AI help panel

## 14.2 Dashboard Copy

Remove internal scaffold copy.

Avoid copy like:

```text
Phase 1 supports secure project creation and ownership-scoped management.
Future workflow steps remain locked until later phases.
```

Use product-facing copy like:

```text
Turn rough ideas into clear design systems, visual directions, and production-ready interfaces.
```

or:

```text
Your workspace for shaping brand intent, color stories, typography systems, references, and interface direction.
```

or:

```text
Build a design system from project intent, references, palettes, typography, and AI-guided direction.
```

## 14.3 Suggested Dashboard Structure

```text
Top Nav
  - Clarity logo
  - Search/command placeholder if desired
  - Model selector placeholder
  - Get help with AI
  - New Project
  - Account

Hero / Workspace Header
  - Welcome back
  - “What are we designing today?”
  - Short value statement
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

# 15. Project Card Requirements

Project cards should feel like mini design-system records.

Do not make them feel like admin database rows.

Each project card should show:

- Project name
- Project type
- Status
- Short description
- Last updated
- Current phase
- Next recommended step
- Optional AI Read placeholder
- Optional future palette chips
- Optional future typography tags
- Open/Continue action

If no AI read exists, show a tasteful placeholder:

```text
AI Read prepared for Phase 2
```

or derive simple non-AI hints from the description without pretending they are generated.

For example, for Teddy Wear:

```text
Teddy Wear
Website · Draft

Luxury clothing for teddy bears.

Likely direction:
Playful luxury · Soft premium · Giftable

Next:
Complete Brand Brief
```

Do not fake persistent AI data unless the data exists.

---

# 16. Project Detail Page Redesign Requirements

The project detail page should feel like a **Design Direction Board**.

It should not feel like a page full of locked/deferred modules.

## 16.1 Project Detail Should Include

1. Project header
2. Project type/status
3. Project intent
4. AI Read / Brand Cue Interpretation placeholder
5. Next recommended step
6. Workflow grid/cards
7. Workflow progress rail or side panel
8. `Get help with AI` button in every major section
9. Settings button preserved
10. Back to dashboard link preserved

## 16.2 Replace Old Labels

Replace labels like:

```text
Conversational brief — Deferred
Archetype direction — Deferred
Color Palette Picker — Deferred
Reference board — Deferred
DESIGN.md compiler — Deferred
Preview and export — Deferred
```

With labels like:

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

## 16.3 Full Workflow Steps

Use or prepare these workflow steps:

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

If grouping is preferred:

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

---

# 17. Workflow Step Configuration

Create or update workflow step definitions in a reusable config file.

Suggested path:

```text
lib/design/workflow.ts
```

or:

```text
src/lib/design/workflow.ts
```

Use existing project conventions.

Suggested shape:

```ts
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

export type WorkflowStatus =
  | "complete"
  | "active"
  | "ready"
  | "upcoming"
  | "coming_soon";

export type WorkflowStep = {
  id: WorkflowStepId;
  label: string;
  description: string;
  status?: WorkflowStatus;
  phase?: string;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
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
    description: "Choose the brand and design personality.",
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
];
```

---

# 18. AI Help Button Requirement

Add a visible **Get help with AI** button or affordance in every major section.

This is important.

Every major dashboard/project section should include a way for the user to ask for help if stuck.

Include `Get help with AI` in:

- Dashboard hero
- Continue Working section
- Project Library section
- Clarity Pipeline section
- Project detail header
- Project Intent section
- AI Read section
- Workflow grid
- Palette placeholder
- Typography placeholder
- References placeholder
- DESIGN.md placeholder

The button should be visible but not overwhelming.

Preferred label:

```text
Get help with AI
```

Other acceptable labels:

```text
Ask Clarity
Help me decide
```

Use `Get help with AI` for consistency.

## 18.1 AI Help Panel

For Phase 1.1, the button can open a modal, drawer, or popover.

It should include:

- Section name
- Short explanation of what AI will eventually help with
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

Do not implement live provider calls in Phase 1.1.

---

# 19. AI Model Selector Requirement

Prepare a provider-agnostic model selector.

The user should eventually be able to choose their preferred AI model.

Implement model metadata in a central config file.

Suggested path:

```text
lib/ai/model-options.ts
```

or:

```text
src/lib/ai/model-options.ts
```

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

Do not hard-code AI provider SDK calls into UI components.

Create metadata only.

Suggested TypeScript:

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
  {
    id: "gemini-3-5-flash",
    label: "Gemini 3.5 Flash",
    provider: "google",
    strengths: ["fast ideation", "lightweight generation", "cost-efficient drafts"],
    enabled: true,
  },
  {
    id: "claude-opus-4-8",
    label: "Claude Opus 4.8",
    provider: "anthropic",
    strengths: ["deep creative direction", "brand reasoning", "long-form design analysis"],
    enabled: true,
  },
  {
    id: "claude-opus-4-7",
    label: "Claude Opus 4.7",
    provider: "anthropic",
    strengths: ["strategic reasoning", "complex design-system writing"],
    enabled: true,
  },
  {
    id: "claude-sonnet-latest",
    label: "Claude Sonnet Latest",
    provider: "anthropic",
    strengths: ["balanced speed and quality", "UI copy", "structured design generation"],
    enabled: true,
  },
  {
    id: "gpt-5-5",
    label: "GPT-5.5",
    provider: "openai",
    strengths: ["high-quality creative reasoning", "design-system generation", "code-aware interface planning"],
    enabled: true,
  },
];
```

The selected model can remain local UI state for now.

If the app already has safe settings persistence, integrate carefully. Otherwise document future persistence.

---

# 20. Typography System Feature Preparation

Typography must be a visible first-class Clarity feature.

Do not bury typography only inside `DESIGN.md`.

The user should eventually receive 3 AI recommendations based on project context, but also be able to choose from all available Google Fonts and mix/match as desired.

## 20.1 Future Typography Feature Requirements

Users should eventually be able to:

1. Receive 3 AI-recommended font systems based on project context.
2. Choose from all available Google Fonts.
3. Preview fonts live.
4. Mix and match:
   - Heading font
   - Body font
   - Accent font
   - Mono font
5. See each font system on realistic UI fragments.
6. Approve a typography system into the project design system.
7. Export typography into:
   - `DESIGN.md`
   - tokens JSON
   - CSS variables
   - Tailwind theme
   - generated code

## 20.2 Phase 1.1 Scope

Build UI placeholders/components/types that prepare this feature.

Do not implement a production Google Fonts browser/search yet unless safe and simple.

Create components such as:

```text
components/typography/TypographySystemPreview.tsx
components/typography/TypographyRecommendationCard.tsx
components/typography/FontPairingPreview.tsx
components/typography/FontRoleSelector.tsx
```

Use existing project naming conventions.

Create future-ready types.

Suggested file:

```text
lib/design/types.ts
```

Suggested TypeScript:

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

## 20.3 Typography UI Should Show

For each recommendation:

- Name
- Heading font
- Body font
- Accent font
- Mono font
- Emotional read
- Best for
- Why it works
- Watch out
- Live sample:
  - Hero headline
  - Subheading
  - Paragraph
  - Button
  - Product card title
  - Data label

## 20.4 Google Fonts Requirement

Eventually, the user must be able to choose from all available Google Fonts.

For Phase 1.1, add UI/architecture notes such as:

```text
Google Fonts browser/search prepared for Phase 2.
```

Do not ship a tiny fixed font list as if it is the final feature.

A small starter/mock list is acceptable only as fallback/placeholder content.

## 20.5 Example Placeholder Typography Options

Use these only as placeholder/sample content where appropriate. Do not hard-code as universal defaults.

```yaml
option_1:
  name: "Boutique Soft Luxury"
  heading_font: "Fraunces"
  body_font: "Nunito Sans"
  accent_font: "Fraunces"
  mono_font: "IBM Plex Mono"
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
  mono_font: "Geist Mono"
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
  mono_font: "IBM Plex Mono"
  emotional_read:
    - polished
    - approachable
    - warm
    - modern
```

---

# 21. Color Palette Picker Feature Preparation

The Color Palette Picker is a signature Clarity feature.

It should not be a basic swatch list.

It should lay out palettes beautifully and help the user understand how the colors work together in real UI contexts.

## 21.1 Future Palette Feature Requirements

Users should eventually be able to:

1. Receive AI-recommended color stories based on brand/project context.
2. See 3 or more palette options.
3. Understand why each palette works.
4. View hex codes and semantic color roles.
5. Preview palettes on UI fragments.
6. Create their own palette manually.
7. Lock selected colors.
8. Ask AI to generate variations.
9. Generate light/dark variants.
10. Check accessibility/contrast.
11. Save the selected palette into:
    - `DESIGN.md`
    - design tokens
    - CSS variables
    - generated UI

## 21.2 Phase 1.1 Scope

Build UI placeholders/components/types only.

Do not implement full AI palette generation backend yet.

Create components such as:

```text
components/palette/PaletteStoryCard.tsx
components/palette/PalettePreview.tsx
components/palette/PaletteRoleGrid.tsx
components/palette/PaletteMiniUI.tsx
components/palette/PaletteVariationControls.tsx
```

Use existing project conventions.

Create future-ready types.

Suggested TypeScript:

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

## 21.3 Palette UI Should Show

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
- Form preview if practical
- Accessibility placeholder/check area
- Actions:
  - Preview
  - Select
  - Customize
  - Generate variations with AI

For Phase 1.1, actions may be disabled or marked:

```text
Coming soon
```

or:

```text
Prepared for Phase 2
```

## 21.4 Example Placeholder Palette

Use only as sample placeholder content where useful:

```yaml
name: "Heirloom Honey"
background: "#F7EFE3"
surface: "#FFF9F1"
surface_elevated: "#FFFFFF"
primary_text: "#2D241C"
secondary_text: "#7D6A58"
muted_text: "#A8927B"
primary_accent: "#B9824A"
secondary_accent: "#E7CFA9"
highlight: "#F3DDAE"
border: "#E4D3BF"
success: "#7E9F78"
warning: "#C98A3D"
danger: "#B65C55"
```

Do not make this the default for all projects.

---

# 22. Design Direction Board Preparation

The project detail page should begin to look like a future Design Direction Board.

Even before full features exist, structure the page around:

```text
Project Intent
AI Read
Next Step
Workflow
Design System Preview
Palette Preview
Typography Preview
```

The AI Read placeholder should map to `DESIGN.md` brand cue interpretation:

```yaml
brand_cue_interpretation:
  inferred_traits: []
  design_risks: []
  design_goal: []
```

If no AI data exists, show:

```text
Clarity will interpret this project’s brand cues in the Brief phase.
```

For Teddy Wear-style descriptions, if deriving a non-AI placeholder is simple, display:

```text
Likely direction:
Playful luxury · Soft premium · Giftable

Watch out:
Avoid overly childish visuals or generic luxury beige.
```

But do not imply that an AI generation job has already run if it has not.

---

# 23. Suggested Reusable Components

Create reusable components as appropriate.

Suggested components:

```text
components/ai/AIHelpButton.tsx
components/ai/AIHelpPanel.tsx
components/ai/ModelSelector.tsx

components/dashboard/WorkspaceHero.tsx
components/dashboard/ProjectCard.tsx
components/dashboard/ClarityPipeline.tsx
components/dashboard/DashboardStatCard.tsx

components/project/AIReadCard.tsx
components/project/WorkflowProgress.tsx
components/project/WorkflowStepCard.tsx
components/project/NextStepCard.tsx

components/palette/PaletteStoryCard.tsx
components/palette/PaletteMiniUI.tsx
components/palette/PaletteRoleGrid.tsx

components/typography/TypographyRecommendationCard.tsx
components/typography/TypographySystemPreview.tsx
components/typography/FontPairingPreview.tsx
```

Do not force this exact structure if the repo has a different convention, but keep separation clean.

---

# 24. Suggested Types

Create or update future-ready types in:

```text
lib/design/types.ts
```

or:

```text
src/lib/design/types.ts
```

Include types for:

```text
ClarityProject
WorkflowStep
WorkflowStatus
BrandBrief
BrandArchetype
ColorStory
ColorToken
TypographyDirection
LayoutDirection
MotionDirection
ArtDirection
DesignTokens
DesignSystemVersion
AIModelOption
```

Do not add database migrations unless needed.

Do not place future generated outputs directly on the `projects` table.

---

# 25. Product Voice

Use a calm, premium, design-literate product voice.

Avoid:

```text
Scaffold
Deferred
Locked
AI magic
Revolutionary
Instantly 10x
Generic hype
```

Prefer:

```text
Intentional
Direction
System
Palette
Typography
References
Preview
Export
Continue
Upcoming
Ready
Prepared for Phase 2
Design Direction
Design System
Creative Workspace
```

The UI should feel confident and useful, not overhyped.

---

# 26. Accessibility and Responsiveness

Ensure the redesigned dashboard and project detail page are responsive and accessible.

Requirements:

- Body text should be readable.
- Interactive elements should be keyboard-focusable.
- Focus states should be visible.
- Avoid low-contrast gray text on dark backgrounds.
- Buttons should have accessible labels.
- Do not rely only on color for status.
- Respect `prefers-reduced-motion`.
- Use semantic HTML where possible.
- Tap targets should be reasonable on mobile.
- Layout should work on desktop, tablet, and mobile.

---

# 27. Security and Data Rules

Do not weaken existing auth/security.

Preserve:

- Supabase SSR auth
- Protected dashboard routes
- Project ownership checks
- Private data assumptions
- Existing middleware behavior
- Existing server/client Supabase split

Do not use the service role key client-side.

Do not expose private user data in public routes.

Do not create unsafe client-side privileged writes.

---

# 28. Documentation Updates

Update relevant docs after implementation.

Required or recommended docs updates:

```text
README.md
docs/changelog.md
docs/architecture.md
docs/database-schema.md if schema changed
AGENTS.md if current build rule changes
docs/DESIGN.md
docs/methodology/v3-to-design-md-v4-map.md
docs/decisions/0003-use-design-md-v4-as-clarity-brain.md
docs/decisions/0004-treat-v1-prompts-as-methodology-not-implementation.md
```

Add a changelog entry:

```markdown
## Unreleased

- Repositioned the dashboard as a dark premium design-system workspace.
- Updated project cards and project detail pages to feel like design-system records.
- Added future-ready workflow steps for typography, layout, motion, DESIGN.md, preview, and export.
- Added AI Help affordances as Phase 2 placeholders.
- Added provider-agnostic AI model option metadata.
- Added future-ready color story and typography direction UI scaffolds/types.
- Added or aligned `docs/DESIGN.md` as Clarity’s design-intelligence source of truth.
- Preserved legacy v1 methodology files as reference material and documented their relationship to the v2 architecture.
```

---

# 29. Implementation Order

Work in this order:

1. Inspect the current file tree.
2. Identify dashboard route.
3. Identify project creation route.
4. Identify project detail route.
5. Identify existing Supabase client/server patterns.
6. Identify existing docs and legacy files.
7. Preserve existing auth/project-fetching logic.
8. Add or align `docs/DESIGN.md`.
9. Organize legacy docs if needed.
10. Add ADRs for DESIGN.md and legacy methodology handling.
11. Add model options config.
12. Add workflow config.
13. Add future-ready design types.
14. Create AI help components.
15. Create model selector component.
16. Create dashboard components.
17. Create project detail components.
18. Create typography placeholder components.
19. Create palette placeholder components.
20. Apply dark moody visual styling.
21. Update dashboard page.
22. Update project detail page.
23. Update docs/changelog.
24. Run TypeScript/lint/build checks if available.
25. Fix any broken imports or type errors.

---

# 30. Quality Checks Before Finishing

Before reporting completion:

- Run TypeScript checks if available.
- Run lint if available.
- Run build if practical.
- Ensure no broken imports.
- Ensure dashboard loads for authenticated users.
- Ensure project creation still works.
- Ensure project detail page still loads.
- Ensure unauthenticated users are redirected appropriately.
- Ensure existing Supabase SSR auth pattern is preserved.
- Ensure no service role key is exposed client-side.
- Ensure AI Help buttons render in major sections.
- Ensure model selector renders with required options.
- Ensure workflow includes Typography, Layout, Motion, and DESIGN.md.
- Ensure dark theme is consistent.
- Ensure UI is responsive.
- Ensure docs are updated.
- Ensure legacy files are preserved and not deleted.

---

# 31. Expected Final Outcome

After Phase 1.1, Clarity should feel like:

```text
A dark, premium creative workspace for building design systems.
```

The user should be able to:

1. Log in.
2. See a polished dark moody dashboard.
3. Create/open projects.
4. Understand the Clarity workflow.
5. See projects as design-system projects, not admin records.
6. Open a project and see a Design Direction Board structure.
7. See future-ready workflow modules:
   - Foundation
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
   - Typography recommendations
   - Google Fonts selection/search
   - Palette previews
   - Manual palette creation
   - AI palette variations
11. Know that `DESIGN.md` is the source of truth.
12. See legacy v1 methodology preserved correctly, not implemented literally.
13. See v2 build rules respected.

Do not overbuild beyond Phase 1.1.
