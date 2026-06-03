# Clarity Repo Organization Prompt
## Clean File Structure + Docs Source-of-Truth Alignment

You are working inside the existing Clarity Git repository.

Do not restart the project.

Do not create a new app.

Do not delete important files.

This task is to clean and organize the repository structure so current app code, current product docs, legacy methodology docs, implementation prompts, and source-of-truth files are clearly separated.

The goal is to prevent future coding agents from accidentally implementing outdated v1 assumptions.

---

# 1. Current Problem

The repository currently contains a mix of:

- Active Next.js app code
- Supabase setup
- Current v2 product docs
- Older v1 design/coding prompts
- Legacy methodology files
- Phase 1.1 implementation prompts
- Root-level docs that should be moved into `docs/`
- A root-level `DESIGN.md - Aesthetic Engine v4.0 Clarity Brain.md` file that should become the canonical `docs/DESIGN.md`
- A `Design Docs/` folder containing historical materials

This needs to be organized clearly.

---

# 2. Primary Goal

Create a clean, future-proof file structure:

```text
clarity/
  app/
  components/
  lib/
  middleware.ts
  supabase/
  types/
  public/
  docs/
    DESIGN.md
    product-spec-v2.md
    architecture.md
    database-schema.md
    changelog.md

    prompts/
      phase1-1-dashboard-reposition.md
      phase1-1-dashboard-reposition-v2.md

    methodology/
      design-super-prompt-template-v3.md
      v3-to-design-md-v4-map.md

    legacy/
      clarity-ai-coding-prompt-phase1.md
      clarity-ai-coding-prompt-phase2.md
      clarity-ai-coding-prompt-phase3.md
      clarity-ai-coding-prompt-phases4-7.md
      clarity-master-build-guide.md
      clarity-product-spec-v1.md

    decisions/
      0001-use-design-md.md
      0002-private-reference-storage.md
      0003-use-design-md-v4-as-clarity-brain.md
      0004-treat-v1-prompts-as-methodology-not-implementation.md

    assets/
      screenshots/
        screenshot-2026-05-03-112301.png

  AGENTS.md
  README.md
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs
  .env.example
  .gitignore
```

Adapt paths if the current project uses `src/`, but do not introduce `src/` if the existing app is already root-based.

---

# 3. Preserve Active Application Code

Do not move active app code unless absolutely necessary.

Keep these where they are unless the repo already uses a different convention:

```text
app/
components/
lib/
middleware.ts
supabase/
types/
public/
package.json
package-lock.json
tsconfig.json
next.config.ts
eslint.config.mjs
postcss.config.mjs
```

Do not modify working auth, routes, middleware, Supabase clients, or environment behavior as part of this file organization task.

This task is primarily documentation and repo organization.

---

# 4. Move Current Source-of-Truth Docs Into `docs/`

Ensure these current docs are in `docs/`:

```text
docs/product-spec-v2.md
docs/architecture.md
docs/database-schema.md
docs/changelog.md
```

If there are duplicate versions at the root, keep the best/current one in `docs/` and remove or archive duplicates only after confirming content is preserved.

Do not delete useful content.

If unsure which file is newer, compare content and preserve the more complete version.

---

# 5. Canonical DESIGN.md

There is currently a file like:

```text
DESIGN.md - Aesthetic Engine v4.0 Clarity Brain.md
```

Move or copy its content into the canonical location:

```text
docs/DESIGN.md
```

After creating `docs/DESIGN.md`, the root-level long-name file should either be removed if fully duplicated or moved into:

```text
docs/archive/
```

Do not leave two competing DESIGN.md files at the root.

The canonical source of truth should be:

```text
docs/DESIGN.md
```

Update references in README, AGENTS.md, and docs to point to:

```text
docs/DESIGN.md
```

---

# 6. Organize Phase 1.1 Implementation Prompts

Move the Phase 1.1 implementation prompt files from root into:

```text
docs/prompts/
```

For example:

```text
clarity-phase1.1-implementation-prompt.md
clarity-phase1.1-implementation-prompt-v2.md
```

should become:

```text
docs/prompts/phase1-1-dashboard-reposition.md
docs/prompts/phase1-1-dashboard-reposition-v2.md
```

Use clean filenames with hyphens.

Do not leave prompt drafts at the repo root unless they are actively required by tooling.

---

# 7. Organize Legacy v1 Files

Move older v1 build prompts into:

