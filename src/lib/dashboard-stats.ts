import type { Chapter, FocusSession, Subject, UserProgress } from "@/types/app";
import { calculatePercent, getStatusForItem } from "@/lib/progress";

const STUDY_TIME_ZONE = "Asia/Kolkata";
const DAY_MS = 24 * 60 * 60 * 1000;

type ActivityTrendDay = {
  key: string;
  label: string;
  activityCount: number;
  focusMinutes: number;
  isToday: boolean;
};

export type DashboardGoal = {
  label: string;
  value: string;
  helper: string;
  percent: number;
};

export type DashboardStats = {
  todayKey: string;
  streakDays: number;
  activeToday: boolean;
  activeDaysThisWeek: number;
  trendDays: ActivityTrendDay[];
  todayFocusMinutes: number;
  todayProgressUpdates: number;
  todayChapterUpdates: number;
  totalFocusMinutes: number;
  latestActivityLabel: string;
  nextChapter: {
    title: string;
    subjectName: string;
    href: string;
  } | null;
  weakestSubject: {
    name: string;
    percent: number;
  } | null;
  goals: DashboardGoal[];
};

function getDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: STUDY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}

function getDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: STUDY_TIME_ZONE,
    day: "numeric",
    month: "short",
  }).format(date);
}

function getRecentDays(count: number, now = new Date()) {
  return Array.from({ length: count }, (_, index) => {
    const daysAgo = count - 1 - index;
    const date = new Date(now.getTime() - daysAgo * DAY_MS);

    return {
      date,
      key: getDateKey(date),
      label: getDayLabel(date),
    };
  });
}

function getLatestActivityLabel(
  progress: UserProgress[],
  focusSessions: FocusSession[],
) {
  const latestProgress = progress[0]?.updated_at
    ? new Date(progress[0].updated_at)
    : null;
  const latestFocus = focusSessions[0]?.created_at
    ? new Date(focusSessions[0].created_at)
    : null;
  const latest = [latestProgress, latestFocus]
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (!latest) {
    return "No study activity yet";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: STUDY_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(latest);
}

function getStreakDays(activeKeys: Set<string>, now = new Date()) {
  let streak = 0;

  for (let offset = 0; offset < 90; offset += 1) {
    const key = getDateKey(new Date(now.getTime() - offset * DAY_MS));
    if (!activeKeys.has(key)) {
      break;
    }

    streak += 1;
  }

  return streak;
}

function getNextChapter(
  subjects: Subject[],
  chapters: Chapter[],
  progress: UserProgress[],
) {
  const nextChapter = chapters.find(
    (chapter) => getStatusForItem(progress, "chapter", chapter.id) < 4,
  );
  const nextSubject = subjects.find(
    (subject) => subject.id === nextChapter?.subject_id,
  );

  if (!nextChapter || !nextSubject) {
    return null;
  }

  return {
    title: nextChapter.title,
    subjectName: nextSubject.name,
    href: `/subjects/${nextSubject.id}/chapters/${nextChapter.id}`,
  };
}

function getWeakestSubject(
  subjects: Subject[],
  chapters: Chapter[],
  progress: UserProgress[],
) {
  const rankedSubjects = subjects
    .map((subject) => {
      const subjectChapters = chapters.filter(
        (chapter) => chapter.subject_id === subject.id,
      );

      return {
        name: subject.name,
        total: subjectChapters.length,
        percent: calculatePercent(
          subjectChapters.map((chapter) =>
            getStatusForItem(progress, "chapter", chapter.id),
          ),
        ),
      };
    })
    .filter((subject) => subject.total > 0 && subject.percent < 100)
    .sort((a, b) => a.percent - b.percent);

  return rankedSubjects[0]
    ? {
        name: rankedSubjects[0].name,
        percent: rankedSubjects[0].percent,
      }
    : null;
}

function clampPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / max) * 100));
}

export function getRecentActivitySinceIso(days = 90) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

export function calculateDashboardStats({
  subjects,
  chapters,
  progress,
  focusSessions,
  now = new Date(),
}: {
  subjects: Subject[];
  chapters: Chapter[];
  progress: UserProgress[];
  focusSessions: FocusSession[];
  now?: Date;
}): DashboardStats {
  const todayKey = getDateKey(now);
  const activityCounts = new Map<string, number>();
  const focusMinutesByDay = new Map<string, number>();
  const activeKeys = new Set<string>();

  progress.forEach((row) => {
    const key = getDateKey(new Date(row.updated_at));
    activeKeys.add(key);
    activityCounts.set(key, (activityCounts.get(key) ?? 0) + 1);
  });

  focusSessions
    .filter((session) => session.completed)
    .forEach((session) => {
      const key = getDateKey(new Date(session.created_at));
      activeKeys.add(key);
      activityCounts.set(key, (activityCounts.get(key) ?? 0) + 1);
      focusMinutesByDay.set(
        key,
        (focusMinutesByDay.get(key) ?? 0) + session.duration_minutes,
      );
    });

  const trendDays = getRecentDays(14, now).map((day) => ({
    key: day.key,
    label: day.label,
    activityCount: activityCounts.get(day.key) ?? 0,
    focusMinutes: focusMinutesByDay.get(day.key) ?? 0,
    isToday: day.key === todayKey,
  }));
  const weekKeys = getRecentDays(7, now).map((day) => day.key);
  const todayProgressRows = progress.filter(
    (row) => getDateKey(new Date(row.updated_at)) === todayKey,
  );
  const todayFocusMinutes = focusMinutesByDay.get(todayKey) ?? 0;
  const todayChapterUpdates = todayProgressRows.filter(
    (row) => row.item_type === "chapter",
  ).length;
  const activeDaysThisWeek = weekKeys.filter((key) =>
    activeKeys.has(key),
  ).length;
  const nextChapter = getNextChapter(subjects, chapters, progress);
  const weakestSubject = getWeakestSubject(subjects, chapters, progress);

  return {
    todayKey,
    streakDays: getStreakDays(activeKeys, now),
    activeToday: activeKeys.has(todayKey),
    activeDaysThisWeek,
    trendDays,
    todayFocusMinutes,
    todayProgressUpdates: todayProgressRows.length,
    todayChapterUpdates,
    totalFocusMinutes: focusSessions
      .filter((session) => session.completed)
      .reduce((total, session) => total + session.duration_minutes, 0),
    latestActivityLabel: getLatestActivityLabel(progress, focusSessions),
    nextChapter,
    weakestSubject,
    goals: [
      {
        label: "Daily streak",
        value: activeKeys.has(todayKey) ? "Done" : "Not yet",
        helper: activeKeys.has(todayKey)
          ? "You touched the tracker today."
          : "Update progress or save one focus block.",
        percent: activeKeys.has(todayKey) ? 100 : 0,
      },
      {
        label: "Focus minutes",
        value: `${todayFocusMinutes}/25 min`,
        helper: "Save a completed focus session to fill this.",
        percent: clampPercent(todayFocusMinutes, 25),
      },
      {
        label: "Chapters moved",
        value: `${todayChapterUpdates}/2`,
        helper: "Move two chapter statuses today.",
        percent: clampPercent(todayChapterUpdates, 2),
      },
      {
        label: "Weekly rhythm",
        value: `${activeDaysThisWeek}/5 days`,
        helper: "Five active study days keeps the week alive.",
        percent: clampPercent(activeDaysThisWeek, 5),
      },
    ],
  };
}
