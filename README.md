# Follo

> A minimal job application tracker built with Next.js, TypeScript and Supabase.

## Tech stack

- Next.js 16 (App Router) with React 19
- TypeScript
- Supabase (auth + Postgres) via `@supabase/ssr` and `@supabase/supabase-js`
- Vercel Analytics
- Tailwind/PostCSS for styling
- pnpm for package management

## Key concepts & functions

- Authentication & client
  - `lib/supabase/client.ts` — creates a browser Supabase client via `createBrowserClient` (uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - `lib/supabase/server.ts` — creates a server-side Supabase client using `createServerClient` and Next.js cookies (used for SSR/edge handlers).

- Applications data model & helpers
  - `lib/applications.ts` — Types and CRUD helpers for the `applications` table.
    - `getApplications()` — returns all applications ordered by `applied_at`.
    - `getApplication(id)` — fetch single application.
    - `createApplication(values)` — inserts a new application (requires authenticated user).
    - `updateApplication(id, values)` — updates an application.
    - `deleteApplication(id)` — deletes an application.

- Activity logs
  - `lib/activity.ts` — Types and helpers for `activity_logs` related to applications.
    - `getActivityLogs(applicationId)`
    - `addActivityLog(entry)`
    - `deleteActivityLog(id)`

- UI components
  - `app/components/Navbar.tsx` — top navigation and sign-out (uses browser Supabase client).
  - `app/components/ApplicationForm.tsx` — form used to create applications (modal).
  - `app/components/StatusBadge.tsx`, `Toast.tsx`, `ActivityLog.tsx` — small UI primitives used across pages.

- Pages (App Router)
  - `app/layout.tsx` — global layout, fonts, `Navbar` and Vercel Analytics.
  - `app/page.tsx` — redirects to `/applications`.
  - `app/applications/page.tsx` — main applications list (client component, uses `getApplications`).
  - `app/applications/[id]/page.tsx` — per-application detail (view activity, edit, delete).

## Project structure (high level)

- `app/` — Next.js App Router pages and components
- `lib/` — business logic and Supabase helpers
- `public/` — static assets

## Environment variables

Create a `.env.local` (or configure in your deployment) with:

```
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
```

Notes:

- This app uses the public keys (browser) in many places; ensure RLS policies in Supabase are configured appropriately for your tables.

## Install & run (local)

Prereqs: Node.js 18+, pnpm

```bash
pnpm install
pnpm dev
```

Available scripts (from `package.json`):

- `pnpm dev` — run Next.js dev server
- `pnpm build` — build for production
- `pnpm start` — start production server
- `pnpm lint` — run ESLint

## Deployment

This project is ready for deployment to Vercel (recommended). Ensure the environment variables above are set in your Vercel project settings. You can also deploy to other hosts that support Next.js.

## Notes for contributors

- Data access is centralized in `lib/` — add new helpers there when adding DB-backed features.
- Prefer server vs client Supabase clients depending on auth/cookie needs:
  - Use `lib/supabase/client.ts` in client components.
  - Use `lib/supabase/server.ts` inside server components or route handlers where you need cookie-based auth.
- Keep UI components small and focused; the app follows a simple composition-based structure inside `app/components`.

## Useful files

- `package.json` — project metadata and scripts
- `next.config.ts` — Next.js runtime configuration
- `postcss.config.mjs` — PostCSS/Tailwind setup

---

If you'd like, I can also:

- add a CONTRIBUTING guide and code style rules,
- add example `.env.local.example`, or
- generate a simple SQL migration for the `applications` and `activity_logs` tables.

Created by an automated repository review.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
