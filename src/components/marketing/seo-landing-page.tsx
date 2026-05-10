import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  HomeIcon,
  PrinterIcon,
  SearchIcon,
} from "lucide-react";

import { BrandMark } from "@/components/app/brand-mark";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  getSeoLandingPageJsonLd,
  publicSeoPages,
  serializeJsonLd,
  siteConfig,
  type SeoLandingPage,
} from "@/lib/seo";

function TrackerPreview({ page }: { page: SeoLandingPage }) {
  return (
    <div className="border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            {page.previewTitle}
          </p>
          <p className="mt-1 text-xl font-black">10thHoJayega preview</p>
        </div>
        <ClipboardListIcon aria-hidden="true" className="size-6 shrink-0" />
      </div>
      <div className="mt-4 grid gap-3">
        {page.previewRows.map((row, index) => {
          const progress = 22 + index * 14;

          return (
            <div
              key={row}
              className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border bg-background p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-bold">{row}</p>
                <div className="mt-2 h-2 overflow-hidden bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <span className="border px-2 py-1 font-mono text-xs">
                {progress}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {["Track", "Revise", "Print"].map((action) => (
          <div key={action} className="border bg-muted/30 p-3">
            <CheckCircle2Icon aria-hidden="true" className="size-4" />
            <p className="mt-2 text-sm font-semibold">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeoLandingPage({ page }: { page: SeoLandingPage }) {
  const jsonLd = getSeoLandingPageJsonLd(page);
  const relatedPages = publicSeoPages.filter((item) => item.slug !== page.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-4 sm:px-4 lg:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandMark className="shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-lg font-black">
                {siteConfig.name}
              </span>
              <span className="block truncate font-mono text-xs text-muted-foreground">
                Class 10 study tracker
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <Button
              render={<Link href="/login" />}
              aria-label="Start tracking"
              className="hidden sm:inline-flex"
            >
              Start tracking
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-3 py-12 sm:px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] lg:px-6 lg:py-18">
        <div className="flex min-w-0 flex-col justify-center gap-7">
          <div className="flex flex-col gap-4">
            <div className="flex w-fit items-center gap-2 border px-3 py-2 font-mono text-xs uppercase text-muted-foreground">
              <SearchIcon aria-hidden="true" className="size-4" />
              {page.eyebrow}
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-none tracking-normal sm:text-5xl md:text-6xl">
              {page.h1}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {page.intro}
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
              render={<Link href="/" />}
            >
              <HomeIcon data-icon="inline-start" aria-hidden="true" />
              View homepage
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {page.highlights.map((highlight) => (
              <article key={highlight} className="border bg-muted/20 p-4">
                <BookOpenCheckIcon aria-hidden="true" className="size-5" />
                <p className="mt-3 text-sm font-semibold">{highlight}</p>
              </article>
            ))}
          </div>
        </div>

        <TrackerPreview page={page} />
      </section>

      <section className="border-y bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1fr] lg:px-6">
          <div>
            <PrinterIcon aria-hidden="true" className="size-7" />
            <h2 className="mt-3 text-3xl font-black">
              Built for Class 10 planning, not generic productivity.
            </h2>
            <p className="mt-3 text-muted-foreground">
              The app keeps study progress, revision, focus tools, NCERT links,
              and printable checklists in one student-friendly place.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {page.faqs.map((faq) => (
              <article key={faq.question} className="border bg-card p-4">
                <h3 className="font-black">{faq.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Explore more study tools</h2>
            <p className="mt-2 text-muted-foreground">
              More ways to organize Class 10 study work before you log in.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/login" />}>
            Start free
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {relatedPages.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <p className="font-black">{item.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
