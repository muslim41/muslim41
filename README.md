# Security Operations Dashboard

Web app for security companies to manage venues, staff, shifts, and
incidents. Login → dashboard overview (understaffed venues flagged in
red) → full CRUD on Venues, Staff, Shifts, and Incidents.

Stack: Next.js (App Router) + TypeScript, Tailwind CSS, Supabase
(Postgres + Auth), deployed on Vercel.

## Setup

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com), then grab from
**Project Settings → API**:

- Project URL
- `publishable` key
- `secret` key (seed script only — never expose to the browser)

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in the three values from step 1.

### 3. Create the schema

Open the Supabase SQL editor and run `supabase/schema.sql`. It creates the
`venues`, `staff`, `shifts`, and `incidents` tables with RLS policies that
let any authenticated user read and write all four (single-tenant app,
no per-row ownership).

### 4. Seed fake data

```bash
npm install
npm run seed
```

This wipes and re-populates the four tables with 12 venues, ~150 staff,
a rolling 5-day shift window, a handful of incidents, and 3 venues
deliberately understaffed for today.

### 5. Create a login user

Seeding does not create an auth user (Supabase Auth is separate from the
app tables). In the Supabase dashboard, go to **Authentication → Users →
Add user** and create an email/password user to sign in with — or enable
public sign-ups and register through `/login` if you add a sign-up flow
later.

### 6. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you'll be redirected
to `/login`, then to `/dashboard` after signing in.

## Project structure

- `app/login` — email/password sign-in page
- `app/(protected)` — route group sharing the sidebar shell + auth guard
  - `dashboard` — operations overview page
  - `venues` — venue list, add/edit forms, activate/deactivate
  - `staff` — staff roster, add/edit forms, activate/deactivate, SIA
    licence expiry badges
  - `shifts` — shift list (venue/staff/time/status), add/edit forms
  - `incidents` — incident list, add/edit forms, severity + status
- `components` — `Sidebar`, `StatCard`, `AlertCard`, `VenueForm`,
  `StaffForm`, `ShiftForm`, `IncidentForm`
- `lib/supabase` — browser/server/proxy Supabase clients
- `lib/dashboard-data.ts` — dashboard query + staffing calculations
- `lib/venues.ts`, `lib/staff.ts`, `lib/shifts.ts`, `lib/incidents.ts` —
  record types + form parsing for each entity
- `supabase/schema.sql` — table definitions and RLS policies
- `scripts/seed.ts` — fake data generator (`npm run seed`)

## Deploying on Vercel

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as
environment variables in the Vercel project settings, then deploy as usual.
`SUPABASE_SECRET_KEY` is only needed locally to run the seed script.
