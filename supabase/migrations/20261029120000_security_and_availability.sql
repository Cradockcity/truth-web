-- Step 3a: lock down bookings, add an admin role, weekly availability and server-side booking.
--
-- Deferred to the admin rebuild (step 4), because the old app still reads them directly:
-- hiding hosts.email and *.revenue_share_percentage from the public API.

begin;

-------------------------------------------------------------------------------
-- Admins: a signed-in account listed here, at MFA level aal2.
-------------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- No policies: the table is read only through is_admin() and the service role.

-- Every account that exists when this runs is the owner's; customers sign up afterwards.
insert into public.admins (user_id)
select id from auth.users
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()))
     and coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-------------------------------------------------------------------------------
-- Content tables: public read stays, writes need an admin (was: any aal2 account).
-------------------------------------------------------------------------------
drop policy if exists "Auth write experiences" on public.experiences;
drop policy if exists "Auth write hosts" on public.hosts;
drop policy if exists "Auth write creators" on public.creators;
drop policy if exists "Auth write referrals" on public.creator_experience_referrals;
drop policy if exists "Auth write itineraries" on public.experience_itineraries;
drop policy if exists "Auth write reviews" on public.reviews;

create policy "Admins manage experiences" on public.experiences
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage hosts" on public.hosts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage creators" on public.creators
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage referrals" on public.creator_experience_referrals
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage itineraries" on public.experience_itineraries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage reviews" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Image uploads: admins only (was: any signed-in account, without MFA).
drop policy if exists "Auth upload images" on storage.objects;
drop policy if exists "Auth update images" on storage.objects;
drop policy if exists "Auth delete images" on storage.objects;

create policy "Admins upload images" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_admin());
create policy "Admins update images" on storage.objects
  for update to authenticated using (bucket_id = 'images' and public.is_admin());
create policy "Admins delete images" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_admin());

-------------------------------------------------------------------------------
-- Bookings: no more public read or insert. Created only through create_booking().
-------------------------------------------------------------------------------
drop policy if exists "Public read bookings" on public.bookings;
drop policy if exists "Public insert bookings" on public.bookings;
drop policy if exists "Auth write bookings" on public.bookings;

alter table public.bookings
  add column if not exists customer_id uuid references auth.users (id) on delete set null,
  add column if not exists access_token uuid not null default gen_random_uuid(),
  add column if not exists booking_date date,
  add column if not exists start_time time,
  add column if not exists subtotal numeric(12, 2),
  add column if not exists service_fee numeric(12, 2),
  add column if not exists currency text not null default 'ZAR',
  add column if not exists expires_at timestamptz,
  add column if not exists paid_at timestamptz,
  add column if not exists payment_reference text unique;

-- Replace the status check (its generated name is unknown) with one that allows the new states.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.bookings drop constraint %I', constraint_name);
  end loop;
end $$;

alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'paid', 'failed', 'cancelled', 'expired'));

create index if not exists bookings_slot_idx
  on public.bookings (experience_id, booking_date, start_time);
create index if not exists bookings_customer_idx on public.bookings (customer_id);

create policy "Admins manage bookings" on public.bookings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Customers read own bookings" on public.bookings
  for select to authenticated using (customer_id = (select auth.uid()));

-------------------------------------------------------------------------------
-- Weekly availability.
-------------------------------------------------------------------------------
create table if not exists public.experience_schedules (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6), -- 0 = Sunday, as extract(dow)
  start_time time not null,
  capacity integer not null check (capacity between 1 and 500),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (experience_id, weekday, start_time)
);
alter table public.experience_schedules enable row level security;
create policy "Public read active schedules" on public.experience_schedules
  for select to anon, authenticated using (is_active);
create policy "Admins manage schedules" on public.experience_schedules
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.experience_blackouts (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  date date not null,
  reason text,
  primary key (experience_id, date)
);
alter table public.experience_blackouts enable row level security;
create policy "Admins manage blackouts" on public.experience_blackouts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Starting schedule: every day, at the first itinerary time (else 09:00), sized by group_size.
insert into public.experience_schedules (experience_id, weekday, start_time, capacity)
select
  e.id,
  d.weekday,
  coalesce(first_step.start_time, time '09:00'),
  least(greatest(coalesce(substring(e.group_size from '\d+')::int, 10), 1), 500)
from public.experiences e
cross join generate_series(0, 6) as d (weekday)
left join lateral (
  select i.time::text::time as start_time
  from public.experience_itineraries i
  where i.experience_id = e.id and i.time::text ~ '^\d{1,2}:\d{2}'
  order by i.order_index nulls last
  limit 1
) first_step on true
on conflict do nothing;

