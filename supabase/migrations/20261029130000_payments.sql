-- Step 3b: Paystack payments. Both functions run only with the server's secret key (service_role).

begin;

-- Attach a fresh Paystack reference to a booking that is still held. Returns what Paystack needs.
create or replace function public.attach_payment_reference(p_booking_id uuid, p_reference text)
returns table (total_amount numeric, currency text, customer_email text)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_total numeric;
  v_currency text;
  v_email text;
begin
  if p_reference !~ '^[A-Za-z0-9-]{8,64}$' then
    raise exception 'invalid_reference' using errcode = 'P0001';
  end if;

  update public.bookings b
     set payment_reference = p_reference,
         updated_at = now()
   where b.id = p_booking_id
     and b.status = 'pending'
     and b.expires_at > now()
  returning b.total_amount, b.currency, b.customer_email
  into v_total, v_currency, v_email;

  if found then
    return query select v_total, v_currency, v_email;
  end if;
end
$$;

-- Mark a booking paid after Paystack has confirmed the charge. Safe to call more than once.
-- Outcomes: paid, already_paid, not_found, not_payable, amount_mismatch, sold_out.
create or replace function public.confirm_booking_payment(
  p_reference text,
  p_amount_cents bigint,
  p_currency text
)
returns table (booking_id uuid, access_token uuid, outcome text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings%rowtype;
  v_capacity integer;
  v_taken integer;
begin
  select * into v_booking
  from public.bookings b
  where b.payment_reference = p_reference
  for update;

  if not found then
    return query select null::uuid, null::uuid, 'not_found';
    return;
  end if;

  if v_booking.status = 'paid' then
    return query select v_booking.id, v_booking.access_token, 'already_paid';
    return;
  end if;

  if v_booking.status <> 'pending' then
    return query select v_booking.id, v_booking.access_token, 'not_payable';
    return;
  end if;

  if upper(p_currency) <> upper(v_booking.currency)
     or p_amount_cents <> round(v_booking.total_amount * 100)::bigint then
    return query select v_booking.id, v_booking.access_token, 'amount_mismatch';
    return;
  end if;

  -- Paid after the hold lapsed: only confirm if the seats are still free.
  if v_booking.expires_at is not null and v_booking.expires_at <= now() then
    perform pg_advisory_xact_lock(
      hashtextextended(
        v_booking.experience_id::text || v_booking.booking_date::text || v_booking.start_time::text,
        0
      )
    );

    select s.capacity into v_capacity
    from public.experience_schedules s
    where s.experience_id = v_booking.experience_id
      and s.is_active
      and s.weekday = extract(dow from v_booking.booking_date)
      and s.start_time = v_booking.start_time;

    select coalesce(sum(b.guest_count), 0)::integer into v_taken
    from public.bookings b
    where b.experience_id = v_booking.experience_id
      and b.booking_date = v_booking.booking_date
      and b.start_time = v_booking.start_time
      and b.id <> v_booking.id
      and (b.status = 'paid' or (b.status = 'pending' and b.expires_at > now()));

    if v_capacity is null or v_capacity - v_taken < v_booking.guest_count then
      update public.bookings set status = 'failed', updated_at = now() where id = v_booking.id;
      return query select v_booking.id, v_booking.access_token, 'sold_out';
      return;
    end if;
  end if;

  update public.bookings
     set status = 'paid', paid_at = now(), expires_at = null, updated_at = now()
   where id = v_booking.id;

  return query select v_booking.id, v_booking.access_token, 'paid';
end
$$;

revoke all on function public.attach_payment_reference(uuid, text) from public, anon, authenticated;
revoke all on function public.confirm_booking_payment(text, bigint, text) from public, anon, authenticated;
grant execute on function public.attach_payment_reference(uuid, text) to service_role;
grant execute on function public.confirm_booking_payment(text, bigint, text) to service_role;

commit;

select
  has_function_privilege('anon', 'public.confirm_booking_payment(text, bigint, text)', 'execute')
    as anon_can_confirm,
  has_function_privilege('service_role', 'public.confirm_booking_payment(text, bigint, text)', 'execute')
    as server_can_confirm;
