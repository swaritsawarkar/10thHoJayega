# Project Context

## What 10thHoJayega Is

10thHoJayega is a Class 10 CBSE/NCERT syllabus tracker. The app helps students track syllabus progress, keep private chapter notes, run focus sessions, use official textbook links, and print checklists for revision.

Tagline: "10th ka syllabus. Sorted. Printed. Tracked. Ho jayega."

## Problem It Solves

Class 10 students often need one place to see what is left, what is revised, what is board-ready, and what can be printed for offline study. This project gives them an account-based tracker and printable checklists instead of scattered notes.

## Target Users

- Class 10 students using CBSE/NCERT-style study material.
- Students who want a simple progress tracker and printable revision plan.
- Students who need short, step-by-step homework help instead of full answer dumping.

## Current Features

- Supabase email/password login and signup.
- Protected dashboard with progress summary.
- Subject and chapter progress tracking.
- Maths exercise-level progress tracking.
- Hindi/French language subject preference.
- Private per-chapter notes.
- Pomodoro focus mode.
- Feynman technique helper.
- Blurting space styled like a whiteboard.
- Saved completed focus sessions.
- AI Homework Help with text and one photo upload.
- Official NCERT/CBSE textbook links page.
- Printable planner.
- Printable Pack with syllabus checklist and Maths exercise tracker.
- Feedback form that sends through the server when Resend is configured.
- Settings for display name, language subject, JSON export, progress reset, logout, and delete account.

## AI Homework Help Behavior

Homework Help runs through `src/app/api/homework-help/route.ts` and uses Google Gemini through the Vercel AI SDK.

Important behavior:

- Model: `gemini-2.5-flash`.
- Server-only key: `GOOGLE_GENERATIVE_AI_API_KEY`.
- Daily limit: 10 questions per user.
- Request limit: 12 messages per request.
- Text limit: 2500 characters per message and 10000 characters total.
- Image limit: one JPG, PNG, or WebP under 4 MB.
- The route validates request shape and rejects unexpected fields.
- It counts usage in `homework_help_usage`.
- It does not store prompts, answers, or uploaded homework photos.
- If a subject or chapter is selected, the route adds that app context to the tutor prompt.
- If Gemini is not configured, the app shows a setup-needed state.

The tutor should explain steps, give hints, and ask for clearer input when the question/photo is missing or unclear. It should not invent NCERT exercise questions from memory.

## What AI Agents Should Do

- Read the code before changing it.
- Keep changes narrow and tied to the user request.
- Preserve Supabase auth and protected routes.
- Preserve RLS and user-owned data boundaries.
- Keep Gemini, Resend, and Supabase service role keys server-only.
- Use existing UI patterns and components.
- Keep the app voice student-friendly, practical, and lightly fun.
- Run `npm run lint` and `npm run build` after changes when possible.
- Report unrelated failures clearly instead of changing random files.

## What AI Agents Should Not Do

- Do not rewrite the app.
- Do not redesign the UI unless asked.
- Do not remove working features.
- Do not invent official CBSE/NCERT syllabus data.
- Do not claim seed data is official.
- Do not commit secrets or real `.env.local` values.
- Do not prefix private keys with `NEXT_PUBLIC_`.
- Do not loosen Supabase RLS policies to make a feature work.
- Do not use the Supabase service role key in client code.
- Do not store Homework Help prompts, answers, or images unless the user asks for that feature.

## Data Stored

Supabase stores:

- `profiles`: user display name and Hindi/French language subject preference.
- `subjects`: sample subject rows.
- `chapters`: sample chapter rows and official textbook URL fields.
- `exercises`: sample Maths exercise rows.
- `progress`: per-user chapter/exercise status.
- `notes`: per-user private chapter notes.
- `focus_sessions`: per-user saved focus sessions.
- `homework_help_usage`: per-user Homework Help usage count rows.

Homework Help images are sent to Gemini for the current answer only and are not stored in Supabase.

## Known Limitations

- Seed data is sample-only and intentionally incomplete.
- Syllabus rows must be verified against official CBSE/NCERT sources before production use.
- Direct PDF generation is not included; users print or save as PDF from the browser.
- Email confirmation behavior depends on Supabase project settings.
- Homework Help depends on Gemini availability and project rate limits.
- Feedback email requires `RESEND_API_KEY`.
- Delete account requires optional server-only `SUPABASE_SERVICE_ROLE_KEY`.
- No admin UI exists for editing syllabus rows.

## Roadmap

- Verified full syllabus import workflow.
- Admin-only syllabus editor.
- Chapter filters and search.
- Per-subject analytics.
- Optional direct server-side PDF export.
- Better session history for focus mode.

## Product Voice

The voice should feel like a helpful older student built the app: clear, direct, slightly funny, and not corporate. Use simple words. Keep jokes light and study-focused. Avoid generic SaaS phrases.
