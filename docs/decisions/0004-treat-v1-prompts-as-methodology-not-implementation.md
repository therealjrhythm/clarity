# 0004: Treat v1 Prompts as Methodology, Not Implementation

## Status

Accepted.

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
