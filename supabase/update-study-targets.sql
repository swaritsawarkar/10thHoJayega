begin;
-- Account-owned daily planner. Existing progress and notes are untouched.
create table if not exists public.study_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  chapter_id text,
  due_date date not null,
  reminder_at timestamptz,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists study_targets_user_date_idx on public.study_targets(user_id, due_date);
alter table public.study_targets enable row level security;
revoke all on public.study_targets from anon;
grant select, insert, update, delete on public.study_targets to authenticated;
drop policy if exists study_targets_select_own on public.study_targets;
create policy study_targets_select_own on public.study_targets for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists study_targets_insert_own on public.study_targets;
create policy study_targets_insert_own on public.study_targets for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists study_targets_update_own on public.study_targets;
create policy study_targets_update_own on public.study_targets for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists study_targets_delete_own on public.study_targets;
create policy study_targets_delete_own on public.study_targets for delete to authenticated using ((select auth.uid()) = user_id);

commit;
