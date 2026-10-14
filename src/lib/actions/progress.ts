"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  getCanonicalChapter,
  mergeExercisesWithCanonical,
} from "@/lib/syllabus-data";
import type { ProgressItemType, ProgressStatus } from "@/types/app";

export async function saveProgress(
  itemType: ProgressItemType,
  itemId: string,
  status: ProgressStatus,
) {
  if (
    (itemType !== "chapter" && itemType !== "exercise") ||
    typeof itemId !== "string" ||
    itemId.length > 200 ||
    !Number.isInteger(status) ||
    status < 0 ||
    status > 4
  ) {
    return { error: "Invalid progress update" };
  }
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in again to save progress" };
  const supabase = await createClient();
  if (!supabase) return { error: "Study data is not connected" };
  const canonicalItem =
    itemType === "chapter"
      ? getCanonicalChapter(itemId)
      : mergeExercisesWithCanonical([]).find(
          (exercise) => exercise.id === itemId,
        );
  if (!canonicalItem) {
    const { data, error } = await supabase
      .from(itemType === "chapter" ? "chapters" : "exercises")
      .select("id")
      .eq("id", itemId)
      .maybeSingle();
    if (error || !data) return { error: "Study item not found" };
  }
  const { data, error } = await supabase
    .from("progress")
    .upsert(
      { user_id: user.id, item_type: itemType, item_id: itemId, status },
      { onConflict: "user_id,item_type,item_id" },
    )
    .select("status")
    .single();
  if (error || data?.status !== status)
    return { error: "Save could not be confirmed" };
  revalidatePath("/(app)", "layout");
  return { error: null };
}
