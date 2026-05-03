# Clarity Product Specification v2.0

**Product:** Clarity  
**Tagline:** Design with intention. Build with intelligence.  
**Version:** 2.0  
**Date:** May 3, 2026  
**Prepared for:** J Rhythm  
**Build environment:** Codex + GitHub version history  
**Status:** Build-ready product specification

---

## 1. Executive Summary

Clarity is an AI-powered design application that turns user intent, visual references, color direction, and brand strategy into production-ready design systems and interfaces.

The original Clarity v1 concept was strong: a conversational AI design tool powered by the Design Super-Prompt v3.0 methodology, reference-first design analysis, archetype intelligence, and clean code export. Version 2 evolves that concept into a more durable product architecture:

> **Clarity v2 is an AI visual identity compiler.**

Instead of exposing a giant super-prompt as the core product, Clarity now uses the Design Super-Prompt v3.0 methodology as its internal creative intelligence layer and compiles the result into a persistent `DESIGN.md` design-system file. That file becomes the source of truth for design generation, code export, palette generation, iteration, and future project memory.

The MVP should focus on the complete loop:

**Project brief → archetype direction → color palette picker → references → DESIGN.md → previewable React/HTML output → export.**

The product should feel like a guided creative director and design-system engineer working together: it asks the right questions, learns what the user loves, captures what the user does not want, creates a color story, writes the visual identity contract, and generates polished interface output that can be refined and exported.

---

## 2. Product Thesis

### 2.1 The Problem

Most AI design tools fail in one or more of these ways:

1. They generate generic templates.
2. They depend almost entirely on text prompts.
3. They cannot remember or enforce a visual identity across sessions.
4. They do not understand what the user loves visually.
5. They create attractive mockups but weak production code.
6. They do not give non-designers enough guidance.
7. They do not give designers enough control.

### 2.2 The Solution

Clarity guides the user through a structured creative process and produces a persistent design-system artifact that coding agents can use.

The system collects:

- Project purpose
- Audience
- conversion goal
- emotional direction
- anti-patterns
- visual archetype
- color palette
- visual references
- user annotations
- generated design tokens
- component rules
- layout rules
- motion rules
- accessibility constraints
- export preferences

Then Clarity compiles that information into:

- `DESIGN.md`
- parsed design tokens
- Tailwind v4 `@theme` CSS
- optional DTCG `tokens.json`
- React/Next.js components
- static HTML/CSS bundle
- preview screenshots
- versioned project artifacts

### 2.3 Core Differentiator

Clarity is not “AI makes a webpage.”

Clarity is:

> **Reference intelligence + color story generation + archetype strategy + DESIGN.md design-system memory + production UI generation.**

The moat is the systematic process.

---

## 3. What Changed from v1 to v2

### 3.1 Keep

- Product name: **Clarity**
- Slogan: **Design with intention. Build with intelligence.**
- Reference-first design approach
- Design Super-Prompt v3.0 methodology
- Conversational onboarding
- Visual style archetypes
- Anti-pattern capture
- Production-ready output
- Dashboard/project history
- Quality-focused creative direction

### 3.2 Change

- Replace the user-facing 40–60 page super-prompt with a concise **Design Direction Board**.
- Keep the full methodology internally.
- Make `DESIGN.md` the durable source of truth.
- Make the Color Palette Picker a signature feature.
- Reduce MVP scope.
- Use modern stack choices and server-side security patterns.
- Shift generation from fragile one-request API calls to durable generation jobs.
- Use private reference storage, signed URLs, and strict ownership checks.
- Replace hard-coded model names with configurable model routing.
- Replace “free forever” with credit-aware usage from day one.

### 3.3 Remove or Defer

Remove from MVP:

- Public reference-image storage
- User-facing 60-page prompt review as the main wow moment
- Unlimited free generation
- Generic archetype trend language as-is
- Client-side privileged database updates
- Hard-coded API model names
- Raw iframe code injection without sandboxing
- Figma export as a first-class MVP requirement
- Webflow export
- One-click deploy

Defer to post-MVP:

- Figma export
- Webflow export
- One-click Vercel/Netlify deploy
- Team collaboration
- Brand kit marketplace
- Custom archetype builder
- Multi-page generation
- A/B test variant engine

---

## 4. Target Users

### 4.1 Primary MVP User

**Founder / Developer / Builder**

Needs a professional landing page, dashboard, or SaaS UI but does not want to hire a designer before the product is validated.

Success looks like:

- Can create a polished direction in one session.
- Can export usable code.
- Can return later and iterate from the same design system.
- Feels guided, not overwhelmed.

### 4.2 Secondary MVP User

**Freelance designer / creative technologist**

Uses Clarity to quickly create design-system directions, client concepts, palette stories, and coded prototypes.

Success looks like:

- Can move from brief to design direction faster.
- Can show multiple polished directions.
- Can export a `DESIGN.md` and tokens for handoff.
- Can refine instead of starting over.

### 4.3 Future User

**Agency / team**

Needs shared project libraries, white-label exports, version history, comments, and brand-system reuse.

This should not be the initial build focus.

---

## 5. Product Principles

1. **Reference first, not template first.**  
   The user’s references and annotations should carry more weight than generic AI assumptions.

