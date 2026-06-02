# Clarity Agent Instructions

## Product

Clarity is an AI-powered design application that helps users turn project intent, visual references, color stories, and brand archetypes into production-ready design systems and interfaces.

The product slogan is:

"Design with intention. Build with intelligence."

Use `docs/product-spec-v2.md` as the primary source of truth.

The older v1 phase docs are historical reference only. Do not implement deprecated v1 assumptions unless they are explicitly preserved in Product Spec v2.

## Current Build Rule

Build one phase at a time.

For the current build, focus on Phase 1.1: Dashboard Reposition and Workflow Preparation.

Do not build:

- Live AI generation
- Reference analysis
- Palette generation backend
- Typography backend
- DESIGN.md compiler backend
- Figma export
- Webflow export
- One-click deployment
- Billing
- Team collaboration

It is okay to scaffold folders, types, and UI-only placeholders that make future phases easier, but do not implement future-phase backend functionality yet.

## Source of Truth Priority

Use this order when files conflict:

1. Existing application code and database conventions
2. `AGENTS.md`
3. `docs/product-spec-v2.md`
4. `docs/DESIGN.md`
5. `docs/architecture.md`
6. `docs/database-schema.md`
7. `docs/decisions/*`
8. Legacy v1 files as methodology/reference only

Legacy v1 files must not override Product Spec v2, `docs/DESIGN.md`, Supabase SSR architecture, current schema, or current build rules.

## Technical Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase SSR auth
- Supabase Postgres
- Supabase Storage
- Zod for validation where useful

Avoid:

- Deprecated Supabase auth helpers
- Public buckets for private user/client references
- Client-side privileged writes
- Hard-coded AI model names
- One giant database table for all project state
- Building AI features before the foundation is stable

## Repository Expectations

Before making code changes:

1. Read `docs/product-spec-v2.md`.
2. Read `docs/clarity-codex-initial-build-prompt.md`.
3. Summarize the implementation plan.
4. List files you intend to create or modify.
5. Confirm the work is limited to the current phase.

After making code changes:

1. Run available lint, type, and build checks.
2. Summarize what changed.
3. List any known issues or deferred items.
4. Do not claim completion unless the app runs and the checks pass.

## Git Workflow

Work on feature branches, not directly on `main`.

Recommended branch names:

- `phase-1-foundation`
- `phase-2-brief-flow`
- `phase-3-color-archetypes`
- `phase-4-references`
- `phase-5-designmd-compiler`
- `phase-6-generation-preview`
- `phase-7-export-beta`

Use clear commit messages:

- `docs: ...`
- `chore: ...`
- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `test: ...`

## Security Rules

Never commit real secrets.

Never expose:

- `SUPABASE_SERVICE_ROLE_KEY`
- AI provider API keys
- Stripe secret keys
- User private project data
- Uploaded reference images through public URLs unless explicitly intended

All project data must be ownership-scoped.

Any server action or API route touching project data must verify that the authenticated user owns the project.

RLS policies must be present for user-owned tables.

Reference images and generated exports should use private storage by default.

## Design Quality Rules

Clarity should feel like a premium creative tool, not a generic AI SaaS dashboard.

The UI should support:

- Clear hierarchy
- Calm, intentional motion
- Strong empty states
- Beautiful project cards
- A visual workflow from brief to archetype to color to references to DESIGN.md to preview to export

Keep the slogan:

"Design with intention. Build with intelligence."

Do not create generic marketing copy unless the product spec asks for it.

## Architecture Rules

Prefer modular services over giant route handlers.

Use clear folders:

- `app/`
- `components/`
- `lib/`
- `types/`
- `supabase/migrations/`
- `docs/`

Future AI functionality should be designed around:

- Durable generation jobs
- Design system versions
- Generated artifacts
- Usage ledger
- Quality evaluations

Do not store all generated output directly on the `projects` table.

## Review Guidelines

When reviewing code, prioritize:

- Auth correctness
- RLS coverage
- Data ownership
- Secret handling
- Type safety
- Build stability
- Future extensibility
- Avoiding premature future-phase implementation

Flag P0/P1 issues first.

Avoid style-only feedback unless it affects usability, security, maintainability, or product quality.
