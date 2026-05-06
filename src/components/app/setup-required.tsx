import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";

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
                Account setup is not ready yet.
              </h1>
              <p className="text-muted-foreground">
                The project owner still needs to finish private account and
                progress settings before students can log in.
              </p>
            </div>
          </div>

          <Alert>
            <AlertTitle>Setup items missing</AlertTitle>
            <AlertDescription>
              {missing.length} private setting
              {missing.length === 1 ? "" : "s"} need
              {missing.length === 1 ? "s" : ""} to be added before sign in can
              work.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-4 text-sm">
            <p className="font-semibold">What to do next</p>
            <p className="text-muted-foreground">
              Ask the project owner to finish setup, load the syllabus data, and
              restart the site.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button render={<Link href="/setup" />}>Open setup guide</Button>
            <Button variant="outline" render={<Link href="/" />}>
              Back home
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