2. **Design systems over one-off pages.**  
   Every generated output should come from an explicit design system.

3. **Taste needs constraints.**  
   Anti-patterns are as important as preferences.

4. **Color is a story, not decoration.**  
   Palettes should include purpose, ratio, accessibility, usage, and variants.

5. **Generated code must be inspectable.**  
   The user should be able to understand what was generated and export it cleanly.

6. **Quality gates are product features.**  
   Contrast, accessibility, performance, linting, and design-system validation should happen before export.

7. **Version everything.**  
   Every major design decision should be traceable, reversible, and diffable.

8. **Do not copy references.**  
   Extract patterns, adapt techniques, and synthesize a unique result.

---

## 6. MVP Scope

### 6.1 MVP Must Include

1. Landing page with the Clarity slogan
2. Auth and user dashboard
3. Project creation
4. Conversational brief
5. Archetype recommendation/selection
6. Color Palette Picker
7. Reference upload and annotation
8. Reference analysis
9. `DESIGN.md` compiler
10. `DESIGN.md` lint/check report
11. Design Direction Board
12. Design generation jobs
13. Safe preview
14. Iterative refinement
15. React/Next.js export
16. Static HTML/CSS export
17. Token export
18. Usage ledger
19. Project version history
20. Basic admin/error monitoring

### 6.2 MVP Should Not Include

- Figma export
- Webflow export
- Team workspaces
- White-label exports
- Custom domains
- One-click deployment
- Marketplace
- Complex billing automation beyond credits/ledger scaffolding
- Multi-page site builder
- Advanced browser-based visual editor

---

## 7. Core User Journey

### Step 1: Landing Page

Hero slogan:

> **Design with intention. Build with intelligence.**

Supporting copy:

> Turn references, color stories, and brand intent into production-ready design systems and interfaces.

Primary CTA:

> Start a Design System

Secondary CTA:

> See the Workflow

The hero visual should show the Clarity pipeline:

**Reference card → extracted palette → DESIGN.md tokens → generated UI preview**

### Step 2: Sign Up / Login

Support:

- Email/password
- Magic link or OAuth if desired
- Protected dashboard routes
- Private project data

### Step 3: Dashboard

The dashboard shows:

- Existing projects
- Project status
- Last updated
- Thumbnail
- Current phase
- “New Project” CTA
- Exported artifacts
- Credits remaining

Project statuses:

- `draft`
- `briefing`
- `visual_direction`
- `palette`
- `references`
- `design_system`
- `generating`
- `ready`
- `exported`
- `archived`

### Step 4: Conversational Brief

The AI asks the minimum set of useful questions:

1. What are we designing?
2. What is the project called?
3. Who is it for?
4. What should visitors/users do?
5. What should it feel like?
6. What should it never feel like?
7. What makes this project different?
8. What is the one memorable moment?

The system should support:

- Button answers
- Free-text answers
- Multi-select chips
- Edit previous answers
- Save/resume
- Smart follow-up questions
- Project-type branching

### Step 5: Visual Language / Archetype

Instead of showing 10 static archetypes immediately, Clarity should recommend three directions:

1. **Recommended**
2. **Alternative**
3. **Wildcard**

Each direction includes:

- Archetype name
- Mood description
- Best use cases
- Risks
- Mini visual preview
- Typography direction
- Color temperature
- Layout style
- Motion behavior
- Example component treatment

The user can choose:

- Single archetype
- Hybrid blend
- AI-recommended blend
- Manual override

### Step 6: Color Palette Picker

The Color Palette Picker is a signature Clarity feature.

The user can:

- Use AI-suggested palettes
- Pick colors manually from a color wheel
- Extract color direction from references
- Lock selected colors
- Regenerate palette variations
- Preview palettes on UI fragments
- Check accessibility
- Save one selected palette into the project design system

### Step 7: Reference Board

Users can add references in a flexible way:

- Upload image
- Upload GIF
- Upload short video
- Add URL
- Add screenshot
- Paste text reference
- Mark anti-pattern reference

Suggested categories:

- Hero
- Layout
- Typography
- Color
- Motion
- Components
- Dashboard/data UI
- Overall vibe
- Anti-patterns

Each reference should include:

- Category
- User annotation
- AI analysis
- Extracted colors
- Layout observations
- Typography observations
- Motion observations
- “Adapt, do not copy” guidance

### Step 8: DESIGN.md Compile

Clarity compiles the project into a versioned `DESIGN.md`.

The user sees a **Design Direction Board**:

- Overview
- Emotional core
- Color story
- Typography
- Layout
- Components
- Motion
- Signature interaction
- Do’s and don’ts
- Accessibility notes
- Export readiness

Behind the scenes, the system stores:

- raw `DESIGN.md`
- parsed token JSON
- lint report
- contrast findings
- version number
- source inputs used
- model used
- generated timestamp

### Step 9: Design Generation

The user chooses:

- Landing page
- Dashboard
- App shell
- Component set
- Hero section only
- Full page

MVP should support:

- Landing page
- SaaS/dashboard starter
- Hero + sections
- Component showcase

The system should generate 2–3 variants:

