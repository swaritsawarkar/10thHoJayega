import type { ReactNode } from "react";
import type { Metadata } from "next";

import { AppShell } from "@/components/app/app-shell";
import { getProfile, requireUser } from "@/lib/auth";
import { getDisplayName } from "@/lib/progress";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const displayName = getDisplayName(user.email, profile?.display_name);

  return (
    <AppShell displayName={displayName} email={user.email ?? "student"}>
      {children}
    </AppShell>
  );
}
