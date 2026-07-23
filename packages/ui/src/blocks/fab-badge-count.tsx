/**
 * Live preview for `fab-badge-count`.
 *
 * Mirrors the `typescript` code variant with preview-only changes: the button is
 * `absolute` inside this bounded card rather than `fixed`, the focus ring offset
 * matches this card (`ring-offset-gray-50`), and the badge border matches the
 * card surface (`border-gray-50`). The count is carried in the aria-label; the
 * badge itself is decorative and aria-hidden.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
const COUNT = 5;
const LABEL = 'Notifications';

export function FabBadgeCount() {
  const clamped = Math.max(0, Math.round(COUNT));
  const display = clamped > 99 ? '99+' : String(clamped);

  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        The badge is aria-hidden - the count lives in the button&rsquo;s accessible name.
      </p>

      <button
        type="button"
        aria-label={clamped > 0 ? LABEL + ', ' + clamped + ' unread' : LABEL}
        className="absolute bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {clamped > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-gray-50 bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950"
          >
            {display}
          </span>
        ) : null}
      </button>
    </div>
  );
}


export default FabBadgeCount;
