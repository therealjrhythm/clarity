# Clarity Agent Instructions

## Product

Clarity is an AI-powered design application that helps users turn project intent, visual references, color stories, and brand archetypes into production-ready design systems and interfaces.

The product slogan is:

"Design with intention. Build with intelligence."

Use `docs/product-spec-v2.md` as the primary source of truth.

The older v1 phase docs are historical reference only. Do not implement deprecated v1 assumptions unless they are explicitly preserved in Product Spec v2.

## Current build rule

Build one phase at a time.

For the current build, focus on Phase 1 only: Modern Foundation.

Do not build:
- Color Palette Picker
- Reference analysis
- AI generation routes
- DESIGN.md compiler
- Figma export
- Webflow export
- One-click deployment
- Billing
- Team collaboration

It is okay to scaffold folders/types that make future phases easier, but do not implement future-phase functionality yet.

## Technical stack

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

## Repository expectations

Before making code changes:
1. Read `docs/product-spec-v2.md`.
2. Read `docs/codex-initial-build-prompt.md`.
3. Summarize the implementation plan.
4. List files you intend to create or modify.
5. Confirm the work is limited to the current phase.

After making code changes:
1. Run available lint/type/build checks.
2. Summarize what changed.
3. List any known issues or deferred items.
4. Do not claim completion unless the app runs and the checks pass.

## Git workflow

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

## Security rules

Never commit real secrets.

Never expose:
- `SUPABASE_SERVICE_ROLE_KEY`
- AI provider API keys
- Stripe secret keys
- User private project data
- Uploaded reference images through public URLs unless explicitly intended

All project data must be ownership-scoped.

Any server action/API route touching project data must verify the authenticated user owns the project.

RLS policies must be present for user-owned tables.

Reference images and generated exports should use private storage by default.

## Design quality rules

Clarity should feel like a premium creative tool, not a generic AI SaaS dashboard.

The UI should support:
- Clear hierarchy
- Calm, intentional motion
- Strong empty states
- Beautiful project cards
- A visual workflow from brief → archetype → color → references → DESIGN.md → preview → export

Keep the slogan:
"Design with intention. Build with intelligence."

Do not create generic marketing copy unless the product spec asks for it.

## Architecture rules

Prefer modular services over giant route handlers.

Use clear folders:
- `app/`
- `components/`
- `lib/`
- `types/`
- `supabase/migrations/`
- `docs/`

Future AI functionality should be designed around:
- durable generation jobs
- design system versions
- generated artifacts
- usage ledger
- quality evaluations

Do not store all generated output directly on the `projects` table.

## Review guidelines

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