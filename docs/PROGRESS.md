# Truth rewrite: progress and handoff

Last updated: 2026-10-29 (4c done). The approved plan and the original audit are in `C:\Users\ryanc\.claude\plans\i-d-like-you-to-lexical-treasure.md`.

**Plan:** 0 foundations → 1 design system → 2 public browsing → 3 booking and payments → 4 admin (4a, 4b, 4c) → 5 hardening and launch.

## Status

| Step                                                             | State                                           | Commit               |
| ---------------------------------------------------------------- | ----------------------------------------------- | -------------------- |
| 0 Foundations (Next 16 scaffold, CI, Supabase clients, types)    | Done                                            | `cddbead`, `bc02497` |
| 1 Design system ("Night cinema", light/dark plus toggle)         | Done                                            | `e063572`            |
| 2 Public browsing (search/filters, detail, creators, saved, SEO) | Done                                            | `f3ba35e`            |
| 3 Booking, Paystack (test), customer sign-in, My bookings        | Done, except Google sign-in (needs owner setup) | `d1d0e09`, `c1a9daf` |
| 4a Admin: MFA sign-in, dashboard, bookings, cancel/refund        | Done, tested by owner                           | `50b027a`            |
| 4b Admin: experience editor                                      | Done, tested by owner                           | `c8a63a2`            |
| 4c Admin: hosts, creators, privacy migration                     | Done, tested                                    | (this commit)        |
| **5 Hardening and launch**                                       | **Next (see open items below)**                 | —                    |

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
- **Stack and payments:** Next.js 16, Supabase kept and hardened. Paystack, at ~2.9% + R1 for cards and 2% for EFT, plus a 5% service fee charged to guests.
- **Booking:** guest checkout, with optional sign-in by email link and Google. Availability is a weekly schedule plus blocked dates. Holds last 20 minutes.
- **Refunds:** chosen per cancellation (full by default, minus service fee, or none) and sent through the Paystack API. Paystack doesn't return its own fee.
- **Admin:** email + password + existing TOTP; access needs aal2 plus a row in `public.admins`.

## Test data in the shared Supabase project

- Paid test booking `c07a5651…` (2 Nov): later cancelled, with the R178,50 refund pending in Paystack.
- An expired hold `c44851df…` (31 Oct).
- Short-lived "Playwright Test" holds created by e2e runs.
