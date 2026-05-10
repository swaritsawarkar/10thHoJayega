"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  RotateCcwIcon,
} from "lucide-react";

import { getNextStatus, STATUS_LABELS } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import {
  getBrowserSupabase,
  notifyError,
  notifySuccess,
} from "@/lib/client-effects";
import type { ProgressItemType, ProgressStatus } from "@/types/app";

const nextActionLabels: Record<ProgressStatus, string> = {
  0: "Start",
  1: "Mark revised once",
  2: "Mark mastered",
  3: "Mark board ready",
  4: "Reset to not started",
};

export function ProgressCycleButton({
  userId,
  itemType,
  itemId,
  initialStatus,
  size = "sm",
  showHint = true,
  onSaved,
}: {
  userId: string;
  itemType: ProgressItemType;
  itemId: string;
  initialStatus: ProgressStatus;
  size?: "sm" | "default";
  showHint?: boolean;
  onSaved?: (status: ProgressStatus) => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [, startRefresh] = useTransition();
  const nextStatus = getNextStatus(status);
  const itemLabel = itemType === "chapter" ? "chapter" : "exercise";
  const actionLabel =
    status === 0 ? `Start ${itemLabel}` : nextActionLabels[status];
  const Icon =
    status === 4
      ? RotateCcwIcon
      : status === 0
        ? CircleDashedIcon
        : CheckCircle2Icon;

  async function handleClick() {
    const previousStatus = status;
    setStatus(nextStatus);
    setIsSaving(true);

    let error: { message: string } | null = null;

    try {
      const supabase = await getBrowserSupabase();
      const result = await supabase.from("progress").upsert(
        {
          user_id: userId,
          item_type: itemType,
          item_id: itemId,
          status: nextStatus,
        },
        { onConflict: "user_id,item_type,item_id" },
      );
      error = result.error;
    } catch {
      error = { message: "Unexpected save failure" };
    } finally {
      setIsSaving(false);
    }

    if (error) {
      setStatus(previousStatus);
      void notifyError("Save failed. Reverted the status.");
      return;
    }

    onSaved?.(nextStatus);
    void notifySuccess(`${STATUS_LABELS[nextStatus]} saved`);
    startRefresh(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex max-w-full flex-col items-start gap-1">
      <Button
        type="button"
        size={size}
        variant={status === 4 ? "default" : "outline"}
        disabled={isSaving}
        onClick={handleClick}
        aria-label={`Current status is ${STATUS_LABELS[status]}. Click to set ${STATUS_LABELS[nextStatus]}.`}
      >
        <Icon data-icon="inline-start" aria-hidden="true" />
        {isSaving ? "Saving" : actionLabel}
      </Button>
      {showHint && (
        <p className="max-w-48 text-xs leading-snug text-muted-foreground">
          Current: {STATUS_LABELS[status]}. Click to set{" "}
          {STATUS_LABELS[nextStatus]}.
        </p>
      )}
    </div>
  );
}
