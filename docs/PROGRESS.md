# Truth rewrite: progress and handoff

Last updated: 2026-10-29 (end of session: 4f done and pushed, step 5 on hold). The approved plan and the original audit are in `C:\Users\ryanc\.claude\plans\i-d-like-you-to-lexical-treasure.md`.

**Plan:** 0 foundations → 1 design system → 2 public browsing → 3 booking and payments → 4 admin (4a, 4b, 4c, 4d payouts, 4e search, 4f reports) → 5 hardening and launch (postponed by the owner).

## Status

| Step                                                             | State                                           | Commit               |
| ---------------------------------------------------------------- | ----------------------------------------------- | -------------------- |
| 0 Foundations (Next 16 scaffold, CI, Supabase clients, types)    | Done                                            | `cddbead`, `bc02497` |
| 1 Design system ("Night cinema", light/dark plus toggle)         | Done                                            | `e063572`            |
| 2 Public browsing (search/filters, detail, creators, saved, SEO) | Done                                            | `f3ba35e`            |
| 3 Booking, Paystack (test), customer sign-in, My bookings        | Done, except Google sign-in (needs owner setup) | `d1d0e09`, `c1a9daf` |
| 4a Admin: MFA sign-in, dashboard, bookings, cancel/refund        | Done, tested by owner                           | `50b027a`            |
| 4b Admin: experience editor                                      | Done, tested by owner                           | `c8a63a2`            |
| 4c Admin: hosts, creators, privacy migration                     | Done, tested                                    | `5525d02`            |
| 4d Admin: payouts to hosts and creators, creator credit          | Done, tested                                    | `df9a1f6`            |
| 4e Admin: booking search, payment statements and history, CSV    | Done, tested                                    | `f79ec2d`            |
| 4f Admin: Payment history and Revenue reports, Paystack fees     | Done, tested                                    | `0cbfecf`            |
| **5 Hardening and launch**                                       | **On hold (owner's call; see open items)**      | —                    |

## Start here next session

- **All work is committed and pushed** (latest `0cbfecf`, 4f). Nothing is half-built.
- **Step 5 (launch) is on hold.** The owner postponed it to add the payouts and reports (4d–4f). Ask the owner what they want next; don't start step 5 unasked.
- **Restart the :3000 dev server before testing payments.** One started by another chat ran old code and didn't save Paystack fees.
- **Not yet tried by the owner:** printing or saving a statement as PDF (Payment history → View statement → Print).
- **How the money screens fit together:** Payouts = who's owed now (record a payment there); Payment history = reports and statements of money already sent; Revenue = what Truth made per booking.

## 4b: experience editor (done)

- Migration `20261030100000_admin_experience_editing.sql` (run by the owner): `admin_replace_itinerary` and `admin_replace_schedule`, replace-all in one transaction, `is_admin()` checked, not executable by `anon`.
- Pages `src/app/admin/(console)/experiences/{page, new/page, [id]/page}.tsx`; data `src/lib/admin/experiences.ts`; actions `src/lib/actions/admin-experiences.ts`; schedule grouping `src/lib/schedule.ts` (+ test); components in `src/components/admin/`.
- Each section saves separately. Every save calls `updateTag` for the public pages, then `refresh()` for the admin page.
- New experiences start hidden. They can't go live without a photo, and removing all photos hides them.
- Photos upload from the browser straight to Storage (bucket `images`, admin-only policies): JPG/PNG/WebP, up to 2 MB, at most 12; the first is the cover. Removed files are deleted on save; uploads removed before saving are deleted at once.
- The details form submits via `onSubmit` + `startTransition`, so a failed save doesn't reset the admin's edits (React resets forms that use `action`).
- Tested by the owner: details and live/hidden, photos, itinerary, schedule, blocked dates, public page refresh. E2E covers the signed-out lockout of the new pages.

## 4c: hosts, creators and privacy (done)

- Migration `20261031090000_private_people_columns.sql` (run by the owner):
  - revokes table `SELECT` on `hosts` and `creators` from `anon` and `authenticated`, then grants the public columns one by one, so `hosts.email` and `hosts/creators.revenue_share_percentage` are private. Checked from outside with the public key: those columns are refused, public pages still load. The old app's experience pages break (accepted).
  - adds `admin_replace_creator_experiences(creator, experience_ids[])`: replace-all, `is_admin()` checked, at most 100.
- Pages `src/app/admin/(console)/{hosts,creators}/{page, new/page, [id]/page}.tsx`; data `src/lib/admin/people.ts` (private columns via the service role after `requireAdmin()`); actions `src/lib/actions/admin-people.ts`; shared form helpers `src/lib/admin/form.ts` (+ test); image helpers `src/lib/images.ts` and `src/lib/upload-image.ts`.
- Writes go through the signed-in client, so RLS still checks each change. Replaced or removed photos are deleted from Storage on save.
- Deleting is blocked for a host who runs experiences, and for a creator who has bookings.
- Social fields accept a handle (`@name`) or a link and store an https link; websites can be typed without `https://`.
- Tested signed in (owner signed in, Claude drove the browser): host edit, photo upload/replace/remove with old files deleted from Storage, duplicate email error keeps the form, blocked delete of a host with experiences, create and delete a host; creator edit, cover upload, picks change shown on the public page, taken and invalid web address, create, pick and delete a creator. All test changes were reverted. Deleting a creator with bookings was tried with a temporary expired booking (then removed) and is blocked. E2E covers the signed-out lockout of the new pages.

## 4d: payouts (done)

Plan: `C:\Users\ryanc\.claude\plans\dazzling-chasing-unicorn.md`.

- **Money rules (owner):**
  - A host's percentage is **Truth's commission**; the host gets the rest of the experience price × guests (`subtotal`).
  - A creator's percentage is **of the subtotal**, paid **from Truth's part** when the guest came from their page.
  - Paystack's fees come out of Truth's part. The guest pays the experience price, nothing added (the 5% service fee was removed on 2026-10-30; historical bookings keep the fee they were charged).
  - Example, R1 000 at 18% commission and a 5% creator: guest pays R1 000, host R820, creator R50, Truth R130 before Paystack.
- **Creator credit:**
  - Visiting `/creators/[slug]` stores `truth-creator` in localStorage for 30 days, last visit wins (`src/lib/creator-credit.ts` + test, `RememberCreator`).
  - `BookingWidget` adds `&creator=` to the Reserve link.
  - `create_booking` only credits a creator who recommends that experience.
  - Before 4d no booking had a creator: the creator page never passed it on.
- **Migration `20261101090000_payouts.sql` (run by the owner):**
  - tables `payout_items` (earnings: one per person per paid booking, rate locked at payment) and `payouts` (money sent), admin read-only via RLS;
  - triggers on `bookings`: paid → `record_booking_earnings`, cancelled → earnings not yet paid out are voided;
  - RPCs `admin_record_payout` and `admin_undo_payout`;
  - host and creator percentages are now `not null`.
  - The backfill found one old-app test booking marked paid (`6319e454…`, March 2026): Michael Brown is owed R126,40.
- **Earning status:** Upcoming → Due (the day after the session, SA time) → Paid; Cancelled if the booking is cancelled before payout. A booking cancelled after payout shows a warning on its admin page.
- **Code:**
  - pages `src/app/admin/(console)/payouts/{page, [recipient]/[id]/page}.tsx`, plus a Payouts panel on the booking page;
  - data `src/lib/admin/payouts.ts`, actions `src/lib/actions/admin-payouts.ts`, helpers `src/lib/payouts.ts` (+ test);
  - components `record-payout-form`, `undo-payout-button`, `recipient-chip`.
  - The host form now says "Truth's commission (%)"; both percentages are required.
- **Tested** (owner signed in, Claude drove the browser):
  - a test booking via a creator, paid through `confirm_booking_payment`, recorded R196,80 for the host (82% of R240) and R12 for the creator;
  - record payment, undo, and cancel (paid line kept, unpaid line voided; undo after cancel → cancelled);
  - the public creator → Reserve → book form carries `creator`.
  - Test data was removed afterwards. E2E covers the signed-out lockout.
- **Later:** bank details (owner paused), automatic payouts via the Paystack Transfers API (~R3 per transfer, needs bank details), CSV export, emailed statements.

## 4e: booking search and payout reports (done)

Plan: `C:\Users\ryanc\.claude\plans\dazzling-chasing-unicorn.md`. No database change.

- **Bookings** (`/admin/bookings`):
  - search by name, email, phone, Paystack reference or the 8-character booking code (an id range, no migration);
  - filters for experience, host, creator, Month or From/To; status and Upcoming/Past/Any date chips;
  - totals (bookings, paid, guests, money taken less refunds, refunds), 50 per page, **Download CSV** (`bookings/export/route.ts`).
  - Filters live in the URL (`src/lib/booking-filters.ts` + test). Date limits also match old-app rows through `selected_date`.
  - The table shows the year, the booking code, the host and the creator.
- **Payment statement** (`/admin/payouts/payments/[id]`): the bookings one payment covered, with total, reference and a **Print or save as PDF** button. The admin note is shown on screen only. Print styles: day colours forced in `globals.css`, admin menu `print:hidden`.
- **Payment history** (`/admin/payouts/payments`): filter by month or From/To and by person, totals, paging, and a CSV with one line per booking paid (`payouts/payments/export/route.ts`).
- CSV helper `src/lib/csv.ts` (+ test): UTF-8 BOM for Excel, quoting, and a formula-injection guard.
- **Tested** (owner signed in, Claude drove the browser):
  - every search and filter, including the March 2026 old-app booking under March and Past;
  - both CSVs (BOM, columns, values);
  - one R246,40 payment covering two of Michael's bookings, its statement, and the history filters.
  - Test data was removed afterwards. E2E covers the signed-out lockout of the new pages and both downloads.
  - The print preview itself wasn't seen (the browser panel can't show it); the print rules were checked in the page's styles.

