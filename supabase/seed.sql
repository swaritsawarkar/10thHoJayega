-- Class 10 tracker data for the current app shape.
-- Chapter lists are based on official NCERT textbook prelim PDFs and CBSE 2025-26 curriculum PDFs.
-- Run this after supabase/schema.sql. Rerunning is safe and removes old placeholder chapter buckets.

begin;

drop table if exists pg_temp.current_app_chapter_ids;

create temporary table current_app_chapter_ids (
  id text primary key
) on commit drop;

insert into current_app_chapter_ids (id)
values
  ('maths-real-numbers'),
  ('maths-polynomials'),
  ('maths-linear-equations'),
  ('maths-quadratic-equations'),
  ('maths-arithmetic-progressions'),
  ('maths-triangles'),
  ('maths-coordinate-geometry'),
  ('maths-introduction-trigonometry'),
  ('maths-applications-trigonometry'),
  ('maths-circles'),
  ('maths-areas-related-circles'),
  ('maths-surface-areas-volumes'),
  ('maths-statistics'),
  ('maths-probability'),
  ('science-chemical-reactions'),
  ('science-acids-bases-salts'),
  ('science-metals-non-metals'),
  ('science-carbon-compounds'),
  ('science-life-processes'),
  ('science-control-coordination'),
  ('science-organisms-reproduce'),
  ('science-heredity'),
  ('science-light-reflection-refraction'),
  ('science-human-eye-colourful-world'),
  ('science-electricity'),
  ('science-magnetic-effects-electric-current'),
  ('science-our-environment'),
  ('sst-rise-nationalism-europe'),
  ('sst-nationalism-india'),
  ('sst-making-global-world'),
  ('sst-age-industrialisation'),
  ('sst-print-culture'),
  ('sst-resources-development'),
  ('sst-forest-wildlife-resources'),
  ('sst-water-resources'),
  ('sst-agriculture'),
  ('sst-minerals-energy-resources'),
  ('sst-manufacturing-industries'),
  ('sst-lifelines-national-economy'),
  ('sst-power-sharing'),
  ('sst-federalism'),
  ('sst-gender-religion-caste'),
  ('sst-political-parties'),
  ('sst-outcomes-democracy'),
  ('sst-development'),
  ('sst-sectors-indian-economy'),
  ('sst-money-credit'),
  ('sst-globalisation-indian-economy'),
  ('sst-consumer-rights'),
  ('english-first-flight-letter-god'),
  ('english-first-flight-nelson-mandela'),
  ('english-first-flight-stories-flying'),
  ('english-first-flight-anne-frank'),
  ('english-first-flight-glimpses-india'),
  ('english-first-flight-mijbil-otter'),
  ('english-first-flight-madam-rides-bus'),
  ('english-first-flight-sermon-benares'),
  ('english-first-flight-proposal'),
  ('english-poem-dust-snow'),
  ('english-poem-fire-ice'),
  ('english-poem-tiger-zoo'),
  ('english-poem-how-to-tell-wild-animals'),
  ('english-poem-ball-poem'),
  ('english-poem-amanda'),
  ('english-poem-trees'),
  ('english-poem-fog'),
  ('english-poem-custard-dragon'),
  ('english-poem-anne-gregory'),
  ('english-footprints-triumph-surgery'),
  ('english-footprints-thief-story'),
  ('english-footprints-midnight-visitor'),
  ('english-footprints-question-trust'),
  ('english-footprints'),
  ('english-footprints-making-scientist'),
  ('english-footprints-necklace'),
  ('english-footprints-bholi'),
  ('english-footprints-book-saved-earth'),
  ('hindi-kshitij-surdas'),
  ('hindi-kshitij-tulsidas'),
  ('hindi-kshitij-jaishankar-prasad'),
  ('hindi-kshitij-nirala'),
  ('hindi-kshitij-nagarjun'),
  ('hindi-kshitij-manglesh-dabral'),
  ('hindi-kshitij-swayam-prakash'),
  ('hindi-kshitij-ramvriksh-benipuri'),
  ('hindi-kshitij-yashpal'),
  ('hindi-kshitij-mannu-bhandari'),
  ('hindi-kshitij-yatindra-mishra'),
  ('hindi-kshitij-bhadant-anand-kausalyayan'),
  ('hindi-kritika-mata-ka-anchal'),
  ('hindi-kritika-sana-sana-hath-jodi'),
  ('hindi-kritika-main-kyon-likhta-hoon'),
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
  and public.chapters.subject_id in (
    'maths',
    'science',
    'social-science',
    'english',
    'hindi',
    'french'
  )
  and not exists (
    select 1
    from current_app_chapter_ids
    where current_app_chapter_ids.id = public.chapters.id
  );