1. **Faithful** — closest to selected direction
2. **Bold** — more distinctive and expressive
3. **Conversion-focused** — practical, clear, business-driven

### Step 10: Preview and Refine

Preview features:

- Safe iframe/sandbox
- Desktop/tablet/mobile view
- Light/dark if available
- Animation toggle
- Reduced-motion preview
- Basic accessibility summary
- Code artifact list
- Regenerate section
- Natural language refinement

Example refinement requests:

- “Make this feel more premium.”
- “Use less purple and more warm neutral.”
- “Make the dashboard denser.”
- “Reduce motion intensity.”
- “Make the CTA more conversion-focused.”
- “Apply this palette to cards only.”

### Step 11: Export

MVP exports:

- `DESIGN.md`
- `tokens.json`
- Tailwind v4 theme CSS
- React/Next.js files
- Static HTML/CSS bundle
- Preview screenshot

---

## 8. Feature Specification

## 8.1 Conversational Brief

### Purpose

Capture project intent without overwhelming the user.

### Functional Requirements

- Chat-style interface
- Step progress indicator
- Autosave after every answer
- Ability to edit previous responses
- Ability to skip non-critical questions
- Smart default suggestions
- Project-type branching
- “Summarize my brief” confirmation screen

### Data Captured

- project type
- project name
- purpose
- audience
- conversion goal
- emotional core
- secondary emotion
- anti-patterns
- competitor/inspiration notes
- one memorable moment
- technical output preference

### Acceptance Criteria

- User can complete a useful brief in under 8 minutes.
- User can resume after refresh.
- User can edit answers before moving forward.
- A `project_briefs` row is created and associated with the project.
- Every answer is stored as structured data.

---

## 8.2 Archetype Selector

### Purpose

Translate vague style preferences into a usable visual language.

### Updated MVP Archetypes

1. **Signal Minimal**  
   Precise, restrained, premium SaaS.

2. **Cinematic Dark**  
   Moody, dimensional, creative, tech-forward.

3. **Editorial Luxury**  
   High-end typography, whitespace, refined layout.

4. **Warm Founder Brand**  
   Human, trustworthy, approachable, personal.

5. **Data Command Center**  
   Dense, structured, analytical dashboard systems.

6. **Playful Product Lab**  
   Colorful, experimental, friendly, startup energy.

7. **Luxury Restraint**  
   Quiet premium, tactile, elegant.

8. **Neo-Brutal Utility**  
   Sharp, raw, direct, anti-template.

9. **Motion-First Studio**  
   Kinetic, scroll-led, immersive.

10. **Soft Organic Digital**  
   Wellness, lifestyle, handmade, warm and calm.

### Functional Requirements

- AI recommends three directions.
- User can select one or blend two.
- Hybrid slider supports ratios.
- Visual preview must be more than an icon.
- Each archetype includes risk warnings.
- Selection writes to `visual_directions`.

### Acceptance Criteria

- Archetype selection is saved with ownership validation.
- The selected direction influences palette, typography, layout, and motion.
- User can return and change the archetype, creating a new design-system version.

---

## 8.3 Color Palette Picker

### Purpose

Generate complete color stories that feel intentional, beautiful, accessible, and usable in production.

### Modes

#### 1. AI Suggested Palettes

Based on:

- project brief
- emotional core
- archetype
- audience
- industry
- reference analysis
- anti-patterns

The AI proposes 3–6 palettes.

Each palette contains:

- name
- mood tags
- primary
- secondary
- accents
- neutrals
- semantic colors
- surface colors
- text colors
- border colors
- light variant
- dark variant
- usage ratios
- contrast pairings
- recommended applications

#### 2. Manual Color Wheel

User can choose one or more seed colors.

The system then generates:

- monochrome variations
- analogous variations
- complementary variations
- split-complementary variations
- triadic variations
- neutral ramp
- light mode
- dark mode
- high contrast variant
- restrained variant

#### 3. Reference Extraction

The system extracts colors from uploaded references and identifies:

- dominant colors
- accent colors
- background colors
- foreground/text colors
- emotional temperature
- contrast style
- saturation level
- likely usage ratios

#### 4. Lock and Regenerate

The user can lock any color and regenerate the rest.

Example:

- lock background
- lock primary
- regenerate accents
- regenerate neutrals
- regenerate semantic colors

### Palette Preview Requirements

Each palette preview should show:

- color strip
- role labels
- mini hero preview
- button preview
- card preview
- form preview
- dashboard widget preview
- chart preview
- contrast status
- light/dark toggle
- usage ratio visualization

### Palette Data Model

Palette should store:

- project ID
- version
- palette name
- source mode
- seed colors
- locked colors
- full color token map
- accessibility report
- AI rationale
- selected state

### Acceptance Criteria

- User can generate at least 3 palettes.
- User can manually select colors and receive variations.
- User can lock colors and regenerate.
- Selected palette writes into `DESIGN.md`.
- Palette includes at least one accessible primary CTA pairing.
- Contrast failures are clearly flagged.

---

## 8.4 Reference Board

### Purpose

Make visual references actionable rather than decorative.

### Functional Requirements