```text
docs/legacy/
```

Files likely include:

```text
clarity-ai-coding-prompt-phase1.md
clarity-ai-coding-prompt-phase2.md
clarity-ai-coding-prompt-phase3.md
clarity-ai-coding-prompt-phases4-7.md
clarity-master-build-guide.md
clarity-product-spec-v1.md
```

These are not current implementation instructions.

They should be preserved as historical product planning and methodology context.

Do not delete them.

Add a small `docs/legacy/README.md` explaining:

```markdown
# Legacy Clarity v1 Materials

These files are preserved for historical methodology and product context.

They should not be treated as current implementation instructions.

Current implementation should follow:

1. Existing app code
2. AGENTS.md
3. docs/product-spec-v2.md
4. docs/DESIGN.md
5. docs/architecture.md
6. docs/database-schema.md
7. docs/decisions/*
```

---

# 8. Organize Methodology Files

Move the v3 design methodology file into:

```text
docs/methodology/design-super-prompt-template-v3.md
```

This file is valuable methodology and should not be treated as a deprecated build prompt.

It should be preserved as the foundation of Clarity’s design intelligence.

Create:

```text
docs/methodology/v3-to-design-md-v4-map.md
```

This file should explain how v3 methodology maps into the current `docs/DESIGN.md` framework.

Include a table like:

```markdown
# V3 Super-Prompt to DESIGN.md v4 Map

The v3 Design Super-Prompt methodology remains valuable as Clarity's historical design reasoning framework. In Clarity v2, this methodology is distilled into `docs/DESIGN.md` and used internally by the app.

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

---

# 9. Organize Screenshots and Media

If there are screenshot files at the root or in `Design Docs/`, move them into:

```text
docs/assets/screenshots/
```

Rename them to clean, filesystem-safe names.

Example:

```text
Screenshot 2026-05-03 at 11.23.01 AM.png
```

should become:

```text
docs/assets/screenshots/screenshot-2026-05-03-112301.png
```

Update references if any docs point to the image.

---

# 10. What To Do With `Design Docs/`

There appears to be a folder named:

```text
Design Docs/
```

Inspect its contents.

Move files from `Design Docs/` into the proper new locations:

```text
docs/legacy/
docs/methodology/
docs/assets/screenshots/
docs/prompts/
```

After all contents are safely moved and references updated, remove the empty `Design Docs/` folder.

Do not delete any files without confirming their content has been preserved.

---

# 11. ADR Requirements

Ensure these ADRs exist:

```text
docs/decisions/0001-use-design-md.md
docs/decisions/0002-private-reference-storage.md
docs/decisions/0003-use-design-md-v4-as-clarity-brain.md
docs/decisions/0004-treat-v1-prompts-as-methodology-not-implementation.md
```

If `0003` does not exist, create it:

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
- Future AI routes should reference `docs/DESIGN.md`.
- User-facing UX should show concise direction boards, not giant prompts.
```

If `0004` does not exist, create it:

```markdown
# 0004: Treat v1 Prompts as Methodology, Not Implementation

## Status

Accepted

## Context

The repository contains legacy Clarity v1 planning and AI coding prompts. These documents contain valuable methodology, including reference-first design, emotional architecture, archetype selection, anti-pattern capture, visual references, and design-system thinking.

However, some implementation assumptions are outdated. They reference deprecated Supabase helpers, public storage, a `public.users` table, Claude-only generation, one giant projects table, and a user-facing super-prompt flow.

## Decision

Clarity will preserve v1 methodology as internal product intelligence, but current implementation must follow Product Spec v2, the current application codebase, and `docs/DESIGN.md`.

Legacy files may be stored in `docs/legacy/` or `docs/methodology/`.

## Consequences

- v1 methodology remains available.
- Coding agents should not implement v1 technical assumptions.
- `docs/DESIGN.md` becomes the durable source of truth.
- Clarity evolves from a super-prompt generator into a design-system compiler.
```

---

# 12. Update AGENTS.md

Update `AGENTS.md` to clearly define the current source-of-truth hierarchy.

Add or ensure this section exists:

```markdown
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
```

Also ensure `AGENTS.md` says:

```markdown
## Current Build Rule

Focus on Phase 1.1: Dashboard Reposition and Workflow Preparation.

Do not implement live AI generation, reference analysis, palette generation backend, DESIGN.md compiler backend, Figma export, Webflow export, one-click deployment, billing, or team collaboration in this phase.
```

