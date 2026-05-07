# 10thHoJayega

10th ka syllabus. Sorted. Printed. Tracked. Ho jayega.

## Project Summary

10thHoJayega is a Class 10 CBSE/NCERT syllabus tracker for students who need progress tracking, official NCERT links, focus blocks, and printable packs from their own account data.

For a detailed writeup of what was learned, what tools were used, and how this project fits into a portfolio, see [PROJECT_LEARNINGS.md](PROJECT_LEARNINGS.md).

## Problem Solved

Students can track syllabus progress in Supabase, then print a personalized checklist for revision and manual marking.

## Main Features

- Supabase email/password auth
- Protected dashboard
- Subject and chapter progress tracking
- Hindi/French language subject preference
- Maths exercise-level progress tracking
- Private per-chapter notes
- Focus mode with saved completed sessions
- AI Homework Help with Gemini free tier, photo upload, and step-by-step tutor responses
- Official NCERT textbook links page
- Printable planner
- Printable Pack with only full syllabus checklist and Maths exercise tracker
- Feedback form that sends reports to the project inbox
- Settings page with display name, JSON export, progress reset, and logout

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres + RLS
- `@supabase/ssr`
- ESLint
- Prettier

## Screens and Routes

- `/` landing page
- `/login` login/signup
- `/setup` Supabase setup help
- `/dashboard` protected dashboard
- `/subjects` subject list
- `/subjects/[subjectId]` subject tracker
- `/subjects/[subjectId]/chapters/[chapterId]` chapter detail and notes
- `/homework-help` AI homework tutor
- `/focus` Pomodoro focus mode
- `/textbooks` official NCERT/CBSE links
- `/print` printable planner
- `/printable-pack` Printable Pack
- `/feedback` send bug reports and feature ideas
- `/settings` account settings

## Supabase Setup

1. Create a Supabase project.
2. Open Project Settings, then API.
3. Copy the project URL.
4. Copy the anon public key.
5. Create `.env.local`.
6. Add:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
RESEND_API_KEY=
FEEDBACK_FROM_EMAIL=10thHoJayega <onboarding@resend.dev>
FEEDBACK_TO_EMAIL=sawarkarswarit@gmail.com
NEXT_PUBLIC_SITE_URL=https://10thhojayega.vercel.app
```

7. Open Supabase SQL Editor.
8. Run `supabase/schema.sql`.
9. Run `supabase/seed.sql`.
10. If upgrading an existing project, run `supabase/update-language-subject.sql`.
11. Run `supabase/update-homework-help.sql` for AI usage counting.
12. Restart the dev server.
13. Go to `/login` and create an account.

## Environment Variables

Use `.env.example` as the template:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
RESEND_API_KEY=
FEEDBACK_FROM_EMAIL=10thHoJayega <onboarding@resend.dev>
FEEDBACK_TO_EMAIL=sawarkarswarit@gmail.com
```

Do not expose a Supabase service role key in this project. Do not prefix the Gemini key with `NEXT_PUBLIC_`; it must stay server-only.
Set `RESEND_API_KEY` and `FEEDBACK_FROM_EMAIL` for first-party feedback email delivery. Without Resend, feedback falls back to FormSubmit and the destination inbox may need to approve the first activation email.

## Run Schema SQL

Open `supabase/schema.sql`, paste it into the Supabase SQL Editor, and run it. It creates tables, RLS policies, triggers, and grants.

## Run Seed SQL

Open `supabase/seed.sql`, paste it into the Supabase SQL Editor, and run it. The seed data is sample data and must be verified against official CBSE/NCERT curriculum before production use.

For existing Supabase projects created before Hindi/French support, also run `supabase/update-language-subject.sql`. It adds the profile preference and French tracker rows without touching user progress.

For existing projects created before AI Homework Help, run `supabase/update-homework-help.sql`. It adds usage counting only; it does not store prompts or AI answers.

## Local Run Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

Open `http://localhost:3000`.

## Vercel Deployment

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add these environment variables in Vercel Project Settings:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `RESEND_API_KEY`, `FEEDBACK_FROM_EMAIL`, `FEEDBACK_TO_EMAIL`, and `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

Set `NEXT_PUBLIC_SITE_URL` to the production origin. Use
`https://10thhojayega.vercel.app` for the current Vercel domain, or replace it
with a custom domain later, so canonical URLs, `robots.txt`, and `sitemap.xml`
use the public domain.

## GitHub Push Commands

```bash
git add .
git commit -m "Build 10thHoJayega v1"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Legal Note About NCERT PDFs

This project does not re-host NCERT textbooks. It links to official NCERT resources only.

## Syllabus Accuracy Note

Seed data is sample data and must be verified against official CBSE/NCERT curriculum before production use.

## Known Limitations

- Direct PDF generation is not included in V1; use browser Print / Save as PDF.
- Seed data is intentionally incomplete sample data.
- Email confirmation behavior depends on Supabase project auth settings.
- AI Homework Help depends on Gemini free-tier availability and project rate limits.
- Homework photos are sent to Gemini for the current answer only; they are not stored in Supabase.
- No admin UI for editing syllabus rows yet.

## Roadmap

- Verified full syllabus import workflow
- Admin-only syllabus editor
- Chapter filters and search
- Per-subject analytics
- Optional direct server-side PDF export
- Better session history for focus mode
