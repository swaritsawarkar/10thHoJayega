"use client";

import { useState } from "react";
import {
  ClipboardPenLineIcon,
  Loader2Icon,
  MailIcon,
  SendIcon,
} from "lucide-react";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const feedbackTypes = [
  "UI issue",
  "Bug report",
  "Feature idea",
  "Account help",
  "Other",
];

export function FeedbackForm({ feedbackEmail }: { feedbackEmail: string }) {
  const [type, setType] = useState(feedbackTypes[0]);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSend = message.trim().length > 0;

  async function sendFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSend || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          location,
          message,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
        to?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error || "Feedback could not be sent.");
      }

      setStatus("success");
      setStatusMessage(`Sent to ${result?.to || feedbackEmail}.`);
      setLocation("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Feedback could not be sent.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-w-0 rounded-lg border bg-card p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
          <ClipboardPenLineIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-normal">Send feedback</h2>
          <p className="text-sm text-muted-foreground">
            Bugs, mobile breaks, confusing screens, and ideas all fit here.
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={sendFeedback}>
        <FieldGroup>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="feedback-type">Type</FieldLabel>
              <select
                id="feedback-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              >
                {feedbackTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <FieldLabel htmlFor="feedback-location">
                Where did it happen?
              </FieldLabel>
              <Input
                id="feedback-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="/homework-help on mobile"
                className="h-10"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="feedback-message">Feedback</FieldLabel>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="What broke, felt weird, or should be added?"
              className="min-h-44 resize-y"
              maxLength={3000}
              required
            />
            <FieldDescription>
              {message.length}/3000 characters
            </FieldDescription>
            {status === "error" && <FieldError>{statusMessage}</FieldError>}
          </Field>
        </FieldGroup>

        {status === "success" && (
          <p
            className="rounded-md border border-primary/40 bg-primary/10 p-3 text-sm"
            role="status"
          >
            {statusMessage}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-sm text-muted-foreground">
            <MailIcon
              className="mr-1 inline size-4 align-[-2px]"
              aria-hidden="true"
            />
            {feedbackEmail}
          </p>
          <Button
            data-testid="feedback-send-button"
            type="submit"
            disabled={!canSend || isSubmitting}
            className="w-full sm:w-fit"
          >
            {isSubmitting ? (
              <Loader2Icon
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <SendIcon data-icon="inline-start" aria-hidden="true" />
            )}
            Send feedback
          </Button>
        </div>
      </form>
    </section>
  );
}
