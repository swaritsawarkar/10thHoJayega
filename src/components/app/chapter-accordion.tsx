"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenIcon, DumbbellIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProgressBadge } from "@/components/app/progress-badge";
import { ProgressCycleButton } from "@/components/app/progress-cycle-button";
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

  return (
    <Accordion className="rounded-lg border bg-card px-3">
      {chapters.map((chapter) => {
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
                    <p className="truncate text-base font-bold">
                      {chapter.title}
                    </p>
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
                      No exercises loaded yet for this sample chapter.
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
      })}
    </Accordion>
  );
}
