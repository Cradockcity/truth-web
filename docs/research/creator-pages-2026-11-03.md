# Creator logins and creator pages: research and thinking (3 Nov 2026)

**Nothing here is built.** This file keeps the research and feedback behind the "Creator logins and creator pages" section in `docs/PROGRESS.md`, so it can be discussed and picked up later.

**The question (from the owner):** could each creator log in, and each customer log in, with the creator's public page being their own, maybe even on their own domain? What would that look like, thinking outside the box, and is it even worth doing?

**How it was made:**

- 12 research agents worked on it. Three researched the code, the technology and the market.
- Five designed an option each, and three reviewers scored the options from different angles.
- A final agent combined everything into one report, and the key claims were then checked against the code again.

**Reading notes:**

- Facts were true on 3 Nov 2026.
- File line numbers point to the code at commit `75b75d2`.
- Where part 2 (the combined report) corrects an earlier design or review, part 2 wins.
- Market facts carry trust tags: **[S]** strong (official or primary source), **[M]** moderate, **[W]** weak.

**Contents:**

1. My thinking and recommended plan
2. Final combined report
3. Research: market, technology and code
4. The five option designs
5. The three reviews

---

## 1. My thinking and recommended plan

### Context

**You asked:**

- Could each creator log in?
- Could each customer log in?
- Could a creator's public page be their own, maybe even on their own domain?
- What would that look like? Think outside the box. Is it even worth doing?

You want my thinking and feedback, not a build.

**Where Truth is today** (checked in the code):

- **Customers** can already sign in with an email link or Google. That adds My bookings and keeps Saved in sync across devices. Checkout also works without an account.
- **Creators** have no login. An admin builds their page at `/creators/<name>` and chooses their picks.
- **How a creator gets credit:** only when a guest opens the creator's Truth page.
  - The device remembers it for 30 days, and the last creator visited wins.
  - A creator who posts a link straight to one experience earns nothing.
  - A guest who taps "Recommended by" inside Truth hands credit to that creator, even if a different creator sent them.
- **Payouts:** admins record payouts and print statements. These show each booking's code, its exact date and the number of guests.

**How this was made:**

- 12 research agents covered the code, the technology (domains, logins, Vercel, Supabase, Paystack, SA law) and 17 comparable platforms.
- They designed 5 options, and 3 independent reviewers scored them.
- I then checked the key claims against the code myself.

### What I think (short answer)

**It's worth doing in part, and mostly later.**

- **Customer logins:** already built. Keep guest checkout: 18% of shoppers abandon a purchase when they're forced to create an account (Baymard). Before launch, logins only need the Google setup or an email service, and both are already on the launch list.
- **Creator logins: yes, after launch.**
  - Creators use the same login as customers, with "creator" added to their account as a role.
  - They get a simple dashboard showing their links, what they've earned and what's been paid.
  - It's about 2-3 build days, once about 3 real creators have signed up.
- **Their own domain: not worth building.**
  - The platforms that sell experiences (Viator, GetYourGuide, Expedia) keep creator pages on their own site.
  - Linktree and Stan don't offer custom domains at all. They tell creators to forward a domain they own, and Truth can say the same, for free.
- **What makes a page feel like theirs** is their words, picks, face, links and seeing their earnings, not the web address.
- **What decides whether creators join** is the rate, the credit rules, how fast they're paid, and whether there are enough experiences near them to recommend. Who owns the page matters far less.

### The options at a glance

|     | Option                                                | What the creator gets                                                                                                    | Effort                                         | Extra cost per month                                                               | Verdict                                                  |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- |
| A   | Creator accounts on Truth                             | The same login as customers. A dashboard with their links and earnings. Later, they edit their own page                  | Read-only version: 2-3 days, 1 database change | R0                                                                                 | **Yes, in Phase 2**                                      |
| B   | Branded subdomains (`zanele.truth.co.za`) with themes | Their own colours and a page builder                                                                                     | 2-4+ weeks                                     | R0, but Truth's domain settings move to Vercel. Ongoing design and moderation work | No                                                       |
| C   | Their own domain, run by Truth                        | Their address shows a shop Truth runs. Guests still pay on Truth                                                         | 5-8 weeks                                      | R0 in fees, plus DNS support for every domain, with no end date                    | **Not now.** Only for one proven creator, set up by hand |
| D   | Share kit                                             | Links to any experience that carry their credit, and ready-made WhatsApp messages. Later: QR codes, booking cards, codes | The core: 1-2 sessions, no database change     | R0                                                                                 | **Yes: the core is Phase 1**                             |
| E   | Creator guides                                        | Trips and tips on their Truth page                                                                                       | 2-4 days for a first version                   | R0, plus your time reviewing                                                       | Later, once regions have enough experiences              |
| F   | Forward their own domain                              | Their domain opens their Truth page                                                                                      | Nothing to build                               | R0 to Truth. About R109 a year for the creator's .co.za                            | **Yes**, once Truth is live                              |

The costs leave out Vercel Pro (about $20 a month). Truth needs it for launch anyway, because Vercel's free plan doesn't allow sites that take payments.

### Why not their own domain (or a subdomain)

- **Logins don't carry across.** A guest signed in on truth.co.za looks signed out on zaneleeats.co.za. Subdomains can share a login, but only with extra setup and a change to Truth's domain settings.
- **Credit doesn't carry across either.** It's stored per web address, so every hop between sites would have to pass it along in the link.
- **Checkout must stay on one trusted address.**
  - Online card fraud is most of South Africa's credit-card fraud: 85.6% of losses in 2024 (SABRIC).
  - People trust a site they know.
- **It's ongoing work for you.** Every domain needs DNS setup and help, for as long as it runs, and Vercel can't sell .co.za domains.
- **Few people use it even where it's offered:** only 16% of Substack publications have their own domain.

### Ideas from outside the box

Most of these need no build.

1. **Creator co-hosted dates.** For example, "Cook with Zanele" once a month: an existing experience with the creator joining in. Airbnb Originals and TrovaTrip run on this idea.
   - **No build:** an admin can list it as an experience today.
2. **"Creator-tested" reviews.** Give a creator a free booking in exchange for an honest review of a new experience. GetYourGuide started this in 2026, and says travellers are 3 times more likely to book once an experience has three reviews.
   - **No build:** admins can already add reviews.
   - **Must be labelled** as a free booking.
3. **Pay creators in rands, and fast.** Viator and GetYourGuide pay in dollars or euros. We found no local programme that pays rands for experiences, but the evidence is thin. "Paid monthly to your SA bank" could be the pitch.
   - **No build.**
4. **TikTok and WhatsApp first.**
   - TikTok reaches 29.1M SA adults; Instagram reaches 8.6M.
   - TikTok opens links in its own browser, which keeps its own storage. That's why links that carry credit matter (Phase 1).
   - Codes that guests type at checkout suit video and WhatsApp (Phase 3).
5. **Booking cards on creators' own websites.** For creators with blogs: Truth cards that open Truth's checkout. Build this later, if creators ask.
6. **Trips and guides.** The creator's own content is what makes their page theirs. Build later.

### Honest feedback: what matters more than the page

- **Fix the credit gaps before recruiting:**
  - Links to a single experience earn nothing.
  - "Recommended by" taps inside Truth give credit to creators who didn't send the guest.
- **Supply:** 14 experiences across about 5 regions. Creators need enough to recommend where they and their audience are, so recruit hosts there.
- **The offer:**
  - The rate: 5% today, against Viator's 8%.
  - Payout speed.
  - A clear one-page agreement.
- **Privacy:** creator statements show guest details (booking code, exact date, guest count). That's fine for hosts, but not for creators.
- **Legal basics before recruiting publicly:**
  - a privacy notice and booking terms;
  - a clear "paid link" label on every creator post (the advertising regulator ruled against SAB over an unlabelled post in July 2026).
- **Run the first creators by hand.** Big platforms added creator storefronts years after their link programmes: Amazon in 2017 after links from 1996, Viator only in 2024.

### Recommended path

- **Phase 1: before you recruit creators.**
  - About 1-2 build sessions.
  - No database change, and nothing changes in Vercel, Supabase or Paystack.
- **Phase 2: after launch.**
  - About 2-3 build days, plus 1 database change that you paste in.
  - Creators sign in and see a read-only dashboard at `/account/creator`.
  - **Start when** 3 real creators have signed, or when a creator who brings bookings wants their numbers more often than monthly, whichever comes first.
  - **Needs first:**
    - Truth on its real domain;
    - Google sign-in or an email service;
    - a creator agreement;
    - the privacy notice and booking terms.
- **Phase 3: only if creators ask.** Any of:
  - creators edit their own text and picks;
  - checkout codes;
  - guides;
  - booking cards;
  - host logins;
  - one proven creator's own domain, set up by hand.
- **Not planned:** Truth subdomains, logins shared across domains, and checkout anywhere but on Truth.

### Phase 1 in detail (for when you're ready)

1. **Read `?via=`.** `creatorFromSearch()` in `src/lib/creator-credit.ts` checks the value against the existing `SLUG` pattern, with 80 characters at most.
2. **Catch it on every public page.**
   - Add a new `src/components/site/capture-via.tsx`, mounted in `src/app/(site)/layout.tsx`.
   - It reads `location` in an effect, so pages stay prerendered.
   - `?via=` stays in the address, so "Open in Safari" keeps the credit.
3. **Fall back to the link at Reserve.** In `src/components/booking/booking-widget.tsx` L55: `creditedCreator() ?? creatorFromSearch(...)`.
4. **Credit only visits from outside Truth.** `src/components/site/remember-creator.tsx` credits only when the creator's page was the first page of the visit, using an `isLandingPage()` helper.
5. **Disclosure line.** Add a new `src/components/site/creator-disclosure.tsx`, placed on the creator page and under the "Recommended by" chips. Example wording: "Creators earn a share when you book through them. You pay the same price."
6. **Share links in admin.**
   - Add a pure `src/lib/share-links.ts`, with a test, and `src/components/admin/share-links.tsx` with Copy and WhatsApp buttons.
   - Add a "Share links" section to `src/app/admin/(console)/creators/[id]/page.tsx`, reusing `Section`, `creator.slug`, `creator.experienceIds` and `listExperienceOptions()`.
   - It shows a warning while the site address is still localhost.
7. **Creator statements show months only.**
   - In `src/app/admin/(console)/payment-history/[id]/page.tsx`, creator statements drop the booking code, exact date and guests.
   - Host statements are unchanged.
   - Add `formatMonth()` to `src/lib/payouts.ts`.

**Unchanged:** sign-in, Supabase, Paystack and `create_booking`. It still only credits a creator who recommends the booked experience, so a wrong link costs nothing.

**Tests:**

- unit tests for each new helper;
- a new `e2e/creator-credit.spec.ts` covering a link carrying credit to Reserve, blocked storage, a "Recommended by" tap not crediting, and the disclosure line;
- `pnpm check`, `pnpm build` and `pnpm test:e2e`;
- a Paystack test booking through a share link, through to a test payout statement.

### Phase 2 design (ready, not built)

- **Database:**
  - A `creator_members` table, managed by admins only, that links a login email to a creator.
  - Functions: `claim_my_creator_invites()` (modelled on `claim_my_bookings`), `my_creator()`, `creator_my_earnings()` (by month, with no guest details) and `creator_my_payouts()`.
  - A guard trigger stops anyone who isn't an admin from changing a creator's web name or share %.
- **App:**
  - `requireCreator()`, modelled on `src/lib/admin/guard.ts`.
  - The `/account/creator` page, shaped like `account/bookings`, reusing the `Stat` cards and the Phase 1 share links.
  - A "Creator sign-in" section in admin.
  - The claim step in `auth/confirm` and `auth/callback`.
  - A "Creator dashboard" menu item.
- **Roles:** one account can be customer, creator and admin at once. Removing a role takes effect on the next page load.

### Decisions for you (my recommended defaults)

1. **What earns credit:**
   - Only visits from outside Truth: the creator's link, or their page as the first page of the visit.
   - Only experiences they recommend.
2. **Rate and payout:**
   - Keep the per-creator % set in admin.
   - Pay monthly by EFT once R100 is due, and send the statement on WhatsApp.
   - Review after 3 months.
3. **Creators earning on their own bookings:** not allowed, and written into the agreement.
4. **Public address:** keep `/creators/<name>`, and decide before anything is printed.
5. **What creators see:** month, experience, booking value, their share and status. Never names, contact details, booking codes, exact dates or guest counts.

### Risks

- **Credit gets lost** when Safari clears storage after 7 days without a visit, in-app browsers, or a guest switching device. Handled by keeping `?via=` in links. Creator wording will say "up to 30 days, same phone or computer".
- **Links shared before the real domain exists.** Hand links out only after launch.
- **Guest privacy (POPIA):** creators see months only.
- **Missing legal basics:** a lawyer should confirm them. This isn't legal advice.
- **Other sites can show Truth inside a frame today.** Add `frame-ancestors 'self'` at launch.

### Questions to discuss next session

1. Do you agree with the 5 default decisions above? Rate, credit rules and payouts matter most.
2. Should Phase 1 (the credit fixes, the disclosure line and creator-safe statements) happen before launch?
3. Do you have real creators in mind, and what would they want to see?
4. Should we try a co-hosted date or a "creator-tested" review with a demo creator? Neither needs a build.
5. Is 5% the right rate, given Viator pays 8%?

---

## 2. Final combined report

### Creator logins and creator-owned pages: final recommendation

#### 1. Short answer

It's worth doing in part, and mostly later. Customers can already sign in. Creators can use the same login, with "creator" added to their account as a role, to see their links and earnings. Every creator programme we looked at offers this, and here it would take about 2–3 build days, so it's worth building once Truth is live and has about three real creators.

Putting creator pages on their own domain, or on a Truth subdomain, is not worth building. Logins and creator credit don't carry across web addresses, and every domain would need ongoing DNS support. None of the travel programmes we researched (Viator, GetYourGuide, Expedia, Booking.com, Airbnb) do it. A creator who owns a domain can point it at their Truth page for free.

One small thing is worth doing now. Today a creator who posts a link to a single experience earns nothing, so any Truth link should be able to carry their credit. Whether creators join will depend far more on the bookings they can bring, the rate and how fast they're paid than on who owns the page. We found no evidence that pages on a creator's own domain lead to more bookings.

#### 2. The options at a glance

| Option                                                                    | What the creator gets                                                                                                                                    | What the customer sees                                                                                      | Effort                                                                      | Extra cost per month                                                                                      | Verdict                                                                              |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| A. Creator accounts on Truth                                              | One login, shared with customer features. A dashboard with their page link, share %, share links and earnings. Later, they edit their own text and picks | Truth's pages, unchanged                                                                                    | M overall. The read-only first part is about 2–3 build days and 1 migration | R0                                                                                                        | **Yes, as Phase 2**, once real creators exist. Drop its /@handle address             |
| B. Branded subdomains (zanele.truth.co.za) with themes and a page builder | A themed mini-site and a studio to edit it                                                                                                               | A different-looking site for each creator, then Truth's checkout. Signed-in customers look signed out there | L: 2–4+ weeks                                                               | R0 in fees. Truth's domain settings (nameservers) must move to Vercel. Ongoing design and moderation work | **No**                                                                               |
| C. Creator's own domain, served by Truth (a "shop")                       | Their own address shows a shop that Truth runs                                                                                                           | Starts on the creator's domain, then moves to truth.co.za to pay                                            | XL: 5–8 weeks                                                               | R0 in fees. DNS support for every domain, with no end date                                                | **Not now.** Only for a named creator or partner with proven traffic, set up by hand |
| D. Share kit                                                              | Links to any experience that carry their credit. Later: click counts, embeds, codes                                                                      | Normal Truth pages                                                                                          | The core: 1–2 sessions, no migration. All modules: M                        | R0                                                                                                        | **Yes, the core is Phase 1.** Embeds, short links and QR codes only if creators ask  |
| E. Creator guides (trips, tips, following)                                | Their trips and tips on their Truth page                                                                                                                 | Guide pages on Truth                                                                                        | L. The first slice realistically takes 2–4 days                             | R0, plus your time writing and reviewing                                                                  | **Later (Phase 3)**, and only where a region has enough experiences                  |
| Forward their own domain (nothing to build)                               | Their domain sends visitors to their Truth page                                                                                                          | Truth's page                                                                                                | None for Truth                                                              | R0 to Truth. The creator pays about R109 a year for a .co.za                                              | **Yes.** This is the "own domain" answer, once Truth is live                         |

The costs leave out Vercel Pro (about $20 a month). Truth needs it to launch anyway, because Vercel's free Hobby plan doesn't allow commercial sites that take payments.

**Corrections carried into this plan** (checked in the code or at the source):

- **Credit doesn't reliably last 30 days on iPhones.**
  - Safari deletes a site's browser storage (localStorage) after 7 days of Safari use if the person hasn't used that site in that time (WebKit blog, "Full Third-Party Cookie Blocking and More").
  - The browsers built into Instagram and TikTok keep their own separate storage.
  - Every option is affected. Creator-facing wording should say "up to 30 days, on the same phone or computer".
- **Viator's rule is broader than Truth's.**
  - Viator pays 8% on any experience booked within 30 days of the click (partnerresources.viator.com/creator).
  - Truth's `create_booking` only credits creators who recommend the experience being booked.
  - This is now owner decision 1.
- **Option A's /@handle address doesn't work as described.**
  - Next 16.4 matches `next.config` rewrites against the raw web address (`node_modules/next/dist/server/lib/router-utils/resolve-routes.js`). Only the proxy also tries the decoded address.
  - A link encoded as `/%40name` would therefore show "not found". It isn't needed, so it's dropped.
- **Option A's menu check would show admins every creator link.**
  - It reads `creator_members` directly. Under an "Admins manage … for all" policy, an admin who has passed the authenticator step would get every row back.
  - The fix is a function that returns only the signed-in person's own row.
- **Options A and D both show details that can identify guests.**
  - A's earnings list shows the session date and guest count. The due date is the session date plus 1 (`supabase/migrations/20261101090000_payouts.sql` L87), so it gives the date away too.
  - D shows the booking code. Customers see that code as "Booking 8A29506E" (`src/app/(site)/bookings/[id]/page.tsx` L93), and it is part of the Paystack reference (`src/lib/actions/payment.ts` L33).
  - Creators should see months only.
- **The business review said payment statements print without guest details. That's only half true.**
  - The statement prints each booking's code, exact session date and guest count (`src/app/admin/(console)/payment-history/[id]/page.tsx` L108-119).
  - This has to be fixed before statements go to creators on WhatsApp, so it's in Phase 1.
- **Smaller corrections to options B to E:**
  - B removes `?via=` from the address, which loses credit when a guest moves from an in-app browser to Safari or Chrome. Keep it in the address, as D does.
  - C's claim that "the domain is the credit, so Safari can't wipe it" only holds for bookings made in the same visit.
  - D's month-only earnings can't reuse `earningStatus`, because it needs the due date (`src/lib/payouts.ts` L11-18). Work out the status in the database instead.
  - E changes `admin_replace_creator_experiences`. That breaks `deleteCreator`, which clears a creator's picks before deleting them (`src/lib/actions/admin-people.ts` L259-264). The change is also not additive.
- **Confirmed as the reviews said:**
  - Nothing stops other sites from showing Truth inside a frame today: `next.config.ts` has no `headers()`.
  - Links built now point at `http://localhost:3000` (`src/lib/env.ts` L6).
  - Any signed-in user still has table-wide UPDATE rights on `creators`. Only the admin policy limits it (`supabase/migrations/20261029120000_security_and_availability.sql` L403). So creators must never get a direct update policy.

#### 3. Recommended path

**Phase 1: now. About 1–2 build sessions plus your review. No database change, and nothing changes in Vercel, Supabase or Paystack.**

What it delivers:

- Any Truth link can carry a creator's credit, for example `truth.co.za/experiences/<id>?via=zanele-eats`.
- If the browser blocks storage, the booking still picks up the creator from the link.
- If you choose decision 1's default: only visits from outside Truth earn credit. Tapping "Recommended by" inside Truth no longer creates or moves credit.
- A one-line notice on creator pages and beside "Recommended by" says creators earn a share and guests pay the same price.
- A "Share links" section on each creator's admin page, with Copy and WhatsApp. It shows a warning while the site address is still localhost.
- Creator payment statements show month, experience and amounts, without booking codes, exact dates or guest counts.

No-build work in this phase:

- Make the decisions in section 5.
- Draft a one-page creator agreement. It should cover:
  - the rate;
  - the credit rules and their limits;
  - a paid-link disclosure in every post;
  - no earning on their own bookings;
  - payout timing;
  - recommending only experiences they've actually done;
  - no WhatsApp broadcasts to people who haven't agreed to receive them.
- Answer "own domain" with forwarding: the creator sets a 301 redirect over HTTPS at their registrar (not "masked" forwarding) to their Truth page. They can use this once Truth is live.
- Run creators by hand:
  - admins edit pages and picks;
  - statements go out monthly on WhatsApp;
  - the creator filter on admin Bookings shows who actually brings bookings.

**When to start Phase 1:** now, or together with launch preparation. Don't give links to real creators until the production domain is live.

**Phase 2: after launch, with real creators. About 2–3 build days and 1 migration.**

What it delivers:

- Creators sign in with the same Google or email-link login as customers.
- They see a read-only Creator dashboard at `/account/creator`, showing:
  - their page link and share %;
  - their share links;
  - earnings by month and experience;
  - payments received.
- Admins add and remove creator logins.
- One account can be customer, creator and admin at the same time.

What it needs first:

- Truth live on its own domain, with Supabase's Site URL and `NEXT_PUBLIC_SITE_URL` set to it.
- The Google sign-in client, or the email service.
- The creator agreement.
- The privacy notice and booking terms from the launch list.

**When to start Phase 2:** when 3 real creators have signed, or when a creator who is bringing bookings wants to see their numbers more often than the monthly statement shows them. Whichever comes first.

**Phase 3: only if demand proves it.**

| Piece                                                                                                           | Start when                                                                                             |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Creators edit their own text and picks, through database functions (published instantly or after your approval) | They ask for changes about once a week                                                                 |
| Creator codes that guests type at checkout                                                                      | Creators sell mainly through video or WhatsApp and report missed credit                                |
| Guides with tips (option E). Guide data must also refresh when an experience changes, so prices stay current    | A region has 4 or more bookable experiences and a creator wants to write one                           |
| Host logins (same membership pattern as creators)                                                               | Hosts ask to see their bookings or block dates                                                         |
| A creator's own domain served by Truth (option C, set up by hand)                                               | A named creator or partner with real traffic commits to it, and protection against framing is in place |

Not planned: Truth subdomains, logins shared across domains, and checkout on any domain other than Truth's.

**Where the reviews disagreed, and how it's settled:**

- **When to build creator logins.** The business review said wait for 3–5 creators who bring bookings. The other two said start with the first creator. Settled: Phase 2 starts at 3 signed creators, or at the first creator with bookings who wants their numbers. Monthly statements cover trust until then.
- **The /@handle address.** The trust review wanted the address fixed early, the business review called it cosmetic, and the technical review found it unproven. Settled: keep `/creators/<name>` (decision 4).
- **Share links before the real domain exists.** The business review said wait, the others said build. Settled: build the admin list now so you can test and demo it, with a localhost warning. No QR codes, and no links handed out until launch.
- **What creators see.** Option A showed dates and guest counts, option D showed booking codes, and the trust and technical reviews wanted month-level only. Settled: month-level lines, with the status worked out in the database. This applies to statements now.
- **The disclosure line.** Only the trust review raised it, but the gap is real: there is no disclosure on the creator page or the chips today (verified). It's in Phase 1, and the privacy notice and terms stay on the launch list.
- **Guides (option E).** Scored 4, 5 and 7. Settled: Phase 3, and only where there are enough experiences. With 14 experiences across about five regions, most guides wouldn't fill up.
- **A database guard on `creators`.** The technical review proposed it. Accepted, as part of the Phase 2 migration.

#### 4. Phase 1 build plan

##### 4.1 Changes, in order

1. **Read `?via=` safely.**
   - In `src/lib/creator-credit.ts`, add `creatorFromSearch(search: string): string | null`.
   - It reads `via`, trims it and makes it lower-case. It rejects anything longer than 80 characters or that fails the existing `SLUG` pattern.
   - Update the comment at the top of the file.
2. **Catch it on every public page.**
   - Add a new client component, `src/components/site/capture-via.tsx`. Inside a `useEffect` it calls `creatorFromSearch(window.location.search)`, then `rememberCreator(via)`.
   - Mount it once in `src/app/(site)/layout.tsx`, beside `<SiteFooter />`.
   - It leaves `?via=` in the address on purpose, so "Open in Safari" from Instagram or TikTok keeps the credit. Canonical tags already drop the query string (experience page L48, creator page L31).
   - Reading `location` inside an effect, rather than `useSearchParams`, keeps every page prerendered.
3. **Fall back to the link at Reserve.**
   - In `src/components/booking/booking-widget.tsx` L55, change the creator lookup to `creditedCreator() ?? creatorFromSearch(window.location.search)`.
   - It still runs only after a time is chosen, so there's no hydration mismatch. The phone booking sheet uses the same widget.
