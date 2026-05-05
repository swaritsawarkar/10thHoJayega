"use client";

import { LANGUAGE_SUBJECT_OPTIONS } from "@/lib/language-subject";
import { cn } from "@/lib/utils";
import type { LanguageSubject } from "@/lib/language-subject";

export function LanguageSubjectPicker({
  value,
  onChange,
  allowKeepSaved = false,
}: {
  value: LanguageSubject | "keep";
  onChange: (value: LanguageSubject | "keep") => void;
  allowKeepSaved?: boolean;
}) {
  const options = allowKeepSaved
    ? [
        {
          value: "keep" as const,
          label: "Keep saved",
          description:
            "Use the language subject already saved on this account.",
        },
        ...LANGUAGE_SUBJECT_OPTIONS,
      ]
    : LANGUAGE_SUBJECT_OPTIONS;

  return (
    <div className="grid gap-2 sm:grid-cols-3" role="radiogroup">
      {options.map((option) => {
        const checked = value === option.value;

        return (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-md border bg-background p-3 text-sm transition",
              checked
                ? "border-foreground bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={checked}
              onChange={() => onChange(option.value)}
            />
            <span className="font-bold">{option.label}</span>
            <span
              className={cn(
                "mt-1 block text-xs leading-snug",
                checked
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              {option.description}
            </span>
          </label>
        );
      })}
    </div>
  );
}
