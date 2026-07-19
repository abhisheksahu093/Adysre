/**
 * Live preview for `fab-basic`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the
 * button is `absolute` inside this bounded card rather than `fixed` to the
 * viewport. The stage measures `document.body.scrollHeight` to size its iframe,
 * and a fixed element contributes nothing to that - it would float over the
 * whole gallery page and the card would collapse to nothing. The shipped
 * component uses `fixed bottom-6 right-6`.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
export default function FabBasicPreview() {
  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Tab to the button - the ring is drawn against the page, not the FAB.
      </p>

      <button
        type="button"
        aria-label="New message"
        className="absolute bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-safe:hover:-translate-y-px dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className="h-6 w-6"
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
