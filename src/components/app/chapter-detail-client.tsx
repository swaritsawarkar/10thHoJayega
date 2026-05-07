"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { ExternalLinkIcon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getChapterSectionTitle } from "@/lib/chapter-sections";
import {
  getBrowserSupabase,
  notifyError,
  notifySuccess,
} from "@/lib/client-effects";
import type { Chapter, ProgressStatus, Subject } from "@/types/app";

const defaultRevisionChecklist = [
  "Read the NCERT chapter carefully.",
  "Mark examples or diagrams that usually cause silly mistakes.",
  "Attempt back exercise questions without checking answers first.",
  "Write one doubt or mistake to ask in school.",
  "Do one timed board-style recap before calling it board ready.",
];

type CustomRevisionItem = {
  id: string;
  text: string;
};

function readCustomRevisionItems(storageKey: string): CustomRevisionItem[] {
  let savedItems: string | null = null;

  try {
    savedItems = window.localStorage.getItem(storageKey);
  } catch {
    return [];
  }

  if (!savedItems) {
    return [];
  }

  try {
    const parsedItems: unknown = JSON.parse(savedItems);

    if (!Array.isArray(parsedItems)) {
      return [];
    }

    return parsedItems
      .filter(
        (item): item is CustomRevisionItem =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "text" in item &&
          typeof item.id === "string" &&
          typeof item.text === "string" &&
          item.text.trim().length > 0,
      )
      .map((item) => ({
        id: item.id,
        text: item.text.trim().slice(0, 120),
      }));
  } catch {
    return [];
  }
}

function getNextCustomRevisionItemId(
  chapterId: string,
  items: CustomRevisionItem[],
) {
  const nextIndex =
    items.reduce((highestIndex, item) => {
      const lastSegment = item.id.split(":").at(-1);
      const itemIndex = Number(lastSegment);

      return Number.isInteger(itemIndex) && itemIndex > highestIndex
        ? itemIndex
        : highestIndex;
    }, 0) + 1;

  return `custom:${chapterId}:${nextIndex}`;
}

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
  const [customRevisionItems, setCustomRevisionItems] = useState<
    CustomRevisionItem[]
  >([]);
  const [newRevisionItem, setNewRevisionItem] = useState("");
  const [isPending, startTransition] = useTransition();
  const chapterSectionTitle = getChapterSectionTitle(subject.id, chapter.id);
  const customChecklistStorageKey = `chapter-checklist:${chapter.id}`;
  const checklistItems = [
    ...defaultRevisionChecklist.map((item) => ({
      id: `default:${item}`,
      text: item,
      custom: false,
    })),
    ...customRevisionItems.map((item) => ({
      id: item.id,
      text: item.text,
      custom: true,
    })),
  ];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCustomRevisionItems(
        readCustomRevisionItems(customChecklistStorageKey),
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [customChecklistStorageKey]);

  function saveCustomRevisionItems(items: CustomRevisionItem[]) {
    try {
      window.localStorage.setItem(
        customChecklistStorageKey,
        JSON.stringify(items),
      );
    } catch {
      void notifyError("Custom checklist did not save on this device.");
    }
  }

  function toggleRevisionItem(itemId: string) {
    setCheckedRevisionItems((currentItems) =>
      currentItems.includes(itemId)
        ? currentItems.filter((currentItem) => currentItem !== itemId)
        : [...currentItems, itemId],
    );
  }

  function addCustomRevisionItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedItem = newRevisionItem.trim();

    if (!trimmedItem) {
      return;
    }

    if (
      checklistItems.some(
        (item) => item.text.toLowerCase() === trimmedItem.toLowerCase(),
      )
    ) {
      void notifyError("That checklist item is already there.");
      return;
    }

    const nextItems = [
      ...customRevisionItems,
      {
        id: getNextCustomRevisionItemId(chapter.id, customRevisionItems),
        text: trimmedItem.slice(0, 120),
      },
    ];

    setCustomRevisionItems(nextItems);
    saveCustomRevisionItems(nextItems);
    setNewRevisionItem("");
  }

  function removeCustomRevisionItem(itemId: string) {
    const nextItems = customRevisionItems.filter((item) => item.id !== itemId);

    setCustomRevisionItems(nextItems);
    saveCustomRevisionItems(nextItems);
    setCheckedRevisionItems((currentItems) =>
      currentItems.filter((currentItem) => currentItem !== itemId),
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
          <div className="flex min-w-0 flex-col gap-3">
            <p className="font-mono text-sm text-muted-foreground">
              {subject.name}
              {chapterSectionTitle ? ` / ${chapterSectionTitle}` : ""} / Chapter{" "}
              {chapter.chapter_number ?? "-"}
            </p>
            <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
              {chapter.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <ProgressBadge status={status} />
              <p className="text-sm text-muted-foreground">
                Current app status
              </p>
            </div>
          </div>

          <div className="no-print flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
                className="w-full sm:w-fit"
                render={
                  <a
                    href={chapter.official_textbook_url}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                Official source
                <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
              </Button>
            )}
            <PrintButton label="Print chapter checklist" />
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="min-w-0 rounded-lg border bg-card p-5">
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

        <div className="print-break-inside min-w-0 rounded-lg border bg-card p-5">
          <h2 className="text-xl font-black">Revision checklist</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tick items while you study. These ticks are for this page session
            and print cleanly.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {checklistItems.map((item) => (
              <li key={item.id} className="flex items-start gap-2">
                <label className="flex min-w-0 flex-1 cursor-pointer gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checkedRevisionItems.includes(item.id)}
                    onChange={() => toggleRevisionItem(item.id)}
                    className="mt-0.5 size-4 shrink-0 accent-foreground"
                  />
                  <span>{item.text}</span>
                </label>
                {item.custom && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="no-print -mt-1 shrink-0"
                    aria-label={`Remove ${item.text}`}
                    onClick={() => removeCustomRevisionItem(item.id)}
                  >
                    <Trash2Icon aria-hidden="true" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <form
            className="no-print mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={addCustomRevisionItem}
          >
            <Input
              value={newRevisionItem}
              onChange={(event) => setNewRevisionItem(event.target.value)}
              placeholder="Add your own checklist item"
              maxLength={120}
            />
            <Button type="submit" variant="outline" className="sm:w-fit">
              <PlusIcon data-icon="inline-start" aria-hidden="true" />
              Add
            </Button>
          </form>
          {checkedRevisionItems.length > 0 && (
            <p className="no-print mt-4 text-xs text-muted-foreground">
              {checkedRevisionItems.length}/{checklistItems.length} ticked.
              Notes and chapter status are saved. These checklist ticks reset on
              refresh.
            </p>
          )}
          <noscript>
            <ul className="mt-4 flex flex-col gap-3">
              {defaultRevisionChecklist.map((item) => (
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
