/**
 * Live preview for `fab-extended`.
 *
 * Mirrors the `typescript` code variant; the only preview-only change is
 * `absolute` in place of the shipped `fixed bottom-6 right-6`, so the button
 * stays inside this bounded card instead of floating over the gallery page.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
export function FabExtended() {
  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        The visible label is also the accessible name - no aria-label to drift.
      </p>

      <button
        type="button"
        className="absolute bottom-6 right-6 inline-flex h-14 items-center gap-2 rounded-full bg-blue-600 px-6 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-safe:hover:-translate-y-px dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className="h-5 w-5 shrink-0"
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
        New invoice
      </button>
    </div>
  );
}


export default FabExtended;
