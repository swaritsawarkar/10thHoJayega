import Link from "next/link";
import { revisionSummary } from "@/lib/study-plan";
import { STATUS_LABELS, getStatusForItem } from "@/lib/progress";
import type { Chapter, UserProgress } from "@/types/app";

export function RevisionOverview({
  chapters,
  progress,
}: {
  chapters: Chapter[];
  progress: UserProgress[];
}) {
  const summary = revisionSummary(chapters, progress);
  const metrics = [
    ["Studied", summary.studied.length],
    ["Revised at least once", summary.revised.length],
    ["Confident / mastered", summary.confident.length],
  ] as const;
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="text-xl font-black">Revision check</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Counts use your saved chapter statuses. Studied includes all started
        chapters; confident means Mastered or Board Ready.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {metrics.map(([label, count]) => (
          <div key={label} className="rounded-md border p-3">
            <p className="text-2xl font-black">
              {count}/{chapters.length}
            </p>
            <p className="text-sm text-muted-foreground">
              {label} (
              {chapters.length
                ? Math.round((count / chapters.length) * 100)
                : 0}
              %)
            </p>
          </div>
        ))}
      </div>
      <h3 className="mt-5 font-bold">
        Needs more practice ({summary.needsPractice.length})
      </h3>
      {summary.needsPractice.length ? (
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {summary.needsPractice.slice(0, 8).map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/subjects/${chapter.subject_id}/chapters/${chapter.id}`}
                className="flex flex-col rounded-md border p-3 hover:bg-muted"
              >
                <span className="text-sm font-medium">{chapter.title}</span>
                <span className="text-xs text-muted-foreground">
                  {
                    STATUS_LABELS[
                      getStatusForItem(progress, "chapter", chapter.id)
                    ]
                  }
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          No started chapters waiting for mastery. Start a chapter in Subjects
          to track revision here.
        </p>
      )}
      <Link
        href="/subjects"
        className="mt-4 inline-block text-sm font-bold underline"
      >
        Update chapter statuses
      </Link>
    </section>
  );
}
