# Truth rewrite: progress and handoff

Last updated: 2026-11-03, end of session.

- **2026-11-03:**
  - A demo set of hosts, creators and experiences was added to the database.
  - Creator logins and creator-owned pages were thought through, with the research saved and nothing built.
- **2026-11-01:**
  - The customer redesign started in Claude Design. Batches 1–3 are committed and pushed: the floating booking button on phones, search results as tiles, pop-up colours and the sticky home header.
  - Seven look-and-feel experiments are on the board, kept for later, with no code.
  - Calendar sync with hosts' booking systems (Activitar) was researched; nothing is built.
- Step 5 is still on hold.

The approved plan and the original audit are in `C:\Users\ryanc\.claude\plans\i-d-like-you-to-lexical-treasure.md`.

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

- **Creator logins and creator pages: talk this through first.**
  - The owner asked to keep all the research and feedback to discuss next session.
  - Open by walking them through the verdict and the 5 decisions in "Creator logins and creator pages" below.
  - The full research is in `docs/research/creator-pages-2026-11-03.md`.
  - Build nothing until the owner decides.
- **A demo set is in the database** for showing the app: 5 hosts, 2 creators and 8 experiences (see "Test data").
- **Committed and pushed:** redesign batch 1, floating booking button on phones (`7ef7309`), and batch 2, search results as tiles (`14c182e`). Batch 3 (pop-ups follow the page colours; home header sticks after the hero) is committed and pushed too. Nothing is half-built. See "Customer redesign" below.
- **Look-and-feel experiments are parked.** The owner said "keep these designs, remember them for later, nothing to code yet". Don't build any of them until the owner raises it. See "Design experiments" below.
- **Calendar sync idea: research done, waiting on answers.** Next steps are the owner's: ask hosts which booking system they use, and contact Activitar with the questions in "Calendar sync" below. Offer to draft that email. Build nothing until Activitar answers.
- **Step 5 (launch) is on hold.** The owner postponed it to add the payouts and reports (4d–4f). Ask the owner what they want next; don't start step 5 unasked.
- **Restart the :3000 dev server before testing payments.** One started by another chat ran old code and didn't save Paystack fees.
- **Not yet tried by the owner:** printing or saving a statement as PDF (Payment history → View statement → Print).
- **How the money screens fit together:** Payouts = who's owed now (record a payment there); Payment history = reports and statements of money already sent; Revenue = what Truth made per booking.

### Customer redesign (started 2026-11-01, owner's choice; admin is out of scope)

- **How we work:** the owner tries ideas on a Claude Design board; settled ideas are built into the code in small batches (build, test, show, commit on approval), then the board is refreshed from the code. The code's shared components and colour roles stay the source of truth.
- **Design system artifact** (private): https://claude.ai/artifact/JJahdxASfohokLHpEt2rzc — tokens, type, radii and 11 customer components as static previews, built from `main@63c923b`.
- **Design board** (private): https://claude.ai/artifact/GNjQuTqD4seiG8XN7fLFY4 (version 25). It has:
  - the home and experience pages, desktop and phone, in day mode;
  - phone night frames for the booking button;
  - the shared cards, mini tiles and the search proposal;
  - the look-and-feel experiments (see "Design experiments" below).
  - Real listings and Pexels photos are uploaded as assets; session dates are samples. The owner edits the board too, so re-read its files before publishing.
- **Batch 1, floating booking button on phones (`7ef7309`):**
  - Below `lg` the side booking card is hidden; `src/components/booking/mobile-booking.tsx` shows a floating pill (price, rating, "Check dates") in `bg-ink text-canvas`, so it is dark by day and light at night, with a new `shadow-lift` token (`--lift-shadow` in `globals.css`, stronger at night).
  - Tapping opens the booking widget in a full-screen `Sheet` (new `side="full"`), headed by a small summary (photo, title, rating, place). The widget mounts only when the sheet opens.
  - Links to `#book` (back from the book page, rebook from an expired hold) open the sheet on phones.
  - Following a link inside the sheet (Reserve) closes it first: Next keeps the left page mounted but hidden, and a modal left open there made the book page inert (caught by the mobile e2e).
  - `Sheet` fix: a nested sheet's close event no longer closes the sheet around it (React passes `close` up the tree); `onClose` now checks the event target.
  - e2e `booking.spec.ts` taps the floating button first on the mobile project.
