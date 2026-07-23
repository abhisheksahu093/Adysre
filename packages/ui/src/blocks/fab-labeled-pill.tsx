/**
 * Live preview for `fab-labeled-pill`.
 *
 * Mirrors the `typescript` code variant with two preview-only changes: the
 * button is `absolute` inside this bounded card rather than `fixed`, and the
 * focus ring offset matches this card (`ring-offset-gray-50`). Hover it or tab
 * to it - the label reveals leftward, and because it is real text inside the
 * button it is also the accessible name.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
export function FabLabeledPill() {
  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Hover or focus the button - the label expands into view.
      </p>

      <button
        type="button"
        className="group absolute bottom-6 right-6 z-40 inline-flex h-14 items-center justify-end rounded-full bg-blue-600 px-4 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.9375rem] font-semibold opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:max-w-xs group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:max-w-xs group-focus-visible:opacity-100 motion-reduce:transition-none">
          New task
        </span>
        <svg
          className="h-6 w-6 shrink-0"
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


export default FabLabeledPill;
