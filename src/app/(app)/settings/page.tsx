import { SettingsPanel } from "@/components/app/settings-panel";
import { LogoutButton } from "@/components/app/logout-button";
import { getProfile, requireUser } from "@/lib/auth";
import { getUserProgress } from "@/lib/db";
import { getLanguageSubject } from "@/lib/language-subject";

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const languageSubject = getLanguageSubject(profile, user);
  const progress = await getUserProgress(user.id);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <p className="font-mono text-sm text-muted-foreground">Settings</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">
          Account and progress controls.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Edit your display name, export progress, or reset only your own
          progress rows. Pick Hindi or French here too.
        </p>
      </section>
      <SettingsPanel
        userId={user.id}
        email={user.email ?? "student"}
        profile={profile}
        initialLanguageSubject={languageSubject}
        progress={progress}
        accountFooter={<LogoutButton className="w-full sm:w-fit" />}
      />
    </div>
  );
}
