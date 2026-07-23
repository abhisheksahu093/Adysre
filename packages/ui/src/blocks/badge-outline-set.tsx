'use client';

/**
 * Live preview for `badge-outline-set`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/badges.ts`.
 */
type OutlineColor = 'gray' | 'blue' | 'green' | 'amber' | 'red';

interface OutlineBadgeProps {
  label: string;
  color?: OutlineColor;
  className?: string;
}

const OUTLINE_COLORS: Record<OutlineColor, string> = {
  gray: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  blue: 'border-blue-300 text-blue-700 dark:border-blue-500/40 dark:text-blue-300',
  green: 'border-green-300 text-green-700 dark:border-green-500/40 dark:text-green-300',
  amber: 'border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-300',
  red: 'border-red-300 text-red-700 dark:border-red-500/40 dark:text-red-300',
};

export function OutlineBadge({ label, color = 'gray', className = '' }: OutlineBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${OUTLINE_COLORS[color]} ${className}`}
    >
      {label}
    </span>
  );
}

export default function BadgeOutlineSetPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-6">
      <OutlineBadge label="Draft" color="gray" />
      <OutlineBadge label="Beta" color="blue" />
      <OutlineBadge label="Stable" color="green" />
      <OutlineBadge label="Deprecated" color="amber" />
      <OutlineBadge label="Removed" color="red" />
    </div>
  );
}
