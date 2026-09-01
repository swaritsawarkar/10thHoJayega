import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md shadow-sm ring-1 ring-border/70",
        className,
      )}
    >
      <Image
        src="/brand-icon.png"
        alt=""
        width={512}
        height={512}
        className="size-full object-contain"
        draggable={false}
      />
    </span>
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-14 shrink-0 items-center overflow-hidden rounded-md px-2 shadow-sm ring-1 ring-border/70",
        className,
      )}
    >
      <Image
        src="/brand-logo.png"
        alt=""
        width={1025}
        height={242}
        className="h-full w-auto object-contain"
        draggable={false}
      />
    </span>
  );
}
