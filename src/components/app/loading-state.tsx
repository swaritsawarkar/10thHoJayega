import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
  label = "Loading the syllabus",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <p className="font-medium text-muted-foreground">{label}</p>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );
}
