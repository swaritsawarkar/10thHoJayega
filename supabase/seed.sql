-- Sample only. Verify against official CBSE/NCERT 2025-26 or 2026-27 syllabus before production.
-- This seed exists to test 10thHoJayega UI/data flow. It is not a final official syllabus.

begin;

insert into public.subjects (id, name, description, sort_order)
values
  ('maths', 'Maths', 'Chapter and exercise tracker for Class 10 Maths.', 10),
  ('science', 'Science', 'Science chapters in one clean progress checklist.', 20),
  ('social-science', 'Social Science', 'History, Geography, Civics, and Economics progress.', 30),
  ('english', 'English', 'English course tracker for reading, writing, and revision.', 40),
  ('hindi', 'Hindi', 'Hindi language subject tracker for your course.', 50),
  ('french', 'French', 'French language subject tracker for your course.', 50),
  ('optional', 'Optional Subject', 'School-specific optional subject tracker.', 60)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.chapters (id, subject_id, title, chapter_number, official_textbook_url, sort_order)
values
  ('maths-real-numbers', 'maths', 'Real Numbers', 1, 'https://ncert.nic.in/textbook.php', 101),
  ('maths-polynomials', 'maths', 'Polynomials', 2, 'https://ncert.nic.in/textbook.php', 102),
  ('maths-linear-equations', 'maths', 'Pair of Linear Equations in Two Variables', 3, 'https://ncert.nic.in/textbook.php', 103),
  ('maths-quadratic-equations', 'maths', 'Quadratic Equations', 4, 'https://ncert.nic.in/textbook.php', 104),
  ('maths-arithmetic-progressions', 'maths', 'Arithmetic Progressions', 5, 'https://ncert.nic.in/textbook.php', 105),
  ('maths-triangles', 'maths', 'Triangles', 6, 'https://ncert.nic.in/textbook.php', 106),
  ('science-chemical-reactions', 'science', 'Chemical Reactions and Equations', 1, 'https://ncert.nic.in/textbook.php', 201),
  ('science-acids-bases-salts', 'science', 'Acids, Bases and Salts', 2, 'https://ncert.nic.in/textbook.php', 202),
  ('science-life-processes', 'science', 'Life Processes', 3, 'https://ncert.nic.in/textbook.php', 203),
  ('science-light', 'science', 'Light - Reflection and Refraction', 4, 'https://ncert.nic.in/textbook.php', 204),
  ('sst-nationalism-india', 'social-science', 'Nationalism in India', 1, 'https://ncert.nic.in/textbook.php', 301),
  ('sst-resources-development', 'social-science', 'Resources and Development', 2, 'https://ncert.nic.in/textbook.php', 302),
  ('sst-power-sharing', 'social-science', 'Power Sharing', 3, 'https://ncert.nic.in/textbook.php', 303),
  ('sst-money-credit', 'social-science', 'Money and Credit', 4, 'https://ncert.nic.in/textbook.php', 304),
  ('english-first-flight-prose', 'english', 'First Flight - Prose Sample Set', 1, 'https://ncert.nic.in/textbook.php', 401),
  ('english-first-flight-poetry', 'english', 'First Flight - Poetry Sample Set', 2, 'https://ncert.nic.in/textbook.php', 402),
  ('english-footprints', 'english', 'Footprints Without Feet Sample Set', 3, 'https://ncert.nic.in/textbook.php', 403),
  ('hindi-kshitij-sample', 'hindi', 'Hindi Literature Sample Set', 1, 'https://ncert.nic.in/textbook.php', 501),
  ('hindi-grammar-sample', 'hindi', 'Hindi Grammar Sample Set', 2, 'https://ncert.nic.in/textbook.php', 502),
  ('french-literature-sample', 'french', 'French Literature Sample Set', 1, 'https://ncert.nic.in/textbook.php', 511),
  ('french-grammar-sample', 'french', 'French Grammar Sample Set', 2, 'https://ncert.nic.in/textbook.php', 512),
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
  ('ex-maths-triangles-6-1', 'maths-triangles', 'Exercise 6.1', 1061),
  ('ex-maths-triangles-6-2', 'maths-triangles', 'Exercise 6.2', 1062),
  ('ex-maths-triangles-6-3', 'maths-triangles', 'Exercise 6.3', 1063)
on conflict (id) do update set
  chapter_id = excluded.chapter_id,
  title = excluded.title,
  sort_order = excluded.sort_order;

commit;
