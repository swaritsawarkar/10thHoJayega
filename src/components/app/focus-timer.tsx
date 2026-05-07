"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type PointerEvent,
} from "react";
import {
  BookOpenIcon,
  BrainIcon,
  BrushIcon,
  CheckCircle2Icon,
  CoffeeIcon,
  DownloadIcon,
  EraserIcon,
  LightbulbIcon,
  ListChecksIcon,
  MousePointer2Icon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  RotateCcwIcon,
  SaveIcon,
  SparklesIcon,
  Trash2Icon,
  Undo2Icon,
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
type StudyTool = "timer" | "whiteboard" | "feynman" | "all";
type WhiteboardTool = "pen" | "marker" | "eraser";

type SavedWhiteboard = {
  id: string;
  name: string;
  dataUrl: string;
};

const studyTools: Array<{
  id: StudyTool;
  label: string;
  description: string;
  icon: typeof PlayIcon;
}> = [
  {
    id: "timer",
    label: "Timer",
    description: "Start a focused study block.",
    icon: PlayIcon,
  },
  {
    id: "whiteboard",
    label: "Whiteboard",
    description: "Draw, blurt, save, and download.",
    icon: BrushIcon,
  },
  {
    id: "feynman",
    label: "Feynman",
    description: "Teach the idea simply.",
    icon: BrainIcon,
  },
  {
    id: "all",
    label: "Full session",
    description: "Timer, notes, board, and Feynman.",
    icon: ListChecksIcon,
  },
];

const whiteboardColors = [
  "#111827",
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ca8a04",
  "#7c3aed",
];

const whiteboardStorageKey = "10thhojayega-focus-whiteboards";
const canvasWidth = 1400;
const canvasHeight = 760;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getSafeMinutes(value: number) {
  return Math.max(1, Math.round(value || 1));
}

function getNextBoardNumber(savedBoards: SavedWhiteboard[]) {
  return (
    savedBoards.reduce((maxBoardNumber, board) => {
      const match = /board-(\d+)/.exec(board.id);
      return Math.max(maxBoardNumber, match ? Number(match[1]) : 0);
    }, 0) + 1
  );
}

function readSavedWhiteboards() {
  try {
    const rawValue = window.localStorage.getItem(whiteboardStorageKey);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as SavedWhiteboard[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeSavedWhiteboards(savedBoards: SavedWhiteboard[]) {
  window.localStorage.setItem(
    whiteboardStorageKey,
    JSON.stringify(savedBoards.slice(0, 8)),
  );
}

export type FocusTimerProps = {
  userId: string;
};

export function FocusTimer({ userId }: FocusTimerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const [activeStudyTool, setActiveStudyTool] = useState<StudyTool>("all");
  const [modeId, setModeId] = useState(modes[0].id);
  const [customDuration, setCustomDuration] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [phase, setPhase] = useState<TimerPhase>("study");
  const [goal, setGoal] = useState("");
  const [reflection, setReflection] = useState("");
  const [feynmanTopic, setFeynmanTopic] = useState("");
  const [feynmanSimple, setFeynmanSimple] = useState("");
  const [feynmanGaps, setFeynmanGaps] = useState("");
  const [whiteboardNotes, setWhiteboardNotes] = useState("");
  const [whiteboardTool, setWhiteboardTool] = useState<WhiteboardTool>("pen");
  const [whiteboardColor, setWhiteboardColor] = useState(whiteboardColors[0]);
  const [whiteboardSize, setWhiteboardSize] = useState(8);
  const [boardName, setBoardName] = useState("");
  const [savedBoards, setSavedBoards] = useState<SavedWhiteboard[]>([]);
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
  const showTimer = activeStudyTool === "timer" || activeStudyTool === "all";
  const showWhiteboard =
    activeStudyTool === "whiteboard" || activeStudyTool === "all";
  const showFeynman =
    activeStudyTool === "feynman" || activeStudyTool === "all";

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

  useEffect(() => {
    if (!showWhiteboard) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = "round";
    context.lineJoin = "round";

    if (historyIndexRef.current >= 0) {
      loadCanvasImage(historyRef.current[historyIndexRef.current]);
    } else {
      historyRef.current = [canvas.toDataURL("image/png")];
      historyIndexRef.current = 0;
    }

    window.setTimeout(() => {
      setSavedBoards(readSavedWhiteboards());
    }, 0);
  }, [showWhiteboard]);

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
      whiteboardNotes.trim() && `Whiteboard notes:\n${whiteboardNotes.trim()}`,
      savedBoards.length > 0 &&
        `Saved whiteboards available locally: ${savedBoards.length}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  function getCanvasPoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function drawLine(
    canvas: HTMLCanvasElement,
    from: { x: number; y: number },
    to: { x: number; y: number },
  ) {
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.globalCompositeOperation = "source-over";
    context.globalAlpha = whiteboardTool === "marker" ? 0.28 : 1;
    context.strokeStyle =
      whiteboardTool === "eraser" ? "#ffffff" : whiteboardColor;
    context.lineWidth =
      whiteboardTool === "marker"
        ? whiteboardSize * 2.2
        : whiteboardTool === "eraser"
          ? whiteboardSize * 2.4
          : whiteboardSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.globalAlpha = 1;
  }

  function saveCanvasHistory() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const nextHistory = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );
    nextHistory.push(canvas.toDataURL("image/png"));
    historyRef.current = nextHistory.slice(-20);
    historyIndexRef.current = historyRef.current.length - 1;
  }

  function loadCanvasImage(dataUrl: string) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const image = new Image();
    image.onload = () => {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = dataUrl;
  }

  function startDrawing(event: PointerEvent<HTMLCanvasElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getCanvasPoint(event);
    drawingRef.current = true;
    lastPointRef.current = point;
    drawLine(event.currentTarget, point, point);
  }

  function continueDrawing(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || !lastPointRef.current) {
      return;
    }

    const nextPoint = getCanvasPoint(event);
    drawLine(event.currentTarget, lastPointRef.current, nextPoint);
    lastPointRef.current = nextPoint;
  }

  function stopDrawing() {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    lastPointRef.current = null;
    saveCanvasHistory();
  }

  function clearWhiteboard() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasHistory();
  }

  function undoWhiteboard() {
    if (historyIndexRef.current <= 0) {
      return;
    }

    historyIndexRef.current -= 1;
    loadCanvasImage(historyRef.current[historyIndexRef.current]);
  }

  function saveWhiteboard() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const boardNumber = getNextBoardNumber(savedBoards);
    const nextBoard: SavedWhiteboard = {
      id: `board-${boardNumber}`,
      name: boardName.trim() || `Whiteboard ${boardNumber}`,
      dataUrl: canvas.toDataURL("image/png"),
    };
    const nextBoards = [nextBoard, ...savedBoards].slice(0, 8);

    try {
      writeSavedWhiteboards(nextBoards);
      setSavedBoards(nextBoards);
      setBoardName("");
      void notifySuccess("Whiteboard saved locally");
    } catch {
      void notifyError("Whiteboard could not save locally.");
    }
  }

  function deleteWhiteboard(boardId: string) {
    const nextBoards = savedBoards.filter((board) => board.id !== boardId);
    writeSavedWhiteboards(nextBoards);
    setSavedBoards(nextBoards);
  }

  function downloadWhiteboard() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `${boardName.trim() || "focus-whiteboard"}.png`;
    anchor.click();
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
      setWhiteboardNotes("");
      setCycleCount(0);
      resetCurrentTimer("study");
    });
  }

  return (
    <div className="grid min-w-0 gap-6">
      <section className="rounded-lg border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <SparklesIcon className="size-5" aria-hidden="true" />
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
            Focus mode
          </h1>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {studyTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                type="button"
                className={`rounded-md border p-3 text-left transition ${
                  activeStudyTool === tool.id
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "bg-background hover:bg-muted"
                }`}
                onClick={() => setActiveStudyTool(tool.id)}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <Icon className="size-4" aria-hidden="true" />
                  {tool.label}
                </span>
                <span className="mt-1 block text-xs opacity-80">
                  {tool.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {showTimer && (
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <section className="min-w-0 rounded-lg border bg-card p-5">
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl font-black">Study timer</h2>
                <p className="mt-2 text-muted-foreground">
                  Study in focused blocks, take the break seriously, then come
                  back before your brain starts bargaining.
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
                    <CheckCircle2Icon
                      data-icon="inline-start"
                      aria-hidden="true"
                    />
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
                <FieldLabel htmlFor="reflection">
                  Completion reflection
                </FieldLabel>
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
        </div>
      )}

      {showFeynman && (
        <section className="min-w-0 rounded-lg border bg-card p-5">
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
      )}

      {showWhiteboard && (
        <section className="min-w-0 rounded-lg border border-slate-300 bg-white p-4 text-slate-950 shadow-sm dark:bg-zinc-100 dark:text-zinc-950 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <LightbulbIcon className="size-5" aria-hidden="true" />
              <h2 className="text-2xl font-black">Whiteboard</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={undoWhiteboard}
                className="border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
              >
                <Undo2Icon data-icon="inline-start" aria-hidden="true" />
                Undo
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={clearWhiteboard}
                className="border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
              >
                <EraserIcon data-icon="inline-start" aria-hidden="true" />
                Clear
              </Button>
              <Button
                type="button"
                onClick={downloadWhiteboard}
                className="bg-slate-950 text-white hover:bg-slate-800"
              >
                <DownloadIcon data-icon="inline-start" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-slate-300 bg-slate-50 p-2">
                {[
                  { id: "pen", label: "Pen", icon: PencilIcon },
                  { id: "marker", label: "Marker", icon: BrushIcon },
                  { id: "eraser", label: "Eraser", icon: EraserIcon },
                ].map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <Button
                      key={tool.id}
                      type="button"
                      variant={
                        whiteboardTool === tool.id ? "default" : "outline"
                      }
                      onClick={() =>
                        setWhiteboardTool(tool.id as WhiteboardTool)
                      }
                      className={
                        whiteboardTool === tool.id
                          ? "bg-slate-950 text-white hover:bg-slate-800"
                          : "border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
                      }
                    >
                      <Icon data-icon="inline-start" aria-hidden="true" />
                      {tool.label}
                    </Button>
                  );
                })}

                <div className="flex items-center gap-1 pl-1">
                  {whiteboardColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Use ${color}`}
                      onClick={() => {
                        setWhiteboardColor(color);
                        setWhiteboardTool((currentTool) =>
                          currentTool === "eraser" ? "pen" : currentTool,
                        );
                      }}
                      className={`size-7 rounded-full border-2 ${
                        whiteboardColor === color
                          ? "border-slate-950"
                          : "border-slate-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <label className="ml-auto flex min-w-40 items-center gap-2 text-xs font-bold text-slate-700">
                  Size
                  <input
                    type="range"
                    min={3}
                    max={28}
                    value={whiteboardSize}
                    onChange={(event) =>
                      setWhiteboardSize(Number(event.target.value))
                    }
                    className="w-full accent-slate-950"
                  />
                  <span className="w-7 text-right">{whiteboardSize}</span>
                </label>
              </div>

              <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  aria-label="Focus whiteboard drawing area"
                  className="block aspect-[70/38] w-full cursor-crosshair touch-none bg-white"
                  onPointerDown={startDrawing}
                  onPointerMove={continueDrawing}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  onPointerLeave={stopDrawing}
                />
              </div>
            </div>

            <aside className="grid content-start gap-4">
              <Field>
                <FieldLabel htmlFor="boardName" className="text-slate-950">
                  Board name
                </FieldLabel>
                <Input
                  id="boardName"
                  value={boardName}
                  onChange={(event) => setBoardName(event.target.value)}
                  placeholder="Probability formulas"
                  className="border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-slate-300"
                />
              </Field>
              <Button
                type="button"
                onClick={saveWhiteboard}
                className="w-full bg-slate-950 text-white hover:bg-slate-800"
              >
                <SaveIcon data-icon="inline-start" aria-hidden="true" />
                Save board
              </Button>

              <Field>
                <FieldLabel
                  htmlFor="whiteboardNotes"
                  className="text-slate-950"
                >
                  Board notes
                </FieldLabel>
                <Textarea
                  id="whiteboardNotes"
                  value={whiteboardNotes}
                  onChange={(event) => setWhiteboardNotes(event.target.value)}
                  placeholder="Quick recap after checking the board..."
                  className="min-h-28 border-slate-300 bg-white text-slate-950 placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-slate-300"
                />
              </Field>

              <div className="rounded-md border border-slate-300 bg-slate-50 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-black">
                  <BookOpenIcon className="size-4" aria-hidden="true" />
                  Saved boards
                </div>
                {savedBoards.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Saved whiteboards will appear here.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {savedBoards.map((board) => (
                      <div
                        key={board.id}
                        className="grid grid-cols-[1fr_auto_auto] items-center gap-2 rounded-md border border-slate-300 bg-white p-2"
                      >
                        <button
                          type="button"
                          onClick={() => loadCanvasImage(board.dataUrl)}
                          className="min-w-0 text-left text-sm font-bold text-slate-950 hover:underline"
                        >
                          <span className="block truncate">{board.name}</span>
                        </button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          onClick={() => loadCanvasImage(board.dataUrl)}
                          className="border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
                          aria-label={`Load ${board.name}`}
                        >
                          <MousePointer2Icon aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          onClick={() => deleteWhiteboard(board.id)}
                          className="border-slate-300 bg-white text-slate-950 hover:bg-slate-100"
                          aria-label={`Delete ${board.name}`}
                        >
                          <Trash2Icon aria-hidden="true" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}
