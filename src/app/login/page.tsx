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
    <main className="relative flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,var(--background),var(--muted))] px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <section>
          <h1 className="text-5xl font-black leading-none tracking-normal">
            Login first. Then the syllabus can be bullied politely.
          </h1>
        </section>
        <AuthFormLoader />
      </div>
    </main>
  );
}
