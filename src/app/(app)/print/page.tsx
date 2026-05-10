import { PrintablePlanner } from "@/components/app/printable-planner";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import { getLanguageSubject } from "@/lib/language-subject";
import { calculateSnapshot, getDisplayName } from "@/lib/progress";

export default async function PrintPage() {
  const user = await requireUser();
  const languageSubject = getLanguageSubject(null, user);
  const metadataDisplayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : null;
  const data = await getAppData(user.id, languageSubject, {
    includeExercises: false,
  });
  const snapshot = calculateSnapshot(
    data.subjects,
    data.chapters,
    data.progress,
  );

  return (
    <PrintablePlanner
      userLabel={getDisplayName(user.email, metadataDisplayName)}
      generatedDate={new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
      subjects={data.subjects}
      chapters={data.chapters}
      progress={data.progress}
      snapshot={snapshot}
    />
  );
}
