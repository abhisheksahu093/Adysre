'use client';

/**
 * Live preview for `badge-verified-check`.
 *
 * Mirrors the `typescript` code variant verbatim, shown the way it is used in
 * the wild - inline after a name. Keep this in step with
 * `src/data/components/badges.ts`.
 */
interface VerifiedBadgeProps {
  label?: string;
  className?: string;
}

function VerifiedBadge({ label = 'Verified', className = '' }: VerifiedBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-blue-500"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 1.5l2.09 2.02 2.83-.6 1.1 2.67 2.67 1.1-.6 2.83L22.5 12l-2.41 2.48.6 2.83-2.67 1.1-1.1 2.67-2.83-.6L12 22.5l-2.09-2.02-2.83.6-1.1-2.67-2.67-1.1.6-2.83L1.5 12l2.41-2.48-.6-2.83 2.67-1.1 1.1-2.67 2.83.6L12 1.5z" />
        <path
          d="M8.6 12.3l2.2 2.2 4.6-4.9"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

export default function BadgeVerifiedCheckPreview() {
  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
          MK
        </span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mira Kaplan</span>
        <VerifiedBadge />
      </div>
      <VerifiedBadge label="Verified seller" />
    </div>
  );
}
