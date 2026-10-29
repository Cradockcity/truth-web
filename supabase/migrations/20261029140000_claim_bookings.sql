-- Step 3c: when a customer signs in, attach the bookings they made as a guest with the same,
-- verified email address, so they appear under "My bookings".

begin;

create or replace function public.claim_my_bookings()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_email text;
  v_claimed integer;
begin
  if v_user_id is null then
    return 0;
  end if;

  -- Only verified addresses (email link, Google) may claim bookings.
  select lower(u.email) into v_email
  from auth.users u
  where u.id = v_user_id and u.email_confirmed_at is not null;

  if v_email is null then
    return 0;
  end if;

  update public.bookings b
     set customer_id = v_user_id, updated_at = now()
   where b.customer_id is null
     and lower(b.customer_email) = v_email;

  get diagnostics v_claimed = row_count;
  return v_claimed;
end
$$;

revoke all on function public.claim_my_bookings() from public, anon;
grant execute on function public.claim_my_bookings() to authenticated;

commit;

select has_function_privilege('anon', 'public.claim_my_bookings()', 'execute') as anon_can_claim;
