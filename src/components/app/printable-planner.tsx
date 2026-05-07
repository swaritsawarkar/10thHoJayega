import { ProgressBadge } from "@/components/app/progress-badge";
import { PrintButton } from "@/components/app/print-button";
import { getChapterSectionTitle } from "@/lib/chapter-sections";
import { getStatusForItem } from "@/lib/progress";
import type {
  Chapter,
  ProgressSnapshot,
  ProgressStatus,
  Subject,
  UserProgress,
} from "@/types/app";

const studyTargets: Record<ProgressStatus, string> = {
  0: "Start the chapter",
  1: "Finish notes and examples",
  2: "Practice weak questions",
  3: "Do one timed recap",
  4: "Keep it warm",
};

export function PrintablePlanner({
  userLabel,
  generatedDate,
  subjects,
  chapters,
  progress,
  snapshot,
}: {
  userLabel: string;
  generatedDate: string;
  subjects: Subject[];
  chapters: Chapter[];
  progress: UserProgress[];
  snapshot: ProgressSnapshot;
}) {
  const subjectsById = new Map(
    subjects.map((subject) => [subject.id, subject]),
  );
  const studyPicks = chapters
    .map((chapter) => ({
      chapter,
      status: getStatusForItem(progress, "chapter", chapter.id),
      subject: subjectsById.get(chapter.subject_id),
      sectionTitle: getChapterSectionTitle(chapter.subject_id, chapter.id),
    }))
    .filter((item) => item.status < 4)
    .slice(0, 12);

  return (
    <article className="print-sheet rounded-lg border bg-card p-6">
      <div className="no-print mb-5 flex justify-end">
        <PrintButton label="Print today's planner" />
      </div>

      <header className="print-cover flex flex-col gap-4 border-b pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-sm uppercase tracking-normal">
              10thHoJayega
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-normal sm:text-4xl">
              Today&apos;s Print Planner
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A focused paper plan for what to revise next, not the full
              syllabus pack.
            </p>
          </div>
          <div className="min-w-0 rounded-md border p-3 text-sm">
            <p>
              <strong>User:</strong> {userLabel}
            </p>
            <p>
              <strong>Generated:</strong> {generatedDate}
            </p>
          </div>
        </div>
      </header>

      <section className="print-section mt-6">
        <h2 className="text-2xl font-black">Progress Snapshot</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <SnapshotBox label="Overall" value={`${snapshot.overallPercent}%`} />
          <SnapshotBox label="Chapters" value={snapshot.totalChapters} />
          <SnapshotBox label="Not started" value={snapshot.statusCounts[0]} />
          <SnapshotBox label="Moving" value={snapshot.statusCounts[1]} />
          <SnapshotBox label="Revised" value={snapshot.statusCounts[2]} />
          <SnapshotBox label="Board ready" value={snapshot.statusCounts[4]} />
        </div>
      </section>

      <section className="print-section mt-8">
        <h2 className="text-2xl font-black">Today&apos;s Study Picks</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pulled from chapters that are not board ready yet.
        </p>

        {studyPicks.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="print-table w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Done</th>
                  <th>Subject</th>
                  <th>Chapter</th>
                  <th>Current app status</th>
                  <th>Study target</th>
                </tr>
              </thead>
              <tbody>
                {studyPicks.map(
                  ({ chapter, status, subject, sectionTitle }) => (
                    <tr key={chapter.id}>
                      <td>
                        <span className="manual-box" />
                      </td>
                      <td>
                        {subject?.name ?? chapter.subject_id}
                        {sectionTitle ? (
                          <span className="block text-xs text-muted-foreground">
                            {sectionTitle}
                          </span>
                        ) : null}
                      </td>
                      <td>
                        {chapter.chapter_number ?? "-"}. {chapter.title}
                      </td>
                      <td>
                        <ProgressBadge status={status} />
                      </td>
                      <td>{studyTargets[status]}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Everything is board ready. Use the focus blocks below for quick
            revision rounds.
          </p>
        )}
      </section>

      <section className="print-section mt-8">
        <h2 className="text-2xl font-black">Subject Progress</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="print-table w-full text-left text-sm">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Chapters</th>
                <th>Progress</th>
                <th>Today&apos;s note</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.subjectPercents.map((subject) => (
                <tr key={subject.subjectId}>
                  <td>{subject.subjectName}</td>
                  <td>{subject.total}</td>
                  <td>{subject.percent}%</td>
                  <td className="revision-cell" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="print-section mt-8">
        <h2 className="text-2xl font-black">Focus Blocks</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="print-table w-full text-left text-sm">
            <thead>
              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Task</th>
                <th>Done</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((block) => (
                <tr key={block}>
                  <td>Block {block}</td>
                  <td className="revision-cell" />
                  <td className="revision-cell" />
                  <td>
                    <span className="manual-box" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

function SnapshotBox({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
