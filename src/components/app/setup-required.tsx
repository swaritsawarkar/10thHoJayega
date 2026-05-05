import Link from "next/link";
import { AlertCircleIcon, ExternalLinkIcon } from "lucide-react";

import { getMissingSupabaseEnvVars } from "@/lib/env";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function SetupRequired() {
  const missing = getMissingSupabaseEnvVars();

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <section className="w-full max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted">
              <AlertCircleIcon aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-mono text-sm uppercase tracking-normal text-muted-foreground">
                Setup required
              </p>
              <h1 className="text-3xl font-black tracking-normal">
                Supabase is not connected yet.
              </h1>
              <p className="text-muted-foreground">
                10thHoJayega uses Supabase for real auth and real progress. No
                fake login, no localStorage jugaad.
              </p>
            </div>
          </div>

          <Alert>
            <AlertTitle>Missing environment variables</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 flex flex-col gap-1 font-mono text-sm">
                {missing.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-4 text-sm">
            <p className="font-semibold">What to do next</p>
            <p className="text-muted-foreground">
              Create a Supabase project, copy the project URL and anon public
              key, add them to <code>.env.local</code>, run the SQL files, then
              restart the dev server.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/setup" />}>Open setup guide</Button>
            <Button
              render={
                <a
                  href="https://supabase.com/dashboard/projects"
                  target="_blank"
                  rel="noreferrer"
                />
              }
              variant="outline"
            >
              Supabase dashboard
              <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
