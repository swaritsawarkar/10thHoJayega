"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useChat } from "@ai-sdk/react";
import {
  convertFileListToFileUIParts,
  DefaultChatTransport,
  type UIMessage,
} from "ai";
import {
  BotIcon,
  CameraIcon,
  EraserIcon,
  ImageIcon,
  SendIcon,
  SquareIcon,
  XIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/app/error-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  HOMEWORK_HELP_ALLOWED_IMAGE_TYPES,
  HOMEWORK_HELP_MAX_IMAGE_BYTES,
} from "@/lib/homework-help";
import { cn } from "@/lib/utils";
import type { Chapter, Subject } from "@/types/app";

const starterQuestions = [
  "Read this photo first, then solve it step by step.",
  "How do I write a 5-mark SST answer without rambling?",
  "Give me hints for balancing this chemical equation.",
];

const allowedImageTypeSet = new Set<string>(HOMEWORK_HELP_ALLOWED_IMAGE_TYPES);

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.ceil(bytes / 1024)} KB`;
}

function stripOlderImages(messages: UIMessage[]) {
  const latestUserMessageId = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.id;

  return messages.map((message) => {
    if (message.id === latestUserMessageId) {
      return message;
    }

    const partsWithoutFiles = message.parts.filter(
      (part) => part.type !== "file",
    );

    if (partsWithoutFiles.length > 0) {
      return { ...message, parts: partsWithoutFiles };
    }

    return {
      ...message,
      parts: [
        {
          type: "text",
          text: "[Previous homework photo omitted after that answer.]",
        },
      ],
    };
  });
}

export function HomeworkHelper({
  subjects,
  chapters,
  initialQuestionsLeft,
  dailyLimit,
  isAiConfigured,
  setupIssue,
}: {
  subjects: Subject[];
  chapters: Chapter[];
  initialQuestionsLeft: number;
  dailyLimit: number;
  isAiConfigured: boolean;
  setupIssue?: string;
}) {
  const [input, setInput] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [questionsLeft, setQuestionsLeft] = useState(initialQuestionsLeft);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const availableChapters = useMemo(
    () =>
      chapters.filter((chapter) => chapter.subject_id === selectedSubjectId),
    [chapters, selectedSubjectId],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport<UIMessage>({
        api: "/api/homework-help",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            messages: stripOlderImages(messages),
            subjectId: selectedSubjectId || null,
            chapterId: selectedChapterId || null,
          },
        }),
      }),
    [selectedSubjectId, selectedChapterId],
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    setMessages,
    clearError,
  } = useChat({
    id: `homework-help:${selectedSubjectId || "all"}:${selectedChapterId || "all"}`,
    transport,
    experimental_throttle: 80,
    onFinish: ({ isAbort, isError }) => {
      if (!isAbort && !isError) {
        setQuestionsLeft((current) => Math.max(0, current - 1));
      }
    },
    onError: (chatError) => {
      toast.error(chatError.message || "Homework Help could not answer.");
    },
  });

  const isBusy = status === "submitted" || status === "streaming";
  const canAsk = isAiConfigured && !setupIssue && questionsLeft > 0 && !isBusy;

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    [],
  );

  function handleSubjectChange(subjectId: string) {
    setSelectedSubjectId(subjectId);
    setSelectedChapterId("");
  }

  function clearSelectedFile() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setSelectedFile(null);
    setImagePreviewUrl(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      clearSelectedFile();
      return;
    }

    if (!allowedImageTypeSet.has(file.type)) {
      setFileError("Use a JPG, PNG, or WebP homework photo.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > HOMEWORK_HELP_MAX_IMAGE_BYTES) {
      setFileError(
        `Keep the photo under ${formatFileSize(HOMEWORK_HELP_MAX_IMAGE_BYTES)}.`,
      );
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setFileError("");
    setSelectedFile(file);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setImagePreviewUrl(objectUrl);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedInput = input.trim();

    if ((!trimmedInput && !selectedFile) || !canAsk) {
      return;
    }

    clearError();
    const prompt =
      trimmedInput ||
      "Please read this homework photo first, then help me solve it step by step.";
    const files = selectedFile
      ? await convertFileListToFileUIParts(
          fileInputRef.current?.files ?? undefined,
        )
      : undefined;

    void sendMessage({
      text: prompt,
      ...(files && files.length > 0 ? { files } : {}),
    });
    setInput("");
    clearSelectedFile();
  }

  function clearChat() {
    clearError();
    setMessages([]);
  }

  if (!isAiConfigured || setupIssue) {
    return (
      <div className="flex flex-col gap-6">
        <section className="rounded-lg border bg-card p-5">
          <p className="font-mono text-sm text-muted-foreground">
            Homework Help
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-normal">
            AI tutor needs one setup step.
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            This feature uses Gemini free tier through a server-only API key.
            The key never goes in the browser.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="text-2xl font-black">Setup required</h2>
          <p className="mt-2 text-muted-foreground">
            {setupIssue ??
              "Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and to Vercel environment variables."}
          </p>
          <pre className="mt-4 overflow-x-auto rounded-md border bg-muted p-4 text-sm">
            <code>GOOGLE_GENERATIVE_AI_API_KEY=</code>
          </pre>
          <p className="mt-3 text-sm text-muted-foreground">
            Get the key from Google AI Studio, restart the dev server, then come
            back here.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="flex flex-col gap-4">
        <div className="rounded-lg border bg-card p-5">
          <p className="font-mono text-sm text-muted-foreground">
            Homework Help
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-normal">
            Ask. Understand. Then write.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Step-by-step help for Class 10 homework. Not a copy-paste machine,
            thankfully.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Context</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Optional, but better answers happen when the tutor knows the
                subject.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Photo mode is session-only. The image is sent to Gemini for this
                answer and is not saved to Supabase.
              </p>
            </div>
            <span className="rounded-md border bg-muted px-2 py-1 font-mono text-xs">
              {questionsLeft}/{dailyLimit} left
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-medium">
              Subject
              <select
                value={selectedSubjectId}
                onChange={(event) => handleSubjectChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">No subject context</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium">
              Chapter
              <select
                value={selectedChapterId}
                disabled={!selectedSubjectId || availableChapters.length === 0}
                onChange={(event) => setSelectedChapterId(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">No chapter context</option>
                {availableChapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    Chapter {chapter.chapter_number ?? "-"}: {chapter.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h2 className="text-xl font-black">Try asking</h2>
          <div className="mt-3 flex flex-col gap-2">
            {starterQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => setInput(question)}
                className="rounded-md border bg-background p-3 text-left text-sm transition hover:bg-muted"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="flex min-h-[620px] flex-col rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div>
            <h2 className="text-xl font-black">Tutor chat</h2>
            <p className="text-sm text-muted-foreground">
              Session-only chat. Nothing here is saved to Supabase.
            </p>
          </div>
          <div className="flex gap-2">
            {isBusy && (
              <Button type="button" variant="outline" size="sm" onClick={stop}>
                <SquareIcon data-icon="inline-start" aria-hidden="true" />
                Stop
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0 || isBusy}
            >
              <EraserIcon data-icon="inline-start" aria-hidden="true" />
              Clear
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-md border border-dashed p-6 text-center">
              <div>
                <BotIcon className="mx-auto size-10" aria-hidden="true" />
                <p className="mt-3 font-black">No question yet.</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Paste the problem or add one clear photo. The tutor reads what
                  is visible first, then helps with the stuck part.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={cn(
                  "rounded-lg border p-4",
                  message.role === "user"
                    ? "ml-auto max-w-[88%] bg-primary text-primary-foreground"
                    : "mr-auto max-w-[92%] bg-background",
                )}
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-normal opacity-80">
                  {message.role === "user" ? (
                    <UserIcon className="size-3.5" aria-hidden="true" />
                  ) : (
                    <BotIcon className="size-3.5" aria-hidden="true" />
                  )}
                  {message.role === "user" ? "You" : "Homework Helper"}
                </div>
                <div className="flex flex-col gap-3 text-sm leading-6">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p
                          key={`${message.id}-text-${index}`}
                          className="whitespace-pre-wrap"
                        >
                          {part.text}
                        </p>
                      );
                    }

                    if (
                      part.type === "file" &&
                      part.mediaType.startsWith("image/")
                    ) {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={`${message.id}-image-${index}`}
                          src={part.url}
                          alt="Uploaded homework question"
                          className="max-h-72 rounded-md border object-contain"
                        />
                      );
                    }

                    return null;
                  })}
                </div>
              </article>
            ))
          )}
          {isBusy && (
            <p className="font-mono text-xs text-muted-foreground">
              Thinking through it step by step...
            </p>
          )}
          {error && (
            <ErrorState
              title="Homework Help stopped"
              message={error.message || "Try again in a bit."}
            />
          )}
          {questionsLeft <= 0 && (
            <ErrorState
              title="Daily limit reached"
              message="You used today's 10 free Homework Help questions. The limit protects the free Gemini quota."
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept={HOMEWORK_HELP_ALLOWED_IMAGE_TYPES.join(",")}
              capture="environment"
              className="sr-only"
              onChange={handleFileChange}
              disabled={!canAsk}
            />

            {imagePreviewUrl && selectedFile && (
              <div className="flex items-center gap-3 rounded-md border bg-background p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreviewUrl}
                  alt="Selected homework question"
                  className="size-16 rounded border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {selectedFile.name || "Homework photo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} · used for this answer
                    only
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearSelectedFile}
                  aria-label="Remove selected homework photo"
                >
                  <XIcon aria-hidden="true" />
                </Button>
              </div>
            )}

            {fileError && (
              <p className="text-sm font-medium text-destructive">
                {fileError}
              </p>
            )}

            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type the question, or add a photo and write what you need help with."
              className="min-h-24 resize-none"
              disabled={!canAsk}
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                One clear photo per question. Blurry crop = confused tutor.
              </p>
              <div className="flex gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canAsk}
                >
                  {selectedFile ? (
                    <ImageIcon data-icon="inline-start" aria-hidden="true" />
                  ) : (
                    <CameraIcon data-icon="inline-start" aria-hidden="true" />
                  )}
                  {selectedFile ? "Change photo" : "Add photo"}
                </Button>
                <Button
                  type="submit"
                  disabled={(!input.trim() && !selectedFile) || !canAsk}
                  className="sm:min-w-32"
                >
                  <SendIcon data-icon="inline-start" aria-hidden="true" />
                  {isBusy ? "Answering" : "Ask"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
