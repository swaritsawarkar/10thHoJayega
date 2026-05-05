-- Adds Hindi/French profile preference for existing 10thHoJayega Supabase projects.
-- Sample only. Verify against official CBSE/NCERT 2025-26 or 2026-27 syllabus before production.

begin;

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

insert into public.subjects (id, name, description, sort_order)
values
  ('french', 'French', 'French language subject tracker for your course.', 50)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.chapters (id, subject_id, title, chapter_number, official_textbook_url, sort_order)
values
  ('french-literature-sample', 'french', 'French Literature Sample Set', 1, 'https://ncert.nic.in/textbook.php', 511),
  ('french-grammar-sample', 'french', 'French Grammar Sample Set', 2, 'https://ncert.nic.in/textbook.php', 512)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  title = excluded.title,
  chapter_number = excluded.chapter_number,
  official_textbook_url = excluded.official_textbook_url,
  sort_order = excluded.sort_order;

commit;
