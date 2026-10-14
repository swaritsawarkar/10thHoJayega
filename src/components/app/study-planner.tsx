"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserSupabase, notifySuccess } from "@/lib/client-effects";
import { localDateKey, type StudyTarget } from "@/lib/study-plan";
import type { Chapter } from "@/types/app";

export function StudyPlanner({
  userId,
  chapters,
  compact = false,
}: {
  userId: string;
  chapters: Chapter[];
  compact?: boolean;
}) {
  const [targets, setTargets] = useState<StudyTarget[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [month, setMonth] = useState("");
  const [title, setTitle] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const reminded = useRef(new Set<string>());
  const mutationPending = useRef(false);
  const loadVersion = useRef(0);
  const load = useCallback(async () => {
    if (mutationPending.current) return;
    const version = ++loadVersion.current;
    try {
      const supabase = await getBrowserSupabase();
      const rows: StudyTarget[] = [];
      for (let offset = 0; ; offset += 1000) {
        const { data, error } = await supabase
          .from("study_targets")
          .select("*")
          .eq("user_id", userId)
          .order("due_date")
          .order("id")
          .range(offset, offset + 999);
        if (error) throw error;
        rows.push(...(data ?? []));
        if ((data?.length ?? 0) < 1000) break;
      }
      if (version !== loadVersion.current) return;
      setTargets(rows);
      setError("");
    } catch {
      if (version === loadVersion.current)
        setError(
          "Could not sync your targets. Your saved targets have not been removed. Try again.",
        );
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const today = localDateKey();
      setSelectedDate(today);
      setMonth(today.slice(0, 7));
      void load();
    }, 0);
    window.addEventListener("focus", load);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("focus", load);
    };
  }, [load]);

  useEffect(() => {
    function checkReminders() {
      const due = targets.filter(
        (target) =>
          !target.completed &&
          target.reminder_at &&
          Date.parse(target.reminder_at) <= Date.now() &&
          target.due_date <= localDateKey(),
      );
      for (const target of due) {
        const key = `${target.id}:${target.reminder_at}`;
        if (reminded.current.has(key)) continue;
        reminded.current.add(key);
        setNotice(`Target reminder: ${target.title}`);
        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          try {
            new Notification("10thHoJayega: time to study", {
              body: target.title,
            });
          } catch {
            /* The in-app reminder remains available. */
          }
        }
      }
    }
    const firstCheck = window.setTimeout(checkReminders, 0);
    const interval = window.setInterval(checkReminders, 30000);
    return () => {
      window.clearTimeout(firstCheck);
      window.clearInterval(interval);
    };
  }, [targets]);

  async function addTarget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutationPending.current || loading || !title.trim() || !selectedDate)
      return;
    mutationPending.current = true;
    loadVersion.current += 1;
    setBusy(true);
    setError("");
    try {
      const supabase = await getBrowserSupabase();
      const reminder = reminderTime
        ? new Date(`${selectedDate}T${reminderTime}`).toISOString()
        : null;
      const { data, error } = await supabase
        .from("study_targets")
        .insert({
          user_id: userId,
          title: title.trim(),
          chapter_id: chapterId || null,
          due_date: selectedDate,
          reminder_at: reminder,
        })
        .select()
        .single();
      if (error || !data) throw error ?? new Error("Save not confirmed");
      setTargets((rows) => [...rows, data]);
      setTitle("");
      setReminderTime("");
      void notifySuccess("Target saved to your account");
    } catch {
      setError("Target did not save. Your text is still here. Try again.");
    } finally {
      mutationPending.current = false;
      setBusy(false);
    }
  }

  async function changeTarget(target: StudyTarget, remove = false) {
    if (mutationPending.current) return;
    mutationPending.current = true;
    loadVersion.current += 1;
    setBusy(true);
    setError("");
    try {
      const supabase = await getBrowserSupabase();
      const query = remove
        ? supabase
            .from("study_targets")
            .delete()
            .eq("id", target.id)
            .eq("user_id", userId)
            .select("id")
            .single()
        : supabase
            .from("study_targets")
            .update({ completed: !target.completed })
            .eq("id", target.id)
            .eq("user_id", userId)
            .select("id")
            .single();
      const { data, error } = await query;
      if (error || !data) throw error ?? new Error("Save not confirmed");
      setTargets((rows) =>
        remove
          ? rows.filter((row) => row.id !== target.id)
          : rows.map((row) =>
              row.id === target.id
                ? { ...row, completed: !row.completed }
                : row,
            ),
      );
    } catch {
      setError("Change did not save. Try again.");
    } finally {
      mutationPending.current = false;
      setBusy(false);
    }
  }

  const dayTargets = targets.filter(
    (target) => target.due_date === selectedDate,
  );
  const done = dayTargets.filter((target) => target.completed).length;
  const overdue = targets.filter(
    (target) => !target.completed && target.due_date < localDateKey(),
  );
  const monthDate = month ? new Date(`${month}-01T12:00:00`) : null;
  const daysInMonth = monthDate
    ? new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    : 0;
  function moveMonth(amount: number) {
    if (!monthDate) return;
    setMonth(
      localDateKey(
        new Date(monthDate.getFullYear(), monthDate.getMonth() + amount, 1),
      ).slice(0, 7),
    );
  }

  return (
    <section className="min-w-0 rounded-lg border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">
            {compact
              ? selectedDate && selectedDate !== localDateKey()
                ? `Targets for ${selectedDate}`
                : "Today's targets"
              : "Daily targets"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {done}/{dayTargets.length} done. Saved privately to your account.
          </p>
        </div>
        {compact && (
          <Link className="text-sm font-bold underline" href="/planner">
            Open calendar
          </Link>
        )}
      </div>
      {error && (
        <div role="alert" className="mt-3 text-sm text-destructive">
          {error}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => void load()}
          >
            Retry sync
          </button>
        </div>
      )}
      {notice && (
        <div role="status" className="mt-3 rounded-md border p-3 text-sm">
          {notice}{" "}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setNotice("")}
          >
            Dismiss
          </button>
        </div>
      )}
      {!compact && monthDate && (
        <div className="mt-5 max-w-lg">
          <div className="mb-2 flex items-center justify-between">
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Previous month"
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeftIcon />
            </Button>
            <h3 className="font-bold">
              {monthDate.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label="Next month"
              onClick={() => moveMonth(1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span
                key={day}
                className="text-center text-xs text-muted-foreground"
              >
                {day}
              </span>
            ))}
            {Array.from({ length: monthDate.getDay() }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, "0")}`;
              const rows = targets.filter((row) => row.due_date === date);
              const completed = rows.filter((row) => row.completed).length;
              return (
                <button
                  type="button"
                  key={date}
                  aria-pressed={date === selectedDate}
                  aria-label={`${date}: ${completed} of ${rows.length} targets done`}
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-12 rounded-md border p-1 text-sm ${date === selectedDate ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <span>{i + 1}</span>
                  <span className="block text-[10px]">
                    {rows.length ? `${completed}/${rows.length}` : "\u00a0"}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Each date shows completed / planned targets.
          </p>
        </div>
      )}
      <form onSubmit={addTarget} className="mt-4 grid gap-3">
        {!compact && (
          <label className="text-sm font-medium">
            Study date
            <Input
              type="date"
              required
              value={selectedDate}
              onChange={(event) => {
                setSelectedDate(event.target.value);
                if (event.target.value)
                  setMonth(event.target.value.slice(0, 7));
              }}
            />
          </label>
        )}
        <label className="text-sm font-medium">
          Target
          <Input
            required
            maxLength={200}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Revise Life Processes and do 5 questions"
          />
        </label>
        {!compact && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Chapter (optional)
              <select
                value={chapterId}
                onChange={(event) => setChapterId(event.target.value)}
                className="mt-1 h-9 w-full min-w-0 rounded-md border bg-background px-2"
              >
                <option value="">General target</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Remind me at (local time)
              <Input
                type="time"
                value={reminderTime}
                onChange={(event) => setReminderTime(event.target.value)}
              />
            </label>
          </div>
        )}
        <Button
          type="submit"
          disabled={busy || loading || !selectedDate}
          className="w-fit"
        >
          {busy ? "Saving..." : "Add target"}
        </Button>
      </form>
      {loading ? (
        <p role="status" className="mt-4 text-sm">
          Syncing targets...
        </p>
      ) : (
        <ul className="mt-4 grid gap-2">
          {dayTargets.length === 0 && (
            <li className="text-sm text-muted-foreground">
              No targets for this date. Keep the plan realistic.
            </li>
          )}
          {dayTargets.map((target) => (
            <li
              key={target.id}
              className="flex items-start gap-3 rounded-md border p-3"
            >
              <input
                type="checkbox"
                aria-label={`Complete ${target.title}`}
                checked={target.completed}
                disabled={busy}
                onChange={() => void changeTarget(target)}
                className="mt-1 size-4 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`break-words text-sm ${target.completed ? "line-through text-muted-foreground" : "font-medium"}`}
                >
                  {target.title}
                </p>
                {target.chapter_id &&
                  chapters.some(
                    (chapter) => chapter.id === target.chapter_id,
                  ) && (
                    <Link
                      className="text-xs underline"
                      href={`/subjects/${chapters.find((chapter) => chapter.id === target.chapter_id)?.subject_id}/chapters/${target.chapter_id}`}
                    >
                      Open chapter
                    </Link>
                  )}
                {target.reminder_at && (
                  <p className="text-xs text-muted-foreground">
                    Reminder:{" "}
                    {new Date(target.reminder_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={busy}
                aria-label={`Delete ${target.title}`}
                onClick={() => void changeTarget(target, true)}
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {overdue.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold">
            {overdue.length} overdue target{overdue.length === 1 ? "" : "s"}
          </h3>
          <ul className="mt-2 grid gap-1">
            {overdue.slice(0, 5).map((target) => (
              <li key={target.id} className="text-sm">
                <button
                  type="button"
                  className="text-left underline"
                  onClick={() => {
                    setSelectedDate(target.due_date);
                    setMonth(target.due_date.slice(0, 7));
                  }}
                >
                  {target.due_date}: {target.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!compact && (
        <div className="mt-5 border-t pt-4">
          <Button
            variant="outline"
            onClick={async () => {
              if (typeof Notification === "undefined") {
                setNotice(
                  "This browser does not support desktop notifications. In-app reminders still work.",
                );
                return;
              }
              try {
                const permission = await Notification.requestPermission();
                setNotice(
                  permission === "granted"
                    ? "Desktop reminders enabled while this page is open."
                    : "Desktop reminders are blocked. In-app reminders still work.",
                );
              } catch {
                setNotice(
                  "Could not enable desktop reminders. In-app reminders still work.",
                );
              }
            }}
          >
            <BellIcon /> Enable desktop reminders
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Reminders work while the planner or dashboard is open. Closing the
            site stops notifications. Missed targets appear as overdue next time
            you visit. Completing a target does not change your chapter status.
          </p>
        </div>
      )}
    </section>
  );
}
