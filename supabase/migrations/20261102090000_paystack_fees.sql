-- Step 4f: keep Paystack's own fee for each payment, so the Revenue report can show what
-- Truth made. Paystack reports the fee when a payment is verified; the app saves it then.
-- bookings rows are already private (RLS: admins, and customers for their own booking).

begin;

alter table public.bookings
  add column if not exists paystack_fee numeric(12, 2) check (paystack_fee >= 0),
  add column if not exists payment_channel text check (char_length(payment_channel) <= 40);

commit;

select
  count(*) filter (where column_name = 'paystack_fee') = 1 as fee_column_added,
  count(*) filter (where column_name = 'payment_channel') = 1 as channel_column_added
from information_schema.columns
where table_schema = 'public' and table_name = 'bookings';
