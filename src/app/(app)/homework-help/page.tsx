import { EmptyState } from "@/components/app/empty-state";
import { HomeworkHelper } from "@/components/app/homework-helper";
import { getProfile, requireUser } from "@/lib/auth";
import { isGoogleAiConfigured } from "@/lib/ai-env";
import { getAppData, getHomeworkHelpUsageCount } from "@/lib/db";
import {
  HOMEWORK_HELP_DAILY_LIMIT,
} from "@/lib/homework-help";
import { getLanguageSubject } from "@/lib/language-subject";

export default async function HomeworkHelpPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const { subjects, chapters } = await getAppData(user.id, languageSubject, {
    includeExercises: false,
  });
  const isAiConfigured = isGoogleAiConfigured();

  let usageCount = 0;
  let setupIssue: string | undefined;

  if (isAiConfigured) {
    try {
      usageCount = await getHomeworkHelpUsageCount(user.id);
    } catch {
      setupIssue =
        "Run supabase/update-homework-help.sql in Supabase so the daily AI limit can work.";
    }
  }

  const questionsLeft = Math.max(0, HOMEWORK_HELP_DAILY_LIMIT - usageCount);

  if (subjects.length === 0) {
    return (
      <EmptyState
        title="Seed subjects first"
        description="Homework Help uses your subject/chapter tracker for context. Run the Supabase schema and seed SQL, then come back."
        href="/setup"
        action="Open setup"
      />
    );
  }

  return (
    <HomeworkHelper
      subjects={subjects}
      chapters={chapters}
      initialQuestionsLeft={questionsLeft}
      dailyLimit={HOMEWORK_HELP_DAILY_LIMIT}
      isAiConfigured={isAiConfigured}
      setupIssue={setupIssue}
    />
  );
}
