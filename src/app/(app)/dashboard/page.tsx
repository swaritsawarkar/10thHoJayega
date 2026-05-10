import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRightIcon,
  BookOpenIcon,
  PrinterIcon,
  SchoolIcon,
  TimerIcon,
} from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { LoadingState } from "@/components/app/loading-state";
import { ProgressSummary } from "@/components/app/progress-summary";
import { SubjectCard } from "@/components/app/subject-card";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import {
  getLanguageSubject,
  getLanguageSubjectLabel,
} from "@/lib/language-subject";
import { calculateSnapshot, getDisplayName } from "@/lib/progress";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState label="Opening dashboard" />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const user = await requireUser();
  const languageSubject = getLanguageSubject(null, user);
  const languageSubjectLabel = getLanguageSubjectLabel(languageSubject);
  const metadataDisplayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : null;
  const { subjects, chapters, progress } = await getAppData(
    user.id,
    languageSubject,
    { includeExercises: false },
  );
  const hasLanguageSubjectRows = subjects.some(
    (subject) => subject.id === languageSubject,
  );
  const snapshot = calculateSnapshot(subjects, chapters, progress);

  const latestChapterProgress = progress.find(
    (row) => row.item_type === "chapter",
  );
  const continueChapter =
    chapters.find((chapter) => chapter.id === latestChapterProgress?.item_id) ??
    chapters[0];
  const continueSubject = subjects.find(
    (subject) => subject.id === continueChapter?.subject_id,
  );
  const continueHref =
    continueChapter && continueSubject
      ? `/subjects/${continueSubject.id}/chapters/${continueChapter.id}`
      : "/subjects";

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
              Hey {getDisplayName(user.email, metadataDisplayName)}.
            </h1>
            <p className="mt-2 text-muted-foreground">
              Kal se pakka? Track it today. Language subject:{" "}
              {languageSubjectLabel}.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              className="w-full sm:w-fit"
              render={<Link href={continueHref} />}
            >
              Continue last chapter
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-fit"
              render={<Link href="/focus" />}
            >
              <TimerIcon data-icon="inline-start" aria-hidden="true" />
              Start focus mode
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-fit"
              render={<Link href="/print" />}
            >
              <PrinterIcon data-icon="inline-start" aria-hidden="true" />
              Print today&apos;s planner
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-fit"
              render={<Link href="/printable-pack" />}
            >
              <SchoolIcon data-icon="inline-start" aria-hidden="true" />
              Generate Printable Pack
            </Button>
          </div>
        </div>
      </section>

      {subjects.length === 0 ? (
        <EmptyState
          title="Syllabus data is not ready yet"
          description="Ask the project owner to load the Class 10 syllabus so your subjects can appear here."
          href="/setup"
          action="Open setup"
        />
      ) : (
        <>
          {!hasLanguageSubjectRows && (
            <section className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <h2 className="font-black">
                {languageSubjectLabel} is not ready yet.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask the project owner to load this language subject so it can
                appear in your dashboard and print packs.
              </p>
            </section>
          )}

          <ProgressSummary snapshot={snapshot} />

          <section>
            <div className="mb-4 flex items-center gap-2">
              <BookOpenIcon aria-hidden="true" />
              <h2 className="text-2xl font-black">Subjects</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  chapters={chapters}
                  progress={progress}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
