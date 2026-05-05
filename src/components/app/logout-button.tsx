"use client";

import { useState } from "react";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    window.location.href = "/login";
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      disabled={isLoading}
      onClick={handleLogout}
    >
      <LogOutIcon data-icon="inline-start" aria-hidden="true" />
      {isLoading ? "Logging out" : "Logout"}
    </Button>
  );
}
