import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  CheckCircle2Icon,
  FileTextIcon,
  GraduationCapIcon,
  LibraryIcon,
  ListChecksIcon,
  PrinterIcon,
  TimerIcon,
} from "lucide-react";

import { BrandMark } from "@/components/app/brand-mark";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { getHomeJsonLd, serializeJsonLd, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Class 10 Syllabus Tracker",
  description: siteConfig.description,
};

const features = [
  {
    title: "Syllabus tracker",
    copy: "Not started, in progress, revised, mastered, board-ready.",
    icon: BookOpenCheckIcon,
  },
  {
    title: "Maths exercise tracker",
    copy: "Because chapter done and exercise done are not the same thing.",
    icon: ListChecksIcon,
  },
  {
    title: "Focus mode",
    copy: "Pomodoro: study, break, repeat. Not fake-study for 5 hours.",
    icon: TimerIcon,
  },
  {
    title: "Official NCERT links",
    copy: "NCERT links only. No shady PDF jugaad.",
    icon: LibraryIcon,
  },
  {
    title: "Printable planner",
    copy: "Clean A4 checklists with status and revision date columns.",
    icon: PrinterIcon,
  },
  {
    title: "Printable Pack PDF",
    copy: "Save as PDF, print it, and keep the checklist beside your books.",
    icon: FileTextIcon,
  },
];

export default function Home() {
  const jsonLd = getHomeJsonLd();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark />
            <span>
              <span className="block text-lg font-black">10thHoJayega</span>
              <span className="block font-mono text-xs text-muted-foreground">
                10th ka syllabus. Sorted.
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button render={<Link href="/login" />}>
              Start tracking
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1fr_0.9fr] lg:px-6 lg:py-20">
        <div className="flex flex-col justify-center gap-7">
          <div className="flex flex-col gap-4">
            <BrandMark className="size-18" />
            <h1 className="max-w-4xl text-5xl font-black leading-none tracking-normal md:text-7xl">
              10thHoJayega
            </h1>
            <p className="max-w-2xl text-2xl font-bold">
              10th ka syllabus. Sorted. Printed. Tracked. Ho jayega.
            </p>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A Class 10 syllabus tracker built for students who need progress
              tracking, printable checklists, and official NCERT links in one
              place.
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              Progress saves after login.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/login" />}>
              Start tracking
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/printable-pack" />}
            >
              Generate printable pack
              <PrinterIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="font-semibold">Printable stuff, clean and simple.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate a personalized syllabus checklist from your account,
              print it, and mark progress by hand whenever you want.
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
            <div>
              <p className="font-mono text-xs text-muted-foreground">
                Dashboard preview
              </p>
              <p className="text-xl font-black">
                Kal se pakka? Track it today.
              </p>
            </div>
            <GraduationCapIcon aria-hidden="true" />
          </div>
          <div className="grid gap-3">
            {["Maths", "Science", "Social Science", "English", "Hindi"].map(
              (subject, index) => (
                <div
                  key={subject}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border bg-background p-3"
                >
                  <div>
                    <p className="font-bold">{subject}</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${20 + index * 13}%` }}
                      />
                    </div>
                  </div>
                  <span className="rounded-md border px-2 py-1 font-mono text-xs">
                    {20 + index * 13}%
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Continue chapter",
              "Focus mode",
              "Print planner",
              "Printable pack",
            ].map((action) => (
              <div key={action} className="rounded-md border bg-muted/30 p-3">
                <CheckCircle2Icon aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <h2 className="text-3xl font-black">
            Built for actual Class 10 chaos.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-lg border bg-card p-4"
                >
                  <Icon aria-hidden="true" />
                  <h3 className="mt-3 text-xl font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.copy}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
