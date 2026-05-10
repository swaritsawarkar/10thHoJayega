<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 10thHoJayega Agent Instructions

## Project Summary

10thHoJayega is a Class 10 CBSE/NCERT syllabus tracker. It helps students track subject and chapter progress, save private notes, use focus tools, open official textbook links, print checklists, and ask a limited AI Homework Help tutor for step-by-step help.

The app is student-facing, practical, and a little fun. Keep the tone simple, useful, and friendly. Do not turn it into a generic SaaS dashboard.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Supabase Auth
- Supabase Postgres with RLS
- `@supabase/ssr`
- Vercel AI SDK with Google Gemini
- Resend for feedback email
- ESLint and Prettier

## Important Routes

- `/` landing page
- `/login` login/signup
- `/setup` setup help when Supabase env vars are missing
- `/dashboard` protected dashboard
- `/subjects` subject list
- `/subjects/[subjectId]` subject tracker
- `/subjects/[subjectId]/chapters/[chapterId]` chapter detail, progress, and private notes
- `/homework-help` AI homework tutor
- `/focus` Pomodoro timer, Feynman helper, and blurting board
- `/textbooks` official NCERT/CBSE links
- `/print` printable planner
- `/printable-pack` printable checklist pack
- `/feedback` feedback form
- `/settings` account, progress, language, logout, and delete-account controls

## Important Files

- `src/lib/env.ts`: required public Supabase env var checks.
- `src/lib/ai-env.ts`: server-only Gemini env var checks.
- `src/lib/supabase/server.ts`: Supabase SSR client using anon key and cookies.
- `src/lib/supabase/admin.ts`: optional server-only Supabase admin client for account deletion.
- `src/lib/auth.ts`: current-user and protected-route helpers.
- `src/lib/actions/auth.ts`: logout and delete-account server actions.
- `src/lib/homework-help.ts`: AI Homework Help limits and tutor prompt.
- `src/app/api/homework-help/route.ts`: server-only Gemini route with validation and daily usage counting.
- `src/app/api/feedback/route.ts`: server-only feedback email route.
- `supabase/schema.sql`: schema, triggers, grants, and RLS policies.
- `supabase/seed.sql`: sample-only subject/chapter/exercise data.
- `.env.example`: safe environment variable template. Never put real secrets here.

## Supabase Rules

- Do not break Supabase email/password auth.
- Keep RLS enabled on user data tables.
- Keep authenticated users limited to their own `profiles`, `progress`, `notes`, `focus_sessions`, and `homework_help_usage` rows.
- Subjects, chapters, and exercises are read-only app data for authenticated users.
- Use the anon key with the SSR/client helpers for normal app work.
- Do not use or require the Supabase service role key unless the user explicitly asks and the code is server-only admin code.
- `SUPABASE_SERVICE_ROLE_KEY` is optional and server-only. It is currently used only for delete-account admin deletion. Never prefix it with `NEXT_PUBLIC_`.
- Do not loosen grants or policies just to make a feature work.
- Do not invent official CBSE/NCERT syllabus data. Seed data is sample-only unless verified against official CBSE/NCERT sources.

## Gemini and Homework Help Rules

- Gemini runs only on the server through `src/app/api/homework-help/route.ts`.
- `GOOGLE_GENERATIVE_AI_API_KEY` must stay server-only. Never use `NEXT_PUBLIC_` for Gemini keys.
- Homework Help uses `gemini-2.5-flash`.
- Keep request validation strict: only expected request keys, limited message count, limited text length, one image max, and allowed image types only.
- Current limits: 10 questions per day, 12 messages per request, 2500 chars per message, 10000 chars total, one image under 4 MB, JPG/PNG/WebP only.
- Homework photos are sent to Gemini for the current answer only. They are not stored in Supabase.
- Do not store Homework Help prompts or answers unless the user explicitly asks for a storage feature.
- The tutor should teach step by step, ask for clearer input when needed, and avoid claiming syllabus details are official unless the source is provided.
- Do not re-host or quote copyrighted textbook content.

## Environment Variable Rules

- Public browser-safe variables may use `NEXT_PUBLIC_`.
- Private keys must not use `NEXT_PUBLIC_`.
- Required Supabase public vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-only/private vars:
  - `GOOGLE_GENERATIVE_AI_API_KEY`
  - `RESEND_API_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` only when explicitly needed for server-only admin work
- Feedback email vars:
  - `RESEND_API_KEY`
  - `FEEDBACK_FROM_EMAIL`
  - `FEEDBACK_TO_EMAIL`
- Site URL:
  - `NEXT_PUBLIC_SITE_URL`
- Never commit `.env.local`, real API keys, tokens, passwords, or service role keys.

## Styling and Product Vibe

- Keep the app student-friendly, practical, slightly fun, and clear.
- Avoid generic SaaS marketing copy.
- Do not redesign the UI unless the user explicitly asks.
- Follow existing local component patterns and spacing.
- Keep mobile layouts safe: no clipped nav, tiny inputs, overlapping text, or horizontal page overflow.
- Use icons from `lucide-react` when adding controls.

## Testing and Build Commands

- `npm run lint`
- `npm run build`
- `npm run format:check` can be used, but the repo may have unrelated formatting drift. Do not format unrelated files unless the user asks.

## Definition of Done

- The requested change is scoped and does not remove working features.
- Auth, protected routes, Supabase SSR cookies, RLS assumptions, and env var safety are preserved.
- Gemini and private keys remain server-only.
- Schema or seed data changes are avoided unless requested.
- `npm run lint` passes, or any unrelated failure is clearly reported.
- `npm run build` passes, or any unrelated failure is clearly reported.
- The final response lists changed files, checks run, and any warnings.