## 4f: Payment history and Revenue reports (done)

Plan: `C:\Users\ryanc\.claude\plans\dazzling-chasing-unicorn.md`.

- **Menu:** Dashboard, Bookings, **Payouts** (only who's owed: Due now and Upcoming), **Payment history**, **Revenue**, Experiences, Hosts, Creators.
  - The history moved from `/admin/payouts/payments` to `/admin/payment-history` (statement `/admin/payment-history/[id]`, CSV `/export`).
  - After recording a payment, the message links to its statement.
- **Payment history** (owner's "reporting screen"):
  - filters for year and person;
  - cards: paid in the year, to hosts, to creators, payments;
  - a stacked chart per month (hosts and creators), a month table (each month links to its payments), a by-person table;
  - the payments list (paged) with statements, and the per-booking CSV.
  - Helpers `groupPayoutsByMonth`, `groupPayoutsByPerson`, `parsePayoutFilters(year, month, person)` in `src/lib/payouts.ts` (+ tests).
- **Revenue** (`/admin/revenue`): what Truth made per booking.
  - **Formula:** guest paid − refunds − host share − creator share − Paystack fee. Cancelled-and-voided shares are 0; shares paid out before a cancellation count; Paystack keeps its fee on refunds.
  - Grouped by experience date. Filters: year, month, experience, host.
  - Cards (with margin %), a chart per month (negative months hang below zero), a month table, a per-booking table with links, and CSV.
  - Maths in `src/lib/revenue.ts` (+ tests), data in `src/lib/admin/revenue.ts`. Old-app paid bookings (no `paid_at`) are included.
- **Paystack fees:**
  - Migration `20261102090000_paystack_fees.sql` (run by the owner) adds `bookings.paystack_fee` and `payment_channel`.
  - `confirmPayment` saves them from Paystack's verify response (`fees` in cents, `channel`) once paid, including `already_paid`.
  - The older test payments were backfilled from Paystack's test API. Refunded payments are "reversed" but still carry the fee.
  - The old-app booking has no Paystack payment: shown as "Not recorded" (R0).
- **Shared pieces:**
  - `src/components/admin/bar-chart.tsx`: CSS columns, ≤24px, 4px rounded ends, 2px gaps, hover/focus tooltip, legend for 2 series, direct labels only on the best/worst month; the tables are the data view.
  - `report-parts.tsx`: `Stat`, `FilterLink`, `FilterField`, `Pager`.
  - Chart colours `series-1`/`series-2` were checked with the dataviz palette validator in light and dark, and are forced light when printing.
- `formatRand` now formats negatives as `-R7,11`.
- **Tested:**
  - a real Paystack test-checkout payment through a creator's page: creator credited, earnings R60 + R3,75, fee R3,79 saved, Truth made R11,21;
  - Revenue totals and CSV checked by hand;
  - Payment history filters, the stacked chart (temporary creator payment, then undone), statements and CSV;
  - light and dark.
  - Test data was removed afterwards; the owner's own R126,40 payment (ref 12344) stays.
- **Dev note:** the dev server on :3000 (started by another chat) was still running the old payment code, so it didn't save the fee. A fresh build did. Restart that dev server before testing payments.

## Open items before launch (step 5)

- **Email service:**
  - Supabase's default SMTP only sends to the owner's team, so customers can't receive sign-in links yet. Connect Resend (or SMTP) in Supabase Auth settings.
  - Booking confirmation emails were deferred by the owner. Add them with the email service.
- **Google sign-in:** the code is done. The owner must create a Google Cloud OAuth client (redirect URI `https://ygzrgfbsswiwugmqxufq.supabase.co/auth/v1/callback`) and enable Google in Supabase Auth providers.
- **Production settings:**
  - Set Supabase Auth Site URL and redirect URLs to the production domain (currently `http://localhost:3000`).
  - Set `NEXT_PUBLIC_SITE_URL`.
  - Register the Paystack webhook URL `/payments/paystack/webhook`.
  - Switch to the Paystack live key once the business is verified.
- **Vercel:** deploy in region `dub1` (Supabase is in eu-west-1). Add GitHub Actions secrets (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) so CI e2e passes.
- **Content:** several experience photos don't match their listing (the "kayaking" one shows a motorcycle). Replace them via the admin photo manager.
- **Dev warning:** `next dev` logs "encountered the unstable value `Date.now()` while prerendering" on signed-in pages (`/admin/*`, `/account/bookings`). The dev overlay traces it to `@supabase/auth-js` `GoTrueClient._loadSession` (session expiry check), reached from server rendering. `pnpm build` passes. Find which server call reads the session outside a dynamic boundary before launch.
- **Nice to have:**
  - the header search pill doesn't show the current search;
  - Google ratings caching;
  - a map view;
  - page transitions.

## Owner decisions (don't relitigate)

- **Design:** "Night cinema" design, with light/dark following the OS plus a Light/Dark/Auto toggle. Light mode is softened along Airbnb's lines. Archivo typeface; glass only over photos.
- **Stack and payments:** Next.js 16, Supabase kept and hardened. Paystack, at ~2.9% + R1 for cards and 2% for EFT. No service fee is added for the guest; the host's percentage is Truth's commission.
- **Booking:** guest checkout, with optional sign-in by email link and Google. Availability is a weekly schedule plus blocked dates. Holds last 20 minutes.
- **Refunds:** chosen per cancellation (full by default, or none; the "minus service fee" option only shows for historical bookings that carry a fee) and sent through the Paystack API. Paystack doesn't return its own fee.
- **Admin:** email + password + existing TOTP; access needs aal2 plus a row in `public.admins`.

## Test data in the shared Supabase project

- Paid test booking `c07a5651…` (2 Nov): later cancelled, with the R178,50 refund pending in Paystack.
- An expired hold `c44851df…` (31 Oct).
- Short-lived "Playwright Test" holds created by e2e runs.
- Paid booking `17f7b6d0…`, paid through the :3000 dev server; its Paystack fee (R4,13) was filled in by the backfill.
- Old-app paid booking `6319e454…`: earning R126,40 to Michael Brown, paid by the owner as a real test payment (reference 12344). It has no Paystack fee ("Not recorded" on Revenue).
