/**
 * Live preview for `loader-skeleton-card`.
 *
 * Mirrors the `nextjs`/`typescript` code variant. No 'use client' - it's the
 * Suspense fallback shape, and fallbacks have nothing to hydrate.
 *
 * The `.skeleton-shimmer` helper in `globals.css` is an `::after` overlay
 * (`position: absolute; inset: 0`), which needs a positioned, clipping parent -
 * hence `relative overflow-hidden` on every block. The snippet documents and
 * uses that same mechanism, so this preview is not a deviation from it. The one
 * difference left is the dark selector: `globals.css` scopes the dark highlight
 * to `.dark` because next-themes toggles a class here, while the snippet uses
 * `prefers-color-scheme` so it works in a project with no such class. The
 * helper's reduced-motion block drops the sweep entirely; the layout is
 * identical either way, so nothing shifts.
 *
 * Keep this in step with `src/data/components/loaders.ts`.
 */
const BLOCK = 'skeleton-shimmer relative overflow-hidden bg-gray-200 dark:bg-gray-800';
const BAR = `${BLOCK} rounded-full`;

interface LoaderSkeletonCardProps {
  label?: string;
  className?: string;
}

export function LoaderSkeletonCard({ label = 'Loading card…', className = '' }: LoaderSkeletonCardProps) {
  return (
    <div
      role="status"
      className={`w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {/* One announcement for the card. The blocks are aria-hidden - nine
          anonymous placeholders read aloud is noise, not progress. */}
      <span className="sr-only">{label}</span>

      {/* aspect-video, not a fixed height: the reserved box has to track the
          real cover at every width or the swap jolts anyway. */}
      <div className={`${BLOCK} aspect-video w-full`} aria-hidden="true" />

      <div className="grid gap-2.5 px-4 pb-4 pt-3.5" aria-hidden="true">
        <div className={`${BAR} h-3.5 w-[70%]`} />
        <div className={`${BAR} h-2.5 w-full`} />
        <div className={`${BAR} h-2.5 w-[55%]`} />

        <div className="mt-1.5 flex items-center gap-2">
          <div className={`${BAR} h-6 w-6 flex-none`} />
          <div className={`${BAR} h-2.5 w-[35%]`} />
        </div>
      </div>
    </div>
  );
}

export default function LoaderSkeletonCardPreview() {
  return <LoaderSkeletonCard />;
}
