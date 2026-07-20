import { cn } from '@adysre/ui';

/**
 * A single shimmering placeholder block. Respects reduced-motion (the pulse is
 * disabled), and uses the muted token so it reads in both themes.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)} aria-hidden />;
}

/**
 * The shared loading state for a library page (components, icons, palettes,
 * gradients, patterns, prompts). Mirrors the real layout - title, search/filter
 * row, then a card or icon grid - so the swap to real content doesn't jump.
 * `variant` picks the grid density; `icons` renders the dense square grid.
 */
export function LibraryPageSkeleton({ variant = 'cards' }: { variant?: 'cards' | 'icons' }) {
  return (
    <div className="space-y-6" role="status" aria-busy="true">
      <span className="sr-only">Loading…</span>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-9 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-full sm:w-64" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>

      {variant === 'icons' ? (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
          {Array.from({ length: 50 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      )}
    </div>
  );
}
