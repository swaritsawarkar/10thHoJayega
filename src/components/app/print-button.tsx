"use client";

import { PrinterIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton({
  label = "Print / Save as PDF",
}: {
  label?: string;
}) {
  return (
    <Button type="button" onClick={() => window.print()}>
      <PrinterIcon data-icon="inline-start" aria-hidden="true" />
      {label}
    </Button>
  );
}
