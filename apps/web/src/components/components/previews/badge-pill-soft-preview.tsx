'use client';

/**
 * Live preview for `badge-pill-soft`.
 *
 * Mirrors the `typescript` code variant verbatim. Shows all six colours at the
 * default size plus the three sizes side by side - the two axes the props
 * expose. Keep this in step with `src/data/components/badges.ts`.
 */
type PillColor = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet';
type PillSize = 'sm' | 'md' | 'lg';

interface PillBadgeProps {
  label: string;
  color?: PillColor;
  size?: PillSize;
  className?: string;
}

const PILL_COLORS: Record<PillColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
};

const PILL_SIZES: Record<PillSize, string> = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

function PillBadge({ label, color = 'gray', size = 'md', className = '' }: PillBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${PILL_COLORS[color]} ${PILL_SIZES[size]} ${className}`}
    >
      {label}
    </span>
  );
}

export default function BadgePillSoftPreview() {
  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PillBadge label="Design" color="gray" />
        <PillBadge label="Engineering" color="blue" />
        <PillBadge label="Marketing" color="green" />
        <PillBadge label="Operations" color="amber" />
        <PillBadge label="Urgent" color="red" />
        <PillBadge label="Research" color="violet" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PillBadge label="Small" color="blue" size="sm" />
        <PillBadge label="Medium" color="blue" size="md" />
        <PillBadge label="Large" color="blue" size="lg" />
      </div>
    </div>
  );
}
