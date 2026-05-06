"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, MailIcon } from "lucide-react";

import { LanguageSubjectPicker } from "@/components/app/language-subject-picker";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getBrowserSupabase, notifySuccess } from "@/lib/client-effects";
import type { LanguageSubject } from "@/lib/language-subject";

type AuthMode = "login" | "signup";

function getFriendlyAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("email rate limit")) {
    return "Too many sign-in emails were sent. Wait a bit, then try again.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Email is not confirmed yet. Check your inbox, then log in again.";
  }

  if (normalized.includes("already registered")) {
    return "This email is already registered. Try Login instead.";
  }

  return message;
}

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [languageSubject, setLanguageSubject] =
    useState<LanguageSubject>("hindi");
  const [loginLanguageSelection, setLoginLanguageSelection] = useState<
    LanguageSubject | "keep"
  >("keep");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function saveLanguagePreference(
    userId: string,
    nextLanguageSubject: LanguageSubject,
    nextDisplayName?: string,
  ) {
    const supabase = await getBrowserSupabase();

    await supabase.auth.updateUser({
      data: {
        language_subject: nextLanguageSubject,
        ...(nextDisplayName ? { display_name: nextDisplayName } : {}),
      },
    });

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      ...(nextDisplayName ? { display_name: nextDisplayName } : {}),
      language_subject: nextLanguageSubject,
    });

    if (
      profileError &&
      !profileError.message.toLowerCase().includes("language_subject")
    ) {
      throw profileError;
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = await getBrowserSupabase();
    const trimmedEmail = email.trim();

    if (mode === "login") {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

      if (signInError) {
        setError(getFriendlyAuthError(signInError.message));
        setIsLoading(false);
        return;
      }

      if (loginLanguageSelection !== "keep" && data.user) {
        try {
          await saveLanguagePreference(data.user.id, loginLanguageSelection);
        } catch (preferenceError) {
          setError(
            getFriendlyAuthError(
              preferenceError instanceof Error
                ? preferenceError.message
                : "Language preference did not save.",
            ),
          );
          setIsLoading(false);
          return;
        }
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            display_name: displayName.trim() || null,
            language_subject: languageSubject,
          },
        },
      });

      if (signUpError) {
        setError(getFriendlyAuthError(signUpError.message));
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        void notifySuccess("Account created. Confirm your email, then log in.");
        setMode("login");
        setLoginLanguageSelection(languageSubject);
        setPassword("");
        setError("Account created. Confirm your email, then log in here.");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        try {
          await saveLanguagePreference(
            data.user.id,
            languageSubject,
            displayName.trim(),
          );
        } catch (preferenceError) {
          setError(
            getFriendlyAuthError(
              preferenceError instanceof Error
                ? preferenceError.message
                : "Language preference did not save.",
            ),
          );
          setIsLoading(false);
          return;
        }
      }
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <section className="w-full max-w-lg rounded-lg border bg-card p-5 shadow-sm">
      <div className="mb-5 flex rounded-md border bg-muted p-1">
        {(["login", "signup"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`h-10 flex-1 rounded-sm text-sm font-semibold transition ${
              mode === item
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setMode(item);
              setError("");
            }}
          >
            {item === "login" ? "Login" : "Signup"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              aria-invalid={Boolean(error)}
              className="h-10"
            />
          </Field>

          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              aria-invalid={Boolean(error)}
              className="h-10"
            />
            <FieldError>{error}</FieldError>
          </Field>

          {mode === "signup" && (
            <>
              <Field>
                <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Board survivor name"
                  autoComplete="name"
                  className="h-10"
                />
                <FieldDescription>
                  Optional. You can change it later in settings.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Language subject</FieldLabel>
                <FieldDescription>
                  Pick the one your school actually makes you study.
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
            </>
          )}

          {mode === "login" && (
            <Field>
              <FieldLabel>Language subject</FieldLabel>
              <FieldDescription>
                Keep your saved Hindi/French choice, or switch it after typing
                your credentials.
              </FieldDescription>
              <LanguageSubjectPicker
                value={loginLanguageSelection}
                allowKeepSaved
                onChange={setLoginLanguageSelection}
              />
            </Field>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2Icon
                data-icon="inline-start"
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <MailIcon data-icon="inline-start" aria-hidden="true" />
            )}
            {mode === "login" ? "Start tracking" : "Create account"}
          </Button>
        </FieldGroup>
      </form>
    </section>
  );
}
