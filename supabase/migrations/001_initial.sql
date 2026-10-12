-- SWD 24 Class Memories — initial schema
-- Run this in the Supabase SQL editor.

-- 1. Table
create table if not exists public.classmates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  email text not null,
  phone text,
  bio text,
  message text,
  photo_url text,
  photo_url_2 text,
  photo_url_3 text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_classmates_created_at
  on public.classmates (created_at);

-- 2. RLS
alter table public.classmates enable row level security;

drop policy if exists "Auth read all" on public.classmates;
create policy "Auth read all"
  on public.classmates for select to authenticated using (true);

drop policy if exists "Users insert own" on public.classmates;
create policy "Users insert own"
  on public.classmates for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own" on public.classmates;
create policy "Users update own"
  on public.classmates for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users delete own" on public.classmates;
create policy "Users delete own"
  on public.classmates for delete to authenticated
  using (auth.uid() = user_id);

-- 3. Public preview view
create or replace view public.classmates_public_preview
  with (security_invoker = false)
as
select id, name, email, photo_url, created_at
from public.classmates
order by created_at asc
limit 100;

grant select on public.classmates_public_preview to anon, authenticated;

-- 4. Storage bucket
insert into storage.buckets (id, name, public)
values ('classmate-photos', 'classmate-photos', true)
on conflict do nothing;

-- 5. Storage policies
drop policy if exists "Public read photos" on storage.objects;
create policy "Public read photos"
  on storage.objects for select
  using (bucket_id = 'classmate-photos');

drop policy if exists "Users manage own photos" on storage.objects;
create policy "Users manage own photos"
  on storage.objects for all to authenticated
  using (
    bucket_id = 'classmate-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'classmate-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 6. updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists classmates_touch_updated_at on public.classmates;
create trigger classmates_touch_updated_at
  before update on public.classmates
  for each row execute function public.touch_updated_at();
