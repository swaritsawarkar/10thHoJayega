# Project Learnings: 10thHoJayega

This document explains what I built, what tools I used, what I learned, and how this project adds to my portfolio skillset.

## Project Idea

10thHoJayega is a Class 10 CBSE/NCERT syllabus tracker made for real student use. The goal was to help students track syllabus progress, Maths exercises, notes, focus sessions, official textbook links, and printable study packs from one account.

The core idea was simple: students should be able to track progress online, then print useful checklists when they cannot use a device.

## What I Built

- A production-ready Next.js web app with protected routes.
- Supabase email/password authentication.
- User profiles with display names and Hindi/French language subject preference.
- Subject and chapter progress tracking.
- Maths exercise-level progress tracking.
- Private per-chapter notes.
- Focus timer with saved completed sessions.
- Official NCERT/CBSE links page.
- Print-friendly planner pages.
- Printable Pack with syllabus checklist and Maths exercise tracker.
- Dark mode.
- AI Homework Help powered by Gemini through the Vercel AI SDK.
- Photo-based homework help where students can upload one question image and get step-by-step guidance.
- Supabase schema, seed files, RLS policies, and migration SQL.
- Vercel-ready deployment connected through GitHub.

## Tools And Technologies Used

- Next.js App Router for routing, layouts, protected pages, API routes, and server/client components.
- React and TypeScript for typed UI development.
- Tailwind CSS for styling.
- shadcn/ui and Base UI based components for accessible interface primitives.
- Lucide React for icons.
- Supabase Auth for real login/signup.
- Supabase Postgres for subjects, chapters, exercises, progress, notes, profiles, focus sessions, and AI usage counts.
- Supabase Row Level Security to protect user data.
- Supabase SSR helpers for server-side auth/session handling.
- Vercel AI SDK for streaming AI responses.
- Google Gemini for free-tier AI homework help and image understanding.
- Vercel for deployment.
- GitHub for version control and deployment source.
- ESLint and Prettier for code quality and formatting.
- CSS print styles for PDF-friendly printed pages.

## What I Learned

### Product Thinking

- How to turn a student problem into an actual app instead of a generic landing page.
- How to design around a real use case: limited device access and printable study material.
- How to avoid filler features and keep the Printable Pack focused.
- How to make product copy sound useful and student-friendly instead of corporate.

### Full-Stack Development

- How to build a real Next.js App Router project with protected routes.
- How to split work between Server Components and Client Components.
- How to use server-side helpers for auth and database access.
- How to build dynamic routes like subjects and chapter detail pages.
- How to create reusable components for cards, badges, buttons, accordions, timers, and printable views.

### Supabase And Database Design

- How to design relational tables for a real app.
- How to use tables for profiles, subjects, chapters, exercises, progress, notes, focus sessions, and AI usage.
- How to use unique constraints to prevent duplicate progress rows.
- How to use upsert for progress and notes.
- How to write seed SQL and migration SQL.
- How to use Row Level Security so users can only access their own private data.
- How to keep shared syllabus data readable while keeping user data private.

### Authentication And Security

- Why fake login is not enough for a serious app.
- How to use Supabase Auth instead of localStorage-only auth.
- How to protect routes from logged-out users.
- How to keep service role keys out of the frontend.
- How to use environment variables safely.
- Why `NEXT_PUBLIC_*` variables are public and should only contain public-safe values.
- How to keep the Gemini API key server-only.
- How to validate API request shape, message length, image type, image size, and unexpected fields.

### AI Integration

- How to add an AI feature without storing chat history.
- How to stream AI responses through a Next.js API route.
- How to use Gemini through the Vercel AI SDK.
- How to add a daily usage limit with Supabase instead of saving prompts.
- How to design a tutor prompt that teaches step by step instead of giving copy-paste answers.
- How to add image input so a student can upload a homework question photo.
- Why the app should not pretend to know exact NCERT questions unless the student provides the question text or image.

### Privacy And Legal Thinking

- Why the app should not re-host, scrape, bundle, or mirror NCERT textbooks.
- How to link to official NCERT resources instead of storing copyrighted PDFs.
- How to use student-provided images as temporary context for homework help.
- How to avoid saving photos or chat history when they are not needed.
- How to be honest about sample syllabus data and official verification.

### UI And UX

- How to design a student-focused dashboard instead of a generic edtech UI.
- How to make confusing status buttons clearer.
- How to add useful microcopy without making the app cringe.
- How to build dark mode.
- How to keep navigation compact and mobile responsive.
- How to create loading, empty, and error states.
- How to make print pages black-and-white friendly.
- How to design for both screen use and printed paper.

### Debugging And Performance

- How to debug environment variable issues.
- How to handle missing Supabase configuration with a setup screen instead of random crashes.
- How to fix runtime UI errors from component semantics.
- How to reduce navigation slowness by improving protected route/data loading behavior.
- How to use linting and production builds to catch issues before deployment.
- How to read error overlays and fix the source instead of patching symptoms.

### Deployment Workflow

- How GitHub and Vercel work together.
- How pushing to GitHub can trigger a Vercel production deployment.
- How to set environment variables in Vercel.
- How to verify deployment status.
- How to keep `.env.local` out of GitHub.
- How to document setup steps for someone else to run the project.

## Skills I Can Add To My Portfolio

- Full-stack web app development with Next.js, TypeScript, and Supabase.
- Authentication and protected route implementation.
- PostgreSQL schema design and Row Level Security.
- AI product integration using Vercel AI SDK and Gemini.
- Multimodal AI input using image upload.
- Privacy-first AI feature design.
- Print-friendly web UI and CSS print media.
- Responsive dashboard UI design.
- Environment variable and deployment management.
- GitHub-based deployment workflow with Vercel.
- Debugging production build, runtime, and API issues.
- Writing clear technical documentation.

## Portfolio Description

10thHoJayega is a full-stack Class 10 syllabus tracker built with Next.js, Supabase, and Gemini. It supports real authentication, progress tracking, Maths exercise tracking, private notes, focus sessions, official NCERT links, printable study packs, dark mode, and AI homework help with photo upload. The project focuses on practical student workflows, privacy, legal textbook handling, and production-ready deployment through GitHub and Vercel.

## Good Interview Talking Points

- I designed the database with RLS so users cannot access each other's notes or progress.
- I avoided fake login and used real Supabase Auth from the beginning.
- I separated public syllabus data from private user data.
- I handled missing environment variables with setup screens instead of crashes.
- I avoided re-hosting NCERT content and used official links only.
- I added AI help in a privacy-first way: no saved chat history and no saved homework photos.
- I used a usage table for AI limits without storing user prompts or responses.
- I built print-friendly pages because the target users may need offline checklists.
- I shipped through GitHub and Vercel, then verified build/deployment status.

## Future Improvements

- Admin-only syllabus editor.
- Verified official syllabus import workflow.
- Better search and filters for chapters/exercises.
- More detailed subject analytics.
- Optional saved AI explanations if the user explicitly chooses to save them.
- Better mobile camera flow for homework photos.
- Direct server-side PDF generation if needed later.
