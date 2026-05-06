import { notFound } from "next/navigation";

import { ChapterAccordionLoader } from "@/components/app/chapter-accordion-loader";
import { ProgressSummary } from "@/components/app/progress-summary";
import { getProfile, requireUser } from "@/lib/auth";
import { getSubjectData } from "@/lib/db";
import { getLanguageSubject } from "@/lib/language-subject";
import { calculateSnapshot } from "@/lib/progress";
import { getSubjectDescription } from "@/lib/subject-copy";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const subjectData = await getSubjectData(user.id, subjectId, languageSubject);

  if (!subjectData.subject) {
    notFound();
  }

  const snapshot = calculateSnapshot(
    [subjectData.subject],
    subjectData.chapters,
    subjectData.progress,
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <p className="font-mono text-sm text-muted-foreground">Subject</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal">
          {subjectData.subject.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {getSubjectDescription(subjectData.subject)}
        </p>
      </section>

      <ProgressSummary snapshot={snapshot} compact />

      <ChapterAccordionLoader
        userId={user.id}
        subject={subjectData.subject}
        chapters={subjectData.chapters}
        exercises={subjectData.exercises}
        progress={subjectData.progress}
      />
    </div>
  );
}
