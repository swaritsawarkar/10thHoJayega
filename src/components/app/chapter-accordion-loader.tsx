"use client";

import { lazy, Suspense } from "react";

import type { ChapterAccordionProps } from "@/components/app/chapter-accordion";

const ChapterAccordion = lazy(() =>
  import("@/components/app/chapter-accordion").then((module) => ({
    default: module.ChapterAccordion,
  })),
);

export function ChapterAccordionLoader(props: ChapterAccordionProps) {
  return (
    <Suspense
      fallback={<div className="h-[320px] rounded-lg border bg-card" />}
    >
      <ChapterAccordion {...props} />
    </Suspense>
  );
}
