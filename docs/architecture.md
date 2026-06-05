# Clarity Architecture

This repository currently implements Phase 1: Modern Foundation, Phase 1.1:
Dashboard Reposition and Workflow Preparation, and Phase 2: AI-Assisted Brand
Brief.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth, Postgres, and Storage
- `@supabase/ssr`
- Zod validation for project forms
- Gemini API for the tightly scoped Brand Brief AI layer

## Auth Flow

The app uses Supabase SSR clients:

- `lib/supabase/client.ts` creates browser clients for client components.
- `lib/supabase/server.ts` creates server clients with Next cookies.
- `lib/supabase/middleware.ts` refreshes auth sessions and redirects anonymous
  users away from protected dashboard/project routes.

`SUPABASE_SERVICE_ROLE_KEY` is not used by client code and is not required for
Phase 1 app runtime.

## Protected Routes

The dashboard route group is protected by:

- middleware path checks for `/dashboard` and `/projects`
- `app/(dashboard)/layout.tsx`
- `requireUser()` in server pages/actions

If Supabase env vars are missing, dashboard routes render a configuration notice
instead of blocking build-time checks.

## Project Ownership

Project reads and mutations use both RLS and app-layer checks:

- `listProjects(userId)` filters by `owner_id`
- `getOwnedProject(projectId, userId)` verifies ownership
- `requireOwnedProject(projectId, userId)` returns 404 for non-owned projects
- project update/archive actions verify ownership before writing
- Brand Brief queries/actions verify ownership through the associated project
  before reading or mutating `project_briefs`

## Phase 2 Brand Brief

Phase 2 adds the first live AI layer, scoped to Brand Brief creation.

The server-only Gemini adapter lives in `lib/ai/gemini.ts` and reads:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` (default: `gemini-3.5-flash`)

The Brand Brief domain lives in `lib/briefs/`:

- prompt/foundation question contextualization
- Brand Brief synthesis
- typed AI error handling and one automatic repair retry for invalid output
- `project_briefs` queries and server actions
- Zod validation for foundation answers, prompt analysis, and brief content

Gemini calls are never made from client components. If the API is unavailable,
returns invalid JSON, or is missing configuration, Clarity shows a
product-friendly error with retry rather than generating a weaker local result.

Phase 2 persists:

- structured foundation answers
- prompt analysis/question context
- generated or edited Brand Brief JSON
- brief summary, model, generation timestamp, and AI generation state

## Private Storage

Phase 1 creates private Supabase Storage buckets only. It does not create
`storage.objects` read, insert, update, or delete policies. Later upload and
export routes must verify project ownership before issuing signed URLs or
performing server-side storage writes.

## Phase 1 UI

The UI includes:

- landing page with the Clarity slogan
- signup and login pages
- protected dashboard
- project create form
- project detail page
- project settings page
- archived project behavior instead of hard-delete-first UX

## Phase 1.1 UI Preparation

Phase 1.1 repositions the authenticated workspace as a dark, premium creative
design-system workspace.

The UI may include future-ready, UI-only surfaces for:

- Clarity workflow progress
- AI Help buttons and panel placeholders
- provider-agnostic model selector metadata
- typography recommendation previews
- color story previews
- Design Direction Board sections

These surfaces do not call AI providers, persist model preferences, upload
references, compile DESIGN.md files, generate previews, or write future workflow
state to the database.

## Deferred Architecture

The following are intentionally deferred:

- archetype recommendation
- Color Palette Picker
- typography backend
- reference upload and AI analysis
- DESIGN.md compiler
- generation jobs and previews
- exports
- billing
- team collaboration
