import { getCurrentUser, getProfile } from "@/lib/auth";
import { getDisplayName } from "@/lib/progress";

export const runtime = "nodejs";
export const maxDuration = 20;

const defaultFeedbackEmail = "sawarkarswarit@gmail.com";
const maxMessageChars = 3000;
const maxLocationChars = 160;
const allowedTypes = new Set([
  "UI issue",
  "Bug report",
  "Feature idea",
  "Account help",
  "Other",
]);
const requestKeys = new Set(["type", "location", "message"]);

type FeedbackBody = {
  type: string;
  location: string;
  message: string;
};

function getFeedbackEmail() {
  return process.env.FEEDBACK_TO_EMAIL?.trim() || defaultFeedbackEmail;
}

function jsonResponse(body: unknown, status: number) {
  return Response.json(body, { status });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasUnexpectedKeys(value: Record<string, unknown>) {
  return Object.keys(value).some((key) => !requestKeys.has(key));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function parseFeedbackRequest(request: Request): Promise<
  | {
      body: FeedbackBody;
    }
  | { error: string }
> {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return { error: "Feedback request must be valid JSON." };
  }

  if (!isPlainObject(rawBody) || hasUnexpectedKeys(rawBody)) {
    return { error: "Feedback request is invalid." };
  }

  const type = typeof rawBody.type === "string" ? rawBody.type.trim() : "";
  const location =
    typeof rawBody.location === "string" ? rawBody.location.trim() : "";
  const message =
    typeof rawBody.message === "string" ? rawBody.message.trim() : "";

  if (!allowedTypes.has(type)) {
    return { error: "Choose a valid feedback type." };
  }

  if (location.length > maxLocationChars) {
    return { error: "Keep the page or area under 160 characters." };
  }

  if (!message) {
    return { error: "Write a little feedback before sending." };
  }

  if (message.length > maxMessageChars) {
    return { error: "Keep feedback under 3000 characters." };
  }

  return {
    body: {
      type,
      location,
      message,
    },
  };
}

function buildFeedbackEmail({
  body,
  displayName,
  userEmail,
}: {
  body: FeedbackBody;
  displayName: string;
  userEmail: string;
}) {
  const subject = `10thHoJayega feedback: ${body.type}`;
  const text = [
    `From: ${displayName} <${userEmail}>`,
    `Type: ${body.type}`,
    `Place: ${body.location || "Not specified"}`,
    "",
    "Feedback:",
    body.message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>10thHoJayega feedback</h2>
      <p><strong>From:</strong> ${escapeHtml(displayName)} &lt;${escapeHtml(
        userEmail,
      )}&gt;</p>
      <p><strong>Type:</strong> ${escapeHtml(body.type)}</p>
      <p><strong>Place:</strong> ${escapeHtml(
        body.location || "Not specified",
      )}</p>
      <hr />
      <p>${escapeHtml(body.message).replaceAll("\n", "<br />")}</p>
    </div>
  `;

  return { subject, text, html };
}

async function sendFeedbackEmail({
  subject,
  text,
  html,
  userEmail,
}: {
  subject: string;
  text: string;
  html: string;
  userEmail: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Email is not set up yet. Add RESEND_API_KEY in Vercel and .env.local.",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:
        process.env.FEEDBACK_FROM_EMAIL?.trim() ||
        "10thHoJayega <onboarding@resend.dev>",
      to: [getFeedbackEmail()],
      subject,
      text,
      html,
      reply_to: userEmail,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Resend rejected the feedback email.");
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonResponse({ error: "Login required to send feedback." }, 401);
  }

  const parsedRequest = await parseFeedbackRequest(request);
  if ("error" in parsedRequest) {
    return jsonResponse({ error: parsedRequest.error }, 400);
  }

  const userEmail = user.email ?? "student";
  const profile = await getProfile(user.id);
  const displayName = getDisplayName(user.email, profile?.display_name);
  const email = buildFeedbackEmail({
    body: parsedRequest.body,
    displayName,
    userEmail,
  });

  try {
    await sendFeedbackEmail({
      subject: email.subject,
      text: email.text,
      html: email.html,
      userEmail,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Feedback could not be emailed.";

    return jsonResponse({ error: message }, 502);
  }

  return jsonResponse({ ok: true, to: getFeedbackEmail() }, 200);
}
