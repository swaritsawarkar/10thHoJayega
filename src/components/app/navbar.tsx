import Link from "next/link";

import { BrandMark } from "@/components/app/brand-mark";
import { LogoutButton } from "@/components/app/logout-button";
import { NavLinks } from "@/components/app/nav-links";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function Navbar({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  return (
    <header className="no-print sticky top-0 z-40 overflow-x-clip border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-4 xl:flex-row xl:items-center xl:justify-between xl:px-6">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Link
            href="/dashboard"
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <BrandMark className="size-10 shrink-0 sm:size-11" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-lg font-black">10thHoJayega</span>
              <span className="truncate font-mono text-xs text-muted-foreground">
                Progress saves after login.
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1 xl:hidden">
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              <p className="font-medium text-foreground">{displayName}</p>
              <p>{email}</p>
            </div>
            <ThemeToggle compact />
            <LogoutButton compact />
          </div>
        </div>

        <NavLinks />

        <div className="hidden items-center gap-3 xl:flex">
          <div className="max-w-40 text-right text-xs">
            <p className="truncate font-semibold">{displayName}</p>
            <p className="truncate text-muted-foreground">{email}</p>
          </div>
          <ThemeToggle compact />
          <LogoutButton compact />
        </div>
      </div>
    </header>
  );
}
