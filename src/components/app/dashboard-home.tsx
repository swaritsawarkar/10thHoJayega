import Link from "next/link";
import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  BrainIcon,
  CalendarDaysIcon,
  FlameIcon,
  GraduationCapIcon,
  LibraryIcon,
  MessageCircleQuestionIcon,
  PrinterIcon,
  TargetIcon,
  TimerIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats } from "@/lib/dashboard-stats";
import type { ProgressSnapshot } from "@/types/app";

const quickActions = [
  {
    href: "/focus",
    label: "Focus",
    icon: TimerIcon,
    helper: "Start a block",
  },
  {
    href: "/subjects",
    label: "Subjects",
    icon: BookOpenCheckIcon,
    helper: "Move progress",
  },
  {
    href: "/homework-help",
    label: "AI Tutor",
    icon: BrainIcon,
    helper: "Ask a doubt",
  },
  {
    href: "/print",
    label: "Planner",
    icon: CalendarDaysIcon,
    helper: "Print today",
  },
  {
    href: "/printable-pack",
    label: "Pack",
    icon: PrinterIcon,
    helper: "Full checklist",
  },
  {
    href: "/textbooks",
    label: "Books",
    icon: LibraryIcon,
    helper: "NCERT links",
  },
] as const;

function getTrendHeight(activityCount: number, maxActivityCount: number) {
  if (maxActivityCount <= 0 || activityCount <= 0) {
    return 8;
  }

  return Math.max(18, Math.round((activityCount / maxActivityCount) * 96));
}