---

# 13. Update README.md

Update the README to explain the docs layout.

Add a section like:

```markdown
## Documentation Structure

- `docs/product-spec-v2.md` — Current product specification.
- `docs/DESIGN.md` — Clarity's design-intelligence source of truth.
- `docs/architecture.md` — Current technical architecture.
- `docs/database-schema.md` — Current database schema.
- `docs/decisions/` — Architecture decision records.
- `docs/methodology/` — Preserved design methodology, including the v3 Super-Prompt framework.
- `docs/legacy/` — Historical v1 build prompts and planning docs. These are reference-only.
- `docs/prompts/` — Current implementation prompts for Codex/Cursor.
```

Make clear that legacy files are not current implementation instructions.

---

# 14. Update Changelog

Update:

```text
docs/changelog.md
```

Add an entry:

```markdown
## Unreleased

- Organized Clarity documentation into current docs, methodology, legacy materials, prompts, decisions, and assets.
- Established `docs/DESIGN.md` as the canonical design-intelligence source of truth.
- Preserved v1 build prompts as legacy reference material.
- Preserved the v3 Design Super-Prompt as methodology and mapped it to the current DESIGN.md framework.
- Added ADRs for DESIGN.md v4 and legacy methodology handling.
- Updated AGENTS.md and README.md with source-of-truth guidance.
```

---

# 15. Important: Do Not Break Imports

Before moving files, check whether any app code imports from these files.

Most docs likely are not imported by app code, but verify.

If an app file imports a moved file, update the import path.

Do not move active source files from:

```text
app/
components/
lib/
types/
supabase/
```

unless necessary.

---

# 16. Important: Do Not Commit Secrets

Do not move or expose:

```text
.env.local
```

Ensure `.env.local` remains ignored by git.

Ensure `.env.example` remains safe and does not include real secrets.

Do not print secrets.

Do not copy secrets into docs.

---

# 17. Final Verification

After reorganizing:

1. Run `git status` and summarize file moves.
2. Confirm no important files were deleted.
3. Confirm `docs/DESIGN.md` exists.
4. Confirm `docs/product-spec-v2.md` exists.
5. Confirm `docs/methodology/design-super-prompt-template-v3.md` exists.
6. Confirm `docs/methodology/v3-to-design-md-v4-map.md` exists.
7. Confirm `docs/legacy/README.md` exists.
8. Confirm `docs/decisions/0003-use-design-md-v4-as-clarity-brain.md` exists.
9. Confirm `docs/decisions/0004-treat-v1-prompts-as-methodology-not-implementation.md` exists.
10. Confirm README and AGENTS.md point to correct docs.
11. Run lint/typecheck/build only if this task touched code or config.
12. Confirm the dev server still runs if it was running before.

---

# 18. Expected Final File Tree

Aim for this structure:

```text
clarity/
  .codex/
  .next/
  app/
  components/
  lib/
  node_modules/
  public/
  supabase/
    migrations/
    types/
  types/

  docs/
    DESIGN.md
    product-spec-v2.md
    architecture.md
    database-schema.md
    changelog.md

    prompts/
      phase1-1-dashboard-reposition.md
      phase1-1-dashboard-reposition-v2.md

    methodology/
      design-super-prompt-template-v3.md
      v3-to-design-md-v4-map.md

    legacy/
      README.md
      clarity-ai-coding-prompt-phase1.md
      clarity-ai-coding-prompt-phase2.md
      clarity-ai-coding-prompt-phase3.md
      clarity-ai-coding-prompt-phases4-7.md
      clarity-master-build-guide.md
      clarity-product-spec-v1.md

    decisions/
      0001-use-design-md.md
      0002-private-reference-storage.md
      0003-use-design-md-v4-as-clarity-brain.md
      0004-treat-v1-prompts-as-methodology-not-implementation.md

    assets/
      screenshots/
        screenshot-2026-05-03-112301.png

  AGENTS.md
  README.md
  middleware.ts
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs
  .env.example
  .gitignore
```

Do not worry if `.next/` or `node_modules/` are present locally. They should remain ignored by git.

---

# 19. Completion Message

When finished, report:

- What files were moved
- What files were created
- What docs were updated
- Whether `docs/DESIGN.md` is now canonical
- Whether legacy files are preserved
- Whether ADRs were created
- Whether README and AGENTS.md were updated
- Whether any checks were run
- Any follow-up recommendations
