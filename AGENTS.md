<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Truth project rules

- This is the 2026 rewrite of Truth, a South African experience-booking marketplace.
- `../project/` is the old Vite app. It is the **read-only fallback and reference**. Never edit, move or delete it, and never copy code from it.
- Status, open items and next steps: **`docs/PROGRESS.md`**. Update it at the end of every step.
- Both apps share one Supabase project, which is not live and has only test data. Database changes should stay additive. The owner has accepted that the old app's checkout (and, after step 4c, its experience pages) breaks.
- Business rules for pricing, booking status and payment verification run on the server only (Server Actions, Route Handlers, Postgres RPCs). Never trust amounts or statuses sent by the client.
- Use `src/lib/supabase/server.ts` on the server and `client.ts` in the browser. Protect data with `auth.getClaims()`, never `getSession()`, on the server.
- Before committing, run `pnpm check`: typecheck, lint, format and unit tests.

## Stack

- Next.js 16.4 (App Router, `cacheComponents`, `partialPrefetching`, React Compiler) and React 19.3.
- TypeScript strict with `noUncheckedIndexedAccess`.
- Tailwind 4 via `@tailwindcss/postcss`. The Turbopack Tailwind loader did not hot-reload CSS, so don't switch back.
- Supabase (`@supabase/ssr`), Zod 4 and lucide-react.
- Vitest (unit, `src/**/*.test.ts(x)`) and Playwright (e2e, `e2e/`, desktop and mobile projects, runs a production build on port 3100).
- pnpm.

## Commands

| Command         | What it does                                                     |
| --------------- | ---------------------------------------------------------------- |
| `pnpm dev`      | Dev server on :3000 (or preview tool `truth-web`)                |
| `pnpm check`    | `next typegen` + tsc, ESLint, Prettier check, Vitest             |
| `pnpm test:e2e` | Playwright against a production build                            |
| `pnpm build`    | Production build (also catches Cache Components mistakes)        |
| `pnpm db:types` | Regenerate `src/lib/supabase/database.types.ts` from the live DB |

- After moving or adding routes, if the typecheck complains about `.next/dev/types`, stop the dev server and delete `.next/dev`.
- On Windows the running dev server locks folders. Stop it before `git mv` of app folders.

## Layout

- `src/app/(site)/` holds the public site. Its layout adds the footer. Routes:
  - `/`, `/experiences`, `/experiences/[id]`, `/experiences/[id]/book`
  - `/creators/[slug]`, `/saved`, `/signin`, `/account/bookings`, `/bookings/[id]`
  - `/styleguide` (dev only)
- `src/app/admin/signin` is the admin sign-in (password, then TOTP code).
- `src/app/admin/(console)/` is the admin console. Its layout runs `requireAdmin()` inside Suspense, and every admin data function calls `requireAdmin()` again.
- `src/app/auth/{confirm,callback}` finish customer sign-in (email link, Google). `src/app/payments/paystack/{callback,webhook}` handle Paystack.
- `src/lib/`:
  - `data/`: public, cached reads (`"use cache"` + `cacheTag`). They select only public-safe columns.
  - `admin/`: admin reads (guarded).
  - `actions/`: server actions (Zod-validated).
  - `supabase/`: clients, plus `admin.ts`, a service-role client used only for payments and, after `requireAdmin()`, admin reads of private columns.

## Conventions

- **Pages and caching:** pages that read `params`, `searchParams`, cookies or `new Date()` put that work inside `<Suspense>` (Cache Components rule). Use `params.then(...)` inside Suspense, or `await connection()` for live data.
- **Cache refresh:** admin writes call `updateTag('experiences' | 'experience:<id>' | 'creators')` so the cached public pages refresh.
- **Login state** is read in the browser (`useUser`) so public pages stay static. Don't read cookies in shared layouts.
- **Colours:** use role tokens only: `canvas surface raised control line ink accent accent-soft saved danger success`. Use `night` and `bone` only for UI over photos (`.scheme-dark`, the `glass` utility). The `light:` variant targets light mode (OS or chosen).
- **Copy:** plain language, sentence case, specific error messages, en-ZA rands via `formatRand` (`R180`, `R178,50`).

## Database workflow (important)

- The Supabase CLI can't run SQL against this project (`cli_login_postgres` permission error), but `pnpm db:types` works.
- So migrations are written to `supabase/migrations/<timestamp>_<name>.sql`, each ending with a one-line check query. **The owner pastes them into the dashboard SQL editor** (https://supabase.com/dashboard/project/ygzrgfbsswiwugmqxufq/sql/new). Then run `pnpm db:types`.
- Read-only checks with the public key work via `fetch` to `/rest/v1`. Admin-level reads can use `SUPABASE_SECRET_KEY` from `.env.local`; never print key values.
- Key database pieces:
  - `is_admin()`: a row in `public.admins` plus `aal2`.
  - `get_availability`, `create_booking`, `get_booking` (token or owner).
  - `attach_payment_reference`, `confirm_booking_payment` (service role only).
  - `claim_my_bookings`, `admin_replace_itinerary`, `admin_replace_schedule`, `admin_replace_creator_experiences`.
  - Private columns: `hosts.email` and `hosts/creators.revenue_share_percentage` have no `SELECT` for `anon`/`authenticated` (column grants only). Never `select('*')` on `hosts` or `creators` with the user clients; admins read them in `src/lib/admin/people.ts` with the service role.
  - Tables `experience_schedules`, `experience_blackouts`, `saved_experiences`, `admins`.

## Secrets (`.env.local`, git-ignored)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, optional `NEXT_PUBLIC_SITE_URL`.
- `SUPABASE_SECRET_KEY` and `PAYSTACK_SECRET_KEY` (test mode, `sk_test_`). These are server only, read lazily via `src/lib/env.server.ts`.

## Git

- Commit as `ryan <215349280+Cradockcity@users.noreply.github.com>`, passed as `GIT_AUTHOR_*` / `GIT_COMMITTER_*` env vars. Don't change git config.
- End messages with `Co-Authored-By: Claude <noreply@anthropic.com>`. Before committing, scan staged changes for keys (`sk_test_`, `sb_secret_`, `eyJ…`).
