create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description_es text,
  description_en text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read public site settings" on public.site_settings;
create policy "Public can read public site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (is_public = true);

revoke all privileges on table public.site_settings from anon, authenticated;
grant select on table public.site_settings to anon, authenticated;

insert into public.site_settings (
  key,
  value,
  description_es,
  description_en,
  is_public
) values (
  'home_selected_work',
  '{
    "poolLimit": 12,
    "visibleCount": 4,
    "rotationEnabled": true,
    "rotationMode": "random_single",
    "rotationIntervalMs": 6500,
    "transitionDurationMs": 420
  }'::jsonb,
  'Configuracion publica de la rotacion de trabajos seleccionados en Home.',
  'Public configuration for selected work rotation on Home.',
  true
)
on conflict (key) do update set
  value = excluded.value,
  description_es = excluded.description_es,
  description_en = excluded.description_en,
  is_public = excluded.is_public,
  updated_at = now();

comment on table public.site_settings is 'Site-level configuration editable from the future admin portal.';
comment on column public.site_settings.value is 'JSON configuration payload. Validate and clamp values in application code.';
