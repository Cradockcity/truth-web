-- Read-only: summarises tables, RLS, policies, grants, functions, triggers and storage buckets as one JSON value.
select jsonb_pretty(jsonb_build_object(
  'tables', (
    select jsonb_agg(jsonb_build_object(
      'table', c.relname, 'rls', c.relrowsecurity, 'forced', c.relforcerowsecurity,
      'rows_estimate', c.reltuples::bigint) order by c.relname)
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'v', 'm')
  ),
  'policies', (
    select jsonb_agg(jsonb_build_object(
      'schema', schemaname, 'table', tablename, 'name', policyname, 'cmd', cmd,
      'roles', roles, 'permissive', permissive, 'using', qual, 'check', with_check)
      order by schemaname, tablename, cmd)
    from pg_policies where schemaname in ('public', 'storage')
  ),
  'grants', (
    select jsonb_agg(jsonb_build_object('table', table_name, 'role', grantee, 'privileges', privs) order by table_name, grantee)
    from (
      select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type) as privs
      from information_schema.role_table_grants
      where table_schema = 'public' and grantee in ('anon', 'authenticated')
      group by table_name, grantee
    ) g
  ),
  'functions', (
    select jsonb_agg(jsonb_build_object(
      'name', p.proname, 'security_definer', p.prosecdef,
      'args', pg_get_function_arguments(p.oid), 'definition', pg_get_functiondef(p.oid)) order by p.proname)
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f'
  ),
  'triggers', (
    select jsonb_agg(jsonb_build_object('table', event_object_table, 'name', trigger_name, 'timing', action_timing, 'event', event_manipulation, 'action', action_statement))
    from information_schema.triggers where trigger_schema = 'public'
  ),
  'constraints', (
    select jsonb_agg(jsonb_build_object('table', conrelid::regclass::text, 'name', conname, 'def', pg_get_constraintdef(oid)) order by conrelid::regclass::text)
    from pg_constraint where connamespace = 'public'::regnamespace and contype in ('c', 'u')
  ),
  'buckets', (
    select jsonb_agg(jsonb_build_object('id', id, 'public', public, 'size_limit', file_size_limit, 'mime_types', allowed_mime_types))
    from storage.buckets
  ),
  'auth_users_count', (select count(*) from auth.users),
  'mfa_factors', (select jsonb_agg(jsonb_build_object('type', factor_type, 'status', status)) from auth.mfa_factors)
)) as security_snapshot;
