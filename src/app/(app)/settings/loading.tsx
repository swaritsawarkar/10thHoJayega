import { LoadingState } from "@/components/app/loading-state";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-32 rounded-lg border bg-card" />
      <LoadingState label="Loading settings" />
    </div>
  );
}
