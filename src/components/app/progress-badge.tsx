import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { ProgressStatus } from "@/types/app";

const statusClasses: Record<ProgressStatus, string> = {
  0: "border-border bg-background text-muted-foreground",
  1: "border-amber-300 bg-amber-50 text-amber-950",
  2: "border-sky-300 bg-sky-50 text-sky-950",
  3: "border-emerald-300 bg-emerald-50 text-emerald-950",
  4: "border-foreground bg-foreground text-background",
};

export function ProgressBadge({
  status,
  className,
}: {
  status: ProgressStatus;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(statusClasses[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