export function DashboardHome({
  displayName,
  languageSubjectLabel,
  snapshot,
  stats,
}: {
  displayName: string;
  languageSubjectLabel: string;
  snapshot: ProgressSnapshot;
  stats: DashboardStats;
}) {
  const maxActivityCount = Math.max(
    1,
    ...stats.trendDays.map((day) => day.activityCount),
  );
  const completedSubjects = snapshot.subjectPercents.filter(
    (subject) => subject.percent === 100,
  ).length;
  const weeklyProgress = Math.min(
    100,
    Math.round((stats.activeDaysThisWeek / 5) * 100),
  );
  const weekDays = stats.trendDays.slice(-7);

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="grid min-h-72 gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:p-6">
            <div className="flex min-w-0 flex-col justify-between gap-7">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={stats.activeToday ? "default" : "outline"}>
                    {stats.activeToday ? "Streak alive" : "Streak waiting"}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    Language: {languageSubjectLabel}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-black leading-none tracking-normal sm:text-5xl">
                  Hey {displayName}. Keep the chain moving.
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  Today counts when you update progress or save a completed
                  focus session.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border bg-muted/30 p-4">
                  <FlameIcon className="size-5" aria-hidden="true" />
                  <p className="mt-3 text-4xl font-black">{stats.streakDays}</p>
                  <p className="text-sm text-muted-foreground">day streak</p>
                </div>
                <div className="rounded-md border bg-muted/30 p-4">
                  <TimerIcon className="size-5" aria-hidden="true" />
                  <p className="mt-3 text-4xl font-black">
                    {stats.todayFocusMinutes}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    focus min today
                  </p>
                </div>
                <div className="rounded-md border bg-muted/30 p-4">
                  <TrophyIcon className="size-5" aria-hidden="true" />
                  <p className="mt-3 text-4xl font-black">
                    {snapshot.overallPercent}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    syllabus score
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border bg-[linear-gradient(145deg,var(--background),var(--muted))] p-4">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent))]" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase text-muted-foreground">
                    Weekly rhythm
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hit 5 active days to keep the week spicy.
                  </p>
                </div>
                <Badge variant={stats.activeToday ? "default" : "outline"}>
                  {stats.activeToday ? "Today done" : "Today open"}
                </Badge>
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div
                  className="grid size-24 shrink-0 place-items-center rounded-full border"
                  style={{
                    background: `conic-gradient(var(--primary) ${weeklyProgress}%, var(--muted) 0)`,
                  }}
                >
                  <div className="grid size-18 place-items-center rounded-full border bg-card text-center">
                    <span className="text-3xl font-black leading-none">
                      {stats.activeDaysThisWeek}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      /5 days
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-black">
                    {stats.activeDaysThisWeek >= 5
                      ? "Weekly goal locked."
                      : `${Math.max(0, 5 - stats.activeDaysThisWeek)} more active day${5 - stats.activeDaysThisWeek === 1 ? "" : "s"}`}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Activity = progress update or saved focus session.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-7 gap-1.5">
                {weekDays.map((day) => (
                  <div
                    key={day.key}
                    className="flex flex-col items-center gap-2 rounded-md border bg-card/70 p-1.5"
                    title={`${day.label}: ${day.activityCount} activities`}
                  >
                    <span
                      className={`grid size-7 place-items-center rounded-sm text-xs font-black ${
                        day.activityCount > 0
                          ? "bg-primary text-primary-foreground"
                          : day.isToday
                            ? "border border-primary text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {day.activityCount > 0 ? "ON" : day.isToday ? "!" : ""}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {day.isToday ? "Now" : day.label.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-md border bg-background/70 p-2 text-xs text-muted-foreground">
                Last activity: {stats.latestActivityLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  Quick actions
                </p>
                <h2 className="mt-1 text-2xl font-black">Jump back in</h2>
              </div>
              <MessageCircleQuestionIcon
                className="size-5"
                aria-hidden="true"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="min-h-24 rounded-md border bg-background p-3 transition-colors hover:bg-muted"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    <p className="mt-3 font-bold">{action.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.helper}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2">
              <TargetIcon className="size-5" aria-hidden="true" />
              <h2 className="text-2xl font-black">Next target</h2>
            </div>
            {stats.nextChapter ? (
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stats.nextChapter.subjectName}
                  </p>
                  <p className="mt-1 text-xl font-black">
                    {stats.nextChapter.title}
                  </p>
                </div>
                <Button
                  className="w-full"
                  render={<Link href={stats.nextChapter.href} />}
                >
                  Open chapter
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <div className="mt-4 rounded-md border bg-muted/30 p-4">
                <p className="font-bold">Everything looks board-ready.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep revising so it stays that way.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)]">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="size-5" aria-hidden="true" />
                <h2 className="text-2xl font-black">14-day trend</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Activity from progress updates and saved focus sessions.
              </p>
            </div>
            <Badge variant="outline">
              {stats.totalFocusMinutes} focus min saved
            </Badge>
          </div>
          <div className="mt-6 flex h-40 items-end gap-2 overflow-hidden border-b border-l px-2 pb-2">
            {stats.trendDays.map((day) => (
              <div
                key={day.key}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div
                  className={`w-full rounded-t-sm ${
                    day.activityCount > 0 ? "bg-primary" : "bg-muted"
                  }`}
                  style={{
                    height: `${getTrendHeight(day.activityCount, maxActivityCount)}px`,
                  }}
                  title={`${day.label}: ${day.activityCount} activities, ${day.focusMinutes} focus minutes`}
                />
                <span className="w-full truncate text-center font-mono text-[10px] text-muted-foreground">
                  {day.isToday ? "Now" : day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="size-5" aria-hidden="true" />
            <h2 className="text-2xl font-black">Goals</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {stats.goals.map((goal) => (
              <div
                key={goal.label}
                className="rounded-md border bg-background p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{goal.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {goal.helper}
                    </p>
                  </div>
                  <span className="font-mono text-sm">{goal.value}</span>
                </div>
                <Progress className="mt-3" value={goal.percent} />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-md border bg-muted/30 p-3">
            <p className="text-sm font-bold">
              {stats.weakestSubject
                ? `Weakest subject: ${stats.weakestSubject.name}`
                : "No weak subject right now"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.weakestSubject
                ? `${stats.weakestSubject.percent}% complete. Give it the next clean study block.`
                : `${completedSubjects} subject${completedSubjects === 1 ? "" : "s"} fully complete.`}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
