import type { Database } from "@/types/database";

export type Subject = Database["public"]["Tables"]["subjects"]["Row"];
export type Chapter = Database["public"]["Tables"]["chapters"]["Row"];
export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
export type UserProgress = Database["public"]["Tables"]["progress"]["Row"];
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type FocusSession =
  Database["public"]["Tables"]["focus_sessions"]["Row"];

export type ProgressStatus = 0 | 1 | 2 | 3 | 4;
export type ProgressItemType = "chapter" | "exercise";

export type ChapterWithExercises = Chapter & {
  exercises: Exercise[];
};

export type SubjectWithChapters = Subject & {
  chapters: ChapterWithExercises[];
};

export type StatusCounts = Record<ProgressStatus, number>;

export type ProgressSnapshot = {
  overallPercent: number;
  totalChapters: number;
  statusCounts: StatusCounts;
  subjectPercents: Array<{
    subjectId: string;
    subjectName: string;
    percent: number;
    total: number;
  }>;
};
