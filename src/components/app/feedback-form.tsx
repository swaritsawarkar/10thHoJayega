"use client";

import { useMemo, useState } from "react";
import { ClipboardPenLineIcon, MailIcon, SendIcon } from "lucide-react";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const feedbackTypes = [
  "UI issue",
  "Bug report",
  "Feature idea",
  "Account help",
  "Other",
];

export function FeedbackForm({
  feedbackEmail,
  userEmail,
  displayName,
}: {
  feedbackEmail: string;
  userEmail: string;
  displayName: string;
}) {
  const [type, setType] = useState(feedbackTypes[0]);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const canSend = message.trim().length > 0;

  const mailtoHref = useMemo(() => {
    const subject = `10thHoJayega feedback: ${type}`;
    const body = [
      `From: ${displayName} <${userEmail}>`,
      `Type: ${type}`,
      `Place: ${location.trim() || "Not specified"}`,
      "",
      "Feedback:",
      message.trim(),
    ].join("\n");

    return `mailto:${feedbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [displayName, feedbackEmail, location, message, type, userEmail]);

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

      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => event.preventDefault()}
      >
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
          </Field>
        </FieldGroup>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 text-sm text-muted-foreground">
            <MailIcon
              className="mr-1 inline size-4 align-[-2px]"
              aria-hidden="true"
            />
            {feedbackEmail}
          </p>
          <a
            data-testid="feedback-mailto-link"
            href={canSend ? mailtoHref : undefined}
            aria-disabled={!canSend}
            tabIndex={canSend ? undefined : -1}
            onClick={(event) => {
              if (!canSend) {
                event.preventDefault();
              }
            }}
            className={cn(
              buttonVariants({ className: "w-full sm:w-fit" }),
              !canSend && "pointer-events-none opacity-50",
            )}
          >
            <SendIcon data-icon="inline-start" aria-hidden="true" />
            Send feedback
          </a>
        </div>
      </form>
    </section>
  );
}
