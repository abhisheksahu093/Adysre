import type { ReactNode } from 'react';

/**
 * The empty state every assets group falls back to.
 *
 * It lives on its own so the three groups share one shape without importing
 * each other or the panel shell that imports them (which would be a cycle).
 * It matches the layers panel's empty row, so the whole rail reads the same.
 */
export function AssetsEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border p-3 text-center text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
