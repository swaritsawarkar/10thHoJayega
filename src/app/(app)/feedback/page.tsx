import type { Metadata } from "next";
import { MailIcon, MessageSquarePlusIcon, SparklesIcon } from "lucide-react";

import { FeedbackForm } from "@/components/app/feedback-form";

const feedbackEmail =
  process.env.FEEDBACK_TO_EMAIL?.trim() || "sawarkarswarit@gmail.com";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Send feedback about 10thHoJayega.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FeedbackPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <p className="font-mono text-sm text-muted-foreground">Feedback</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
          Tell me what needs fixing.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Use this for UI breaks, account trouble, feature ideas, or anything
          that would make the app easier to study with.
        </p>
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)]">
        <FeedbackForm feedbackEmail={feedbackEmail} />

        <aside className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background">
              <MessageSquarePlusIcon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-black">Best feedback</h2>
              <p className="text-sm text-muted-foreground">
                Specific, honest, and tiny enough to act on.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p className="rounded-md border bg-background p-3">
              <SparklesIcon
                className="mr-2 inline size-4 align-[-2px]"
                aria-hidden="true"
              />
              Screenshots, page names, and one clear problem help the most.
            </p>
            <p className="rounded-md border bg-background p-3 break-all">
              <MailIcon
                className="mr-2 inline size-4 align-[-2px]"
                aria-hidden="true"
              />
              {feedbackEmail}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
