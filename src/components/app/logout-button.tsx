import { LogOutIcon } from "lucide-react";

import { signOut } from "@/lib/actions/auth";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={cn(
          buttonVariants({
            variant: "outline",
            size: compact ? "sm" : "default",
          }),
          className,
        )}
      >
        <LogOutIcon data-icon="inline-start" aria-hidden="true" />
        Logout
      </button>
    </form>
  );
}
