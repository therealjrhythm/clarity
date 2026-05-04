# Changelog

## Unreleased

- Added Phase 1 Modern Foundation scaffold.
- Added Next.js App Router, TypeScript, Tailwind CSS v4, and Supabase SSR setup.
- Added auth pages, protected dashboard routes, and basic project CRUD.
- Added initial Supabase migration with profiles, projects, usage ledger, RLS,
  and private storage buckets.
- Documented Phase 1 architecture, database schema, and deferred future phases.

### Phase 1 Known Issues

- `npm audit` reports a moderate transitive PostCSS advisory through Next.js.
  `npm audit fix --force` proposes a breaking Next.js downgrade, and an npm
  `overrides.postcss` remediation was not kept because it conflicts with the
  direct PostCSS dependency during install.
