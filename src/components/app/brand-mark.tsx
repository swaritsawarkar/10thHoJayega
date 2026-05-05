import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-foreground bg-foreground text-background",
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="size-full" focusable="false">
        <rect
          x="10"
          y="9"
          width="44"
          height="46"
          rx="8"
          fill="hsl(var(--foreground))"
        />
        <rect
          x="15"
          y="14"
          width="34"
          height="36"
          rx="5"
          fill="hsl(var(--background))"
        />
        <path
          d="M21 36.5l7 7L43.5 25"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path
          d="M21 23h20"
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M21 30h12"
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
    </span>
  );
}
