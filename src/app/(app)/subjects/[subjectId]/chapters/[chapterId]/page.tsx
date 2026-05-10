import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterDetailClientLoader } from "@/components/app/chapter-detail-client-loader";
import { LoadingState } from "@/components/app/loading-state";
import { requireUser } from "@/lib/auth";
import { getChapterData } from "@/lib/db";
import {
  getLanguageSubject,
  isSubjectVisibleForLanguage,
} from "@/lib/language-subject";
import { toProgressStatus } from "@/lib/progress";

export default function ChapterPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState label="Opening chapter" />}>
      <ChapterContent params={params} />
    </Suspense>
  );
}

async function ChapterContent({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>;
}) {
  const { subjectId, chapterId } = await params;
  const user = await requireUser();
  const languageSubject = getLanguageSubject(null, user);
  const data = await getChapterData(user.id, chapterId, subjectId);

  if (
    !data?.chapter ||
    !data.subject ||
    data.subject.id !== subjectId ||
    data.chapter.subject_id !== subjectId ||
    !isSubjectVisibleForLanguage(data.subject.id, languageSubject)
  ) {
    notFound();
  }

  return (
    <ChapterDetailClientLoader
      userId={user.id}
      subject={data.subject}
      chapter={data.chapter}
      initialStatus={toProgressStatus(data.progress?.status)}
      initialNote={data.note?.content ?? ""}
    />
  );
}
