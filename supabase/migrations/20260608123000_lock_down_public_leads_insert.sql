revoke all privileges on table public.leads from anon, authenticated;

drop policy if exists "Public can insert leads" on public.leads;

comment on table public.leads is 'Contact form submissions. Inserts must go through the server API using the service role key.';
