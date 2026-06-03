# Clarity Architecture

This repository currently implements Phase 1: Modern Foundation and Phase 1.1:
Dashboard Reposition and Workflow Preparation.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth, Postgres, and Storage
- `@supabase/ssr`
- Zod validation for project forms

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

- conversational brief
- archetype recommendation
- Color Palette Picker
- typography backend
- reference upload and AI analysis
- DESIGN.md compiler
- generation jobs and previews
- exports
- billing
- team collaboration
