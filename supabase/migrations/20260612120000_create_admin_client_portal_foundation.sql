create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'editor', 'client')),
  company text,
  phone text,
  country text,
  notes text,
  active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'review', 'approved', 'delivered', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  version_number int not null default 1,
  title text not null,
  mux_asset_id text,
  mux_playback_id text,
  status text not null default 'draft' check (status in ('draft', 'processing', 'ready', 'archived')),
  created_at timestamptz not null default now(),
  unique (project_id, version_number)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  video_version_id uuid not null references public.video_versions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  timecode text,
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.client_projects(id) on delete cascade,
  video_version_id uuid references public.video_versions(id) on delete set null,
  approved_by uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('approved', 'changes_requested')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.leads drop constraint if exists leads_status_check;
alter table public.leads add constraint leads_status_check check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'archived'));
alter table public.leads add column if not exists internal_notes text;
alter table public.leads add column if not exists updated_at timestamptz not null default now();

create index if not exists profiles_role_idx on public.profiles (role, active);
create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists client_projects_client_idx on public.client_projects (client_id, status);
create index if not exists video_versions_project_idx on public.video_versions (project_id, version_number desc);
create index if not exists comments_video_version_idx on public.comments (video_version_id, created_at desc);
create index if not exists approvals_project_idx on public.approvals (project_id, created_at desc);
create index if not exists admin_audit_logs_created_idx on public.admin_audit_logs (created_at desc);

alter table public.profiles enable row level security;
alter table public.client_projects enable row level security;
alter table public.video_versions enable row level security;
alter table public.comments enable row level security;
alter table public.approvals enable row level security;
alter table public.admin_audit_logs enable row level security;

alter table public.profiles force row level security;
alter table public.client_projects force row level security;
alter table public.video_versions force row level security;
alter table public.comments force row level security;
alter table public.approvals force row level security;
alter table public.admin_audit_logs force row level security;

revoke all privileges on table public.profiles from anon, authenticated;
revoke all privileges on table public.client_projects from anon, authenticated;
revoke all privileges on table public.video_versions from anon, authenticated;
revoke all privileges on table public.comments from anon, authenticated;
revoke all privileges on table public.approvals from anon, authenticated;
revoke all privileges on table public.admin_audit_logs from anon, authenticated;

comment on table public.profiles is 'Application profiles and roles for admin, editor and client users.';
comment on table public.client_projects is 'Private client-facing projects for review and delivery workflows.';
comment on table public.video_versions is 'Mux-backed video versions attached to client projects.';
comment on table public.comments is 'Client review comments, optionally tied to a timecode.';
comment on table public.approvals is 'Client approvals or change requests for project versions.';
comment on table public.admin_audit_logs is 'Audit trail for admin and editor changes.';
