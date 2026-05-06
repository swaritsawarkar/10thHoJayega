"use client";

import { useState, useTransition, type ReactNode } from "react";
import { DownloadIcon, RotateCcwIcon, SaveIcon } from "lucide-react";

import { LanguageSubjectPicker } from "@/components/app/language-subject-picker";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  getBrowserSupabase,
  notifyError,
  notifySuccess,
} from "@/lib/client-effects";
import type { UserProfile, UserProgress } from "@/types/app";
import type { LanguageSubject } from "@/lib/language-subject";

export type SettingsPanelProps = {
  userId: string;
  email: string;
  profile: UserProfile | null;
  initialLanguageSubject: LanguageSubject;
  progress: UserProgress[];
  accountFooter?: ReactNode;
};

export function SettingsPanel({
  userId,
  email,
  profile,
  initialLanguageSubject,
  progress,
  accountFooter,
}: SettingsPanelProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [languageSubject, setLanguageSubject] = useState<LanguageSubject>(
    initialLanguageSubject,
  );
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isPending, startTransition] = useTransition();

  function saveProfile() {
    startTransition(async () => {
      const supabase = await getBrowserSupabase();
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName.trim() || null,
          language_subject: languageSubject,
        },
      });

      if (authError) {
        void notifyError("Profile did not save.");
        return;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        display_name: displayName.trim() || null,
        language_subject: languageSubject,
      });

      if (error && !error.message.toLowerCase().includes("language_subject")) {
        void notifyError("Profile did not save.");
        return;
      }

      void notifySuccess(
        error
          ? "Saved. Language preference will sync fully after the latest account update is applied."
          : "Profile saved",
      );
    });
  }

  function exportProgress() {
    const payload = {
      exported_at: new Date().toISOString(),
      user: {
        id: userId,
        email,
        display_name: displayName || null,
        language_subject: languageSubject,
      },
      progress,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "10thhojayega-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function resetProgress() {
    startTransition(async () => {
      const supabase = await getBrowserSupabase();
      const { error } = await supabase
        .from("progress")
        .delete()
        .eq("user_id", userId);

      if (error) {
        void notifyError("Progress reset failed.");
        return;
      }

      void notifySuccess("Your saved progress was reset");
      setIsConfirmingReset(false);
      window.location.reload();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <section className="rounded-lg border bg-card p-5">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
            <FieldDescription>
              Shows up on dashboard and printable packs.
            </FieldDescription>
            <Input
              id="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Student name"
            />
          </Field>

          <Field>
            <FieldLabel>Language subject</FieldLabel>
            <FieldDescription>
              This decides whether Hindi or French appears in dashboard,
              subjects, textbooks, and print packs.
            </FieldDescription>
            <LanguageSubjectPicker
              value={languageSubject}
              onChange={(value) => {
                if (value !== "keep") {
                  setLanguageSubject(value);
                }
              }}
            />
          </Field>
          <Button type="button" disabled={isPending} onClick={saveProfile}>
            <SaveIcon data-icon="inline-start" aria-hidden="true" />
            {isPending ? "Saving" : "Save profile"}
          </Button>
        </FieldGroup>
      </section>

      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-black">Account tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your saved progress and account details.
            </p>
          </div>

          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Progress rows:</strong> {progress.length}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={exportProgress}>
              <DownloadIcon data-icon="inline-start" aria-hidden="true" />
              Export progress JSON
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => setIsConfirmingReset(true)}
            >
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
              Reset progress
            </Button>
          </div>

          {isConfirmingReset && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3">
              <p className="text-sm font-medium">Reset only your progress?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Subjects, chapters, exercises, and other students stay safe.
                Only your saved progress is deleted.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setIsConfirmingReset(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  onClick={resetProgress}
                >
                  {isPending ? "Resetting" : "Yes, reset my progress"}
                </Button>
              </div>
            </div>
          )}

          {accountFooter}
        </div>
      </section>
    </div>
  );
}
