import { LoadingState } from "@/components/app/loading-state";

export default function PrintablePackLoading() {
  return (
    <div className="flex flex-col gap-6">
      <LoadingState label="Generating printable pack" />
    </div>
  );
}
