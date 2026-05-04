create extension if not exists "pgcrypto";

create type public.project_status as enum (
  'draft',
  'briefing',
  'visual_direction',
  'palette',
  'references',
  'design_system',
  'generating',
  'ready',
  'exported',
  'archived'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  subscription_tier text not null default 'free_beta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null,
  description text,
  status public.project_status not null default 'draft',
  thumbnail_path text,
  current_design_system_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint projects_name_length check (char_length(name) between 2 and 100),
  constraint projects_type_length check (char_length(type) between 2 and 80)
);

create table public.usage_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  event_type text not null,
  credits_delta integer not null default 0,
  model text,
  input_tokens integer,
  output_tokens integer,
  cost_estimate numeric(12, 6),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index projects_owner_id_idx on public.projects(owner_id);
create index projects_updated_at_idx on public.projects(updated_at desc);
create index usage_ledger_user_id_idx on public.usage_ledger(user_id);
create index usage_ledger_project_id_idx on public.usage_ledger(project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.usage_ledger enable row level security;

create policy "Profiles are readable by owner"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Profiles are updatable by owner"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Projects are readable by owner"
on public.projects for select
to authenticated
using (owner_id = auth.uid());

create policy "Projects are insertable by owner"
on public.projects for insert
to authenticated
with check (owner_id = auth.uid());

create policy "Projects are updatable by owner"
on public.projects for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Projects are deletable by owner"
on public.projects for delete
to authenticated
using (owner_id = auth.uid());

create policy "Usage ledger is readable by owner"
on public.usage_ledger for select
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('project-references', 'project-references', false, 52428800),
  ('generated-artifacts', 'generated-artifacts', false, 104857600),
  ('exports', 'exports', false, 104857600)
on conflict (id) do update
set public = false;

-- Phase 1 creates private buckets only. Object-level storage policies are
-- intentionally deferred until upload/export routes exist and can verify
-- project ownership before issuing signed URLs or performing server-side
-- storage writes. Do not add broad authenticated client write policies for
-- references, generated artifacts, or exports in Phase 1.
