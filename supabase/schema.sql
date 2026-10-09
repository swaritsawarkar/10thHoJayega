-- 10thHoJayega V1 schema
-- Run this in the Supabase SQL editor before supabase/seed.sql.

begin;

create extension if not exists pgcrypto;
create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  language_subject text not null default 'hindi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_language_subject_check check (language_subject in ('hindi', 'hindi-course-b', 'french'))
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles
add column if not exists language_subject text;

update public.profiles
set language_subject = 'hindi'
where language_subject is null
  or language_subject not in ('hindi', 'hindi-course-b', 'french');

alter table public.profiles
alter column language_subject set default 'hindi';

alter table public.profiles
alter column language_subject set not null;

alter table public.profiles
drop constraint if exists profiles_language_subject_check;

alter table public.profiles
add constraint profiles_language_subject_check
check (language_subject in ('hindi', 'hindi-course-b', 'french'));

create table if not exists public.subjects (
  id text primary key,
  name text not null,
  description text,
  sort_order int not null default 0
);

create table if not exists public.chapters (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  title text not null,
  chapter_number int,
  official_textbook_url text,
  sort_order int not null default 0
);

create table if not exists public.exercises (
  id text primary key,
  chapter_id text not null references public.chapters(id) on delete cascade,
  title text not null,
  sort_order int not null default 0
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('chapter', 'exercise')),
  item_id text not null,
  status int not null default 0 check (status >= 0 and status <= 4),
  updated_at timestamptz not null default now(),
  unique(user_id, item_type, item_id)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id text not null references public.chapters(id) on delete cascade,
  content text default '',
  updated_at timestamptz not null default now(),
  unique(user_id, chapter_id)
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null,
  duration_minutes int not null,
  break_minutes int not null,
  goal text,
  reflection text,
  completed boolean default false,
  created_at timestamptz not null default now()
);

create index if not exists focus_sessions_user_created_at_idx
on public.focus_sessions (user_id, created_at desc);

create table if not exists public.homework_help_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id text references public.subjects(id) on delete set null,
  chapter_id text references public.chapters(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists homework_help_usage_user_created_at_idx
on public.homework_help_usage (user_id, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

drop trigger if exists progress_set_updated_at on public.progress;
create trigger progress_set_updated_at
before update on public.progress
for each row execute function private.set_updated_at();

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  preferred_name text;
  preferred_language text;
begin
  preferred_name := nullif(new.raw_user_meta_data ->> 'display_name', '');
  preferred_language := case
    when new.raw_user_meta_data ->> 'language_subject' in ('hindi', 'hindi-course-b', 'french')
      then new.raw_user_meta_data ->> 'language_subject'
    else 'hindi'
  end;

  insert into public.profiles (id, display_name, language_subject)
  values (
    new.id,
    coalesce(preferred_name, nullif(split_part(new.email, '@', 1), '')),
    preferred_language
  )
  on conflict (id) do update set
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    language_subject = coalesce(public.profiles.language_subject, excluded.language_subject);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.exercises enable row level security;
alter table public.progress enable row level security;
alter table public.notes enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.homework_help_usage enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
on public.admin_users for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
on public.progress for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
on public.progress for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
on public.progress for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own"
on public.progress for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "notes_select_own" on public.notes;
create policy "notes_select_own"
on public.notes for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "notes_insert_own" on public.notes;
create policy "notes_insert_own"
on public.notes for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "notes_update_own" on public.notes;
create policy "notes_update_own"
on public.notes for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notes_delete_own" on public.notes;
create policy "notes_delete_own"
on public.notes for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "focus_sessions_select_own" on public.focus_sessions;
create policy "focus_sessions_select_own"
on public.focus_sessions for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "focus_sessions_insert_own" on public.focus_sessions;
create policy "focus_sessions_insert_own"
on public.focus_sessions for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "focus_sessions_update_own" on public.focus_sessions;
create policy "focus_sessions_update_own"
on public.focus_sessions for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "focus_sessions_delete_own" on public.focus_sessions;
create policy "focus_sessions_delete_own"
on public.focus_sessions for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "homework_help_usage_select_own" on public.homework_help_usage;
create policy "homework_help_usage_select_own"
on public.homework_help_usage for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "homework_help_usage_insert_own" on public.homework_help_usage;
create policy "homework_help_usage_insert_own"
on public.homework_help_usage for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "subjects_read_authenticated" on public.subjects;
create policy "subjects_read_authenticated"
on public.subjects for select
to authenticated
using (true);

drop policy if exists "chapters_read_authenticated" on public.chapters;
create policy "chapters_read_authenticated"
on public.chapters for select
to authenticated
using (true);

drop policy if exists "exercises_read_authenticated" on public.exercises;
create policy "exercises_read_authenticated"
on public.exercises for select
to authenticated
using (true);

grant usage on schema public to authenticated;
grant select on public.subjects, public.chapters, public.exercises to authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.profiles, public.progress, public.notes, public.focus_sessions to authenticated;
grant select, insert on public.homework_help_usage to authenticated;

create or replace function public.get_admin_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  dashboard jsonb;
begin
  if auth.uid() is null
    or not exists (
      select 1
      from public.admin_users
      where user_id = auth.uid()
    ) then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  with activity as (
    select user_id, updated_at as occurred_at from public.progress
    union all
    select user_id, created_at as occurred_at from public.focus_sessions
    union all
    select user_id, created_at as occurred_at from public.homework_help_usage
  ),
  activity_by_user as (
    select user_id, max(occurred_at) as last_activity_at
    from activity
    group by user_id
  ),
  progress_by_user as (
    select user_id, count(*)::int as progress_updates
    from public.progress
    group by user_id
  ),
  students as (
    select
      profile.id,
      auth_user.email,
      profile.display_name,
      profile.language_subject,
      profile.created_at,
      activity_by_user.last_activity_at,
      coalesce(progress_by_user.progress_updates, 0) as progress_updates
    from public.profiles as profile
    join auth.users as auth_user on auth_user.id = profile.id
    left join activity_by_user on activity_by_user.user_id = profile.id
    left join progress_by_user on progress_by_user.user_id = profile.id
    order by profile.created_at desc
    limit 100
  )
  select jsonb_build_object(
    'summary', jsonb_build_object(
      'totalUsers', (select count(*)::int from public.profiles),
      'newUsersLast7Days', (
        select count(*)::int
        from public.profiles
        where created_at >= now() - interval '7 days'
      ),
      'activeUsersLast7Days', (
        select count(distinct user_id)::int
        from activity
        where occurred_at >= now() - interval '7 days'
      ),
      'progressUpdatesLast7Days', (
        select count(*)::int
        from public.progress
        where updated_at >= now() - interval '7 days'
      ),
      'focusMinutesLast7Days', (
        select coalesce(sum(duration_minutes), 0)::int
        from public.focus_sessions
        where completed is true
          and created_at >= now() - interval '7 days'
      ),
      'homeworkRequestsLast7Days', (
        select count(*)::int
        from public.homework_help_usage
        where created_at >= now() - interval '7 days'
      )
    ),
    'students', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', id,
            'email', email,
            'displayName', display_name,
            'languageSubject', language_subject,
            'createdAt', created_at,
            'lastActivityAt', last_activity_at,
            'progressUpdates', progress_updates
          )
          order by created_at desc
        )
        from students
      ),
      '[]'::jsonb
    )
  ) into dashboard;

  return dashboard;
end;
$$;

revoke all on function public.get_admin_dashboard() from public, anon;
grant execute on function public.get_admin_dashboard() to authenticated;

commit;
