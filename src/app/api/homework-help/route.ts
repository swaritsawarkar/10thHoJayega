import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  streamText,
  type FileUIPart,
  type UIMessage,
} from "ai";

import { getCurrentUser, getProfile } from "@/lib/auth";
import { isGoogleAiConfigured } from "@/lib/ai-env";
import { getHomeworkHelpUsageCount } from "@/lib/db";
import {
  buildHomeworkTutorSystemPrompt,
  HOMEWORK_HELP_ALLOWED_IMAGE_TYPES,
  HOMEWORK_HELP_DAILY_LIMIT,
  HOMEWORK_HELP_MAX_IMAGE_BYTES,
  HOMEWORK_HELP_MAX_MESSAGE_CHARS,
  HOMEWORK_HELP_MAX_MESSAGES,
  HOMEWORK_HELP_MAX_TOTAL_CHARS,
  type HomeworkHelpContext,
} from "@/lib/homework-help";
import {
  getLanguageSubject,
  isSubjectVisibleForLanguage,
} from "@/lib/language-subject";
import { createClient } from "@/lib/supabase/server";
import type { Chapter, Subject } from "@/types/app";

export const runtime = "nodejs";
export const maxDuration = 30;

type HomeworkRequestBody = {
  messages: UIMessage[];
  subjectId: string | null;
  chapterId: string | null;
};

const requestKeys = new Set(["messages", "subjectId", "chapterId"]);
const messageKeys = new Set(["id", "role", "parts", "metadata"]);
const textPartKeys = new Set(["type", "text", "state", "providerMetadata"]);
const filePartKeys = new Set([
  "type",
  "mediaType",
  "filename",
  "url",
  "providerMetadata",
]);
const allowedImageTypes = new Set<string>(HOMEWORK_HELP_ALLOWED_IMAGE_TYPES);
const maxImageDataUrlChars =
  Math.ceil((HOMEWORK_HELP_MAX_IMAGE_BYTES * 4) / 3) + 128;

function textResponse(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasUnexpectedKeys(
  value: Record<string, unknown>,
  allowedKeys: Set<string>,
) {
  return Object.keys(value).some((key) => !allowedKeys.has(key));
}

function normalizeOptionalId(
  value: unknown,
  label: string,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null };
  }

  if (typeof value !== "string" || value.length > 100) {
    return { ok: false, error: `${label} is invalid.` };
  }

  return { ok: true, value };
}

function estimateDataUrlBytes(dataUrl: string, mediaType: string) {
  const prefix = `data:${mediaType};base64,`;
  if (!dataUrl.startsWith(prefix)) {
    return null;
  }

  const base64 = dataUrl.slice(prefix.length);
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    return null;
  }

  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function validateFilePart(rawPart: Record<string, unknown>): {
  part?: FileUIPart;
  error?: string;
} {
  if (hasUnexpectedKeys(rawPart, filePartKeys)) {
    return { error: "Unexpected image fields were rejected." };
  }

  if (
    typeof rawPart.mediaType !== "string" ||
    !allowedImageTypes.has(rawPart.mediaType)
  ) {
    return { error: "Upload a JPG, PNG, or WebP homework photo." };
  }

  if (
    typeof rawPart.url !== "string" ||
    rawPart.url.length > maxImageDataUrlChars
  ) {
    return {
      error: `Keep homework photos under ${Math.floor(
        HOMEWORK_HELP_MAX_IMAGE_BYTES / (1024 * 1024),
      )} MB.`,
    };
  }

  const imageBytes = estimateDataUrlBytes(rawPart.url, rawPart.mediaType);
  if (imageBytes === null) {
    return { error: "Homework photos must be sent as valid data URLs." };
  }

  if (imageBytes > HOMEWORK_HELP_MAX_IMAGE_BYTES) {
    return {
      error: `Keep homework photos under ${Math.floor(
        HOMEWORK_HELP_MAX_IMAGE_BYTES / (1024 * 1024),
      )} MB.`,
    };
  }

  if (
    rawPart.filename !== undefined &&
    (typeof rawPart.filename !== "string" || rawPart.filename.length > 160)
  ) {
    return { error: "Image filename is too long." };
  }

  return {
    part: {
      type: "file",
      mediaType: rawPart.mediaType,
      url: rawPart.url,
      filename: rawPart.filename,
    },
  };
}

