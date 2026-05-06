import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-md shadow-sm",
        className,
      )}
    >
      <svg viewBox="0 0 96 96" className="size-full" focusable="false">
        <rect width="96" height="96" rx="22" fill="var(--foreground)" />
        <rect
          x="12"
          y="12"
          width="72"
          height="72"
          rx="17"
          fill="var(--background)"
        />
        <path d="M31 28h-8v-7h16v53h-8V28Z" fill="var(--foreground)" />
        <path
          d="M58 21c12.7 0 20 10.4 20 26.5S70.7 74 58 74 38 63.6 38 47.5 45.3 21 58 21Zm0 8c-7.1 0-11.2 6.8-11.2 18.5S50.9 66 58 66s11.2-6.8 11.2-18.5S65.1 29 58 29Z"
          fill="var(--foreground)"
        />
        <path
          d="M25 62.5 39.5 77 74 35"
          fill="none"
          stroke="var(--ring)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="9"
        />
        <path
          d="M25 62.5 39.5 77 74 35"
          fill="none"
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
      </svg>
    </span>
  );
}
