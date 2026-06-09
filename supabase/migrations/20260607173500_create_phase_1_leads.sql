create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  country text,
  project_type text,
  message text not null,
  locale text not null default 'es' check (locale in ('es', 'en')),
  source_path text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

grant usage on schema public to anon, authenticated;
grant insert on table public.leads to anon, authenticated;

comment on table public.leads is 'Public contact form submissions for Pao Vergara phase 1.';
