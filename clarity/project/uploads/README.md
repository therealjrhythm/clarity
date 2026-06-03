# Clarity

Design with intention. Build with intelligence.

Clarity is an AI-powered design application that turns project intent, visual
references, color stories, and brand archetypes into production-ready design
systems and interfaces.

This repository currently contains the **Phase 1: Modern Foundation** app and is preparing **Phase 1.1: Dashboard Reposition and Workflow Preparation**.

## Phase 1 Includes

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase SSR auth with `@supabase/ssr`
- Login and signup pages
- Protected dashboard route
- Basic project CRUD
- Initial Supabase schema and RLS migration
- Private storage bucket conventions
- Usage ledger scaffold

## Deferred

These are intentionally not implemented in Phase 1.1:

- Live AI generation
- Palette generation backend
- Typography backend
- Reference analysis
- AI generation routes
- DESIGN.md compiler backend
- Preview/export system
- Billing
- Team collaboration
- Figma, Webflow, or one-click deployment

## Documentation Structure

- `docs/product-spec-v2.md` - Current product specification.
- `docs/DESIGN.md` - Clarity's design-intelligence source of truth.
- `docs/architecture.md` - Current technical architecture.
- `docs/database-schema.md` - Current database schema.
- `docs/decisions/` - Architecture decision records.
- `docs/methodology/` - Preserved design methodology, including the v3 Super-Prompt framework.
- `docs/legacy/` - Historical v1 build prompts and planning docs. These are reference-only.
- `docs/prompts/` - Current implementation prompts for Codex/Cursor.

Legacy files are preserved for methodology and context, but they are not current implementation instructions.

## Environment Variables

Create a local `.env.local` file when running the app against Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is listed in `.env.example` for future server-only
admin/background tasks. It is not required for Phase 1 runtime and must never be
used in client-side code.

AI and Stripe keys are future-phase placeholders only.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Database

The initial migration is:

```text
supabase/migrations/0001_phase_1_foundation.sql
```

It is committed for review but should not be applied to a live Supabase project
until the target project is ready.
