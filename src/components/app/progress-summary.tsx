import { BookCheckIcon, FlameIcon, TargetIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROGRESS_STATUSES, STATUS_LABELS } from "@/lib/progress";
import type { ProgressSnapshot } from "@/types/app";

export function ProgressSummary({
  snapshot,
  compact = false,
}: {
  snapshot: ProgressSnapshot;
  compact?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TargetIcon aria-hidden="true" />
          Overall syllabus progress
        </CardTitle>
        <CardDescription>
          This chapter is not going to revise itself.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between gap-3">
            <p className="text-5xl font-black leading-none">
              {snapshot.overallPercent}%
            </p>
            <p className="text-sm text-muted-foreground">
              {snapshot.totalChapters} chapters tracked
            </p>
          </div>
          <Progress value={snapshot.overallPercent} />
        </div>

        <div className="grid gap-2 sm:grid-cols-5">
          {PROGRESS_STATUSES.map((status) => (
            <div
              key={status}
              className="rounded-md border bg-muted/30 p-3 text-center"
            >
              <p className="text-2xl font-black">
                {snapshot.statusCounts[status]}
              </p>
              <p className="text-xs text-muted-foreground">
                {STATUS_LABELS[status]}
              </p>
            </div>
          ))}
        </div>

        {!compact && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {snapshot.subjectPercents.map((subject) => (
              <div
                key={subject.subjectId}
                className="flex items-center justify-between gap-3 rounded-md border bg-background p-3"
              >
                <div>
                  <p className="font-semibold">{subject.subjectName}</p>
                  <p className="text-xs text-muted-foreground">
                    {subject.total} chapters
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-sm">
                  {subject.percent === 100 ? (
                    <FlameIcon aria-hidden="true" />
                  ) : (
                    <BookCheckIcon aria-hidden="true" />
                  )}
                  {subject.percent}%
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
