-- Litmus website: who signed up, and what they downloaded.
-- Run once in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).
--
-- Both tables have row-level security on and NO policies, so the browser (anon key) can neither
-- read nor write them. Rows are written by the trigger below and by /api/download, which uses the
-- service-role key on the server. Read them in the dashboard or with the views at the bottom.

create table if not exists public.signups (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  provider    text not null,            -- google | azure | email
  created_at  timestamptz not null default now()
);

create table if not exists public.downloads (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  email       text not null,
  file        text not null,            -- e.g. beta/Litmus-1.0.0-mac-arm64.dmg
  created_at  timestamptz not null default now()
);

create index if not exists downloads_user_idx on public.downloads (user_id);
create index if not exists downloads_created_idx on public.downloads (created_at);

alter table public.signups   enable row level security;
alter table public.downloads enable row level security;

-- Every new account (Google, Microsoft or email link) is recorded the moment Supabase creates it.
-- Done in the database, not the browser, so a signup cannot be skipped or forged from the page.
create or replace function public.record_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.signups (user_id, email, provider)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_app_meta_data ->> 'provider', 'email'))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.record_signup();

-- Counts for the team. Views run with the caller's rights (security_invoker), so they are as
-- private as the tables: visible in the dashboard, not to the browser.
create or replace view public.signup_stats with (security_invoker = true) as
select
  (select count(*) from public.signups)                                     as total_signups,
  (select count(*) from public.signups where created_at > now() - interval '7 days') as signups_7d,
  (select count(distinct user_id) from public.downloads)                    as users_who_downloaded,
  (select count(*) from public.downloads)                                   as total_downloads;

create or replace view public.downloads_by_file with (security_invoker = true) as
select file, count(*) as downloads, count(distinct user_id) as users, max(created_at) as last_download
from public.downloads
group by file
order by downloads desc;
