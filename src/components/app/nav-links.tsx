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

export function NavLinks() {
  const pathname = usePathname();

  return (
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
  );
}