delete from public.chapters
where public.chapters.subject_id in (
    'maths',
    'science',
    'social-science',
    'english',
    'hindi',
    'french'
  )
  and not exists (
    select 1
    from current_app_chapter_ids
    where current_app_chapter_ids.id = public.chapters.id
  );

with stale_chapter_ids(id) as (
  values
    ('english-first-flight-prose'),
    ('english-first-flight-poetry'),
    ('science-light'),
    ('hindi-kshitij-sample'),
    ('hindi-grammar-sample'),
    ('french-literature-sample'),
    ('french-grammar-sample')
)
delete from public.progress
using stale_chapter_ids
where public.progress.item_type = 'chapter'
  and public.progress.item_id = stale_chapter_ids.id;

delete from public.chapters
where id in (
  'english-first-flight-prose',
  'english-first-flight-poetry',
  'science-light',
  'hindi-kshitij-sample',
  'hindi-grammar-sample',
  'french-literature-sample',
  'french-grammar-sample'
);

insert into public.subjects (id, name, description, sort_order)
values
  ('maths', 'Maths', 'Complete NCERT Class 10 Mathematics chapter and exercise tracker.', 10),
  ('science', 'Science', 'NCERT Science tracker grouped into Chemistry, Biology, Physics, and Environment.', 20),
  ('social-science', 'Social Science', 'History, Geography, Civics, and Economics progress from the NCERT books.', 30),
  ('english', 'English', 'NCERT First Flight and Footprints Without Feet literature tracker.', 40),
  ('hindi', 'Hindi', 'NCERT Kshitij and Kritika reading tracker for Hindi Course A.', 50),
  ('french', 'French', 'CBSE Entre Jeunes Class 10 culture-and-civilisation lesson tracker.', 50),
  ('optional', 'Optional Subject', 'School-specific optional subject tracker.', 60)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.chapters (id, subject_id, title, chapter_number, official_textbook_url, sort_order)
