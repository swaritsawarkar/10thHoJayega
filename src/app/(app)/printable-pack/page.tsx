import { PrintablePack } from "@/components/app/printable-pack";
import { getProfile, requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import { getLanguageSubject } from "@/lib/language-subject";
import { calculateSnapshot, getDisplayName } from "@/lib/progress";

export default async function PrintablePackPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const data = await getAppData(user.id, languageSubject);
  const snapshot = calculateSnapshot(
    data.subjects,
    data.chapters,
    data.progress,
  );

  return (
    <PrintablePack
      userLabel={getDisplayName(user.email, profile?.display_name)}
      generatedDate={new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
      subjects={data.subjects}
      chapters={data.chapters}
      exercises={data.exercises}
      progress={data.progress}
      snapshot={snapshot}
    />
  );
}
