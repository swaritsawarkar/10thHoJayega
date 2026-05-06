import { LoadingState } from "@/components/app/loading-state";

export default function PrintLoading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingState label="Preparing printable planner" />
    </div>
  );
}
