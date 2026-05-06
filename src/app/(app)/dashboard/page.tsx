import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  PrinterIcon,
  SchoolIcon,
  TimerIcon,
} from "lucide-react";

import { EmptyState } from "@/components/app/empty-state";
import { ProgressSummary } from "@/components/app/progress-summary";
import { SubjectCard } from "@/components/app/subject-card";
import { Button } from "@/components/ui/button";
import { getProfile, requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import {
  getLanguageSubject,
  getLanguageSubjectLabel,
} from "@/lib/language-subject";
import { calculateSnapshot, getDisplayName } from "@/lib/progress";

export default async function DashboardPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const languageSubjectLabel = getLanguageSubjectLabel(languageSubject);
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
          <div>
            <p className="font-mono text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-4xl font-black tracking-normal">
              Hey {getDisplayName(user.email, profile?.display_name)}.
            </h1>
            <p className="mt-2 text-muted-foreground">
              Kal se pakka? Track it today. Language subject:{" "}
              {languageSubjectLabel}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button render={<Link href={continueHref} />}>
              Continue last chapter
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
            <Button variant="outline" render={<Link href="/focus" />}>
              <TimerIcon data-icon="inline-start" aria-hidden="true" />
              Start focus mode
            </Button>
            <Button variant="outline" render={<Link href="/print" />}>
              <PrinterIcon data-icon="inline-start" aria-hidden="true" />
              Print today&apos;s planner
            </Button>
            <Button variant="outline" render={<Link href="/printable-pack" />}>
              <SchoolIcon data-icon="inline-start" aria-hidden="true" />
              Generate Printable Pack
            </Button>
          </div>
        </div>
      </section>

      {subjects.length === 0 ? (
        <EmptyState
          title="No subjects seeded yet"
          description="Run supabase/seed.sql after schema.sql. The app is ready; it just needs the sample syllabus rows."
          href="/setup"
          action="Open setup"
        />
      ) : (
        <>
          {!hasLanguageSubjectRows && (
            <section className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <h2 className="font-black">
                {languageSubjectLabel} rows are not seeded yet.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Run <code>supabase/update-language-subject.sql</code> in the
                Supabase SQL editor once. Then {languageSubjectLabel} will
                appear in this dashboard and print packs.
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
