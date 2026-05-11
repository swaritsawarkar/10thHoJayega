import { Suspense } from "react";
import { BookOpenIcon } from "lucide-react";

import { DashboardHome } from "@/components/app/dashboard-home";
import { EmptyState } from "@/components/app/empty-state";
import { LoadingState } from "@/components/app/loading-state";
import { ProgressSummary } from "@/components/app/progress-summary";
import { SubjectCard } from "@/components/app/subject-card";
import { requireUser } from "@/lib/auth";
import {
  calculateDashboardStats,
  getRecentActivitySinceIso,
} from "@/lib/dashboard-stats";
import { getAppData, getRecentFocusSessions } from "@/lib/db";
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
  const displayName = getDisplayName(user.email, metadataDisplayName);
  const recentSinceIso = getRecentActivitySinceIso();
  const [appData, focusSessions] = await Promise.all([
    getAppData(user.id, languageSubject, { includeExercises: false }),
    getRecentFocusSessions(user.id, recentSinceIso),
  ]);
  const { subjects, chapters, progress } = appData;
  const hasLanguageSubjectRows = subjects.some(
    (subject) => subject.id === languageSubject,
  );
  const snapshot = calculateSnapshot(subjects, chapters, progress);
  const dashboardStats = calculateDashboardStats({
    subjects,
    chapters,
    progress,
    focusSessions,
  });

  return (
    <div className="flex flex-col gap-6">
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

          <DashboardHome
            displayName={displayName}
            languageSubjectLabel={languageSubjectLabel}
            snapshot={snapshot}
            stats={dashboardStats}
          />

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
