import { notFound } from "next/navigation";

import { ChapterDetailClient } from "@/components/app/chapter-detail-client";
import { getProfile, requireUser } from "@/lib/auth";
import { getChapterData } from "@/lib/db";
import {
  getLanguageSubject,
  isSubjectVisibleForLanguage,
} from "@/lib/language-subject";
import { toProgressStatus } from "@/lib/progress";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subjectId: string; chapterId: string }>;
}) {
  const { subjectId, chapterId } = await params;
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const data = await getChapterData(user.id, chapterId, subjectId);

  if (
    !data?.chapter ||
    !data.subject ||
    data.subject.id !== subjectId ||
    !isSubjectVisibleForLanguage(data.subject.id, languageSubject)
  ) {
    notFound();
  }

  return (
    <ChapterDetailClient
      userId={user.id}
      subject={data.subject}
      chapter={data.chapter}
      initialStatus={toProgressStatus(data.progress?.status)}
      initialNote={data.note?.content ?? ""}
    />
  );
}
