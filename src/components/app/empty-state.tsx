import Link from "next/link";
import { NotebookTabsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <section className="rounded-lg border border-dashed bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-md bg-muted">
        <NotebookTabsIcon aria-hidden="true" />
      </div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {href && action && (
        <Button render={<Link href={href} />} className="mt-5">
          {action}
        </Button>
      )}
    </section>
  );
}
