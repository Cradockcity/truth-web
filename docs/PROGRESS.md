# Truth rewrite: progress and handoff

Last updated: 2026-10-30. The approved plan and the original audit are in `C:\Users\ryanc\.claude\plans\i-d-like-you-to-lexical-treasure.md`.

**Plan:** 0 foundations → 1 design system → 2 public browsing → 3 booking and payments → 4 admin (4a, 4b, 4c) → 5 hardening and launch.

## Status

| Step                                                             | State                                           | Commit               |
| ---------------------------------------------------------------- | ----------------------------------------------- | -------------------- |
| 0 Foundations (Next 16 scaffold, CI, Supabase clients, types)    | Done                                            | `cddbead`, `bc02497` |
| 1 Design system ("Night cinema", light/dark plus toggle)         | Done                                            | `e063572`            |
| 2 Public browsing (search/filters, detail, creators, saved, SEO) | Done                                            | `f3ba35e`            |
| 3 Booking, Paystack (test), customer sign-in, My bookings        | Done, except Google sign-in (needs owner setup) | `d1d0e09`, `c1a9daf` |
| 4a Admin: MFA sign-in, dashboard, bookings, cancel/refund        | Done, tested by owner                           | `50b027a`            |
| **4b Admin: experience editor**                                  | **In progress, uncommitted (see below)**        | —                    |
| 4c Admin: hosts, creators, privacy migration                     | Not started                                     | —                    |
| 5 Hardening and launch                                           | Not started                                     | —                    |

## 4b: where it stands (resume here)

The code is written but **not yet type-checked, tested or committed**. Run `git status` to see it:

- **Migration:** `supabase/migrations/20261030100000_admin_experience_editing.sql`, with `admin_replace_itinerary` and `admin_replace_schedule`. **The owner has NOT run it yet.**
- **Data and actions:** `src/lib/admin/experiences.ts`, `src/lib/actions/admin-experiences.ts`, `src/lib/schedule.ts` (+ test).
- **UI:** `src/components/admin/{experience-details-form, photo-manager, itinerary-editor, schedule-editor, blackout-editor, save-status}.tsx`, and `Textarea` added to `src/components/ui/input.tsx`.
- **Pages:** `src/app/admin/(console)/experiences/{page, new/page, [id]/page}.tsx`.

**Next steps:**

1. Ask the owner to run the 4b migration in the SQL editor. Expected check: `anon_can_edit = false`.
2. `pnpm db:types`, then `pnpm check`. Fix type errors; the RPC names only exist after the migration.
3. Test in the browser with the owner signed in as admin (password + TOTP):
   - edit details and toggle live/hidden;
   - upload, reorder and remove photos (storage bucket `images`, admin-only uploads);
   - itinerary; weekly schedule; block a date;
   - check the public page updates.
4. Add e2e coverage where possible (admin pages need the owner's login, so test the lockout and pure functions). Then commit and push when the owner asks.

**4b design notes:**

- Each section saves separately.
- Itinerary and schedule saves are replace-all in one DB transaction (RPCs check `is_admin()`).
- New experiences start hidden. They can't go live without a photo, and removing all photos hides them.
- Photo uploads go straight from the browser to Supabase Storage. JPG/PNG/WebP up to 2 MB, at most 12 photos; the first is the cover. Removed storage files are deleted on save.

## 4c: plan

- Hosts CRUD and creators CRUD, including choosing which experiences a creator recommends (`creator_experience_referrals`).
- **Privacy migration (owner approved):** revoke column `SELECT` on `hosts.email` and `hosts/creators.revenue_share_percentage` from `anon` and `authenticated` (grant other columns explicitly). The admin then reads those columns with the service-role client after `requireAdmin()`. Public `src/lib/data/*` already avoids those columns. The old app's experience pages will break; this is accepted.

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
- **Content:** several experience photos don't match their listing (the "kayaking" one shows a motorcycle). Replace them via the new admin photo manager.
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
