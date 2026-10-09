import { redirect } from "next/navigation";
import {
  ActivityIcon,
  BrainIcon,
  Clock3Icon,
  GaugeIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getAdminDashboard, isAdminUser } from "@/lib/admin";
import { requireUser } from "@/lib/auth";
import { getLanguageSubjectLabel } from "@/lib/language-subject";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(value: string | null, emptyLabel = "No activity") {
  if (!value) {
    return emptyLabel;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? emptyLabel : dateFormatter.format(date);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "No activity";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "No activity"
    : dateTimeFormatter.format(date);
}

export default async function AdminPage() {
  const user = await requireUser();
  if (!(await isAdminUser(user.id))) {
    redirect("/dashboard");
  }

  const { summary, students, activity } = await getAdminDashboard();
  const summaryCards = [
    {
      label: "Total users",
      value: summary.totalUsers,
      helper: "All registered students",
      icon: UsersIcon,
    },
    {
      label: "New this week",
      value: summary.newUsersLast7Days,
      helper: "Accounts created in 7 days",
      icon: UserCheckIcon,
    },
    {
      label: "Active this week",
      value: summary.activeUsersLast7Days,
      helper: "Progress, focus, or tutor use",
      icon: ActivityIcon,
    },
    {
      label: "Progress updates",
      value: summary.progressUpdatesLast7Days,
      helper: "Changes made in 7 days",
      icon: GaugeIcon,
    },
    {
      label: "Focus minutes",
      value: summary.focusMinutesLast7Days,
      helper: "Completed sessions in 7 days",
      icon: Clock3Icon,
    },
    {
      label: "Homework requests",
      value: summary.homeworkRequestsLast7Days,
      helper: "Tutor requests in 7 days",
      icon: BrainIcon,
    },
  ] as const;

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge>Owner dashboard</Badge>
            <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">
              App activity
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Usage across the last seven days, plus the newest 100 registered
              students.
            </p>
          </div>
          <p className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
            Private owner view
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-md border bg-background p-4"
              >
                <Icon className="size-5" aria-hidden="true" />
                <p className="mt-4 text-3xl font-black">{card.value}</p>
                <p className="mt-1 font-bold">{card.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {card.helper}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="text-2xl font-black">Students</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Email, language choice, join date, last activity, and total progress
            updates.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Language</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Last activity</th>
                <th className="px-5 py-3 text-right font-medium">Updates</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold">
                      {student.displayName?.trim() || "Unnamed student"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {student.email ?? "No email available"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {getLanguageSubjectLabel(student.languageSubject)}
                  </td>
                  <td className="px-5 py-4">{formatDate(student.createdAt)}</td>
                  <td className="px-5 py-4">
                    {formatDateTime(student.lastActivityAt)}
                  </td>
                  <td className="px-5 py-4 text-right font-mono">
                    {student.progressUpdates}
                  </td>
                </tr>
              ))}
              {students.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-muted-foreground"
                    colSpan={5}
                  >
                    No profiles yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="text-2xl font-black">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The latest 100 progress updates, focus sessions, and homework-help
            requests.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Activity</th>
                <th className="px-5 py-3 font-medium">Detail</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{entry.student}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.email ?? "No email available"}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-medium">{entry.kind}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {entry.detail || "—"}
                  </td>
                  <td className="px-5 py-4">
                    {formatDateTime(entry.occurredAt)}
                  </td>
                </tr>
              ))}
              {activity.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-muted-foreground"
                    colSpan={4}
                  >
                    No activity recorded yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