values
  ('maths-real-numbers', 'maths', 'Real Numbers', 1, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 101),
  ('maths-polynomials', 'maths', 'Polynomials', 2, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 102),
  ('maths-linear-equations', 'maths', 'Pair of Linear Equations in Two Variables', 3, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 103),
  ('maths-quadratic-equations', 'maths', 'Quadratic Equations', 4, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 104),
  ('maths-arithmetic-progressions', 'maths', 'Arithmetic Progressions', 5, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 105),
  ('maths-triangles', 'maths', 'Triangles', 6, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 106),
  ('maths-coordinate-geometry', 'maths', 'Coordinate Geometry', 7, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 107),
  ('maths-introduction-trigonometry', 'maths', 'Introduction to Trigonometry', 8, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 108),
  ('maths-applications-trigonometry', 'maths', 'Some Applications of Trigonometry', 9, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 109),
  ('maths-circles', 'maths', 'Circles', 10, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 110),
  ('maths-areas-related-circles', 'maths', 'Areas Related to Circles', 11, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 111),
  ('maths-surface-areas-volumes', 'maths', 'Surface Areas and Volumes', 12, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 112),
  ('maths-statistics', 'maths', 'Statistics', 13, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 113),
  ('maths-probability', 'maths', 'Probability', 14, 'https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf', 114),

  ('science-chemical-reactions', 'science', 'Chemical Reactions and Equations', 1, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 201),
  ('science-acids-bases-salts', 'science', 'Acids, Bases and Salts', 2, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 202),
  ('science-metals-non-metals', 'science', 'Metals and Non-metals', 3, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 203),
  ('science-carbon-compounds', 'science', 'Carbon and its Compounds', 4, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 204),
  ('science-life-processes', 'science', 'Life Processes', 5, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 205),
  ('science-control-coordination', 'science', 'Control and Coordination', 6, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 206),
  ('science-organisms-reproduce', 'science', 'How do Organisms Reproduce?', 7, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 207),
  ('science-heredity', 'science', 'Heredity', 8, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 208),
  ('science-light-reflection-refraction', 'science', 'Light - Reflection and Refraction', 9, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 209),
  ('science-human-eye-colourful-world', 'science', 'The Human Eye and the Colourful World', 10, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 210),
  ('science-electricity', 'science', 'Electricity', 11, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 211),
  ('science-magnetic-effects-electric-current', 'science', 'Magnetic Effects of Electric Current', 12, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 212),
  ('science-our-environment', 'science', 'Our Environment', 13, 'https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf', 213),

  ('sst-rise-nationalism-europe', 'social-science', 'The Rise of Nationalism in Europe', 1, 'https://ncert.nic.in/textbook/pdf/jess3ps.pdf', 301),
  ('sst-nationalism-india', 'social-science', 'Nationalism in India', 2, 'https://ncert.nic.in/textbook/pdf/jess3ps.pdf', 302),
  ('sst-making-global-world', 'social-science', 'The Making of a Global World', 3, 'https://ncert.nic.in/textbook/pdf/jess3ps.pdf', 303),
  ('sst-age-industrialisation', 'social-science', 'The Age of Industrialisation', 4, 'https://ncert.nic.in/textbook/pdf/jess3ps.pdf', 304),
  ('sst-print-culture', 'social-science', 'Print Culture and the Modern World', 5, 'https://ncert.nic.in/textbook/pdf/jess3ps.pdf', 305),
  ('sst-resources-development', 'social-science', 'Resources and Development', 1, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 321),
  ('sst-forest-wildlife-resources', 'social-science', 'Forest and Wildlife Resources', 2, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 322),
  ('sst-water-resources', 'social-science', 'Water Resources', 3, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 323),
  ('sst-agriculture', 'social-science', 'Agriculture', 4, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 324),
  ('sst-minerals-energy-resources', 'social-science', 'Minerals and Energy Resources', 5, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 325),
  ('sst-manufacturing-industries', 'social-science', 'Manufacturing Industries', 6, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 326),
  ('sst-lifelines-national-economy', 'social-science', 'Lifelines of National Economy', 7, 'https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf', 327),
  ('sst-power-sharing', 'social-science', 'Power-sharing', 1, 'https://ncert.nic.in/textbook/pdf/jess4ps.pdf', 341),
  ('sst-federalism', 'social-science', 'Federalism', 2, 'https://ncert.nic.in/textbook/pdf/jess4ps.pdf', 342),
  ('sst-gender-religion-caste', 'social-science', 'Gender, Religion and Caste', 3, 'https://ncert.nic.in/textbook/pdf/jess4ps.pdf', 343),
  ('sst-political-parties', 'social-science', 'Political Parties', 4, 'https://ncert.nic.in/textbook/pdf/jess4ps.pdf', 344),
  ('sst-outcomes-democracy', 'social-science', 'Outcomes of Democracy', 5, 'https://ncert.nic.in/textbook/pdf/jess4ps.pdf', 345),
  ('sst-development', 'social-science', 'Development', 1, 'https://www.ncert.nic.in/textbook/pdf/jess2ps.pdf', 361),
  ('sst-sectors-indian-economy', 'social-science', 'Sectors of the Indian Economy', 2, 'https://www.ncert.nic.in/textbook/pdf/jess2ps.pdf', 362),
  ('sst-money-credit', 'social-science', 'Money and Credit', 3, 'https://www.ncert.nic.in/textbook/pdf/jess2ps.pdf', 363),
  ('sst-globalisation-indian-economy', 'social-science', 'Globalisation and the Indian Economy', 4, 'https://www.ncert.nic.in/textbook/pdf/jess2ps.pdf', 364),
  ('sst-consumer-rights', 'social-science', 'Consumer Rights', 5, 'https://www.ncert.nic.in/textbook/pdf/jess2ps.pdf', 365),

  ('english-first-flight-letter-god', 'english', 'A Letter to God', 1, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 401),
  ('english-first-flight-nelson-mandela', 'english', 'Nelson Mandela - Long Walk to Freedom', 2, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 402),
  ('english-first-flight-stories-flying', 'english', 'Stories About Flying', 3, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 403),
  ('english-first-flight-anne-frank', 'english', 'From the Diary of Anne Frank', 4, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 404),
  ('english-first-flight-glimpses-india', 'english', 'Glimpses of India', 5, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 405),
  ('english-first-flight-mijbil-otter', 'english', 'Mijbil the Otter', 6, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 406),
  ('english-first-flight-madam-rides-bus', 'english', 'Madam Rides the Bus', 7, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 407),
  ('english-first-flight-sermon-benares', 'english', 'The Sermon at Benares', 8, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 408),
  ('english-first-flight-proposal', 'english', 'The Proposal', 9, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 409),
  ('english-poem-dust-snow', 'english', 'Dust of Snow', 1, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 431),
  ('english-poem-fire-ice', 'english', 'Fire and Ice', 2, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 432),
  ('english-poem-tiger-zoo', 'english', 'A Tiger in the Zoo', 3, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 433),
  ('english-poem-how-to-tell-wild-animals', 'english', 'How to Tell Wild Animals', 4, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 434),
  ('english-poem-ball-poem', 'english', 'The Ball Poem', 5, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 435),
  ('english-poem-amanda', 'english', 'Amanda!', 6, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 436),
  ('english-poem-trees', 'english', 'The Trees', 7, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 437),
  ('english-poem-fog', 'english', 'Fog', 8, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 438),
  ('english-poem-custard-dragon', 'english', 'The Tale of Custard the Dragon', 9, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 439),
  ('english-poem-anne-gregory', 'english', 'For Anne Gregory', 10, 'https://ncert.nic.in/textbook/pdf/jeff1ps.pdf', 440),
  ('english-footprints-triumph-surgery', 'english', 'A Triumph of Surgery', 1, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 461),
  ('english-footprints-thief-story', 'english', 'The Thief''s Story', 2, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 462),
  ('english-footprints-midnight-visitor', 'english', 'The Midnight Visitor', 3, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 463),
  ('english-footprints-question-trust', 'english', 'A Question of Trust', 4, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 464),
  ('english-footprints', 'english', 'Footprints Without Feet', 5, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 465),
  ('english-footprints-making-scientist', 'english', 'The Making of a Scientist', 6, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 466),
  ('english-footprints-necklace', 'english', 'The Necklace', 7, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 467),
  ('english-footprints-bholi', 'english', 'Bholi', 8, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 468),
  ('english-footprints-book-saved-earth', 'english', 'The Book that Saved the Earth', 9, 'https://ncert.nic.in/textbook/pdf/jefp1ps.pdf', 469),

  ('hindi-kshitij-surdas', 'hindi', 'सूरदास - पद', 1, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 501),
  ('hindi-kshitij-tulsidas', 'hindi', 'तुलसीदास - राम-लक्ष्मण-परशुराम संवाद', 2, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 502),
  ('hindi-kshitij-jaishankar-prasad', 'hindi', 'जयशंकर प्रसाद - आत्मकथ्य', 3, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 503),
  ('hindi-kshitij-nirala', 'hindi', 'सूर्यकांत त्रिपाठी निराला - उत्साह / अट नहीं रही है', 4, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 504),
  ('hindi-kshitij-nagarjun', 'hindi', 'नागार्जुन - यह दंतुरित मुस्कान / फसल', 5, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 505),
  ('hindi-kshitij-manglesh-dabral', 'hindi', 'मंगलेश डबराल - संगतकार', 6, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 506),
  ('hindi-kshitij-swayam-prakash', 'hindi', 'स्वयं प्रकाश - नेताजी का चश्मा', 7, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 521),
  ('hindi-kshitij-ramvriksh-benipuri', 'hindi', 'रामवृक्ष बेनीपुरी - बालगोबिन भगत', 8, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 522),
  ('hindi-kshitij-yashpal', 'hindi', 'यशपाल - लखनवी अंदाज़', 9, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 523),
  ('hindi-kshitij-mannu-bhandari', 'hindi', 'मन्नू भंडारी - एक कहानी यह भी', 10, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 524),
  ('hindi-kshitij-yatindra-mishra', 'hindi', 'यतीन्द्र मिश्र - नौबतखाने में इबादत', 11, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 525),
  ('hindi-kshitij-bhadant-anand-kausalyayan', 'hindi', 'भदंत आनंद कौसल्यायन - संस्कृति', 12, 'https://ncert.nic.in/textbook/pdf/jhks1ps.pdf', 526),
  ('hindi-kritika-mata-ka-anchal', 'hindi', 'माता का अंचल', 1, 'https://ncert.nic.in/textbook/pdf/jhkr1ps.pdf', 541),
  ('hindi-kritika-sana-sana-hath-jodi', 'hindi', 'साना-साना हाथ जोड़ि...', 2, 'https://ncert.nic.in/textbook/pdf/jhkr1ps.pdf', 542),
  ('hindi-kritika-main-kyon-likhta-hoon', 'hindi', 'मैं क्यों लिखता हूँ?', 3, 'https://ncert.nic.in/textbook/pdf/jhkr1ps.pdf', 543),

  ('french-apres-le-bac', 'french', 'Après le bac', 2, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 512),
  ('french-chercher-travail', 'french', 'Chercher du travail', 3, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 513),
  ('french-plaisir-lire', 'french', 'Le plaisir de lire', 4, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 514),
  ('french-les-medias', 'french', 'Les médias', 5, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 515),
  ('french-chacun-ses-gouts', 'french', 'Chacun ses goûts', 6, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 516),
  ('french-en-pleine-forme', 'french', 'En pleine forme', 7, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 517),
  ('french-lenvironnement', 'french', 'L''environnement', 8, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 518),
  ('french-vive-la-republique', 'french', 'Vive la République!', 10, 'https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf', 520),

  ('optional-school-specific', 'optional', 'School-specific Optional Subject', 1, null, 601)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  title = excluded.title,
  chapter_number = excluded.chapter_number,
  official_textbook_url = excluded.official_textbook_url,
  sort_order = excluded.sort_order;

