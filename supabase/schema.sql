-- PedaStudio Phase 2 — run in Supabase SQL Editor
-- Dashboard → SQL → New query → paste → Run

-- Teacher profile (all registration fields as JSON + indexed phone)
create table if not exists public.teacher_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  phone text not null,
  profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists teacher_profiles_phone_idx on public.teacher_profiles (phone);

-- Lesson plans per user / lesson / day
create table if not exists public.lesson_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  day int not null check (day >= 1),
  status text not null default 'not_started'
    check (status in ('not_started', 'planned', 'completed')),
  plan_data jsonb,
  phases jsonb,
  rich_plan jsonb,
  materials jsonb,
  feedback text,
  saved_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id, day)
);

create index if not exists lesson_plans_user_idx on public.lesson_plans (user_id);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists teacher_profiles_updated_at on public.teacher_profiles;
create trigger teacher_profiles_updated_at
  before update on public.teacher_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists lesson_plans_updated_at on public.lesson_plans;
create trigger lesson_plans_updated_at
  before update on public.lesson_plans
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.teacher_profiles enable row level security;
alter table public.lesson_plans enable row level security;

drop policy if exists "teacher_profiles_own" on public.teacher_profiles;
create policy "teacher_profiles_own" on public.teacher_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "lesson_plans_own" on public.lesson_plans;
create policy "lesson_plans_own" on public.lesson_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
