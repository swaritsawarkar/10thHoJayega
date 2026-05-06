import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { AuthFormLoader } from "@/components/app/auth-form-loader";
import { SetupRequired } from "@/components/app/setup-required";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in or create a free 10thHoJayega account to save Class 10 syllabus progress and printable checklists.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,var(--background),var(--muted))] px-3 py-12 sm:px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="grid min-w-0 w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)] lg:items-center">
        <section className="min-w-0">
          <h1 className="text-4xl font-black leading-none tracking-normal sm:text-5xl">
            Login first. Then the syllabus can be bullied politely.
          </h1>
        </section>
        <AuthFormLoader />
      </div>
    </main>
  );
}