- Private uploads
- Signed URLs
- File type validation
- Size validation
- Image dimension metadata
- Optional URL capture
- Annotation prompt per reference
- AI analysis per reference
- Project-level synthesis
- Delete/reference ownership validation
- Reload existing references on refresh

### AI Analysis Requirements

Each reference analysis should include:

- color observations
- typography observations
- layout observations
- spacing observations
- material/depth observations
- motion/interaction observations if available
- component patterns
- emotional qualities
- what to adapt
- what to avoid copying
- confidence score

### Acceptance Criteria

- Reference analysis is persisted.
- User annotations are persisted.
- Project synthesis is generated from all references.
- References are never public by default.
- API cannot analyze arbitrary external URLs without validation.

---

## 8.5 DESIGN.md Compiler

### Purpose

Convert Clarity project inputs into a persistent design-system contract.

### Inputs

- project brief
- emotional architecture
- archetype
- color palette
- reference analyses
- user annotations
- anti-patterns
- technical constraints
- export format requirements

### Output

- `DESIGN.md`
- parsed tokens
- linter report
- diff report compared to prior version
- Tailwind theme CSS
- DTCG tokens JSON
- Design Direction Board summary

### Required DESIGN.md Sections

- YAML front matter with tokens
- Overview
- Colors
- Typography
- Layout
- Elevation & Depth
- Shapes
- Components
- Do’s and Don’ts

### Clarity Custom Sections

The compiler may also add:

- Motion
- Iconography
- Data Visualization
- Signature Interaction
- Reference Synthesis
- Accessibility
- Export Notes

### Acceptance Criteria

- `DESIGN.md` is valid Markdown with YAML front matter.
- Color tokens are valid hex values.
- Component references resolve.
- Linter findings are stored.
- The user sees a human-readable board, not just raw Markdown.
- New compiles create versions rather than overwriting history.

---

## 8.6 Design Generation

### Purpose

Generate production-oriented React/HTML output using the current `DESIGN.md`.

### Generation Modes

MVP:

- landing page
- dashboard starter
- app shell
- component showcase

Post-MVP:

- multi-page site
- full SaaS workflow
- e-commerce storefront
- CMS-backed marketing site

### Functional Requirements

- Start generation job
- Track job progress
- Persist partial outputs
- Recover after refresh
- Generate multiple variants
- Validate code
- Preview output
- Save artifacts
- Allow section-level regeneration

### Quality Checks

Before marking generation as complete:

- TypeScript check where applicable
- basic lint check
- accessibility scan
- color contrast check
- responsive smoke test
- forbidden anti-pattern check
- design-token adherence check
- export bundle validation

### Acceptance Criteria

- User sees job progress.
- Generated output is saved as artifacts.
- Preview works without exposing parent app.
- User can regenerate a section without losing the whole design.
- Output uses tokens from the current design-system version.

---

## 8.7 Preview and Refinement

### Purpose

Let users inspect, experience, and improve generated designs.

### Functional Requirements

- Sandbox preview
- Device viewport toggles
- Motion toggle
- Inspect element metadata
- Feedback/refinement input
- Change history
- Section regeneration
- Save as new version
- Compare variants

### Acceptance Criteria

- User can view desktop/tablet/mobile.
- User can submit a refinement prompt.
- Refinement creates a new artifact version.
- The system shows what changed.

---

## 8.8 Export

### MVP Export Formats

1. `DESIGN.md`
2. `tokens.json`
3. Tailwind v4 theme CSS
4. React/Next.js bundle
5. Static HTML/CSS bundle
6. Screenshot/thumbnail

### Export Requirements

- All exports are stored in private storage.
- Export creates a record in `exports`.
- Export downloads are signed/temporary.
- Export bundle includes README.
- Export bundle includes license/usage note.
- Export bundle includes design-system version ID.

### Deferred Export Formats

- Figma
- Webflow
- Framer
- Vercel deploy
- Netlify deploy

---

## 9. DESIGN.md Integration

### 9.1 Role in Clarity

`DESIGN.md` is the backbone of Clarity v2.

It should be treated as:

- the persistent visual identity file
- the design-system memory
- the generation contract
- the versioned design artifact
- the source for token exports
- the input for future coding agents

### 9.2 System Flow

```text
User intent
  ↓
Brief data
  ↓
Archetype selection
  ↓
Color Palette Picker
  ↓
Reference analysis
  ↓
Design Super-Prompt v3.0 intelligence
  ↓
DESIGN.md compiler
  ↓
Lint + contrast + token checks
  ↓
Design generation
  ↓
Preview + refinement
  ↓
Export
```

### 9.3 Example DESIGN.md Token Structure

```yaml
---
version: alpha
name: Midnight Signal
description: Cinematic AI product system with precise violet intelligence accents.
colors:
  primary: "#7C3AED"
  primary-foreground: "#FFFFFF"
  secondary: "#38BDF8"
  accent: "#F97316"
  background: "#0B0F19"
  surface: "#111827"
  surface-muted: "#1F2937"
  text: "#F8FAFC"
  text-muted: "#94A3B8"
  border: "#334155"
  success: "#22C55E"
  warning: "#F59E0B"
  error: "#EF4444"
typography:
  h1:
    fontFamily: "Inter Tight"
    fontSize: "4rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
rounded:
  sm: "8px"
  md: "14px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
---
```

