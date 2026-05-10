import { TextbookLinks } from "@/components/app/textbook-links";
import { requireUser } from "@/lib/auth";
import { getLanguageSubject } from "@/lib/language-subject";

export default async function TextbooksPage() {
  const user = await requireUser();
  const languageSubject = getLanguageSubject(null, user);

  return <TextbookLinks languageSubject={languageSubject} />;
}
