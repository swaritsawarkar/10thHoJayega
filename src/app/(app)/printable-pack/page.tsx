import { Suspense } from "react";

import { LoadingState } from "@/components/app/loading-state";
import { PrintablePack } from "@/components/app/printable-pack";
import { requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import { getLanguageSubject } from "@/lib/language-subject";
import { calculateSnapshot, getDisplayName } from "@/lib/progress";

export default function PrintablePackPage() {
  return (
    <Suspense fallback={<LoadingState label="Opening printable pack" />}>
      <PrintablePackContent />
    </Suspense>
  );
}

async function PrintablePackContent() {
  const user = await requireUser();
  const languageSubject = getLanguageSubject(null, user);
  const metadataDisplayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : null;
  const data = await getAppData(user.id, languageSubject);
  const snapshot = calculateSnapshot(
    data.subjects,
    data.chapters,
    data.progress,
  );

  return (
    <PrintablePack
      userLabel={getDisplayName(user.email, metadataDisplayName)}
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