function validateMessages(value: unknown) {
  if (!Array.isArray(value)) {
    return { error: "messages must be an array." };
  }

  if (value.length === 0 || value.length > HOMEWORK_HELP_MAX_MESSAGES) {
    return {
      error: `Send 1-${HOMEWORK_HELP_MAX_MESSAGES} messages at a time.`,
    };
  }

  let totalChars = 0;
  let imageCount = 0;
  const messages: UIMessage[] = [];

  for (const [messageIndex, rawMessage] of value.entries()) {
    if (!isPlainObject(rawMessage)) {
      return { error: "Each message must be an object." };
    }

    if (hasUnexpectedKeys(rawMessage, messageKeys)) {
      return { error: "Unexpected message fields were rejected." };
    }

    if (typeof rawMessage.id !== "string" || rawMessage.id.length > 160) {
      return { error: "Each message needs a valid id." };
    }

    if (rawMessage.role !== "user" && rawMessage.role !== "assistant") {
      return { error: "Only user and assistant messages are accepted." };
    }

    if (!Array.isArray(rawMessage.parts) || rawMessage.parts.length === 0) {
      return { error: "Each message needs at least one text part." };
    }

    const parts: UIMessage["parts"] = [];

    for (const rawPart of rawMessage.parts) {
      if (!isPlainObject(rawPart)) {
        return { error: "Message parts must be objects." };
      }

      if (rawPart.type === "text") {
        if (hasUnexpectedKeys(rawPart, textPartKeys)) {
          return { error: "Unexpected message part fields were rejected." };
        }

        if (typeof rawPart.text !== "string") {
          return { error: "Text message parts must include text." };
        }

        const text = rawPart.text.trim();
        if (!text) {
          return { error: "Empty text parts are not accepted." };
        }

        if (text.length > HOMEWORK_HELP_MAX_MESSAGE_CHARS) {
          return {
            error: `Keep each message under ${HOMEWORK_HELP_MAX_MESSAGE_CHARS} characters.`,
          };
        }

        totalChars += text.length;
        parts.push({ type: "text", text });
        continue;
      }

      if (rawPart.type === "file") {
        if (rawMessage.role !== "user") {
          return { error: "Only student messages can include photos." };
        }

        if (messageIndex !== value.length - 1) {
          return {
            error: "Only the latest homework question can include a photo.",
          };
        }

        imageCount += 1;
        if (imageCount > 1) {
          return { error: "Upload one homework photo at a time." };
        }

        const fileResult = validateFilePart(rawPart);
        if (fileResult.error || !fileResult.part) {
          return { error: fileResult.error ?? "Homework photo is invalid." };
        }

        parts.push(fileResult.part);
        continue;
      }

      return { error: "Homework Help accepts text and one image only." };
    }

    messages.push({
      id: rawMessage.id || `message-${messageIndex}`,
      role: rawMessage.role,
      parts,
    });
  }

  if (totalChars > HOMEWORK_HELP_MAX_TOTAL_CHARS) {
    return {
      error: `This chat is too long. Keep the request under ${HOMEWORK_HELP_MAX_TOTAL_CHARS} characters.`,
    };
  }

  if (messages[messages.length - 1]?.role !== "user") {
    return { error: "The latest message must be from the student." };
  }

  return { messages };
}

async function parseHomeworkRequest(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { error: "Request body must be valid JSON." };
  }

  if (!isPlainObject(body)) {
    return { error: "Request body must be an object." };
  }

  if (hasUnexpectedKeys(body, requestKeys)) {
    return { error: "Unexpected request fields were rejected." };
  }

  const messagesResult = validateMessages(body.messages);
  if (messagesResult.error || !messagesResult.messages) {
    return { error: messagesResult.error ?? "Messages are invalid." };
  }

  const subjectResult = normalizeOptionalId(body.subjectId, "subjectId");
  if (!subjectResult.ok) {
    return { error: subjectResult.error };
  }
  const subjectId = subjectResult.value;

  const chapterResult = normalizeOptionalId(body.chapterId, "chapterId");
  if (!chapterResult.ok) {
    return { error: chapterResult.error };
  }
  const chapterId = chapterResult.value;

  return {
    body: {
      messages: messagesResult.messages,
      subjectId,
      chapterId,
    } satisfies HomeworkRequestBody,
  };
}

