-- Extends the owner dashboard with the latest activity feed.

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
    select user_id, updated_at as occurred_at, id::text as id, 'Progress update'::text as kind, ('Status set to ' || status)::text as detail from public.progress
    union all
    select user_id, created_at as occurred_at, id::text as id, 'Focus session'::text as kind, (duration_minutes || ' minutes' || case when completed is true then ' completed' else ' saved' end)::text as detail from public.focus_sessions
    union all
    select user_id, created_at as occurred_at, id::text as id, 'Homework help request'::text as kind, coalesce(subject_id, 'General question')::text as detail from public.homework_help_usage
  ),
  activity_by_user as (
    select user_id, max(occurred_at) as last_activity_at from activity group by user_id
  ),
  progress_by_user as (
    select user_id, count(*)::int as progress_updates from public.progress group by user_id
  ),
  students as (
    select profile.id, auth_user.email, profile.display_name, profile.language_subject, profile.created_at, activity_by_user.last_activity_at, coalesce(progress_by_user.progress_updates, 0) as progress_updates
    from public.profiles as profile
    join auth.users as auth_user on auth_user.id = profile.id
    left join activity_by_user on activity_by_user.user_id = profile.id
    left join progress_by_user on progress_by_user.user_id = profile.id
    order by profile.created_at desc
    limit 1000
  ),
  recent_activity as (
    select activity.id, coalesce(nullif(profile.display_name, ''), auth_user.email, 'Unnamed student') as student, auth_user.email, activity.kind, activity.detail, activity.occurred_at
    from activity
    join public.profiles as profile on profile.id = activity.user_id
    join auth.users as auth_user on auth_user.id = activity.user_id
    order by activity.occurred_at desc
    limit 100
  )
  select jsonb_build_object(
    'summary', jsonb_build_object(
      'totalUsers', (select count(*)::int from public.profiles),
      'newUsersLast7Days', (select count(*)::int from public.profiles where created_at >= now() - interval '7 days'),
      'activeUsersLast7Days', (select count(distinct user_id)::int from activity where occurred_at >= now() - interval '7 days'),
      'progressUpdatesLast7Days', (select count(*)::int from public.progress where updated_at >= now() - interval '7 days'),
      'focusMinutesLast7Days', (select coalesce(sum(duration_minutes), 0)::int from public.focus_sessions where completed is true and created_at >= now() - interval '7 days'),
      'homeworkRequestsLast7Days', (select count(*)::int from public.homework_help_usage where created_at >= now() - interval '7 days')
    ),
    'students', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'email', email, 'displayName', display_name, 'languageSubject', language_subject, 'createdAt', created_at, 'lastActivityAt', last_activity_at, 'progressUpdates', progress_updates) order by created_at desc) from students), '[]'::jsonb),
    'activity', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'student', student, 'email', email, 'kind', kind, 'detail', detail, 'occurredAt', occurred_at) order by occurred_at desc) from recent_activity), '[]'::jsonb)
  ) into dashboard;

  return dashboard;
end;
$$;

revoke all on function public.get_admin_dashboard() from public, anon;
grant execute on function public.get_admin_dashboard() to authenticated;
