"use client";

import { useEffect, useState, type FormEvent } from "react";

const storageKey = "10thhojayega-public-checklist";

type Chapter = { id: number; name: string; done: boolean };

const starterChapters: Chapter[] = [
  { id: 1, name: "Maths — add the exercise you are working on", done: false },
  { id: 2, name: "Science — add your next chapter", done: false },
  { id: 3, name: "Social Science — add a chapter to revise", done: false },
];

export function PublicChapterChecklist() {
  const [chapters, setChapters] = useState<Chapter[]>(starterChapters);
  const [newChapter, setNewChapter] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (
            Array.isArray(parsed) &&
            parsed.every(
              (item) =>
                typeof item?.id === "number" &&
                typeof item?.name === "string" &&
                typeof item?.done === "boolean",
            )
          ) {
            setChapters(parsed.slice(0, 30));
          }
        }
      } catch {
        // The checklist still works if browser storage is unavailable.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(chapters));
    } catch {
      // Keep the in-page checklist usable without persistent storage.
    }
  }, [chapters, loaded]);

  function addChapter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newChapter.trim();
    if (!name || chapters.length >= 30) return;
    setChapters((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((item) => item.id)) + 1,
        name: name.slice(0, 100),
        done: false,
      },
    ]);
    setNewChapter("");
  }

  const completed = chapters.filter((chapter) => chapter.done).length;

  return (
    <section id="try-checklist" className="border-t bg-muted/20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1fr] lg:px-6">
        <div>
          <p className="font-mono text-xs uppercase text-muted-foreground">
            Try it without an account
          </p>
          <h2 className="mt-2 text-3xl font-black">
            Make your own Class 10 chapter checklist
          </h2>
          <p className="mt-3 text-muted-foreground">
            Replace the examples with chapters you actually need to study. Add
            a chapter, tick it when done, and come back to see what is left.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            This quick checklist saves in this browser. The full tracker adds
            subject views, revision status, Maths exercises, and account sync.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black">Your chapters</h3>
            <p className="text-sm font-semibold" aria-live="polite">
              {completed} of {chapters.length} done
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="flex items-center gap-3 border p-3">
                <input
                  type="checkbox"
                  checked={chapter.done}
                  onChange={() =>
                    setChapters((current) =>
                      current.map((item) =>
                        item.id === chapter.id
                          ? { ...item, done: !item.done }
                          : item,
                      ),
                    )
                  }
                  aria-label={`Completed: ${chapter.name}`}
                  className="size-5 shrink-0 accent-primary"
                />
                <span className={chapter.done ? "line-through opacity-60" : ""}>
                  {chapter.name}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${chapter.name}`}
                  onClick={() =>
                    setChapters((current) =>
                      current.filter((item) => item.id !== chapter.id),
                    )
                  }
                  className="ml-auto shrink-0 rounded px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addChapter} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="public-chapter" className="sr-only">
              Chapter or exercise to track
            </label>
            <input
              id="public-chapter"
              value={newChapter}
              onChange={(event) => setNewChapter(event.target.value)}
              maxLength={100}
              placeholder="Add a chapter or exercise"
              className="min-w-0 flex-1 rounded-md border bg-background px-3 py-2"
            />
            <button
              type="submit"
              disabled={chapters.length >= 30}
              className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-50"
            >
              Add chapter
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
