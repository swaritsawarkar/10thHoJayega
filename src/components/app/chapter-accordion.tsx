"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenIcon, DumbbellIcon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProgressBadge } from "@/components/app/progress-badge";
import { ProgressCycleButton } from "@/components/app/progress-cycle-button";
import {
  getChapterGroups,
  getSubjectSupportNote,
} from "@/lib/chapter-sections";
import { getExercisesForChapter, getStatusForItem } from "@/lib/progress";
import type {
  Chapter,
  Exercise,
  ProgressItemType,
  ProgressStatus,
  Subject,
  UserProgress,
} from "@/types/app";

export type ChapterAccordionProps = {
  userId: string;
  subject: Subject;
  chapters: Chapter[];
  exercises: Exercise[];
  progress: UserProgress[];
};

export function ChapterAccordion({
  userId,
  subject,
  chapters,
  exercises,
  progress,
}: ChapterAccordionProps) {
  const isMaths = subject.id === "maths";
  const [progressRows, setProgressRows] = useState(progress);
  const chapterGroups = getChapterGroups(subject.id, chapters);
  const supportNote = getSubjectSupportNote(subject.id);

  function updateLocalProgress(
    itemType: ProgressItemType,
    itemId: string,
    status: ProgressStatus,
  ) {
    setProgressRows((currentRows) => {
      const existing = currentRows.find(
        (row) => row.item_type === itemType && row.item_id === itemId,
      );

      if (existing) {
        return currentRows.map((row) =>
          row.id === existing.id
            ? { ...row, status, updated_at: new Date().toISOString() }
            : row,
        );
      }

      return [
        ...currentRows,
        {
          id: `optimistic-${itemType}-${itemId}`,
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
          status,
          updated_at: new Date().toISOString(),
        },
      ];
    });
  }

  function renderChapterItem(chapter: Chapter) {
    const status = getStatusForItem(progressRows, "chapter", chapter.id);
    const chapterExercises = getExercisesForChapter(exercises, chapter.id);

    return (
      <AccordionItem key={chapter.id} value={chapter.id}>
        <AccordionTrigger className="gap-3 py-4 hover:no-underline">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted font-mono text-sm font-bold">
                {chapter.chapter_number ?? "-"}
              </span>
              <div className="min-w-0 text-left">
                <p className="truncate text-base font-bold">{chapter.title}</p>
                <p className="text-xs text-muted-foreground">
                  Kal se pakka? Track it today.
                </p>
              </div>
            </div>
            <ProgressBadge status={status} />
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 pb-5">
          <div className="flex flex-col gap-3 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Chapter status</p>
              <p className="text-sm text-muted-foreground">
                The button shows the next action. Every click saves the new
                status.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ProgressCycleButton
                userId={userId}
                itemType="chapter"
                itemId={chapter.id}
                initialStatus={status}
                onSaved={(nextStatus) =>
                  updateLocalProgress("chapter", chapter.id, nextStatus)
                }
              />
              <Button
                variant="outline"
                render={
                  <Link
                    href={`/subjects/${subject.id}/chapters/${chapter.id}`}
                  />
                }
              >
                <BookOpenIcon data-icon="inline-start" aria-hidden="true" />
                Details
              </Button>
            </div>
          </div>

          {isMaths && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <DumbbellIcon aria-hidden="true" />
                <p className="font-semibold">Maths exercise tracker</p>
              </div>
              {chapterExercises.length === 0 ? (
                <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                  No exercises loaded for this chapter yet.
                </p>
              ) : (
                <div className="grid gap-2 md:grid-cols-2">
                  {chapterExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between gap-3 rounded-md border bg-muted/20 p-3"
                    >
                      <div>
                        <p className="font-medium">{exercise.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Exercise has its own progress status.
                        </p>
                      </div>
                      <ProgressCycleButton
                        userId={userId}
                        itemType="exercise"
                        itemId={exercise.id}
                        initialStatus={getStatusForItem(
                          progressRows,
                          "exercise",
                          exercise.id,
                        )}
                        showHint={false}
                        onSaved={(nextStatus) =>
                          updateLocalProgress(
                            "exercise",
                            exercise.id,
                            nextStatus,
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {supportNote && (
        <Alert>
          <InfoIcon aria-hidden="true" />
          <AlertDescription>{supportNote}</AlertDescription>
        </Alert>
      )}

      {chapterGroups.map((group) => (
        <section key={group.section?.id ?? subject.id}>
          {group.section && (
            <div className="mb-2 flex flex-col gap-1">
              <h2 className="text-xl font-black tracking-normal">
                {group.section.title}
              </h2>
              {group.section.description && (
                <p className="text-sm text-muted-foreground">
                  {group.section.description}
                </p>
              )}
            </div>
          )}
          <Accordion className="rounded-lg border bg-card px-3">
            {group.chapters.map(renderChapterItem)}
          </Accordion>
        </section>
      ))}
    </div>
  );
}
