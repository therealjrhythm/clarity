# 0003: Use DESIGN.md v4 as Clarity's Design Intelligence Brain

## Status

Accepted.

## Context

Clarity needs a durable source of truth for design intelligence. Earlier versions relied on a large user-facing super-prompt methodology. Product Spec v2 shifts Clarity toward a guided design-system compiler where project inputs become a persistent design artifact.

## Decision

Clarity will use `docs/DESIGN.md` as the internal design-intelligence brain. The system will use it to guide brand intake, approval gates, archetypes, color stories, typography systems, references, layout, motion, accessibility, tokens, preview, and export.

## Consequences

- Clarity becomes a design-system compiler rather than a generic AI page generator.
- The app can generate consistent outputs across sessions.
- Future AI routes should reference `docs/DESIGN.md`.
- User-facing UX should show concise direction boards, not giant prompts.
