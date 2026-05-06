"use client";

import { useState, useTransition } from "react";
import { ExternalLinkIcon, SaveIcon } from "lucide-react";

import { PrintButton } from "@/components/app/print-button";
import { ProgressBadge } from "@/components/app/progress-badge";
import { ProgressCycleButton } from "@/components/app/progress-cycle-button";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  getBrowserSupabase,
  notifyError,
  notifySuccess,
} from "@/lib/client-effects";
import type { Chapter, ProgressStatus, Subject } from "@/types/app";

const revisionChecklist = [
  "Read the NCERT chapter carefully.",
  "Mark examples or diagrams that usually cause silly mistakes.",
  "Attempt back exercise questions without checking answers first.",
  "Write one doubt or mistake to ask in school.",
  "Do one timed board-style recap before calling it board ready.",
];

export type ChapterDetailClientProps = {
  userId: string;
  subject: Subject;
  chapter: Chapter;
  initialStatus: ProgressStatus;
  initialNote: string;
};

export function ChapterDetailClient({
  userId,
  subject,
  chapter,
  initialStatus,
  initialNote,
}: ChapterDetailClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState(initialNote);
  const [checkedRevisionItems, setCheckedRevisionItems] = useState<string[]>(
    [],
  );
  const [isPending, startTransition] = useTransition();

  function toggleRevisionItem(item: string) {
    setCheckedRevisionItems((currentItems) =>
      currentItems.includes(item)
        ? currentItems.filter((currentItem) => currentItem !== item)
        : [...currentItems, item],
    );
  }

  function saveNote() {
    startTransition(async () => {
      const supabase = await getBrowserSupabase();
      const { error } = await supabase.from("notes").upsert(
        {
          user_id: userId,
          chapter_id: chapter.id,
          content: note,
        },
        { onConflict: "user_id,chapter_id" },
      );

      if (error) {
        void notifyError("Notes did not save. Try again.");
        return;
      }

      void notifySuccess("Notes saved");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm text-muted-foreground">
              {subject.name} / Chapter {chapter.chapter_number ?? "-"}
            </p>
            <h1 className="text-4xl font-black tracking-normal">
              {chapter.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <ProgressBadge status={status} />
              <p className="text-sm text-muted-foreground">
                Current app status
              </p>
            </div>
          </div>

          <div className="no-print flex flex-wrap gap-2">
            <ProgressCycleButton
              userId={userId}
              itemType="chapter"
              itemId={chapter.id}
              initialStatus={status}
              size="default"
              onSaved={setStatus}
            />
            {chapter.official_textbook_url && (
              <Button
                variant="outline"
                render={
                  <a
                    href={chapter.official_textbook_url}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                Official textbook
                <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
              </Button>
            )}
            <PrintButton label="Print chapter checklist" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border bg-card p-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="chapterNote">
                Private chapter notes
              </FieldLabel>
              <FieldDescription>
                Saved privately to your account.
              </FieldDescription>
              <Textarea
                id="chapterNote"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Formula confusion? Dates? Diagram steps? Dump it here."
                className="min-h-56"
              />
            </Field>
            <Button type="button" disabled={isPending} onClick={saveNote}>
              <SaveIcon data-icon="inline-start" aria-hidden="true" />
              {isPending ? "Saving" : "Save notes"}
            </Button>
          </FieldGroup>
        </div>

        <div className="print-break-inside rounded-lg border bg-card p-5">
          <h2 className="text-xl font-black">Revision checklist</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tick items while you study. These ticks are for this page session
            and print cleanly.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {revisionChecklist.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checkedRevisionItems.includes(item)}
                    onChange={() => toggleRevisionItem(item)}
                    className="mt-0.5 size-4 shrink-0 accent-foreground"
                  />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
          {checkedRevisionItems.length > 0 && (
            <p className="no-print mt-4 text-xs text-muted-foreground">
              {checkedRevisionItems.length}/{revisionChecklist.length} ticked.
              Notes and chapter status are saved. These checklist ticks reset on
              refresh.
            </p>
          )}
          <noscript>
            <ul className="mt-4 flex flex-col gap-3">
              {revisionChecklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="mt-0.5 size-4 shrink-0 border border-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </noscript>
        </div>
      </section>
    </div>
  );
}
