import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type AdminSummary = {
  totalUsers: number;
  newUsersLast7Days: number;
  activeUsersLast7Days: number;
  progressUpdatesLast7Days: number;
  focusMinutesLast7Days: number;
  homeworkRequestsLast7Days: number;
};

export type AdminStudent = {
  id: string;
  email: string | null;
  displayName: string | null;
  languageSubject: "hindi" | "hindi-course-b" | "french";
  createdAt: string;
  lastActivityAt: string | null;
  progressUpdates: number;
};

export type AdminDashboard = {
  summary: AdminSummary;
  students: AdminStudent[];
  activity: AdminActivity[];
};

export type AdminActivity = {
  id: string;
  student: string;
  email: string | null;
  kind: string;
  detail: string;
  occurredAt: string;
};

const emptySummary: AdminSummary = {
  totalUsers: 0,
  newUsersLast7Days: 0,
  activeUsersLast7Days: 0,
  progressUpdatesLast7Days: 0,
  focusMinutesLast7Days: 0,
  homeworkRequestsLast7Days: 0,
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function asLanguageSubject(value: unknown): AdminStudent["languageSubject"] {
  return value === "hindi-course-b" || value === "french" ? value : "hindi";
}

function parseDashboard(value: unknown): AdminDashboard {
  const root = asRecord(value);
  const rawSummary = asRecord(root?.summary);
  const rawStudents = Array.isArray(root?.students) ? root.students : [];
  const rawActivity = Array.isArray(root?.activity) ? root.activity : [];

  return {
    summary: {
      totalUsers: asNumber(rawSummary?.totalUsers),
      newUsersLast7Days: asNumber(rawSummary?.newUsersLast7Days),
      activeUsersLast7Days: asNumber(rawSummary?.activeUsersLast7Days),
      progressUpdatesLast7Days: asNumber(rawSummary?.progressUpdatesLast7Days),
      focusMinutesLast7Days: asNumber(rawSummary?.focusMinutesLast7Days),
      homeworkRequestsLast7Days: asNumber(
        rawSummary?.homeworkRequestsLast7Days,
      ),
    },
    students: rawStudents.flatMap((rawStudent) => {
      const student = asRecord(rawStudent);
      const id = asString(student?.id);
      const createdAt = asString(student?.createdAt);

      if (!id || !createdAt) {
        return [];
      }

      return [
        {
          id,
          email: asString(student?.email),
          displayName: asString(student?.displayName),
          languageSubject: asLanguageSubject(student?.languageSubject),
          createdAt,
          lastActivityAt: asString(student?.lastActivityAt),
          progressUpdates: asNumber(student?.progressUpdates),
        },
      ];
    }),
    activity: rawActivity.flatMap((rawActivityEntry) => {
      const activityEntry = asRecord(rawActivityEntry);
      const id = asString(activityEntry?.id);
      const occurredAt = asString(activityEntry?.occurredAt);

      if (!id || !occurredAt) {
        return [];
      }

      return [
        {
          id,
          student: asString(activityEntry?.student) ?? "Unnamed student",
          email: asString(activityEntry?.email),
          kind: asString(activityEntry?.kind) ?? "Activity",
          detail: asString(activityEntry?.detail) ?? "",
          occurredAt,
        },
      ];
    }),
  };
}

export const isAdminUser = cache(async (userId: string) => {
  const supabase = await createClient();
  if (!supabase) {
    return false;
  }

  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  return Boolean(data);
});

export const getAdminDashboard = cache(async (): Promise<AdminDashboard> => {
  const supabase = await createClient();
  if (!supabase) {
    return { summary: emptySummary, students: [], activity: [] };
  }

  const { data, error } = await supabase.rpc("get_admin_dashboard");
  if (error) {
    throw new Error("Could not load the admin dashboard.");
  }

  return parseDashboard(data);
});
