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

delete from public.countries where code = 'ZZ';
delete from public.leads where email in ('qa-security@example.com', 'qa-service@example.com');
delete from public.site_settings where key = 'qa_public_write_block';

comment on function public.block_public_writes() is 'Defense-in-depth trigger: blocks public REST writes by checking the Supabase JWT role.';
