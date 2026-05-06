"use client";

import { lazy, Suspense } from "react";

import type { FocusTimerProps } from "@/components/app/focus-timer";

const FocusTimer = lazy(() =>
  import("@/components/app/focus-timer").then((module) => ({
    default: module.FocusTimer,
  })),
);

export function FocusTimerLoader(props: FocusTimerProps) {
  return (
    <Suspense
      fallback={<div className="h-[420px] rounded-lg border bg-card" />}
    >
      <FocusTimer {...props} />
    </Suspense>
  );
}
