import Link from "next/link";

import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";

const envBlock = `NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=`;

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 lg:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm text-muted-foreground">
              Setup guide
            </p>
            <h1 className="text-5xl font-black tracking-normal">
              Connect Supabase without overthinking it.
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Supabase stores users, profiles, syllabus data, progress, notes,
              and focus sessions. It also enforces Row Level Security so
              students only see their own private data.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">Steps</h2>
          <ol className="mt-4 flex list-decimal flex-col gap-4 pl-5">
            <li>Create a Supabase project at supabase.com.</li>
            <li>Open Project Settings, then API.</li>
            <li>Copy the project URL.</li>
            <li>Copy the anon public key.</li>
            <li>
              Create a file named <code>.env.local</code> in this project.
            </li>
            <li>Add the environment variables below.</li>
            <li>
              Run <code>supabase/schema.sql</code> in the Supabase SQL editor.
            </li>
            <li>
              Run <code>supabase/seed.sql</code> in the Supabase SQL editor.
            </li>
            <li>
              If you already had the app running before Hindi/French support,
              run <code>supabase/update-language-subject.sql</code> once.
            </li>
            <li>
              Run <code>supabase/update-homework-help.sql</code> once if you
              want the AI Homework Help daily limit.
            </li>
            <li>
              Create a free Gemini API key in Google AI Studio and add it as{" "}
              <code>GOOGLE_GENERATIVE_AI_API_KEY</code>.
            </li>
            <li>Restart the dev server.</li>
            <li>
              Go to <code>/login</code> and create an account.
            </li>
          </ol>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">.env.local</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Supabase values let the browser use the public anon key. The Gemini
            key is server-only because it does not start with{" "}
            <code>NEXT_PUBLIC_</code>. Never put a service role key in this app.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md border bg-muted p-4 text-sm">
            <code>{envBlock}</code>
          </pre>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">What the SQL does</h2>
          <p className="mt-2 text-muted-foreground">
            <code>schema.sql</code> creates the tables, RLS policies, profile
            trigger, and updated_at trigger. <code>seed.sql</code> adds sample
            Class 10 subjects, chapters, and Maths exercises so the UI can be
            tested. The seed is sample only and must be verified against
            official CBSE/NCERT curriculum before production.{" "}
            <code>update-homework-help.sql</code> adds usage counting for the AI
            helper without storing homework prompts or answers.
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/login" />}>Go to login</Button>
          <Button variant="outline" render={<Link href="/" />}>
            Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
