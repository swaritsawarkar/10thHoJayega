"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  RotateCcwIcon,
} from "lucide-react";

import { getNextStatus, STATUS_LABELS } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { notifyError, notifySuccess } from "@/lib/client-effects";
import type { ProgressItemType, ProgressStatus } from "@/types/app";

const nextActionLabels: Record<ProgressStatus, string> = {
  0: "Start",
  1: "Mark revised once",
  2: "Mark mastered",
  3: "Mark board ready",
  4: "Reset to not started",
};

export function ProgressCycleButton({
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
  const savingRef = useRef(false);
  const [saveFailed, setSaveFailed] = useState(false);
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
    if (savingRef.current) return;
    savingRef.current = true;
    setSaveFailed(false);
    const previousStatus = status;
    setStatus(nextStatus);
    setIsSaving(true);

    let error: { message: string } | null = null;

    try {
      const { saveProgress } = await import("@/lib/actions/progress");
      const result = await saveProgress(itemType, itemId, nextStatus);
      error = result.error ? { message: result.error } : null;
    } catch {
      error = { message: "Unexpected save failure" };
    } finally {
      setIsSaving(false);
      savingRef.current = false;
    }

    if (error) {
      setStatus(previousStatus);
      setSaveFailed(true);
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
      <p
        role="status"
        className={`text-xs ${saveFailed ? "text-destructive" : "text-muted-foreground"}`}
      >
        {isSaving
          ? "Syncing to your account..."
          : saveFailed
            ? "Not saved. Click again to retry."
            : "Synced to your account"}
      </p>
      {showHint && (
        <p className="max-w-48 text-xs leading-snug text-muted-foreground">
          Current: {STATUS_LABELS[status]}. Click to set{" "}
          {STATUS_LABELS[nextStatus]}.
        </p>
      )}
    </div>
  );
}
