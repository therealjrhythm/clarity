# Clarity Database Schema

Phase 1 creates only the Modern Foundation schema. It supports Supabase Auth,
app-level profiles, owned projects, private storage conventions, and a usage
ledger scaffold.

## Phase 1 Tables

### `profiles`

App-level user profile data keyed to `auth.users.id`. This avoids a
`public.users` table and prevents naming confusion with Supabase Auth.

Fields:

- `id`
- `email`
- `name`
- `avatar_url`
- `subscription_tier`
- `created_at`
- `updated_at`

### `projects`

User-owned project metadata. Phase 1 stores only basic metadata and status.
Future generated outputs should not be stored directly on this table.

Fields:

- `id`
- `owner_id`
- `name`
- `type`
- `description`
- `status`
- `thumbnail_path`
- `current_design_system_version_id`
- `created_at`
- `updated_at`
- `archived_at`

### `usage_ledger`

Event-based usage scaffold. Phase 1 does not implement billing, Stripe, credit
enforcement, AI usage, or paid plans.

Fields:

- `id`
- `user_id`
- `project_id`
- `event_type`
- `credits_delta`
- `model`
- `input_tokens`
- `output_tokens`
- `cost_estimate`
- `metadata`
- `created_at`

## RLS

The migration enables RLS on all Phase 1 tables.

- Profiles are readable and updatable only by the matching authenticated user.
- Projects are readable, insertable, updatable, and deletable only by the owner.
- Usage ledger rows are readable by the owning user. Writes are intentionally
  reserved for future server-controlled flows.

Application server actions also verify ownership before project detail, update,
and archive operations.

## Private Storage

The initial migration creates these private buckets:

- `project-references`
- `generated-artifacts`
- `exports`

Buckets are private by default. Phase 1 does not create `storage.objects`
read/write policies. Object-level access is intentionally deferred until later
upload/export routes can verify project ownership before issuing signed URLs or
performing server-side storage writes.

Future storage paths should begin with the user id:

```text
{user_id}/{project_id}/{filename}
```

Upload, signed URL, analysis, and export routes are deferred to later phases.
Do not add broad direct client writes for generated artifacts or exports.

## Deferred Tables

Later phases should add separate ownership-scoped tables for:

- `project_briefs`
- `visual_directions`
- `color_palettes`
- `references`
- `reference_analyses`
- `reference_syntheses`
- `design_system_versions`
- `generation_jobs`
- `generated_artifacts`
- `exports`
- `evaluations`

Do not collapse these into `projects`.
