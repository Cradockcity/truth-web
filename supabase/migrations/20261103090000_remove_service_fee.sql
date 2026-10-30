-- Removes the 5% service fee from new bookings. The `bookings.service_fee`
-- column stays so historical rows keep showing what the guest actually paid.
-- The host's percentage is still Truth's commission; the creator share still
-- comes out of Truth's part; Paystack's fee still comes out of Truth's part.

begin;

create or replace function public.create_booking(
  p_experience_id uuid,
  p_date date,
  p_start_time time,
  p_guests integer,
  p_name text,
  p_email text,
  p_phone text default null,
  p_creator_slug text default null
)
returns table (booking_id uuid, access_token uuid, total_amount numeric)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_booking_id uuid;
  v_access_token uuid;
  v_total numeric;
  v_experience public.experiences%rowtype;
  v_remaining integer;
  v_subtotal numeric(12, 2);
  v_creator_id uuid;
  v_host_name text;
begin
  if p_guests is null or p_guests not between 1 and 30 then
    raise exception 'invalid_guests' using errcode = 'P0001';
  end if;
  if p_name is null or length(btrim(p_name)) not between 2 and 120 then
    raise exception 'invalid_name' using errcode = 'P0001';
  end if;
  if p_email is null or length(p_email) > 254
     or p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email' using errcode = 'P0001';
  end if;
  if p_phone is not null and length(p_phone) > 30 then
    raise exception 'invalid_phone' using errcode = 'P0001';
  end if;

  -- Serialise bookings for the same session so two guests can't take the last seats.
  perform pg_advisory_xact_lock(
    hashtextextended(p_experience_id::text || p_date::text || p_start_time::text, 0)
  );

  select * into v_experience
  from public.experiences e
  where e.id = p_experience_id and e.is_active;
  if not found or v_experience.price is null then
    raise exception 'experience_unavailable' using errcode = 'P0001';
  end if;

  select a.remaining into v_remaining
  from public.get_availability(p_experience_id, p_date, 1) a
  where a.start_time = p_start_time;
  if v_remaining is null then
    raise exception 'slot_unavailable' using errcode = 'P0001';
  end if;
  if v_remaining < p_guests then
    raise exception 'not_enough_space' using errcode = 'P0001';
  end if;

  v_subtotal := v_experience.price * p_guests;

  if p_creator_slug is not null then
    select c.id into v_creator_id
    from public.creators c
    join public.creator_experience_referrals r
      on r.creator_id = c.id and r.experience_id = p_experience_id
    where c.slug = p_creator_slug;
  end if;

  select h.name into v_host_name from public.hosts h where h.id = v_experience.host_id;

  insert into public.bookings as b (
    experience_id, host_id, creator_id,
    selected_date, selected_time, booking_date, start_time,
    guest_count, subtotal, service_fee, total_amount,
    customer_name, customer_email, customer_phone, customer_id,
    status, expires_at,
    experience_snapshot, host_snapshot
  )
  values (
    v_experience.id, v_experience.host_id, v_creator_id,
    p_date, p_start_time, p_date, p_start_time,
    p_guests, v_subtotal, 0, v_subtotal,
    btrim(p_name), lower(btrim(p_email)), nullif(btrim(p_phone), ''), (select auth.uid()),
    'pending', now() + interval '20 minutes',
    jsonb_build_object(
      'title', v_experience.title,
      'location', v_experience.location,
      'duration', v_experience.duration,
      'price', v_experience.price,
      'main_image_url', v_experience.main_image_url
    ),
    jsonb_build_object('name', v_host_name)
  )
  returning b.id, b.access_token, b.total_amount
  into v_booking_id, v_access_token, v_total;

  return query select v_booking_id, v_access_token, v_total;
end
$$;

commit;

-- Should print `true` once applied: a fresh booking carries no service fee.
select pg_get_functiondef('public.create_booking(uuid, date, time, integer, text, text, text, text)'::regprocedure)
  not like '%v_subtotal * 0.05%' as service_fee_removed;
