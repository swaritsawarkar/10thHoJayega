-- Adds Hindi/French profile preference for existing 10thHoJayega Supabase projects.
-- French chapter rows follow the official CBSE Class X 2025-26 French curriculum.

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
  ('french', 'French', 'CBSE Entre Jeunes Class 10 culture-and-civilisation lesson tracker.', 50)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

drop table if exists pg_temp.current_french_chapter_ids;

create temporary table current_french_chapter_ids (
  id text primary key
) on commit drop;

insert into current_french_chapter_ids (id)
values
  ('french-apres-le-bac'),
  ('french-chercher-travail'),
  ('french-plaisir-lire'),
  ('french-les-medias'),
  ('french-chacun-ses-gouts'),
  ('french-en-pleine-forme'),
  ('french-lenvironnement'),
  ('french-vive-la-republique');

delete from public.progress
using public.chapters
where public.progress.item_type = 'chapter'
  and public.progress.item_id = public.chapters.id
  and public.chapters.subject_id = 'french'
  and not exists (
    select 1
    from current_french_chapter_ids
    where current_french_chapter_ids.id = public.chapters.id
  );

delete from public.chapters
where public.chapters.subject_id = 'french'
  and not exists (
    select 1
    from current_french_chapter_ids
    where current_french_chapter_ids.id = public.chapters.id
  );

insert into public.chapters (id, subject_id, title, chapter_number, official_textbook_url, sort_order)
values
  ('french-apres-le-bac', 'french', 'Après le bac', 2, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 512),
  ('french-chercher-travail', 'french', 'Chercher du travail', 3, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 513),
  ('french-plaisir-lire', 'french', 'Le plaisir de lire', 4, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 514),
  ('french-les-medias', 'french', 'Les médias', 5, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 515),
  ('french-chacun-ses-gouts', 'french', 'Chacun ses goûts', 6, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 516),
  ('french-en-pleine-forme', 'french', 'En pleine forme', 7, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 517),
  ('french-lenvironnement', 'french', 'L''environnement', 8, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 518),
  ('french-vive-la-republique', 'french', 'Vive la République!', 10, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 520)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  title = excluded.title,
  chapter_number = excluded.chapter_number,
  official_textbook_url = excluded.official_textbook_url,
  sort_order = excluded.sort_order;

commit;
