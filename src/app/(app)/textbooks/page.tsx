import { TextbookLinks } from "@/components/app/textbook-links";
import { getProfile, requireUser } from "@/lib/auth";
import { getLanguageSubject } from "@/lib/language-subject";

export default async function TextbooksPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);

  return <TextbookLinks languageSubject={languageSubject} />;
}
