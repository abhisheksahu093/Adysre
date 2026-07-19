'use client';

/**
 * Live preview for `badge-status-set`.
 *
 * Mirrors the `typescript` code variant verbatim. All four statuses render in
 * one wrapping row - badges are the one component whose realistic sample IS
 * the whole set. Keep this in step with `src/data/components/badges.ts`.
 */
type BadgeStatus = 'success' | 'warning' | 'danger' | 'info';

interface StatusBadgeProps {
  label: string;
  status?: BadgeStatus;
  className?: string;
}

const STATUS_STYLES: Record<BadgeStatus, { badge: string; dot: string }> = {
  success: {
    badge:
      'bg-green-50 text-green-800 ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/30',
    dot: 'bg-green-600 dark:bg-green-400',
  },
  warning: {
    badge:
      'bg-amber-50 text-amber-800 ring-amber-600/30 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  danger: {
    badge:
      'bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30',
    dot: 'bg-red-600 dark:bg-red-400',
  },
  info: {
    badge:
      'bg-blue-50 text-blue-800 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30',
    dot: 'bg-blue-600 dark:bg-blue-400',
  },
};

function StatusBadge({ label, status = 'info', className = '' }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles.badge} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function BadgeStatusSetPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-6">
      <StatusBadge label="Success" status="success" />
      <StatusBadge label="Pending review" status="warning" />
      <StatusBadge label="Failed" status="danger" />
      <StatusBadge label="In progress" status="info" />
    </div>
  );
}
