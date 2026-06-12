create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_es text not null,
  title_en text not null,
  description_es text,
  description_en text,
  client_name text not null,
  category text not null,
  year text,
  role_es text,
  role_en text,
  agency text,
  production_company text,
  thumbnail_url text not null,
  poster_url text,
  before_image_url text,
  after_image_url text,
  video_provider text not null default 'mux' check (video_provider in ('mux', 'vimeo', 'youtube', 'r2', 'external')),
  video_status text not null default 'draft' check (video_status in ('draft', 'processing', 'ready', 'archived')),
  video_url text,
  mux_asset_id text,
  mux_playback_id text,
  mux_upload_id text,
  duration_seconds int,
  featured boolean not null default false,
  published boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_projects enable row level security;

create index if not exists portfolio_projects_published_idx on public.portfolio_projects (published, featured, order_index);
create index if not exists portfolio_projects_category_idx on public.portfolio_projects (category);
create index if not exists portfolio_projects_video_provider_idx on public.portfolio_projects (video_provider);

drop policy if exists "Public can read published portfolio projects" on public.portfolio_projects;
create policy "Public can read published portfolio projects"
  on public.portfolio_projects
  for select
  to anon, authenticated
  using (published = true);

grant select on table public.portfolio_projects to anon, authenticated;

comment on table public.portfolio_projects is 'Editable public portfolio projects. Video metadata supports Mux now and other providers during migration.';
comment on column public.portfolio_projects.mux_playback_id is 'Mux playback id used by the frontend player when video_provider is mux and video_status is ready.';
comment on column public.portfolio_projects.video_url is 'Temporary legacy video URL for Vimeo, YouTube, R2 or external providers.';

insert into public.portfolio_projects (
  slug,
  title_es,
  title_en,
  description_es,
  description_en,
  client_name,
  category,
  role_es,
  role_en,
  thumbnail_url,
  video_provider,
  video_status,
  video_url,
  duration_seconds,
  featured,
  published,
  order_index
) values
  (
    'chanel-rouge-coco-bloom',
    'Rouge Coco Bloom',
    'Rouge Coco Bloom',
    'Beauty, piel y producto.',
    'Beauty, skin and product.',
    'Chanel',
    'Beauty',
    'Color grading / finishing',
    'Color grading / finishing',
    'https://i.vimeocdn.com/video/1206889231-3d91eb935cb0d6f3a3c2573f8f8243d9c89c13b6a42f8ac005f0a3ab9c16262b-d',
    'vimeo',
    'ready',
    'https://player.vimeo.com/video/583148681',
    32,
    true,
    true,
    10
  ),
  (
    'chito-vera-quaker',
    'Chito Vera',
    'Chito Vera',
    'Energia, textura y marca.',
    'Energy, texture and brand.',
    'Quaker',
    'Commercial',
    'Color grading / finishing',
    'Color grading / finishing',
    'https://i.vimeocdn.com/video/1771054899-d59503e13c6933d5e4be7ca175cda32df70e56244cdbee75d5b3a8956c9d16c1-d',
    'vimeo',
    'ready',
    'https://player.vimeo.com/video/896032217',
    20,
    true,
    true,
    20
  ),
  (
    'visa-one-step-closer',
    'One Step Closer',
    'One Step Closer',
    'Claridad, confianza y ritmo.',
    'Clarity, trust and rhythm.',
    'Visa',
    'Commercial',
    'Color grading / finishing',
    'Color grading / finishing',
    'https://i.vimeocdn.com/video/1834264343-c78b19a104c9103c29ae2a289fb542ea3ba2cfa3d394a9a7c09cd0ad78f44d13-d',
    'vimeo',
    'ready',
    'https://player.vimeo.com/video/935207705',
    60,
    true,
    true,
    30
  ),
  (
    'massimo-dutti-leather-on-leather-bw',
    'Leather on Leather B&W',
    'Leather on Leather B&W',
    'Blanco y negro, textura y gesto.',
    'Black and white, texture and gesture.',
    'Massimo Dutti',
    'Fashion',
    'Color grading / finishing',
    'Color grading / finishing',
    'https://i.vimeocdn.com/video/1291701742-f1e817357871c67d6384bfb6a490ed74ae9ea748efff1cdf7',
    'vimeo',
    'ready',
    'https://player.vimeo.com/video/642162423',
    12,
    true,
    true,
    40
  ),
  (
    'louis-vuitton-millie',
    'Millie',
    'Millie',
    'Moda, gesto y elegancia visual.',
    'Fashion, gesture and visual elegance.',
    'Louis Vuitton',
    'Fashion',
    'Color grading / finishing',
    'Color grading / finishing',
    'https://i.vimeocdn.com/video/1527775976-fddd6ee1fc688f6da5f1895447e9a6673d0cd084bf8ea80813b3623f5887ab48-d',
    'vimeo',
    'ready',
    'https://player.vimeo.com/video/760679384',
    9,
    true,
    true,
    50
  )
on conflict (slug) do update set
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  description_es = excluded.description_es,
  description_en = excluded.description_en,
  client_name = excluded.client_name,
  category = excluded.category,
  role_es = excluded.role_es,
  role_en = excluded.role_en,
  thumbnail_url = excluded.thumbnail_url,
  video_provider = excluded.video_provider,
  video_status = excluded.video_status,
  video_url = excluded.video_url,
  duration_seconds = excluded.duration_seconds,
  featured = excluded.featured,
  published = excluded.published,
  order_index = excluded.order_index,
  updated_at = now();