async function getHomeworkContext({
  subjectId,
  chapterId,
  userId,
}: {
  subjectId: string | null;
  chapterId: string | null;
  userId: string;
}): Promise<{ context: HomeworkHelpContext; error?: string }> {
  const supabase = await createClient();
  if (!supabase) {
    return { context: {}, error: "Study data is not connected yet." };
  }

  const userProfile = await getProfile(userId);
  const user = await getCurrentUser();
  const languageSubject = getLanguageSubject(userProfile, user);

  let subject: Pick<Subject, "id" | "name"> | null = null;
  let chapter: Pick<Chapter, "id" | "title" | "chapter_number"> | null = null;

  if (subjectId) {
    if (!isSubjectVisibleForLanguage(subjectId, languageSubject)) {
      return {
        context: {},
        error: "That subject is not available for your language setting.",
      };
    }

    const { data, error } = await supabase
      .from("subjects")
      .select("id,name")
      .eq("id", subjectId)
      .maybeSingle();

    if (error || !data) {
      return { context: {}, error: "Selected subject was not found." };
    }

    subject = data;
  }

  if (chapterId) {
    const { data, error } = await supabase
      .from("chapters")
      .select("id,title,chapter_number,subject_id")
      .eq("id", chapterId)
      .maybeSingle();

    if (error || !data) {
      return { context: {}, error: "Selected chapter was not found." };
    }

    if (subjectId && data.subject_id !== subjectId) {
      return {
        context: {},
        error: "Selected chapter does not belong to the selected subject.",
      };
    }

    if (!isSubjectVisibleForLanguage(data.subject_id, languageSubject)) {
      return {
        context: {},
        error: "That chapter is not available for your language setting.",
      };
    }

    chapter = data;

    if (!subject) {
      const { data: chapterSubject, error: subjectError } = await supabase
        .from("subjects")
        .select("id,name")
        .eq("id", data.subject_id)
        .maybeSingle();

      if (subjectError || !chapterSubject) {
        return { context: {}, error: "Chapter subject was not found." };
      }

      subject = chapterSubject;
    }
  }

  return { context: { subject, chapter } };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return textResponse("Login required before Homework Help can answer.", 401);
  }

  if (!isGoogleAiConfigured()) {
    return textResponse(
      "Homework Help needs one private setup step before it can answer.",
      503,
    );
  }

  const parsedRequest = await parseHomeworkRequest(request);
  if (parsedRequest.error || !parsedRequest.body) {
    return textResponse(parsedRequest.error ?? "Invalid request.", 400);
  }

  let usageCount: number;
  try {
    usageCount = await getHomeworkHelpUsageCount(user.id);
  } catch {
    return textResponse(
      "The daily Homework Help counter is not ready yet.",
      503,
    );
  }

  if (usageCount >= HOMEWORK_HELP_DAILY_LIMIT) {
    return textResponse(
      "Daily Homework Help limit reached. Try again tomorrow.",
      429,
    );
  }

  const { context, error: contextError } = await getHomeworkContext({
    subjectId: parsedRequest.body.subjectId,
    chapterId: parsedRequest.body.chapterId,
    userId: user.id,
  });

  if (contextError) {
    return textResponse(contextError, 400);
  }

  const supabase = await createClient();
  if (!supabase) {
    return textResponse("Study data is not connected yet.", 503);
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: buildHomeworkTutorSystemPrompt(context),
    messages: await convertToModelMessages(parsedRequest.body.messages),
    temperature: 0.35,
    maxOutputTokens: 900,
    onFinish: async () => {
      await supabase.from("homework_help_usage").insert({
        user_id: user.id,
        subject_id: context.subject?.id ?? null,
        chapter_id: context.chapter?.id ?? null,
      });
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      "X-Homework-Questions-Remaining": String(
        Math.max(0, HOMEWORK_HELP_DAILY_LIMIT - usageCount - 1),
      ),
    },
  });
}
