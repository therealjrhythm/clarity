create table public.project_briefs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  foundation_answers jsonb not null default '{}'::jsonb,
  prompt_analysis jsonb not null default '{}'::jsonb,
  brief jsonb not null default '{}'::jsonb,
  summary text,
  status text not null default 'draft',
  model text,
  ai_state jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_briefs_status_check check (status in ('draft', 'generated', 'edited')),
  constraint project_briefs_summary_length check (summary is null or char_length(summary) <= 1200)
);

create index project_briefs_project_id_idx on public.project_briefs(project_id);
create index project_briefs_status_idx on public.project_briefs(status);

create trigger project_briefs_set_updated_at
before update on public.project_briefs
for each row execute function public.set_updated_at();

alter table public.project_briefs enable row level security;

create policy "Project briefs are readable by project owner"
on public.project_briefs for select
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_briefs.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project briefs are insertable by project owner"
on public.project_briefs for insert
to authenticated
with check (
  exists (
    select 1
    from public.projects
    where projects.id = project_briefs.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project briefs are updatable by project owner"
on public.project_briefs for update
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_briefs.project_id
      and projects.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects
    where projects.id = project_briefs.project_id
      and projects.owner_id = auth.uid()
  )
);

create policy "Project briefs are deletable by project owner"
on public.project_briefs for delete
to authenticated
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_briefs.project_id
      and projects.owner_id = auth.uid()
  )
);
