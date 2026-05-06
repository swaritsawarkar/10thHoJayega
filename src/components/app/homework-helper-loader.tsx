"use client";

import { lazy, Suspense } from "react";

import type { HomeworkHelperProps } from "@/components/app/homework-helper";

const HomeworkHelper = lazy(() =>
  import("@/components/app/homework-helper").then((module) => ({
    default: module.HomeworkHelper,
  })),
);

export function HomeworkHelperLoader(props: HomeworkHelperProps) {
  return (
    <Suspense
      fallback={<div className="h-[560px] rounded-lg border bg-card" />}
    >
      <HomeworkHelper {...props} />
    </Suspense>
  );
}
