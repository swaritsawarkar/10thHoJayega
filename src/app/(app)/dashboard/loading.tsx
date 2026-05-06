import { LoadingState } from "@/components/app/loading-state";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-36 rounded-lg border bg-card" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-28 rounded-lg border bg-card" />
        <div className="h-28 rounded-lg border bg-card" />
        <div className="h-28 rounded-lg border bg-card" />
      </div>
      <LoadingState label="Loading dashboard" />
    </div>
  );
}
