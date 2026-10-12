# SWD 24 Class Memories

A small, warm site where a graduating class keeps photos and contact info
for each other. Built with Next.js (App Router) + Supabase. Deploys to
Vercel.

## Setup

1. **Create a Supabase project** at supabase.com.
2. **Run the migration** in `supabase/migrations/001_initial.sql` via the
   SQL editor.
3. **Enable email auth**: Authentication → Providers → Email → enable.
   Turn off "Confirm email" if you want classmates to log in immediately
   (or leave it on and they'll get a confirmation link).
4. **Copy env vars** into `.env.local` (see `.env.local.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your deployed URL; `http://localhost:3000` in dev)
5. `npm install && npm run dev`

## Deploying

1. Push to GitHub.
2. Import the repo on Vercel.
3. Add the same three env vars in Vercel's project settings.
4. Set `window.location.origin` to your production URL.
5. Deploy.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 3.4
- Supabase (Postgres, Storage, Auth)
- Fonts: Fraunces, Instrument Sans, Caveat (via `next/font/google`)