### 9.4 Example Markdown Body

```markdown
## Overview

Midnight Signal is a cinematic dark product system built for high-trust AI tools.
The interface should feel focused, intelligent, and quietly powerful.

## Colors

The palette uses a deep navy-black foundation to create focus. Violet is the primary intelligence signal.
Cyan is reserved for system feedback and live-generation moments. Orange is a rare warmth accent.

## Typography

Headlines should be large, compressed, and precise. Body text should feel calm and readable.

## Do's and Don'ts

Do use restraint, contrast, and purposeful glow.
Do not use generic blue-purple AI gradients, random glass cards, or stock tech illustrations.
```

### 9.5 DESIGN.md Operations

Clarity should expose internal services for:

- compile
- validate/lint
- diff
- export
- parse
- repair
- summarize
- version

Suggested routes:

```text
POST /api/design-system/compile
POST /api/design-system/lint
POST /api/design-system/diff
POST /api/design-system/export
GET  /api/design-system/:projectId/current
GET  /api/design-system/:projectId/versions
```

---

## 10. Technical Architecture

## 10.1 Recommended Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Radix primitives / shadcn-style components
- Motion library for UI transitions
- Zod for validation
- React Hook Form where forms are needed
- Zustand only for cross-step UI state that cannot live in server data

### Backend

- Next.js Route Handlers / Server Actions where appropriate
- Supabase Postgres
- Supabase Auth
- Supabase Storage with private buckets
- Supabase SSR package
- Anthropic Claude API for language + vision generation
- Optional queue/workflow service for durable jobs
- Optional edge functions for webhook and background tasks

### AI Model Strategy

Use environment-based routing:

```text
AI_MODEL_FAST=...
AI_MODEL_MAIN=...
AI_MODEL_REVIEW=...
AI_MODEL_VISION=...
```

Suggested task routing:

- Fast model: classification, palette names, brief cleanup
- Main model: DESIGN.md compile, reference synthesis, code generation
- Review model: final critique, repair, quality checks
- Vision-capable model: reference analysis

### Why This Stack

- Next.js App Router fits full-stack React with server components and route handlers.
- Tailwind v4 maps cleanly to generated token CSS.
- Supabase provides auth, Postgres, storage, and row-level security.
- `DESIGN.md` creates a durable bridge between design intent and coding agents.
- Codex can work from GitHub branches against a clear spec and testable milestones.

---

## 10.2 App Structure

```text
clarity/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   └── project/
│   │       ├── new/
│   │       └── [id]/
│   │           ├── brief/
│   │           ├── archetype/
│   │           ├── palette/
│   │           ├── references/
│   │           ├── design-system/
│   │           ├── generate/
│   │           ├── preview/
│   │           └── export/
│   ├── api/
│   │   ├── projects/
│   │   ├── brief/
│   │   ├── archetype/
│   │   ├── palette/
│   │   ├── references/
│   │   ├── design-system/
│   │   ├── generate/
│   │   ├── exports/
│   │   └── usage/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── layout/
│   ├── marketing/
│   ├── project/
│   ├── palette/
│   ├── references/
│   ├── design-system/
│   ├── preview/
│   └── export/
├── lib/
│   ├── ai/
│   ├── design-md/
│   ├── supabase/
│   ├── usage/
│   ├── validators/
│   ├── storage/
│   └── utils/
├── docs/
│   ├── product-spec-v2.md
│   ├── architecture.md
│   ├── database-schema.md
│   ├── codex-build-plan.md
│   └── decisions/
├── types/
├── tests/
└── scripts/
```

---

## 11. Data Model v2

### 11.1 Tables

#### `profiles`

Stores user profile and plan metadata.

Fields:

- `id`
- `email`
- `name`
- `avatar_url`
- `subscription_tier`
- `created_at`
- `updated_at`

#### `projects`

Stores high-level project metadata.

Fields:

- `id`
- `owner_id`
- `name`
- `type`
- `status`
- `thumbnail_path`
- `current_design_system_version_id`
- `created_at`
- `updated_at`
- `archived_at`

#### `project_briefs`

Stores structured onboarding data.

Fields:

- `id`
- `project_id`
- `purpose`
- `audience`
- `primary_goal`
- `secondary_goals`
- `emotional_core`
- `anti_patterns`
- `signature_moment`
- `raw_conversation`
- `created_at`
- `updated_at`

#### `visual_directions`

Stores archetype selections and blends.

Fields:

- `id`
- `project_id`
- `primary_archetype`
- `secondary_archetype`
- `blend_ratio`
- `rationale`
- `risk_notes`
- `created_at`

#### `color_palettes`

Stores generated and selected palettes.

Fields:

- `id`
- `project_id`
- `version`
- `name`
- `mode`
- `seed_colors`
- `locked_colors`
- `tokens`
- `usage_ratios`
- `contrast_report`
- `rationale`
- `is_selected`
- `created_at`

#### `references`

Stores uploaded reference metadata.

Fields:

- `id`
- `project_id`
- `owner_id`
- `category`
- `kind`
- `storage_path`
- `source_url`
- `annotation`
- `metadata`
- `created_at`

#### `reference_analyses`

