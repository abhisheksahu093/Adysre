'use client';

import { Printer } from 'lucide-react';

/**
 * "Save as PDF" - triggers the browser's print dialog, where the user chooses
 * "Save as PDF". This is the dependency-free PDF export: the print stylesheet on
 * the report page produces a clean document, and no server-side renderer is
 * needed. The button itself is hidden when printing (see the report page's
 * print CSS).
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-print-hide
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Printer className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
