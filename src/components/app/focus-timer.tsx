"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { PauseIcon, PlayIcon, RotateCcwIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

const modes = [
  { id: "25/5 classic", label: "25/5 classic", duration: 25, break: 5 },
  { id: "50/10 deep work", label: "50/10 deep work", duration: 50, break: 10 },
  { id: "15/5 low energy", label: "15/5 low energy", duration: 15, break: 5 },
  { id: "custom", label: "Custom", duration: 25, break: 5 },
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function FocusTimer({ userId }: { userId: string }) {
  const [modeId, setModeId] = useState(modes[0].id);
  const [customDuration, setCustomDuration] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [goal, setGoal] = useState("");
  const [reflection, setReflection] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedMode = modes.find((mode) => mode.id === modeId) ?? modes[0];
  const duration = modeId === "custom" ? customDuration : selectedMode.duration;
  const breakMinutes = modeId === "custom" ? customBreak : selectedMode.break;
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setIsRunning(false);
          setCompleted(true);
          toast.success("Focus block complete. Reflection time.");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const progressPercent = useMemo(() => {
    const total = Math.max(1, duration) * 60;
    return Math.round(((total - secondsLeft) / total) * 100);
  }, [duration, secondsLeft]);

  function resetTimer() {
    setIsRunning(false);
    setCompleted(false);
    setSecondsLeft(Math.max(1, duration) * 60);
  }

  function saveSession() {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.from("focus_sessions").insert({
        user_id: userId,
        mode: selectedMode.label,
        duration_minutes: Math.max(1, duration),
        break_minutes: Math.max(1, breakMinutes),
        goal,
        reflection,
        completed: true,
      });

      if (error) {
        toast.error("Focus session did not save.");
        return;
      }

      toast.success("Focus session saved");
      setReflection("");
      setGoal("");
      resetTimer();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-4xl font-black tracking-normal">Focus mode</h1>
            <p className="mt-2 text-muted-foreground">
              Pomodoro means studying in focused blocks with breaks, instead of
              fake-studying for 5 hours.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`rounded-md border p-3 text-left text-sm transition ${
                  modeId === mode.id
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
                onClick={() => {
                  setModeId(mode.id);
                  setIsRunning(false);
                  setCompleted(false);
                  setSecondsLeft(Math.max(1, mode.duration) * 60);
                }}
              >
                <span className="font-bold">{mode.label}</span>
              </button>
            ))}
          </div>

          {modeId === "custom" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="duration">Study minutes</FieldLabel>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={180}
                  value={customDuration}
                  onChange={(event) => {
                    const nextDuration = Number(event.target.value);
                    setCustomDuration(nextDuration);
                    if (!isRunning) {
                      setCompleted(false);
                      setSecondsLeft(Math.max(1, nextDuration) * 60);
                    }
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="break">Break minutes</FieldLabel>
                <Input
                  id="break"
                  type="number"
                  min={1}
                  max={60}
                  value={customBreak}
                  onChange={(event) =>
                    setCustomBreak(Number(event.target.value))
                  }
                />
              </Field>
            </div>
          )}

          <div className="rounded-lg border bg-background p-6 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              {selectedMode.label}
            </p>
            <p className="mt-2 text-7xl font-black leading-none">
              {formatTime(secondsLeft)}
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setIsRunning(true)}>
              <PlayIcon data-icon="inline-start" aria-hidden="true" />
              Start
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRunning(false)}
            >
              <PauseIcon data-icon="inline-start" aria-hidden="true" />
              Pause
            </Button>
            <Button type="button" variant="outline" onClick={resetTimer}>
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="goal">Session goal</FieldLabel>
            <FieldDescription>
              One clear target. Not &quot;study everything and panic&quot;.
            </FieldDescription>
            <Input
              id="goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Finish maths exercise 2.2"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="reflection">Completion reflection</FieldLabel>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              placeholder="What worked? What got stuck?"
              className="min-h-36"
            />
          </Field>
          <Button
            type="button"
            disabled={isPending || (!completed && secondsLeft > 0)}
            onClick={saveSession}
          >
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            {isPending ? "Saving" : "Save completed focus session"}
          </Button>
          {!completed && secondsLeft > 0 && (
            <p className="text-sm text-muted-foreground">
              Save unlocks after the timer reaches zero. Tiny bit strict, fair
              enough.
            </p>
          )}
        </FieldGroup>
      </section>
    </div>
  );
}
