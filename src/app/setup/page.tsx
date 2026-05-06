import Link from "next/link";
import type { Metadata } from "next";

import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Setup",
  description: "Setup checklist for getting 10thHoJayega ready.",
  alternates: {
    canonical: "/setup",
  },
  robots: {
    index: false,
    follow: false,
  },
};

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
              Finish the private setup checklist.
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              A few project-owner steps need to be completed before accounts,
              progress, syllabus data, and Homework Help are fully available.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">Steps</h2>
          <ol className="mt-4 flex list-decimal flex-col gap-4 pl-5">
            <li>Turn on account sign in and private progress saving.</li>
            <li>Load the Class 10 subjects, chapters, and exercises.</li>
            <li>Enable Hindi or French based on your school language.</li>
            <li>Turn on Homework Help if you want the tutor chat available.</li>
            <li>Restart the site after the private settings are in place.</li>
            <li>
              Go to <code>/login</code> and create an account.
            </li>
          </ol>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">Students should see this</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Once setup is complete, students should only see login, syllabus
            tracking, notes, print packs, and Homework Help. The app should feel
            like a study tool, not a control panel.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">Data check</h2>
          <p className="mt-2 text-muted-foreground">
            Before sharing the site, verify the syllabus against the official
            CBSE and NCERT curriculum. Sample rows are useful for testing, but
            the live checklist should match what students actually need to
            study.
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
