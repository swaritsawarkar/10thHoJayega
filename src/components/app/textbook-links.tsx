import { ExternalLinkIcon, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { officialResourceLinks } from "@/lib/textbook-links";
import { isSubjectVisibleForLanguage } from "@/lib/language-subject";
import type { LanguageSubject } from "@/lib/language-subject";

export function TextbookLinks({
  languageSubject,
}: {
  languageSubject: LanguageSubject;
}) {
  const visibleResourceLinks = officialResourceLinks.filter(
    (group) =>
      group.subjectId === "curriculum" ||
      isSubjectVisibleForLanguage(group.subjectId, languageSubject),
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border bg-card p-5">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon aria-hidden="true" />
          <div>
            <h1 className="text-4xl font-black tracking-normal">
              Official textbook links
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              NCERT links only. No shady PDF jugaad.
            </p>
            <p className="mt-3 rounded-md border bg-muted/40 p-3 text-sm">
              Books open from official NCERT sources. This app does not re-host
              copyrighted textbooks.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleResourceLinks.map((group) => (
          <Card key={group.subject}>
            <CardHeader>
              <CardTitle>{group.subject}</CardTitle>
              <CardDescription>
                Official source links. Verify the exact book on the NCERT/CBSE
                page before downloading.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {group.links.map((link) => (
                <Button
                  key={`${group.subject}-${link.href}`}
                  variant="outline"
                  render={
                    <a href={link.href} target="_blank" rel="noreferrer" />
                  }
                >
                  {link.label}
                  <ExternalLinkIcon data-icon="inline-end" aria-hidden="true" />
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
