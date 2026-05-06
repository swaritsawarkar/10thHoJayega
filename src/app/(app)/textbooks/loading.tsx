import { LoadingState } from "@/components/app/loading-state";

export default function TextbooksLoading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingState label="Loading textbook links" />
    </div>
  );
}
