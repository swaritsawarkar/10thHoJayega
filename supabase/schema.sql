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
  constraint profiles_language_subject_check check (language_subject in ('hindi', 'french'))
);

alter table public.profiles
add column if not exists language_subject text;

update public.profiles
set language_subject = 'hindi'
where language_subject is null
  or language_subject not in ('hindi', 'french');

alter table public.profiles
alter column language_subject set default 'hindi';

alter table public.profiles
alter column language_subject set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_language_subject_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
    add constraint profiles_language_subject_check
    check (language_subject in ('hindi', 'french'));
  end if;
end;
$$;

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
    when new.raw_user_meta_data ->> 'language_subject' in ('hindi', 'french')
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
alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.exercises enable row level security;
alter table public.progress enable row level security;
alter table public.notes enable row level security;
alter table public.focus_sessions enable row level security;

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
grant select, insert, update, delete on public.profiles, public.progress, public.notes, public.focus_sessions to authenticated;

commit;
