import type { Chapter, UserProgress } from "@/types/app";

export type StudyTarget = {
  id: string;
  user_id: string;
  title: string;
  chapter_id: string | null;
  due_date: string;
  reminder_at: string | null;
  completed: boolean;
  created_at: string;
};

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function revisionSummary(chapters: Chapter[], progress: UserProgress[]) {
  const statusById = new Map(
    progress
      .filter((row) => row.item_type === "chapter")
      .map((row) => [row.item_id, row.status]),
  );
  const studied = chapters.filter(
    (chapter) => (statusById.get(chapter.id) ?? 0) >= 1,
  );
  const revised = chapters.filter(
    (chapter) => (statusById.get(chapter.id) ?? 0) >= 2,
  );
  const confident = chapters.filter(
    (chapter) => (statusById.get(chapter.id) ?? 0) >= 3,
  );
  const needsPractice = chapters.filter((chapter) => {
    const status = statusById.get(chapter.id) ?? 0;
    return status === 1 || status === 2;
  });
  return { studied, revised, confident, needsPractice };
}
