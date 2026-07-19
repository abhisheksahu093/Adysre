/**
 * Live preview for `fab-mini`.
 *
 * Mirrors the `typescript` code variant with two preview-only changes: the
 * button is `absolute` inside this bounded card rather than `fixed`, and the
 * focus ring offset matches this card (`ring-offset-gray-50`). At 44px it sits
 * exactly on the minimum comfortable touch target.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
export default function FabMiniPreview() {
  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        A 44px mini FAB - trimmed to the touch-target floor, no smaller.
      </p>

      <button
        type="button"
        aria-label="Add item"
        className="absolute bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-safe:hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
