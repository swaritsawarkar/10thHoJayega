"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  GaugeIcon,
  HomeIcon,
  LibraryIcon,
  MessageCircleQuestionIcon,
  PrinterIcon,
  SettingsIcon,
  TimerIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/app/brand-mark";
import { LogoutButton } from "@/components/app/logout-button";
import { ThemeToggle } from "@/components/app/theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/subjects", label: "Subjects", icon: BookOpenIcon },
  {
    href: "/homework-help",
    label: "Homework Help",
    icon: MessageCircleQuestionIcon,
  },
  { href: "/focus", label: "Focus", icon: TimerIcon },
  { href: "/textbooks", label: "Textbooks", icon: LibraryIcon },
  { href: "/print", label: "Print", icon: PrinterIcon },
  { href: "/printable-pack", label: "Printable Pack", icon: GaugeIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function Navbar({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between xl:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-3">
            <BrandMark className="size-9" />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-black">10thHoJayega</span>
              <span className="font-mono text-xs text-muted-foreground">
                Progress saves after login.
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <div className="hidden text-right text-xs text-muted-foreground sm:block">
              <p className="font-medium text-foreground">{displayName}</p>
              <p>{email}</p>
            </div>
            <ThemeToggle compact />
          </div>
        </div>

        <nav className="flex min-w-0 flex-wrap gap-1 xl:flex-1 xl:justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

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
