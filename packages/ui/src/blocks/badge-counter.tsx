'use client';

/**
 * Live preview for `badge-counter`.
 *
 * Mirrors the `typescript` code variant verbatim. The samples bracket the cap:
 * a single digit (circle), a double digit (pill), and 120 → "99+" so the cap
 * logic is visible, not hypothetical. Keep this in step with
 * `src/data/components/badges.ts`.
 */
interface CounterBadgeProps {
  count: number;
  max?: number;
  srLabel?: string;
  className?: string;
}

export function CounterBadge({ count, max = 99, srLabel = '', className = '' }: CounterBadgeProps) {
  if (count <= 0) return null;

  const display = count > max ? `${max}+` : String(count);

  return (
    <span
      className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[0.6875rem] font-semibold leading-none text-white ${className}`}
    >
      {display}
      {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
    </span>
  );
}

export default function BadgeCounterPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6">
      <span className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        Inbox
        <CounterBadge count={3} srLabel="unread messages" />
      </span>
      <span className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        Alerts
        <CounterBadge count={42} srLabel="open alerts" />
      </span>
      <span className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        Notifications
        <CounterBadge count={120} srLabel="unread notifications" />
      </span>
    </div>
  );
}
