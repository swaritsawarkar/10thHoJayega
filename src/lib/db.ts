import { createClient } from "@/lib/supabase/server";
import {
  filterChaptersForSubjects,
  filterExercisesForChapters,
  filterSubjectsForLanguage,
  isSubjectVisibleForLanguage,
  type LanguageSubject,
} from "@/lib/language-subject";
import type {
  Chapter,
  Exercise,
  Note,
  Subject,
  UserProgress,
} from "@/types/app";

type AppData = {
  subjects: Subject[];
  chapters: Chapter[];
  exercises: Exercise[];
  progress: UserProgress[];
};

function ensureResult<T>(
  result: { data: T | null; error: { message: string } | null },
  label: string,
): T {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  return result.data as T;
}

export async function getAppData(
  userId: string,
  languageSubject?: LanguageSubject,
): Promise<AppData> {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const [subjectsResult, chaptersResult, exercisesResult, progressResult] =
    await Promise.all([
      supabase.from("subjects").select("*").order("sort_order"),
      supabase.from("chapters").select("*").order("sort_order"),
      supabase.from("exercises").select("*").order("sort_order"),
      supabase
        .from("progress")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
    ]);

  const subjects = ensureResult(
    subjectsResult,
    "Could not load subjects",
  ) as Subject[];
  const chapters = ensureResult(
    chaptersResult,
    "Could not load chapters",
  ) as Chapter[];
  const exercises = ensureResult(
    exercisesResult,
    "Could not load exercises",
  ) as Exercise[];
  const visibleSubjects = languageSubject
    ? filterSubjectsForLanguage(subjects, languageSubject)
    : subjects;
  const visibleChapters = languageSubject
    ? filterChaptersForSubjects(chapters, visibleSubjects)
    : chapters;
  const visibleExercises = languageSubject
    ? filterExercisesForChapters(exercises, visibleChapters)
    : exercises;

  return {
    subjects: visibleSubjects,
    chapters: visibleChapters,
    exercises: visibleExercises,
    progress: ensureResult(
      progressResult,
      "Could not load progress",
    ) as UserProgress[],
  };
}

export async function getSubjectData(
  userId: string,
  subjectId: string,
  languageSubject?: LanguageSubject,
) {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  if (
    languageSubject &&
    !isSubjectVisibleForLanguage(subjectId, languageSubject)
  ) {
    return {
      subject: null,
      chapters: [],
      exercises: [],
      progress: [],
    };
  }

  const [subjectResult, chaptersResult, exercisesResult, progressResult] =
    await Promise.all([
      supabase.from("subjects").select("*").eq("id", subjectId).maybeSingle(),
      supabase
        .from("chapters")
        .select("*")
        .eq("subject_id", subjectId)
        .order("sort_order"),
      supabase.from("exercises").select("*").order("sort_order"),
      supabase.from("progress").select("*").eq("user_id", userId),
    ]);

  return {
    subject: ensureResult(
      subjectResult,
      "Could not load subject",
    ) as Subject | null,
    chapters: ensureResult(
      chaptersResult,
      "Could not load chapters",
    ) as Chapter[],
    exercises: ensureResult(
      exercisesResult,
      "Could not load exercises",
    ) as Exercise[],
    progress: ensureResult(
      progressResult,
      "Could not load progress",
    ) as UserProgress[],
  };
}

export async function getChapterData(userId: string, chapterId: string) {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const [chapterResult, progressResult, noteResult] = await Promise.all([
    supabase.from("chapters").select("*").eq("id", chapterId).maybeSingle(),
    supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId)
      .eq("item_type", "chapter")
      .eq("item_id", chapterId)
      .maybeSingle(),
    supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .maybeSingle(),
  ]);

  const chapter = ensureResult<Chapter | null>(
    chapterResult,
    "Could not load chapter",
  );

  if (!chapter) {
    return null;
  }

  const subjectResult = await supabase
    .from("subjects")
    .select("*")
    .eq("id", chapter.subject_id)
    .maybeSingle();

  return {
    chapter,
    subject: ensureResult<Subject | null>(
      subjectResult,
      "Could not load subject",
    ),
    progress: ensureResult<UserProgress | null>(
      progressResult,
      "Could not load progress",
    ),
    note: ensureResult<Note | null>(noteResult, "Could not load notes"),
  };
}
