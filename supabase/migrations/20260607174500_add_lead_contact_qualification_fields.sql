alter table public.leads
  add column if not exists phone_country_code text,
  add column if not exists phone_number text,
  add column if not exists contact_preference text not null default 'whatsapp' check (contact_preference in ('whatsapp', 'email')),
  add column if not exists urgency text,
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

create index if not exists leads_contact_preference_idx on public.leads (contact_preference);
create index if not exists leads_urgency_idx on public.leads (urgency);
