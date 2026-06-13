revoke all privileges on table public.countries from anon, authenticated;
revoke all privileges on table public.project_types from anon, authenticated;
revoke all privileges on table public.urgency_options from anon, authenticated;
revoke all privileges on table public.contact_preferences from anon, authenticated;
revoke all privileges on table public.email_templates from anon, authenticated;
revoke all privileges on table public.leads from anon, authenticated;

grant select on table public.countries to anon, authenticated;
grant select on table public.project_types to anon, authenticated;
grant select on table public.urgency_options to anon, authenticated;
grant select on table public.contact_preferences to anon, authenticated;

comment on table public.countries is 'Public read-only active country catalog. Writes must happen through admin/service role only.';
comment on table public.project_types is 'Public read-only active project type catalog. Writes must happen through admin/service role only.';
comment on table public.urgency_options is 'Public read-only active urgency catalog. Writes must happen through admin/service role only.';
comment on table public.contact_preferences is 'Public read-only active contact preference catalog. Writes must happen through admin/service role only.';
comment on table public.email_templates is 'Server-only email templates. No public grants.';
comment on table public.leads is 'Private lead submissions. No public grants; inserts happen through server API with service role.';
