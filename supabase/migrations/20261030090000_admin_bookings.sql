-- Step 4a: record cancellations and refunds on bookings.

begin;

alter table public.bookings
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text,
  add column if not exists refund_amount numeric(12, 2),
  add column if not exists refund_status text,
  add column if not exists refunded_at timestamptz;

alter table public.bookings
  drop constraint if exists bookings_refund_status_check;
alter table public.bookings
  add constraint bookings_refund_status_check
  check (refund_status is null or refund_status in ('pending', 'processed', 'failed'));

alter table public.bookings
  drop constraint if exists bookings_refund_amount_check;
alter table public.bookings
  add constraint bookings_refund_amount_check
  check (refund_amount is null or (refund_amount >= 0 and refund_amount <= total_amount));

commit;

select count(*) filter (where column_name in
  ('cancelled_at', 'cancellation_reason', 'refund_amount', 'refund_status', 'refunded_at')) as new_columns
from information_schema.columns
where table_schema = 'public' and table_name = 'bookings';
