import type {
  Chapter,
  Exercise,
  ProgressItemType,
  ProgressSnapshot,
  ProgressStatus,
  StatusCounts,
  Subject,
  UserProgress,
} from "@/types/app";

export const STATUS_LABELS: Record<ProgressStatus, string> = {
  0: "Not Started",
  1: "In Progress",
  2: "Revised Once",
  3: "Mastered",
  4: "Board Ready",
};

export const STATUS_SHORT_LABELS: Record<ProgressStatus, string> = {
  0: "Not started",
  1: "Moving",
  2: "Revised",
  3: "Mastered",
  4: "Board ready",
};

export const PROGRESS_STATUSES = [0, 1, 2, 3, 4] as const;

export function toProgressStatus(status: number | null | undefined) {
  if (status === 1 || status === 2 || status === 3 || status === 4) {
    return status;
  }

  return 0;
}

export function getNextStatus(status: ProgressStatus): ProgressStatus {
  return ((status + 1) % 5) as ProgressStatus;
}

export function getStatusForItem(
  progress: UserProgress[],
  itemType: ProgressItemType,
  itemId: string,
) {
  return toProgressStatus(
    progress.find((row) => row.item_type === itemType && row.item_id === itemId)
      ?.status,
  );
}

export function makeStatusCounts(): StatusCounts {
  return {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
}

export function calculatePercent(statuses: ProgressStatus[]) {
  if (statuses.length === 0) {
    return 0;
  }

  const score = statuses.reduce<number>((total, status) => total + status, 0);
  return Math.round((score / (statuses.length * 4)) * 100);
}

export function calculateSnapshot(
  subjects: Subject[],
  chapters: Chapter[],
  progress: UserProgress[],
): ProgressSnapshot {
  const chapterStatuses = chapters.map((chapter) =>
    getStatusForItem(progress, "chapter", chapter.id),
  );
  const statusCounts = makeStatusCounts();

  chapterStatuses.forEach((status) => {
    statusCounts[status] += 1;
  });

  const subjectPercents = subjects.map((subject) => {
    const subjectChapters = chapters.filter(
      (chapter) => chapter.subject_id === subject.id,
    );
    const statuses = subjectChapters.map((chapter) =>
      getStatusForItem(progress, "chapter", chapter.id),
    );

    return {
      subjectId: subject.id,
      subjectName: subject.name,
      percent: calculatePercent(statuses),
      total: subjectChapters.length,
    };
  });

  return {
    overallPercent: calculatePercent(chapterStatuses),
    totalChapters: chapters.length,
    statusCounts,
    subjectPercents,
  };
}

export function getExercisesForChapter(
  exercises: Exercise[],
  chapterId: string,
) {
  return exercises.filter((exercise) => exercise.chapter_id === chapterId);
}

export function getDisplayName(
  email: string | undefined,
  displayName?: string | null,
) {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  return email?.split("@")[0] || "student";
}
