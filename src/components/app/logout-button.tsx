import { LogOutIcon } from "lucide-react";

import { signOut } from "@/lib/actions/auth";
import { buttonVariants } from "@/components/ui/button-variants";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={buttonVariants({
          variant: "outline",
          size: compact ? "sm" : "default",
        })}
      >
        <LogOutIcon data-icon="inline-start" aria-hidden="true" />
        Logout
      </button>
    </form>
  );
}
