# Truth (web)

The 2026 rewrite of Truth, a marketplace for booking unforgettable experiences in South Africa.

Built with Next.js 16 (App Router, Cache Components, React Compiler), React 19, Tailwind CSS 4 and Supabase.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in your Supabase URL and publishable key
pnpm dev
```

## Scripts

| Script          | What it does                                                |
| --------------- | ----------------------------------------------------------- |
| `pnpm dev`      | Starts the dev server on http://localhost:3000              |
| `pnpm check`    | Runs the typecheck, lint, format check and unit tests       |
| `pnpm test:e2e` | Runs the Playwright end-to-end tests (desktop and mobile)   |
| `pnpm db:pull`  | Pulls the linked Supabase schema into `supabase/migrations` |
| `pnpm db:types` | Regenerates `src/lib/supabase/database.types.ts`            |

`pnpm db:pull` and `pnpm db:types` need a linked project. Run `pnpm exec supabase login`, then `pnpm exec supabase link --project-ref <ref>`.
