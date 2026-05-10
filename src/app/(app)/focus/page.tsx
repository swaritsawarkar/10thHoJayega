import { Suspense } from "react";

import { FocusTimerLoader } from "@/components/app/focus-timer-loader";
import { LoadingState } from "@/components/app/loading-state";
import { requireUser } from "@/lib/auth";

export default function FocusPage() {
  return (
    <Suspense fallback={<LoadingState label="Opening focus mode" />}>
      <FocusContent />
    </Suspense>
  );
}

async function FocusContent() {
  const user = await requireUser();

  return <FocusTimerLoader userId={user.id} />;
}
