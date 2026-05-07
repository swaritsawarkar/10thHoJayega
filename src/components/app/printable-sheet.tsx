import { ProgressBadge } from "@/components/app/progress-badge";
import { PrintButton } from "@/components/app/print-button";
import {
  getChapterGroups,
  getSubjectSupportNote,
} from "@/lib/chapter-sections";
import { getExercisesForChapter, getStatusForItem } from "@/lib/progress";
import type {
  Chapter,
  Exercise,
  ProgressSnapshot,
  Subject,
  UserProgress,
} from "@/types/app";

export function PrintableSheet({
  title,
  subtitle,
  userLabel,
  generatedDate,
  subjects,
  chapters,
  exercises,
  progress,
  snapshot,
  includeActions = true,
}: {
  title: string;
  subtitle: string;
  userLabel: string;
  generatedDate: string;
  subjects: Subject[];
  chapters: Chapter[];
  exercises: Exercise[];
  progress: UserProgress[];
  snapshot: ProgressSnapshot;
  includeActions?: boolean;
}) {
  const maths = subjects.find((subject) => subject.id === "maths");
  const mathsChapters = chapters.filter(
    (chapter) => chapter.subject_id === "maths",
  );

  return (
    <article className="print-sheet rounded-lg border bg-card p-6">
      {includeActions && (
        <div className="no-print mb-5 flex justify-end">
          <PrintButton />
        </div>
      )}

      <header className="print-cover flex flex-col gap-4 border-b pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-sm uppercase tracking-normal">
              10thHoJayega
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-normal sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>
            <p className="mt-2 text-sm">
              10th ka syllabus. Sorted. Printed. Tracked. Ho jayega.
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
          <SnapshotBox label="Total chapters" value={snapshot.totalChapters} />
          <SnapshotBox label="Not started" value={snapshot.statusCounts[0]} />
          <SnapshotBox label="In progress" value={snapshot.statusCounts[1]} />
          <SnapshotBox label="Revised once" value={snapshot.statusCounts[2]} />
          <SnapshotBox label="Board ready" value={snapshot.statusCounts[4]} />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {snapshot.subjectPercents.map((subject) => (
            <SnapshotBox
              key={subject.subjectId}
              label={subject.subjectName}
              value={`${subject.percent}%`}
            />
          ))}
        </div>
      </section>

      <section className="print-section print-page-break mt-8">
        <h2 className="text-2xl font-black">Full Syllabus Checklist</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manual checkbox stays empty on purpose. Print it, mark it, keep going.
        </p>

        <div className="mt-4 flex flex-col gap-6">
          {subjects.map((subject) => {
            const subjectChapters = chapters.filter(
              (chapter) => chapter.subject_id === subject.id,
            );
            const subjectGroups = getChapterGroups(subject.id, subjectChapters);
            const supportNote = getSubjectSupportNote(subject.id);

            return (
              <div key={subject.id} className="print-break-inside">
                <h3 className="mb-2 text-lg font-black">{subject.name}</h3>
                {supportNote && (
                  <p className="mb-2 text-xs text-muted-foreground">
                    {supportNote}
                  </p>
                )}
                <div className="flex flex-col gap-4">
                  {subjectGroups.map((group) => (
                    <div key={group.section?.id ?? subject.id}>
                      {group.section && (
                        <h4 className="mb-2 text-sm font-black">
                          {group.section.title}
                        </h4>
                      )}
                      <div className="overflow-x-auto">
                        <table className="print-table w-full text-left text-sm">
                          <thead>
                            <tr>
                              <th>Done</th>
                              <th>No.</th>
                              <th>Chapter</th>
                              <th>Current app status</th>
                              <th>Revision date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.chapters.map((chapter) => (
                              <tr key={chapter.id}>
                                <td>
                                  <span className="manual-box" />
                                </td>
                                <td>{chapter.chapter_number ?? "-"}</td>
                                <td>{chapter.title}</td>
                                <td>
                                  <ProgressBadge
                                    status={getStatusForItem(
                                      progress,
                                      "chapter",
                                      chapter.id,
                                    )}
                                  />
                                </td>
                                <td className="revision-cell" />
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {maths && (
        <section className="print-section print-page-break mt-8">
          <h2 className="text-2xl font-black">Maths Exercise Tracker</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Maths is where chapter progress lies. Exercise progress tells the
            truth.
          </p>

          <div className="mt-4 flex flex-col gap-6">
            {mathsChapters.map((chapter) => {
              const chapterExercises = getExercisesForChapter(
                exercises,
                chapter.id,
              );

              if (chapterExercises.length === 0) {
                return null;
              }

              return (
                <div key={chapter.id} className="print-break-inside">
                  <h3 className="mb-2 text-lg font-black">
                    {chapter.chapter_number}. {chapter.title}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="print-table w-full text-left text-sm">
                      <thead>
                        <tr>
                          <th>Done</th>
                          <th>Exercise</th>
                          <th>Current app status</th>
                          <th>Doubt?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chapterExercises.map((exercise) => (
                          <tr key={exercise.id}>
                            <td>
                              <span className="manual-box" />
                            </td>
                            <td>{exercise.title}</td>
                            <td>
                              <ProgressBadge
                                status={getStatusForItem(
                                  progress,
                                  "exercise",
                                  exercise.id,
                                )}
                              />
                            </td>
                            <td>
                              <span className="manual-box" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
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