Stores AI analysis for references.

Fields:

- `id`
- `reference_id`
- `project_id`
- `analysis`
- `model`
- `confidence`
- `created_at`

#### `reference_syntheses`

Stores project-level visual synthesis.

Fields:

- `id`
- `project_id`
- `summary`
- `patterns`
- `adaptation_guidance`
- `anti_copy_guidance`
- `created_at`

#### `design_system_versions`

Stores DESIGN.md versions.

Fields:

- `id`
- `project_id`
- `version_number`
- `design_md`
- `parsed_tokens`
- `lint_report`
- `source_snapshot`
- `created_by`
- `created_at`

#### `generation_jobs`

Stores durable generation jobs.

Fields:

- `id`
- `project_id`
- `design_system_version_id`
- `type`
- `status`
- `progress`
- `current_step`
- `model`
- `input_tokens`
- `output_tokens`
- `estimated_cost`
- `error`
- `created_at`
- `started_at`
- `completed_at`

#### `generated_artifacts`

Stores generated files/outputs.

Fields:

- `id`
- `project_id`
- `job_id`
- `design_system_version_id`
- `artifact_type`
- `name`
- `storage_path`
- `content`
- `metadata`
- `created_at`

#### `exports`

Stores export events and downloadable bundles.

Fields:

- `id`
- `project_id`
- `artifact_id`
- `format`
- `storage_path`
- `expires_at`
- `created_at`

#### `usage_ledger`

Stores credit and model usage history.

Fields:

- `id`
- `user_id`
- `project_id`
- `event_type`
- `credits_delta`
- `model`
- `input_tokens`
- `output_tokens`
- `cost_estimate`
- `metadata`
- `created_at`

#### `evaluations`

Stores quality checks.

Fields:

- `id`
- `project_id`
- `artifact_id`
- `design_system_version_id`
- `type`
- `score`
- `findings`
- `created_at`

---

## 12. API Design

### Projects

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Brief

```text
POST  /api/projects/:id/brief
PATCH /api/projects/:id/brief
GET   /api/projects/:id/brief
```

### Archetype

```text
POST /api/projects/:id/archetype/recommend
POST /api/projects/:id/archetype/select
GET  /api/archetypes
```

### Palette

```text
POST /api/projects/:id/palettes/generate
POST /api/projects/:id/palettes/manual
POST /api/projects/:id/palettes/extract
POST /api/projects/:id/palettes/:paletteId/select
PATCH /api/projects/:id/palettes/:paletteId
GET  /api/projects/:id/palettes
```

### References

```text
POST   /api/projects/:id/references/upload
POST   /api/projects/:id/references/analyze
POST   /api/projects/:id/references/synthesize
GET    /api/projects/:id/references
PATCH  /api/projects/:id/references/:referenceId
DELETE /api/projects/:id/references/:referenceId
```

### Design System

```text
POST /api/projects/:id/design-system/compile
POST /api/projects/:id/design-system/lint
POST /api/projects/:id/design-system/diff
POST /api/projects/:id/design-system/export
GET  /api/projects/:id/design-system/current
GET  /api/projects/:id/design-system/versions
```

### Generation

```text
POST /api/projects/:id/generate
GET  /api/projects/:id/jobs/:jobId
GET  /api/projects/:id/jobs
POST /api/projects/:id/refine
POST /api/projects/:id/regenerate-section
```

### Export

```text
POST /api/projects/:id/export/design-md
POST /api/projects/:id/export/tokens
POST /api/projects/:id/export/react
POST /api/projects/:id/export/html
GET  /api/projects/:id/exports
```

### Usage

```text
GET  /api/usage
POST /api/usage/estimate
```

---

## 13. Security, Privacy, and Safety

### 13.1 Storage

- Reference uploads must be private.
- Exports must be private.
- Use signed URLs for temporary access.
- Do not expose service role keys to the client.
- Validate file type and size server-side.
- Store image metadata before analysis.

### 13.2 Ownership

Every server route must verify:

- authenticated user exists
- project belongs to user
- reference belongs to project
- artifact belongs to project
- export belongs to project

### 13.3 Row-Level Security

All user-owned tables need RLS policies.

Minimum tables requiring RLS:

- profiles
- projects
- project_briefs
- visual_directions
- color_palettes
- references
- reference_analyses
- design_system_versions
- generation_jobs
- generated_artifacts
- exports
- usage_ledger
- evaluations

### 13.4 AI Safety / Copyright

Reference usage policy:

- Do not copy exact designs.
- Analyze and extract patterns.
- Synthesize a new design.
- Avoid trademark/logo replication.
- User should confirm rights to uploaded references.
- Anti-copy guidance should be generated for every reference synthesis.

### 13.5 Preview Sandbox

Generated output should run in an isolated preview environment.

Requirements:

- sandboxed iframe
- CSP
- no access to parent window
- no arbitrary remote script execution
- sanitize generated HTML before preview
- store generated code as artifacts, not direct database spaghetti fields

---

## 14. Quality Gates

Every generated design should be scored across:

1. Design-system adherence
2. Reference alignment
3. Originality
4. Accessibility
5. Contrast
6. Responsive behavior
7. Motion appropriateness
8. Performance risk
9. Code quality
10. Export readiness

