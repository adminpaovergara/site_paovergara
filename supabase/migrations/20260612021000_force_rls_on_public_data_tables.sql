alter table public.contact_preferences force row level security;
alter table public.countries force row level security;
alter table public.email_templates force row level security;
alter table public.leads force row level security;
alter table public.portfolio_projects force row level security;
alter table public.project_types force row level security;
alter table public.site_settings force row level security;
alter table public.urgency_options force row level security;

delete from public.countries where code = 'ZZ';
delete from public.leads where email in ('qa-security@example.com', 'qa-service@example.com');
delete from public.site_settings where key = 'qa_public_write_block';
