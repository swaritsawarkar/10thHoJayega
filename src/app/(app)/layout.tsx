import type { ReactNode } from "react";
import type { Metadata } from "next";

import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/auth";
import { getDisplayName } from "@/lib/progress";

export const dynamic = "force-dynamic";
export const runtime = "edge";
export const preferredRegion = "global";

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
  const metadataDisplayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : null;
  const displayName = getDisplayName(user.email, metadataDisplayName);

  return (
    <AppShell displayName={displayName} email={user.email ?? "student"}>
      {children}
    </AppShell>
  );
}