### Minimum MVP Gates

- DESIGN.md lint passes with no errors.
- CTA text/background contrast passes or is flagged.
- Generated code compiles or is clearly marked as draft.
- Output uses selected palette tokens.
- Output avoids top anti-patterns.
- Export bundle includes all required files.

---

## 15. Pricing / Credits Strategy

### MVP Pricing Recommendation

Do not promise “free forever.”

Use a credit-based model from the start.

Suggested beta structure:

#### Free Beta

- 1 full project
- 3 palette generations
- 1 DESIGN.md compile
- 1 design generation
- DESIGN.md export
- Clarity watermark on generated preview

#### Starter

- Monthly credit pack
- More project generations
- React/HTML export
- No watermark

#### Pro

- Higher credits
- Priority generation
- More variants
- Brand kits
- Advanced exports

#### Studio

- Team features
- White-label exports
- Shared archetype library
- Collaboration
- Advanced version control

### Ledger Requirements

Credits must be tracked by event, not only as a number on the user profile.

Events:

- project created
- palette generated
- reference analyzed
- design-system compiled
- design generated
- refinement generated
- export created
- admin credit adjustment
- failed job refund

---

## 16. Roadmap

## Phase 0: Repository and Specification Foundation

Goal: prepare Codex and GitHub for clean build history.

Deliverables:

- GitHub repo
- Product Spec v2
- Codex build prompt
- architecture doc
- database schema doc
- changelog
- decisions directory
- project board/issues

Acceptance:

- Repo has a clean first commit.
- Main branch is protected or used carefully.
- Codex has a clear build prompt.

## Phase 1: Modern Foundation

Goal: working app shell.

Deliverables:

- Next.js app scaffold
- Tailwind v4 setup
- Supabase SSR auth
- dashboard
- projects CRUD
- private storage setup
- initial database schema
- RLS policies
- usage ledger scaffold

Acceptance:

- User can sign up/sign in.
- User can create a project.
- User can see project dashboard.
- Protected routes work.
- RLS prevents cross-user access.

## Phase 2: Brief + Archetype

Goal: capture intent and visual direction.

Deliverables:

- conversational brief
- save/resume
- AI brief summary
- archetype recommendations
- hybrid archetype selector
- visual direction persistence

Acceptance:

- User can complete project setup.
- Project has brief and visual direction.
- User can return and edit.

## Phase 3: Color Palette Picker

Goal: ship signature palette feature.

Deliverables:

- AI palette suggestions
- manual color wheel
- palette variations
- lock/regenerate
- contrast checks
- mini UI previews
- selected palette persistence

Acceptance:

- User can generate and select palette.
- Palette writes to project data.
- Palette can be used by DESIGN.md compiler.

## Phase 4: References

Goal: make references useful.

Deliverables:

- private upload
- annotation
- AI analysis
- reference synthesis
- anti-copy guidance

Acceptance:

- User can upload references.
- Analyses persist.
- Synthesis can feed design system.

## Phase 5: DESIGN.md Compiler

Goal: create versioned design system.

Deliverables:

- DESIGN.md generator
- lint integration
- diff integration
- token export
- Design Direction Board

Acceptance:

- Project has a valid design-system version.
- User can view board and raw DESIGN.md.
- Tokens export correctly.

## Phase 6: Generation + Preview

Goal: generate and preview real UI.

Deliverables:

- generation jobs
- variant generation
- safe preview
- artifact storage
- refinement loop
- quality checks

Acceptance:

- User can generate a landing page/dashboard starter.
- Preview works.
- Artifacts persist.
- User can refine.

## Phase 7: Export + Beta

Goal: usable beta product.

Deliverables:

- export bundles
- credit enforcement
- beta analytics
- error monitoring
- onboarding polish
- first user tests

Acceptance:

- User can complete end-to-end flow.
- Export works.
- Quality issues are tracked.
- Beta users can test.

---

## 17. GitHub Version History Strategy

### Repository Name

Recommended:

```text
clarity
```

Alternative:

```text
clarity-ai
clarity-design-system
clarity-app
```

Recommended visibility:

```text
private
```

### Branch Strategy

Use lightweight trunk-based development:

```text
main          stable working branch
feat/*        feature branches
fix/*         bug fixes
docs/*        documentation/spec updates
codex/*       Codex task branches
```

Examples:

```text
docs/product-spec-v2
feat/auth-foundation
feat/palette-picker
feat/design-md-compiler
codex/phase-1-foundation
```

### Commit Convention

Use conventional commits:

```text
docs: add Clarity Product Spec v2
chore: initialize Next.js app
feat: add Supabase SSR auth
feat: add project dashboard
feat: add palette picker seed flow
fix: enforce project ownership in palette route
refactor: move AI model routing into service
test: add RLS ownership tests
```

### Tags

```text
v0.1.0-spec
v0.2.0-foundation
v0.3.0-brief-archetype
v0.4.0-palette-picker
v0.5.0-design-md
v0.6.0-generation-preview
v0.7.0-beta
```

### Repository Docs