- **Batch 2, search results as tiles (`14c182e`):**
  - New shared `ExperienceTile` (`src/components/experience/experience-tile.tsx` + test): square photo with the existing `FavoriteButton`, title (2 lines), place, price (screen readers hear "per person") and rating. Same `ExperienceCardData` as `ExperienceCard`; no category or duration.
  - `TileGrid` / `TileGridSkeleton` in `experience-grid.tsx`: 2 across on phones, 3/4/5 at sm/md/lg, 6 from xl.
  - `/experiences` uses tiles; the big `ExperienceCard` stays on home, creator pages and Saved. Styleguide has an "Experience tiles" section.
  - On the design board but not built (no screen uses them yet): a night-style featured card and a compact list-row mini card.
- **Batch 3, pop-up colours and home header (committed):**
  - `Sheet` now renders into `<body>` (portal, after mount), so pop-ups take the page's light/dark colours instead of the `scheme-dark` of the home hero header. This fixed the dark search and menu sheets on the home page in light mode.
  - New `HeaderShell` (`src/components/site/header-shell.tsx` + test): on the home page the header is fixed, floats over the hero in the night scheme, and once scrolled past the hero (`scrollY > innerHeight - 96`) turns into the normal solid header, sliding in (`animate-header-in`). Other pages keep the sticky solid header. `SearchPill` and `MenuButton` read `useHeaderFloating()` instead of an `overlay` prop.
- **Batch 1 notes:**
  - Dev-only quirk seen while testing (also before this change): reloading an experience page in the browser pane can leave its streamed section unhydrated; a fresh navigation is fine and production e2e passes.

### Design experiments (board only, kept for later, no code)

These are all on the design board (version 25). Every text colour was checked for at least 4.5:1 contrast, and all content is real (6 listings, 787 reviews, Michael Brown). The owner hasn't picked one; they may mix ideas.

- **Top row, right of the search proposal:**
  - **1 · Golden hour** (`Warm-home`, desktop and phone): warm sand-white, terracotta, bush green, Fraunces headings.
  - **Touch-up** (`Touchup-*`, at x8560): the lightest option. It keeps today's layout, font and components, with eight changes: a warm white page (#fbfaf7), a sunset glow on the hero with a sunset-to-lavender "experiences", colour-coded categories, more use of the purple accent, gold stars, soft warm card shadows, an "Explore by type" chip strip and a trust band (787 reviews · Paystack · from R75), and bolder section headings.
    - It has day and night phone frames, a shared `Touchup-card`, and a "what changed" sheet.
    - If chosen, it's mostly a colour-token change in `globals.css` plus two small home sections.
- **Lower area, "Six design directions"** (y ≈ 7400+): an overview comparing all six, then one column per direction (style tile, home desktop, home phone):
  - 2 · Field Notes (bento grid, mono labels)
  - 3 · The Journal (editorial serif)
  - 4 · Colour Block (bold colour; generic shapes only, no Ndebele or shweshwe motifs)
  - 5 · Afterglow (immersive night, liquid glass; closest to today)
  - 6 · Stillness (quiet luxury)

### Calendar sync with hosts' booking systems (researched 2026-11-01, nothing built)

**The owner's idea:** customers keep paying Truth through Paystack, but a Truth booking also blocks the slot in the booking system the host already uses (especially **Activitar**), so a slot can't be double-booked. In other words, block seats in the host's system and bypass that system's payment.

