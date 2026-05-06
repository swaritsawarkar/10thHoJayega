"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  BrainIcon,
  CheckCircle2Icon,
  CoffeeIcon,
  EraserIcon,
  LightbulbIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SaveIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getBrowserSupabase,
  notifyError,
  notifySuccess,
} from "@/lib/client-effects";

const modes = [
  { id: "25/5 classic", label: "25/5 classic", duration: 25, breakMinutes: 5 },
  {
    id: "50/10 deep work",
    label: "50/10 deep work",
    duration: 50,
    breakMinutes: 10,
  },
  {
    id: "15/5 low energy",
    label: "15/5 low energy",
    duration: 15,
    breakMinutes: 5,
  },
  { id: "custom", label: "Custom", duration: 25, breakMinutes: 5 },
];

type TimerPhase = "study" | "break";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getSafeMinutes(value: number) {
  return Math.max(1, Math.round(value || 1));
}

export type FocusTimerProps = {
  userId: string;
};

export function FocusTimer({ userId }: FocusTimerProps) {
  const [modeId, setModeId] = useState(modes[0].id);
  const [customDuration, setCustomDuration] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [phase, setPhase] = useState<TimerPhase>("study");
  const [goal, setGoal] = useState("");
  const [reflection, setReflection] = useState("");
  const [feynmanTopic, setFeynmanTopic] = useState("");
  const [feynmanSimple, setFeynmanSimple] = useState("");
  const [feynmanGaps, setFeynmanGaps] = useState("");
  const [blurtBoard, setBlurtBoard] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const selectedMode = modes.find((mode) => mode.id === modeId) ?? modes[0];
  const duration =
    modeId === "custom"
      ? getSafeMinutes(customDuration)
      : selectedMode.duration;
  const breakMinutes =
    modeId === "custom"
      ? getSafeMinutes(customBreak)
      : selectedMode.breakMinutes;
  const phaseMinutes = phase === "study" ? duration : breakMinutes;
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

          if (phase === "study") {
            setCompleted(true);
            void notifySuccess("Study block complete. Start your break.");
          } else {
            setCycleCount((currentCount) => currentCount + 1);
            void notifySuccess("Break done. Ready for the next block.");
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, phase]);

  const progressPercent = useMemo(() => {
    const total = Math.max(1, phaseMinutes) * 60;
    return Math.round(((total - secondsLeft) / total) * 100);
  }, [phaseMinutes, secondsLeft]);

  function resetCurrentTimer(nextPhase = phase) {
    setIsRunning(false);
    setPhase(nextPhase);
    setSecondsLeft((nextPhase === "study" ? duration : breakMinutes) * 60);

    if (nextPhase === "study") {
      setCompleted(false);
    }
  }

  function startBreak() {
    setPhase("break");
    setSecondsLeft(breakMinutes * 60);
    setIsRunning(true);
  }

  function startNextStudyBlock() {
    setPhase("study");
    setCompleted(false);
    setSecondsLeft(duration * 60);
    setIsRunning(true);
  }

  function compileReflection() {
    return [
      reflection.trim() && `Reflection:\n${reflection.trim()}`,
      feynmanTopic.trim() && `Feynman topic:\n${feynmanTopic.trim()}`,
      feynmanSimple.trim() && `Feynman explanation:\n${feynmanSimple.trim()}`,
      feynmanGaps.trim() && `Gaps to revise:\n${feynmanGaps.trim()}`,
      blurtBoard.trim() && `Blurting board:\n${blurtBoard.trim()}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  function saveSession() {
    startTransition(async () => {
      const supabase = await getBrowserSupabase();
      const { error } = await supabase.from("focus_sessions").insert({
        user_id: userId,
        mode: selectedMode.label,
        duration_minutes: duration,
        break_minutes: breakMinutes,
        goal,
        reflection: compileReflection(),
        completed: true,
      });

      if (error) {
        void notifyError("Focus session did not save.");
        return;
      }

      void notifySuccess("Focus session saved");
      setReflection("");
      setGoal("");
      setFeynmanTopic("");
      setFeynmanSimple("");
      setFeynmanGaps("");
      setBlurtBoard("");
      setCycleCount(0);
      resetCurrentTimer("study");
    });
  }

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
      <section className="min-w-0 rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
              Focus mode
            </h1>
            <p className="mt-2 text-muted-foreground">
              Study in focused blocks, take the break seriously, then come back
              before your brain starts bargaining.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
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
                  const nextStudyMinutes =
                    mode.id === "custom"
                      ? getSafeMinutes(customDuration)
                      : mode.duration;

                  setModeId(mode.id);
                  setIsRunning(false);
                  setCompleted(false);
                  setPhase("study");
                  setSecondsLeft(nextStudyMinutes * 60);
                }}
              >
                <span className="font-bold">{mode.label}</span>
                <span className="mt-1 block text-xs opacity-80">
                  {mode.duration} min + {mode.breakMinutes} min break
                </span>
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

                    if (!isRunning && phase === "study") {
                      setCompleted(false);
                      setSecondsLeft(getSafeMinutes(nextDuration) * 60);
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
                  onChange={(event) => {
                    const nextBreak = Number(event.target.value);
                    setCustomBreak(nextBreak);

                    if (!isRunning && phase === "break") {
                      setSecondsLeft(getSafeMinutes(nextBreak) * 60);
                    }
                  }}
                />
              </Field>
            </div>
          )}

          <div className="rounded-lg border bg-background p-5 text-center sm:p-6">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
              <span>{selectedMode.label}</span>
              <span>Cycle {cycleCount + 1}</span>
              <span>{phase === "study" ? "Study" : "Break"}</span>
            </div>
            <p className="mt-2 text-6xl font-black leading-none sm:text-7xl">
              {formatTime(secondsLeft)}
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              onClick={() => setIsRunning(true)}
              disabled={isRunning || secondsLeft <= 0}
              className="w-full sm:w-fit"
            >
              <PlayIcon data-icon="inline-start" aria-hidden="true" />
              Start
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!isRunning}
              onClick={() => setIsRunning(false)}
              className="w-full sm:w-fit"
            >
              <PauseIcon data-icon="inline-start" aria-hidden="true" />
              Pause
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => resetCurrentTimer()}
              className="w-full sm:w-fit"
            >
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
              Reset
            </Button>
            {completed && phase === "study" && (
              <Button
                type="button"
                variant="secondary"
                onClick={startBreak}
                className="w-full sm:w-fit"
              >
                <CoffeeIcon data-icon="inline-start" aria-hidden="true" />
                Start break
              </Button>
            )}
            {phase === "break" && secondsLeft === 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={startNextStudyBlock}
                className="w-full sm:w-fit"
              >
                <CheckCircle2Icon data-icon="inline-start" aria-hidden="true" />
                Next study block
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-lg border bg-card p-5">
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
            disabled={isPending || !completed}
            onClick={saveSession}
            className="w-full sm:w-fit"
          >
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            {isPending ? "Saving" : "Save completed focus session"}
          </Button>
          {!completed && (
            <p className="text-sm text-muted-foreground">
              Save unlocks after a study block reaches zero.
            </p>
          )}
        </FieldGroup>
      </section>

      <section className="min-w-0 rounded-lg border bg-card p-5 lg:col-span-2">
        <div className="mb-4 flex items-center gap-2">
          <BrainIcon className="size-5" aria-hidden="true" />
          <h2 className="text-2xl font-black">Feynman helper</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="feynmanTopic">Idea</FieldLabel>
            <Textarea
              id="feynmanTopic"
              value={feynmanTopic}
              onChange={(event) => setFeynmanTopic(event.target.value)}
              placeholder="Quadratic formula, nationalism in India, acids and bases..."
              className="min-h-32"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="feynmanSimple">Explain simply</FieldLabel>
            <Textarea
              id="feynmanSimple"
              value={feynmanSimple}
              onChange={(event) => setFeynmanSimple(event.target.value)}
              placeholder="Explain it like you are teaching a friend."
              className="min-h-32"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="feynmanGaps">Gaps to revise</FieldLabel>
            <Textarea
              id="feynmanGaps"
              value={feynmanGaps}
              onChange={(event) => setFeynmanGaps(event.target.value)}
              placeholder="Words you used but could not explain, weak examples, missing steps..."
              className="min-h-32"
            />
          </Field>
        </div>
      </section>

      <section className="min-w-0 rounded-lg border border-slate-300 bg-white p-5 text-slate-950 shadow-sm dark:bg-zinc-100 dark:text-zinc-950 lg:col-span-2">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <LightbulbIcon className="size-5" aria-hidden="true" />
            <h2 className="text-2xl font-black">Blurting whiteboard</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setBlurtBoard("")}
            className="border-slate-300 bg-white text-slate-950 hover:bg-slate-100 sm:w-fit"
          >
            <EraserIcon data-icon="inline-start" aria-hidden="true" />
            Clear board
          </Button>
        </div>
        <Textarea
          value={blurtBoard}
          onChange={(event) => setBlurtBoard(event.target.value)}
          placeholder="Dump every formula, date, definition, diagram label, and half-remembered point here first. Then check notes after."
          className="min-h-72 resize-y border-slate-300 text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-slate-300"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff, #ffffff), linear-gradient(90deg, rgba(148, 163, 184, 0.18) 1px, transparent 1px), linear-gradient(rgba(148, 163, 184, 0.18) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 28px 28px, 28px 28px",
          }}
        />
      </section>
    </div>
  );
}
