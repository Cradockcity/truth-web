-- Step 4d: payouts. What Truth owes hosts and creators for paid bookings, and what it has paid.
--
-- Money rules (owner, 2026-10-29), on the experience price x guests (bookings.subtotal):
--   host    gets 100% minus Truth's commission (hosts.revenue_share_percentage);
--   creator gets their share (creators.revenue_share_percentage), paid from Truth's part.
-- The guest service fee stays with Truth. Rates are locked when a booking is paid.
-- Earnings are due the day after the session; cancelled bookings earn nothing.

begin;

-- Every host and creator must have a percentage for earnings to be worked out.
alter table public.hosts alter column revenue_share_percentage set not null;
alter table public.creators alter column revenue_share_percentage set not null;

-- Money actually sent to a host or creator.
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  recipient text not null check (recipient in ('host', 'creator')),
  host_id uuid references public.hosts (id) on delete restrict,
  creator_id uuid references public.creators (id) on delete restrict,
  recipient_name text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  paid_on date not null,
  reference text check (char_length(reference) <= 100),
  note text check (char_length(note) <= 500),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  check ((recipient = 'host') = (host_id is not null)),
  check ((recipient = 'creator') = (creator_id is not null))
);

-- Earnings: one row per person per paid booking.
create table public.payout_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete restrict,
  recipient text not null check (recipient in ('host', 'creator')),
  host_id uuid references public.hosts (id) on delete restrict,
  creator_id uuid references public.creators (id) on delete restrict,
  recipient_name text not null,
  base_amount numeric(12, 2) not null,
  rate numeric(5, 2) not null check (rate between 0 and 100),
  amount numeric(12, 2) not null check (amount >= 0),
  due_on date not null,
  payout_id uuid references public.payouts (id) on delete restrict,
  voided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (booking_id, recipient),
  check ((recipient = 'host') = (host_id is not null)),
  check ((recipient = 'creator') = (creator_id is not null))
);

create index payout_items_host_idx on public.payout_items (host_id);
create index payout_items_creator_idx on public.payout_items (creator_id);
create index payout_items_payout_idx on public.payout_items (payout_id);
create index payouts_paid_on_idx on public.payouts (paid_on desc);

-- Admins read; only the functions below write.
alter table public.payouts enable row level security;
alter table public.payout_items enable row level security;
revoke all on public.payouts, public.payout_items from anon, authenticated;
grant select on public.payouts, public.payout_items to authenticated;
create policy "Admins read payouts" on public.payouts
  for select to authenticated using (public.is_admin());
create policy "Admins read earnings" on public.payout_items
  for select to authenticated using (public.is_admin());

