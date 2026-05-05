import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculatePercent, getStatusForItem } from "@/lib/progress";
import { getSubjectDescription } from "@/lib/subject-copy";
import type { Chapter, Subject, UserProgress } from "@/types/app";

export function SubjectCard({
  subject,
  chapters,
  progress,
}: {
  subject: Subject;
  chapters: Chapter[];
  progress: UserProgress[];
}) {
  const subjectChapters = chapters.filter(
    (chapter) => chapter.subject_id === subject.id,
  );
  const percent = calculatePercent(
    subjectChapters.map((chapter) =>
      getStatusForItem(progress, "chapter", chapter.id),
    ),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{subject.name}</CardTitle>
        <CardDescription>{getSubjectDescription(subject)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <p className="text-4xl font-black">{percent}%</p>
          <p className="text-sm text-muted-foreground">
            {subjectChapters.length} chapters
          </p>
        </div>
        <Progress value={percent} />
      </CardContent>
      <CardFooter>
        <Button render={<Link href={`/subjects/${subject.id}`} />}>
          Open subject
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}
