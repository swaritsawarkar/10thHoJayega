import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database";

let adminClient: ReturnType<typeof createSupabaseClient<Database>> | null =
  null;

export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!isSupabaseConfigured() || !serviceRoleKey.trim()) {
    return null;
  }

  if (!adminClient) {
    const { url } = getSupabaseEnv();

    adminClient = createSupabaseClient<Database>(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
