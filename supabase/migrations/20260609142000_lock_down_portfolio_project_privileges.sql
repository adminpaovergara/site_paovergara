revoke all privileges on table public.portfolio_projects from anon, authenticated;
grant select on table public.portfolio_projects to anon, authenticated;

comment on table public.portfolio_projects is 'Editable public portfolio projects. Public roles can only read published rows through RLS.';