-- Records a paid booking's earnings. Safe to run twice.
create or replace function public.record_booking_earnings(p_booking_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings%rowtype;
  v_base numeric(12, 2);
  v_due date;
  v_name text;
  v_rate numeric;
begin
  select * into v_booking from public.bookings where id = p_booking_id;
  if not found or v_booking.status <> 'paid' then
    return;
  end if;

  v_base := coalesce(v_booking.subtotal, v_booking.total_amount);
  v_due := coalesce(v_booking.booking_date, v_booking.selected_date::date) + 1;
  if v_base is null or v_due is null then
    return;
  end if;

  if v_booking.host_id is not null then
    select h.name, 100 - h.revenue_share_percentage into v_name, v_rate
    from public.hosts h where h.id = v_booking.host_id;
    if found then
      insert into public.payout_items
        (booking_id, recipient, host_id, recipient_name, base_amount, rate, amount, due_on)
      values
        (p_booking_id, 'host', v_booking.host_id, v_name, v_base, v_rate,
         round(v_base * v_rate / 100, 2), v_due)
      on conflict (booking_id, recipient) do nothing;
    end if;
  end if;

  if v_booking.creator_id is not null then
    select c.name, c.revenue_share_percentage into v_name, v_rate
    from public.creators c where c.id = v_booking.creator_id;
    if found then
      insert into public.payout_items
        (booking_id, recipient, creator_id, recipient_name, base_amount, rate, amount, due_on)
      values
        (p_booking_id, 'creator', v_booking.creator_id, v_name, v_base, v_rate,
         round(v_base * v_rate / 100, 2), v_due)
      on conflict (booking_id, recipient) do nothing;
    end if;
  end if;
end
$$;

-- Keeps earnings in step with the booking: recorded when paid, cancelled when the booking is.
create or replace function public.sync_booking_earnings()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'paid' and (tg_op = 'INSERT' or old.status is distinct from 'paid') then
    perform public.record_booking_earnings(new.id);
  elsif new.status = 'cancelled' and tg_op = 'UPDATE' and old.status is distinct from 'cancelled' then
    update public.payout_items
    set voided_at = now()
    where booking_id = new.id and payout_id is null and voided_at is null;
  end if;
  return null;
end
$$;

create trigger bookings_sync_earnings
  after insert or update of status on public.bookings
  for each row execute function public.sync_booking_earnings();

revoke all on function public.record_booking_earnings(uuid) from public, anon, authenticated;
revoke all on function public.sync_booking_earnings() from public, anon, authenticated;

-- Records money sent to one host or creator for the chosen due earnings.
create or replace function public.admin_record_payout(
  p_recipient text,
  p_recipient_id uuid,
  p_item_ids uuid[],
  p_paid_on date,
  p_reference text,
  p_note text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := (now() at time zone 'Africa/Johannesburg')::date;
  v_wanted integer;
  v_count integer;
  v_total numeric(12, 2);
  v_name text;
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'not_admin' using errcode = '42501';
  end if;
  if p_recipient not in ('host', 'creator') then
    raise exception 'bad_recipient' using errcode = 'P0001';
  end if;
  if p_paid_on is null or p_paid_on > v_today then
    raise exception 'bad_date' using errcode = 'P0001';
  end if;

  select count(distinct x) into v_wanted from unnest(p_item_ids) as x;
  if v_wanted = 0 then
    raise exception 'no_items' using errcode = 'P0001';
  end if;

  perform 1 from public.payout_items where id = any (p_item_ids) for update;

  select count(*), coalesce(sum(i.amount), 0) into v_count, v_total
  from public.payout_items i
  where i.id = any (p_item_ids)
    and i.recipient = p_recipient
    and coalesce(i.host_id, i.creator_id) = p_recipient_id
    and i.payout_id is null
    and i.voided_at is null
    and i.due_on <= v_today;
  if v_count <> v_wanted then
    raise exception 'items_not_payable' using errcode = 'P0001';
  end if;

  if p_recipient = 'host' then
    select name into v_name from public.hosts where id = p_recipient_id;
  else
    select name into v_name from public.creators where id = p_recipient_id;
  end if;

  insert into public.payouts
    (recipient, host_id, creator_id, recipient_name, amount, paid_on, reference, note)
  values (
    p_recipient,
    case when p_recipient = 'host' then p_recipient_id end,
    case when p_recipient = 'creator' then p_recipient_id end,
    v_name, v_total, p_paid_on,
    nullif(btrim(p_reference), ''), nullif(btrim(p_note), '')
  )
  returning id into v_id;

  update public.payout_items set payout_id = v_id where id = any (p_item_ids);
  return v_id;
end
$$;

-- Undoes a payout recorded by mistake. Its earnings become due again (or cancelled, if the
-- booking was cancelled in the meantime).
create or replace function public.admin_undo_payout(p_payout_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'not_admin' using errcode = '42501';
  end if;

  update public.payout_items i
  set payout_id = null,
      voided_at = case when b.status = 'cancelled' then now() else i.voided_at end
  from public.bookings b
  where i.payout_id = p_payout_id and b.id = i.booking_id;

  delete from public.payouts where id = p_payout_id;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
end
$$;

revoke all on function public.admin_record_payout(text, uuid, uuid[], date, text, text) from public, anon;
grant execute on function public.admin_record_payout(text, uuid, uuid[], date, text, text) to authenticated;
revoke all on function public.admin_undo_payout(uuid) from public, anon;
grant execute on function public.admin_undo_payout(uuid) to authenticated;

-- Bookings already paid before this step.
select public.record_booking_earnings(id) from public.bookings where status = 'paid';

commit;

select
  (select count(*) from public.payout_items) as earnings_recorded,
  has_table_privilege('anon', 'public.payout_items', 'select') as anon_can_read_earnings,
  has_table_privilege('anon', 'public.payouts', 'select') as anon_can_read_payouts;