-- Open sessions with seats left. Pending holds count until they expire. Times are SAST.
create or replace function public.get_availability(
  p_experience_id uuid,
  p_from date,
  p_days integer default 60
)
returns table (slot_date date, start_time time, capacity integer, remaining integer)
language sql
stable
security definer
set search_path = ''
as $$
  with days as (
    select (p_from + offs)::date as d
    from generate_series(0, least(greatest(p_days, 1), 120) - 1) as offs
  ),
  slots as (
    select days.d, s.start_time, s.capacity
    from days
    join public.experience_schedules s
      on s.experience_id = p_experience_id
     and s.is_active
     and s.weekday = extract(dow from days.d)
    where not exists (
        select 1 from public.experience_blackouts b
        where b.experience_id = p_experience_id and b.date = days.d
      )
      and (days.d + s.start_time) > (now() at time zone 'Africa/Johannesburg') + interval '2 hours'
  ),
  taken as (
    select b.booking_date, b.start_time, sum(b.guest_count)::integer as guests
    from public.bookings b
    where b.experience_id = p_experience_id
      and b.booking_date between p_from and p_from + 120
      and (b.status = 'paid' or (b.status = 'pending' and b.expires_at > now()))
    group by b.booking_date, b.start_time
  )
  select slots.d, slots.start_time, slots.capacity,
         greatest(slots.capacity - coalesce(taken.guests, 0), 0)
  from slots
  left join taken on taken.booking_date = slots.d and taken.start_time = slots.start_time
  where exists (
    select 1 from public.experiences e where e.id = p_experience_id and e.is_active
  )
  order by 1, 2
$$;
revoke all on function public.get_availability(uuid, date, integer) from public;
grant execute on function public.get_availability(uuid, date, integer) to anon, authenticated;

-------------------------------------------------------------------------------
-- Booking: price, fee and capacity are decided here, never by the browser.
-------------------------------------------------------------------------------
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
  v_fee numeric(12, 2);
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
  v_fee := round(v_subtotal * 0.05, 2);

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
    p_guests, v_subtotal, v_fee, v_subtotal + v_fee,
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
revoke all on function public.create_booking(uuid, date, time, integer, text, text, text, text) from public;
grant execute on function public.create_booking(uuid, date, time, integer, text, text, text, text)
  to anon, authenticated;

-- A booking is visible to whoever holds its private link, its signed-in owner, or an admin.
create or replace function public.get_booking(p_booking_id uuid, p_access_token uuid default null)
returns table (
  id uuid,
  status text,
  experience_id uuid,
  experience_title text,
  experience_location text,
  experience_image text,
  booking_date date,
  start_time time,
  guest_count integer,
  subtotal numeric,
  service_fee numeric,
  total_amount numeric,
  currency text,
  customer_name text,
  customer_email text,
  expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    b.id,
    case when b.status = 'pending' and b.expires_at <= now() then 'expired' else b.status end,
    b.experience_id,
    b.experience_snapshot ->> 'title',
    b.experience_snapshot ->> 'location',
    b.experience_snapshot ->> 'main_image_url',
    b.booking_date,
    b.start_time,
    b.guest_count::integer,
    b.subtotal,
    b.service_fee,
    b.total_amount,
    b.currency,
    b.customer_name,
    b.customer_email,
    b.expires_at,
    b.paid_at,
    b.created_at
  from public.bookings b
  where b.id = p_booking_id
    and (
      (p_access_token is not null and b.access_token = p_access_token)
      or (b.customer_id is not null and b.customer_id = (select auth.uid()))
      or public.is_admin()
    )
$$;
revoke all on function public.get_booking(uuid, uuid) from public;
grant execute on function public.get_booking(uuid, uuid) to anon, authenticated;

-------------------------------------------------------------------------------
-- Saved experiences for signed-in customers (guests keep them on the device).
-------------------------------------------------------------------------------
create table if not exists public.saved_experiences (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  experience_id uuid not null references public.experiences (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, experience_id)
);
alter table public.saved_experiences enable row level security;
create policy "Customers read own saved" on public.saved_experiences
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Customers add own saved" on public.saved_experiences
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Customers remove own saved" on public.saved_experiences
  for delete to authenticated using (user_id = (select auth.uid()));

-------------------------------------------------------------------------------
-- Least privilege: the API roles never need these.
-------------------------------------------------------------------------------
revoke truncate, trigger, references on all tables in schema public from anon, authenticated;

commit;

-- Summary to confirm it applied.
select
  (select count(*) from public.admins) as admins,
  (select count(*) from public.experience_schedules) as schedule_rows,
  (select count(*) from pg_policies where schemaname = 'public' and tablename = 'bookings') as booking_policies;
