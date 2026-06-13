drop trigger if exists block_public_writes_leads on public.leads;
create trigger block_public_writes_leads
  before insert or update or delete on public.leads
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_email_templates on public.email_templates;
create trigger block_public_writes_email_templates
  before insert or update or delete on public.email_templates
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_site_settings on public.site_settings;
create trigger block_public_writes_site_settings
  before insert or update or delete on public.site_settings
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_portfolio_projects on public.portfolio_projects;
create trigger block_public_writes_portfolio_projects
  before insert or update or delete on public.portfolio_projects
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_countries on public.countries;
create trigger block_public_writes_countries
  before insert or update or delete on public.countries
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_project_types on public.project_types;
create trigger block_public_writes_project_types
  before insert or update or delete on public.project_types
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_urgency_options on public.urgency_options;
create trigger block_public_writes_urgency_options
  before insert or update or delete on public.urgency_options
  for each row execute function public.block_public_writes();

drop trigger if exists block_public_writes_contact_preferences on public.contact_preferences;
create trigger block_public_writes_contact_preferences
  before insert or update or delete on public.contact_preferences
  for each row execute function public.block_public_writes();

delete from public.countries where code = 'ZZ';
delete from public.leads where email in ('qa-security@example.com', 'qa-service@example.com');
delete from public.site_settings where key = 'qa_public_write_block';