```text
docs/
├── product-spec-v2.md
├── codex-build-plan.md
├── architecture.md
├── database-schema.md
├── api-contracts.md
├── design-md-integration.md
├── color-palette-picker.md
├── security.md
├── roadmap.md
├── changelog.md
└── decisions/
    ├── 0001-use-design-md.md
    ├── 0002-private-reference-storage.md
    ├── 0003-defer-figma-export.md
    └── 0004-credit-ledger.md
```

---

## 18. Codex Build Instructions

Codex should build in small, testable slices.

### 18.1 Codex Rules

Codex should:

- read `docs/product-spec-v2.md` first
- work on one phase at a time
- create or update tests where reasonable
- avoid broad rewrites unless requested
- keep generated UI accessible
- never expose service role keys
- verify project ownership in all protected routes
- use `@supabase/ssr`, not deprecated auth helpers
- use private storage for references/exports
- use environment variables for all AI models
- avoid hard-coded model IDs in product logic
- create new design-system versions instead of overwriting
- keep Figma/Webflow/deploy out of MVP implementation

### 18.2 First Codex Task

Prompt:

```text
You are building Clarity v2.

Read docs/product-spec-v2.md completely before coding.

Your first task is Phase 1: Modern Foundation.

Create a Next.js App Router project with TypeScript, Tailwind CSS v4, Supabase SSR auth utilities, protected dashboard routes, project CRUD, private storage conventions, and initial database schema files.

Do not implement AI generation yet.

Important rules:
- Use @supabase/ssr, not @supabase/auth-helpers-nextjs.
- All user-owned database actions must verify ownership.
- Reference and export storage must be private.
- Create docs/database-schema.md with the schema plan before writing SQL.
- Add clear TODOs for Phase 2 without implementing it.
- Keep changes small, organized, and easy to review.
```

---

## 19. Open Product Decisions

These decisions can wait until implementation reaches the relevant phase:

1. Which AI provider is primary for production?
2. Should Clarity support multiple AI providers?
3. Should palette generation use LLM-only, algorithmic color math, or both?
4. Should previews compile React dynamically or use prebuilt template runtimes?
5. Should the first MVP output use Next.js components or plain React components?
6. Should beta users pay immediately or receive credits?
7. What exact credit cost should each action have?
8. Will Clarity’s own app UI have a root `DESIGN.md`?
9. Should the user’s generated `DESIGN.md` files be downloadable immediately?
10. How much visual editing should exist before export?

Recommended defaults:

- Use AI + deterministic algorithms for palette generation.
- Export React/Next.js and static HTML first.
- Use root `DESIGN.md` for Clarity’s own app UI.
- Give beta users limited free credits.
- Require download/export to have a completed design-system version.

---

## 20. Success Metrics

### Product Metrics

- Time to first selected palette: under 10 minutes
- Time to first DESIGN.md: under 20 minutes
- Time to first preview: under 35 minutes
- Export rate: 50%+ of completed previews
- Refinement rate: fewer than 3 refinements to satisfactory output
- User quality rating: 8/10 or better

### Technical Metrics

- 0 cross-user data access issues
- 0 public reference leaks
- 95%+ generation jobs recover after refresh
- DESIGN.md compile success rate above 90%
- Export success rate above 90%
- Critical accessibility issues flagged before export

### Business Metrics

- 50 private beta users
- 200 projects created
- 100 generated previews
- 50 exports
- 10 paying users or strong paid-intent signals
- 5 case studies

---

## 21. MVP Acceptance Checklist

Clarity v2 MVP is ready for private beta when:

- [ ] User can sign up and sign in.
- [ ] User can create a project.
- [ ] User can complete the brief.
- [ ] User can select visual direction.
- [ ] User can generate/select a palette.
- [ ] User can upload/annotate references.
- [ ] User can generate a DESIGN.md.
- [ ] DESIGN.md is linted and versioned.
- [ ] User can generate a preview.
- [ ] Preview is sandboxed.
- [ ] User can refine at least once.
- [ ] User can export DESIGN.md.
- [ ] User can export tokens.
- [ ] User can export React/HTML.
- [ ] Usage is tracked.
- [ ] RLS and ownership checks are verified.
- [ ] Reference storage is private.
- [ ] Admin can review failed jobs.
- [ ] There is a changelog.
- [ ] GitHub history is clean.

---

## 22. Source Inputs Used for v2

This v2 spec is based on:

- Clarity Product Specification v1.0
- Clarity Phase 1 AI coding initialization prompt
- Clarity Phase 2 Conversational Onboarding prompt
- Clarity Phase 3 Style Archetype Selector prompt
- Clarity Phases 4–7 Complete Generation System prompt
- Clarity Master Build Guide
- Design Super-Prompt Template v3.0
- Google Labs DESIGN.md specification and repository
- Current framework/provider documentation reviewed on May 3, 2026

---

## 23. Final Product Direction

Clarity v2 should not chase every export format immediately.

It should win by making the first part of the creative process excellent:

1. Understand what the user is building.
2. Understand what the user loves visually.
3. Help the user create a strong color story.
4. Compile the direction into `DESIGN.md`.
5. Generate a beautiful, useful, inspectable interface.
6. Let the user refine and export.

That is enough to become a real product.

The guiding promise:

> **Clarity turns taste into a system and a system into production-ready design.**

