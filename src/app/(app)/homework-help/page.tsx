import { EmptyState } from "@/components/app/empty-state";
import { HomeworkHelperLoader } from "@/components/app/homework-helper-loader";
import { getProfile, requireUser } from "@/lib/auth";
import { isGoogleAiConfigured } from "@/lib/ai-env";
import { getAppData, getHomeworkHelpUsageCount } from "@/lib/db";
import { HOMEWORK_HELP_DAILY_LIMIT } from "@/lib/homework-help";
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
      setupIssue = "The daily question counter is not ready yet.";
    }
  }

  const questionsLeft = Math.max(0, HOMEWORK_HELP_DAILY_LIMIT - usageCount);

  if (subjects.length === 0) {
    return (
      <EmptyState
        title="Load subjects first"
        description="Homework Help uses your subject and chapter tracker for context. Ask the project owner to load the syllabus, then come back."
        href="/setup"
        action="Open setup"
      />
    );
  }

  return (
    <HomeworkHelperLoader
      subjects={subjects}
      chapters={chapters}
      initialQuestionsLeft={questionsLeft}
      dailyLimit={HOMEWORK_HELP_DAILY_LIMIT}
      isAiConfigured={isAiConfigured}
      setupIssue={setupIssue}
    />
  );
}
