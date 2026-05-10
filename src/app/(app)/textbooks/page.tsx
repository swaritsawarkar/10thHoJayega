import { Suspense } from "react";

import { LoadingState } from "@/components/app/loading-state";
import { TextbookLinks } from "@/components/app/textbook-links";
import { requireUser } from "@/lib/auth";
import { getLanguageSubject } from "@/lib/language-subject";

export default function TextbooksPage() {
  return (
    <Suspense fallback={<LoadingState label="Opening textbooks" />}>
      <TextbooksContent />
    </Suspense>
  );
}

async function TextbooksContent() {
  const user = await requireUser();
  const languageSubject = getLanguageSubject(null, user);

  return <TextbookLinks languageSubject={languageSubject} />;
}
