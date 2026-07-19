'use client';

/**
 * Live preview for `skeleton-loader`.
 *
 * Mirrors the `nextjs`/`typescript` code variant, rendered with an avatar and
 * three lines.
 *
 * The `.skeleton-shimmer` helper in `globals.css` is an `::after` overlay
 * (`position: absolute; inset: 0`), which needs a positioned, clipping parent -
 * hence `relative overflow-hidden` on every bar. The snippet documents and uses
 * that same mechanism, so this preview is no longer a deviation from it. The one
 * difference left is the dark selector: `globals.css` scopes the dark highlight
 * to `.dark` because next-themes toggles a class here, while the snippet uses
 * `prefers-color-scheme` so it works in a project with no such class.
 * Keep this in step with `src/data/components/loaders.ts`.
 */
interface SkeletonLoaderProps {
  lines?: number;
  showAvatar?: boolean;
  label?: string;
  className?: string;
}

const BAR = 'skeleton-shimmer relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800';

function SkeletonLoader({
  lines = 3,
  showAvatar = true,
  label = 'Loading…',
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div
      role="status"
      className={`grid max-w-sm gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span className="sr-only">{label}</span>

      {showAvatar ? (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className={`${BAR} h-11 w-11 flex-none`} />
          <div className="grid flex-1 gap-2">
            <div className={`${BAR} h-3 w-[45%]`} />
            <div className={`${BAR} h-2.5 w-[30%]`} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-2.5" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index: number) => (
          <div
            key={index}
            className={`${BAR} h-2.5`}
            style={{ width: index === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SkeletonLoaderPreview() {
  return <SkeletonLoader lines={3} showAvatar label="Loading…" className="w-full" />;
}
