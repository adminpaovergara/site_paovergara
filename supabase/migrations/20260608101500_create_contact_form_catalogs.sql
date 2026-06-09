create table if not exists public.countries (
  code text primary key,
  name_es text not null,
  name_en text not null,
  dial_code text not null,
  flag text not null,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_types (
  value text primary key,
  label_es text not null,
  label_en text not null,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.urgency_options (
  value text primary key,
  label_es text not null,
  label_en text not null,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_preferences (
  value text primary key,
  label_es text not null,
  label_en text not null,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.countries enable row level security;
alter table public.project_types enable row level security;
alter table public.urgency_options enable row level security;
alter table public.contact_preferences enable row level security;

drop policy if exists "Public can read active countries" on public.countries;
create policy "Public can read active countries" on public.countries for select to anon, authenticated using (active = true);

drop policy if exists "Public can read active project types" on public.project_types;
create policy "Public can read active project types" on public.project_types for select to anon, authenticated using (active = true);

drop policy if exists "Public can read active urgency options" on public.urgency_options;
create policy "Public can read active urgency options" on public.urgency_options for select to anon, authenticated using (active = true);

drop policy if exists "Public can read active contact preferences" on public.contact_preferences;
create policy "Public can read active contact preferences" on public.contact_preferences for select to anon, authenticated using (active = true);

grant select on table public.countries to anon, authenticated;
grant select on table public.project_types to anon, authenticated;
grant select on table public.urgency_options to anon, authenticated;
grant select on table public.contact_preferences to anon, authenticated;

insert into public.countries (code, name_es, name_en, dial_code, flag, order_index) values
  ('EC', 'Ecuador', 'Ecuador', '+593', '🇪🇨', 10),
  ('CO', 'Colombia', 'Colombia', '+57', '🇨🇴', 20),
  ('MX', 'México', 'Mexico', '+52', '🇲🇽', 30),
  ('US', 'Estados Unidos', 'United States', '+1', '🇺🇸', 40),
  ('ES', 'España', 'Spain', '+34', '🇪🇸', 50),
  ('AR', 'Argentina', 'Argentina', '+54', '🇦🇷', 60),
  ('CL', 'Chile', 'Chile', '+56', '🇨🇱', 70),
  ('PE', 'Perú', 'Peru', '+51', '🇵🇪', 80),
  ('BR', 'Brasil', 'Brazil', '+55', '🇧🇷', 90),
  ('PA', 'Panamá', 'Panama', '+507', '🇵🇦', 100),
  ('CR', 'Costa Rica', 'Costa Rica', '+506', '🇨🇷', 110),
  ('DO', 'República Dominicana', 'Dominican Republic', '+1', '🇩🇴', 120),
  ('GB', 'Reino Unido', 'United Kingdom', '+44', '🇬🇧', 130),
  ('FR', 'Francia', 'France', '+33', '🇫🇷', 140),
  ('IT', 'Italia', 'Italy', '+39', '🇮🇹', 150)
on conflict (code) do update set
  name_es = excluded.name_es,
  name_en = excluded.name_en,
  dial_code = excluded.dial_code,
  flag = excluded.flag,
  order_index = excluded.order_index,
  active = true,
  updated_at = now();

insert into public.project_types (value, label_es, label_en, order_index) values
  ('commercial', 'Publicidad', 'Commercial', 10),
  ('fashion', 'Moda', 'Fashion', 20),
  ('beauty', 'Belleza', 'Beauty', 30),
  ('music_video', 'Videoclip', 'Music video', 40),
  ('fiction', 'Ficción', 'Fiction', 50),
  ('remote_color', 'Color remoto', 'Remote color', 60),
  ('other', 'Otro', 'Other', 70)
on conflict (value) do update set
  label_es = excluded.label_es,
  label_en = excluded.label_en,
  order_index = excluded.order_index,
  active = true,
  updated_at = now();

insert into public.urgency_options (value, label_es, label_en, order_index) values
  ('this_week', 'Esta semana', 'This week', 10),
  ('two_to_four_weeks', '2-4 semanas', '2-4 weeks', 20),
  ('one_to_two_months', '1-2 meses', '1-2 months', 30),
  ('flexible', 'Flexible', 'Flexible', 40)
on conflict (value) do update set
  label_es = excluded.label_es,
  label_en = excluded.label_en,
  order_index = excluded.order_index,
  active = true,
  updated_at = now();

insert into public.contact_preferences (value, label_es, label_en, order_index) values
  ('whatsapp', 'WhatsApp', 'WhatsApp', 10),
  ('email', 'Email', 'Email', 20)
on conflict (value) do update set
  label_es = excluded.label_es,
  label_en = excluded.label_en,
  order_index = excluded.order_index,
  active = true,
  updated_at = now();
