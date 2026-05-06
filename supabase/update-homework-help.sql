-- Adds Homework Help usage counting for existing 10thHoJayega Supabase projects.
-- Stores usage metadata only. It does not store homework prompts or AI answers.

begin;

create table if not exists public.homework_help_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id text references public.subjects(id) on delete set null,
  chapter_id text references public.chapters(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists homework_help_usage_user_created_at_idx
on public.homework_help_usage (user_id, created_at desc);

alter table public.homework_help_usage enable row level security;

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

grant select, insert on public.homework_help_usage to authenticated;

commit;
