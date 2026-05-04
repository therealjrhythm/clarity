# 0002: Keep References and Exports Private by Default

## Status

Accepted.

## Context

References may contain private client work, paid inspiration, screenshots, or
brand-sensitive material. Generated exports may contain user project data.

## Decision

Reference, generated artifact, and export storage must use private Supabase
Storage buckets. Access should use authenticated ownership checks and signed
URLs where needed.

Phase 1 creates private bucket conventions and policies. Upload, analysis, and
export routes are deferred.

## Consequences

- No public reference image buckets.
- No public export URLs.
- Storage paths should begin with `{user_id}/{project_id}/`.
- Server routes must verify project ownership before issuing signed URLs.
