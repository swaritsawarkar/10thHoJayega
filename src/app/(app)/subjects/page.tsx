import { SubjectCard } from "@/components/app/subject-card";
import { getProfile, requireUser } from "@/lib/auth";
import { getAppData } from "@/lib/db";
import {
  getLanguageSubject,
  getLanguageSubjectLabel,
} from "@/lib/language-subject";

export default async function SubjectsPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const languageSubjectLabel = getLanguageSubjectLabel(languageSubject);
  const { subjects, chapters, progress } = await getAppData(
    user.id,
    languageSubject,
    { includeExercises: false },
  );
  const hasLanguageSubjectRows = subjects.some(
    (subject) => subject.id === languageSubject,
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <p className="font-mono text-sm text-muted-foreground">Subjects</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal">
          Pick the battlefield.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Maths, Science, Social Science, English, and {languageSubjectLabel}{" "}
          are ready to track. Switch Hindi/French in settings if your school
          cooked the timetable differently.
        </p>
      </section>

      {!hasLanguageSubjectRows && (
        <section className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <h2 className="font-black">
            {languageSubjectLabel} rows are not seeded yet.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Run <code>supabase/update-language-subject.sql</code> once in
            Supabase. No fake subject rows here.
          </p>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            chapters={chapters}
            progress={progress}
          />
        ))}
      </div>
    </div>
  );
}
