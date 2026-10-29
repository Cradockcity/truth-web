<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Truth project rules

- This is the 2026 rewrite of Truth, a South African experience-booking marketplace.
- `../project/` is the old Vite app. It is the **read-only fallback and reference**. Never edit, move or delete it, and never copy code from it.
- Both apps share one Supabase project. Database changes must be additive or backward-compatible until cut-over.
- Business rules for pricing, booking status and payment verification run on the server only (Server Actions, Route Handlers, Postgres RPCs). Never trust amounts or statuses sent by the client.
- Use `src/lib/supabase/server.ts` on the server and `client.ts` in the browser. Protect data with `auth.getClaims()`, never `getSession()`, on the server.
- Before committing, run `pnpm check`: typecheck, lint, format and unit tests.
