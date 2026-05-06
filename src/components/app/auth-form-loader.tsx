"use client";

import { lazy, Suspense } from "react";

const AuthForm = lazy(() =>
  import("@/components/app/auth-form").then((module) => ({
    default: module.AuthForm,
  })),
);

export function AuthFormLoader() {
  return (
    <Suspense
      fallback={<div className="h-[420px] rounded-lg border bg-card" />}
    >
      <AuthForm />
    </Suspense>
  );
}
