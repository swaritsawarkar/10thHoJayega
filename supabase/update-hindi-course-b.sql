-- Adds Hindi Course B without changing existing Hindi Course A or French progress.

begin;

alter table public.profiles
drop constraint if exists profiles_language_subject_check;

alter table public.profiles
add constraint profiles_language_subject_check
check (language_subject in ('hindi', 'hindi-course-b', 'french'));

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

insert into public.subjects (id, name, description, sort_order)
values
  ('hindi', 'Hindi Course A', 'NCERT Kshitij and Kritika reading tracker for Hindi Course A.', 50),
  ('hindi-course-b', 'Hindi Course B', 'NCERT Sparsh and Sanchayan reading tracker for Hindi Course B.', 51)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.chapters (id, subject_id, title, chapter_number, official_textbook_url, sort_order)
values
  ('hindi-course-b-sparsh-kabir-sakhi', 'hindi-course-b', 'कबीर - साखी', 1, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 571),
  ('hindi-course-b-sparsh-meera-pad', 'hindi-course-b', 'मीरा - पद', 2, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 572),
  ('hindi-course-b-sparsh-manushyata', 'hindi-course-b', 'मैथिलीशरण गुप्त - मनुष्यता', 3, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 573),
  ('hindi-course-b-sparsh-parvat-pradesh-pawas', 'hindi-course-b', 'सुमित्रानंदन पंत - पर्वत प्रदेश में पावस', 4, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 574),
  ('hindi-course-b-sparsh-top', 'hindi-course-b', 'वीरेन डंगवाल - तोप', 5, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 575),
  ('hindi-course-b-sparsh-kar-chale-hum-fida', 'hindi-course-b', 'कैफ़ी आज़मी - कर चले हम फ़िदा', 6, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 576),
  ('hindi-course-b-sparsh-atmatran', 'hindi-course-b', 'रवींद्रनाथ ठाकुर - आत्मत्राण', 7, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 577),
  ('hindi-course-b-sparsh-bade-bhai-sahab', 'hindi-course-b', 'प्रेमचंद - बड़े भाई साहब', 8, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 581),
  ('hindi-course-b-sparsh-diary-ka-ek-panna', 'hindi-course-b', 'सीताराम सेकसरिया - डायरी का एक पन्ना', 9, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 582),
  ('hindi-course-b-sparsh-tatara-vamiro-katha', 'hindi-course-b', 'लीलाधर मंडलोई - तताँरा-वामीरो कथा', 10, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 583),
  ('hindi-course-b-sparsh-shailendra', 'hindi-course-b', 'प्रह्लाद अग्रवाल - तीसरी कसम के शिल्पकार शैलेंद्र', 11, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 584),
  ('hindi-course-b-sparsh-doosre-ke-dukh', 'hindi-course-b', 'निदा फ़ाज़ली - अब कहाँ दूसरे के दुख से दुखी होने वाले', 12, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 585),
  ('hindi-course-b-sparsh-patjhar-mein-tooti-pattiyan', 'hindi-course-b', 'रवींद्र केलेकर - पतझर में टूटी पत्तियाँ', 13, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 586),
  ('hindi-course-b-sparsh-kartoos', 'hindi-course-b', 'हबीब तनवीर - कारतूस', 14, 'https://ncert.nic.in/textbook/pdf/jhsp1ps.pdf', 587),
  ('hindi-course-b-sanchayan-harihar-kaka', 'hindi-course-b', 'मिथिलेश्वर - हरिहर काका', 1, 'https://ncert.nic.in/textbook/pdf/jhsy1ps.pdf', 591),
  ('hindi-course-b-sanchayan-sapnon-ke-se-din', 'hindi-course-b', 'गुरदयाल सिंह - सपनों के-से दिन', 2, 'https://ncert.nic.in/textbook/pdf/jhsy1ps.pdf', 592),
  ('hindi-course-b-sanchayan-topi-shukla', 'hindi-course-b', 'राही मासूम रज़ा - टोपी शुक्ला', 3, 'https://ncert.nic.in/textbook/pdf/jhsy1ps.pdf', 593)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  title = excluded.title,
  chapter_number = excluded.chapter_number,
  official_textbook_url = excluded.official_textbook_url,
  sort_order = excluded.sort_order;

commit;
