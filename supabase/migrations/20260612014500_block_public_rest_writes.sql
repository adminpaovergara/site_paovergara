create or replace function public.block_public_writes()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  raw_claims text := nullif(current_setting('request.jwt.claims', true), '');
  claims jsonb := case
    when raw_claims is null then '{}'::jsonb
    else raw_claims::jsonb
  end;
  request_role text := coalesce(auth.role(), nullif(current_setting('request.jwt.claim.role', true), ''), nullif(claims ->> 'role', ''), current_user);
begin
  if request_role <> 'service_role' and current_user in ('anon', 'authenticated', 'authenticator') then
    raise exception 'Public writes are not allowed for %.%', tg_table_schema, tg_table_name
      using errcode = '42501';
  end if;

  if request_role in ('anon', 'authenticated') then
    raise exception 'Public writes are not allowed for %.%', tg_table_schema, tg_table_name
      using errcode = '42501';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

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

comment on function public.block_public_writes() is 'Defense-in-depth trigger: blocks REST writes unless request role is service_role.';
