import { redirect } from "next/navigation";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/app";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const claimsResult = await supabase.auth.getClaims();
  if (claimsResult.data?.claims) {
    const claims = claimsResult.data.claims;

    return {
      id: claims.sub,
      aud: Array.isArray(claims.aud) ? claims.aud[0] : claims.aud,
      email: claims.email,
      phone: claims.phone,
      role: claims.role,
      app_metadata: claims.app_metadata ?? {},
      user_metadata: claims.user_metadata ?? {},
      is_anonymous: claims.is_anonymous,
      created_at: "",
      updated_at: "",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

export const requireUser = cache(async () => {
  if (!isSupabaseConfigured()) {
    redirect("/setup");
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
});

export const getProfile = cache(
  async (userId: string): Promise<UserProfile | null> => {
    const supabase = await createClient();
    if (!supabase) {
      return null;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    return data;
  },
);
