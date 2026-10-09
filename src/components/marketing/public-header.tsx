import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BrandLogo } from "@/components/app/brand-mark";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { publicNavigation, siteConfig } from "@/lib/seo";

export function PublicHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-4 lg:px-6">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <BrandLogo className="h-12 w-[220px] max-w-[45vw]" />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <nav
          aria-label="Public study tools"
          className="hidden min-w-0 items-center gap-1 xl:flex"
        >
          {publicNavigation.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
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
  );
}
