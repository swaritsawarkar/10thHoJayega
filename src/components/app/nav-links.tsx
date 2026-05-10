"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  GaugeIcon,
  HomeIcon,
  LibraryIcon,
  MessageSquarePlusIcon,
  MessageCircleQuestionIcon,
  PrinterIcon,
  SettingsIcon,
  TimerIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

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
  { href: "/print", label: "Planner", icon: PrinterIcon },
  { href: "/printable-pack", label: "Printable Pack", icon: GaugeIcon },
  { href: "/feedback", label: "Feedback", icon: MessageSquarePlusIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex min-w-0 max-w-full gap-1 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 xl:flex-1 xl:justify-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-8",
              isActive &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
            <NavPendingHint />
          </Link>
        );
      })}
    </nav>
  );
}

function NavPendingHint() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-1.5 shrink-0 rounded-full bg-current opacity-0 transition-opacity",
        pending && "animate-pulse opacity-70",
      )}
    />
  );
}