4. **Only outside visits earn credit (if you pick decision 1's default).**
   - `src/components/site/remember-creator.tsx` credits a creator only when their page is where the visit started.
   - It compares `location.pathname` with the page's first browser navigation entry (`performance.getEntriesByType('navigation')`), through a pure helper `isLandingPage()` in `creator-credit.ts`.
   - Browsers without that API keep today's behaviour.
5. **Disclosure line.**
   - Add a shared server component, `src/components/site/creator-disclosure.tsx`: one sentence, in your wording.
   - Place it under the picks heading in `src/app/(site)/creators/[slug]/page.tsx`.
   - Also place it under the chips in `TitleBlock` in `src/app/(site)/experiences/[id]/page.tsx` (L215-236).
6. **Share links in admin.**
   - Add a pure module, `src/lib/share-links.ts`, with tests. It builds full links from `publicEnv.NEXT_PUBLIC_SITE_URL`:
     - the creator page (`/creators/<slug>`);
     - each live pick (`/experiences/<id>?via=<slug>`);
     - a `https://wa.me/?text=…` link with a ready-written message.
   - Add a client component, `src/components/admin/share-links.tsx`, with Copy (Clipboard API, showing "Copied") and WhatsApp on each row. It's kept generic so the Phase 2 dashboard can reuse it.
   - Add `<Section title="Share links">` to `src/app/admin/(console)/creators/[id]/page.tsx`. It uses data the page already loads: `creator.slug`, `creator.experienceIds`, and `listExperienceOptions()` filtered to `isActive`.
   - While the site address is localhost, the section says the links only work on this computer.
   - No QR codes yet. They need a new dependency, and printed codes must use the final domain.
7. **Creator-safe statements.**
   - In `src/app/admin/(console)/payment-history/[id]/page.tsx`, when `payout.recipient === 'creator'`, show the session month instead of the date, and drop the Booking code and Guests columns.
   - Host statements stay as they are.
   - Add `formatMonth()` to `src/lib/payouts.ts`, with a test.
8. **Documentation.** Record the credit rules and `?via=` in `docs/PROGRESS.md` and `AGENTS.md`.

Unchanged: `src/proxy.ts`, sign-in, Supabase Auth settings, Paystack, `create_booking`, the earnings trigger and the sitemap.

##### 4.2 Database

There is no migration in Phase 1. The Phase 2 migration is described in 4.7.

##### 4.3 How credit and checkout work after Phase 1

1. A guest arrives on the creator's page from their bio link, or on any Truth page with `?via=<name>`.
2. The browser stores `truth-creator` for 30 days. The last creator wins. On iPhones it can be deleted after 7 days of Safari use without a visit to Truth.
3. The guest chooses a time. The Reserve link carries `creator=<name>`, taken from storage, or from the address if storage is blocked.
4. The book page puts it in a hidden field.
   - `createBooking` checks it with Zod.
   - `create_booking` credits the creator only if they recommend that experience. This step is unchanged.
5. Checkout is Paystack on Truth's domain. Guest checkout stays, and the guest pays the same price whether or not a creator sent them.
6. When the booking is paid, the existing trigger records the creator's earning, due the day after the session. Admins record payouts, and the creator gets a statement (in Phase 2, they see it on their dashboard).

##### 4.4 How roles live together

Each person has one account per email address. An email-link sign-in reuses the existing account for that address, and Supabase automatically links a Google sign-in to the account with the same verified email. Roles are rows in the database, checked on every request, so removing a role takes effect on the next page load. Signing out ends every role at once.

| Role     | How Truth recognises it                                                                                                      | What it unlocks                                                                                                | When                |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------- |
| Guest    | No account                                                                                                                   | Browse, book, pay. Credit is stored on the device                                                              | Today               |
| Customer | Any signed-in account                                                                                                        | My bookings (guest bookings with the same verified email are claimed automatically), and Saved on every device | Today               |
| Creator  | Same account, plus a claimed `creator_members` row. The email is entered by an admin and confirmed when the creator signs in | Creator dashboard at `/account/creator`. Signing up alone never makes someone a creator                        | Phase 2             |
| Admin    | Same account, plus a `public.admins` row and the authenticator step (aal2)                                                   | The admin console                                                                                              | Today               |
| Host     | Same account, plus a `host_members` row of the same shape                                                                    | A host dashboard                                                                                               | Later, if hosts ask |

##### 4.5 What the owner sets up

- Approve the disclosure wording and the creator statement layout.
- Make the decisions in section 5.
- Run one Paystack test booking through a share link.
- Nothing changes in Vercel, DNS, Supabase or Paystack settings.

##### 4.6 Verification

**Unit tests (Vitest):**

- `creatorFromSearch`: a valid name, upper case, bad characters, missing, and over 80 characters.
- `isLandingPage`.
- The share-link builder: full addresses, encoding, and the WhatsApp text.
- `formatMonth`.

**End-to-end tests:** a new `e2e/creator-credit.spec.ts`, run on desktop and phone, following `e2e/booking.spec.ts`.

1. Take the first pick's link from `/creators/sarah-johnson` and open it in a fresh page with `?via=sarah-johnson`.
   - `truth-creator` is stored.
   - Choose a time (on phones, tap "Check dates" first).
   - The Reserve link contains `creator=sarah-johnson`.
2. Repeat test 1 with a setup script that makes storage fail for the `truth-creator` key only. Reserve should still carry `creator=`.
3. If you pick decision 1's default:
   - Tapping a "Recommended by" chip on an experience page stores nothing.
   - Opening `/creators/sarah-johnson` directly does store the credit.
4. The disclosure line shows on the creator page and beside the chips.
5. The existing test suites still pass.

**Commands:** `pnpm check`, `pnpm build` (this also catches Cache Components mistakes) and `pnpm test:e2e`.

**Manual walkthrough (you, in the browser):**

1. Go to Admin, then Creators, then Zanele Eats, then Share links.
2. Open a pick's link in a private window and book it with Paystack in test mode.
3. Admin Bookings, filtered by Zanele Eats, shows the booking.
4. Payouts shows her earning as Upcoming.
5. Record and print a test payout. The statement shows months, with no booking codes or guest counts.
6. Undo the test payout.

##### 4.7 Ready-made design for Phase 2 (only built when its trigger is met)

**Migration** `supabase/migrations/<timestamp>_creator_accounts.sql`

- Additive and in one transaction. It ends with a check query. You paste it into the Supabase SQL editor, and then `pnpm db:types` is run.
- Run `supabase/audit/inspect-security.sql` before and after, because the original tables' policies aren't in the repo.

**Table `public.creator_members`: who may see a creator's dashboard.**

| Column                     | Rule                                                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `creator_id`               | Links to `creators`; the row is deleted with the creator                                                                 |
| `email`                    | Lower-case and trimmed, 3–254 characters. Unique, so one email belongs to one creator                                    |
| `user_id`                  | Links to `auth.users`; deleted with the account. Empty until the creator signs in. Unique, so one login sees one creator |
| `created_by`               | Defaults to the admin who added it                                                                                       |
| `created_at`, `claimed_at` | When the email was added, and when the creator first signed in                                                           |

Access rules for the table:

- Row-level security is on, and all access is revoked from anon and authenticated.
- Signed-in users are granted select, insert and delete, limited by one policy, "Admins manage creator members" (`is_admin()`), like the other admin tables.
- There is no member policy. Creators read only through the functions below.

**Functions.** All are security definer with `search_path = ''`, revoked from public and anon, and granted to signed-in users.

- `claim_my_creator_invites()`: a copy of `claim_my_bookings`. It only works for a confirmed email, and links the waiting row to the person signing in.
- `my_creator()`: returns the signed-in person's creator (id, name, slug) and their own share. The share column itself stays hidden from the public API.
- `creator_my_earnings()`: one row per earning, with:
  - the session month;
  - the experience title, from the booking's saved snapshot;
  - the booking value, rate and amount;
  - the status (upcoming, due, paid or cancelled), worked out in the database using today's South African date.

  It never returns booking ids or codes, exact dates, guest counts or any customer fields.

- `creator_my_payouts()`: paid date, amount, reference and number of bookings. It leaves out the admin note.

**Guard trigger on `creators`.**

- Before an update, it checks whether the change comes from a signed-in user through the API who isn't `is_admin()`. If so, it rejects any change to `slug` or `revenue_share_percentage`.
- This protects the money and address columns if a creator write path is ever added. The SQL editor and service role are unaffected.

**Check query.** Confirms that:

- anon can't read `creator_members`;
- anon can't run the functions;
- signed-in users still can't read `creators.revenue_share_percentage`.

**Optional (decision 3).** Replace `create_booking` with the same signature so that a signed-in booker linked to the credited creator earns no credit. This is the same approach `supabase/migrations/20261103090000_remove_service_fee.sql` used.

**App changes:**

- **Guard:** `src/lib/creator/guard.ts` adds `requireCreator()`, modelled on `src/lib/admin/guard.ts`.
  - It calls `getClaims()`. With no signed-in user, it calls `redirect('/signin?next=/account/creator')`.
  - It then calls `rpc('my_creator')`. If nothing comes back, the page shows the "not linked" state.
- **Dashboard page:** `src/app/(site)/account/creator/page.tsx`, with the same shape as `src/app/(site)/account/bookings/page.tsx` (site header, not indexed by search engines, no referrer, session read inside Suspense). It shows:
  - the creator's page link and share %;
  - `Stat` cards from `src/components/admin/report-parts.tsx` for earned this year, upcoming, due and paid;
  - the Phase 1 share links;
  - the earnings table and payments received;
  - a plain explanation of how credit works, including its limits;
  - a "not linked" state with a "Check again" button. Its server action, in a new `src/lib/actions/creator.ts`, runs the claim and refreshes the page.
- **Admin:** a "Creator sign-in" section on `src/app/admin/(console)/creators/[id]/page.tsx`.
  - Add an email, see each one as "waiting" or "linked on <date>", and remove it.
  - Copy a ready-written WhatsApp invite.
  - The list comes from `listCreatorLogins` in `src/lib/admin/people.ts`. The `addCreatorLogin` and `removeCreatorLogin` actions go in `src/lib/actions/admin-people.ts`. They check the email with Zod, and a duplicate shows "That email is already linked to a creator".
- **Sign-in:** add `rpc('claim_my_creator_invites')` after `claim_my_bookings` in `src/app/auth/confirm/route.ts` and `src/app/auth/callback/route.ts`.
  - `safeNext` already accepts `/account/creator`.
  - Check that the Supabase email template keeps `next`. If it doesn't, creators land on My bookings and use the menu link instead.
- **Menu:** `src/components/site/menu-button.tsx` calls `my_creator()` when a signed-in user opens the menu, and shows "Creator dashboard" if a row comes back. Public pages stay static.
- **Authenticator step:** not needed for a read-only dashboard. Require it before any screen where creators enter bank details.

**Phase 2 verification:**

- The check query returns false for every item, and the before-and-after `inspect-security.sql` output has been reviewed.
- End-to-end:
  - a signed-out visit to `/account/creator` redirects to `/signin?next=%2Faccount%2Fcreator`;
  - the page's HTML contains no private text (copy the loop in `e2e/admin.spec.ts`).
- Manual:
  1. Link your own team email to Zanele Eats. Supabase's default email does reach your team.
  2. Sign in, then book through her link on Paystack test mode.
  3. The earning shows as Upcoming, by month.
  4. Record a payout; the earning shows as Paid.
  5. Remove the link; on the next page load the dashboard shows "not linked".
  6. A second, unlinked account also sees "not linked".
  7. In the browser's network tab, no response contains guest names, emails or booking ids.

#### 5. Decisions the owner needs to make

1. **What earns a creator credit?**
   - Today, any visit to a creator's page counts, including a "Recommended by" tap inside Truth. The credit lasts 30 days, the last creator wins, and only experiences the creator recommends count.
   - **Recommended default, part (a):** only visits from outside Truth earn credit, meaning the creator's page as the first page of the visit, or a `?via=` link. This stops Truth paying creators for its own visitors. It also stops a chip tap taking credit away from the creator who actually sent the guest.
   - **Recommended default, part (b):** keep "recommended experiences only" for launch. It's already enforced and it ties pay to a genuine recommendation. Revisit it if creators complain, since Viator pays on any experience booked within 30 days.
2. **The creator offer: rate and payout.**
   - **Recommended default:**
     - Keep the per-creator percentage you set in admin. At 5%, a R240 booking earns the creator R12.
     - Pay monthly by EFT once at least R100 is due; smaller amounts roll over to the next month.
     - Send the statement on WhatsApp.
     - Review the rate after 3 months of real bookings.
   - For comparison, Viator pays 8% after the experience, monthly by bank with a $50 minimum, or weekly by PayPal.
3. **Can creators earn on their own bookings?**
   - **Recommended default:** no.
   - Put it in the agreement now.
   - In Phase 2, optionally block it automatically for signed-in bookings.
   - Bookings made at guest checkout with another email can't be blocked, so admins review unusual patterns.
4. **The public creator address.**
   - **Recommended default:** keep `truth.co.za/creators/<name>`. It works, it's the canonical address and it's in the sitemap.
   - Don't add `/@name`, which is unproven in Next 16.4.
   - If you want something shorter, a permanent redirect from `/c/<name>` is a small change.
   - Decide before any link is printed or shared. Names stay admin-only, because changing one breaks shared links and stored credit.
5. **What creators may see about bookings.**
   - **Recommended default:** for each booking, the month, the experience, the booking value, their share and the status.
   - Never names, emails, phone numbers, booking codes, exact dates or guest counts.
   - This applies to statements now and to the dashboard later. The privacy notice should name "the creator who referred you" as a recipient of anonymised booking details.

#### 6. Risks and how we handle them

| Risk                                                                                                                                                        | How we handle it                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Building before any real creator exists                                                                                                                     | Phase 1 is 1–2 sessions, and every later option reuses it. Phases 2 and 3 wait for their named triggers. The creator filter on admin Bookings is the signal for going ahead or not                                                                                                |
| Credit gets lost: Safari's 7-day storage wipe, in-app browsers, guests switching devices, last creator wins                                                 | `?via=` stays in links, and the booking falls back to the address. Creator wording says "up to 30 days, same device", and creators are told their numbers are a minimum. Creator codes come in Phase 3 if this becomes a real problem                                             |
| "Why didn't I get credit?" disputes                                                                                                                         | The agreement spells out the rules, and the Phase 2 dashboard explains them. Nothing records which link produced a booking (`bookings.creator_snapshot` is unused). Add that only if disputes become common, because it means replacing `create_booking`                          |
| Guest privacy (POPIA)                                                                                                                                       | Creators see month-level details only. Statements are fixed in Phase 1. The earnings function never returns guest fields, and this is checked in the network tab and in tests. This plan isn't legal advice                                                                       |
| Permission mistakes once creators have accounts                                                                                                             | Creators never write to tables directly and only read through checked functions. The guard trigger protects the slug and share. Run `inspect-security.sql` before and after, and end every migration with a check query                                                           |
| Advertising disclosure rules (Advertising Regulatory Board code, IAB SA toolkit)                                                                            | The disclosure line on Truth's pages (Phase 1), and an agreement that requires creators to disclose in every post                                                                                                                                                                 |
| Legal basics are missing: no privacy notice, booking terms or ECTA s43 supplier details, and it's undecided whether Truth is the seller or the hosts' agent | These belong on the launch list before creators are recruited publicly. A lawyer should confirm them. Creator-written text on Truth's domain is Truth's responsibility; the trust review says ECTA's hosting protections don't apply to Truth, which a lawyer should also confirm |
| Links shared before the real domain exists                                                                                                                  | The admin warning, no QR codes, and links handed out only after launch                                                                                                                                                                                                            |
| Domain forwarding set up badly                                                                                                                              | Recommend only a 301 redirect over HTTPS, never masked or framed forwarding. Add `frame-ancestors 'self'` during launch hardening, since other sites can show Truth inside a frame today                                                                                          |
| Creator sign-in is blocked until the email service or Google client exists                                                                                  | Both are already on the launch list. You can test with your own team email now                                                                                                                                                                                                    |
| The wrong email is linked (Phase 2)                                                                                                                         | Linking needs a verified email, the admin sees each email's status, and removing it takes effect on the next page load                                                                                                                                                            |
| Thin supply: 14 experiences across about five regions                                                                                                       | Recruit hosts in creators' areas of interest. Build guides only where there are enough experiences                                                                                                                                                                                |
| Your time: support, disputes and reviewing content                                                                                                          | Run things by hand first. Creator text stays admin-edited until Phase 3                                                                                                                                                                                                           |
| The market evidence is weak                                                                                                                                 | South African creator behaviour comes from opinion pieces and surveys run by vendors, and no study compares bookings on a creator's own domain with a platform's. The plan doesn't rely on those claims: each phase starts only when real demand shows up                         |

##### Critical Files for Implementation

- src/lib/creator-credit.ts
- src/components/booking/booking-widget.tsx
- src/app/(site)/layout.tsx
- src/app/admin/(console)/creators/[id]/page.tsx
- src/app/admin/(console)/payment-history/[id]/page.tsx

---

## 3. Research

### 3.1 Market: how comparable platforms do it

#### Research report: creator pages, logins and own domains (for Truth)

This is web research only. I read no repo files and changed nothing. Each fact is tagged by how much it can be trusted:

- **[S]** strong: an official or primary page.
- **[M]** moderate: reputable press, or an official page with no date.
- **[W]** weak: vendor or affiliate blogs, self-reported figures, or sources that conflict.

Pages with no date are marked "accessed 3 Nov 2026".

##### 1. How comparable platforms do it (facts)

| Platform                   | Where the creator page lives                                                                                                                                                                                                                                                                                                                                                                | Creator login and dashboard                                                                                                                                           | What creators earn                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Viator**                 | "Viator Shop" on viator.com, with Collections and one tracking link. The creator page shows the URL pattern viator.com/partner-shop/<name>. No custom domain, and no Shop widget yet.                                                                                                                                                                                                       | Yes. Link builder, widgets, "Performance Trends" report (can filter by Shop).                                                                                         | 8% on experiences booked within 30 days, paid after the experience happens. Paid monthly by bank ($50 minimum) or weekly by PayPal. **[S]** https://partnerresources.viator.com/creator/ (accessed); https://partnerresources.viator.com/blog/how-viator-shop-is-changing-the-link-share-game/ (6 Jun 2024); https://partnerresources.viator.com/viator-shop/                                                                                                                                   |
| **GetYourGuide**           | No storefront found. Links plus embeddable activity and city widgets; the booking finishes on getyourguide.com.                                                                                                                                                                                                                                                                             | Yes, a partner dashboard.                                                                                                                                             | About 8% base and a 31-day cookie **[W]** (directory listings; some regional networks list 5%). Has about 33,000 creators, bloggers and agents. Since Sept 2026 a beta gives creators a free booking for an honest review of a new listing; GYG's internal research says travellers are 3x more likely to book an activity with three reviews. **[M]** https://skift.com/2026/09/15/getyourguide-creator-reviews-new-listings/ (15 Sep 2026); https://support.ventrata.com/en/articles/11100406 |
| **Expedia**                | "Travel Shops" at expedia.com/shop/<handle> and in the app: bio, collections, shoppable video. Invite-only beta in 2024; later live in the US plus 11 markets.                                                                                                                                                                                                                              | Yes. Creator Hub, link builder, Performance Dashboard (payment history, link-level reports), payouts via Partnerize.                                                  | "Up to 4%" on qualifying transactions. **[S]** https://creator.expediagroup.com/ (accessed); BusinessWire 16 Sep 2024                                                                                                                                                                                                                                                                                                                                                                           |
| **Booking.com**            | No storefront. Links and banners; sign-up goes through networks such as CJ.                                                                                                                                                                                                                                                                                                                 | Through the network's dashboard.                                                                                                                                      | A share of Booking's own commission **[W]**. In May 2025 it cut "thousands" of smaller affiliates on 30 days' notice (links stopped earning 20 Jun 2025). It lists 17,500+ affiliates. **[M]** https://skift.com/2025/05/30/why-booking-com-cut-thousands-of-affiliate-partners-and-what-comes-next/                                                                                                                                                                                            |
| **Airbnb**                 | No creator storefront. The open "Associates" programme ran from 2020 and closed 31 Mar 2021 **[S]**. Today there is an application-only "Creators" track run through Impact, with pay set per campaign **[W]**. Experiences relaunched 13 May 2025; "Originals" are hosted by celebrities and creators (e.g. Megan Thee Stallion; Jamie Oliver chef's tables at about £150 a head) **[M]**. | Impact dashboard (Creators track) **[W]**                                                                                                                             | $50 for referring a new host who starts hosting. **[S]** https://www.cnbc.com/2021/03/01/airbnb-ends-affiliate-program-as-it-ramps-up-host-recruitment-campaign.html; https://www.airbnb.com/resources/hosting-homes/a/introducing-completely-reimagined-airbnb-experiences-742                                                                                                                                                                                                                 |
| **Thatch, now Mindtrip**   | Profile on the platform's own domain (mindtrip.ai/profile/<name>). Thatch let creators sell guides and keep 90% **[W]**. Mindtrip bought Thatch in March 2025 **[M]**.                                                                                                                                                                                                                      | Yes                                                                                                                                                                   | Tips, commission on Booking.com, Viator, Priceline and Mindtrip bookings, and guide sales. Paid by PayPal or Venmo about 3 months after the stay. **[S]** https://resources.mindtrip.ai/creators/creator-academy/how-to-earn-on-mindtrip.md                                                                                                                                                                                                                                                     |
| **Fora** (travel advisors) | foratravel.com/advisor/<name>: bio, "ask me about" tags, socials, photos.                                                                                                                                                                                                                                                                                                                   | Yes, "Portal". Fora says finding clients is advisors' most common challenge, and the profile is how new clients find and vet them.                                    | Advisor keeps 70% of supplier commission, 80% from $300k in bookings (re-earned yearly), 90% from $2M. Suppliers pay about 12% on average. Membership is $99 a quarter or $299 a year. 15,000 advisors, $1B valuation (Jul 2026). **[S/M]** https://www.foratravel.com/help/en/articles/14303041-how-commission-works-at-fora; https://skift.com/2026/07/16/fora-travel-the-unicorn-it-raised-60-million-at-a-1-billion-valuation/                                                              |
| **LTK**                    | shopltk.com/explore/<handle>. No custom domain.                                                                                                                                                                                                                                                                                                                                             | Yes, the LTK Creator app.                                                                                                                                             | Brands set the commission, typically 10–30% **[W]**. About $5–6B a year in retail sales and about 40M monthly users (company figures, which vary). Started in 2011 as affiliate links on bloggers' own blogs; the shopper app came in 2017. **[M]**                                                                                                                                                                                                                                             |
| **ShopMy**                 | shopmy.us/shop/<username>, with sections and collections. Shoppers need no account.                                                                                                                                                                                                                                                                                                         | Yes                                                                                                                                                                   | Brands set 10–30% **[S]** https://shopmy.helpkit.so. Possibly an 82/18 split with ShopMy **[W]**. $1.5B valuation (Oct 2025).                                                                                                                                                                                                                                                                                                                                                                   |
| **Amazon Influencer**      | amazon.com/shop/<handle>                                                                                                                                                                                                                                                                                                                                                                    | Yes. Reports are product-level (orders, items, earnings) with no buyer identity listed. **[S]** https://affiliate-program.amazon.com/help/node/topic/GCDWWRFEMW3Q2TE2 | Rates by category. Cut on 21 Apr 2020 (furniture 8% to 3%, grocery 5% to 1%) **[S]** https://www.cnbc.com/2020/04/14/amazon-slashes-commission-rates-for-affiliate-program.html. Rates changed again 2 Jun 2025 **[W]**.                                                                                                                                                                                                                                                                        |
| **Stan Store**             | stan.store/<username>. **No custom domain**; the help centre says to forward a domain you own. **[S]** https://help.stan.store/article/151-can-i-create-a-custom-domain-for-my-stan-store                                                                                                                                                                                                   | Yes                                                                                                                                                                   | The creator sells their own products.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Linktree**               | linktr.ee/<username>. **No custom domain.** **[S]** https://linktr.ee/help/articles/6571689-can-i-change-the-linktree-url-to-a-custom-domain                                                                                                                                                                                                                                                | Analytics                                                                                                                                                             | Not applicable (it is a link tool).                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Beacons**                | beacons.ai/<username>. Custom domain on the $10/month plan. **[S]** https://home.beacons.ai/blog/get-your-custom-domain-through-beacons                                                                                                                                                                                                                                                     | Yes                                                                                                                                                                   | The creator sells their own products.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Shopify Collabs**        | No storefront; each brand gives the creator a link and a discount code. Shopify's own creator link page, Linkpop, stopped sign-ups 11 Jun 2025 and shut 7 Jul 2025. **[M/W]** https://taplink.at/en/blog/linkpop-over.html                                                                                                                                                                  | Collabs app                                                                                                                                                           | Brands set the commission.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Substack**               | Custom domain for a one-time $50 **[S]** https://on.substack.com/p/new-add-a-custom-domain-to-your-substack. Only 16.0% of 38,746 publications use one (19 Oct 2026) **[M]** https://www.helpareporter.com/news-releases/the-state-of-substack-for-pr                                                                                                                                       | Yes                                                                                                                                                                   | The creator sells their own product.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Kajabi**                 | Custom domain included on paid plans. **[S]** help.kajabi.com                                                                                                                                                                                                                                                                                                                               | Yes                                                                                                                                                                   | The creator sells their own products.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **TikTok GO**              | Inside TikTok: users book hotels and tours in the app (US, around May 2026). Partners: Booking.com, Expedia, Viator, GYG, Tiqets, Trip.com. Began Aug 2025 as invite-only creator tasks.                                                                                                                                                                                                    | Creator tools                                                                                                                                                         | Commission not disclosed. **[M]** https://hellopartner.com/2026/05/28/tiktoks-new-feature-lets-users-book-trips-straight-from-creator-videos/                                                                                                                                                                                                                                                                                                                                                   |
| **TrovaTrip**              | Group trips hosted by creators.                                                                                                                                                                                                                                                                                                                                                             | Yes                                                                                                                                                                   | Hosts average about $6–7k per trip, about 20%+ of trip revenue; TrovaTrip takes about 15–20% (self-reported). https://trovatrip.com/blog/host-income-trovatrip                                                                                                                                                                                                                                                                                                                                  |

**The pattern (fact):**

- Every affiliate or curation programme I found keeps creator pages on its own domain and gives creators a login with links, collections, performance and payouts.
- Custom domains appear only where the creator is the merchant selling their own products (Kajabi, Substack, Beacons). Even there, uptake is a minority: 16% on Substack.
- The two biggest creator link and store tools, Linktree and Stan, offer no custom domain at all. Both tell creators to forward a domain they own to their page.

##### 2. What creators value and what converts

**Facts**

- **Travel creators**, from a Stay22 / Travel Massive survey of 500+ creators in 56 countries **[W]**: the summary is by a blog that earns Stay22 referral income, and the sample leans toward bloggers. https://world-travellers.com/digital-nomads/stay22-research-2026-travel-creators-earn/ (17 Aug 2026)
  - 61% say affiliate sales are their main income.
  - 93% use Instagram and **85% have their own website**.
  - Of those using affiliate networks, 90% use Stay22 and 60% GetYourGuide.
  - Top frustration: no payment, or not enough.
- **Platform risk and income**, from Kajabi's survey of 1,717 creators (Dec 2024–Jan 2025, run by a vendor):
  - Fear of platform volatility doubled.
  - Affiliate income fell 36%, brand deals 52% and platform payouts 33%.
  - 33% were hurt by algorithm changes.
  - https://www.netinfluencer.com/creator-commerce-rises-as-platform-dependency-declines-kajabi-report-shows/
- **Link-in-bio habits:** Linktree holds about 80% of Instagram link-in-bio users. That comes from analysing 100M Instagram profiles, of which about 31M have a link-in-bio and 53% are creators. https://influencers.club/blog/state-of-the-link-in-bio-market/ (19 Nov 2024) **[M]**. In practice creators are happy to put a platform URL in their bio.
- **Trust at checkout**, from Baymard (updated 22 Sep 2025) **[S]**: https://baymard.com/lists/cart-abandonment-rate
  - 19% of abandonments are because shoppers "didn't trust the site with my credit card information".
  - **18% are because the site forced them to create an account.**
- **Known site vs unknown site:** an academic study found people trust a well-known website more at first sight, and that reviews mattered only on the unknown site. https://iastatedigitalpress.com/itaa/article/1984/galley/1857/view **[M]**
- **Gap:** I found no study that directly compares conversion on a platform's domain with conversion on a creator's own domain. Vendor claims that branded links get 34–39% more clicks (Rebrandly) could not be verified **[W]**.
- **Creators sell travel:** 43% of travellers booked a trip or activity after a viral post (TUI Musement/Appinio, Jan 2026, Spain, Italy and UK; sample size not given) **[M]**. https://www.euronews.com/travel/2026/08/21/i-saw-it-on-tiktok-48-of-gen-z-travellers-turn-to-the-platform-for-travel-inspiration
- **Why creators leave programmes:** sudden changes, as shown by these events:
  - Amazon's rate cuts (2020).
  - Airbnb closing its programme after less than a year (2021).
  - Booking.com's cut on 30 days' notice (2025).
  - Linkpop shutting (2025).
  - Thatch being absorbed by Mindtrip (2025).

  Slow payouts (Mindtrip pays about 3 months after the stay) and falling income are the other drivers.

##### 3. South Africa specifics

**Facts**

- **Audience**, from DataReportal Digital 2026 (Oct 2025 data) **[S]** https://datareportal.com/reports/digital-2026-south-africa:
  - 51.7M internet users (79.6%) and 29.1M social media users.
  - Ad reach: TikTok 29.1M adults (64.8% of over-18s), Facebook 27.9M, YouTube 26.9M, but **Instagram only 8.6M**.
- **How creators earn and how sales happen**, from an opinion piece citing Humanz and Snippet **[M/W]** https://reframed.co/south-africas-influencer-economy-is-growing-on-the-wrong-metrics/ (25 May 2026):
  - SA creators earn almost entirely from brand deals.
  - Most local conversion happens offline or through channels brands can't track, such as WhatsApp.
  - Estimated market size is about US$280M, growing 26% a year.
- **Brands**, from IAB SA (17 Apr 2025): only 52% of brands have a dedicated influencer budget, and SA leans on engagement metrics rather than return on investment. https://www.bizcommunity.com/article/iab-sa-6-key-trends-impacting-influencer-marketing-706052a
- **Africa-wide** (Communiqué/TM Global report, Jan 2026): brand deals dominate in SA and Nigeria, and YouTube pays African creators under $1 per 1,000 views. https://techcabal.com/2026/02/05/africa-creator-economy-report/ **[M]**
- **Shoppable video isn't available locally:** TikTok Shop and Creator Rewards are not live in SA **[W]**, and TikTok GO is US-only.
- **Travel affiliate options for SA creators** are mostly foreign and pay in dollars or euros: Viator 8%, GetYourGuide about 8%, Booking.com via CJ. Travelstart's terms conflict ("up to 25%" vs $6–8 per sale) **[W]**. SafariNow doesn't publish a rate. I found no programme for LekkeSlaap or Dirty Boots. This suggests nobody offers a local, rand-paying affiliate programme for experiences, but the evidence is weak.
- **Getting paid from abroad:** PayPal can now withdraw to any SA bank, but FNB charges 0.81–1.51% and exchange control requires withdrawal within 30 days. https://fnb.co.za/forex/payments/paypal.html
- **Disclosure rules:** the IAB SA Disclosure Toolkit 2026 says affiliate links and discount codes are a "material connection" that must be disclosed clearly (https://iabsa.net/wp-content/uploads/2022/03/Influencer-Marketing-Disclosure-Tool-Kit-2026-1.pdf). The Advertising Regulatory Board ruled against SAB over an undisclosed post (29 Jul 2026, https://www.ewn.co.za/2026/07/29/regulator-cracks-down-on-ambiguous-influencer-posts-with-ruling-against-sab).
- **Fraud**, from SABRIC: card fraud rose 18% to R1.75bn in 2025, and "card-not-present" (online) fraud was 85.6% of credit-card fraud losses in 2024. https://www.sabric.co.za/?p=4450 **[M]**
- **POPIA (privacy law)** **[S]**:
  - Section 11(1) lists the lawful grounds for processing: consent, a contract, legal duty, the person's own interest, public duty, or the legitimate interest of the business or of "a third party to whom the information is supplied". https://popia.co.za/section-11-consent-justification-and-objection/
  - Section 18(1): people must be told the "recipient or category of recipients" of their information.
  - Section 6(1)(b): information that can't be re-identified falls outside the Act.
  - Section 69: direct marketing by electronic means needs consent. The Information Regulator's Guidance Note (Dec 2024, not binding) treats phone calls as electronic communication. https://www.cliffedekkerhofmeyr.com/en/news/publications/2025/Sectors/Technology-Communications/Technology-and-Communications-Alert-29-january-Navigating-the-Information-Regulators-guidance-note-on-direct-marketing
  - A creator who uses customer data for their own purposes counts as a "responsible party" with full POPIA duties, not an "operator" acting for Truth.
- **What a creator dashboard can show (my reading, not legal advice):**
  - Safe: page views, clicks, number of bookings, which experience, booking month, value or commission, and payout status. Avoid detail so fine that a creator could guess who a booking was.
  - Not safe without a specific opt-in from the guest: names, emails or phone numbers.
  - If creators may contact guests, the guest must opt in explicitly ("share my details with Zanele Eats"), and the creator then needs a written agreement and section 69 consent before marketing.
  - This matches the industry norm: Amazon's reports are product-level only.

##### 4. Out-of-the-box models Truth could borrow (facts, then fit)

- **Booking cards on the creator's own site:** Viator and GetYourGuide offer widgets, and FareHarbor's "Lightframe" opens checkout over the operator's page. In all three, the checkout stays on the platform, so attribution and trust are kept. It fits bloggers (85% have their own site) but suits SA's social-first creators less.
- **Creator's domain forwards to their Truth page:** this is what Stan and Linktree officially recommend. The creator owns zaneleeats.co.za and it lands on Truth's page, so the 30-day credit still works because the visitor arrives on Truth's own origin.
- **Creator codes instead of links:** practitioners agree codes work where links can't (spoken in video, WhatsApp, offline). The risk is codes leaking to coupon sites. **[W]** https://influencermarketinghub.com/coupon-codes-vs-tracking-links/. Strong fit with SA's WhatsApp and offline conversion.
- **Creator-hosted or co-hosted experiences and trips:** Airbnb Originals (2025), TrovaTrip (hosts earn about $6–7k per trip), and StubHub's claim that creator-tour ticket sales grew nearly 500% year on year, average ticket $99 (company claim, Aug 2025) **[W]** https://newsroom.stubhub.com/2025/08/11/the-creator-circuit-why-stubhub-is-the-best-place-to-buy-tickets-to-creator-tours/
- **"Creator-tested" reviews:** GetYourGuide's 2026 beta (free booking for an honest review) helps new listings get their first reviews. It must be disclosed under SA rules.
- **Collections:** Viator Shop, Expedia and ShopMy all organise picks into themed collections. A caution on "following" people: Google Maps removed following contributors in September 2025. https://support.google.com/maps/answer/9603499
- **Creator-branded mini-sites:**
  - InteleTravel gives agents personal booking sites but is described as a hybrid host agency / MLM with BBB complaints, a reputational warning.
  - Etsy launched "Pattern" own-domain seller sites in 2016 at $15/month; seller forum threads suggest it was neglected **[W]**.

##### 5. When to invest in creator self-service (facts from history, then opinion)

**Facts**

- Platform-hosted creator storefronts arrived years after the link programmes, once scale existed:
  - Amazon: affiliate links from 1996, influencer storefronts in 2017.
  - LTK: links on bloggers' own blogs from 2011, shopper app 2017, creator shops around 2021.
  - Viator: Viator Shop only in 2024.
  - Expedia: Travel Shops in 2024, invite-only at first.
- GetYourGuide has about 33,000 creator partners and still has no storefront.
- None of these big programmes host creator pages on the creator's own domain.

**Opinion**

- Paul Graham's "do things that don't scale" (2013, https://paulgraham.com/ds.html) and Lenny Rachitsky's marketplace series both point the same way: with zero real creators, recruit by hand and run things for them first, not self-service.
- Build creator logins once there are real creators who keep asking for changes.
- Treat custom domains as optional, low value, and later.

##### 6. Design implications for Truth (opinion)

- **Is it worth it?**
  - A creator login with an earnings view: yes, eventually. It is standard in every programme, but should wait for about 5–10 active real creators. Until then, admins keep running pages, picks arrive by WhatsApp, and statements go out monthly.
  - Full own-domain creator sites: not now. They add hard problems:
    - Customer login sessions don't carry across domains.
    - Supabase sign-in needs each domain allow-listed (wildcards only work for subdomains).
    - The 30-day credit in browser storage is per-domain, so it needs a hand-off through the link URL.
    - A second checkout domain weakens trust in a high-fraud market.
  - The technology itself isn't the blocker: Vercel Pro has no practical domain limit (soft limit of 100,000 per project). https://vercel.com/docs/multi-tenant/limits
- **Options in order of value for cost:**
  1. Truth-hosted creator page plus creator login.
  2. A short vanity URL, plus instructions for forwarding the creator's own domain to it.
  3. Creator codes for WhatsApp and TikTok.
  4. Creator-hosted or co-hosted experiences and "creator-tested" reviews.
  5. Embeddable booking cards for creators who have blogs.
  6. Creator subdomains (e.g. zanele.truth.co.za).
  7. Full custom domains, only if a top creator asks and the volume justifies it.
- **Customers:** keep guest checkout (18% of shoppers abandon when forced to create an account). Treat "follow a creator" as something to test, not build up front.
- **Selling point:** paying creators in rands to a local bank, with fast and predictable payouts, may matter more to SA creators than any domain feature.

##### 7. Weak evidence and gaps

- No direct study comparing a platform domain with a creator's own domain at checkout.
- Most commission figures for GetYourGuide, LTK and the SA programmes come from third-party directories.
- The SA market-size figures have no stated method.
- The Stay22 survey summary has affiliate bias.
- The 2025 Humanz SA report is behind a sign-up gate and was not read.
- Viator's /partner-shop/ URL pattern comes from a page summary and was not confirmed by a second source.
- Airbnb's current Creators track is described only by a third party.

### 3.2 Technology: domains, logins, payments and law

#### Research: creator pages on subdomains or creators' own domains, and logins across domains (read-only)

**Short answer:** It can be done on the planned stack, and Vercel charges nothing per domain on its Pro plan. Truth needs Pro anyway because it takes payments. Three things are the real problem:

- Login sessions cannot be shared with a domain Truth doesn't own.
- Today's creator credit lives in browser storage, which never crosses domains.
- Every creator who connects a domain has to edit DNS settings, and that creates support work.

Recommendation (my opinion): keep sign-in, saved experiences, bookings and checkout on Truth's main domain whatever happens. A creator's own domain should only show their page.

##### 1. What the Next 16 docs in the project say (facts)

- **`multi-tenant.md`:** one sentence. It points to Vercel's Platforms Starter Kit (https://vercel.com/templates/next.js/platforms-starter-kit) as "our recommended architecture" and says nothing else. The kit's README describes a Next 16 app with `proxy.ts`, tenants on subdomains and an admin at `/admin`. Its `proxy.ts` rewrites `/` on a tenant subdomain to `/s/{subdomain}` (https://github.com/vercel/platforms).
- **`multi-zones.md`:** this is about splitting one domain into several apps by path, not about tenants by hostname.
  - It recommends routing with `rewrites` (lower latency) and keeping proxy for dynamic decisions.
  - Links that cross into another zone should use a plain `<a>`, not `<Link>`.
  - Server Actions need `experimental.serverActions.allowedOrigins` for the domain the user sees.
- **`16-proxy.md`:**
  - Middleware is renamed Proxy in v16.
  - Only one `proxy.ts` is allowed per project.
  - Proxy "is _not_ intended for slow data fetching" and "should not be used as a full session management or authorization solution".
  - `fetch` cache, revalidate and tag options have no effect inside proxy.
- **`03-file-conventions/proxy.md`:**
  - Proxy runs on the Node.js runtime by default, and the `runtime` option is not allowed.
  - It passes information to the app through headers, cookies, rewrites, redirects or the URL.
  - Order of execution: config headers → config redirects → Proxy → `beforeFiles` rewrites → files → `afterFiles` → dynamic routes → `fallback`.
  - Server Functions are POSTs to their page's route, so a matcher that excludes a path also skips them. The doc says to check auth inside each Server Function.
  - The proxy matcher's `has`/`missing` options cover headers, query and cookies (host is not listed).
- **Hostname routing without proxy code:** `next.config` `rewrites`, `redirects` and `headers` accept `has: [{ type: 'host', value: ... }]`. Named regex captures can be used in the destination. So `(?<slug>[a-z0-9-]+)\.truth\.co\.za` → `/creators/:slug` is a static, config-only option (`rewrites.md`).
- **Server Actions (`serverActions.md`):** Next compares the `Origin` host with `x-forwarded-host`/`host`, so same-origin calls on a custom domain pass. `allowedOrigins` accepts `*.domain` wildcards but is a fixed list in config. A creator domain posting to Truth's main domain would be rejected.
- **Local development:** the dev server already allows `localhost` and its subdomains, so `zanele.localhost:3000` works (`allowedDevOrigins.md`).

##### 2. Code in this project that shapes the design (facts)

- `src\lib\actions\auth.ts`: the email link and Google sign-in both return to `NEXT_PUBLIC_SITE_URL`.
- `src\app\auth\confirm\route.ts`: email links verify with `verifyOtp(token_hash)`, so they work on any host. A comment notes the email template uses `{{ .SiteURL }}`.
- `src\app\auth\callback\route.ts`: Google sign-in uses `exchangeCodeForSession`. That needs a security cookie (the PKCE verifier) set on the host where sign-in started. If sign-in started on a creator's domain and returned to the main domain, it would fail.
- `src\lib\safe-next.ts`: after sign-in, only relative paths are allowed, so it cannot send people back to a creator's domain.
- `src\lib\actions\payment.ts:48`: the Paystack `callbackUrl` is fixed to the main domain.
- `src\app\(site)\creators\[slug]\page.tsx:31`: the canonical tag is `/creators/{slug}`, resolved against `metadataBase`, which is the main domain (`src/app/layout.tsx:21`). A copy of the page served on another host would therefore canonicalise to the main domain.
- `src\lib\creator-credit.ts`: credit is stored in `localStorage`. Browser storage is "separated by origin", and `news.company.com` and `store.company.com` count as different origins (https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). So credit does not even cross subdomains.
- `@supabase/ssr` 0.12.7 (2026-09-08) is installed. `createBrowserClient` and `createServerClient` both accept `cookieOptions`, including `domain`. It also ships `clearAuthCookiesAtScopes`, whose notes say `signOut` clears the old single-host cookie automatically once `cookieOptions.domain` is set.

##### 3. Web research (facts, with sources and dates)

**Vercel**

- **Adding domains from code:**
  - Calls: `projects.addProjectDomain`, then `verifyProjectDomain`, `getProjectDomain` and `removeProjectDomain`.
  - `GET /v6/domains/{domain}/config` returns `misconfigured`, `recommendedIPv4`, `recommendedCNAME` and `configuredBy`.
  - Rate limits per team: 100 domain additions per hour, 50 verifications per hour.
  - Sources: https://vercel.com/docs/platforms/multi-tenant-platforms/reference (2026-09-03), https://vercel.com/docs/platforms/multi-tenant-platforms/limits (2026-09-08), https://vercel.com/docs/rest-api/domains/get-a-domain-s-configuration (2026-11-03).
- **DNS records a domain owner adds:**
  - Apex domain (`example.co.za`): an A record, 76.76.21.21 or whatever value the domain card shows (for example 216.198.79.1). Remove any AAAA records.
  - Subdomain (`book.example.co.za`): a CNAME to a value unique to the project, for example `d1d4fc829fe7bc7c.vercel-dns-017.com`.
  - Domain already used on another Vercel account: a TXT record at `_vercel.<apex>`.
  - Sources: https://vercel.com/docs/domains/working-with-domains/add-a-domain (2026-09-16), https://vercel.com/kb/guide/a-record-and-caa-with-vercel (updated 2026-11-02).
- **Certificates:** Let's Encrypt, issued and renewed automatically. A wildcard gets one certificate covering one subdomain level. Each custom domain gets its own certificate once DNS points to Vercel. A CAA record that doesn't allow Let's Encrypt blocks issuance (concepts page, 2026-08-20).
- **Wildcard subdomains (`*.truth.co.za`):** need Vercel's nameservers (`ns1/ns2.vercel-dns.com`). The alternative is to delegate `_acme-challenge` to Vercel with NS records plus a wildcard CNAME to `cname.vercel-dns-0.com` (add-a-domain page).
- **Apex and www:** add both, then set one to redirect to the other. For duplicate content, use a canonical tag or a redirect (https://vercel.com/docs/platforms/multi-tenant-platforms/configuring-domains, 2026-09-16).
- **Separate tenants' cookies (Public Suffix List):** Vercel suggests submitting the shared domain to the PSL "if tenants can publish content or run code" on subdomains. Doing so stops cookies being shared across subdomains, which would break a shared login.
- **Plans and price:**
  - Hobby is "non-commercial personal use only". "Any method of requesting or processing payment" counts as commercial (https://vercel.com/docs/limits/fair-use-guidelines, 2026-09-14), so Truth needs Pro.
  - Pro: $20 a month platform fee, including 1 deploying seat and $20 of usage credit. Extra seats are $20 each (https://vercel.com/docs/plans/pro-plan, 2026-09-15).
  - Domains per project: 50 on Hobby. Pro is unlimited with a soft limit of 100,000. Custom domains have "no additional cost".
  - Previews per tenant are Enterprise only.
  - Webhooks for domain events are listed as Enterprise only.
- **Vercel can't sell .co.za:** it is not on Vercel's purchase list, which has `.za.com` only (https://vercel.com/docs/domains/supported-domains, 2026-08-26). Using a .co.za with Vercel DNS still works by changing nameservers at the SA registrar.
- **Ready-made pieces:**
  - Vercel's "Custom Domain" block (`npx @vercel/platforms@latest add custom-domain`, or the shadcn registry): DNS table, status checked every 20 seconds, copy buttons (https://vercel.com/docs/platforms/platform-elements/blocks/custom-domain, 2026-09-03).
  - Global Config (formerly Edge Config) for fast host lookups: $3 per million reads (renamed in the changelog of 2026-07-29).
- **Vercel's sample proxy code:** passes tenant context through request headers that are set by the proxy and cleared of anything the browser sent, then read with `headers()` (https://vercel.com/docs/platforms/multi-tenant-platforms/proxy-and-routing, 2026-08-10). `headers()` stops prerendering, so for Truth a rewrite to the static `/creators/[slug]` page is better.
- **Custom subpaths** (for example `creator.com/trips` served by Truth): this needs the creator's own host to run reverse-proxy rewrites plus an `assetPrefix` (https://vercel.com/docs/platforms/multi-tenant-platforms/custom-subpaths, 2026-06-26).

**Alternatives**

- **Cloudflare for SaaS** (https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/, 2026-08-14):
  - 100 hostnames included on Free, Pro and Business, then $0.10 each per month.
  - Maximum 50,000 hostnames on those plans.
  - Wildcard custom hostnames and custom certificates are Enterprise only. Apex proxying is an Enterprise paid add-on.
  - The customer adds a CNAME to the provider's target. Apex domains are unsupported by default (getting-started page, 2026-06-19).
- **Putting Cloudflare in front of Vercel:** Vercel recommends connecting directly. A proxy in front means a separate cache that isn't cleared on deploy, broken Bot Protection, and changed client IP and geo data (https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment, 2026-10-19).
- **Approximated:** about $0.20 per domain per month; the figures conflict (https://approximated.app/pricing/).
- **Entri** (automatic DNS setup, used by Beacons): from $249 a month; the figures conflict (https://entri.com/pricing).

**What a creator must do, and what goes wrong**

- What they do: log in to their registrar and add 1–2 records. Sometimes also a TXT record and a CAA fix. Then wait minutes to 48 hours.
- Documented failures:
  - Conflicting A, AAAA or CNAME records.
  - Name-format mistakes (some registrars add the domain name automatically).
  - CAA records blocking Let's Encrypt.
  - Cloudflare's proxy left on instead of "DNS only".
  - Some DNS providers can't put a CNAME on the apex.
  - Email stops if nameservers are changed without copying the MX records.
  - The creator stops paying and the platform unlinks the domain, or the domain expires (Beacons help: https://help.beacons.ai/en/articles/4695873).
- Support load: Vercel quotes 24–48 hours for propagation. Entri exists as a paid product because creators find DNS hard.

**Logging in across domains (Supabase)**

- Cookies are tied to a domain. With no Domain attribute, a cookie stays on the host that set it. With a Domain attribute, it covers that domain and all its subdomains. A site can't set cookies for another site, and public suffixes are rejected (https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie).
- So subdomains can share one session by setting `cookieOptions.domain` to the parent domain in the browser client, the server client and the proxy. Separate domains cannot share a session.
- **Redirect allowlist:** supports `*` (one label; `.` and `/` are separators) and `**`. Supabase advises exact URLs in production (https://supabase.com/docs/guides/auth/redirect-urls). The list can be updated by API: `PATCH /v1/projects/{ref}/config/auth`, where `uri_allow_list` is a string.
- **Email templates:** `{{ .RedirectTo }}` carries the redirect the app passed, while `{{ .SiteURL }}` is the project setting (https://supabase.com/docs/guides/auth/auth-email-templates).
- **Google:** the redirect URI registered with Google is Supabase's own callback, so creator domains don't need adding there. Without a Supabase custom domain, the Google consent screen shows `<ref>.supabase.co` (https://supabase.com/docs/guides/auth/social-login/auth-google).
- **Supabase custom domain:** one per project and it must be a subdomain. $10 per month ($0.0137 an hour), Pro plan from $25 a month (https://supabase.com/pricing.md, https://supabase.com/docs/guides/platform/custom-domains).
- I found no documented Supabase pattern for handing a session from one domain to another.
- **Embedding Truth inside a creator's site (iframe):** Chrome 115+ keeps an embedded iframe's storage separate per top-level site (https://developer.chrome.com/docs/privacy-sandbox/storage-partitioning). Firefox's Total Cookie Protection is on by default (Mozilla support FAQ).

**SEO**

- `rel=canonical` is a "strong signal" but only a hint. Google picks the canonical itself (https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls, https://developers.google.com/search/docs/crawling-indexing/canonicalization).
- Google still "tr[ies] to support canonical across domains" (SEJ, 2023-05-05).
- Google treats subdomains and subfolders the same (Mueller, via SEJ and Portent; these statements are older, around 2017).

**Payments and privacy**

- **Paystack:** the official docs returned 403 to me. Secondary sources say a per-transaction `callback_url` overrides the dashboard setting. Truth already keeps the callback on its main domain.
- **POPIA:**
  - "Personal information" includes an "online identifier" (s1, https://popia.co.za/section-1-definitions/).
  - The lawful grounds include consent, contract and legitimate interests (s11).
  - Amended regulations were published 17 April 2025 (Government Gazette 52523, secondary source).
  - I found no cookie-specific guidance from the Information Regulator.

**.co.za domains**

- About R109 a year including VAT for new registrations from 1 Oct 2026, up from R99; renewals R109 (1-grid, 2026-08-18: https://1grid.co.za/blog/south-african-domain-price-changes-2026/).
- The cause is a 6.2% wholesale registry adjustment by ZADNA.

**How comparable creator platforms do it**

- Amazon Storefront uses a path: `amazon.com/shop/<handle>`.
- Linktree has no custom domains (according to competitor sources).
- Beacons offers custom domains only on paid plans.
- Substack charges a one-time $50.

##### 4. Design options

| Option                                                                                                                                        | Login                                                                                                                                                                                    | Creator credit                                                                                                      | Cost / effort                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Keep path pages (`truth.co.za/creators/x`), maybe add a vanity path                                                                        | Unchanged                                                                                                                                                                                | Unchanged                                                                                                           | Lowest. Needs a list of reserved slugs.                                                                                                                    |
| B. Creator's domain forwards (301) to their Truth page                                                                                        | Unchanged                                                                                                                                                                                | Works, because they land on the creator page                                                                        | Almost no work for Truth. HTTPS on the forwarding domain depends on the registrar (unconfirmed).                                                           |
| C. Subdomains (`zanele.truth.co.za`): wildcard plus a host rewrite                                                                            | Shared session possible via parent-domain cookie and `*.truth.co.za` allowlist                                                                                                           | Breaks unless the whole flow stays on the subdomain, credit moves to a parent-domain cookie, or links carry `?via=` | Nameservers moved to Vercel or `_acme-challenge` delegation; no per-domain cost. Don't submit to the PSL.                                                  |
| D. Creator's own domain as a storefront only: page served via Vercel API; Sign in, Save, Book are plain links to truth.co.za carrying `?via=` | Main domain only. No changes to auth or Paystack.                                                                                                                                        | Needs a new `?via=` capture on landing                                                                              | Domain admin UI, DNS support, canonical choice per creator (can come from the database and stay static). Other paths on that host should redirect to main. |
| E. Creator's own domain with its own logins                                                                                                   | User signs in again on each domain. Needs per-domain allowlist entries, a `{{ .RedirectTo }}` email template, Google flow started and finished on the same host, and `safeNext` changes. | Same as D                                                                                                           | High effort, more security review                                                                                                                          |
| F. Handing a session from Truth to a creator's domain (custom token exchange)                                                                 | Single sign-on feel                                                                                                                                                                      | Same as D                                                                                                           | Custom and security-sensitive; nothing documented. Not "by the book".                                                                                      |
| G. Embeddable widget or iframe on the creator's existing site                                                                                 | Main domain                                                                                                                                                                              | Must be passed in the URL (iframe storage is kept separate)                                                         | Low ops, no DNS                                                                                                                                            |
| H. Cloudflare for SaaS, Approximated, or a separate project per creator                                                                       | —                                                                                                                                                                                        | —                                                                                                                   | Second proxy layer, or a duplicate app per creator; not justified now                                                                                      |

**Creator logins** don't depend on any of the above. Every creator and customer uses the same Supabase sign-in. Truth would need:

- A link from creator to auth user, for example a `creator_members` table like `admins`.
- Database access rules (RLS) plus column permissions so a creator can edit only their own page and picks, and the commission column stays private.
- A creator dashboard on the main domain for editing the page, connecting a domain and seeing earnings (`payout_items` is admin-only today).

##### 5. Is it worth it? (opinion)

- With no real creators yet, custom domains aren't worth building now.
- The best value for the money: keep path pages, add `?via=` link credit (this is needed for B, D and G anyway), and add creator login and a dashboard when real creators sign up.
- If creators ask for their own domain: do Option D for a few top creators. Add the domain by hand in the Vercel dashboard, and map host to creator with `next.config` `has: host` rewrites and redirects. That is a redeploy per domain, which is fine at small scale. Automate it with the API and the Custom Domain block later.
- Don't register domains on creators' behalf: ownership is unclear, and Vercel can't sell .co.za anyway. Offer subdomains instead.
- Keep checkout and accounts on the main domain. That way there is one trusted brand on Paystack, one cookie scope, and one place for the POPIA notice.

##### 6. What I could not confirm

- Paystack's own docs (403): the `callback_url` override wording, any requirement to whitelist domains for live payments, and how checkout branding works.
- A cookie guidance note from the Information Regulator.
- Whether the .co.za registry raises any problem when nameservers point to Vercel.
- Whether HTTPS works on registrar forwarding (Option B).
- That a rewrite into the static `/creators/[slug]` page stays prerendered under `cacheComponents` (test it).
- Whether a `/@slug` path rewrite works, since `@` folders mean parallel routes in Next.
- Current prices for Approximated and Entri, and Linktree, Beacons and Stan's plans (the sources conflict or are competitors).
- Safari's current third-party cookie defaults (not sourced).
- Chrome keeping third-party cookies, with Privacy Sandbox retired in October 2025 (secondary sources only).

### 3.3 Code: how Truth works today

#### Truth codebase map: creator logins and creator pages on their own (sub)domains

All paths are relative to the `truth-web` folder. Line numbers are as of today. Where I say "estimate" or "option", that is my judgement, not something verified in the code.

##### 1. Customer sign-in today

**Sign-in screens and actions**

- `src/app/(site)/signin/page.tsx`
  - The page is noindex (L10).
  - It reads `searchParams` inside Suspense (L31-50) and shows `?error=link|google` messages (L13-16).
- `src/components/auth/sign-in-form.tsx`
  - The Google form calls `signInWithGoogle` (L28-33).
  - The email form uses `useActionState(sendSignInLink)` (L11, L41-65).
- `src/lib/actions/auth.ts`
  - `sendSignInLink` calls `signInWithOtp` with `shouldCreateUser: true` and `emailRedirectTo: ${NEXT_PUBLIC_SITE_URL}/auth/confirm?next=…` (L24-30).
  - `signInWithGoogle` redirects back to `${NEXT_PUBLIC_SITE_URL}/auth/callback` (L47-52).
  - `signOut` is at L57-61.
- `src/lib/safe-next.ts` only allows same-site paths. The default is `/account/bookings` (L2-6).

**Finishing sign-in**

- `src/app/auth/confirm/route.ts`: `verifyOtp`, then `rpc('claim_my_bookings')` (L22-28). The comment at L15 says the email template uses `{{ .SiteURL }}`. That template lives in the Supabase dashboard, not in the repo.
- `src/app/auth/callback/route.ts`: `exchangeCodeForSession`, then `claim_my_bookings` (L12-18).

**Session handling**

- `src/proxy.ts`
  - It only returns `updateSession(request)` (L5-7).
  - The matcher skips static files and also **`robots.txt` and `sitemap.xml`** (L11).
- `src/lib/supabase/proxy.ts`
  - It always builds a `NextResponse.next`.
  - `setAll` rebuilds that response and copies cookies and Supabase's headers onto it (L19-30). Supabase sends no-store cache headers with every cookie write (`node_modules/@supabase/ssr/dist/main/cookies.js` L506-508).
  - `getClaims()` runs at L36.
- `src/lib/supabase/server.ts` calls `await connection()` (L16), so any server use is dynamic. Server Components can't write cookies (L32-34).
- `src/lib/supabase/client.ts` (L7-12) creates the browser client with no cookie options.
- Other clients:
  - `src/lib/supabase/public.ts`: no session, used for cached public reads.
  - `src/lib/supabase/admin.ts`: service role.
- `@supabase/ssr` 0.12.7 cookie defaults (`node_modules/@supabase/ssr/dist/main/utils/constants.js` L4-11):
  - The cookie is host-only, because no `domain` is set.
  - `sameSite: lax`, **`httpOnly: false`**, 400-day lifetime.
  - `cookieOptions` (which includes `domain`) can be passed to both clients (`createBrowserClient.d.ts` L32/L43, `createServerClient.d.ts` L9/L75).

**Where sign-in state is read**

- In the browser: `src/lib/use-user.ts` (L9-22). It is used by:
  - `src/components/site/menu-button.tsx` (L30; the signed-in menu at L63-86 shows the email, My bookings and Sign out).
  - `src/components/site/saved-sync.tsx` (L11). This is mounted on every page by `src/app/layout.tsx` (L59).
- On the server:
  - `src/app/(site)/account/bookings/page.tsx`: `getClaims` at L52-53, inside Suspense.
  - `src/lib/data/bookings.ts`: `getBooking` calls the `get_booking` RPC through the signed-in client (L50-62).

**What signed-in customers can do**

- **My bookings:** a row-level-security-limited select (account/bookings `page.tsx` L56-63). Each link carries the booking's access token (L113).
- **Claim guest bookings:** `claim_my_bookings` in `supabase/migrations/20261029140000_claim_bookings.sql` (L6-41). It only works for a confirmed email (L22-24).
- **New bookings** made while signed in get `customer_id = auth.uid()` (`supabase/migrations/20261103090000_remove_service_fee.sql` L94).
- **Saved experiences** are stored on the device first, in localStorage key `truth-saved` (`src/lib/saved.ts` L5). `SavedSync` merges them with the `saved_experiences` table.
- There is **no profile table**. A customer's name exists only on each booking.

**Row-level security and functions that use `auth.uid()`**
These are in `supabase/migrations/20261029120000_security_and_availability.sql` unless noted:

- `is_admin()` (L23-34).
- Policy "Customers read own bookings" (L115-116).
- `create_booking` sets `customer_id` (L305).
- `get_booking` lets the signed-in owner in (L376).
- `saved_experiences` defaults `user_id` and has select/insert/delete policies for the owner, but **no update policy** (L386-398).
- `claim_my_bookings` (L13).
- `payouts.created_by` (`20261101090000_payouts.sql` L26).

The base tables and their original "public read" policies were created before `supabase/migrations/`, so they are not in the repo. `supabase/audit/inspect-security.sql` dumps the live policies and grants.

##### 2. Admin sign-in

**Database**

- `public.admins` has no policies (L11-16).
- The migration made every account that existed at the time an admin (L18-21).
- `is_admin()` is true when the user has a row in `admins` **and** the token's `aal` is `aal2` (L23-34).
- "Admins manage …" policies cover experiences, hosts, creators, referrals, itineraries and reviews (L46-57), bookings (L113-114), and schedules and blackouts (L132-145).
- Uploads to the storage bucket `images` (insert, update and delete) are admin-only (L60-69).
- Every admin RPC checks `is_admin()` again, for example `admin_replace_creator_experiences` (`supabase/migrations/20261031090000_private_people_columns.sql` L24-56).

**App**

- `src/lib/admin/guard.ts` `requireAdmin()` (L9-25) checks `getClaims`, then the user id, then `aal2`, then `rpc('is_admin')`. Otherwise it redirects to `/admin/signin`.
- `src/lib/actions/admin-auth.ts`:
  - Password first (L15-41).
  - Then the authenticator: TOTP `challenge` and `verify` (L45-79).
  - Then `is_admin`, or sign out (L81-87).
- `src/app/admin/signin/page.tsx`: a session that is only `aal1` (for example from a customer email link) goes straight to the code step (L51-52).
- `src/app/admin/(console)/layout.tsx`:
  - `instant = false` (L28).
  - `<Suspense><Guarded>` runs `requireAdmin()` (L93-107).
  - Every admin data function calls `requireAdmin()` again.
  - Private columns are read with the service role (`src/lib/admin/people.ts`).
  - Writes use the signed-in client, so row-level security checks each one.
- Roles already share one account and one session:
  - A customer is any signed-in user.
  - An admin is the same user plus an `admins` row and `aal2`.
  - `signOut` and `adminSignOut` end the same session.
- The e2e test `e2e/admin.spec.ts` (L3-32) checks that signed-out visitors are locked out and that no private text appears in the HTML.

##### 3. Creators end to end

**Table** (`src/lib/supabase/database.types.ts` L195-215)

- Columns: id, name, slug, location, bio, signature_quote, avatar_url, cover_image_url, follower_count, personal_tags, featured_in, the four social links, revenue_share_percentage, created_at, updated_at.
  - The slug is unique: `saveCreator` handles the duplicate error 23505.
  - `follower_count` is free text for social followers, like "120K".
  - `revenue_share_percentage` is required (NOT NULL) since `payouts.sql` L13.
- **There is no `user_id` and no email column.**
- Privileges:
  - Table-wide SELECT was revoked, and only the public columns were granted back (`20261031090000_private_people_columns.sql` L17-22). Columns added later stay private (L4-6).
  - **INSERT, UPDATE and DELETE are still table-wide.** Only `truncate`, `trigger` and `references` were revoked (security L403). Only row-level security limits writes to admins (L50-53). This comes from the repo's history; check it against `inspect-security.sql`.
- `bookings.creator_id` is a foreign key to creators (types L141-148). `bookings.creator_snapshot` exists but nothing fills it.

**Admin editor**

- Pages: `src/app/admin/(console)/creators/page.tsx`, `src/app/admin/(console)/creators/new/page.tsx`, and `src/app/admin/(console)/creators/[id]/page.tsx`. The edit page has three parts: the form, the picks and Delete (L55-76).
- Data in `src/lib/admin/people.ts`:
  - `listCreators` (L98-116).
  - `getEditableCreator`, using the service role (L118-147).
  - `listExperienceOptions` (L150-163). It is admin-only and **includes hidden experiences**.
- Actions in `src/lib/actions/admin-people.ts`:
  - The Zod `creator` schema, with slug max 80 (L136-161).
  - `saveCreator` (L163-216) **writes the revenue share through the signed-in client** (L180, L206) and deletes replaced photos (L208-212).
  - `saveCreatorPicks` (L223-235).
  - `deleteCreator` is blocked when the creator has bookings (L243-252).
  - `refreshPages` = `updateTag('experiences')`, `updateTag('creators')`, then `refresh()` (L24-28).
- Components:
  - `src/components/admin/creator-form.tsx`: hard-wired to `saveCreator` (L23). It has the share field (L87-100) and the slug field, whose hint says changing it breaks old links (L62).
  - `src/components/admin/creator-picks-editor.tsx`: hard-wired to `saveCreatorPicks` (L71).
  - `src/components/admin/image-field.tsx` (L23) calls `src/lib/upload-image.ts`. Uploads go to `${folder}/${uuid}.${ext}` with no owner in the path (L16).
  - `src/lib/images.ts`: `isAllowedImageUrl` accepts **any** file in the bucket (L14-15).

**Public page, cache and SEO**

- `src/app/(site)/creators/[slug]/page.tsx`:
  - `generateStaticParams` (L15-18).
  - The canonical link is `/creators/<slug>` (L31).
  - `SiteHeader` (L43), `RememberCreator` (L152), and the `ExperienceCard` grid (L157-161).
- `src/lib/data/creators.ts`:
  - Selects only public-safe columns (L26-34).
  - `'use cache'`, `cacheLife('hours')`, `cacheTag('creators', 'creator:<slug>')` (L37-39). **No `updateTag` call ever targets `creator:<slug>`.**
  - Only `https` social links are shown (L57-59).
- Experience pages link "Recommended by" to `/creators/<slug>` (`src/app/(site)/experiences/[id]/page.tsx` L215-235).
- There is no `/creators` index page.
- `src/app/sitemap.ts` lists `${NEXT_PUBLIC_SITE_URL}/creators/<slug>` (L22-26). `src/app/robots.ts` is at L5-10. `metadataBase` is `NEXT_PUBLIC_SITE_URL` (`src/app/layout.tsx` L21).
- e2e: `e2e/browse.spec.ts` covers the creator page (L43-47) and the sitemap (L54-58).

**How a creator gets credit for a booking**

1. On the creator page, `RememberCreator` (`src/components/site/remember-creator.tsx` L8-11) stores `truth-creator` = {slug, until} for 30 days; the last creator visited wins (`src/lib/creator-credit.ts` L4-22).
2. `BookingWidget` reads it only after a session is chosen and adds `creator=` to the Reserve link (`src/components/booking/booking-widget.tsx` L55-63).
3. The book page reads it (`src/app/(site)/experiences/[id]/book/page.tsx` L27-31) and puts it in a hidden input (`src/components/booking/booking-form.tsx` L33).
4. `createBooking` checks it with Zod (`src/lib/actions/booking.ts` L29-33) and passes `p_creator_slug` (L87).
5. `create_booking` only credits a creator who recommends that experience (`remove_service_fee.sql` L72-78).

**Earnings and payouts** (`supabase/migrations/20261101090000_payouts.sql`)

- Tables `payouts` (L16-30) and `payout_items` (L33-50).
- Admin-only reads through row-level security (L58-65).
- The creator part of `record_booking_earnings` is at L105-116.
- The trigger records earnings when a booking is paid and voids them when it is cancelled (L121-141).
- `admin_record_payout` and `admin_undo_payout` are at L147-243.
- App code:
  - `src/lib/admin/payouts.ts`: its columns pull in `bookings(...)` (L46-50); `getPersonPayouts` is at L146-179.
  - `src/lib/payouts.ts`: `earningStatus` (L11-18), `sumAmounts`, `groupPayoutsByMonth` (L177-184).
  - Screen `src/app/admin/(console)/payouts/[recipient]/[id]/page.tsx`.
- **Nothing tracks clicks or visits today.** There is no analytics package in `package.json`.

##### 4. What would have to change (sizes are estimates)

###### (a) Creators sign in and get a dashboard (medium overall; really blocked until the email service is connected)

**Linking a creator to an account (one additive migration)**

- Option A: `creators.user_id` (unique). One login per creator, simplest.
- Option B: a `creator_members(user_id, creator_id, role)` table. It allows a manager or agency, and the same shape could later give hosts a login (hosts have none today).
- Creators have no email, and email sign-in creates an account for any address. A safe link would be:
  - An admin enters a private `contact_email`.
  - A `claim_my_creator()` RPC links it, modelled on `claim_my_bookings` and requiring a confirmed email.
  - It is called next to `claim_my_bookings` in `/auth/confirm` and `/auth/callback`.
- Either way, the creator needs to receive an email, and Supabase's default email service only reaches the owner's team (PROGRESS L227-229).

**Editing rights**

- A simple "members may update their own row" policy is **unsafe**. UPDATE is table-wide, so a creator could change `revenue_share_percentage` and `slug`.
- Revoking the column UPDATE grant from signed-in users would **break `saveCreator`**, which writes the share through the signed-in client.
- Option 1: SECURITY DEFINER RPCs that only change allowed columns: `creator_update_my_page(...)` and `creator_replace_my_picks(...)`, a copy of `admin_replace_creator_experiences` with a membership check, limited to live experiences. Give them `search_path = ''` and revoke them from `anon`. This matches the RPCs the project already uses.
- Option 2: a member UPDATE policy plus a BEFORE UPDATE trigger that rejects share or slug changes unless `is_admin()`.
- Keep the slug admin-only. It is the credit key and would be a future subdomain.

**Dashboard data**

- The creator's own share is hidden by the column grants, so it needs an RPC.
- Earnings need an RPC that returns a safe projection, because:
  - the admin query pulls in `bookings`;
  - creators can't read bookings (row-level security allows only admins and the booking's own customer);
  - creators must never see guests' names, emails or phones (South Africa's privacy law, POPIA).
- Clicks need a new table or an analytics product.

**Photos**

- Add member insert and delete rights in storage under `creators/<creator_id>/…`.
- Change the upload path.
- Tighten `isAllowedImageUrl` to the creator's own folder.

**App**

- A `requireCreator()` guard modelled on `guard.ts`, redirecting to `/signin?next=/creator`.
- A `/creator` section shaped like the admin console (Suspense, Guarded, `instant = false`) with:
  - an overview;
  - My page;
  - Picks;
  - Earnings.
- Saves call `updateTag('creator:<slug>')`, plus `'experiences'` when picks change.

**Roles living together**

- One account per email: customer features hang off `auth.uid()`, creator rights off the membership link, admin off `admins` plus `aal2`.
- Admin step-up from a normal session already works.
- The menu is a client component on static pages, so it would show "Creator dashboard" from either:
  - a browser query of the user's own membership row; or
  - a Supabase custom access token hook that adds the role to the token. The role would then only update when the token refreshes; `jwt_expiry = 3600` in the local `supabase/config.toml` L166, and the hosted value is unknown.

**Decisions for the owner**

- Should creators need the authenticator step (`aal2`) to see earnings? Probably yes once bank details are added.
- Should page edits publish instantly, or wait for admin approval?

###### (b) Creator page on a subdomain or the creator's own domain

**What Next 16 recommends**

- `node_modules/next/dist/docs/01-app/02-guides/multi-tenant.md` (L7) only links to Vercel's Platforms Starter Kit.
- That kit (vercel/platforms, Next 16):
  - Its `proxy.ts` reads the subdomain from the Host header. It handles `*.localhost`, `tenant---branch.vercel.app` preview URLs and the root domain or `www`.
  - It rewrites `/` on a tenant host to `/s/<subdomain>` and redirects `/admin` there to `/`.
  - Tenant data lives in Redis.
  - It uses wildcard DNS on Vercel.
- Vercel's multi-tenant docs:
  - Look up the tenant in the proxy, using Global Config for speed.
  - Custom domains are added through the Vercel SDK or REST API, verified with a TXT record, and get SSL automatically.
  - A wildcard SSL certificate needs Vercel's nameservers or delegated validation.
  - Hobby allows 50 custom domains per project; Pro is unlimited (soft limit 100,000).
  - Per-tenant preview URLs are Enterprise-only.
  - Domain additions are limited to 100 per hour.
- Related Next docs:
  - The proxy runs on Node.js (`proxy.md` L253-255). It is not meant for slow data fetching, and fetch caching does not apply there (`16-proxy.md` L29-31).
  - `NextResponse.rewrite` carries the RSC headers through (`proxy.md` L472-476).
  - There are test helpers for the proxy (`proxy.md` L728-756).
  - Links to another domain should be plain `<a>` tags (`multi-zones.md` L114-116).
  - The dev server already accepts `*.localhost` (`allowedDevOrigins.md` L34).

**Changes**

- **Proxy:** sort hosts into main, `<slug>.root`, or a mapped custom domain. Then:
  - Rewrite to a path that carries the slug, and copy Set-Cookie and the no-store headers onto the rewrite. `updateSession` would need refactoring for this.
  - Redirect app paths (admin, account, sign-in, auth, payments, bookings, experiences) to the main domain.
  - Mapping a custom domain to a slug needs an environment map, Global Config, or a database lookup on every request. The database lookup goes against the proxy guidance.
- **Caching:** rewriting to `/creators/[slug]` (or a new `/sites/[slug]`) keeps pages prerendered with the current cache tags. Reading `headers()` for the host would make pages dynamic (`headers.md` L48-49), so avoid it. With Cache Components, a new dynamic route needs `generateStaticParams` to return at least one value (`generate-static-params.md` L309-313).
- **Shared components link relative to the current host:**
  - `ExperienceCard` uses `next/link` to `/experiences/<id>` (`src/components/experience/experience-card.tsx` L54-56).
  - `SiteHeader` has the search pill and menu.
  - The footer links to `/`.
  - `FavoriteButton` saves to localStorage, which is per origin.
  - A creator-host version needs a slim header and absolute main-domain links carrying `?via=<slug>`.
- **Images:** `next.config.ts` `remotePatterns` (L5-17) limits where images come from, not which domain serves the page, so no change is needed.
- **SEO:**
  - `metadataBase` and the canonical link point to the main domain, so creator hosts would point search engines back to the main page.
  - If the creator domain should rank instead, `generateMetadata` needs absolute per-domain URLs.
  - On creator hosts, `/robots.txt` and `/sitemap.xml` would currently serve the main site's files, because the proxy skips them.
- **Sign-in:**
  - The session cookie is host-only.
  - Supabase has one Site URL, which is still localhost (PROGRESS L232).
  - Its redirect allow-list supports `https://*.domain/**`, where `*` matches one part of a host name.
  - Each custom domain would have to be added to the allow-list.
  - The email template's `{{ .SiteURL }}` vs `{{ .RedirectTo }}` is set in the dashboard.
  - Sharing a login across subdomains means setting `cookieOptions.domain` in the proxy, server and browser clients. Because the session cookie can be read by scripts (`httpOnly: false`), every subdomain would then receive it, including admin sessions.
  - Custom domains can never share the cookie. Recommendation: sign in only on the main domain.
- **Creator credit:** creator hosts must pass `?via=` to the main domain. The main domain stores it in the browser (a `RememberCreator`-style effect reading `location.search`) so pages stay static.
- **Checkout stays on the main domain**, because:
  - `createBooking` redirects to the relative `/bookings/...` (`booking.ts` L101);
  - the Paystack callback URL is built from `NEXT_PUBLIC_SITE_URL` (`src/lib/actions/payment.ts` L48);
  - Paystack has only one webhook URL.
- **Slugs as host names:** slugs allow 80 characters, but a DNS label allows 63. Names like www, admin and api must be reserved. Changing a slug breaks the subdomain and any stored credit.

**Sizes**

- A short path such as `/c/<slug>`: small.
- Subdomains: medium.
- Custom domains: large, plus DNS support for each creator.

**Cheap alternatives**

- **Deep links:** `?via=<slug>` on any experience link, from any channel.
- **Theming** the existing creator page.
- **An embed or link card** for creators' existing sites. Inside an iframe, browsers partition storage, so credit would still have to travel in the link.

###### (c) More for customer accounts

- **Following creators:** a `creator_follows` table with owner-only policies, copying `saved_experiences`. Add a follow button and show the count through an RPC; don't confuse it with the social-media `follower_count` text. Sending "new pick" notifications needs the email service. Small to medium.
- **Public saved lists:** need a `profiles` table (none exists), `lists` with an `is_public` flag and a public read policy, a cached page with tag `list:<id>`, and moderation and POPIA consent. Medium to large.
- A creator's picks are already a public list, so creators and customer lists could share one "collections" model. That would be a bigger migration, because bookings and payouts point at `creators(id)`.

##### 5. Pieces that can be reused

- **Guards and layout:**
  - `requireAdmin` as the model for a creator guard.
  - The admin console's `Guarded`, `instant = false` and Suspense layout.
  - The `claim_my_bookings` and `admin_replace_creator_experiences` RPC patterns.
- **Forms:**
  - `src/lib/admin/form.ts` (`FormState`, `text`, `tags`, `link`, `socialLink`, `imageUrl`, `percent`) and its tests.
  - Split the `creator` schema into shared profile fields plus admin-only slug and share.
  - Give `CreatorForm` and `CreatorPicksEditor` an action passed in (and a mode), not a hard-wired one.
  - `ImageField` and `uploadImage`, with a per-creator folder.
- **Display:**
  - `Section`, `Field`, `SaveStatus` (`src/components/admin/save-status.tsx`).
  - `Stat` and `Pager` (`src/components/admin/report-parts.tsx`).
  - `BarChart`.
  - `earningStatus`, `sumAmounts`, `groupPayoutsByMonth`, `formatDay`, `formatRand`.
- **Credit:** `rememberCreator` and `creditedCreator`, which already take a storage parameter for tests.
- **Tests:**
  - The lockout loop in `admin.spec.ts`.
  - `creator-credit.test.ts` and `payouts.test.ts`.
  - The proxy test helpers.
  - Playwright can reach `slug.localhost:3100`.

##### 6. Biggest technical risks

1. **Creator edits:** UPDATE on `creators` is open to all signed-in users at the table level, and admin saves rely on that. Creator edits need RPCs or a trigger guard, or creators could change their own share.
2. **Storage:** the bucket is admin-only, upload paths carry no owner, and `isAllowedImageUrl` accepts any file in the bucket.
3. **Linking accounts:** creators have no email, and anyone can create an account by email. Linking must be started by an admin and confirm the email, and it needs the email service.
4. **Dashboard data:** creators can't read bookings, and earnings are admin-only. They need RPCs that return no guest details.
5. **Per-origin storage:** credit, saved experiences and theme are stored per domain. Other domains must pass `?via=` and the main domain must catch it in the browser.
6. **Shared cookies:** sharing the session across subdomains exposes cookies that scripts can read, including admins'. Custom domains can't share at all.
7. **Proxy:** adding a rewrite must keep the Supabase cookies and no-store headers. The matcher skips robots and sitemap, and per-request lookups don't fit in the proxy.
8. **SEO and links:** canonical, sitemap and robots are tied to the main domain, and shared components use relative links.
9. **Slugs:** the 63-character DNS limit, reserved names, and changing a slug all matter. With Cache Components, the build fails if `generateStaticParams` returns nothing.
10. **Vercel:** wildcard domains need its nameservers; Hobby allows 50 domains; tenant preview URLs are Enterprise-only. From memory, Hobby is for non-commercial use only — check this.
11. **Base schema:** the original tables and policies aren't in the repo. Run `inspect-security.sql` before designing new policies.

**Facts that bear on "is it worth it" (my reading):**

- There are no real creators, and creators can't receive sign-in emails until the email service is connected.
- Today's `/creators/<slug>` page already credits the creator on the same domain. A dashboard (page, picks, earnings) reuses earnings that are already calculated.
- Custom domains mainly add branding, at a high technical and support cost.

Sources:

- [vercel/platforms](https://github.com/vercel/platforms)
- [vercel/platforms proxy.ts](https://raw.githubusercontent.com/vercel/platforms/main/proxy.ts)
- [Vercel multi-tenant concepts](https://vercel.com/docs/platforms/multi-tenant-platforms/concepts)
- [Vercel multi-tenant limits](https://vercel.com/docs/platforms/multi-tenant-platforms/limits)
- [Vercel Platforms starter template](https://vercel.com/new/templates/next.js/platforms-starter-kit)
- [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

---

## 4. The five option designs

### Option A: Lean creator accounts on Truth: one login for everyone, a /@handle page and a creator dashboard

**In one line:** Creators sign in with the same Google or email-link login customers use. A creator dashboard on Truth gives them their share links, bookings and earnings, and later lets them edit their own page and picks. Their public page moves to a short handle on Truth's own domain (truth.co.za/@zanele-eats). There are no subdomains, no custom domains and no new services.

**Effort:** M

#### What the creator experiences

**1. Invitation.** There is no public creator sign-up; Truth picks its creators.

- An admin opens Admin, then Creators, then Zanele Eats, then the new "Creator sign-in" section.
- The admin types zanele@gmail.com and clicks Add.
- The app shows a ready-made WhatsApp message to copy: "Your Truth creator dashboard is ready: truth.co.za/creator. Sign in with zanele@gmail.com."

**2. Logging in.**

- Zanele opens truth.co.za/creator and is sent to the normal sign-in page.
- She taps "Continue with Google", or "Email me a sign-in link" once Truth connects an email service. There is no password.
- Her verified address matches the invite, so she lands on her dashboard.
- From then on the menu on every page shows "Creator dashboard" next to My bookings and Saved.
- If she signs in with a different address, she sees a friendly "This account isn't linked to a creator page yet" screen with a "Check again" button.

**3. Dashboard, first version (read-only).**

- "Your page: truth.co.za/@zanele-eats", with Copy and View buttons.
- "You earn 5% of the experience price on bookings that come through you. Truth pays it from its commission."
- Cards: Earned this year, Owed to you (due and upcoming), Paid to you, and Bookings through you.
- Share links: one row per pick, with "Copy link" and "Share on WhatsApp". Each link is the experience page plus ?via=zanele-eats, so she can link straight to one experience from a post.
- Bookings through you: the experience, date, number of guests, booking value, her earning, and a status (Upcoming, Due, Paid on 3 Dec, or Cancelled). It never shows guests' names, emails or phone numbers.
- A short explainer of how credit works: it needs the same phone or computer, lasts 30 days, goes to the last creator visited, and only counts for experiences she recommends.

**4. Later versions.**

- A "My page" tab: she edits her bio, quote, location, tags and social links. Changes go live on save, or after admin approval if the owner prefers.
- A "Picks" tab: she ticks which live experiences she recommends.
- Then her own photos, and a visits count such as "41 visits this week, 12 from your links".
- Only Truth changes her name, her handle, her share, her follower count and "Featured in". These are the things Truth shows as facts, or that money and links depend on.

**5. One login for everything.**

- The same account books trips as a customer (My bookings, Saved).
- If she were also a host or an admin, the same account would carry those roles too. Admin still needs its password and authenticator step.
- Signing out ends everything.

#### What the customer experiences

Almost nothing changes for customers, which is the point.

- **Browsing:** a guest taps a creator's bio link, truth.co.za/@zanele-eats. The page looks like today's creator page, with the creator's photo, words and picks.
- **Deep links:** a guest can also tap a link in a post that opens one experience directly (truth.co.za/experiences/<id>?via=zanele-eats).
- **Credit:** either way, the creator is remembered on that device for 30 days, as today.
- **Booking and paying:** always on Truth's own domain. Guest checkout stays, so no account is needed. Payment goes through Paystack exactly as now. The creator's share comes out of Truth's commission, so the guest pays the same price.
- **Logging in (optional):** the same /signin page, with Google or an email link. Signed-in customers get My bookings and Saved on every device. Guest bookings made with the same email are claimed automatically.
- **One person, many hats:** a customer who is also a creator just sees an extra "Creator dashboard" link in the menu. There is no second account and no second password.
- **Privacy both ways:** customers never see creators' private data (share %, earnings), and creators never see customers' personal details.

#### Web addresses

truth.co.za stands in for the production domain, which isn't chosen yet.

- **Public creator page: truth.co.za/@zanele-eats.**
  - This becomes the canonical address: in the sitemap, on the "Recommended by" chips and on the admin "View on site" link.
  - The old truth.co.za/creators/zanele-eats keeps working.
  - Once a Vercel preview proves there is no loop, the old address can 308-redirect to /@zanele-eats.
- **Deep link to one experience, with credit:** truth.co.za/experiences/<id>?via=zanele-eats.
  - ?via= also works on any page, for example truth.co.za/experiences?category=Food&via=zanele-eats.
- **Creator dashboard:** truth.co.za/creator.
  - /studio is an alternative if the owner wants a name that can't be confused with /creators/....
  - Signed-out visitors go to truth.co.za/signin?next=/creator.
  - Later tabs: /creator/page and /creator/picks.
- **Admin linking:** truth.co.za/admin/creators/<id>, in a new "Creator sign-in" section.
- **"Own domain" with nothing built by Truth:**
  - A creator who owns zaneleeats.co.za (about R109 a year) sets their registrar's web forwarding to https://truth.co.za/@zanele-eats.
  - Credit still works, because the visitor ends up on Truth's own site.
  - Check that the registrar forwards over HTTPS.
- **Not in this option:** subdomains like zanele.truth.co.za, or Truth serving pages on zaneleeats.co.za.

#### How it works technically

**1. Identity: one Supabase user per email, with roles as rows**

- A customer is any signed-in user (exists today).
- An admin is a public.admins row plus aal2 (exists today).
- A creator is a claimed row in the new public.creator_members table.
- A host could later use host_members in the same way.
- Supabase links Google and email-link sign-ins that share a verified email, so each person has one account.
- Roles are checked per request in the database, not stored in the JWT. Removing a member takes effect on their next page load, and no custom access-token hook is needed.

**2. Linking an account to a creator**

- The admin adds an email. This creates a pending creator_members row (email set, user_id null).
- The admin writes through the signed-in client under an "Admins manage" RLS policy (is_admin()), exactly like saveHost and saveCreator.
- claim_my_creator_invites() is a SECURITY DEFINER copy of claim_my_bookings. It sets user_id = auth.uid() on pending rows whose email equals the caller's confirmed auth.users email (email_confirmed_at not null).
- It is called:
  - next to claim_my_bookings in src/app/auth/confirm/route.ts;
  - next to claim_my_bookings in src/app/auth/callback/route.ts;
  - by a "Check again" server action.
- Page renders stay read-only.
- Sign-in creates an account for any email (shouldCreateUser: true). So creator rights come only from this admin-started, verified-email match.

**3. Dashboard routes in src/app/(site)/creator/**

- layout.tsx copies src/app/admin/(console)/layout.tsx:
  - `export const instant = false`;
  - robots noindex;
  - SiteHeader;
  - `<Suspense><Guarded>`, where Guarded runs requireCreator().
- requireCreator() lives in the new src/lib/creator/guard.ts, modelled on src/lib/admin/guard.ts:
  - It calls getClaims(). If there is no sub, it calls redirect('/signin?next=/creator').
  - Otherwise it calls rpc('my_creators'). If no rows come back, the layout shows the "not linked" screen.
- my_creators() returns id, name, slug and the private revenue_share_percentage, only for the caller's own memberships.
- The share column's SELECT stays ungranted to anon and authenticated.
- Every data function and server action calls requireCreator() again, as the admin console does.
- The creator id always comes from the session, never from form data.
- Server reads use src/lib/supabase/server.ts, which calls connection(). These pages are therefore dynamic and never cached.
- Rule: never read creator data inside 'use cache'.

**4. Earnings without leaking guests**

- creator_my_earnings(p_creator_id) is SECURITY DEFINER with search_path ''. It checks membership, then joins payout_items to bookings and to payouts.
- It returns only:
  - the earning id;
  - the experience title, from experience_snapshot;
  - session date and guest count;
  - base_amount, rate and amount;
  - due_on, payout_id, voided_at and paid_on.
- It never returns customer_name, customer_email, customer_phone, booking ids or access tokens.
- The page reuses earningStatus, sumAmounts and formatDay from src/lib/payouts.ts, plus formatRand. This is the same safe shape admin's toEarning() already builds.
- payout_items and payouts stay admin-only under RLS. Creators reach them only through this function.

**5. Writes (slice 2): creators never write tables directly**

- There is deliberately no "members update own row" policy on creators. The table-wide UPDATE grant would let a creator change revenue_share_percentage and slug.
- Instead there are two SECURITY DEFINER RPCs, each checking membership:
  - creator_update_my_page(...) changes only location, bio, signature_quote, personal_tags and the four social links.
  - creator_replace_my_picks(...) is a copy of admin_replace_creator_experiences. It only touches is_active experiences, leaves hidden picks alone and caps at 50.
- Zod validation reuses src/lib/admin/form.ts (text, tags, link, socialLink).
- The actions then call:
  - updateTag('creator:<slug>'): the tag already exists in src/lib/data/creators.ts but nothing refreshes it today;
  - updateTag('experiences') as well when picks or photos change, because experience pages show "Recommended by" with the avatar;
  - refresh().

**6. Public page and the /@handle**

- next.config.ts gets `rewrites: [{ source: '/@:slug([a-z0-9-]{1,80})', destination: '/creators/:slug' }]`.
- Config rewrites run after redirects and after the proxy, so the following stay untouched:
  - src/proxy.ts and updateSession;
  - the host-only cookie;
  - the Supabase redirect URLs.
- The prerendered /creators/[slug] page (generateStaticParams plus 'use cache') is served unchanged, so it stays static.
- The canonical link, the sitemap and the "Recommended by" links switch to /@slug.
- **Caveat to prove first:** '@' folders mean parallel routes in the App Router.
  - A config rewrite isn't a folder, and normalizeAppPath only strips '@' segments from file paths.
  - Still, this is unverified on 16.4. Slice 0 must pass pnpm build and an e2e test on /@sarah-johnson, including the %40 encoding.
  - The fallback is /c/<slug>.

**7. Credit**

- Unchanged and same-origin:
  - localStorage key truth-creator, 30 days;
  - create_booking credits only a creator who recommends the experience.
- New: a tiny client component mounted in src/app/layout.tsx beside SavedSync.
  - On load it reads window.location.search and calls rememberCreator(via).
  - It deliberately avoids useSearchParams, so no Suspense boundary is needed and pages stay prerendered.
- A wrong or forged ?via= costs nothing, because the database still checks the pick.

**8. Visits (slice 3)**

- A table creator_daily_visits(creator_id, day, page_views, link_visits).
- An anon-callable record_creator_visit(p_slug, p_from_link), called from RememberCreator and from the ?via= catcher.
- At most one call per browser, per creator, per day, deduped in localStorage.
- No IP, cookie or user id is stored. These are aggregate counts, not personal information under POPIA, and only indicative.

**9. Photos (slice 3)**

- Storage policies let members insert and delete only under images/creators/<creator_id>/. The check compares storage.foldername(name) with creator_members.
- uploadImage gains an owner folder.
- creator_update_my_photos() accepts only URLs inside that folder, and the action re-checks them against STORAGE_PREFIX.

**10. Menu**

- MenuButton (a client component) already has useUser().
- When the menu opens for a signed-in user, it runs one head-count query on creator_members to decide whether to show "Creator dashboard". RLS returns only the user's own rows.
- Public pages stay static, as the project rules require.

**Critical files**

- next.config.ts
- src/app/auth/confirm/route.ts and src/app/auth/callback/route.ts
- src/lib/admin/guard.ts (the pattern for the new src/lib/creator/guard.ts)
- src/app/(site)/creators/[slug]/page.tsx
- src/lib/creator-credit.ts
- the new supabase/migrations/<ts>_creator_accounts.sql

#### Database changes

- Migration 1 (slice 1, additive), new table public.creator_members.
  - Columns:
    - id uuid primary key;
    - creator_id uuid not null, references creators, on delete cascade;
    - email text not null, with a check that it equals lower(btrim(email)) and is 3 to 254 characters;
    - user_id uuid null, references auth.users, on delete cascade; null until claimed;
    - invited_by uuid default auth.uid();
    - created_at;
    - claimed_at.
  - Constraints: unique (creator_id, email), unique (creator_id, user_id), and an index on user_id.
  - RLS is on.
  - Grants: revoke all from anon and authenticated, then grant select, insert and delete to authenticated.
  - Policies: 'Members read own' (select where user_id = auth.uid()) and 'Admins manage creator members' (for all, using and with check is_admin()).
  - Why a separate table rather than a creators.user_id column:
    - it mirrors public.admins;
    - it leaves the creators table and its column grants untouched;
    - several logins per creator (a manager, or a couple like Trail & Tide) and several creators per login both work without schema changes.
- Migration 1 functions. All are SECURITY DEFINER with set search_path = '', revoked from public and anon, and granted to authenticated:
  - claim_my_creator_invites(), returns integer;
  - my_creators(), returns (creator_id, name, slug, share);
  - creator_my_earnings(p_creator_id uuid), returns the safe earnings shape with no guest fields;
  - optionally creator_my_payouts(p_creator_id), returning paid_on, amount, reference and booking count, but not the admin note.

  The migration ends with a check query confirming that:
  - anon cannot select creator_members;
  - anon cannot execute these functions;
  - authenticated still cannot select creators.revenue_share_percentage.

- Migration 2 (slice 2):
  - creator_update_my_page(p_creator_id, p_location, p_bio, p_quote, p_tags text[], p_instagram, p_tiktok, p_youtube, p_website):
    - checks membership;
    - enforces SQL length limits that mirror Zod (bio 1000, quote 300, location 80, 10 tags of 60 characters);
    - requires https social links;
    - sets updated_at;
    - never touches name, slug, revenue_share_percentage, follower_count or featured_in.
  - creator_replace_my_picks(p_creator_id, p_experience_ids uuid[]):
    - checks membership;
    - caps at 50;
    - deletes and re-inserts only the rows for is_active experiences, leaving admin-set hidden picks in place.
- Migration 3 (slice 3):
  - Table creator_daily_visits(creator_id fk cascade, day date, page_views int, link_visits int, primary key (creator_id, day)), with RLS on and no direct grants.
  - record_creator_visit(p_slug text, p_from_link boolean), granted to anon and authenticated; it upserts today's row using the Africa/Johannesburg date.
  - creator_my_visits(p_creator_id, p_days int), for members only.
  - storage.objects insert and delete policies for the 'images' bucket under creators/<creator_id>/..., for members only.
  - creator_update_my_photos(p_creator_id, p_avatar_url, p_cover_url), which accepts only URLs inside that folder.
- Unchanged on purpose:
  - creators: its columns and grants (no user_id or email column, no member UPDATE policy);
  - bookings, payout_items and payouts;
  - record_booking_earnings and create_booking;
  - the Supabase Auth settings.

  The only optional change: if the owner decides creators shouldn't earn on their own bookings, skip creator credit in create_booking or record_booking_earnings when the customer's user id or email belongs to a member of that creator.

- Before writing any policy, run supabase/audit/inspect-security.sql (read-only). The base tables and their original policies aren't in the repo, for example any storage SELECT policy that remove() relies on.

#### What it reuses

- Sign-in for creators is unchanged: src/app/(site)/signin/page.tsx, src/components/auth/sign-in-form.tsx and src/lib/actions/auth.ts (sendSignInLink, signInWithGoogle, signOut). The next parameter carries /creator, which src/lib/safe-next.ts already allows.
- src/app/auth/confirm/route.ts and src/app/auth/callback/route.ts: one extra rpc('claim_my_creator_invites') in each, next to claim_my_bookings.
- supabase/migrations/20261029140000_claim_bookings.sql: the pattern for claiming by verified email.
- supabase/migrations/20261031090000_private_people_columns.sql: admin_replace_creator_experiences is the template for creator_replace_my_picks, and its column-grant approach keeps the share private.
- Templates for the creator section:
  - src/lib/admin/guard.ts (requireAdmin) for requireCreator;
  - src/app/admin/(console)/layout.tsx (instant = false, Suspense plus Guarded) for the creator layout;
  - src/app/(site)/account/bookings/page.tsx for a signed-in page inside the site's own header and footer.
- src/components/admin/creator-form.tsx and src/components/admin/creator-picks-editor.tsx: changed to take an action prop and a mode ('admin' | 'creator'), rather than copied.
- src/lib/admin/form.ts (FormState, text, tags, link, socialLink, imageUrl), plus the creator Zod schema in src/lib/actions/admin-people.ts. That schema is split into shared profile fields and admin-only fields (name, slug, share, followers, featuredIn).
- Shared components:
  - src/components/admin/save-status.tsx (Section, Field, SaveStatus);
  - src/components/admin/report-parts.tsx (Stat);
  - src/components/admin/bar-chart.tsx (visits, slice 3);
  - src/components/admin/image-field.tsx and src/lib/upload-image.ts (photos, slice 3);
  - src/components/ui/* (Button, Chip, Input).
- src/lib/payouts.ts (earningStatus, sumAmounts, formatDay), src/lib/format.ts (formatRand) and src/lib/sessions.ts (todayInSouthAfrica). The safe field set matches toEarning in src/lib/admin/payouts.ts.
- src/lib/creator-credit.ts: rememberCreator already validates the slug and takes an injectable store for tests. Also src/components/site/remember-creator.tsx, and the create_booking check that only credits creators who recommend the experience (supabase/migrations/20261103090000_remove_service_fee.sql).
- src/lib/data/creators.ts: the cached getCreator(slug) gives the dashboard its list of picks for share links, and its cacheTag 'creator:<slug>' allows targeted refreshes. src/app/(site)/creators/[slug]/page.tsx stays the single public page.
- src/components/site/menu-button.tsx and src/lib/use-user.ts for the 'Creator dashboard' link. src/components/site/saved-sync.tsx is the pattern for a browser-only effect mounted in src/app/layout.tsx.
- Links switched to /@slug: src/app/sitemap.ts, the 'Recommended by' chip in src/app/(site)/experiences/[id]/page.tsx (~L215), and 'View on site' in src/app/admin/(console)/creators/[id]/page.tsx.
- Test templates:
  - e2e/admin.spec.ts (the lockout loop and the check that no private text appears);
  - e2e/browse.spec.ts (creator page and sitemap);
  - src/lib/creator-credit.test.ts and src/lib/payouts.test.ts.

#### New work

- Slice 0 (no migration):
  - the /@:slug rewrite in next.config.ts;
  - canonical, OpenGraph URL, sitemap and internal links switched to /@slug;
  - a CatchCreatorLink client component in src/app/layout.tsx, plus a pure viaFromSearch() helper with unit tests;
  - e2e tests: /@sarah-johnson shows the heading and canonical and also works as %40; ?via= is stored in localStorage; the sitemap lists /@ links;
  - optionally, the 308 redirect from /creators/:slug, only after a Vercel preview proves there is no loop.
- Slice 1, creator side:
  - migration 1, then pnpm db:types;
  - src/lib/creator/guard.ts (requireCreator);
  - src/lib/creator/data.ts (getMyEarnings, getMyPayouts);
  - src/lib/actions/creator.ts (claimCreatorInvite);
  - src/app/(site)/creator/layout.tsx and page.tsx: page link, share %, Stat cards, share links with Copy and WhatsApp (wa.me) buttons, the credited bookings list and a credit explainer, plus the not-linked state;
  - a small client CopyButton.
- Slice 1, admin side:
  - a 'Creator sign-in' Section on /admin/creators/[id];
  - listCreatorMembers in src/lib/admin/people.ts;
  - inviteCreatorMember and removeCreatorMember in src/lib/actions/admin-people.ts (Zod email, handling duplicate error 23505);
  - a 'Copy WhatsApp message' button;
  - optionally a 'Signed in' chip on the creators list.
- Slice 1, everywhere:
  - claim RPC calls in both auth routes;
  - a 'Creator dashboard' link in MenuButton;
  - a hint on the sign-in page when next=/creator;
  - e2e lockout tests for /creator: it redirects to /signin?next=%2Fcreator and the HTML contains no @example.com;
  - update docs/PROGRESS.md and the route list in AGENTS.md.
- Slice 2:
  - migration 2;
  - CreatorForm and CreatorPicksEditor refactored to take an action and a mode;
  - pages /creator/page and /creator/picks;
  - saveMyCreatorPage and saveMyPicks actions, calling updateTag('creator:<slug>'), plus 'experiences' for picks, then refresh();
  - an updated_at check in the admin saveCreator, so an admin save can't silently overwrite a creator's newer text.
- Slice 3:
  - migration 3 (visits and storage policies);
  - an owner folder in the uploadImage path;
  - ImageField in creator mode;
  - visit recording in RememberCreator and CatchCreatorLink, deduped per day;
  - a visits Stat and a 30-day BarChart on the dashboard.
- Later, and not part of this build:
  - TOTP enrolment for creators, required before any bank-details screen;
  - bank details and Paystack Transfers;
  - creator codes at checkout;
  - QR codes;
  - a host dashboard on the same membership pattern.

#### Effort estimate

**Build time** (one AI developer, owner approving each step):

- **Slice 0** (the /@handle address and ?via= links): about half a day, no migration.
- **Slice 1** (creators sign in, read-only dashboard, admin linking): about 2 days, plus 1 migration and 1 walkthrough.
- **Slice 2** (creators edit their own page text and picks): about 1.5 days, plus 1 migration.
- **Slice 3** (own photos and visit counts): about 2 days, plus 1 migration.
- **Total:** about 6 build days, or 1.5 to 2.5 weeks of calendar time with approvals. Each slice is S on its own; together they are M.

**Owner setup steps:**

1. **Make creator sign-in possible.** Choose one:
   - Create the Google sign-in client in Google Cloud and switch Google on in Supabase Auth. This is already on the launch list, takes about 20 minutes and is free. While the Google consent screen is in "Testing", add each pilot creator's Gmail as a test user.
   - Or connect an email service in Supabase.
   - The owner can test everything today without either, by inviting their own team email to the demo creator Zanele Eats. Supabase's default email does reach the owner's team.
2. **Run each migration.** Paste it into the Supabase SQL editor and report the check-query result. Claude then runs pnpm db:types.
3. **Approve each slice** after a browser walkthrough.
4. **For each real creator:** add their email under Admin, then Creators, then Creator sign-in, and send them the copied WhatsApp message.
5. **Make three decisions:**
   - Do creator edits publish instantly, or after approval?
   - Do creators earn on their own bookings?
   - What payout schedule text do creators see?

No Vercel, DNS, Paystack or Supabase redirect-URL changes are needed.

#### Running costs

R0 extra.

- No new service, vendor or plan. Vercel Pro (about $20 a month) is needed for any commercial launch anyway, not because of this option.
- Supabase load is tiny:
  - a few small queries per dashboard visit;
  - in slice 3, one visit-counter call per visitor, per creator, per day, stored as one row per creator per day.
- No domains, certificates or DNS.
- Google sign-in is free.
- The email service is a launch cost that customers need anyway.

The real ongoing cost is time:

- onboarding creators by WhatsApp;
- answering "why didn't I get credit for this booking?";
- in slice 2, keeping an eye on what creators publish.

#### Risks

- Creators can't receive email sign-in links until an email service is connected; Supabase's default email only reaches the owner's team.
  - Mitigation: use Google sign-in for the pilot (creators added as Google test users), or connect the email service.
  - The dashboard itself doesn't depend on email.
- Wrong email linked: if an admin types someone else's address, that person sees the creator's earnings, and from slice 2 can edit the page.
  - Mitigation: claiming needs a verified email.
  - Mitigation: the admin sees each address's status (waiting, or linked with a date) and can remove it; removal takes effect on the next page load.
  - Mitigation: the WhatsApp message names the address to sign in with.
- Permission mistakes are the main technical risk. Signed-in users have table-wide UPDATE on creators (admin saves rely on this), so a 'members update own row' policy would let a creator raise their own share.
  - The design forbids that policy.
  - All creator writes go through SECURITY DEFINER RPCs with search_path '' that check membership.
  - Each migration ends with a privilege-check query, and inspect-security.sql is run before and after.
- Guest privacy (POPIA): the earnings function must never return guest names, emails or phone numbers.
  - A creator could still occasionally guess who booked, for example a friend they sent the link to. This is the industry norm (Amazon reports by product).
  - Add an e2e or SQL check that the dashboard output carries no customer fields.
- The /@handle address hasn't been proven on Next 16.4: '@' folders mean parallel routes, though a config rewrite isn't a folder.
  - Prove it with a build and e2e in slice 0, including the %40 encoding.
  - Fallback: /c/<slug>.
  - Wait for a Vercel preview test before redirecting the old /creators/ path.
- Content creators publish (slice 2) goes live under Truth's brand.
  - Mitigation: creators are invite-only.
  - Mitigation: length limits and https-only links.
  - Mitigation: name, handle, follower count and 'Featured in' claims stay admin-only.
  - Mitigation: admins can edit or unlink at any time.
  - Mitigation: the owner can choose approval before publishing instead.
  - Admin saves could overwrite a creator's newer text, so add an updated_at check to saveCreator.
- Self-referral: a creator who books through their own link earns a share of their own booking, in effect a discount.
  - Signed-in bookings can be checked.
  - Guest checkout with another email can't be fully blocked.
  - This needs an owner decision, plus admin review of payouts.
- The visit counter (slice 3) can be inflated by anyone calling the public function, and bots that run scripts also count.
  - Label the numbers as indicative.
  - Never pay on visits or clicks.
- Credit expectations: credit needs the same device and browser within 30 days, goes to the last creator visited, and only counts for experiences the creator picked.
  - Expect 'my follower booked but I didn't get credit' questions.
  - The dashboard explainer and per-experience ?via= links reduce this.
  - Creator codes at checkout could come later.
- Building ahead of demand: there are no real creators yet, so slices 2 and 3 could build features nobody uses. Start each slice only when real creators ask for it.
- Base schema drift: the original tables and policies aren't in the repo, so the live storage and creators policies must be inspected before new ones are written.
- Changing a creator's handle breaks their old links and any stored credit. Keep it admin-only, with the existing warning.

#### What it unlocks

**A real creator programme Truth can pitch.** It has the same shape every big affiliate programme uses (Viator Shop, Expedia Travel Shops, Amazon, LTK): your own page on the platform, a login, share links, and transparent earnings paid in rands.

**Easy-to-share links.**

- Handles that are easy to say aloud and fit in a bio (truth.co.za/@zanele-eats), in the familiar TikTok, YouTube and Medium "/@handle" style.
- Deep links to each experience. Linking from every post matters more for bookings than a branded domain.

**Less admin work**, once creators maintain their own pages and picks.

**Trust.** Creators see every credited booking and payout themselves. Surveys rank "not getting paid" among creators' top frustrations.

**A reusable membership pattern** (creator_members, then host_members). It could later power a host dashboard where hosts see their bookings and block dates, which may be worth even more.

**Own domains at no cost to Truth.** Creators who want their own domain forward it to their Truth page.

**Small next steps once accounts exist:**

- creator codes typed at checkout (create_booking's existing p_creator_slug parameter already carries one);
- QR codes for markets and events;
- themed collections;
- "creator-tested" reviews;
- bank details plus Paystack Transfers for automatic payouts (creators would need TOTP first);
- conversion data (visits to bookings) showing Truth which creators to recruit or pay more.

#### Is it worth it? (for and against)

**For:**

- It's the industry standard, and the cheapest way to make "the page is theirs" true. Creators control their own words, picks and photos, under their own handle address.
- It answers the login question: one account per person, with roles added as rows.
- Most of the hard parts already exist and are tested:
  - sign-in;
  - same-domain credit;
  - earnings calculated by a database trigger;
  - payout records;
  - admin editors;
  - shared form, stat and chart components.
- It needs no new services and costs R0 a month.
- It adds no DNS support and no cross-domain login problems.
- It keeps one trusted checkout domain (important in a market with high online card fraud) and one place for the POPIA notice.

**Against:**

- Truth has zero real creators. With 2 to 5 creators, admins can run pages by hand and send monthly statements by WhatsApp ("do things that don't scale").
- Creators can't receive email sign-in links until the email service is connected.
- Self-editing adds moderation and support duties.
- The time could go to launch work instead (hardening, email service, production settings), which is currently on hold.

**Verdict:** worth doing in thin slices, timed to real demand.

- **Slice 0 (half a day):** worth doing now. It improves demos and creator pitches and depends on nothing.
- **Slice 1:** build it when the first real creator agrees to join. Seeing their own bookings and earnings is the trust feature that closes recruitment.
- **Slice 2:** only when creators ask for changes more than about weekly.
- **Slice 3:** on request.
- Compared with subdomains or custom domains, this gives most of the creator value for a fraction of the cost and risk.
- Custom domains are not worth building now; offer domain forwarding instead.

#### What to build first

**Slice 1: creators can log in and see their numbers.** It is read-only, takes about 2 to 3 days including slice 0, and needs one migration.

**What gets built:**

- An admin adds the creator's email on the creator's admin page.
- The creator signs in at truth.co.za/creator with the normal sign-in. That is Google, or for testing, the owner's own team email.
- The creator sees:
  - their page address, truth.co.za/@handle;
  - their share %;
  - Copy and WhatsApp share links (?via=) for each pick;
  - their credited bookings and earnings, with status and no guest details.
- Editing stays with the admin.
- No changes to the proxy, cookies, Supabase redirect URLs or checkout.

**Done means:**

- pnpm check and e2e pass.
- /creator is locked to signed-out visitors and leaks nothing.
- The owner, linked to the demo creator Zanele Eats, signs in and sees a test booking's earning appear after a Paystack test payment.
- That earning then shows as Paid after the owner records a payout.

**Even smaller, and shippable today:** just the /@handle address plus ?via= links. That is half a day, with no migration and no owner setup.

---

### Option B: Creator mini-sites on Truth subdomains, plus a Creator Studio (brand-first)

**In one line:** Every creator gets a branded page at their-name.truth.co.za, with their own colours, font and link-in-bio blocks, and edits it in a Creator Studio on truth.co.za. Sign-in, bookings and Paystack checkout stay on truth.co.za, and the creator's credit follows the guest from the subdomain to Truth's checkout.

**Effort:** L

#### What the creator experiences

GETTING IN

- In admin, Truth adds the creator: their name, a short web name such as "zanele" (this becomes zanele.truth.co.za) and their share.
- Under a new "Logins" section, Truth enters the creator's email address.
- The creator goes to truth.co.za/studio. They sign in with an email link or "Continue with Google" using that address. This is the same sign-in customers use, with no password and no separate creator account.
- Once the email is confirmed, the account is linked to their page and they land in the Creator Studio.
- If they already had a customer account under that email, it is the same account. Their bookings, saved experiences and studio sit together, and the main menu shows both "My bookings" and "Creator studio".
- If they later run experiences as a host, the same account can get host access through the same login table. That is not built in this option.

WHAT'S IN THE STUDIO (truth.co.za/studio)

- Overview:
  - their page address, with Copy and Share buttons and a QR code;
  - an "Edit my page" button;
  - bookings made through them this month;
  - earnings: due, upcoming and paid.
- My page:
  - Pick a look:
    - one of about six colour themes (for example Truth violet, Atlantic, Fynbos, Karoo or Ink), each with a matching dark version;
    - one of 2–3 fonts;
    - "always light", "always dark" or "follow the visitor's phone".
  - Set their cover and profile photos, bio, quote, location, tags and social links.
  - Arrange blocks like a link-in-bio page, adding, reordering or hiding:
    - Hero: cover, split or simple.
    - My picks: big cards or small tiles.
    - My links: buttons to their YouTube, newsletter or brand deals.
    - Collections: themed lists made from their picks, such as "Cape Town date nights".
    - About, Quote, Featured in, Socials and a short Text block.
  - A live preview shows the page in their theme, light and dark. Nothing goes live until they press Publish.
- Picks: tick experiences from Truth's live list.
- Earnings:
  - one line per booking, showing the date, experience, booking value, their percentage, their amount and the status (Upcoming, Due, Paid or Cancelled);
  - the payments they have received.
  - It never shows a guest's name, email or phone number.

WHAT THEY CANNOT CHANGE

- Their share and their web name. These stay admin-only, because the web name is both their address and the key that credits them for bookings.
- Truth's checkout.
- The disclosure line on their page: "Zanele earns a commission from Truth when you book through this page. You pay the same price."

SMALL TOUCHES

- When they view their own page in a browser where they've used the studio, an "Edit my page" pill appears. This is a harmless hint, and the studio still checks their login.
- The studio help explains how to forward a domain they already own (for example zaneleeats.co.za) to their Truth page at their registrar. Truth has to do nothing, and credit still works.

UNTIL THE EMAIL SERVICE IS CONNECTED

- Truth's team edits each creator's page in admin using the same editor, and creators send changes by WhatsApp.

#### What the customer experiences

ON THE CREATOR'S PAGE

- A guest taps "zanele.truth.co.za" in Zanele's Instagram or TikTok bio, or in a WhatsApp message.
- They see her page in her colours and font: her cover photo, her picks as cards, her other links, her quote and a short "Featured in" list.
- A clear line says bookings are handled by Truth and that she earns a commission at no extra cost to them.
- Nothing asks them to sign in, and the page loads instantly because it is built in advance.

BOOKING

- Tapping an experience opens Truth's normal experience page on truth.co.za.
- A small ribbon reads "Booking through Zanele Eats' page · Back to her picks". It only appears when she will really be credited, which is when she recommends that experience.
- They pick a time and book as a guest with name, email and phone, as today. Or they sign in on truth.co.za with an email link or Google.
- They pay on Paystack with Truth as the merchant. The hold page, confirmation and My bookings are all on truth.co.za.

LOGGING IN

- Customers always sign in on truth.co.za.
- The creator's page has no personal features, so a signed-in customer simply looks signed out there.
- Its footer links "My bookings" and "Sign in" to truth.co.za.
- Saved hearts live on truth.co.za. They are hidden on creator pages at first. Otherwise a guest could end up with a saved list that never shows up on Truth, because each web address keeps its own browser storage.

CREDIT

- Visiting her page credits Zanele for that device for 30 days. This holds even if the guest comes back later by typing truth.co.za directly. The last creator visited wins, which is exactly how it works today.
- Any link a creator shares that carries ?via=zanele, for example a single experience link in a WhatsApp chat, also credits her.

#### Web addresses

- Creator page: https://zanele.truth.co.za.
  - The subdomain is the creator's existing web name (slug).
  - Rules: at most 63 characters; lowercase letters, numbers and dashes.
  - Reserved names: www, admin, api, studio, app, auth, pay, payments, checkout, secure, login, signin, account, help, support, blog, mail, cdn, static, images, status, dev, staging, test, demo, truth.
  - Demo creators would be zanele-eats.truth.co.za and trail-and-tide.truth.co.za. Shorter slugs can be chosen before launch.
- Old path: https://truth.co.za/creators/zanele redirects to https://zanele.truth.co.za.
  - The redirect is temporary (307) at first and permanent (308) once settled.
  - On the dev server and on Vercel preview links, the path keeps showing the same page, because previews can't have per-creator subdomains.
- Any other path on a creator host (zanele.truth.co.za/experiences/…, /admin, /signin, /sitemap.xml) is sent to the same path on https://truth.co.za.
- Links from a creator page into Truth: https://truth.co.za/experiences/<id>?via=zanele. This also works as a share link creators can paste anywhere.
- Creator Studio: https://truth.co.za/studio, /studio/page, /studio/picks and /studio/earnings.
- Customers: https://truth.co.za/signin, /account/bookings and /saved.
- Admin: unchanged at https://truth.co.za/admin.
- Local testing: http://zanele-eats.localhost:3000. The Next dev server already accepts *.localhost. End-to-end tests use http://zanele-eats.localhost:3100.
- A creator's own domain (optional, no Truth work): they set their registrar to forward zaneleeats.co.za (301) to https://zanele.truth.co.za.
- Later, separate option: real custom domains served by Truth. These would need a lookup in the proxy plus Vercel's domains API.

#### How it works technically

1. HOSTNAME ROUTING: next.config.ts only; the proxy is untouched

- One new setting, NEXT_PUBLIC_CREATOR_SITES_ROOT, turns the feature on.
  - Production: "truth.co.za". Locally: "localhost:3000". End-to-end tests: "localhost:3100".
  - When it is unset, the site behaves exactly as today.
- next.config.ts gains rules that match on the hostname. Next documents this for redirects and rewrites as has: [{ type: 'host', value }].
- Next's matchHas (node_modules/next/dist/esm/shared/lib/router/utils/prepare-destination.js):
  - lowercases the host and strips the port;
  - anchors the pattern as ^value$;
  - turns named capture groups into parameters.
- The creator-host pattern:
  (?<slug>(?!(?:www|admin|api|studio|...)\.)[a-z0-9]+(?:-[a-z0-9]+)*)\.truth\.co\.za
- Rewrite (beforeFiles): source '/' with that host goes to destination '/creators/:slug'.
- Redirects:
  - On a creator host, every path except _next/*, favicon.ico and robots.txt goes to https://truth.co.za/:path (temporary).
  - On the main host only, /creators/:slug goes to https://:slug.truth.co.za/.
- Order of execution (rewrites.md, proxy.md): config redirects, then the proxy, then beforeFiles rewrites. So:
  - src/proxy.ts and src/lib/supabase/proxy.ts (updateSession, getClaims, copying cookies and no-store headers) need no change.
  - On creator hosts there is no session cookie, so getClaims has nothing to refresh.
- Spoofing is blocked because redirects look at the incoming path: zanele.truth.co.za/creators/other goes to truth.co.za/creators/other, which goes to other.truth.co.za.
- Same shape as Vercel's Platforms starter: the tenant host is rewritten to an internal path, and app paths are sent back to the main domain. It is done in config because the tenant key is the hostname itself.
- A proxy lookup is only needed if real custom domains come later. That is where the starter does it.

2. RENDERING AND CACHE (cacheComponents, partialPrefetching)

- The existing route moves from src/app/(site)/creators/[slug] to a new group, src/app/(creator)/creators/[slug].
  - The URL is unchanged.
  - The group's layout is a pass-through, so the Truth footer doesn't appear.
- Kept as they are:
  - generateStaticParams;
  - params.then(...) inside Suspense;
  - getCreator ('use cache', cacheLife('hours'), cacheTag('creators', 'creator:<slug>')).
- getCreator's select also embeds the creator_sites row through its foreign key.
- Nothing reads headers() or cookies(). Both hosts serve the same prerendered entry. A creator added after the build gets the app shell first, then an ISR entry (incremental-static-regeneration-cache-components.md).
- Publishing calls updateTag('creator:<slug>'). This is the first code to target that tag. Picks changes also call updateTag('experiences').
- generateMetadata returns an absolute canonical and og:url (https://zanele.truth.co.za/) and an absolute title.
- No per-creator browser theme colour: generateViewport that reads params is deferred to request time under Cache Components (generate-viewport.md).

3. THEMES BUILT ON THE EXISTING ROLE TOKENS

- Presets live in src/app/globals.css as [data-brand='fynbos'] { --accent; --accent-soft; and optionally --canvas/--surface }.
- Dark values sit under the same three selectors the file already uses: prefers-color-scheme with :not([data-theme='light']), :root[data-theme='dark'], and .scheme-dark.
- A new .scheme-light class serves creators who force light.
- The page wrapper gets data-brand, data-font, a scheme class, and "bg-canvas font-sans min-h-dvh". Because these come from cached data, the page stays static.
- Each preset is checked for 4.5:1 contrast in light and dark:
  - accent text on accent-soft chips;
  - canvas-coloured text on an accent-coloured brand button.
- Fonts: Archivo plus one or two next/font families declared in the (creator) layout.
- Creators never get free colours, CSS, HTML or scripts.

4. BLOCKS

- creator_sites.blocks is a JSON array validated by a Zod discriminated union in src/lib/sites.ts:
  - hero {style}
  - picks {style: cards|tiles, title?}
  - links {items ≤12 of label + https url}
  - collection {title, experienceIds that must be among their picks}
  - about, quote, featured, socials
  - text {heading, body}
- Blocks are validated three times: in the server action, by a type and size check in SQL, and again on read, where invalid blocks are dropped.
- Profile content stays in the creators columns, so experience pages and payouts keep one source.
- Rendering uses only Truth's components:
  - React-escaped text;
  - https-only links via toHttps / the link helper in src/lib/admin/form.ts, with rel="noopener noreferrer ugc";
  - images only from Truth storage or the seed photos.

5. LINKS AND CREDIT ACROSS SUBDOMAINS

- Each subdomain is its own origin, so localStorage keys (truth-creator, truth-saved, truth-theme) don't cross between them. Two additions handle this.
- (a) A shared credit cookie. On the creator page, RememberCreator also writes:
  truth-creator=<slug>.<until>; Domain=.truth.co.za; Path=/; Max-Age=2592000; SameSite=Lax; Secure
  - All *.truth.co.za hosts are the same site, so this is a normal first-party cookie.
  - It holds only a public slug and an expiry date.
- (b) Tagged links. Every link into Truth is an absolute plain <a>, built by truthUrl(path, via), that adds ?via=<slug>. multi-zones.md says links across domains should use <a>, not <Link>, to avoid prefetch and soft navigation.
- On truth.co.za, a CaptureVia client component sits in the root layout next to SavedSync. In an effect, it:
  - reads location.search, which keeps pages static;
  - calls rememberCreator;
  - strips via with window.history.replaceState, which Next supports.
- creditedCreator() returns whichever of localStorage and the cookie has the later expiry. "Last visit wins" is kept.
- Unchanged:
  - BookingWidget, the book page and createBooking;
  - the create_booking RPC, which still credits only a creator who recommends the booked experience.
- ExperienceCard and ExperienceTile get optional href and saveable props, so hearts can be hidden on creator pages.
- ViaCreatorRibbon (client) matches the credited slug against experience.recommendedBy, which already has name, slug and avatarUrl.

6. LOGINS AND ROLES

- Sign-in happens only on truth.co.za, using the existing email link and Google flow: src/lib/actions/auth.ts, then /auth/confirm or /auth/callback.
- Supabase Site URL and the redirect allow-list cover only the main domain. Google's PKCE verifier cookie therefore never has to cross hosts.
- One account per email, with roles held in tables:
  - customer: any signed-in user;
  - creator: a partner_members row;
  - admin: unchanged (admins row plus aal2);
  - host, later: a partner_members row with recipient 'host'.
- After a verified sign-in, both auth routes call claim_my_partner_invites() next to claim_my_bookings(). /auth/confirm already accepts type 'invite'.
- The studio lives in src/app/studio/(console) and copies the admin console pattern: instant = false, plus <Suspense><Guarded>.
- requireCreator() in src/lib/studio/guard.ts:
  - getClaims, then sub, then a membership check;
  - signed-out visitors go to /signin?next=/studio.
- MenuButton shows "Creator studio" after the browser reads the user's own membership row, which row-level security allows. Pages stay static.
- The studio also sets a harmless hint cookie, truth-studio=<slug> on .truth.co.za, which shows the "Edit my page" pill. It grants nothing.

7. HOW THE STUDIO READS AND WRITES

- All writes and reads go through database functions that run with elevated rights (SECURITY DEFINER), set search_path = '', are revoked from anon, and check membership first:
  - creator_update_profile: allowed columns only, never slug or revenue_share_percentage. This is needed because UPDATE on creators is table-wide for authenticated users and only row-level security limits it today.
  - creator_save_site_draft and creator_publish_site.
  - creator_replace_my_picks: a copy of admin_replace_creator_experiences limited to live experiences.
  - creator_my_overview, creator_my_earnings and creator_my_payouts. These return safe projections of payout_items and payouts: date, title from experience_snapshot, value, rate, amount, due_on, payout date. They never return guest name, email or phone (POPIA). Status uses earningStatus from src/lib/payouts.ts.
- Photos: storage policies let members insert and delete under images/creators/<creator_id>/…. uploadImage gets a subfolder, and a stricter isCreatorImageUrl(url, creatorId) checks saved URLs.

8. SEO

- sitemap.ts lists the subdomain URLs.
- robots.ts already outputs "Sitemap: https://truth.co.za/sitemap.xml", and it is served on every creator host because the redirect skips robots.txt. That is the sitemaps.org cross-submission proof that allows subdomain URLs in the main sitemap.
- Experience content stays canonical on truth.co.za, and creator pages link to it rather than copying it.

9. SECURITY HEADERS

- next.config headers() uses the same host match to give creator hosts a Content Security Policy without nonces. Nonces would force dynamic rendering (content-security-policy.md). The policy:
  - script-src 'self' 'unsafe-inline';
  - img-src self, Supabase storage and Pexels;
  - connect-src Supabase;
  - frame-src only the YouTube-nocookie and TikTok players, if a video block is added;
  - frame-ancestors 'self'.

10. OPTIONAL LATER: one login shared across subdomains (not in the default plan)

- Recipe:
  - the same cookieOptions.domain, read from an env var, in src/lib/supabase/client.ts, server.ts and proxy.ts (signOut then clears the old host-only cookie automatically);
  - extend safeNext to allow https://<valid-slug>.truth.co.za/;
  - never submit truth.co.za to the Public Suffix List.
- Trade-off: @supabase/ssr 0.12.7 sets httpOnly: false. Any script injection on any subdomain could then steal any session, including admin aal2 sessions.
- Only do this with "no creator-authored code" as a hard rule, and ideally with the admin console on its own host-only session.

Critical files:

- next.config.ts
- src/app/(site)/creators/[slug]/page.tsx (moving to the (creator) group)
- src/lib/data/creators.ts
- src/lib/creator-credit.ts
- src/app/globals.css
- the new src/lib/sites.ts and supabase/migrations/*_creator_sites.sql

#### Database changes

- Migration 1, creator_sites: one row per creator (creator_id is the primary key and references creators, on delete cascade). Columns: theme text (check in 'truth', 'atlantic', 'fynbos', 'protea', 'karoo', 'ink'), font text (check in 'archivo', 'fraunces'), scheme text (check in 'auto', 'light', 'dark'), blocks jsonb (check jsonb_typeof = 'array' and pg_column_size <= 32768), draft jsonb (nullable object holding theme, font, scheme and blocks), published_at, hidden_at (admin kill switch), updated_at and updated_by default auth.uid(). Turn on row-level security and revoke all from anon and authenticated. Grant SELECT on (creator_id, theme, font, scheme, blocks, published_at, hidden_at) only, so the draft stays private. Add a public read policy. There is no direct write grant: all writes go through functions. Seed one row per existing creator with the default blocks (today's layout). End with a one-line check query, as the repo convention requires.
- Migration 1, same file: alter table creators add constraint creators_slug_subdomain_safe. The check enforces char_length(slug) <= 63, slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$', and slug <> all(reserved names array). This is additive: the current four slugs comply. The admin Zod schema mirrors it (63 instead of 80, plus the reserved list).
- Migration 2, partner_members: id, user_id (references auth.users, on delete cascade), recipient text check in ('host', 'creator'), host_id (references hosts), creator_id (references creators), role text check in ('owner', 'editor') default 'owner', created_at. The checks ((recipient = 'host') = (host_id is not null)) and ((recipient = 'creator') = (creator_id is not null)) mirror payouts and payout_items. Unique on (user_id, creator_id) and on (user_id, host_id). Row-level security: users read their own rows; an 'Admins manage partner members' policy uses is_admin(). Only creators are used now; hosts can be added later without another table.
- Migration 2, partner_invites: id, recipient, host_id or creator_id (same checks), email text (check email = lower(email), at most 254 characters), role, created_by default auth.uid(), created_at, expires_at default now() + 14 days, accepted_at and accepted_by. Admin-only through row-level security, like the other 'Admins manage …' tables.
- Migration 2, functions. All are SECURITY DEFINER with set search_path = '', revoked from public and anon, and granted to authenticated:
  - is_creator_member(p_creator_id): stable.
  - claim_my_partner_invites(): modelled on claim_my_bookings; requires email_confirmed_at, skips expired invites, inserts the membership and marks the invite accepted.
  - try_uuid(text): returns null instead of an error, for storage policies.
- Migration 3, studio functions. Each checks is_creator_member(p_creator_id) or is_admin():
  - creator_update_profile(p_creator_id, p_profile jsonb): allowed columns only (name, location, bio, signature_quote, avatar_url, cover_image_url, follower_count, personal_tags, featured_in, social_*). Never slug or revenue_share_percentage. Image URLs must be in the creator's own folder or unchanged.
  - creator_save_site_draft(p_creator_id, p_draft jsonb): checks the block type whitelist, a maximum of 20 blocks, and size.
  - creator_publish_site(p_creator_id): returns the slug, so the server action can call updateTag.
  - creator_replace_my_picks(p_creator_id, p_experience_ids uuid[]): a copy of admin_replace_creator_experiences limited to is_active experiences, maximum 100.
  - creator_my_overview(p_creator_id): returns their share, which column grants hide from them, plus bookings and earnings totals.
  - creator_my_earnings(p_creator_id, p_year): per-booking lines with no guest personal data.
  - creator_my_payouts(p_creator_id): paid_on, amount and reference, without the admin note.
  - admin_set_site_hidden(p_creator_id, p_hidden).
- Migration 3, storage policies on storage.objects for bucket 'images'. Members may insert and delete where (storage.foldername(name))[1] = 'creators' and public.is_creator_member(public.try_uuid((storage.foldername(name))[2])). Existing admin policies and flat admin upload paths are untouched.
- No changes to bookings, create_booking, payout_items, payouts or the earnings triggers. The credit pipeline and money engine are reused as they are.

#### What it reuses

- src/app/(site)/creators/[slug]/page.tsx: becomes the creator page renderer. The URL stays the same, and it keeps generateStaticParams, params.then inside Suspense and generateMetadata. It moves into a (creator) route group.
- src/lib/data/creators.ts: getCreator ('use cache', cacheLife('hours'), cacheTag('creators', 'creator:<slug>')) and getCreatorSlugs. The public-safe select is extended to embed creator_sites.
- src/proxy.ts and src/lib/supabase/proxy.ts: reused unchanged. updateSession runs before the host rewrites.
- src/app/globals.css: the role tokens (--accent, --accent-soft, --canvas, --surface), .scheme-dark and the light: variant. The brand presets extend the same tokens.
- src/components/experience/experience-card.tsx, experience-tile.tsx, experience-grid.tsx (ExperienceGrid, TileGrid) and favorite-button.tsx: the picks and collection blocks. They gain optional href and saveable props.
- src/components/ui/button.tsx, chip.tsx, sheet.tsx and input.tsx: shared UI for the blocks and the studio.
- src/lib/creator-credit.ts (with creator-credit.test.ts) and src/components/site/remember-creator.tsx: 30-day, last-visit-wins credit. Storage can already be swapped in for tests.
- src/components/booking/booking-widget.tsx, src/app/(site)/experiences/[id]/book/page.tsx, src/lib/actions/booking.ts and create_booking in supabase/migrations/20261103090000_remove_service_fee.sql: the credit-to-booking pipeline, unchanged.
- src/app/(site)/experiences/[id]/page.tsx and src/lib/data/experiences.ts: the recommendedBy data ({name, slug, avatarUrl}) for the 'Booking through' ribbon. The 'Recommended by' chips point to the subdomains.
- src/lib/actions/auth.ts, src/app/auth/confirm/route.ts (already accepts type 'invite'), src/app/auth/callback/route.ts, src/components/auth/sign-in-form.tsx, src/app/(site)/signin/page.tsx and src/lib/safe-next.ts: one sign-in for customers and creators. Only the claim call is added.
- src/lib/admin/guard.ts and src/app/admin/(console)/layout.tsx: the model for requireCreator() and the studio layout (instant = false, Suspense plus Guarded).
- src/lib/admin/form.ts (with form.test.ts): FormState, text, tags, link (toHttps), socialLink, SOCIAL_PROFILES and imageUrl, for the studio forms and the link blocks.
- src/components/admin/creator-form.tsx, creator-picks-editor.tsx, image-field.tsx, save-status.tsx (Section, Field, SaveStatus), report-parts.tsx (Stat) and bar-chart.tsx: shared by admin and the studio once the save action is passed in instead of hard-wired.
- src/lib/upload-image.ts and src/lib/images.ts: browser uploads and storage paths, with a per-creator subfolder and a stricter URL check.
- src/lib/payouts.ts (earningStatus, sumAmounts, groupPayoutsByMonth, formatDay) and src/lib/format.ts (formatRand): the studio Earnings view.
- supabase/migrations/20261029140000_claim_bookings.sql, 20261031090000_private_people_columns.sql and 20261101090000_payouts.sql: patterns for the claim function, column grants, admin_replace_creator_experiences, and the recipient/host_id/creator_id checks.
- src/lib/use-user.ts and src/components/site/menu-button.tsx: login state read in the browser. A 'Creator studio' row is added.
- src/app/sitemap.ts and src/app/robots.ts: list the subdomain URLs. The existing Sitemap line serves as cross-submission proof.
- e2e/admin.spec.ts (signed-out lockout loop), e2e/browse.spec.ts (creator page and sitemap) and playwright.config.ts.
- Next 16 docs in node_modules/next/dist/docs/01-app: 03-api-reference/05-config/01-next-config-js/rewrites.md and redirects.md (host matching and order), 02-guides/multi-zones.md (plain <a> across domains), 02-guides/incremental-static-regeneration-cache-components.md, 02-guides/content-security-policy.md, and 03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md (*.localhost).

#### New work

- next.config.ts: host-matched redirects() and rewrites().beforeFiles, plus CSP headers() for creator hosts. All are behind NEXT_PUBLIC_CREATOR_SITES_ROOT, with the protocol and port taken from NEXT_PUBLIC_SITE_URL.
- src/lib/sites.ts, with tests:
  - reserved subdomains and the slug-as-hostname rules;
  - creatorSiteUrl(slug), which returns the subdomain or /creators/<slug> depending on the flag;
  - truthUrl(path, via);
  - the theme, font and scheme lists;
  - the Zod discriminated union for blocks;
  - DEFAULT_BLOCKS, which reproduce today's page.
- Colour presets in globals.css (4–6, each in light and dark) plus a .scheme-light class. Each is contrast-checked to 4.5:1 and shown in /styleguide and on the design board for the owner to choose.
- Creator page components in src/components/creator-site/:
  - a slim branded header;
  - hero variants;
  - about, quote, picks (cards or tiles), links, collection, featured, socials and text blocks;
  - the fixed commission disclosure;
  - a 'Powered by Truth · My bookings · Sign in' footer, plus 'Get your own page' as a recruiting link;
  - the 'Edit my page' hint pill.
- Move the creator route to src/app/(creator)/creators/[slug] with a pass-through layout. The canonical, og:url and title become absolute. The 404 page's links become absolute, so they work on creator hosts. (On Windows, stop the dev server before moving folders.)
- Credit across subdomains:
  - the parent-domain cookie in creator-credit.ts, with tests;
  - a CaptureVia client component in the root layout;
  - a ViaCreatorRibbon on the experience and book pages;
  - href and saveable props on ExperienceCard and ExperienceTile;
  - a CreatorLink for the 'Recommended by' chips (a plain <a> to the subdomain when the flag is on).
- Migrations 1 to 3 as listed: creator_sites, the slug constraint, partner_members and partner_invites, the functions, and the storage policies. Each ends with a check query and is pasted by the owner. Then run pnpm db:types.
- Creator Studio:
  - src/lib/studio/guard.ts (requireCreator);
  - src/app/studio/(console)/layout.tsx;
  - pages for overview, My page (editor with live preview, drafts and Publish), Picks and Earnings;
  - src/lib/actions/studio.ts (Zod, then the functions, then updateTag('creator:<slug>') and 'experiences').
- Admin additions on /admin/creators/[id]:
  - a 'Mini-site' section using the same editor component with an admin action;
  - a 'Logins' section to invite or remove;
  - a 'Hide site' switch.
    Also split the creator Zod schema into shared profile fields and admin-only slug and share.
- Auth routes: call claim_my_partner_invites() after claim_my_bookings() in /auth/confirm and /auth/callback. MenuButton shows 'Creator studio' when a membership row exists.
- Tests:
  - unit: sites.ts and the credit cookie with via;
  - e2e: zanele-eats.localhost:3100 renders in its theme;
  - e2e: app paths on creator hosts redirect to the main domain;
  - e2e: /creators/:slug redirects when the flag is on;
  - e2e: signed-out lockout for /studio pages;
  - e2e: ?via= reaches the book form's hidden creator field.
- Owner-facing content: a creator help page (sharing your page, forwarding your own domain), creator page terms (no misleading links, Truth may hide pages), privacy notice wording for the credit cookie, and PROGRESS.md updates.
- Later, optional:
  - page-view and click counts in our own daily aggregate table (sendBeacon to a route handler, no IP stored);
  - per-creator share images (opengraph-image);
  - a login shared across subdomains (recipe in the technical section).

#### Effort estimate

About 8–12 build sessions in four slices. At the current pace of approving one step at a time, that is roughly 2–4 weeks.

The slices:

1. Themes, link-in-bio and ?via= on today's creator page, edited in admin: 1–2 sessions.
2. Subdomains, credit across subdomains, SEO and the security policy: 1–2 sessions. This can be shown locally at zanele-eats.localhost:3000 before any domain exists.
3. Creator logins plus Studio v1 (overview, profile, picks, earnings): 3–4 sessions.
4. The self-serve page editor with drafts, preview, Publish and own-photo uploads: 2–3 sessions.

Optional later: page-view stats (1–2 sessions), and one login shared across subdomains (1–2 sessions plus a security review). Real custom domains are a separate option.

Owner setup steps:

1. Register the production domain at a .co.za registrar (about R109 a year).
2. On Vercel Pro:
   - Add truth.co.za, www.truth.co.za (redirecting to truth.co.za) and *.truth.co.za.
   - Switch the domain's nameservers to Vercel (ns1/ns2.vercel-dns.com). The wildcard certificate needs this, or the alternative _acme-challenge delegation. Copy any email (MX) records across first.
3. In Vercel, set NEXT_PUBLIC_SITE_URL=https://truth.co.za and NEXT_PUBLIC_CREATOR_SITES_ROOT=truth.co.za, then redeploy.
4. In Supabase Auth:
   - Set the Site URL to https://truth.co.za and the redirect URLs to the main domain only. No subdomains are needed, because sign-in never happens on them.
   - Connect an email service such as Resend, so creators outside the owner's team receive sign-in links.
5. Paste each migration into the SQL editor and confirm its check line.
6. Pick the colour presets on the design board.
7. Decide the policies:
   - whether creators publish instantly or wait for admin approval;
   - which fields creators may edit;
   - the disclosure wording and creator terms;
   - whether Earnings needs the authenticator code. Recommended only once bank details are stored.

#### Running costs

Close to zero on top of what launch already needs.

- Vercel: Pro is $20 a month (about R350–R400). Truth needs it anyway, because Hobby is for non-commercial use only and Truth takes payments. Wildcard subdomains and their certificates cost nothing extra. Creator pages are built in advance, so they use very little computing.
- Domain: the .co.za costs about R109 a year, and Truth needs one anyway.
- Supabase: a few small tables plus creator photos (up to 2 MB each) fit within the current plan.
- Email: Resend's free tier (3,000 emails a month, 100 a day) covers invites and sign-in links at this stage. Its Pro plan is $20 a month later. The email service is needed for customer sign-in anyway.
- Optional page-view counts kept in Truth's own table cost nothing.
- Not needed for this option: Vercel Enterprise, Supabase custom domain ($10 a month), Global Config, Cloudflare for SaaS and Entri.

The real ongoing cost is people's time:

- answering creators' design requests;
- reviewing the links and photos creators publish on Truth subdomains;
- support questions like "my page looks wrong" or "my link doesn't work".

#### Risks

- Building ahead of demand. There are no real creators yet, so a page builder and studio may go unused. Mitigation: build in slices, and start the studio only once the email service is connected and 3–5 creators are signed.
- Scope creep into a website builder. Every creator will want one more option, and support work grows with each. Mitigation: presets only, a fixed list of blocks, and no custom CSS, HTML or embeds.
- Brand safety and moderation. Creators publish links, photos and text under a Truth web address. A scam or phishing link, or an inappropriate image, reflects on Truth, and safe-browsing lists can flag the whole domain. Mitigation:
  - links must be https and carry rel=ugc;
  - photos only from Truth storage;
  - an admin 'Hide site' switch;
  - creator terms;
  - only admins create web names, and names like pay, secure and login are reserved.
- Login seams. A signed-in customer looks signed out on creator pages, and hearts saved there wouldn't appear on truth.co.za, so hearts are hidden there. Sharing the login across subdomains would fix this, but Supabase's cookie can be read by scripts (httpOnly false). Every subdomain, including admin aal2 sessions, would then be exposed to any script-injection bug.
- Credit gaps:
  - The shared credit cookie only works on the real domain. Domain=localhost handling varies by browser, so the cookie part must be tested on the production domain; e2e tests cover ?via=.
  - Cookie-blocking browsers lose credit, as today.
  - In-app browsers (Instagram, TikTok) that hand off to another browser lose credit, as today.
- Routing on Vercel isn't proven yet. Host-matched beforeFiles rewrites into a prerendered Cache Components route should be served from cache, but this must be checked on a real deployment. Vercel preview links can't show per-creator subdomains (per-tenant previews are Enterprise-only), so previews use the /creators/<slug> path.
- DNS change. A wildcard certificate needs Vercel nameservers or _acme-challenge delegation. Moving nameservers can break the business email if the MX records are not copied first.
- The web name is tied to the subdomain:
  - the DNS limit is 63 characters;
  - some names are reserved;
  - renaming a slug breaks the creator's printed and shared links, stored credit and search ranking.
    Keep slugs admin-only, use a 307 redirect before the 308, and add slug-history redirects later if needed.
- Security of the new write paths. The membership checks in the database functions and the storage path policies must be exact. UPDATE on creators is table-wide for signed-in users, so creators must never write that table directly. Otherwise they could change their own share.
- Accessibility and design quality. Free colour choice would break contrast and dark mode. Mitigation: only contrast-checked presets, in light and dark.
- SEO uncertainty. Subdomains may not gain authority as fast as Truth's own paths, and thin pages (a bio and six picks) may rank poorly. Most traffic will come from social bios anyway.
- POPIA and advertising rules:
  - the studio must never show guests' names, emails or phones;
  - the commission must be disclosed clearly (IAB SA 2026 disclosure toolkit, ARB rulings);
  - the credit cookie must be covered in the privacy notice.
- Dependence on items on hold. The production domain, the email service and the launch settings are paused, so slices 2–3 can't go live until they're done.
- Brand split at checkout. Guests may not realise Truth handles the payment. Mitigation: the 'Bookings handled by Truth' line, the 'Booking through …' ribbon, and the same Paystack checkout as today.

#### What it unlocks

- **A reason for creators to put Truth in their bio.** The page replaces Linktree for travel and food creators: their links, their look and their bookable picks at one short address. Every page footer ("Get your own page") becomes a way to recruit creators.
- **Self-service.** Creators edit their own pages and picks, so the owner stops being the bottleneck for every change.
- **Visible earnings.** Each creator sees their own booking lines and payments. Surveys say pay is creators' top frustration, so this builds trust and keeps creators.
- **Branded checkout without moving payments.** The "Booking through …" ribbon carries the creator's brand onto Truth's checkout, and the money stays on one trusted checkout.

It also lays groundwork for later features:

- collections and themed guides;
- per-pick share links and QR codes for events;
- creator codes for WhatsApp and offline sales;
- host logins and a host tab in the same studio, using the same partner_members table;
- "follow a creator";
- page-view stats;
- real custom domains, because the page doesn't depend on which address it's served from. Only a lookup in the proxy and Vercel's domains API would need adding.

#### Is it worth it? (for and against)

FOR

- It is cheap to run. Wildcard subdomains and certificates cost nothing extra on Vercel Pro, which Truth needs anyway, and the pages are built in advance.
- Subdomains are the sweet spot between "path on Truth" and "creator's own domain". All *.truth.co.za addresses count as the same site, so these keep working:
  - the 30-day credit (via one shared cookie);
  - the Paystack callback and the single webhook;
  - one privacy notice;
  - one trusted checkout.
    With a creator's own domain, logins, credit and checkout trust all break.
- Most of the hard parts already exist: the creator page and its cache tags, the credit pipeline, the earnings engine, the admin editors and customer sign-in.
- A rand-paying local programme with a branded page could stand out in South Africa. Nobody seems to offer one for experiences, though that evidence is weak.

AGAINST

- There are no real creators yet.
- The big programmes keep creator pages as paths on their own domain: Amazon /shop/<handle>, Viator Shop, Expedia /shop/<handle> and LTK. Linktree and Stan offer no custom domains, and only about 16% of Substack publications use one.
- Branding is a nice-to-have. Fast, predictable payouts in rands and seeing their earnings probably matter more to creators.
- South African creators are TikTok-first (29.1M ad reach against 8.6M on Instagram) and earn mostly from brand deals. Whether they'll swap their Linktree for a Truth page is unproven.
- A page builder brings ongoing support and moderation work. It depends on things on hold (the domain and the email service), and at size L it competes with launch hardening.

VERDICT
Worth it in slices, not all at once:

1. Now: themes, link-in-bio blocks and ?via= links on today's page. This is cheap, can be demonstrated, and every piece is reused later.
2. When the production domain is set up: subdomains. This is mostly config and DNS once slice 1 exists.
3. Once the email service is on and 3–5 real creators are signed: creator logins, the studio and earnings.
4. When creators ask for changes every week: the self-serve page editor.

Skip one login shared across subdomains and real custom domains for now. Forwarding a creator's own domain to their page covers "their own domain" at no cost.

#### What to build first

Slice 1: a branded creator page on today's address, edited by admin. It needs no domain, no email service and no login changes.

1. Migration (pasted by the owner):
   - creator_sites with the published columns, column grants and row-level security, seeded for the 4 creators with blocks matching today's layout;
   - the slug-as-subdomain check (63 characters, reserved names), mirrored in the admin Zod schema.
2. 4–6 colour presets in globals.css, each in light and dark and contrast-checked. They are shown in /styleguide and on the design board for the owner to choose.
3. The creator page moves to its own route group (same URL), wraps itself in data-brand and data-font, and renders blocks:
   - hero, about, quote;
   - picks as cards or tiles;
   - My links, Featured in;
   - the fixed commission disclosure and a "Powered by Truth" footer.
4. A "Mini-site" section on /admin/creators/[id] (theme, font, light/dark, block order, links). It saves through an admin-checked function, then calls updateTag('creator:<slug>').
5. ?via= credit on truth.co.za (CaptureVia), the ExperienceCard href prop, and the "Booking through …" ribbon. Creators can then share any experience link and still be credited.
6. Tests:
   - unit tests for sites.ts and the via credit;
   - an e2e test that Zanele Eats' page shows her theme and links;
   - an e2e test that ?via= reaches the book form.

Result: in about 1–2 sessions, Zanele Eats and Trail & Tide look like their own brands, and every piece carries over unchanged to subdomains (slice 2) and the Creator Studio (slices 3–4).

---

### Option C: Truth Storefronts: the creator's own web address, run by Truth (checkout and accounts stay on Truth)

**In one line:** A creator points a web address they own at Truth, ideally a subdomain such as trips.zaneleeats.co.za. That address shows a branded shop page with no Truth header and sets no cookies. Sign-in, checkout, payment, refunds and the creator's own dashboard always stay on Truth's domain. The existing truth.co.za/creators/<slug> page stays as a fallback that always works, the way every Shopify store keeps its myshopify.com address.

**Effort:** XL

#### What the creator experiences

How a creator logs in: on Truth only, at truth.co.za/signin. It is the same screen customers use, with an email link or Google. A creator never signs in on their own domain.

Getting access to Creator Studio:

- The admin types the creator's contact email into their creator record and invites them.
- The first time they sign in with that verified email, the account is linked to the creator. This uses the same method as claim_my_bookings.
- They then see "Creator Studio" in the Truth menu, at truth.co.za/studio.
- One account covers everything. Zanele can book trips as a customer (My bookings), run her shop in Studio, and later run a dashboard as a host if she starts hosting.

Studio tabs:

- **Overview:** whether the shop is live, a link to it, bookings that came through her this month, and earnings due and paid. Guest names, emails and phone numbers are never shown.
- **My page:** photo, cover, bio, quote and social links. She cannot change the web-address slug or her % share.
- **Picks:** chosen from live experiences only.
- **Shop:**
  - a preview of the shop;
  - one accent colour from a fixed set of about 6;
  - a headline;
  - a setting for which page Google should treat as the main one: "my site" or "Truth's page".
  - A new shop starts as Draft. Truth approves it before it goes live.
- **Web address:** connecting her own domain (see below).
- **Earnings.**

Connecting a domain:

- If she already has a website or email on that domain, Studio recommends a subdomain such as trips.zaneleeats.co.za. That needs one CNAME record and cannot break her existing site or email.
- A bare domain (an A record plus www) is only for creators who have no site yet.
- **Stage 1, done for her:** she types the address. Truth adds it in Vercel and shows her the single record to add at her registrar. Studio then shows the status: "Waiting for your record", then "Securing with HTTPS", then "Live".
- **Stage 2, self-serve:** a wizard does the same, checking her DNS live, with registrar notes for Afrihost, Xneelo, Domains.co.za, 1-grid, GoDaddy and Cloudflare.

Using and ending the shop:

- She puts the address in her TikTok or Instagram bio.
- **Pausing:** if she pauses the shop, her domain forwards to her Truth page, so bookings and her credit carry on.
- **Leaving:** she deletes the DNS record and Truth detaches the domain. The domain always stays hers.

Before Studio exists, which is the case for the first slice, the admin does all of the above. The creator only adds one DNS record.

#### What the customer experiences

The shop:

- The customer taps the link in a creator's bio and lands on trips.zaneleeats.co.za.
- It is Zanele's own branded page: her cover, photo, quote and picks, in her accent colour.
- A small "Powered by Truth" badge shows in the header and footer.
- There is no cookie banner, because the shop sets no cookies.
- The header's "My bookings" and "Sign in" buttons open Truth.

Browsing:

- **Stage 1:** tapping a pick opens Truth's experience page with ?via=zanele-eats in the address. That page shows "Recommended by Zanele Eats" and a "Back to Zanele's shop" link.
- **Stage 2:** the experience page and the date and guest picker stay on her domain.

Paying (always on Truth):

1. "Reserve" opens truth.co.za/experiences/<id>/book?...&creator=zanele-eats.
2. That page is co-branded: "Booking via Zanele Eats · secure checkout by Truth".
3. The customer enters name, email and phone as a guest. No account is needed.
4. They pay on Paystack's page, which shows Truth as the merchant. Their bank statement also says Truth.
5. They land on their booking page on Truth.
6. Truth handles support, cancellations and refunds.

Logging in:

- Customers only ever sign in on Truth, with an email link or Google. One Truth account works across every creator's shop, like a passport.
- Guest bookings appear under My bookings when they sign in with the same verified email. The existing claim_my_bookings handles this.
- Saved hearts are hidden on shops in v1, because saved lists are stored per domain.

The rule Truth can teach customers: "You only ever pay through truth.co.za and Paystack."

#### Web addresses

Truth's own domain (the name is not decided yet):

- **Marketplace and all accounts:** https://truth.co.za, including /signin, /account/bookings, /studio (creators) and /admin (owner only).

Creator shops:

- **On the creator's own subdomain (recommended):** https://trips.zaneleeats.co.za/
  - Stage 2 adds pages like https://trips.zaneleeats.co.za/experiences/<uuid>.
- **On a bare domain (only for a creator with no existing site):** https://trailandtide.co.za/, with www redirecting to it.

Fallback that always works (it exists today):

- https://truth.co.za/creators/zanele-eats

Checkout (always on Truth):

- https://truth.co.za/experiences/<id>/book?date=2026-12-05&time=09:00&guests=2&creator=zanele-eats

Links from a shop to Truth carry the creator, for example:

- https://truth.co.za/experiences/<id>?via=zanele-eats
- https://truth.co.za/signin?via=zanele-eats

Internal only, never public:

- /s/zanele-eats/... is where the proxy sends shop requests behind the scenes. On Truth's own domain it returns "not found".

Testing on this computer:

- http://zaneleeats.localhost:3000 in development, and http://zaneleeats.localhost:3100 in Playwright. The dev server already accepts *.localhost.

Not used in this option:

- zanele.truth.co.za. A wildcard would need Truth's DNS moved to Vercel's nameservers when the domain is bought. That could be added later.
- truth.co.za/@zanele. It is not needed.

#### How it works technically

1. Domains and HTTPS

- Every creator address is added to Truth's single Vercel project.
  - Stage 1: by hand, in Vercel → Domains.
  - Stage 2: with @vercel/sdk, calling projects.addProjectDomain, then verifyProjectDomain, then getProjectDomain. GET /v6/domains/{domain}/config reports whether the domain is "misconfigured".
- The creator adds one record:
  - a CNAME for a subdomain, using the project-specific value Vercel shows; or
  - an A record (76.76.21.21, or the value shown) for a bare domain;
  - sometimes also a TXT record at _vercel.
- Vercel issues and renews Let's Encrypt certificates once DNS points at it. Any CAA record must allow letsencrypt.org, and on Cloudflare the record must be "DNS only".
- Limits: 100 domain additions and 50 verifications per hour per team.
- Domain webhooks are Enterprise-only, so status has to be polled.

2. Matching a host to a creator

- A new file, src/lib/storefront/hosts.ts, provides:
  - isTruthHost(host): the host of NEXT_PUBLIC_SITE_URL, localhost, and *.vercel.app previews.
  - storefrontFor(host) → slug, and primaryHostFor(slug).
- Port numbers are stripped and hosts lower-cased. Only exact matches count.
- **Stage 1:** a server-only env var, STOREFRONT_HOSTS = {"trips.zaneleeats.co.za":"zanele-eats"}, checked with Zod. Changing it needs a redeploy.
- **Stage 2:** the same functions read @vercel/global-config get('domain_<host>'). That is Vercel's documented multi-tenant pattern, and a new shop then goes live without a redeploy.

3. Proxy (src/proxy.ts)

- **Truth's own host:** return updateSession(request) exactly as today. src/lib/supabase/proxy.ts is not touched. Two exceptions:
  - /s/* is rewritten to /not-found, so there are no duplicate URLs.
  - /robots.txt and /sitemap.xml return NextResponse.next() without session work.
- **A mapped shop host:**
  - No Supabase client is ever created, so creator domains never get auth cookies.
  - These paths are rewritten to /s/<slug><path> with NextResponse.rewrite: '/', '/robots.txt', '/sitemap.xml', and in stage 2 '/experiences/<uuid>'. Next forwards the RSC headers on rewrites (proxy.md L472-476). The experience path must be a rewrite, because the page posts the loadSessions Server Action and a 308 would break that POST.
  - Every other path (admin, signin, auth, account, studio, bookings, payments, saved, creators, .../book) gets a 308 redirect to NEXT_PUBLIC_SITE_URL + path + via=<slug>. Admin pages and auth flows therefore never run on a creator's domain.
- **Unmapped hosts:** a 308 redirect to Truth. A domain that is attached in Vercel but missing from the map can then never show the marketplace.
- The matcher must stop excluding robots.txt and sitemap.xml.
- Tests: isRewrite, getRewrittenUrl and getRedirectUrl from next/experimental/testing/server (proxy.md L728-756).

4. Shop pages

- They live in src/app/s/[site]/, outside the (site) group, so Truth's header and footer don't render. Files:
  - layout.tsx: StorefrontHeader and StorefrontFooter, the accent colour, and generateMetadata. The metadata uses absolute URLs, because the root metadataBase is Truth's and absolute URLs ignore it (generate-metadata.md L391-436).
  - page.tsx: the CreatorProfile component, taken out of /creators/[slug]/page.tsx so both pages share it, plus the picks.
  - robots.txt/route.ts and sitemap.xml/route.ts, following Vercel's pattern for per-tenant files.
  - Stage 2: experiences/[id]/page.tsx. It shows only the creator's picks, using an ExperienceDetail component taken out of the Truth experience page.
- generateStaticParams returns every creator slug, because Cache Components needs at least one (generate-static-params.md L309-313). The nested [id] returns a placeholder when a creator has no picks. Pages call notFound() unless the shop is live.
- Pages never read headers() or cookies(), so they stay prerendered.
- Data comes from getStorefront(slug) with 'use cache', cacheLife('hours') and cacheTag('creators', 'creator:<slug>', 'storefront:<slug>'). Admin and Studio saves call updateTag to refresh them.

5. Links

- Links from a shop to Truth are plain <a> tags with absolute URLs, as Next's multi-zones guidance says.
- ExperienceCard (experience-card.tsx L49-59) gets two props: href, and showSave (set to false on shops).
- BookingWidget gets an optional checkout={{origin, creatorSlug}} prop. With it, Reserve becomes an <a> to Truth's book page with creator=<slug>, which overrides the localStorage value (it replaces the next/link at L120-123).
- Links within the same shop host keep next/link and work through the rewrite.

6. Creator credit

- On a shop, the domain itself is the credit, and it travels in the URL. Reserve goes to the existing book page, which already accepts creator (book/page.tsx L23-32). From there createBooking calls create_booking unchanged. It still credits only a creator who recommends that experience.
- Other links from a shop to Truth carry via=<slug>.
- A new CaptureVia component in src/app/(site)/layout.tsx reads location.search in an effect and calls the existing rememberCreator: 30 days, and the last creator visited wins.
- The book page also remembers creator, so rebooking after a hold expires keeps the credit.
- No storage or cookies cross domains.

7. Accounts

- Nothing changes for customers:
  - Supabase's Site URL and redirect list contain only Truth's domain.
  - The session cookie stays limited to Truth's host.
  - There is no cookieOptions.domain, and no change to Google sign-in or safeNext.
- One auth user can hold several roles:
  - customer: auth.uid() on bookings and saved experiences;
  - creator: a creator_members row;
  - host: host_members, later;
  - admin: an admins row plus aal2.
- Creator Studio lives at /studio on Truth, guarded by requireCreator(), which is modelled on requireAdmin. Its layout copies the admin console: Suspense, Guarded and instant = false.
- Creator edits go through SECURITY DEFINER RPCs. They never update the creators table directly, because UPDATE on creators is open table-wide and saveCreator depends on that.

8. SEO

- Each shop has an seo_mode setting:
  - **'creator' (the default for this option):** the shop's home page is its own canonical. Truth's /creators/<slug> page names the shop as canonical and leaves Truth's sitemap.
  - **'truth':** the reverse.
- Shop experience pages always name Truth's /experiences/<id> as canonical.
- Each shop has its own robots.txt and a sitemap with one URL. Truth's robots.txt disallows /s/.
- Truth's "Recommended by" chips keep linking to /creators/<slug>, so marketplace visitors stay on Truth.

9. Look

- Shops reuse Truth's components and role colour tokens.
- The accent is one of about 6 colour pairs (light and dark) defined in globals.css and checked for at least 4.5:1 contrast.
- An InlineScript in the shop layout sets data-accent on <html>, so pop-up sheets match the shop.
- There are no free colour choices and no custom HTML or scripts.

10. Payments and data

- Unchanged: the Paystack callback stays on Truth (payment.ts L48), and there is one webhook.
- Shops collect no personal data.
- The earnings RPC returns no guest details.

11. Monitoring (stage 2)

- A Vercel Cron route, /api/cron/storefront-domains protected by CRON_SECRET, re-checks every active domain each day and emails the creator and the admin if one breaks.

Rejected on purpose:

- **Checkout on the creator's domain:** possible, because Server Actions on the same origin work and Paystack's callback_url is set per transaction. But it breaks the "only pay via truth.co.za" rule, and it is unconfirmed whether Paystack accepts callbacks to many domains.
- **Sign-in on creator domains:** every domain would need a Supabase allow-list entry, a {{ .RedirectTo }} email template, and a Google flow that starts and ends on the same host. If it is ever needed, Supabase's OAuth 2.1 server is the by-the-book route, not a home-made token hand-off.
- **Iframes:** browsers keep storage separate per site inside an embedded iframe, and Paystack inside nested frames is fragile.
- **One Vercel project per creator.**

#### Database changes

- First slice needs no migration. The host-to-creator map is a server env var (STOREFRONT_HOSTS). Shop content comes from the existing creators and creator_experience_referrals tables.
- creators.contact_email text (nullable), admin-only, used to invite a creator. It stays private automatically: 20261031090000_private_people_columns.sql revoked table-wide SELECT, and new columns are not granted to anon or authenticated.
- New table creator_members: creator_id uuid → creators on delete cascade; user_id uuid → auth.users on delete cascade; role text check in ('owner','manager') default 'owner'; created_at; primary key (creator_id, user_id). Row-level security: members can read their own rows (user_id = auth.uid()) and admins manage all (is_admin()). There are no other write paths. A future host_members table copies this shape, so one person can be customer, creator and host.
- New function claim_my_creator() returns integer. SECURITY DEFINER, search_path '', not executable by anon. It is a copy of claim_my_bookings: it only acts for a confirmed email, and adds an 'owner' membership for creators whose lower(contact_email) matches. It is called next to claim_my_bookings in src/app/auth/confirm/route.ts and src/app/auth/callback/route.ts.
- New table creator_storefronts: creator_id uuid primary key → creators on delete cascade; status text check in ('draft','live','paused') default 'draft'; accent text check in (the fixed palette keys) default 'truth'; headline text check (char_length <= 120); seo_mode text check in ('creator','truth') default 'creator'; published_at; updated_at. Access: anon and authenticated can read the public columns only where status = 'live'. Admins manage it, including the approval that sets 'live'. Creators change it only through an RPC.
- New table storefront_domains: id uuid primary key; creator_id → creators on delete cascade; hostname text unique not null; is_primary boolean; status text check in ('requested','pending_dns','active','misconfigured','removed'); vercel_verification jsonb (private); last_checked_at; verified_at; created_at; created_by default auth.uid(). Hostname rules: lower-case, at most 253 characters, valid labels, no xn-- lookalikes, never Truth's own domain or vercel.app. A partial unique index allows one primary hostname per creator while not removed. Access: anon and authenticated can read only creator_id, hostname and is_primary, and only where status = 'active'. Members read their own rows; admins manage all.
- Creator functions. Each is SECURITY DEFINER with search_path '', not executable by anon, and checks membership:
  - my_creator();
  - creator_update_my_profile(name, location, bio, quote, avatar_url, cover_url, followers, tags, featured_in, socials), which never touches slug or revenue_share_percentage;
  - creator_replace_my_picks(uuid[]), a copy of admin_replace_creator_experiences limited to live experiences and at most 100;
  - creator_update_my_storefront(accent, headline, seo_mode);
  - creator_request_domain(hostname), at most 2 per creator;
  - creator_my_share();
  - creator_my_earnings(), returning payout_items for their creator_id with payouts.paid_on, the experience title from the booking snapshot and the month. It never returns guest name, email or phone.
- Storage policies on storage.objects: members may insert and delete under images/creators/<creator_id>/. uploadImage writes into that owner folder, and isAllowedImageUrl only accepts that folder for Studio saves.
- Optional: a new function get_booking_source(p_booking_id, p_access_token) with the same access rule as get_booking. It returns the creator's name, slug and shop URL for a 'Back to Zanele's shop' link after payment. It is a new function, so get_booking's return type stays unchanged.
- Not changed: bookings, create_booking, get_booking, payouts, payout_items, the earnings trigger and the Paystack functions. Each migration ends with a one-line check query, as the project's database workflow requires.

#### What it reuses

- src/proxy.ts and src/lib/supabase/proxy.ts. updateSession is untouched and only runs for Truth's host. The matcher at src/proxy.ts L11 changes so robots.txt and sitemap.xml reach the proxy.
- src/app/(site)/creators/[slug]/page.tsx: CreatorProfile (L59-169) moves to src/components/creator/creator-profile.tsx and is shared with the shop home. Canonical at L31; RememberCreator at L152.
- src/lib/data/creators.ts: getCreator, CREATOR_SELECT, 'use cache', cacheTag('creators', 'creator:<slug>'). getStorefront(slug) is added beside them.
- src/components/experience/experience-card.tsx (Link at L54-59, FavoriteButton at L49) gains href and showSave props. src/components/experience/experience-grid.tsx is reused.
- src/components/booking/booking-widget.tsx (bookHref at L54-63, Reserve Link at L120-123) gains an optional checkout prop. src/components/booking/mobile-booking.tsx already closes its sheet when any link is tapped.
- src/app/(site)/experiences/[id]/book/page.tsx: it already accepts creator (L23-32). It gains a co-branding strip and remembers the creator. src/components/booking/booking-form.tsx keeps its hidden creator input.
- src/app/(site)/experiences/[id]/page.tsx: its private sections (TitleBlock, Facts, HostCard, GoodToKnow, Reviews, BookingDetails, jsonLd) move to src/components/experience/experience-detail.tsx for stage 2.
- src/lib/creator-credit.ts (rememberCreator, creditedCreator) and src/components/site/remember-creator.tsx are the basis for CaptureVia. src/lib/creator-credit.test.ts is extended.
- Unchanged and reused as they are:
  - src/lib/actions/booking.ts (p_creator_slug at L87, relative redirect at L101) and create_booking in supabase/migrations/20261103090000_remove_service_fee.sql;
  - src/lib/actions/payment.ts (callbackUrl at L48), src/app/payments/paystack/callback/route.ts and src/app/payments/paystack/webhook/route.ts.
- Auth, unchanged except the new claim call:
  - src/lib/actions/auth.ts and src/lib/safe-next.ts are unchanged.
  - src/app/auth/confirm/route.ts and src/app/auth/callback/route.ts gain a claim_my_creator call next to claim_my_bookings.
  - src/lib/use-user.ts is unchanged.
  - src/components/site/menu-button.tsx gains a 'Creator Studio' link in its signed-in block (L63-86).
- src/lib/admin/guard.ts (requireAdmin, L9-25) is the model for requireCreator. src/app/admin/(console)/layout.tsx (instant = false at L28, Guarded at L93-107) is the model for the Studio layout.
- Admin creator editing, shared with Studio:
  - src/components/admin/creator-form.tsx and creator-picks-editor.tsx are changed to take their save action as a prop.
  - Reused as-is: src/components/admin/image-field.tsx, src/lib/upload-image.ts (folder parameter L7, path L16), src/lib/images.ts and src/lib/admin/form.ts.
- Admin people data:
  - src/lib/actions/admin-people.ts: the creator schema (L136-161) is split into shared profile fields plus admin-only slug and share, and refreshPages (L24-28) adds the storefront tag.
  - Unchanged: src/lib/admin/people.ts.
  - src/app/admin/(console)/creators/[id]/page.tsx gains a Shop section.
- src/lib/payouts.ts (earningStatus, sumAmounts, groupPayoutsByMonth), src/lib/format.ts (formatRand), src/components/admin/report-parts.tsx (Stat, Pager), src/components/admin/bar-chart.tsx and src/components/admin/save-status.tsx for the Studio earnings and settings screens.
- src/components/site/header-shell.tsx, src/components/site/inline-script.tsx, src/components/site/theme-toggle.tsx and src/components/ui/* (button, chip, input, sheet) for the shop header and footer. The role tokens --accent and --accent-soft in src/app/globals.css are the base for the accent colours.
- src/app/sitemap.ts (creator URLs at L22-26) and src/app/robots.ts (L5-10) change their rules. src/app/layout.tsx (metadataBase at L21) is unchanged; shops use absolute URLs instead. src/lib/env.ts and src/lib/env.server.ts gain the new env vars.
- Migration patterns to copy:
  - supabase/migrations/20261029140000_claim_bookings.sql: the claim pattern.
  - supabase/migrations/20261031090000_private_people_columns.sql: column grants and the replace-picks function.
  - supabase/migrations/20261101090000_payouts.sql: the payout_items source for creator earnings.
- Tests: e2e/browse.spec.ts (L43-58), e2e/admin.spec.ts (the lockout loop), playwright.config.ts (port 3100, *.localhost hosts reachable) and src/lib/payouts.test.ts.
- Next docs in node_modules/next/dist/docs:
  - 01-app/03-api-reference/03-file-conventions/proxy.md: order of execution, rewrites carrying RSC headers, test helpers;
  - 01-app/01-getting-started/16-proxy.md: no slow fetches in the proxy;
  - 01-app/02-guides/multi-zones.md: plain <a> across domains;
  - 01-app/03-api-reference/04-functions/generate-static-params.md and generate-metadata.md;
  - 01-app/03-api-reference/05-config/01-next-config-js/serverActions.md and allowedDevOrigins.md.

#### New work

- src/lib/storefront/hosts.ts with Vitest tests: isTruthHost, storefrontFor and primaryHostFor. STOREFRONT_HOSTS is added to the server env checks; in stage 2 these functions switch to Global Config.
- A host branch in src/proxy.ts:
  - Truth's host keeps today's behaviour;
  - shop hosts get rewrites and 308 redirects carrying via;
  - unmapped hosts are sent to Truth;
  - /s/* returns 404 on Truth's host;
  - the matcher change;
  - unit tests with next/experimental/testing/server.
- Shop routes: src/app/s/[site]/layout.tsx, page.tsx, robots.txt/route.ts and sitemap.xml/route.ts. Stage 2 adds src/app/s/[site]/experiences/[id]/page.tsx, which shows picks only and names Truth's page as canonical.
- Shared components taken out of existing pages: src/components/creator/creator-profile.tsx, and in stage 2 src/components/experience/experience-detail.tsx. They follow the owner's preference for shared components.
- src/components/storefront/storefront-header.tsx and storefront-footer.tsx: the creator's name, a 'Powered by Truth' badge, My bookings and Sign in links to Truth, and Truth's privacy, terms and help links.
- src/components/site/capture-via.tsx, mounted in src/app/(site)/layout.tsx. Plus a co-branded 'Booking via ...' strip and a 'Back to ... shop' link on the book page.
- Canonical, sitemap and robots rules for shops and for Truth's creator pages, based on seo_mode.
- About 6 accent colour pairs (light and dark) in src/app/globals.css, contrast-checked, and an InlineScript that sets data-accent.
- Creator Studio in src/app/studio/: overview, my page, picks, shop, web address and earnings. requireCreator() goes in src/lib/studio/guard.ts and actions in src/lib/actions/studio.ts. Members get a 'Creator Studio' link in the menu.
- A Shop section on the admin creator page: contact email and 'Invite to Studio', status (draft, live or paused), accent, SEO mode, and the list of domains with their statuses.
- Stage 2 self-serve domains:
  - src/lib/vercel/domains.ts, using @vercel/sdk to add, verify, get and remove domains and read their configuration;
  - @vercel/global-config read in the proxy, and written when a domain goes live;
  - a DNS-records table with live status, built from Truth's own components, using Vercel's Custom Domain block only as a reference;
  - a Vercel Cron route with its config;
  - emails when a domain breaks, which needs the email service.
- A help page, 'Connect your web address', with notes for SA registrars (Afrihost, Xneelo, Domains.co.za, 1-grid) and GoDaddy. It covers Cloudflare's 'DNS only' setting, CAA records, and why never to change nameservers.
- Creator shop terms:
  - Truth is the seller of record.
  - 'Powered by Truth' stays.
  - The domain remains the creator's.
  - Rules for pausing and removal.
- Playwright tests on zaneleeats.localhost:3100:
  - the creator's page renders;
  - no cookies are set;
  - picks link to Truth with via;
  - /admin and /signin bounce to Truth.
    Also a Studio lockout test copying e2e/admin.spec.ts, and Vitest tests for CaptureVia and the earnings mapping. CI needs STOREFRONT_HOSTS and NEXT_PUBLIC_SITE_URL set for the e2e build.

#### Effort estimate

These are my estimates, for one AI developer with the owner approving each step.

Build time for the whole option: about 12–19 build sessions, roughly 5–8 weeks. Each part:

| Part                                                                                             | Sessions       |
| ------------------------------------------------------------------------------------------------ | -------------- |
| First slice: shop home on one creator's domain, set up by hand                                   | 2–3 (size S–M) |
| Creator Studio: logins, page, picks, earnings                                                    | 4–6            |
| Shop settings, accent colour, SEO modes, approval, stage-2 experience pages, co-branded checkout | 3–5            |
| Self-serve domains and monitoring                                                                | 3–5            |
| Optional checkout on the creator's domain (not recommended)                                      | +3–4           |

The version where Truth sets everything up by hand (first slice, Studio and shop settings) is about L. Full self-serve makes it XL.

Owner setup steps:

1. **Launch basics first.**
   - Buy Truth's domain.
   - Get Vercel Pro (commercial use requires it) and deploy in dub1.
   - Set NEXT_PUBLIC_SITE_URL.
   - Set Supabase's Site URL and redirect list to Truth's domain only. Creator domains never go in Supabase.
2. **For each shop Truth sets up by hand:**
   - Agree the address with the creator.
   - Add it under Vercel → Project → Domains.
   - Send the creator the one record Vercel shows.
   - Add the host to STOREFRONT_HOSTS and redeploy.
   - Check the padlock.
3. **For Studio:**
   - Connect the email service (for example Resend) in Supabase Auth so creators can receive invites.
   - Optionally create the Google OAuth client.
   - Enter each creator's contact email in admin.
4. **For self-serve:**
   - Create a Vercel access token scoped to the team and set to expire.
   - Add it as server env vars with the project and team IDs.
   - Create a Global Config store and connect it to the project.
   - Set CRON_SECRET.
5. **Decisions:**
   - Which page Google treats as the main one by default (the creator's shop or Truth's page).
   - Admin approval before a shop goes live (recommended).
   - Whether a creator who also hosts an experience gets both shares on it.
   - Whether creators must use an authenticator app before connecting domains or adding bank details. That would need a new enrolment screen; today only admins have authenticators.
   - Pause and removal policy.

#### Running costs

Money:

- **Vercel Pro:** $20 a month, needed anyway once Truth takes payments. It includes 1 seat and $20 of usage credit.
- **Custom domains and HTTPS certificates:** free. Pro allows unlimited domains, with a soft limit of 100,000.
- **Shop traffic:** the pages are static and served from Vercel's cache, so bandwidth and function use come to cents.
- **Stage 2 only:**
  - Global Config reads, at about $3 per million. Only shop traffic touches it.
  - Small write charges.
  - Vercel Cron, included in Pro.
- **Creators' domains:** creators pay for their own, about R109 a year for a new .co.za from 1 Oct 2026. Truth registers and pays for nothing.
- **Email service:** needed anyway. Free tiers should cover creator invites and alerts.
- **Supabase:** no change.
- **Optional DNS-automation services:** Entri from about $249 a month, Approximated about $0.20 per domain a month. The research found conflicting prices for both. They aren't worth it below roughly 50 domains.

People time is the real cost. My estimates, not researched figures:

- 30–90 minutes per domain set-up;
- 1–2 hours a month per 10 live domains, for breakages such as expired domains, records deleted by a web designer, or a Cloudflare proxy left on.

#### Risks

- Support load from DNS (the biggest risk). Every domain is a small IT job:
  - finding the registrar login;
  - the registrar adding the domain name to the record automatically;
  - conflicting A, AAAA or CNAME records;
  - CAA records blocking Let's Encrypt;
  - Cloudflare's proxy left on;
  - email (MX records) broken if someone changes nameservers;
  - 24–48 hours of propagation.
    Mitigation: subdomains first (one CNAME), Truth doing the set-up early on, a registrar guide, and never asking a creator to change nameservers.
- Dead links. If a domain expires or its record is deleted, the link in the creator's bio stops working, bookings are lost, and people say 'Truth is broken'. Mitigation: the daily check in stage 2, email alerts, and always giving creators the truth.co.za/creators/<slug> address as the fallback.
- Lost bookings when the customer moves from the shop to Truth's checkout. Mitigation: co-branded checkout and matching styling. Track how many Reserve taps become paid bookings, by source, before considering checkout on the creator's domain.
- SEO:
  - a cross-domain canonical is only a hint, so Google may pick differently;
  - creator domains can compete with Truth for the creator's name;
  - experience content gets duplicated.
    Mitigation: experience pages always name Truth as canonical, there is one canonical page per creator, each shop has its own sitemap, and /s/ is blocked on Truth's domain.
- Brand, trust and phishing:
  - customers may not know Truth;
  - lookalike shops are possible;
  - card fraud is high in SA.
    Mitigation:
  - 'Powered by Truth' on every shop;
  - payment only via truth.co.za and Paystack;
  - admin approval before a shop goes live, and a kill switch;
  - no custom HTML, scripts or forms on shops;
  - hostnames are validated, with no xn-- lookalikes.
- The proxy runs on every request, so a bug can take down the whole site. Mitigation:
  - the branch for Truth's own host is unchanged;
  - unit tests with Next's proxy test helpers;
  - e2e tests on both kinds of host;
  - unknown hosts redirect to Truth;
  - any shop page that posts a Server Action must be a rewrite, never a 308, because a redirect breaks the POST.
- Cache Components gotchas:
  - shop pages must not read headers() or cookies();
  - generateStaticParams must return at least one value, so use a placeholder when a creator has no picks;
  - in stage 1, changing the host map needs a redeploy.
- Secrets. The Vercel token can change any domain on the project, and the Global Config write token is similar. Keep both server-only, team-scoped and expiring. Use them only after requireAdmin, and later only after a creator has passed the authenticator check.
- Permissions and POPIA:
  - creators UPDATE is open table-wide to signed-in users and only row-level security limits it, so creator edits must go through functions;
  - the images bucket is admin-only today, and upload paths have no owner;
  - the earnings function must never return guest details.
- Strategy:
  - creators own the domain and the audience;
  - customers bond with the creator's brand rather than Truth's;
  - a creator can point the domain at a competitor in minutes;
  - Truth risks becoming background infrastructure, which weakens the marketplace.
- Business-rule gaps:
  - a creator who also hosts could earn both the host share and the creator share on their own experience;
  - creators may dispute last-visit credit;
  - removing a pick during someone's checkout loses that credit.
- Prerequisites not done yet: production domain, Vercel Pro deployment, email service for creator invites, and the Google OAuth client. Launch is on hold.
- Platform limits:
  - Vercel allows 100 domain additions and 50 verifications per hour;
  - per-tenant preview URLs and domain webhooks are Enterprise-only;
  - whether Paystack accepts callbacks to many domains is unconfirmed (this only matters for checkout on creator domains, which is not recommended).
- Safari can wipe localStorage after 7 days of Safari use without a visit to the site. That can drop the via credit stored on Truth. Reserve links from a shop are not affected, because they carry the creator in the URL.

#### What it unlocks

- **A recruiting pitch SA rivals lack:** "your own branded experiences shop on your own web address; we handle hosts, bookings, payments, refunds and support, and pay you in rands." Viator and GetYourGuide keep creators on their own domains and pay in dollars or euros.
- **Partner shops on the same machinery:** guesthouses, boutique hotels, tour guides, tourism offices and corporate concierges, for example experiences.capegrace.co.za. A creator's picks are already a curated list, so any curator fits. These partners often need the page on their own site and already have a web person who can add a CNAME. That may suit this option better than influencers do.
- **More reliable credit:** on a shop, the domain itself is the credit and travels in the URL. It doesn't depend on browser storage or the device, and Safari's 7-day storage wipe can't touch it.
- **Creator brands that host:** a creator brand can grow into creator-hosted experiences on the same account, as Airbnb Originals and TrovaTrip do.
- **Groundwork every other option reuses:**
  - Creator Studio (logins, picks, earnings with no guest details);
  - ?via= links;
  - shared CreatorProfile and ExperienceDetail components;
  - SEO handling per host.
- **A possible paid tier later:** "shop on your own domain", if demand shows. Beacons charges about $10 a month for this; Substack charges $50 once.

#### Is it worth it? (for and against)

For:

- This is the most ownership Truth can give a creator while keeping the parts that must stay trustworthy (money, accounts and personal data) on Truth.
- Shopify's model points the same way. Shopify moved checkout and accounts onto merchants' own domains (checkout in July 2017) because the merchant there is the seller. On Truth, Truth is the seller of record, so checkout and accounts stay with Truth.
- Vercel's multi-tenant docs and Next's proxy support this approach, at almost no running cost.
- Because login, Paystack and POPIA handling don't change, the security risk is low.
- The same build can serve guesthouse and hotel partner shops.

Against:

- There are no real creators yet.
- No travel affiliate programme (Viator, GetYourGuide, Expedia, Booking.com, Airbnb) hosts creator pages on creators' own domains.
- Custom domains appear only where creators sell their own products (Kajabi, Substack, Beacons), and even there few use them: about 16% of Substack publications.
- Linktree and Stan, the biggest link-in-bio tools, offer no custom domains. They tell creators to forward a domain they own instead.
- SA audiences are TikTok-first: TikTok reaches about 65% of adults, while Instagram reaches 8.6M. Creators mostly need a link, not a website.
- DNS support costs real human time indefinitely.
- It pulls brand and search ranking away from Truth.
- The prerequisites (production domain, email service, launch) are all on hold.

Verdict: not now.

- **Today:** a creator who wants their own address can set their registrar to forward the domain to truth.co.za/creators/<slug>. That needs no build, and credit still works because the visitor lands on Truth.
- **When real creators sign up:** build Creator Studio. Every option needs it.
- **The shop slice:** build it only when a named creator or partner with real traffic asks and commits to using it. Set it up by hand for them.
- **Self-serve:** automate only after about 10 live shop domains. That threshold is my judgement, not a researched number.

#### What to build first

Step 0, no code: offer forwarding. The creator's registrar forwards their domain to truth.co.za/creators/<slug>.

First code slice: a shop home page for one creator on a subdomain they own (for example trips.zaneleeats.co.za), set up by hand. No database migration.

1. Add src/lib/storefront/hosts.ts with tests. It reads STOREFRONT_HOSTS (JSON mapping host to slug, checked with Zod) and answers isTruthHost, storefrontFor and primaryHostFor.
2. Change src/proxy.ts:
   - Truth's host: updateSession as today.
   - Mapped shop host: rewrite '/', '/robots.txt' and '/sitemap.xml' to /s/<slug>/...; send everything else to Truth with a 308 and ?via=<slug>.
   - Unmapped hosts: 308 to Truth.
   - /s/* on Truth's host: 404.
   - The matcher stops excluding robots.txt and sitemap.xml.
   - Unit tests use next/experimental/testing/server.
3. Move CreatorProfile out of src/app/(site)/creators/[slug]/page.tsx into src/components/creator/creator-profile.tsx. Add:
   - src/app/s/[site]/layout.tsx and page.tsx, with a slim StorefrontHeader and Footer: 'Powered by Truth', plus My bookings and Sign in links to Truth;
   - robots.txt and sitemap.xml route handlers.
4. ExperienceCard gets href and showSave props. On the shop, picks link to https://truth.co.za/experiences/<id>?via=<slug>, and hearts are hidden.
5. Add CaptureVia in src/app/(site)/layout.tsx; it calls rememberCreator(via). The book page also remembers creator.
6. Canonicals:
   - The shop home is its own canonical.
   - Truth's /creators/<slug> names the shop as canonical. This is the owner's call and can be flipped later.
   - Truth's sitemap skips creators that have a shop.
7. Playwright on zaneleeats.localhost:3100:
   - her page renders;
   - no cookies are set;
   - picks link to Truth with via;
   - /admin redirects to Truth;
   - the existing suites still pass.

Size S–M, about 2–3 sessions. It can be built and tested locally now. Going live needs Truth itself live on Vercel Pro. Then:

- the owner adds the domain in Vercel;
- the creator adds one CNAME;
- the owner adds the host to STOREFRONT_HOSTS and redeploys.

---

### Option D: Share kit: creators keep their own pages, Truth stays the checkout

**In one line:** Truth hosts no creator sites. Creators treat their own Instagram, TikTok, Linktree, WhatsApp or website as their page. Truth gives them links that carry credit, ready-made WhatsApp messages, QR codes, booking cards they can embed, and later a light Creator hub where they grab links and see clicks and earnings. Every login, booking and payment stays on Truth's one domain.

**Effort:** M

#### What the creator experiences

STAGE 1 (now, creators don't log in yet)

- The owner adds the creator and their picks in admin, as today.
- On the creator's admin page, a new Share kit section lists the creator's Truth page link and one link per live pick. Each pick link ends in ?via=their-name.
- For each link the owner can copy it, open a ready-made WhatsApp message, or download a QR code.
- The owner sends the creator these links on WhatsApp.
- The creator pastes them wherever they post:
  - their Instagram or TikTok bio, or their Linktree;
  - Story link stickers and YouTube descriptions;
  - blog posts and newsletters;
  - WhatsApp chats, Status and Channels;
  - a QR code printed on a market flyer.
- When someone taps one of these links and books that pick within 30 days, the creator earns their share. This works exactly like a visit to their Truth page does today.

MODULE A (creators who have a website)

- The Share kit gives them a snippet for WordPress, Wix or Squarespace:
  - an embedded strip of their picks ("Zanele's Cape Town picks · Book on Truth" plus a line saying Zanele earns a share when you book); or
  - a plain "Book with Truth" button, for website plans that don't allow embeds.

MODULE B (Creator hub: the login)

- Signing in:
  - The creator signs in at truth.co.za/signin with the email address the owner registered for them.
  - They use the same email link or Google sign-in that customers use.
  - It is one account for everything. If they also book trips, they see My bookings and Saved. If they later host an experience, the same account gets a host area. Signing out ends all of it.
- The menu shows "Creator hub" (truth.co.za/account/creator), which has three tabs:
  - **Overview:** clicks in the last 30 days, bookings, and earnings that are upcoming, due or paid.
  - **Links:** copy, WhatsApp, QR and embed for each pick. They can make extra named links per channel ("TikTok bio", "Market flyer") and see clicks for each one. They can archive old links; archived links still lead to their page.
  - **Earnings:** one line per credited booking with the booking code, experience, month, amount and status. Never the guest's name, email or phone.
- What they can't change:
  - They can't change their percentage, web address, page text or picks. An "Ask Truth to update my page" button messages the owner.
  - Letting them choose their own picks could be added later.
- No authenticator code is needed until bank details are added.

MODULE C (creator codes)

- The creator gets a short code such as ZANELE to say in videos and voice notes.
- Guests can type it at checkout to credit the creator. There is no discount.

#### What the customer experiences

- **Finding it:** a guest sees a creator's post, Story, blog card, WhatsApp message or flyer, and taps the link or scans the QR code.
- **Landing:** they arrive on Truth's own experience page, which shows "Recommended by Zanele Eats", or on the creator's Truth page.
  - A "Book with Truth" button can open straight onto the booking card. The page's existing #book behaviour already does this on phones.
  - If they tap a card embedded on a creator's website, Truth opens in a new tab and the creator's site stays open behind it.
- **Booking and paying:** exactly as today.
  - They pick a time, enter their name, email and an optional phone, and are taken to Paystack's hosted checkout from Truth's booking page. Refunds also go back through Paystack.
  - Guest checkout stays. No account is needed.
  - The price is the same with or without a creator. The credit is invisible to the guest.
- **Logging in:** optional, and only ever on truth.co.za (email link or Google).
  - It gives them My bookings and Saved across devices.
  - Earlier guest bookings made with the same email are claimed automatically (claim_my_bookings).
  - A creator's website never asks guests to log in.
  - Truth never shares guests' names, emails or phone numbers with creators.
- **Module C:** the booking form gets an optional "Did a creator send you? Enter their code" field. It changes nothing for the guest; it only credits the creator.

#### Web addresses

Accounts, bookings and payments live only on the main domain (example: truth.co.za).

**Existing**

- Creator's Truth page: truth.co.za/creators/zanele-eats

**Stage 1: credit links**

- Credit link to any pick: truth.co.za/experiences/<experience id>?via=zanele-eats
- To open straight onto the booking card: truth.co.za/experiences/<id>?via=zanele-eats#book

**Module B: short links that count clicks**

- Page link: truth.co.za/r/zanele-eats. The code is their web address at the time it was made, and it keeps working if that address changes later.
- Pick or channel link: truth.co.za/r/7f3k9q2m
- Each one redirects (307) to /experiences/<id>?via=zanele-eats or to /creators/zanele-eats.

**Sharing**

- WhatsApp: https://wa.me/?text=<URL-encoded message and link>. This opens WhatsApp with the message ready, and the creator chooses the chat.
- QR: an image of the same link. Print it only once the production domain is final.

**Module A: embeds**

- Picks strip: <iframe src="https://truth.co.za/embed/creators/zanele-eats" ...>
- Button for website plans that don't allow embeds: <a href="https://truth.co.za/r/7f3k9q2m" rel="sponsored noopener" target="_blank">Book with Truth</a>

**Module B: Creator hub**

- truth.co.za/account/creator
- truth.co.za/account/creator/links
- truth.co.za/account/creator/earnings
- These sit next to the existing /account/bookings, so "everything about you" is under /account.
- Sign-in: truth.co.za/signin?next=/account/creator
- Admin stays at /admin and still needs the authenticator code (MFA).

**"Their own domain" without Truth hosting anything**

- The creator buys zaneleeats.co.za (about R109 a year) and sets up forwarding at their registrar to truth.co.za/r/zanele-eats.
- Their own website, for example zaneleeats.com/cape-town, carries the embed.

#### How it works technically

All paths are under truth-web.

1. CREDIT FROM ANY LINK (no login, no migration)

- A new client component, CaptureVia, is mounted in src/app/(site)/layout.tsx.
  - In a useEffect it reads window.location.search.
  - It passes ?via=<slug> through a new pure helper, creatorFromSearch(), which lowercases the value and checks it against the existing SLUG pattern.
  - It then calls the existing rememberCreator(). That stores localStorage 'truth-creator' for 30 days, and the last creator wins.
  - It does nothing when the page is framed (window.top !== window.self), so a hidden iframe can't plant credit.
- Reading location inside an effect (instead of useSearchParams, which would need a Suspense boundary) keeps every page prerendered under Cache Components.
- The canonical tags on experience and creator pages already drop the query string.
- ?via= stays in the URL on purpose:
  - Instagram and TikTok in-app browsers keep their storage separate from Safari and Chrome, so "Open in browser" only carries the credit if it is in the URL.
  - MobileBooking's close() already keeps location.search.
- BookingWidget falls back to the URL value when storage is blocked: creditedCreator() ?? creatorFromSearch(location.search). This runs only after a session is chosen, so it never runs during hydration.
- The rest of the chain is unchanged:
  1. The Reserve link gets creator=.
  2. The book page puts it in a hidden input.
  3. createBooking checks it with Zod.
  4. create_booking(p_creator_slug) credits only a creator who recommends that experience.
  5. The bookings_sync_earnings trigger records the creator's earning when the booking is paid.

2. SHARE KIT

- src/lib/share-links.ts (pure, with unit tests) builds:
  - absolute URLs from NEXT_PUBLIC_SITE_URL, because these links leave the site;
  - #book variants;
  - wa.me/?text= messages;
  - the embed and button snippets.
- src/components/share/share-kit.tsx is a client component shared by the admin page and the hub. It offers:
  - Copy (Clipboard API);
  - the phone's own share sheet (Web Share API);
  - WhatsApp;
  - a QR code made in the browser by a small QR library loaded only when used, downloadable as SVG or PNG. Nothing is sent to a third party.

3. EMBEDS (Module A)

- Static page src/app/embed/creators/[slug]/page.tsx:
  - generateStaticParams comes from getCreatorSlugs(). Cache Components needs at least one value; creators exist.
  - Data comes from the cached getCreator() (tags 'creators' and 'creator:<slug>'), so admin saves refresh it through the existing updateTag('creators').
  - It renders ExperienceTile in a new external-link mode: a plain <a target="_blank" rel="noopener"> to the absolute experience URL with ?via=, and no save heart.
- Checkout, sign-in cookies and storage therefore stay first-party on Truth's own origin.
- The frame itself never stores credit. Browsers partition iframe storage and don't send the SameSite=Lax session cookie there anyway.
- next.config.ts headers():
  - Every path (/:path*) gets Content-Security-Policy: frame-ancestors 'self'.
  - A later entry for /embed/:path* sets frame-ancestors https: plus X-Robots-Tag: noindex. In the headers config the last matching entry wins.
- src/app/embed/layout.tsx uses InlineScript to apply ?theme=light|dark before first paint.
- The src/proxy.ts matcher gains r/ and embed/ in its exclusions, so those paths skip updateSession and getClaims.
- SavedSync returns early when the page is framed.

4. SHORT COUNTED LINKS (Module B)

- src/app/r/[code]/route.ts (GET):
  1. Checks the code with Zod.
  2. Checks the user agent against known link-preview bots (WhatsApp, facebookexternalhit/Facebot, Twitterbot, TelegramBot, Slackbot, LinkedInBot, Discordbot, Googlebot, bingbot, Applebot).
  3. Calls follow_creator_link(code, count) through the service-role client from src/lib/supabase/admin.ts. That function is executable only by service_role, like attach_payment_reference, so it can't be called directly from outside.
- The function:
  - adds 1 to that link's counter for the day (South African time);
  - returns the creator slug, plus the experience id only if the experience is live and still one of their picks.
- The route answers 307 with Cache-Control: no-store:
  - to /experiences/<id>?via=<slug> for a live pick;
  - to /creators/<slug> for archived links or picks that are no longer live;
  - to / for unknown codes.
- Under Cache Components this handler runs on every request, because it reads request data and queries the database.
- What is stored: link id, day and count. No IP address, device details or user.
- robots.ts disallows /r/.

5. CREATOR LOGIN (Module B)

- Creators use the same Supabase Auth account and the same sign-in page as customers.
- Linking an account to a creator:
  1. An admin types a private creators.contact_email.
  2. claim_my_creator() runs after claim_my_bookings in /auth/confirm and /auth/callback, and once more from the hub's guard for people who were already signed in. It copies the claim_my_bookings pattern and only works for a confirmed email.
  3. It inserts a creator_members row.
- requireCreator() is modelled on requireAdmin(): getClaims, then my_creators(). It guards src/app/(site)/account/creator/* with:
  - Suspense around a Guarded component;
  - instant = false;
  - noindex;
  - referrer no-referrer.
- All hub data comes from SECURITY DEFINER RPCs with search_path ''. Each checks is_creator_member() and returns a safe projection:
  - links with their click counts;
  - paid bookings per experience;
  - earnings lines from payout_items without any customer_* column. These show the session month, not due_on, because due_on would reveal the session date.
- The TypeScript side reuses earningStatus, sumAmounts and groupPayoutsByMonth.
- Creators get no write access to creators or creator_experience_referrals. The table-wide UPDATE grant on creators, which saveCreator relies on, is therefore never exposed to them.
- MenuButton (a client component) calls my_creators() when it opens, to decide whether to show "Creator hub". Public pages stay static.
- Roles:
  - customer: anyone with a session;
  - creator: a creator_members row;
  - host (later): a host_members row on the same pattern;
  - admin: an admins row plus aal2.

6. CREATOR CODES (Module C)

- A private column, creators.share_code.
- creator_for_code(code, experience_id) returns the slug only if that creator recommends the experience.
- The booking form gets an optional field. createBooking resolves the code and then calls the unchanged create_booking(p_creator_slug).
- A typed code beats stored link credit, and an invalid code gets a clear error message.

#### Database changes

- Stage 1 and Module A: no database change. They only need code and response headers.
- Module B, migration <timestamp>_creator_hub.sql (additive, ends with the usual one-line check query): new table public.creator_members (user_id references auth.users on delete cascade, creator_id references creators on delete cascade, created_at, primary key (user_id, creator_id)). Row-level security on, with no policies; it is read only through functions, like public.admins.
- Module B: new column creators.contact_email (text, optional).
  - It has an email-format check and a unique index on lower(contact_email).
  - It is private automatically: SELECT on creators is granted column by column, and this column is never granted.
  - The admin's signed-in client writes it; row-level security already limits that to admins.
  - src/lib/admin/people.ts reads it with the service role.
- Module B: new table public.creator_links.
  - Columns: id uuid pk; code text unique (slug-style check, 4–80 characters); creator_id references creators on delete cascade; experience_id references experiences (null means the creator's page); label of 60 characters or fewer; created_at; archived_at.
  - Row-level security on, no policies.
  - The migration adds one page link per existing creator (code = slug), and an after-insert trigger on creators adds one for each new creator. If that code is already taken, it falls back to a random code.
- Module B: new table public.creator_link_clicks (link_id references creator_links on delete cascade, day date, clicks integer >= 0, primary key (link_id, day)).
  - Row-level security on, no policies.
  - No IP address, user agent or user id is stored.
- Module B functions. Each is SECURITY DEFINER with search_path set to '', revoked from public and anon, and granted to authenticated unless noted:
  - is_creator_member(creator_id): true for members, or when is_admin() is true.
  - claim_my_creator()
  - my_creators()
  - creator_create_link(creator_id, experience_id, label): the experience must be one of the creator's picks; at most 200 links per creator; the code is 8 characters taken from gen_random_uuid(), with a retry if it is taken.
  - creator_archive_link(link_id)
  - creator_link_report(creator_id, from, to)
  - creator_results(creator_id, from, to)
  - creator_earnings(creator_id): payout_items plus booking code, experience title from experience_snapshot, session month, amount and status, with no customer columns.
  - admin_unlink_creator_member(creator_id, user_id): checks is_admin().
  - follow_creator_link(code, count): granted to service_role only.
- Module B, optional and the owner's decision: replace create_booking with the same signature (as the service-fee migration did) and add a 'no self-credit' rule. If the signed-in booker is a member of the credited creator, the booking gets no creator credit.
- Module B check query, for example: has_column_privilege('anon','public.creators','contact_email','select') is false and has_table_privilege('anon','public.creator_links','select') is false. Then run pnpm db:types. Run supabase/audit/inspect-security.sql first, because the base schema isn't in the repo.
- Module C migration:
  - creators.share_code text: check ^[A-Za-z0-9]{3,20}$, unique on upper(share_code), private like contact_email.
  - creator_for_code(code, experience_id) returns the slug or null; granted to anon and authenticated.
- Module D, only if chosen (not purely additive):
  - bookings.discount_amount numeric(12,2) default 0.
  - A new create_booking signature that takes a code. The old one must be dropped in the same migration so the two versions don't clash.
  - record_booking_earnings takes the discount off the creator's share.

#### What it reuses

- src/lib/creator-credit.ts: rememberCreator, creditedCreator and the SLUG pattern for the 30-day, last-creator-wins credit. Its tests in creator-credit.test.ts are extended.
- src/components/site/remember-creator.tsx: the pattern for CaptureVia. Creator-page visits keep crediting the creator.
- src/components/booking/booking-widget.tsx: adds creator= to the Reserve link, only after a session is chosen.
- src/components/booking/mobile-booking.tsx: #book opens the booking sheet on phones, and closing it keeps location.search.
- src/app/(site)/experiences/[id]/book/page.tsx, src/components/booking/booking-form.tsx and src/lib/actions/booking.ts: the existing hidden creator field, Zod check and p_creator_slug.
- supabase/migrations/20261103090000_remove_service_fee.sql: create_booking's rule of crediting only creators who recommend the experience, unchanged.
- supabase/migrations/20261101090000_payouts.sql: payout_items, record_booking_earnings and the bookings_sync_earnings trigger. Creator earnings already exist; the hub only reads them.
- src/lib/data/creators.ts: getCreator and getCreatorSlugs, with 'use cache' and the 'creators' and 'creator:<slug>' tags, for the static embed pages.
- src/components/experience/experience-tile.tsx, experience-card.tsx and experience-grid.tsx: these shared cards get an external-link mode instead of a second card component being added.
- src/app/admin/(console)/creators/[id]/page.tsx: hosts the Share kit section, using the creator.experienceIds and listExperienceOptions data it already loads.
- src/lib/admin/people.ts: getEditableCreator reads with the service role and select('*'), so it would return contact_email too.
- src/lib/actions/admin-people.ts: saveCreator and refreshPages (updateTag 'experiences' and 'creators').
- src/lib/admin/form.ts: shared form helpers.
- src/components/admin/save-status.tsx: Section, Field and SaveStatus.
- src/lib/admin/guard.ts (requireAdmin) and src/app/admin/(console)/layout.tsx (Suspense, Guarded, instant = false): the models for requireCreator and the hub layout.
- supabase/migrations/20261029140000_claim_bookings.sql: the model for claim_my_creator.
- supabase/migrations/20261031090000_private_people_columns.sql: column-level privacy and the replace-all RPC pattern.
- supabase/migrations/20261029120000_security_and_availability.sql: the is_admin() and admins pattern for a table with no policies.
- src/app/auth/confirm/route.ts and src/app/auth/callback/route.ts: one claim call is added to each.
- src/lib/safe-next.ts: already allows /account/creator as the after-sign-in destination.
- src/components/site/menu-button.tsx, src/lib/use-user.ts and src/lib/supabase/client.ts: the role-aware menu, still read in the browser.
- src/lib/payouts.ts: earningStatus, sumAmounts and groupPayoutsByMonth.
- src/components/admin/report-parts.tsx (Stat, Pager), src/components/admin/bar-chart.tsx and src/lib/format.ts (formatRand): the hub's numbers and charts.
- src/lib/supabase/admin.ts (service role, for the /r/ redirect) and src/lib/supabase/server.ts.
- src/app/(site)/account/bookings/page.tsx: the account-area pattern (noindex, no-referrer, getClaims inside Suspense).
- src/components/site/inline-script.tsx and src/lib/theme.ts: the embed's light or dark choice.
- src/proxy.ts (matcher), src/app/robots.ts and next.config.ts (headers).
- e2e/booking.spec.ts, e2e/browse.spec.ts and e2e/admin.spec.ts: patterns for the booking flow, desktop and mobile projects, and signed-out lockout.
- supabase/audit/inspect-security.sql: run before writing the new grants.

#### New work

- Stage 1: creatorFromSearch() in src/lib/creator-credit.ts, with new test cases (valid, upper case, invalid, missing).
- Stage 1: CaptureVia in src/components/site/capture-via.tsx, mounted in src/app/(site)/layout.tsx. It does nothing inside iframes. BookingWidget also falls back to ?via= in the URL when storage is blocked.
- Stage 1: src/lib/share-links.ts with tests: absolute links from NEXT_PUBLIC_SITE_URL, the #book variant and the wa.me message.
- Stage 1: a shared src/components/share/share-kit.tsx.
  - Offers Copy, the phone's share sheet, WhatsApp, and QR download as SVG or PNG.
  - The QR library is small, well known (for example qrcode) and loaded only when used. The owner approves the new dependency.
  - Warns while the site address is still localhost.
- Stage 1: a 'Share kit' section on the admin creator page, showing their page and each live pick.
  - An e2e test opens a recommended experience with ?via= on desktop and on phone, and checks that the Reserve link carries creator=.
  - Update PROGRESS.md.
- Module A: src/app/embed/layout.tsx and src/app/embed/creators/[slug]/page.tsx.
  - A static, cached strip of the creator's picks with a 'Book on Truth' link and a line saying the creator earns a share.
  - No site header, footer or save hearts.
- Module A: an external-link mode for ExperienceTile and ExperienceCard: an absolute href, opening in a new tab, with no save heart.
- Module A: headers() in next.config.ts.
  - frame-ancestors 'self' site-wide, which is also a hardening win, since no page currently blocks being framed.
  - frame-ancestors https: plus noindex on /embed/*.
  - The proxy matcher skips embed/ and r/, and SavedSync does nothing inside iframes.
- Module A: iframe and button snippets in the Share kit, using rel="sponsored noopener" and including the disclosure line.
  - An e2e test checks the headers and that embed links are absolute and open in a new tab.
- Module B: the creator_hub migration (tables, functions, page-link backfill, trigger and check query). The owner pastes it into the Supabase SQL editor, then Claude runs pnpm db:types.
- Module B: src/app/r/[code]/route.ts and an isLinkPreviewBot() helper, with tests. robots.ts disallows /r/.
- Module B: requireCreator() in src/lib/creator/guard.ts and RPC wrappers in src/lib/creator/data.ts.
- Module B hub pages: src/app/(site)/account/creator/layout.tsx, page.tsx (Overview), links/page.tsx and earnings/page.tsx.
  - Server actions in src/lib/actions/creator-hub.ts create and archive links, with Zod checks and a membership check repeated in the database.
- Module B wiring:
  - claim_my_creator() is called in both auth routes.
  - 'Creator hub' appears in MenuButton.
  - The admin creator form gets a private 'Sign-in email' field, a list of linked accounts with Unlink, and link stats.
  - e2e tests cover the signed-out lockout for /account/creator and the /r/ redirects.
- Module B, optional later: creators choose their own picks.
  - creator_replace_my_picks would be a copy of admin_replace_creator_experiences with a membership check, live experiences only, and at most 100.
  - Saving calls updateTag('creators') and updateTag('experiences').
- Module C: creators.share_code and creator_for_code().
  - An optional 'Creator code' field on the booking form, resolved in createBooking before the unchanged create_booking call, with a clear error for a wrong code.
  - The code is shown in the Share kit and the hub.
- Module D, optional: a discount funded by the creator. The guest's discount comes out of the creator's share, so hosts and Truth are unaffected. It changes create_booking, the prices shown, payouts, Revenue and refunds, and needs a money rule from the owner.

#### Effort estimate

Build time assumes one AI developer, with the owner approving each step. Stage 1 alone is small (S); Stage 1 plus Modules A to C is medium (M); Module D would make it large.

**Stage 1**

- About one working session (half a day to a day), plus owner review.
- No migration and no dashboard setup.
- The owner approves adding a small QR-code library and tries a booking through a demo creator's link on Paystack test.

**Module A: embeds**

- 1–2 sessions.
- The owner approves the site-wide "no framing except /embed" rule and tries the snippet on a test web page.

**Module B: Creator hub, short links and results**

- About 4–6 sessions.
- Owner steps:
  - Paste one migration into the Supabase SQL editor; Claude then runs pnpm db:types.
  - Connect an email service (for example Resend's SMTP details in Supabase Auth), which needs the production domain's DNS, or create the Google OAuth client.
  - Set the Supabase Site URL and redirect URLs, and NEXT_PUBLIC_SITE_URL, to the production domain. This is already on the launch list.
  - Type each creator's sign-in email in admin.
  - Decide the self-credit rule and how much booking detail creators may see.
  - Test signed in as a test creator.

**Module C: creator codes**

- About one session plus one small migration.

**Module D: discounts funded from the creator's share**

- 3–5 sessions, plus a money-rule decision. It touches pricing, payouts, Revenue and refunds.

Stage 1 plus Modules A to C comes to roughly 1.5–2 weeks of sessions spread over time. Only Stage 1 is recommended now.

#### Running costs

**Stage 1 and Module A: R0 extra.**

- Embed pages are static and served from the CDN.
- QR codes are made in the browser.
- No new services are needed.

**Module B: close to R0.**

- Supabase stores one tiny row per link per day.
- Each counted click costs one Vercel function call and one database call. Vercel's dub1 region and Supabase's eu-west-1 are both in Ireland, so the extra time is small.
- This all fits inside the Vercel Pro plan Truth needs anyway for taking payments ($20 a month, including $20 of usage credit).

**Email for creator sign-in**

- Resend's free tier is widely reported as 3,000 emails a month, capped at 100 a day (check resend.com/pricing). That covers creator sign-ins.
- The $20-a-month tier (50,000 emails) will be needed at launch anyway for customer emails.

**What this option avoids**

- No per-domain fees.
- No Supabase custom domain ($10 a month).
- No Cloudflare for SaaS, Entri or other DNS helpers.
- No analytics subscription.
- No support time spent fixing creators' DNS settings.

#### Risks

- Credit is stored per browser, and the last click wins.
  - Instagram and TikTok in-app browsers keep their storage separate from Safari and Chrome. Private tabs forget it, and the last creator link or creator page visited wins.
  - Keeping ?via= in the URL, the existing creator= on the booking page and, later, codes reduce these leaks but don't remove them. Tell creators their numbers are a minimum.
  - Sources (vendor guides): https://link.boo/guides/tiktok-in-app-browser and https://blog.bouncy.ai/blog/affiliate-links-break-instagram/
- The credit rule is stricter than the industry's, which is a business decision for the owner.
  - create_booking only credits a creator for experiences they recommend. Viator-style programmes credit any booking in the 30-day window.
  - Also decide whether browsing another creator's page on Truth should override credit from an active link. Today the last visit wins.
- Clickjacking is a gap today, and embeds would widen it.
  - The app currently sends no header that stops it being framed: next.config.ts has no headers() and there is no vercel.json.
  - Opening /embed to framing must come with frame-ancestors 'self' on every other page.
  - Re-test the Paystack and Supabase sign-in redirects, and check that the browser pane used for testing still loads the site. If it does not, apply the rule only in production.
- Click counts are rough and can be inflated.
  - Link-preview bots and repeated hits add clicks.
  - Filter known preview bots, let only the server call the counter (service role), store no personal data, and never pay per click.
- Creators could game the credit.
  - A creator could book through their own link, or force their own site's visitors through it.
  - Defences: an optional no-self-credit rule in create_booking with the same signature; credit is set only on top-level Truth pages, never inside iframes; the admin reviews odd ratios of clicks to bookings.
- POPIA (South Africa's privacy law).
  - Creator screens must never show guests' names, emails or phone numbers.
  - Show only the booking code, experience, month and amount. The session date and due date would reveal when the guest went.
  - Click data contains no personal information.
  - The privacy notice should mention link tracking.
- Disclosure rules.
  - The IAB SA 2026 toolkit treats affiliate links and codes as a material connection that must be disclosed, and the Advertising Regulatory Board enforces disclosure.
  - Embeds carry a line saying the creator earns a share.
  - Snippets use rel="sponsored", as Google asks: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- Website builders limit embeds.
  - According to secondary sources, iframes and scripts need Business-level plans on WordPress.com and Squarespace:
    - https://help.zoho.com/portal/en/kb/zoho-publish/widgets/store-locator/third-party-website-embedding/articles/wordpress-com
    - https://docs.whereby.com/integrating-whereby-in-specific-environments/embedding-in-squarespace-or-wordpress
  - Linktree takes links only.
  - Always offer the plain link or button as well.
- Parts are blocked by the paused launch work.
  - Links made today carry the localhost or test address.
  - QR codes printed before the production domain is final will stop working, so don't hand out or print links until then.
  - Creator sign-in needs the email service (which needs the domain) or the Google OAuth client.
- Changing a creator's web address (slug) quietly breaks their ?via= links and any credit already stored. /r/ codes keep working through a change, so move creators onto /r/ links once Module B exists.
- Support load.
  - Expect questions like 'my link isn't counting', plus embed installs and QR printing.
  - The owner is the support desk at first.
  - Sources for WhatsApp's link format are third-party: https://linklyhq.com/blog/whatsapp-link-generator
- The original tables and policies aren't in the repo. Run supabase/audit/inspect-security.sql before writing the new grants and functions, and keep functions to search_path '' with anon access revoked, as in the existing migrations.

#### What it unlocks

**For creators**

- They can sell wherever their audience already is: Instagram and TikTok bios and Story link stickers, YouTube, blogs and newsletters, WhatsApp chats, Status and Channels, and printed QR codes at markets and events.
- They get credit and are paid in rands.
- Creators who want "their own domain" can forward one they buy to their /r/ link, with nothing built at all.

**For Truth**

- Truth keeps one trusted checkout, one login, one Paystack setup and one privacy notice.
- It gets evidence per creator and per link (clicks, then bookings, then earnings) before spending on hosted pages or custom domains.

**Reusable by the other options**

- ?via= capture is needed anyway by the subdomain and custom-domain designs, because browser storage never crosses domains.
- creator_members, requireCreator and the safe RPCs are the creator login every option needs.
- The framing headers are hardening Truth should have before launch anyway.

**Later uses**

- The same Share kit can serve hosts: a QR code at the venue, a "Book now" button on their own website, and later a host login using host_members.
- It can later power guest referrals.
- Codes open up offline and spoken marketing: radio, podcasts, events and WhatsApp voice notes. A precedent is Epic Games' Support-A-Creator codes, which credit a creator for purchases: https://sac.epicgames.com/overview/

#### Is it worth it? (for and against)

**For**

- It gives creators what "their own page" means to most of them (their audience on their own Instagram, TikTok, WhatsApp or website) for almost no cost.
- It avoids all the hard parts of the domain options: DNS, SSL certificates, sharing logins across domains, Supabase redirect lists, Paystack changes, and a second checkout domain in a high-fraud market.
- It matches how creator programmes are actually run. Viator, GetYourGuide and Expedia offer link builders, widgets and performance dashboards, and none host creators' own domains.
- It also matches how South African sales happen: through WhatsApp and offline.
- Stage 1 takes about a day, needs no migration and doesn't wait on the paused launch work.
- It measures which creators and channels convert before anything bigger is built.
- Every piece is reused if a bigger option is built later.

**Against**

- There are no real creators yet, so anything beyond Stage 1 is a guess.
- The Creator hub is blocked until the email service and production domain exist.
- A creator without a website gets no branded site. Their Truth page plus a forwarded domain is the stand-in.
- Credit stored per browser, last click wins, leaks through in-app browsers, and click counts are only approximate.
- Embeds don't work on cheaper website-builder plans.
- It adds a redirect endpoint and an iframe surface that must be secured.
- It doesn't satisfy a creator who insists on a fully branded site.

**Verdict:** worth doing in slices.

- Stage 1 now: it is cheap and helps demos and the first hand-recruited pilot creators.
- Module A only when a creator with a website asks.
- Module B when 3–5 real creators are active and email works. Until then, the owner sends statements from the existing Payment history. A private results link per creator, like booking links, is a one-day stopgap if email stays paused.
- Module C when creators sell through video or WhatsApp.
- Discounts only with a clear money rule.
- Custom domains are not worth building now. Registrar forwarding to /r/<name> covers that wish for free.

#### What to build first

**Stage 1: "credit from any link" plus an admin Share kit**

1. Add creatorFromSearch() and CaptureVia (in src/app/(site)/layout.tsx) so that ?via=<slug> on any public page feeds the existing 30-day credit.
   - It does nothing inside iframes.
   - BookingWidget falls back to ?via= in the URL when storage is blocked.
   - Pages stay prerendered.
2. Add src/lib/share-links.ts and a shared ShareKit component offering Copy, the phone's share sheet, WhatsApp, and a QR download (the QR library is loaded only when used).
3. Add a "Share kit" section to the admin creator page.
   - It lists the creator's page link and one link per live pick.
   - It warns while the site address is still localhost.
4. Add tests.
   - Unit tests for the helpers.
   - An e2e test, on desktop and phone, that opens an experience a demo creator recommends with ?via=<slug> in a fresh browser and checks that the Reserve link carries creator=<slug>.
5. Owner check, then update docs/PROGRESS.md.
   - Book through the link on Paystack test.
   - See the creator's earning appear under Payouts.

There is no migration, no new route and no login change. The only owner setup is approving the QR library. Real creators get their links on WhatsApp from the owner once the production domain is set.

---

### Option E: Creator Guides: creators as curators and trip-makers

**In one line:** Creator pages feel like the creator's own because of what they publish there: trip guides, a tip on each pick, share cards with their face on them, and later meet-up dates, all built from Truth experiences. Customers, creators and, later, hosts share one Truth login, and every payment still happens on truth.co.za.

**Effort:** L

#### What the creator experiences

How it feels: the creator's page is no longer just a profile above a grid. It becomes their travel magazine on Truth:

- "Trail & Tide's trips", for example "A weekend in the Garden Route" and "Three sunrise hikes near Cape Town";
- "All my picks", each with the creator's own one-line tip;
- a share card with their face and the trip title whenever a link is posted on WhatsApp, Instagram or TikTok.

Phase 1 (slice 1, no creator login needed):

- The creator sends their trip idea, tips and photos over WhatsApp.
- A Truth admin builds the guide in the admin console, sends a preview link, and publishes it once the creator says yes.
- The creator puts one link in their bio (truth.co.za/creators/trail-and-tide), plus a link per trip.
- Earnings and payouts work exactly as today.

Phase 3 (slice 3, Creator studio):

- On the creator's admin page, an admin types the creator's email ("Invite to studio").
- The creator signs in at truth.co.za/signin exactly like a customer:
  - "Continue with Google" works as soon as Google sign-in is switched on. It needs no email service.
  - An email link works once the email service is connected.
- The first sign-in links the account automatically and opens truth.co.za/studio. If they used a different email, they see "This account isn't linked to a creator page yet".
- What the studio has:
  - Overview: how many people follow them on Truth, bookings and earnings this month, and their share percentage.
  - My page: photos, bio, tagline, tags and social links. Their name, web address and share stay with Truth.
  - Picks: tick live experiences and add a short tip to each.
  - Guides: a title, cover, intro, "Day 1 / Day 2" headings, and stops chosen from live experiences, each with a tip. Short notes can go between stops. They can reorder, preview, then submit. Truth reviews a creator's first guide; after that, trusted creators publish directly. Truth can unpublish at any time.
  - Earnings: by month and experience (earned, due, paid). It never shows guest names, emails or phone numbers.
- Later: meet-up dates. Truth adds "Join Zanele on Sat 14 Dec, 10:00" to a real session of an experience. The date appears on her page and as a badge when guests pick a time.

One person, one login: the same account is their customer account (My bookings, Saved, Following). If they also host an experience, a host area can later hang off the same account. The menu shows whichever areas the account is linked to. There is no "account type" to choose at sign-up.

#### What the customer experiences

Sign-in stays as it is today, and stays optional:

- Customers sign in with an email link or Google at truth.co.za/signin.
- Guest checkout is kept.
- Saved and Following work on the device without an account. Signing in keeps them on every device and adds My bookings.

A typical visit:

1. A TikTok or Instagram bio link opens truth.co.za/creators/trail-and-tide. The visitor sees Trail & Tide's trips and picks.
2. They open "A weekend in the Garden Route". It has:
   - a cover photo, an intro in the creator's voice, and Day 1 and Day 2 headings;
   - each stop as a bookable card: photo, price, rating and the creator's tip (for example "Take the 7am slot, the light is unreal");
   - a plain note: "Trail & Tide earns a share when you book through this guide. You pay the same price.";
   - buttons to follow the creator, save the guide, or save all its stops.
3. Tapping a stop opens the normal experience page. Because the visitor came from that creator, it also shows "Trail & Tide's tip".
4. Reserve leads to the normal booking form.
5. They pay on truth.co.za through Paystack, unchanged. As today, the creator is credited for 30 days, and the last creator visited wins.

Extras for customers:

- truth.co.za/following shows new guides from the creators they follow.
- "Share list" on Saved makes a WhatsApp-friendly link of their saved experiences, so friends can plan together.
- Later, meet-up dates show a "Zanele is joining" badge on that session.
- "Email me about new guides" comes once the email service is connected. It is opt-in per creator.

Not built at first: public customer profiles (a handle and public lists). They come only if customers ask, with opt-in and POPIA consent. Customers never see creators' earnings, and creators never see who follows them or who booked.

#### Web addresses

Everything stays on Truth's domain:

- truth.co.za/creators/trail-and-tide: their page (trips, picks with tips, later meet-up dates).
- truth.co.za/creators/trail-and-tide/garden-route-weekend: one guide. The web address is locked once the guide is published, and a few words are reserved for future sub-pages.
- truth.co.za/guides: all guides, plus a "Trips by local creators" row on the home page.
- truth.co.za/following and truth.co.za/saved (Experiences and Guides): for customers. Both work signed out, on the device.
- truth.co.za/list?e=<experience ids>: a shared saved list.
- truth.co.za/account: a signed-in hub (bookings, saved, following, and Creator studio if linked).
- truth.co.za/studio and truth.co.za/studio/guides/<id>: the Creator studio (signed in, not indexed).
- truth.co.za/admin/guides: where admins write guides.

Own domains with no code:

- A creator can forward trailandtide.co.za to their Truth page at their own registrar (a 301 redirect). Credit still works, because the visitor lands on Truth.
- A short alias such as truth.co.za/@trail-and-tide, made with a next.config rewrite, is possible later. It needs testing, because "@" folders mean parallel routes in Next.

This option has no subdomains and no custom domains.

#### How it works technically

What doesn't change: everything stays on one origin. These are untouched:

- src/proxy.ts;
- the Supabase cookie options and redirect settings;
- the checkout pages, Paystack, create_booking, confirm_booking_payment and the payout trigger.

1. Public pages stay static.

- New route src/app/(site)/creators/[slug]/[guide]/page.tsx copies the creator page: it reads params inside <Suspense>.
- generateStaticParams returns the published (creator slug, guide slug) pairs. If there are none, it returns one placeholder pair that calls notFound(), because Cache Components fails the build on an empty list.
- partialPrefetching serves the App Shell for a brand-new guide and stores the full page after its first visit.
- Data comes from a new src/lib/data/guides.ts:
  - createPublicClient() (anon), so RLS returns published guides only;
  - 'use cache', cacheLife('hours') and cacheTag('guides', 'creator:<slug>').
- Inactive or photo-less stops are dropped in code, as getCreator already does.
- getCreator (src/lib/data/creators.ts) adds a nested guides(...) select, so the creator page stays a single cached query.
- One shared GuideView server component renders the public page and the admin and studio previews. Previews read drafts through guarded reads that aren't cached.

2. Creator credit, with no booking change.

- The guide page mounts the existing <RememberCreator slug>.
- Publishing a guide inserts any missing (creator, experience) rows into creator_experience_referrals, using "where not exists" because the base table's keys aren't in the repo.
- So create_booking's existing rule (credit only a creator who recommends the experience) covers every stop.
- admin_replace_creator_experiences is redefined with the same signature. It keeps experiences used in the creator's published guides, and deletes only rows that were really removed, so tips survive.

3. Admin authoring (slice 1).

- /admin/guides (list, new, [id], [id]/preview) sits inside the existing console layout and uses requireAdmin().
- Guide fields save through the signed-in client under an "Admins manage guides" RLS policy, like saveCreator.
- Stops save in one transaction through admin_replace_guide_items(p_guide_id, p_items jsonb), modelled on admin_replace_itinerary:
  - SECURITY DEFINER, search_path '', an is_admin() check, revoked from anon;
  - at most 40 items, of kind experience, heading or note;
  - plain text up to 500 characters, with no links;
  - stops must be live experiences.
- admin_set_guide_status sets published_at on first publish and adds the stops to picks.
- Every save calls updateTag('guides'), updateTag('creators') and updateTag('experiences'), then refresh(), like refreshPages() in admin-people.ts.

4. Customer features (slice 2).

- Following copies Saved:
  - a device-first store, src/lib/following.ts, built on a device-list helper extracted from src/lib/saved.ts;
  - an account mirror, a generic AccountSync extracted from saved-sync.tsx, writing into creator_follows. Its owner-only RLS copies saved_experiences.
- /following and /list are static shells. Their client lists call server actions (like saved/actions.ts) that return cached data, so the server never reads cookies there.
- Pick tips: a new referrals.note column, shown on the creator page. On experience pages, a client CreatorTip component compares creditedCreator() with recommendedBy. It renders only after hydration, the way BookingWidget reads credit.
- Share cards: opengraph-image.tsx (next/og ImageResponse) on the creator and guide routes, generated statically.

5. Creator logins and the studio (slice 3).

- One auth user per email. Roles come from link rows:
  - customer: any signed-in user;
  - creator: a creator_members row;
  - admin: an admins row plus aal2 (unchanged);
  - host: a future host_members row of the same shape.
- Linking: an admin invites an email (admin_invite_creator writes to a private creator_invites table). On sign-in, /auth/confirm and /auth/callback call claim_my_creator() next to claim_my_bookings. Like claim_my_bookings, it accepts confirmed emails only.
- Guard: requireCreator() in src/lib/creator/guard.ts mirrors requireAdmin(). It checks getClaims, then sub, then the user's own creator_members rows; otherwise it redirects to '/signin?next=/studio'. safeNext already allows that path.
- Layout: src/app/studio/(console)/layout.tsx copies the admin console (Suspense then Guarded, instant = false, noindex).
- Writes: every creator write is a SECURITY DEFINER RPC that checks is_creator_member(p_creator_id). A row policy alone would be unsafe: UPDATE on creators is table-wide for signed-in users, so a creator could change revenue_share_percentage or slug.
- Earnings come from creator_my_earnings(): payout_items summed by month and experience, with no booking ids or guest fields (POPIA).
- Photos:
  - storage insert and delete policies cover images/creators/<creator_id>/ and images/guides/<creator_id>/;
  - the folder name is regex-checked inside a CASE before the uuid cast;
  - uploadImage() gets the creator's folder;
  - studio actions accept only URLs in that folder. Today isAllowedImageUrl accepts any file in the bucket.
- Shared forms: CreatorForm, CreatorPicksEditor and the new GuideEditor take the save action and a mode as props, so admin and studio use the same components. Studio mode hides name, slug and share.
- Menu: the site menu, a client component, reads the user's own creator_members rows to show "Creator studio", so public pages stay static.
- Studio saves call updateTag('creator:<slug>') (the first use of that tag) and updateTag('guides').

6. SEO:

- each guide has the canonical /creators/<slug>/<guide>;
- ItemList JSON-LD lists its stops, escaped like the experience page's;
- sitemap.ts adds /guides and every guide.

#### Database changes

- Slice 1 – new table guides: id, creator_id → creators (on delete cascade), slug (kebab-case, at most 80 characters, unique per creator, not a reserved word), title (3–120), intro (at most 2000), cover_image_url, region (at most 80), duration_label (at most 40, e.g. '2 days'), status draft | in_review | published | archived, published_at, created_at, updated_at. RLS: anyone reads published guides; admins manage all. Members' read of their own drafts comes in slice 3.
- Slice 1 – new table guide_items: id, guide_id → guides (cascade), position, kind experience | heading | note, experience_id → experiences (required when kind = experience), text (at most 500, the tip, heading or note; plain text, no links), unique (guide_id, position). RLS: readable when the parent guide is published, or by admins and members. No direct writes: insert, update and delete revoked from anon and authenticated.
- Slice 1 – new RPCs admin_replace_guide_items(p_guide_id uuid, p_items jsonb) and admin_set_guide_status(p_guide_id uuid, p_status text): SECURITY DEFINER, search_path '', is_admin() check, revoked from anon. Publishing, or saving a guide that is already published, inserts the missing (creator_id, experience_id) rows into creator_experience_referrals.
- Slice 1 – create or replace admin_replace_creator_experiences(uuid, uuid[]) with the same signature. It keeps experiences used in the creator's published guides and deletes only the rows that were removed, so tips survive.
- Slice 2 – creator_experience_referrals.note text (at most 280): the creator's tip on each pick. It is public like the rest of that table; confirm its grants with inspect-security.sql first.
- Slice 2 – new table creator_follows: user_id (default auth.uid(), → auth.users, cascade), creator_id (→ creators, cascade), created_at, primary key (user_id, creator_id). Owner-only select, insert and delete policies, copied from saved_experiences.
- Slice 2 (optional) – new table saved_guides (user_id, guide_id, created_at) with the same owner-only policies.
- Slice 3 – new table creator_members: user_id (→ auth.users, cascade), creator_id (→ creators, cascade), role owner | editor, created_at, primary key (user_id, creator_id). RLS: members read their own rows. Rows are written only by admin RPCs and claim_my_creator.
- Slice 3 – new private table creator_invites: id, creator_id, email (lowercased), created_by, expires_at (default now() + 14 days), accepted_at, accepted_by. RLS is on with no policies, so it is used only through RPCs.
- Slice 3 – new private column creators.guides_trusted boolean not null default false. It is not granted to anon or authenticated. Admins set it to let a creator publish without review.
- Slice 3 – new functions: is_creator_member(uuid), admin_invite_creator(uuid, text), claim_my_creator(), creator_update_my_page(uuid, jsonb) (allowed columns only, never name, slug or revenue_share_percentage), creator_replace_my_picks(uuid, jsonb), creator_save_guide(uuid, jsonb), creator_submit_guide(uuid), creator_my_summary(uuid) (share percentage and follower count) and creator_my_earnings(uuid) (totals by month and experience: earned, due and paid; no booking ids or guest data).
- Slice 3 – storage policies on bucket images: members may insert and delete under creators/<creator_id>/ and guides/<creator_id>/. The folder name is regex-checked inside a CASE before it is cast to uuid.
- Later – new table creator_dates (creator_id, experience_id, session_date, start_time, note) for meet-up sessions that must match an existing weekly session. Anyone reads future dates; admins manage.
- Later – record which guide a booking came from in the existing, unused bookings.creator_snapshot. This needs a new optional create_booking parameter, so it is deferred.

#### What it reuses

- src/app/(site)/creators/[slug]/page.tsx: the creator page gains a Guides row and a Follow button. The guide route copies its Suspense, params, generateStaticParams and metadata pattern.
- src/lib/data/creators.ts: the cached public read ('use cache', cacheTag('creators', 'creator:<slug>')), extended with published guides. It still selects public columns only.
- src/components/site/remember-creator.tsx and src/lib/creator-credit.ts: the 30-day credit, mounted on guide pages unchanged. src/components/booking/booking-widget.tsx, the book page and src/lib/actions/booking.ts still carry it to create_booking.
- src/components/experience/experience-card.tsx (ExperienceCardData), src/components/experience/experience-grid.tsx and src/components/experience/favorite-button.tsx: guide stops, grids and hearts.
- src/lib/saved.ts, src/components/site/saved-sync.tsx, src/app/(site)/saved/saved-list.tsx and src/app/(site)/saved/actions.ts: the device-first plus account-sync pattern, reused for Following and saved guides. loadSavedExperiences also powers the shared-list page.
- src/lib/use-user.ts and src/components/site/menu-button.tsx: login state read in the browser. The menu gains Following and Creator studio.
- src/components/admin/itinerary-editor.tsx (ordered steps, SmallButton), src/components/admin/creator-picks-editor.tsx, src/components/admin/creator-form.tsx, src/components/admin/image-field.tsx and src/components/admin/save-status.tsx (Section, Field, SaveStatus): the basis of GuideEditor and of the forms shared by admin and studio.
- src/lib/admin/form.ts (text, tags, link, socialLink, imageUrl), src/lib/images.ts and src/lib/upload-image.ts: validation and uploads, with new 'guides' and per-creator folders.
- src/lib/admin/guard.ts and src/app/admin/(console)/layout.tsx: the models for requireCreator() and the studio layout (Suspense, Guarded, instant = false).
- src/lib/actions/admin-people.ts: the refreshPages(), removeReplacedImages() and saveCreatorPicks patterns.
- supabase/migrations/20261030100000_admin_experience_editing.sql: the replace-all JSONB RPC pattern, reused for guide items.
- supabase/migrations/20261029140000_claim_bookings.sql: the model for claim_my_creator().
- supabase/migrations/20261029120000_security_and_availability.sql: is_admin(), the 'Admins manage …' policies, and the saved_experiences owner policies to copy.
- supabase/migrations/20261031090000_private_people_columns.sql: column grants (new creator columns stay private) and admin_replace_creator_experiences, which gets redefined.
- supabase/migrations/20261101090000_payouts.sql with src/lib/payouts.ts, src/components/admin/report-parts.tsx (Stat), src/components/admin/bar-chart.tsx and src/lib/format.ts (formatRand): the creator earnings view.
- src/app/auth/confirm/route.ts, src/app/auth/callback/route.ts and src/lib/safe-next.ts: claim_my_creator is added next to claim_my_bookings, and /studio is already a safe next path.
- src/app/sitemap.ts, e2e/browse.spec.ts and e2e/admin.spec.ts: guide URLs go into the sitemap, and new tests follow the existing page and signed-out lockout patterns.
- supabase/audit/inspect-security.sql: run before writing new policies, because the base tables, their policies and the referrals table's keys aren't in the repo.

#### New work

- Slice 1 migration supabase/migrations/<timestamp>_creator_guides.sql: guides, guide_items, RLS and grants, admin_replace_guide_items, admin_set_guide_status and the redefined admin_replace_creator_experiences, ending with a check query as usual.
- src/lib/data/guides.ts: getGuide, getCreatorGuides, getLatestGuides and getPublishedGuidePaths, all cached and tagged 'guides'.
- src/app/(site)/creators/[slug]/[guide]/page.tsx: Suspense; generateStaticParams with a placeholder fallback; generateMetadata with the canonical; ItemList JSON-LD; RememberCreator.
- src/app/(site)/guides/page.tsx, a 'Trips by local creators' row in src/app/(site)/page.tsx, and a Guides row on the creator page.
- src/components/guide/: guide-view.tsx (shared by the public page and previews), guide-card.tsx, guide-stop.tsx (ExperienceCardData plus a tip), earns-note.tsx (the disclosure) and save-all-button.tsx (uses replaceSaved).
- Admin: src/app/admin/(console)/guides/ (list, new, [id], [id]/preview), src/lib/admin/guides.ts, src/lib/actions/admin-guides.ts, src/components/admin/guide-editor.tsx and guide-form.tsx, a Guides item in the admin menu, and locked guide stops in the picks editor.
- Seed SQL for the owner to paste: one demo guide each for Zanele Eats and Trail & Tide, with ids starting with 'de' so the demo set can still be removed in one go.
- Slice 2: migration <timestamp>_follows_and_tips.sql; src/lib/device-list.ts (a shared store extracted from saved.ts) plus following.ts and saved guides; src/components/site/account-sync.tsx (SavedSync made generic); src/components/creator/follow-button.tsx; src/app/(site)/following/page.tsx; src/app/(site)/list/page.tsx; src/components/experience/creator-tip.tsx; a tip field in the picks editor; opengraph-image.tsx on the creator and guide routes.
- Slice 3: migration <timestamp>_creator_studio.sql; src/lib/creator/guard.ts; src/app/studio/(console)/ (layout, overview, page, picks, guides, guides/[id], earnings); src/lib/actions/studio.ts; the shared editors changed to take an action and a mode; claim_my_creator in both auth routes; a useMyCreatorPages() hook and menu link; 'Invite to studio' and 'Guides to review' in admin.
- Later (slice 4): a creator_dates table; a 'Zanele is joining' badge in BookingWidget's session list (one change covers the desktop card and the phone sheet); a 'Join me' section on creator pages.
- Tests: unit tests for the guide item schema and the device-list store. E2e tests: the guide page shows its stops and sets truth-creator in localStorage; follows persist; the sitemap lists guides; signed-out visitors are locked out of the admin guide and studio pages. Each migration ends with a check query. The owner tests the studio once with a second, non-admin account.
- Docs: add the routes, tables and RPCs to AGENTS.md, and log each step in docs/PROGRESS.md.
- Critical files for implementation: supabase/migrations/<timestamp>_creator_guides.sql (new), src/lib/data/guides.ts (new), src/app/(site)/creators/[slug]/[guide]/page.tsx (new), src/lib/data/creators.ts, and src/components/admin/itinerary-editor.tsx (the basis of GuideEditor).

#### Effort estimate

Overall this is L (slices 1 to 3). It would be built and reviewed in small approved steps, like steps 4a to 4f. All figures are my judgement, not measured, and your reviews set the pace.

| Slice                                                                        | Size | Time                                     |
| ---------------------------------------------------------------------------- | ---- | ---------------------------------------- |
| 1. Guides v0, written by admins                                              | M    | About 1–2 days including your reviews    |
| 2. Personality pack: follow, save guides, share list, pick tips, share cards | S    | About 1 day                              |
| 3. Creator studio and creator logins                                         | L    | About 2–4 days                           |
| 4. Meet-up dates                                                             | S–M  | About 1 day, plus agreeing it with hosts |
| Bundled checkout for several experiences                                     | XL   | Not recommended now                      |

Your steps:

- Approve a mock of the guide page on the Claude Design board first.
- Paste each migration into the Supabase SQL editor (as today) and approve each step.
- Write or approve the text of the two demo guides.
- Before slice 3, decide the money rule: publishing a guide adds its stops to the creator's picks.
- For slice 3:
  - Create the Google OAuth client (already on the open-items list), and/or connect the email service (Resend) in Supabase Auth.
  - Decide whether a creator's first guides need your review.
  - Decide whether the earnings page needs the authenticator code once bank details are added. That would need new code-setup screens; none exist today.
  - Invite creators from their admin page.
  - Test once with a second, non-admin account.

#### Running costs

Slices 1 and 2 need no new services:

- A few small tables and creator photos (at most 2 MB each) fit well inside the current Supabase plan.
- Guide pages are prerendered, so Vercel usage barely moves. Truth needs the Pro plan ($20 a month) for a commercial site anyway.

Slice 3:

- Google sign-in is free.
- Email-link sign-in needs the email service you'd connect for launch anyway. Resend is free up to 3,000 emails a month (100 a day), and paid plans start around $20 a month for 50,000. These are third-party figures; check resend.com.

The real cost is people time: writing or approving guides, onboarding creators, reviewing their content and answering their questions. Creator earnings still come out of Truth's commission. Guides raise them only when bookings rise.

Sources:

- [Resend pricing summary (third party)](https://automationatlas.io/answers/resend-pricing-explained-2026/)
- [Resend free tier summary (third party)](https://automationatlas.io/answers/resend-free-tier-explained-2026/)

#### Risks

- Cold start: there are no real creators yet, so guides need writing, photos and upkeep. Fix: admins ghost-write from the creator's WhatsApp notes, and Truth launches with 2–3 strong guides.
- Content liability: creator text appears on Truth's domain (safety claims, rude remarks about hosts, links to competitors). Fix: plain text with no links, review before publishing (at least a creator's first guide), admins can unpublish, and a clear 'earns a share' note in line with the IAB SA disclosure toolkit.
- Money rule change: publishing a guide adds its stops to the creator's picks, so more bookings can earn a share. The admin picks editor must lock those stops. The owner should approve this rule before it is built.
- Build gotcha: with Cache Components, generateStaticParams must return at least one value, so the guide route needs a placeholder fallback. Test pnpm build with zero published guides. Guide slugs must also avoid the names of future sub-pages.
- Security (slice 3): UPDATE on creators is table-wide for signed-in users, storage uploads are admin-only and their paths don't record an owner, and isAllowedImageUrl accepts any file in the bucket. Creator writes must therefore go through membership-checked RPCs, folder-scoped storage policies and own-folder URL checks. Run inspect-security.sql first, because the base schema isn't in the repo.
- Privacy (POPIA): creators see counts and earnings by month and experience only, never who follows them or guests' names, emails or phones. Emails to followers need explicit opt-in (section 69) and the email service.
- Self-dealing: a creator who books through their own guide, or a host who is also a creator and recommends their own experience, would earn a share. Decide whether to allow and disclose it, or block it; blocking needs a small create_booking change.
- Stale trips: experiences that are hidden or whose schedules end drop out of guides. Show warnings in admin and the studio, and hide a guide that falls below two bookable stops.
- Attribution stays per creator, last visit wins, for 30 days. It doesn't record which guide sold, and adding that needs a later create_booking change.
- Quiet social features: following and profiles may see little use early. Google Maps dropped following contributors in 2025. Keep them device-first and cheap, and don't build feeds or notifications without signs of demand.
- Scope creep into the money path: bundles and multi-item checkout would touch Paystack references, holds, refunds and payouts. Keep them out.
- Dependencies and timing: creator logins wait on Google sign-in or the email service, and launch (step 5) is on hold, so this adds scope before launch.

#### What it unlocks

- **A page that feels personal:** each creator's page is clearly theirs (their trips, their tips, their face on every share card) with no domain or DNS work. It is one link they're proud to put in a TikTok or Instagram bio.
- **More bookings per visit:** a trip sells several experiences, which helps hosts, creators and Truth.
- **Search traffic:** unique, long-tail pages for Google, such as "weekend in the Garden Route".
- **Easier curation:** the home page and seasonal campaigns can be built from guides.
- **Returning visitors** through following, with opt-in alerts later.
- **A recruiting pitch for South African creators:** earn in rands from your own trips.
- **Host logins later:** the creator_members pattern can give hosts their own login on the same account.

Options that build on guides later:

- meet-up dates with the creator;
- creator codes that can be said aloud on TikTok or shared on WhatsApp;
- recording which guide a booking came from (in bookings.creator_snapshot);
- printable guides (the print styles already exist);
- a path from customer to creator, where shared lists that lead to bookings earn an invitation;
- much later, bundled checkout.

#### Is it worth it? (for and against)

**For:**

- **It gives creators what "my own domain" is really after.** That is a page that is clearly theirs and worth putting in their bio. Here it comes from content: their trips, their tips, and their face on every share. This is how Viator Shop, Expedia Travel Shops and ShopMy do it, and Viator suggests multi-day itinerary collections to its creators. Custom domains show up only where creators sell their own products, and even on Substack only about 16% of publications use one.
- **Trips sell several experiences per visitor.** That helps hosts, creators and Truth, and gives Google unique pages.
- **It suits how South Africans share.** Sharing happens through TikTok bios (about 29M adults reached, against Instagram's 8.6M) and WhatsApp, so one good link with a branded preview card beats a separate domain.
- **The risk is low.**
  - Slices 1 and 2 change no sign-in, proxy, booking or Paystack code.
  - They reuse the creator page, the credit, the cached-data pattern and the admin editors.

**Against:**

- **There are no real creators yet.** Truth would help write the guides, and building tools nobody uses is the main waste risk.
- **Following and profiles are often quiet early on.**
- **Creator logins add real security work** (safe database functions, storage rules), and they wait on Google sign-in or the email service.
- **Launch is on hold,** so this is extra work before step 5.
- **There's no South African evidence yet** that guides convert better. Treat slice 1 as an experiment.

**Verdict: worth doing, in thin slices.**

- Build slice 1 when you want a pre-launch feature. It takes about 1–2 days and makes a strong pitch to recruit creators: "here is your page with your first trip".
- Build slice 2 if you like how it feels.
- Build the Creator studio only when 3–5 real creators are active and want to edit their pages themselves.
- Skip custom domains: tell creators to forward a domain they own instead.
- Skip bundles for now.

Sources:

- [Viator Shop](https://partnerresources.viator.com/viator-shop/)
- [Viator: ideas for collections](https://partnerresources.viator.com/blog/social-media/ideas-for-creating-collections-with-viator-shop/)
- [Viator Shop collections](https://partnerresources.viator.com/blog/how-viator-shop-is-changing-the-link-share-game/)

#### What to build first

Guides v0, written by admins (slice 1).

Step 0: mock the guide page and the creator page's new Guides row on the Claude Design board, and get your approval.

Then build:

1. One additive migration:
   - the guides and guide_items tables;
   - public read for published guides only;
   - the admin save and publish functions;
   - the picks function, redefined so it keeps guide stops.
2. A public page at /creators/<slug>/<guide> with:
   - the cover, intro and Day headings;
   - stops shown as experience cards with the creator's tip;
   - the note "Trail & Tide earns a share when you book through this guide. You pay the same price.";
   - a "Save all stops" button;
   - RememberCreator, so the creator gets credit as today.
3. A Guides row on the creator page and a /guides page.
4. Guide entries in the sitemap.
5. Admin Guides screens, built from ItineraryEditor, CreatorPicksEditor and ImageField.
6. One demo guide each for Zanele Eats and Trail & Tide, with ids starting with "de".

It changes no logins, email, proxy, booking or Paystack code.

It is done when:

- a guest opens a demo guide, books one of its stops in Paystack test mode, and the creator's earning appears under Payouts;
- e2e tests cover the page, the credit and the admin lockout;
- pnpm build still passes when no guide is published.

---

## 5. The three reviews

### Review 1: Business value and whether it's worth doing

**What this reviewer judged:** Business value and whether it's worth doing. Judged against doing nothing: creator appeal, customer conversion, revenue, the owner's time and money, and what else that time could buy, for a pre-launch marketplace with no real creators.

**When to do it:** once there are real creators using it. One exception: the half-day ?via= fix should go in before or with launch prep. Otherwise the first creator posts at launch that link to a single experience earn nothing.

Everything the owner actually asked about (creator logins, a page of their own, their own domain) earns nothing until Truth launches, and launch is on hold. The same launch tasks unblock customer login, which is already built: connect an email service, create the Google sign-in client, and set the production domain and deploy.

Build creator accounts only once 3 to 5 real creators are each bringing bookings or asking to see their numbers. Until then, the existing payment statements cover trust at zero build.

| Option                   | Score (out of 10) |
| ------------------------ | ----------------- |
| A-lean-accounts          | 6                 |
| B-branded-subdomains     | 3                 |
| C-own-domain-storefront  | 2                 |
| D-truth-everywhere       | 7                 |
| E-curators-and-community | 4                 |

#### A-lean-accounts: 6/10

If creators are ever going to log in, this is the version to build. It follows the industry pattern (a page on the platform, one login, an earnings view), costs R0 a month, needs no DNS, and reuses sign-in, the earnings trigger and the admin editors. Its slices wait for demand. On business value, though, only part of slice 0 beats doing nothing. The ?via= link fixes a real leak: today a creator who links straight to one experience earns nothing, because credit only comes from visiting the creator page. The /@handle is cosmetic, since the old path keeps working and the handle can be added any time. Slices 1 to 3 only pay off once real creators exist. Even then, the first 5 to 10 creators get the same trust from a monthly WhatsApp of the existing Payment statement PDF, at zero build. A's trigger for slice 1 (when the first real creator agrees to join) is too early; 3 to 5 creators actively asking to see their numbers is better. Slice 3's visit counts are vanity numbers that nobody gets paid on.

**Biggest concern:** It builds dashboards and self-editing before any creator exists, and leaves untouched the things that decide whether creators join: the 5% rate, the picks-only and last-visit credit rules, and how fast payouts arrive.

**Factual problems found:** Slice 0's claim that it 'improves demos and creator pitches' is overstated. Share links would be built from NEXT_PUBLIC_SITE_URL, which defaults to http://localhost:3000 (src/lib/env.ts), so nothing can be handed out before the production domain exists. The '30 days' in the dashboard explainer isn't true on iPhones: Safari deletes a site's localStorage after 7 days of Safari use without interaction on the site (Intelligent Tracking Prevention). Showing each booking's session date and guest count can let a creator identify a friend who booked; D's month-only view is safer. The /@ rewrite is still unproven (A says so). The claim that not getting paid is creators' top frustration rests on a vendor-biased survey summary.

#### B-branded-subdomains: 3/10

This bets on branding, the least-proven lever, and the research points the other way. The big programmes keep creator pages as paths on their own domain. Linktree holds about 80% of Instagram link-in-bio users. South African creators are TikTok-first and earn mostly from brand deals. So a Truth page is far more likely to become one link inside a creator's Linktree than to replace it. B is size L and needs the production domain, a nameserver move (which puts business email at risk if the MX records aren't copied), the email service and Vercel Pro, all of which are on hold. It also turns Truth into a small website builder, with design requests and content moderation that never stop. Branding doesn't change what a creator earns, and switching brands at checkout may cost bookings. Slice 1 (themes and link blocks on today's page) has some pitch value, but it doesn't beat doing nothing on bookings.

**Biggest concern:** Ongoing support and moderation of a page builder that creators may never put in their bio, built before any creator exists and while everything it depends on is on hold.

**Factual problems found:** CaptureVia strips ?via= from the address with history.replaceState. Instagram and TikTok in-app browsers keep storage separate from Safari and Chrome, so after 'Open in browser' the creator loses credit, which is exactly what the design is meant to protect. D keeps ?via= in the URL for this reason. The shared credit cookie is written by browser JavaScript, and Safari caps such cookies at 7 days, so the 30-day Max-Age doesn't hold on iPhones. 'Replaces Linktree' is an assumption with no South African evidence behind it.

#### C-own-domain-storefront: 2/10

Its own verdict is 'not now', and on this lens it is the weakest option. It is size XL (5 to 8 weeks), and every creator domain becomes an open-ended DNS support job. Its default SEO setting ('creator') makes Truth's own creator page tell search engines that the creator's domain is the main page, and removes it from Truth's sitemap. That gives away search ranking before Truth has any. It adds a hop to another domain just before payment, and C itself lists lost bookings as a risk. A creator can also point the domain at a competitor in minutes. No travel affiliate programme hosts creator pages on creators' own domains, and only about 16% of Substack publications use a custom domain even though it's cheap there. Its one strong idea is shops for guesthouse and hotel partners. That is a separate decision about a B2B channel, and links, a QR code at reception or D's embed would serve it first.

**Biggest concern:** Truth pays for creators' own brand and search ranking with its own time and ranking, and takes on support for every domain forever, for a demand no comparable programme has seen.

**Factual problems found:** The claim that on a shop 'the domain itself is the credit' and Safari's 7-day wipe 'can't touch it' only holds for bookings made in the same visit. A guest who comes back later straight to Truth relies on browser storage, as in every other option. The ongoing time costs (30 to 90 minutes to set up each domain, 1 to 2 hours a month per 10 domains) are the author's guesses. The claim that Shopify moved checkout to merchants' domains in July 2017 isn't backed by the research, though it doesn't change the verdict.

#### D-truth-everywhere: 7/10

This is the only option whose first step clearly beats doing nothing. Today a creator who posts a link to one experience earns nothing. Stage 1 fixes that in about a day with no migration. It keeps ?via= in the address so credit survives when a guest moves from an in-app browser to their normal browser, and it falls back to the address when storage is blocked. Every other option needs this piece anyway. It also matches how South African sales actually happen (WhatsApp, TikTok bios, offline), and how Viator and GetYourGuide run their creator programmes (links, widgets and dashboards, never creator-owned domains). Its later modules wait for sensible triggers: the hub at 3 to 5 active creators, codes once creators sell through video or WhatsApp. It also raises two real business issues the others missed. Crediting only a creator's picks is stricter than Viator, which credits any booking within 30 days. And nothing currently stops other sites from framing Truth's pages. It isn't scored higher because the Share kit and QR codes are useless until the production domain exists, and Module B's click counts and short links drift toward a link-analytics product. Embeds also suit few South African creators, and codes that give no discount give guests little reason to type them.

**Biggest concern:** Scope creep beyond Stage 1. Short links, click analytics and embeds add a redirect endpoint and a framing opening that must be secured, for numbers that don't pay anyone.

**Factual problems found:** Minor ones only. The Share kit 'helps demos and the first pilot creators' only once the production domain exists, which D admits in its risks. Blocking framing (frame-ancestors) has no effect on full-page Paystack or Supabase redirects, so re-testing those is unnecessary, though checking the browser pane still loads is fair. Checked and correct: next.config.ts has no headers(); MobileBooking's close() keeps location.search; the canonical tags drop the query string; due_on is the session date plus one day (payouts.sql), so showing earnings by month only is the right privacy call; and Viator credits any experience booked within 30 days.

#### E-curators-and-community: 4/10

This is the most creator-native idea: collections and tips are how Viator Shop, Expedia and ShopMy make a page feel personal. Slice 1 is low-risk, since it changes no sign-in, booking or Paystack code. It has real pitch value ('here is your page with your first trip'), and guides could raise bookings per visit and add pages for search. The business case falls apart on supply and owner time. Fourteen experiences spread over Cape Town, Bo-Kaap, Soweto, Knysna and Durban can't fill guides with several stops anywhere but Cape Town. Slice 1 also makes the owner the ghost-writer of every guide. Search traffic needs a live domain and months to arrive, and following creators is likely to be quiet. Publishing a guide quietly widens which bookings earn creator credit, which is a money-rule change hidden inside a content feature. And it keeps the main credit leak: a creator who posts a link to one stop still earns nothing.

**Biggest concern:** The owner writes content for a catalogue too thin to fill it, before any creator has shown they bring bookings.

**Factual problems found:** There is no ?via= catcher. Guide pages credit the creator only through RememberCreator, so a link to a single stop posted on social media still earns nothing. The estimate of 1 to 2 days for slice 1 (two tables, three database functions, a public route, a /guides page, a home-page row, an admin editor and demo content) looks optimistic at the owner's approve-each-step pace. With today's supply, E's own rule to hide guides with fewer than two bookable stops would hide most guides outside Cape Town.

#### Recommended combination

Before or alongside launch prep (about half a day, no migration), build only the core of D's Stage 1:

- a browser-only ?via= catcher on every page that leaves ?via= in the address;
- BookingWidget falling back to the address when storage is blocked;
- unit and e2e tests.

This closes a real leak: today a creator who links to one experience earns nothing.

Hold the admin Share kit, the QR library and A's /@handle until the production domain exists, because links built before then point at localhost. After that, add a plain copy-link list to the admin creator page.

Owner decisions now, with no build:

1. Should tapping a 'Recommended by' chip inside Truth earn credit? Today it does. Truth then pays a share on its own visitors, and a later visit to another creator's page overrides the creator who actually sent the guest.
2. Credit only the creator's picks, or any booking within the credit window, as Viator does?
3. The launch rate. At 5%, a R75 booking earns the creator R3.75.
4. Can creators earn on their own bookings?
5. When are creators paid?

Run creators by hand at first:

- WhatsApp each creator the existing Payment statement PDF monthly;
- admins edit their pages;
- creators who want their own domain set their registrar to forward it to their Truth page.

Later, when triggered:

- A's slice 1 (creator_members, one login, read-only earnings shown by month as D proposes) once 3 to 5 creators each bring bookings or ask to see their numbers;
- D's creator codes (Module C) if creators sell through WhatsApp or video;
- E's per-pick tips or guides only where one region has 4 or more bookable experiences.

Skip B and C. Revisit hosted domains only for a named creator with real volume, or a guesthouse partner, and serve partners with links, QR codes or an embed first.

#### The case against doing anything

Nothing here earns a rand until Truth launches, and launch is on hold.

**The customer half of the question is already built.** Email-link and Google sign-in, My bookings and Saved all exist. They are blocked only by owner setup: an email service, the Google sign-in client and the production domain.

**Most of the creator half already exists too:**

- a public creator page on Truth;
- automatic credit;
- earnings recorded by a trigger;
- Payment statements that print without guest details, so the owner can WhatsApp each creator a monthly PDF at zero build.

'Their own domain' is free today through registrar forwarding.

**The economics, not page ownership, will decide whether creators join.** With no real creators and only 14 experiences, a creator's page shows a handful of picks. At the 5% share used in the owner's tests, a creator earned R3.75 on a R75 booking and R12 on a R240 one. South African creators earn mostly from brand deals.

**Building now has a cost.** Every build step uses the owner's approval time, the scarcest resource, and fixes assumptions in place before a single creator has said what they want.

**The cheapest experiment:** recruit 3 to 5 creators by hand on today's page at launch, then watch the creator filter on the admin Bookings screen. If they bring no bookings, no page design will fix that. If they do, their requests show what to build.

#### What the designs missed

- Truth already pays creators on its own traffic. Every experience page shows 'Recommended by' chips that link to the creator page, and that page stores 30-day credit on any visit (RememberCreator). So a Truth visitor who taps a chip and then books earns that creator a share. The visit also overrides the creator who actually sent the guest, because the last visit wins. With an 18–20% commission, a 5% share is roughly a third of what Truth keeps after Paystack's fee. The owner should decide whether only visitors arriving from outside Truth (?via= links, the creator's bio link, codes) earn credit.
- The money on offer will decide whether creators join, not who owns the page. In the owner's own tests creators earned R3.75 on a R75 booking and R12 on a R240 one, and South African creators earn mostly from brand deals. No design estimates what a creator would earn in a month, or weighs a higher launch rate (Viator pays 8%), a first-booking bonus, a free experience in exchange for content, or faster rand payouts.
- Crediting only a creator's picks is stricter than the industry: Viator credits any experience booked within 30 days. Combined with 'last visit wins', expect 'why didn't I get credit?' disputes. Only D raised this, and it's an owner decision, not a build.
- The 30-day credit isn't true on iPhones. Safari deletes a site's localStorage, and expires cookies written by its scripts, after 7 days of Safari use without the visitor interacting with the site. In-app browsers keep their storage separate from Safari. A guest who discovers an experience on their phone and books on a laptop is never credited. Only credit carried in the link, or a code the guest types, survives. Tell creators their numbers are a minimum.
- There is no success measure or go/no-go trigger. The admin Bookings screen can already filter by creator, so the owner can measure credited bookings per creator per month (and how many came from outside links) before building anything.
- Supply is the real limit. With 14 experiences spread over about five regions, creator pages, guides and storefronts will look thin whatever the design. Recruiting hosts in creators' niches, or creators who bring their favourite hosts, is worth more than page features.
- A manual version already exists. The Payment statement (Print or save as PDF) and each creator's Payouts page show earnings without guest names. Monthly WhatsApp statements cover trust for the first 5 to 10 creators at zero build.
- Launch gates everything. Pitching creators before launch needs a deployed site at a real address. Links, QR codes and domain forwarding can't be handed out until the production domain is final, and today NEXT_PUBLIC_SITE_URL defaults to localhost.
- A one-page creator agreement would prevent more disputes at the start than any dashboard. It should cover the rate, the credit rules, earning on your own bookings, the duty to disclose paid links (IAB SA toolkit, Advertising Regulatory Board rulings) and payout timing.
- The owner's ongoing hours are the real cost, given they approve every step: moderating creator content, credit disputes and DNS help. No design estimates these per week.

---

### Review 2: Technical fit, effort and risk in this codebase, including maintainability for a team of one AI developer and a non-developer owner

**What this reviewer judged:** Technical fit, effort and risk in this codebase, including maintainability for a team of one AI developer and a non-developer owner. Claims were checked against the code in truth-web and the Next 16.4 sources and docs in node_modules.

**When to do it:** now, before launch. Only the slice with no migration belongs before launch:

- It takes about half a day.
- It changes no auth, proxy or database code.
- It can be fully tested with e2e now.
- Every option needs it.
- It closes a real gap: today a link straight to an experience credits nobody; only visiting /creators/<slug> does.

Creator accounts wait for two things:

- prerequisites on the paused launch list: the email service or the Google OAuth client, and the production Site URL;
- a real creator to test against.

So start A's slice 1 when the first creator commits. Don't schedule B or C at all until creators ask for them and Truth is live on its own domain.

| Option                   | Score (out of 10) |
| ------------------------ | ----------------- |
| A-lean-accounts          | 8                 |
| B-branded-subdomains     | 4                 |
| C-own-domain-storefront  | 3                 |
| D-truth-everywhere       | 8                 |
| E-curators-and-community | 5                 |

#### A-lean-accounts: 8/10

Best fit for this codebase. Every new piece copies something that already works:

- creator_members mirrors public.admins.
- claim_my_creator_invites copies claim_my_bookings, including its confirmed-email check (20261029140000_claim_bookings.sql).
- requireCreator copies src/lib/admin/guard.ts.
- The layout copies src/app/admin/(console)/layout.tsx (instant = false, Suspense around Guarded).

Routing all creator writes through SECURITY DEFINER RPCs is the right call:

- UPDATE on creators is still table-wide for authenticated. Migration 20261029120000 L403 revoked only truncate, trigger and references.
- saveCreator writes the share through the signed-in client (admin-people.ts L180 and L206).

What stays untouched: the proxy, the host-only cookie, the Supabase redirect list and the Paystack callback (payment.ts L48). Dashboard reads go through server.ts, which calls connection(), so public pages stay static.

The /@ trick at least compiles:

- Next 16.4 bundles path-to-regexp v6, where '@' is a literal character.
- A rewrite returned as an array runs afterFiles, which is after the proxy.
- normalizeAppPath strips '@' only from file paths (route-module.js L515), not from request URLs.

About 6 build days in S-sized slices is realistic given the reuse. Maintainability is high: one domain, one session and additive migrations.

**Biggest concern:** The security-sensitive parts are written against a base schema and storage policies that aren't in the repo. These are the SECURITY DEFINER RPCs, the earnings projection and the storage folder policies. One mistake there leaks guest data or lets a creator touch money columns. Running inspect-security.sql before and after each migration has to be mandatory.

**Factual problems found:** 1) The menu's head-count query on creator_members is not limited to the user's own rows for an aal2 admin. The 'Admins manage creator members' FOR ALL policy also grants SELECT on every row. It must filter by user_id or use my_creators(). 2) %40-encoded links will 404. Under next start, rewrite matching uses the raw, undecoded pathname (server/lib/router-utils/resolve-routes.js L226-244). Only the proxy matcher also tries a decoded path (L343-350). So /%40zanele-eats won't match /@:slug unless a second '/%40:slug' source is added, or the fallback /c/<slug> is used. Client-side navigation and prefetch to /@slug from the Recommended-by chips also need an e2e test, not just direct loads. 3) creator_my_earnings returns the session date, guest count and due_on. due_on is the session date + 1 (payouts.sql L87), so this is more identifying than needed at Truth's volumes. Month-level is safer. 4) next=/creator survives Google sign-in (auth.ts L50). For email links it depends on the dashboard email template, which the code comment says uses {{ .SiteURL }} (auth/confirm/route.ts L15). Unverified. 5) creator_replace_my_picks caps at 50 picks, but admins may set 100 (admin-people.ts L220). A creator with more than 50 admin-set picks couldn't save. 6) The design doesn't list two places that still say /creators/: saveCreator's success text and the sitemap assertion in e2e/browse.spec.ts L57.

#### B-branded-subdomains: 4/10

The routing part is clever and real. Host routing can live entirely in next.config. Next's matchHas (next/dist/shared/lib/router/utils/prepare-destination.js):

- lowercases the host;
- strips the port;
- anchors the pattern as ^value$;
- turns named groups into params.

So src/proxy.ts, updateSession, sign-in, the Supabase allow-list and Paystack all stay on the main domain. Pages stay prerendered because nothing reads headers(). Cross-submitting the sitemap through the shared robots.txt (the sitemaps.org rule) is also correct.

But the option stacks several independent systems on a team of one AI developer:

- a JSON block builder, validated in Zod, in SQL and on read, with drafts, preview and publish;
- 4–6 contrast-checked brand presets in light and dark;
- host-matched redirects, rewrites and CSP that change with an env flag and can't be exercised on Vercel previews;
- a cross-subdomain credit cookie;
- a nameserver move for the wildcard certificate.

All of this comes on top of A's login and RPC work. Effort is a real L, and the slice estimates are optimistic.

**Biggest concern:** Host routing and the shared credit cookie can only be proven on the production domain, after a nameserver move. The page builder becomes a permanent maintenance and moderation surface, for a feature comparable programmes don't offer.

**Factual problems found:** 1) data-brand on the page wrapper won't reach pop-ups. Sheet renders through createPortal into <body> (src/components/ui/sheet.tsx L59), so sheets lose the brand colours. C avoids this by setting data-accent on <html>. 2) matchHas strips the port before matching, so the host regex must be built from a root without a port. The stated env values 'localhost:3000' and 'localhost:3100' would never match if inserted as-is. 3) The document.cookie credit cookie can't keep its 30-day Max-Age in Safari. Safari ITP caps cookies set by script at 7 days. The cap can drop to 24 hours when the visitor arrives through a decorated link from a domain Safari classifies as a tracker; Facebook and Instagram link shims are typical. 4) The catch-all redirect from a creator host to truth.co.za/:path drops the creator. It should append ?via=<slug>, as C does. 5) Slice 1 in 1–2 sessions is optimistic: presets, block editor, a migration with column grants, the route-group move, the ribbon and tests. 6) Whether Vercel serves host-matched beforeFiles rewrites from the prerender cache under cacheComponents is unverified; the design says so itself.

#### C-own-domain-storefront: 3/10

Technically honest, and its line references check out:

- the book page accepts creator (L23-32);
- the BookingWidget Reserve link (L120-123);
- the proxy matcher (L11);
- payment.ts L48;
- proxy.md's note on RSC headers and rewrites.

Global Config is real (Vercel changelog, 29 Jul 2026). Auth, the host-only session cookie, the Supabase allow-list and the Paystack callback all stay on Truth's host. Shop pages stay prerendered because nothing reads headers().

But it moves routing into src/proxy.ts, which runs on every request. The proxy gains:

- a host branch;
- rewrites into a new /s/[site] tree;
- 308 redirects for every app path;
- a 404 for /s/* on Truth's host;
- a matcher change for robots and sitemap.

Other problems:

- Host routing can't be exercised on Vercel previews.
- The first slice can't go live until Truth itself is live on its own domain.
- Each domain needs an env edit and a redeploy in stage 1, or a Vercel API token, Global Config and a cron job in stage 2.
- It adds canonical, robots and sitemap logic per host, plus open-ended DNS support.

XL for this team.

**Biggest concern:** A bug in the host branch of the always-on proxy can take down the whole marketplace. The DNS, TLS, redeploy and API-token work becomes a permanent support load for an owner who is not a developer.

**Factual problems found:** 1) 'The domain itself is the credit, immune to Safari's storage wipe' holds only for stage 2's direct Reserve link carrying creator=. In stage 1, picks land on Truth with ?via=, and BookingWidget still reads localStorage through creditedCreator() (booking-widget.tsx L55), unless a URL fallback is added. 2) 'The shop sets no cookies' needs checking. The root layout still runs the theme script (localStorage) and SavedSync/useUser (Supabase browser client) on shop hosts (src/app/layout.tsx L55 and L59). Probably no cookies are set, but storage is used; the planned e2e test must confirm. 3) Rewriting /s/* to '/not-found' returns a 404 only because no such route exists. Returning a 404 directly is cleaner. 4) The default seo_mode 'creator' points Truth's own /creators/<slug> canonical at the creator's domain and drops the page from Truth's sitemap. A cross-domain canonical is only a hint, so the outcome is unpredictable.

#### D-truth-everywhere: 8/10

The most accurate design against the code. I confirmed:

- Canonicals already drop the query string (experiences/[id]/page.tsx L48, creators/[slug]/page.tsx L31).
- #book opens the phone sheet, and close() keeps location.search (mobile-booking.tsx L26-40).
- next.config.ts has no headers(), and there is no vercel.json.
- attach_payment_reference is service-role only (20261029130000_payments.sql L119-122).
- The last matching header wins (headers.md L47).

Stage 1 touches no routing, no migration and no auth:

- a pure creatorFromSearch() next to the existing SLUG regex;
- one client effect that reads location.search, so pages stay prerendered;
- a BookingWidget fallback;
- an admin share section.

It feeds the existing creator= → hidden input → create_booking chain, which stays unchanged. It also fixes a real gap: today a link straight to an experience credits nobody; only a visit to /creators/<slug> does.

Later modules add surfaces worth gating:

- a site-wide frame-ancestors header plus an /embed iframe route;
- an unauthenticated /r/ route that writes with the service-role key;
- link and click tables with a trigger;
- a new QR dependency.

Its creator hub is A's slice 1 with better privacy.

**Biggest concern:** Module B's /r/ endpoint is public and unauthenticated, yet writes through the service-role key on every hit. That means bot inflation, cost, and an extra South Africa to Dublin (dub1) round trip on every tap. Module A changes framing headers site-wide. Both are permanent surfaces for modest value.

**Factual problems found:** 1) Internal inconsistency: earnings lines are meant to show the session month instead of due_on, but the TypeScript side 'reuses earningStatus'. earningStatus needs dueOn to tell due from upcoming (src/lib/payouts.ts L11-18), so the status would have to be computed in the RPC. 2) The iframe guard is belt-and-braces. Browsers already partition iframe storage, so a framed page can't plant first-party credit anyway. 3) CaptureVia in (site)/layout.tsx runs once per full page load. Soft navigations inside the site to a ?via= URL won't be captured; the BookingWidget fallback only covers the current URL.

#### E-curators-and-community: 5/10

Fits existing patterns well:

- admin_replace_itinerary and itinerary-editor.tsx as templates;
- cached loaders with cacheTag;
- RememberCreator reused on guide pages;
- it anticipates the Cache Components rule that generateStaticParams must return at least one param.

Slices 1 and 2 touch no auth, proxy, booking or Paystack code.

But most of the work is content features beyond the owner's question: logins arrive only in slice 3, and own domains never.

- It changes existing money-relevant behaviour. Publishing a guide adds its stops to the picks, which changes who create_booking credits, and admin_replace_creator_experiences is redefined.
- It refactors tested code (saved.ts into a device-list store, SavedSync into AccountSync) for an unproven Following feature.
- It adds ongoing authoring and moderation work.

Effort is L. Slice 1 at 1–2 days is optimistic given the migration, three RPCs, the public route, the guides index, the home row, the admin screens, the editor, the seed and the e2e tests.

**Biggest concern:** Redefining admin_replace_creator_experiences changes an existing money-relevant RPC that deleteCreator also relies on. Guides also create a permanent writing workload before any creator exists.

**Factual problems found:** 1) deleteCreator clears picks by calling admin_replace_creator_experiences(id, []) before deleting the creator (admin-people.ts L259-264). A redefinition that keeps stops used in published guides would leave referral rows behind. If the base-schema foreign key from creator_experience_referrals to creators isn't ON DELETE CASCADE (it isn't in the repo), creator deletion starts failing. 2) Redefining an existing RPC's behaviour isn't additive, against the project rule in AGENTS.md. 3) The slice 1 estimate is optimistic.

#### Recommended combination

D's Stage 1 now, then A's slice 1 when a real creator commits, with fixes.

**Now (about 0.5–1 session, no migration, no infrastructure):**

- Add creatorFromSearch() beside the SLUG regex in src/lib/creator-credit.ts.
- Add one CaptureVia client effect that reads location.search inside useEffect. Mount it once.
- Make BookingWidget fall back to ?via= when storage holds nothing.
- Add a Share section on /admin/creators/[id] with Copy and wa.me links. Defer the QR library.
- Keep /creators/<slug> canonical.
- Offer registrar forwarding as the "own domain" answer.
- Add /@handle only if a build plus e2e test proves it, including soft navigation. Also add a second '/%40:slug' rewrite, because rewrite matching uses the raw pathname. Otherwise use /c/<slug>.

**When the first real creator commits and Google sign-in or the email service is on:** build A's slice 1:

- creator_members, mirroring admins;
- claim_my_creator_invites, copied from claim_my_bookings and called in both auth routes;
- requireCreator, modelled on requireAdmin;
- a read-only /creator dashboard fed by SECURITY DEFINER RPCs with search_path ''.

**Fixes to A's slice 1:**

- Earnings at month level, with the status computed in SQL.
- The menu's membership check filtered by user_id, or done through an RPC.
- A BEFORE UPDATE trigger on creators that rejects changes to the share and the slug unless is_admin().
- Run inspect-security.sql first.

**Later:** creator self-editing (A slice 2) only when creators ask for changes roughly weekly.

**Not now:** B, C, E, and D's /r/ links and embeds.

#### The case against doing anything

Most of what creators need already exists:

- Each creator already has a page on Truth (/creators/<slug>) that credits them for 30 days on the same site.
- Admins already edit pages and picks.
- Payment history already produces statements.

Nothing built now can be tried with a real creator:

- There are zero real creators.
- Creator sign-in is blocked until the email service or the Google OAuth client is set up.
- Share links and QR codes can't be handed out until the production domain exists.
- All of these are on the paused launch list, so anything built now is tested with fake creators and must be re-checked after launch anyway.

Each new SECURITY DEFINER RPC, storage policy and membership table adds attack surface to an app that hasn't had its hardening step. They would be written against a base schema that isn't in the repo.

"Own domain" already works today at no cost, through forwarding at the creator's registrar.

The lowest-risk move is to finish launch, recruit one creator by hand, and build only what they ask for.

#### What the designs missed

- Defence in depth on creators. Every design relies on never adding a member UPDATE policy, but UPDATE stays table-wide for authenticated and saveCreator depends on that. A BEFORE UPDATE trigger that rejects changes to revenue_share_percentage and slug unless is_admin() would stop one careless future policy from letting a creator raise their own share.
- Membership tables with an 'Admins manage … FOR ALL' policy return every row to an aal2 admin. Any browser-side 'am I a creator?' check (A, B) must filter by user_id or go through an RPC.
- Nothing records which page, link or code produced a credited booking; bookings.creator_snapshot is unused. So 'why didn't I get credit?' can't be answered from data. Adding a source parameter to create_booking means dropping and recreating it, so a second overload doesn't appear.
- Email-link sign-ins may drop next=/creator. The email template lives in the Supabase dashboard, and the code says it uses {{ .SiteURL }}. Check that it passes next on, or route creators after the claim step.
- due_on is the session date + 1, so any earnings line carrying due_on or the session date shows when a guest went. At Truth's volumes, default to month-level and compute the status in SQL.
- Safari ITP and in-app browsers weaken stored credit:
  - storage written by script is wiped after 7 days without interaction;
  - document.cookie is capped at 7 days, or 24 hours after a decorated link from a tracker domain;
  - Instagram and TikTok in-app browsers keep separate storage.
    The robust path is carrying creator= in the URL all the way to /book, which the book page already accepts.
- Supabase Storage remove() needs a SELECT policy on storage.objects, not just DELETE. The base storage policies aren't in the repo, so replacing creator photos could silently leave old files behind.
- The old Vite app still shares the Supabase project. New constraints (B's slug CHECK) or redefined RPCs (E) can break its remaining flows.
- Host-based routing (B, C) can't be tested on Vercel preview deployments. That conflicts with the owner's 'approve after a browser walkthrough' process. Also, Node-based test requests may not resolve *.localhost the way Chromium does.
- updateTag works only inside Server Actions. Anything refreshed from a route handler or a cron job (C's domain checks, D's /r/ route) needs revalidateTag.
- A's and B's tables allow one login to be linked to several creators. The dashboard then needs a creator switcher, or the tables need a one-creator constraint; every dashboard design assumes one creator.

---

### Review 3: Customer trust, UX and legal: who the customer pays, which login to use, where bookings live, brand confusion across domains, phishing and impersonation, POPIA (what creators may see), SA consumer protection (CPA and ECTA) and advertising disclosure (ARB), accessibility, and SEO side effects

**What this reviewer judged:** Customer trust, UX and legal: who the customer pays, which login to use, where bookings live, brand confusion across domains, phishing and impersonation, POPIA (what creators may see), SA consumer protection (CPA and ECTA) and advertising disclosure (ARB), accessibility, and SEO side effects.

**When to do it:** once there are real creators using it. Customers gain nothing from creator logins, studios or branded pages until real creators send real traffic. Meanwhile each piece adds legal surface Truth isn't covering yet: there is no privacy notice, no terms, no s43 supplier details and no confirmation emails.

The exceptions are cheap trust fixes that belong in launch hardening now, because they protect customers whatever option is chosen:

- the commission disclosure line (today's pages already need it);
- frame-ancestors 'self';
- settling the public URL scheme (/@handle) before any link is indexed by Google, put in a bio or printed. Changing URLs after creators have printed QR codes is costly.

| Option                   | Score (out of 10) |
| ------------------------ | ----------------- |
| A-lean-accounts          | 8                 |
| B-branded-subdomains     | 5                 |
| C-own-domain-storefront  | 3                 |
| D-truth-everywhere       | 8                 |
| E-curators-and-community | 7                 |

#### A-lean-accounts: 8/10

Every customer touchpoint stays on one Truth domain and one brand: the creator page, login, checkout and My bookings. So "who am I paying, which login, where are my bookings" has one answer, and truth.co.za/@name is short enough to teach. It has the smallest phishing surface of the five. Handles, names, follower counts and 'Featured in' stay admin-only, rightly treated as "things Truth shows as facts". Search ranking stays on the main domain. Moving the canonical address to /@slug before launch costs nothing, because no URL is indexed or printed yet. Visits are counted in aggregate only, no new cookies are added, and the dashboard shows no guest names, emails or phones. Weak spots for my lens:

- It adds no commission disclosure. Today's creator page and the 'Recommended by' chips have none either (verified: creators/[slug]/page.tsx and experiences/[id]/page.tsx L215-235).
- The earnings list shows each booking's exact session date and guest count.
- In slice 2, creators publish live on save under Truth's brand. Truth has no ECTA hosting safe harbour (s72 requires membership of a recognised industry body such as ISPA).
- Self-serve picks (up to 50) let a creator be shown as 'Recommended by' on experiences they have never done.

**Biggest concern:** No commission disclosure anywhere in the design, while the live creator page and 'Recommended by' chips already lack one. Under ARB Appendix K and the CPA rule on misleading omissions, the advertiser (Truth) shares responsibility, and this option scales that gap up as creators share /@ links.

**Factual problems found:** - The /@handle rewrite is unproven on Next 16.4. A flags this itself; the fallback is /c/.

- The 'safe shape' copies admin's toEarning fields (src/lib/admin/payouts.ts L78-98: sessionDate, guests). Those were designed for admins. For a creator with a small audience, date plus guest count can identify who booked. 'Due' dates also reveal the day, because due_on = session date + 1 (payouts.sql L87).
- The forwarding advice says 'check HTTPS' but never 'not masked/framed forwarding'. Truth sends no frame-ancestors or X-Frame-Options header today (next.config.ts has no headers(); no CSP in src). A framed forward would show Truth's checkout under the creator's domain in the address bar.

#### B-branded-subdomains: 5/10

Better than C, because the address bar always contains truth.co.za and sign-in and checkout stay on the main host. It also includes:

- a clear 'earns a commission, you pay the same price' line;
- a 'Booking through …' ribbon;
- colour presets checked for contrast in light and dark;
- a content security policy on creator hosts;
- reserved names and an admin 'Hide site' switch.

The problems:

- It turns creator pages into visually distinct mini-sites with creator-written link blocks to any https URL, under Truth's own domain, with no review by Truth (Publish is the creator's own button). That is an ideal phishing lure, for example a 'Pay your deposit here' button on zanele.truth.co.za.
- Truth carries legal liability for that content, with no ECTA safe harbour.
- The login seam muddies 'which login': signed-in customers look signed out on creator pages, and hearts are hidden.
- Ranking splits across thin subdomain pages, and redirects move /creators/ authority off the main domain.
- The cross-subdomain credit cookie must be covered in the privacy notice.
- Forcing always-light or always-dark overrides the visitor's own setting.

**Biggest concern:** Creator-written links, names and claims go live under *.truth.co.za without Truth's review. That makes Truth's own domain an impersonation and phishing surface, and can damage the reputation of truth.co.za itself (browser safe-browsing warnings, email blocklists), the domain that also sends sign-in and booking links.

**Factual problems found:** - Edit rights don't match. The creator experience says creators edit photos, bio, quote, location, tags and socials. But creator_update_profile also allows name, follower_count and featured_in, and that name is printed in the checkout ribbon.

- Profile edits skip draft and Publish. 'Nothing goes live until they press Publish' only covers creator_sites.
- The reserved list blocks exact names only. 'truth-support', 'refunds', 'billing', 'paystack' and 'verify' would all pass.
- The creator-page footer has no privacy or terms links, and those pages don't exist anywhere yet.
- Verified correct: Next's matchHas lowercases the host, strips the port and anchors ^value$. robots.ts already emits the Sitemap line from NEXT_PUBLIC_SITE_URL.

#### C-own-domain-storefront: 3/10

This is the safest possible version of a design that is still wrong for my lens. Money, accounts and personal data stay on Truth. Shops set no cookies. It adds 'Powered by Truth', approval before going live, a block on lookalike (xn--) domains, redirects for unknown hosts, and Truth as the canonical page for each experience.

The flow itself is the problem. It teaches customers that Truth bookings start on any domain and then jump to truth.co.za to pay. That is exactly the pattern South African fraud warnings tell people to distrust; SABRIC puts most card-fraud losses online.

The creator controls the DNS. An expired domain, a hijacked registrar login or a re-pointed record can put a Truth-looking page on an address Truth has promoted, and detaching a domain can leave a dangling record behind.

The default seo_mode 'creator' makes Truth's own creator page tell Google that a domain Truth doesn't control is the main one. ECTA s43 requires supplier details 'on the web site where such goods or services are offered', which here means the creator's domain.

Stage 2 keeps date-picking on the creator's domain, so the brand switch happens at payment, the most sensitive step. Customers who think they bought from 'Zanele's shop' then see Truth on their bank statement, which invites 'unrecognised merchant' chargebacks.

**Biggest concern:** Making purchases that start on creator-controlled domains feel normal weakens the one rule that protects customers: "only pay on truth.co.za". It also hands Truth's reputation and search ranking to domains that can lapse or be hijacked.

**Factual problems found:** - creator_update_my_profile includes name, followers and featured_in, although the UX says creators edit only photo, cover, bio, quote and socials. That name appears in the co-branded checkout strip ('Booking via …'), so it is an impersonation vector.

- The StorefrontFooter links to Truth's privacy, terms and help pages, which don't exist. src/app/(site) has no such routes, and the site footer has only the logo, tagline and theme toggle.
- The 'no cookie banner' framing misses the point. POPIA has no cookie-banner rule; the real duty is the s18 notice.
- The leaving flow doesn't set an order for removing the domain from Vercel and deleting the creator's DNS record, so it doesn't guard against dangling-DNS takeover. Vercel documents no takeover protection beyond verifying ownership at account level.

#### D-truth-everywhere: 8/10

In stage 1 a customer sees nothing new: a creator's link simply credits them, and every link, QR code and embed lands on truth.co.za. The trust message stays one sentence.

It is the only design that closes Truth's current framing gap: frame-ancestors 'self' on every page. I verified there are no framing headers today, so any site can frame Truth's checkout right now. It is also the only one that refuses credit planted from inside an iframe.

The embeds and snippets carry a disclosure line and rel="sponsored" (the label Google expects on paid links). Click counts hold no personal data. Earnings show the month instead of the session date, correctly reasoned from due_on = session date + 1.

Weak spots:

- Printed QR codes are an active South African scam vector ('quishing': fake stickers over real codes; EWN, May 2026).
- Embeds can be placed on any https site, which lets a dodgy site borrow Truth's legitimacy.
- A 'creator code' box at checkout reads as a coupon field. It invites coupon hunting and leaked 'discount' codes even though there is no discount.
- It adds no disclosure to Truth's own creator page or chips.

**Biggest concern:** The creator hub shows each booking's 'booking code', the same 8-character reference customers see on their booking page and inside their Paystack reference. That gives a creator a handle to identify a guest, or to pose as one when contacting support.

**Factual problems found:** - The booking code is bookingCode(id) = id.slice(0,8).toUpperCase() (src/lib/booking-filters.ts L78).

- Customers see it as 'Booking XXXXXXXX' (src/app/(site)/bookings/[id]/page.tsx L93).
- It is also part of the Paystack reference TRUTH-XXXXXXXX-… (src/lib/actions/payment.ts), and admins search bookings by it.
- Showing it contradicts D's own careful re-identification reasoning.
- Verified correct: next.config.ts has no headers() and there is no vercel.json; canonical tags drop the query string; MobileBooking keeps location.search; due_on = session date + 1.

#### E-curators-and-community: 7/10

Everything stays on one Truth domain and brand. What it gets right on my lens:

- Guides carry a plain 'earns a share, you pay the same price' note.
- Guide text is plain text with no links, and Truth reviews a creator's first guides.
- Name, web address and share stay with Truth.
- Earnings are totals by month and experience, the most privacy-protective shape of the five.
- Creators never see who follows them, and follower emails need opt-in (POPIA s69).
- Unique guide pages are the best search outcome of any option.

Concerns:

- It puts the most creator-written content under Truth's brand: tips and day-by-day itineraries. There is no ECTA safe harbour, and CPA s113 can make Truth jointly liable for what its agents claim.
- 'Trip' and 'Day 1 / Day 2' framing can read as a package that Truth organises.
- Meet-up dates ('Zanele is joining') are a promise customers will book on.
- Tips shown on experience pages carry no disclosure.

**Biggest concern:** Itinerary-style guides make claims customers rely on when they pay: timing, suitability, and later 'the creator is joining'. Truth answers for those claims, so each guide must say that every stop is a separate booking with its own host, times and cancellation terms.

**Factual problems found:** Guide data is cached with cacheTag('guides', 'creator:<slug>') and cacheLife('hours') (refreshed at most hourly). But an admin's experience save only refreshes 'experiences', 'experience:<id>' and 'creators' (src/lib/actions/admin-experiences.ts L13-15). So a changed price or a hidden stop can stay on guide pages for up to an hour. That is a mismatch with the displayed price (CPA s23). The fix is to tag guide reads with 'experiences' or 'creators' as well. Otherwise E is consistent with the code.

#### Recommended combination

One domain, trust first. Customers should only ever meet creators on truth.co.za.

**Step 0, before launch, whatever happens with creators:**

- Add one shared disclosure component to the creator page and every 'Recommended by' chip: "Creators earn a share from Truth when you book through them. You pay the same price."
- Add D's frame-ancestors 'self' to every page.
- Publish a privacy notice, booking terms and the ECTA s43 supplier details, linked from the footer.

**Step 1 (cheap):**

- A's slice 0: truth.co.za/@handle as each creator's single bio link.
- D's stage 1: ?via= share links with WhatsApp text.
- Don't print QR codes until the production domain is final, and always print the readable URL under the code.

**Step 2, when the first real creator signs:**

- A's slice 1 read-only dashboard, using D's and E's privacy shape: month, experience, booking value, earning and status only. No session date, guest count or booking code.
- A creator agreement first: ARB Appendix K disclosure in every post, consent-based WhatsApp sharing, and picks only for experiences they have genuinely done.
- Names, handles, follower counts and 'Featured in' stay admin-only.

**Step 3, later, if creators want the page to feel like theirs:**

- E's admin-written guides, with "each stop is booked separately" copy, a disclosure next to tips, and the cache-tag fix.
- Creator text is reviewed before it publishes.

**Own domains:** offer only registrar 301 forwarding over HTTPS to the /@handle page, never masked or framed forwarding. Do not build B's subdomains or C's storefronts.

#### The case against doing anything

From the customer's side nothing is broken. Today's /creators/<slug> page already credits creators on Truth's own trusted domain, through one checkout and one login. Meanwhile Truth lacks the legal scaffolding a creator programme leans on:

- no privacy notice;
- no terms or booking conditions;
- no ECTA s43 supplier details (the footer has only the logo and theme toggle);
- no commission disclosure;
- no creator agreement;
- no booking confirmation emails;
- no decision on whether Truth is the seller or the hosts' agent.

Every option adds third parties who either publish under Truth's brand or see data derived from guests' bookings. Building now multiplies obligations (moderation, enforcing disclosure, privacy notices, routing support) before a single real creator exists to benefit, and before a lawyer has confirmed the basics. The highest-trust move today is to finish the launch legal basics plus the one-line disclosure, and run creators by hand: admin-edited pages and monthly WhatsApp statements.

#### What the designs missed

- A disclosure gap exists today (verified). The creator page and the 'Recommended by' chips never say the creator earns from bookings. Under the ARB's Social Media Code (Appendix K) the advertiser, Truth, shares responsibility with the influencer. A and C add no disclosure, D adds it only to embeds, and B and E only to their own new surfaces. Build one shared disclosure component for every place a creator recommendation appears, plus a creator agreement requiring #ad or affiliate disclosure in their posts.
- The legal foundations don't exist yet. There is no privacy notice (POPIA s18), no terms or booking conditions, no ECTA s43 supplier details (name, registration, address, contact, refund and privacy policy) and no record of an Information Officer registration (POPIA s55). The (site) app has no /privacy or /terms routes, and the footer has only the logo, tagline and theme toggle. Every design assumes 'one place for the POPIA notice' that doesn't exist. For B and C, s43 details must also appear on the creator-branded site, because it is 'where the services are offered'. ECTA s42(2) removes the 7-day cooling-off for dated leisure bookings, but s43 still applies.
- Seller or agent is undecided. B and C write 'Truth is the seller of record' and 'Bookings handled by Truth', while the business model treats hosts as the suppliers. This decision drives CPA s17 (cancelling advance bookings), s23 (displayed price), s41 (misleading claims), s113 (Truth jointly liable for its agents, which may include creators), refund responsibility, and what the checkout and statement say. It needs a lawyer before any customer-facing creator copy is written.
- Domain forwarding can backfire. Every option offers 'forward your own domain', but registrars also offer masked (framed) forwarding and HTTP-only forwarding. Truth is frameable today (no frame-ancestors or X-Frame-Options anywhere; next.config.ts has no headers()). A masked forward would show Truth's checkout under a foreign address bar, a textbook phishing pattern, and would also break credit and sign-in inside the frame. A forward without a valid HTTPS certificate shows browser security warnings. So: specify 301 redirects over HTTPS only, and ship frame-ancestors 'self' before launch.
- No ECTA hosting safe harbour. The s72 liability limits apply only to members of a recognised industry body (ISPA). So Truth carries full liability for creator-published text, photos and links on its domain or subdomains (A slice 2, B, C, E). That favours admin-approved publishing, plain text and no outbound links (E's rules) everywhere.
- Endorsements must be genuine. Self-serve picks (A up to 50, B/C/E up to 100) let creators 'recommend' experiences they've never done, just to collect credit. That empties 'Recommended by' of meaning, and the ARB Code's testimonials principle expects genuine endorsements. Require a 'done it' confirmation or admin approval of new picks.
- Guests can be re-identified. A and B show the exact session date and guest count, and D shows the customer-facing booking code. For small audiences these let creators work out who booked. Show only month, experience, value and earning. The privacy notice should name 'the creator who referred you' as a recipient of anonymised booking details.
- Creator-editable names and claims. B and C let creators change their display name, follower count and 'Featured in' list. These appear as facts and inside the checkout ribbon, so they are both unverifiable social proof (CPA s41) and an impersonation vector. Keep them admin-only, as A and E do.
- 'Where are my bookings' breaks first for creator traffic. Booking confirmation emails are deferred, and creator audiences mostly use guest checkout, so the booking-page link is their only record. In B and C journeys guests will ask the creator rather than Truth. Connecting the email service and sending a 'booked with Truth' confirmation is a prerequisite for creator-driven traffic. Support routing also needs a script for creators.
- Bank statement mismatch. In the B and C journeys the customer meets a creator brand but sees Truth or Paystack on their statement. Use a recognisable Paystack statement name, and show both names on the payment step and in the confirmation, to avoid 'unrecognised merchant' chargebacks.
- QR codes and WhatsApp kits (B and D). Quishing is an active South African scam (EWN, May 2026). Print the readable truth.co.za URL under every code and never link a code to a payment page. Ready-made WhatsApp messages make bulk broadcasts easy; POPIA s69 needs consent for electronic direct marketing, so the creator agreement should forbid sending to contacts who haven't agreed.
- A creator-code box looks like a coupon field (D Module C, A's later step). An older Baymard study found coupon fields make shoppers feel they're overpaying and send them hunting for codes, and codes leak to coupon sites as fake 'discounts'. Label it 'Creator code (no discount)' or put it behind a link.
- Stale prices in E. Guide caches aren't refreshed by experience edits (admin-experiences.ts L13-15), so guide pages can show an old price or a hidden stop for up to an hour (CPA s23). Guides should also state that each stop is booked separately and that travel between stops isn't included, so they don't read as a package.
- Accessibility details. Embeds need an iframe title and a warning that links open in a new tab. E's share cards need image alt text. B's always-light or always-dark choice overrides the visitor's own setting. Separately from any option, the site header has no 'skip to content' link today.
