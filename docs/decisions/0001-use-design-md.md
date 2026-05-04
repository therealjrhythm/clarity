# 0001: Use DESIGN.md as the Durable Design-System Source

## Status

Accepted for future phases.

## Context

Clarity v2 treats project intent, visual direction, palette, references, and
generation output as inputs to a durable design-system artifact.

## Decision

Future phases will compile project direction into versioned `DESIGN.md` files.
Phase 1 does not implement the compiler. It only keeps the architecture prepared
for separate design-system version tables and generated artifacts.

## Consequences

- Generated output should be based on explicit design-system versions.
- The `projects` table must remain metadata-focused.
- Future compiler, lint, diff, and export logic should live in modular services.
