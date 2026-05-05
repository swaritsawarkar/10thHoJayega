"use client";

import { useState } from "react";
import { FileCheck2Icon, PrinterIcon } from "lucide-react";

import { PrintableSheet } from "@/components/app/printable-sheet";
import { Button } from "@/components/ui/button";
import type {
  Chapter,
  Exercise,
  ProgressSnapshot,
  Subject,
  UserProgress,
} from "@/types/app";

export function PrintablePack({
  userLabel,
  generatedDate,
  subjects,
  chapters,
  exercises,
  progress,
  snapshot,
}: {
  userLabel: string;
  generatedDate: string;
  subjects: Subject[];
  chapters: Chapter[];
  exercises: Exercise[];
  progress: UserProgress[];
  snapshot: ProgressSnapshot;
}) {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <section className="no-print rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-normal">
              Printable Pack
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A personalized printable checklist built from your current
              syllabus progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setGenerated(true)}>
              <FileCheck2Icon data-icon="inline-start" aria-hidden="true" />
              Generate my Printable Pack
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!generated}
              onClick={() => window.print()}
            >
              <PrinterIcon data-icon="inline-start" aria-hidden="true" />
              Print / Save as PDF
            </Button>
          </div>
        </div>
      </section>

      {generated ? (
        <PrintableSheet
          title="Printable Pack"
          subtitle="Only the full syllabus checklist and Maths exercise tracker. No filler pages."
          userLabel={userLabel}
          generatedDate={generatedDate}
          subjects={subjects}
          chapters={chapters}
          exercises={exercises}
          progress={progress}
          snapshot={snapshot}
          includeActions={false}
        />
      ) : (
        <section className="rounded-lg border border-dashed bg-card p-8 text-center">
          <h2 className="text-2xl font-black">Ready when you are.</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Click generate to build the pack from your current Supabase
            progress. Save as PDF from the browser print dialog.
          </p>
        </section>
      )}
    </div>
  );
}