insert into public.exercises (id, chapter_id, title, sort_order)
values
  ('ex-maths-real-numbers-1-1', 'maths-real-numbers', 'Exercise 1.1', 1011),
  ('ex-maths-real-numbers-1-2', 'maths-real-numbers', 'Exercise 1.2', 1012),
  ('ex-maths-polynomials-2-1', 'maths-polynomials', 'Exercise 2.1', 1021),
  ('ex-maths-polynomials-2-2', 'maths-polynomials', 'Exercise 2.2', 1022),
  ('ex-maths-linear-equations-3-1', 'maths-linear-equations', 'Exercise 3.1', 1031),
  ('ex-maths-linear-equations-3-2', 'maths-linear-equations', 'Exercise 3.2', 1032),
  ('ex-maths-linear-equations-3-3', 'maths-linear-equations', 'Exercise 3.3', 1033),
  ('ex-maths-quadratic-4-1', 'maths-quadratic-equations', 'Exercise 4.1', 1041),
  ('ex-maths-quadratic-4-2', 'maths-quadratic-equations', 'Exercise 4.2', 1042),
  ('ex-maths-arithmetic-5-1', 'maths-arithmetic-progressions', 'Exercise 5.1', 1051),
  ('ex-maths-arithmetic-5-2', 'maths-arithmetic-progressions', 'Exercise 5.2', 1052),
  ('ex-maths-arithmetic-5-3', 'maths-arithmetic-progressions', 'Exercise 5.3', 1053),
  ('ex-maths-triangles-6-1', 'maths-triangles', 'Exercise 6.1', 1061),
  ('ex-maths-triangles-6-2', 'maths-triangles', 'Exercise 6.2', 1062),
  ('ex-maths-triangles-6-3', 'maths-triangles', 'Exercise 6.3', 1063),
  ('ex-maths-coordinate-7-1', 'maths-coordinate-geometry', 'Exercise 7.1', 1071),
  ('ex-maths-coordinate-7-2', 'maths-coordinate-geometry', 'Exercise 7.2', 1072),
  ('ex-maths-trigonometry-8-1', 'maths-introduction-trigonometry', 'Exercise 8.1', 1081),
  ('ex-maths-trigonometry-8-2', 'maths-introduction-trigonometry', 'Exercise 8.2', 1082),
  ('ex-maths-trigonometry-8-3', 'maths-introduction-trigonometry', 'Exercise 8.3', 1083),
  ('ex-maths-applications-trigonometry-9-1', 'maths-applications-trigonometry', 'Exercise 9.1', 1091),
  ('ex-maths-circles-10-1', 'maths-circles', 'Exercise 10.1', 1101),
  ('ex-maths-circles-10-2', 'maths-circles', 'Exercise 10.2', 1102),
  ('ex-maths-areas-circles-11-1', 'maths-areas-related-circles', 'Exercise 11.1', 1111),
  ('ex-maths-surface-areas-volumes-12-1', 'maths-surface-areas-volumes', 'Exercise 12.1', 1121),
  ('ex-maths-surface-areas-volumes-12-2', 'maths-surface-areas-volumes', 'Exercise 12.2', 1122),
  ('ex-maths-statistics-13-1', 'maths-statistics', 'Exercise 13.1', 1131),
  ('ex-maths-statistics-13-2', 'maths-statistics', 'Exercise 13.2', 1132),
  ('ex-maths-statistics-13-3', 'maths-statistics', 'Exercise 13.3', 1133),
  ('ex-maths-probability-14-1', 'maths-probability', 'Exercise 14.1', 1141)
on conflict (id) do update set
  chapter_id = excluded.chapter_id,
  title = excluded.title,
  sort_order = excluded.sort_order;

commit;
