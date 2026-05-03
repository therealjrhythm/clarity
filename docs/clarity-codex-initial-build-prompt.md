# Clarity v2 — Codex Initial Build Prompt

Use this prompt in Codex after creating the GitHub repository and adding `docs/product-spec-v2.md`.

---

You are building **Clarity v2**, an AI-powered design application.

Read `docs/product-spec-v2.md` completely before writing code.

## Product Summary

Clarity turns user intent, visual references, color direction, and brand strategy into production-ready design systems and interfaces.

The core pipeline is:

```text
Project brief → archetype direction → color palette picker → references → DESIGN.md → generated preview → export
```

The app should treat `DESIGN.md` as the persistent design-system source of truth.

## Non-Negotiable Rules

- Use Next.js App Router, TypeScript, and Tailwind CSS v4.
- Use Supabase for auth, database, and storage.
- Use `@supabase/ssr`, not deprecated auth helpers.
- Reference and export storage must be private.
- Never expose service role keys to the client.
- Every server-side project action must verify ownership.
- Do not implement Figma export, Webflow export, or one-click deploy in MVP.
- Do not hard-code AI model IDs in business logic.
- Store model IDs in environment variables.
- Every generated design system must be versioned.
- Generated previews must be sandboxed.
- Keep changes small and reviewable.

## Phase 1 Task: Modern Foundation

Build the foundation only. Do not implement AI generation yet.

Deliver:

1. Next.js app scaffold
2. Tailwind v4 setup
3. Supabase SSR client utilities
4. Auth pages/routes
5. Protected dashboard route
6. Project CRUD
7. Initial database schema file
8. RLS policy plan
9. Private storage conventions
10. Usage ledger scaffold
11. Basic landing page using the slogan:
   **Design with intention. Build with intelligence.**

## Required Files

Create or update:

```text
docs/product-spec-v2.md
docs/database-schema.md
docs/architecture.md
docs/changelog.md
docs/decisions/0001-use-design-md.md
docs/decisions/0002-private-reference-storage.md
app/page.tsx
app/(auth)/login/page.tsx
app/(auth)/signup/page.tsx
app/(dashboard)/dashboard/page.tsx
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/middleware.ts
types/database.ts
```

## Acceptance Criteria

- User can sign up/sign in.
- Protected dashboard redirects unauthenticated users.
- Authenticated user can create, view, update, and delete own projects.
- Cross-user project access is prevented.
- Schema includes `profiles`, `projects`, and `usage_ledger`.
- Docs explain future tables for briefs, palettes, references, design-system versions, generation jobs, artifacts, exports, and evaluations.
- Build passes.
- No deprecated Supabase auth helper packages are installed.

## After Phase 1

Stop and summarize:

- files changed
- commands run
- tests/checks run
- what is ready
- what remains for Phase 2
