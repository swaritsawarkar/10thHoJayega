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

import { PublicHeader } from "@/components/marketing/public-header";
import { Button } from "@/components/ui/button";
import {
  getHomeJsonLd,
  publicSeoPages,
  serializeJsonLd,
  siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "10thHoJayega: Class 10 CBSE Syllabus Tracker",
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
      <PublicHeader />

      <section className="mx-auto grid w-full max-w-7xl min-w-0 gap-10 px-3 py-10 sm:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-6 lg:py-14">
        <div className="flex min-w-0 flex-col gap-7">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-normal sm:text-5xl md:text-7xl">
              Class 10 CBSE syllabus tracker, without the chaos.
            </h1>
            <p className="max-w-2xl text-xl font-bold sm:text-2xl">
              10th ka syllabus. Sorted. Printed. Tracked. Ho jayega.
            </p>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A free Class 10 CBSE syllabus tracker built for students who need
              chapter progress, Hindi Course A/B, printable checklists, and
              official NCERT links in one place.
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              Progress saves after login.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-fit"
              render={<Link href="/login" />}
            >
              Start tracking
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-fit"
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

        <div className="min-w-0 rounded-lg border bg-card p-4 shadow-sm">
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
            {[
              "Maths",
              "Science",
              "Social Science",
              "English",
              "Hindi Course A / B",
            ].map((subject, index) => (
              <div
                key={subject}
                className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border bg-background p-3"
              >
                <div className="min-w-0">
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
            ))}
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

      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">
                Find the planner you need.
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Public study pages for Class 10 tracking, planning, NCERT
                checklists, Maths practice, and printable revision.
              </p>
            </div>
            <Button variant="outline" render={<Link href="/login" />}>
              Start tracking
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {publicSeoPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40"
              >
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  {page.keyword}
                </p>
                <h3 className="mt-3 text-xl font-black">{page.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
