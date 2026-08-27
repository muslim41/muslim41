-- Security Operations Dashboard — core schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before seeding.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- venues
-- ---------------------------------------------------------------------------
create table if not exists public.venues (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  client_name         text not null default 'ABC Security Ltd',
  address             text not null,
  city                text not null,
  venue_type          text not null default 'commercial',
  required_headcount  integer not null default 1,
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- staff
-- ---------------------------------------------------------------------------
create table if not exists public.staff (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  role                text not null default 'guard' check (role in ('guard', 'supervisor', 'controller')),
  email               text,
  phone               text,
  sia_licence_number  text,
  sia_licence_type    text not null default 'Door Supervisor',
  sia_licence_expiry  date,
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- shifts
-- ---------------------------------------------------------------------------
create table if not exists public.shifts (
  id            uuid primary key default gen_random_uuid(),
  venue_id      uuid not null references public.venues(id) on delete cascade,
  staff_id      uuid not null references public.staff(id) on delete cascade,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  status        text not null default 'scheduled' check (status in ('scheduled', 'confirmed', 'absent', 'completed', 'cancelled')),
  created_at    timestamptz not null default now()
);

create index if not exists shifts_venue_idx on public.shifts (venue_id);
create index if not exists shifts_staff_idx on public.shifts (staff_id);
create index if not exists shifts_start_time_idx on public.shifts (start_time);

-- ---------------------------------------------------------------------------
-- incidents
-- ---------------------------------------------------------------------------
create table if not exists public.incidents (
  id            uuid primary key default gen_random_uuid(),
  venue_id      uuid not null references public.venues(id) on delete cascade,
  reported_by   uuid references public.staff(id) on delete set null,
  title         text not null,
  description   text not null default '',
  severity      text not null default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  status        text not null default 'open' check (status in ('open', 'investigating', 'closed')),
  occurred_at   timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists incidents_venue_idx on public.incidents (venue_id);
create index if not exists incidents_status_idx on public.incidents (status);

-- ---------------------------------------------------------------------------
-- Row Level Security — any authenticated operator can read and write
-- everything. There's no per-row ownership model (single-tenant app for
-- ABC Security Ltd), so policies only distinguish authenticated vs anon.
-- ---------------------------------------------------------------------------
alter table public.venues    enable row level security;
alter table public.staff     enable row level security;
alter table public.shifts    enable row level security;
alter table public.incidents enable row level security;

create policy "authenticated can read venues" on public.venues
  for select to authenticated using (true);

create policy "authenticated can insert venues" on public.venues
  for insert to authenticated with check (true);

create policy "authenticated can update venues" on public.venues
  for update to authenticated using (true) with check (true);

create policy "authenticated can read staff" on public.staff
  for select to authenticated using (true);

create policy "authenticated can insert staff" on public.staff
  for insert to authenticated with check (true);

create policy "authenticated can update staff" on public.staff
  for update to authenticated using (true) with check (true);

create policy "authenticated can read shifts" on public.shifts
  for select to authenticated using (true);

create policy "authenticated can insert shifts" on public.shifts
  for insert to authenticated with check (true);

create policy "authenticated can update shifts" on public.shifts
  for update to authenticated using (true) with check (true);

create policy "authenticated can read incidents" on public.incidents
  for select to authenticated using (true);

create policy "authenticated can insert incidents" on public.incidents
  for insert to authenticated with check (true);

create policy "authenticated can update incidents" on public.incidents
  for update to authenticated using (true) with check (true);