- **This is a normal model.** The industry calls it "full payment to agent": the reseller collects the money and pays the operator their net amount. Truth's payouts already work this way; only the blocking part is new.
- **Activitar:**
  - Widely used by SA adventure operators (Storms River, Magoebaskloof, Le Bonheur and others).
  - It offers an API to approved "distributors": GetYourGuide, Manawa, ExperienceGifts, and SA marketplaces like ActivityHub and Activity Awaits.
  - There are no public developer docs, so Truth would have to apply as a distributor.
  - Contact: support@activitar.com, +27 87 250 0276 (https://www.activitar.net/contact).
  - Don't automate hosts' own Activitar logins; use the official distributor route.
- **Questions for Activitar (unanswered):**
  1. Can a distributor create a booking that blocks seats **without Activitar taking the payment** ("on account")? How does their "auto settlement of sales" work?
  2. Can seats be held briefly while the customer pays, then confirmed or released?
  3. Can we read remaining seats per time slot in real time?
  4. Are we notified straight away when a host cancels, or closes a day or slot?
  5. What does a distributor connection cost, and what are the terms?
  6. Is there an iCal (calendar link) export or import as a simpler fallback?
- **Question for hosts:** which booking system or calendar does each host use today (Activitar, Bókun, Rezdy, FareHarbor, Google Calendar, nothing)?
- **Options, simplest first:**
  - **iCal link out:** a private calendar link of Truth bookings per host. Small, but it only blocks anything if their system reads it.
  - **iCal link in:** Truth polls the host's calendar every few minutes and closes busy slots. Medium effort; it only knows busy or free, not seat counts, and there is a short gap between polls.
  - **Direct API:** an Activitar distributor connection, or **OCTO**, the open standard used by Bókun, Ventrata, TuriTop and Bilberry, so one build covers many systems. Larger, needs partner approval, but works live and per seat. FareHarbor's API is partner-approved only; Rezdy has an agent API.
- **Change needed in Truth for any option:** availability is weekly `experience_schedules` (seats per slot) plus whole-day `experience_blackouts`. Sync needs per-slot blocks or "seats taken elsewhere" (an additive migration).
- **Recommended order:**
  1. Ask hosts what they use.
  2. Email Activitar the questions.
  3. Meanwhile, the iCal links are the cheap first build.
  4. Build the Activitar connection once they confirm Truth can book without them taking the payment.
  5. Add OCTO later if hosts use Bókun and similar systems.

### Creator logins and creator pages (thought through 2026-11-03, nothing built)

**The owner's question:**

- Could creators and customers both log in?
- Could each creator's public page be their own, maybe on their own domain?
- Is it worth doing?

The owner wants to discuss it next session.

- **Full research and feedback:** `docs/research/creator-pages-2026-11-03.md`. It holds:
  - my thinking;
  - the combined report;
  - the market, technology and code research, with sources;
  - the 5 option designs;
  - the 3 reviews.

  The plan as shown to the owner: `C:\Users\ryanc\.claude\plans\dynamic-churning-mccarthy.md`.

- **Verdict:**
  - **Customer logins:** already built. Keep guest checkout.
  - **Creator logins: yes, after launch.**
    - The same login as customers, with a "creator" role added.
    - A read-only dashboard at `/account/creator` showing links, earnings by month and payments.
    - About 2–3 build days and 1 migration.
    - Start when 3 real creators have signed, or when a creator who brings bookings wants their numbers more often than monthly.
  - **Own domains or subdomains: not worth building.**
    - Logins and credit don't carry across domains.
    - Every domain needs DNS support with no end date.
    - None of the travel platforms researched (Viator, GetYourGuide, Expedia, Booking.com, Airbnb) do it.
    - A creator can point their own domain at their Truth page with a 301 redirect, for free.
- **Phase 1, before recruiting creators** (about 1–2 sessions, no migration):
  - `?via=` links that carry credit to any experience;
  - credit only for visits that start outside Truth;
  - a "creators earn a share, you pay the same" line;
  - share links in admin;
  - creator statements by month.
- **Gaps today (checked in the code):**
  - Links to one experience earn nothing, because nothing reads a link parameter.
  - A "Recommended by" tap moves the credit to that creator.
  - Creator statements print the booking code, exact date and guest count (`payment-history/[id]/page.tsx`).
  - Safari can clear localStorage after 7 days without a visit.
- **Ideas from outside the box, none needing a build:**
  - dates co-hosted by a creator;
  - "creator-tested" reviews, labelled as such;
  - "paid monthly in rands" as the pitch to creators;
  - TikTok and WhatsApp first, with checkout codes later.
- **Decisions for the owner** (the research file has the recommended defaults):
  1. What earns credit.
  2. The rate and how payouts work.
  3. Whether creators can earn on their own bookings.
  4. The public address (keep `/creators/<name>`).
  5. What creators see.
- **Questions to discuss:**
  - The 5 decisions.
  - Phase 1 before launch?
  - Are there real creators in mind?
  - Try a co-hosted date or a creator-tested review?
  - Is 5% right? Viator pays 8%.

### Done in the 2026-10-30 session

- **5% service fee removed from new bookings** (`e74faa4`). Migration `20261103090000_remove_service_fee.sql` rewrote `create_booking` to insert `service_fee = 0, total_amount = subtotal` (owner ran it). The guest-facing book page (`src/app/(site)/experiences/[id]/book/page.tsx`) now shows one price line only; the hold page (`src/app/(site)/bookings/[id]/page.tsx`) only breaks out the fee when `booking.fee > 0`, so historical bookings keep their original breakdown. `src/lib/pricing.ts` and `src/components/booking/booking-widget.tsx` were updated to match.
- **Date.now() prerender warnings fixed** (`e3dcd3f`). `await connection()` added inside Suspense on the admin routes that compute "today in SA" (`admin/revenue`, `admin/payment-history`, admin bookings, creator detail, host detail, booking detail) and `export const instant = false` on the admin console layout and leaf pages that compute "now". Walked all signed-in routes after a fresh dev restart — server log clean, no "unstable value" matches.
- **Stale e2e assertion updated** (`23638b5`). `e2e/booking.spec.ts` now checks the Reserve link is visible instead of the removed "Service fee" text.
- **End-to-end walkthrough done** in the browser pane (owner signed in at the pane): admin dashboard, bookings, booking detail, revenue, payment history, payouts, experiences, hosts, creators; public flow experience → book → reserve → hold page. New paid bookings show subtotal-only Guest-paid; historical rows keep their original fee.

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
- **Content:**
  - The original six experiences' photos were replaced on 2026-11-03 with Pexels photos checked by eye, using the script `scratchpad/seed/fix-photos.mjs`.
    - They had included a motorbike, a car, a conference room and personal screenshots.
    - The photos were changed straight in the database, so the five old uploaded screenshots are still in the public `images` bucket under `experiences/`, but nothing uses them any more:
      - `86cea634…png`
      - `2087bc0c…png`
      - `ac7c1c50…png`
      - `6be34fa7…png`
      - `a646e409…png`
    - The owner can delete them in the Supabase dashboard.
  - Real photos from hosts are still needed before launch.
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

- **Demo set (added 2026-11-03 for showing the app):** 5 hosts, 2 creators and 8 experiences, each with an itinerary, a weekly schedule and 2–3 reviews.
  - Every id starts with `de`: hosts `dea00000-…`, creators `deb00000-…`, experiences `dee00000-…`. To remove the set, delete by those ids (child rows first: referrals, reviews, itineraries, schedules, blackouts). Experiences that already have bookings can't be deleted that way; deactivate them instead.
  - Hosts: Thandi Nkosi (Cape Town), Fatima Davids (Bo-Kaap), Sipho Dlamini (Soweto), Anri van Wyk (Knysna), Ayanda Mthembu (Durban). Emails are `…demo@example.com`.
  - Creators: Zanele Eats (`/creators/zanele-eats`), Trail & Tide (`/creators/trail-and-tide`).
  - The set adds two new categories, Nature and Wellness. Photos are Pexels, checked by eye. The Soweto and Durban photos are stand-ins: Cape Town cyclists, and curry with bread instead of bunny chow.
  - After adding data straight to the database, restart the dev server (or save any experience in admin) so the cached lists refresh.

- Paid test booking `c07a5651…` (2 Nov): later cancelled, with the R178,50 refund pending in Paystack.
- An expired hold `c44851df…` (31 Oct).
- Short-lived "Playwright Test" holds created by e2e runs.
- Paid booking `17f7b6d0…`, paid through the :3000 dev server; its Paystack fee (R4,13) was filled in by the backfill.
- Old-app paid booking `6319e454…`: earning R126,40 to Michael Brown, paid by the owner as a real test payment (reference 12344). It has no Paystack fee ("Not recorded" on Revenue).
