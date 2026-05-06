import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import {
  filterChaptersForSubjects,
  filterExercisesForChapters,
  filterSubjectsForLanguage,
  isSubjectVisibleForLanguage,
  type LanguageSubject,
} from "@/lib/language-subject";
import { getHomeworkHelpDayStartIso } from "@/lib/homework-help";
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

type AppDataOptions = {
  includeExercises?: boolean;
};

const subjectColumns = "id,name,description,sort_order";
const chapterColumns =
  "id,subject_id,title,chapter_number,official_textbook_url,sort_order";
const exerciseColumns = "id,chapter_id,title,sort_order";
const progressColumns = "id,user_id,item_type,item_id,status,updated_at";
const noteColumns = "id,user_id,chapter_id,content,updated_at";

function ensureResult<T>(
  result: { data: T | null; error: { message: string } | null },
  label: string,
): T {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }

  return result.data as T;
}

export const getUserProgress = cache(
  async (userId: string): Promise<UserProgress[]> => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Study data is not connected yet.");
    }

    const progressResult = await supabase
      .from("progress")
      .select(progressColumns)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    return ensureResult(
      progressResult,
      "Could not load progress",
    ) as UserProgress[];
  },
);

export const getHomeworkHelpUsageCount = cache(
  async (userId: string): Promise<number> => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Study data is not connected yet.");
    }

    const { count, error } = await supabase
      .from("homework_help_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", getHomeworkHelpDayStartIso());

    if (error) {
      throw new Error(`Could not load Homework Help usage: ${error.message}`);
    }

    return count ?? 0;
  },
);

export const getAppData = cache(
  async (
    userId: string,
    languageSubject?: LanguageSubject,
    options: AppDataOptions = {},
  ): Promise<AppData> => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Study data is not connected yet.");
    }

    const includeExercises = options.includeExercises ?? true;
    const [subjectsResult, chaptersResult, exercisesResult, progressResult] =
      await Promise.all([
        supabase.from("subjects").select(subjectColumns).order("sort_order"),
        supabase.from("chapters").select(chapterColumns).order("sort_order"),
        includeExercises
          ? supabase
              .from("exercises")
              .select(exerciseColumns)
              .order("sort_order")
          : Promise.resolve({ data: [], error: null }),
        supabase
          .from("progress")
          .select(progressColumns)
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
  },
);

export const getSubjectData = cache(
  async (
    userId: string,
    subjectId: string,
    languageSubject?: LanguageSubject,
  ) => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Study data is not connected yet.");
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

    const [subjectResult, chaptersResult, progressResult] = await Promise.all([
      supabase
        .from("subjects")
        .select(subjectColumns)
        .eq("id", subjectId)
        .maybeSingle(),
      supabase
        .from("chapters")
        .select(chapterColumns)
        .eq("subject_id", subjectId)
        .order("sort_order"),
      supabase
        .from("progress")
        .select(progressColumns)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
    ]);

    const subject = ensureResult(
      subjectResult,
      "Could not load subject",
    ) as Subject | null;
    const chapters = ensureResult(
      chaptersResult,
      "Could not load chapters",
    ) as Chapter[];

    let exercises: Exercise[] = [];
    if (subject?.id === "maths" && chapters.length > 0) {
      const exercisesResult = await supabase
        .from("exercises")
        .select(exerciseColumns)
        .in(
          "chapter_id",
          chapters.map((chapter) => chapter.id),
        )
        .order("sort_order");

      exercises = ensureResult(
        exercisesResult,
        "Could not load exercises",
      ) as Exercise[];
    }

    return {
      subject,
      chapters,
      exercises,
      progress: ensureResult(
        progressResult,
        "Could not load progress",
      ) as UserProgress[],
    };
  },
);

export const getChapterData = cache(
  async (userId: string, chapterId: string, subjectId: string) => {
    const supabase = await createClient();
    if (!supabase) {
      throw new Error("Study data is not connected yet.");
    }

    const [chapterResult, subjectResult, progressResult, noteResult] =
      await Promise.all([
        supabase
          .from("chapters")
          .select(chapterColumns)
          .eq("id", chapterId)
          .maybeSingle(),
        supabase
          .from("subjects")
          .select(subjectColumns)
          .eq("id", subjectId)
          .maybeSingle(),
        supabase
          .from("progress")
          .select(progressColumns)
          .eq("user_id", userId)
          .eq("item_type", "chapter")
          .eq("item_id", chapterId)
          .maybeSingle(),
        supabase
          .from("notes")
          .select(noteColumns)
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
  },
);
