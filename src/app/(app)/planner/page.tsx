import { Suspense } from "react";
import { StudyPlanner } from "@/components/app/study-planner";
import { LoadingState } from "@/components/app/loading-state";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import { getLanguageSubject } from "@/lib/language-subject";

export default function PlannerPage() {
  return (
    <Suspense fallback={<LoadingState label="Opening planner" />}>
      <PlannerContent />
    </Suspense>
  );
}

async function PlannerContent() {
  const user = await requireUser();
  const { chapters } = await getAppData(
    user.id,
    getLanguageSubject(null, user),
    { includeExercises: false },
  );
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black">Plan it. Then do it.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Daily targets, a calendar, and a clear view of what still needs work.
        </p>
      </div>
      <StudyPlanner userId={user.id} chapters={chapters} />
    </div>
  );
}
