import type { ReactNode } from "react";

import { Navbar } from "@/components/app/navbar";

export function AppShell({
  children,
  displayName,
  email,
}: {
  children: ReactNode;
  displayName: string;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--background),var(--muted))]">
      <Navbar displayName={displayName} email={email} />
      <main className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-4 lg:px-6">
        {children}
      </main>
    </div>
  );
}
