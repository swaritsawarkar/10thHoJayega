import type { User } from "@supabase/supabase-js";

import type { Chapter, Exercise, Subject, UserProfile } from "@/types/app";

export type LanguageSubject = "hindi" | "french";

export const LANGUAGE_SUBJECT_OPTIONS: Array<{
  value: LanguageSubject;
  label: string;
  description: string;
}> = [
  {
    value: "hindi",
    label: "Hindi",
    description: "Hindi course rows appear in your tracker and print pack.",
  },
  {
    value: "french",
    label: "French",
    description: "French course rows replace Hindi in your tracker.",
  },
];

const coreSubjectIds = new Set([
  "maths",
  "science",
  "social-science",
  "english",
]);

export function toLanguageSubject(value: unknown): LanguageSubject {
  return value === "french" ? "french" : "hindi";
}

export function getLanguageSubject(
  profile?: UserProfile | null,
  user?: User | null,
): LanguageSubject {
  return toLanguageSubject(
    profile?.language_subject ?? user?.user_metadata?.language_subject,
  );
}

export function getLanguageSubjectLabel(languageSubject: LanguageSubject) {
  return languageSubject === "french" ? "French" : "Hindi";
}

export function isSubjectVisibleForLanguage(
  subjectId: string,
  languageSubject: LanguageSubject,
) {
  return coreSubjectIds.has(subjectId) || subjectId === languageSubject;
}

export function filterSubjectsForLanguage(
  subjects: Subject[],
  languageSubject: LanguageSubject,
) {
  return subjects.filter((subject) =>
    isSubjectVisibleForLanguage(subject.id, languageSubject),
  );
}

export function filterChaptersForSubjects(
  chapters: Chapter[],
  subjects: Subject[],
) {
  const subjectIds = new Set(subjects.map((subject) => subject.id));
  return chapters.filter((chapter) => subjectIds.has(chapter.subject_id));
}

export function filterExercisesForChapters(
  exercises: Exercise[],
  chapters: Chapter[],
) {
  const chapterIds = new Set(chapters.map((chapter) => chapter.id));
  return exercises.filter((exercise) => chapterIds.has(exercise.chapter_id));
}
