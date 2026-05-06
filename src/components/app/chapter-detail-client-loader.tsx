"use client";

import { lazy, Suspense } from "react";

import type { ChapterDetailClientProps } from "@/components/app/chapter-detail-client";

const ChapterDetailClient = lazy(() =>
  import("@/components/app/chapter-detail-client").then((module) => ({
    default: module.ChapterDetailClient,
  })),
);

export function ChapterDetailClientLoader(props: ChapterDetailClientProps) {
  return (
    <Suspense
      fallback={<div className="h-[380px] rounded-lg border bg-card" />}
    >
      <ChapterDetailClient {...props} />
    </Suspense>
  );
}
