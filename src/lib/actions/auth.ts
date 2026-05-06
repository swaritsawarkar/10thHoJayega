"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut({ scope: "local" });
  }

  redirect("/login");
}

export type DeleteAccountState = {
  message: string;
};

export async function deleteAccount(
  _previousState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const confirmation = String(formData.get("confirm") ?? "");

  if (confirmation !== "DELETE") {
    return { message: "Type DELETE to confirm account deletion." };
  }

  const supabase = await createClient();
  const admin = createAdminClient();

  if (!supabase) {
    return { message: "Supabase is not configured for this project yet." };
  }

  if (!admin) {
    return {
      message:
        "Account deletion needs SUPABASE_SERVICE_ROLE_KEY on the server.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { message: "Log in again before deleting this account." };
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(
    user.id,
    false,
  );

  if (deleteError) {
    return { message: deleteError.message || "Account deletion failed." };
  }

  await supabase.auth.signOut({ scope: "local" });

  redirect("/login");
}
