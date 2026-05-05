"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  applyTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToThemeChanges,
} from "@/lib/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const isDark = theme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = `Switch to ${nextTheme} mode`;

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "icon" : "default"}
      title={label}
      aria-label={label}
      onClick={() => applyTheme(nextTheme)}
    >
      {isDark ? (
        <SunIcon data-icon={compact ? undefined : "inline-start"} aria-hidden />
      ) : (
        <MoonIcon
          data-icon={compact ? undefined : "inline-start"}
          aria-hidden
        />
      )}
      {!compact && (isDark ? "Light mode" : "Dark mode")}
    </Button>
  );
}
