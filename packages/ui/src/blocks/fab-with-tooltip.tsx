/**
 * Live preview for `fab-with-tooltip`.
 *
 * Mirrors the `typescript` code variant; the only preview-only change is
 * `absolute` in place of the shipped `fixed bottom-6 right-6`, keeping the FAB
 * inside this bounded card rather than floating over the gallery page.
 *
 * The point of the component survives intact: the `aria-label` is the
 * accessible name, the bubble is `aria-hidden` decoration, and it appears on
 * `peer-hover` AND `peer-focus-visible` - Tab to the button to see it.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
const LABEL = 'Start a call';

export function FabWithTooltip() {
  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Hover the button - or Tab to it. The tooltip answers to both.
      </p>

      <div className="absolute bottom-6 right-6 inline-flex flex-row-reverse items-center gap-2">
        <button
          type="button"
          aria-label={LABEL}
          className="peer inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
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
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
          </svg>
        </button>

        {/* aria-hidden: the aria-label above is the name; this is the picture of it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[0.8125rem] font-medium text-white opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
        >
          {LABEL}
        </span>
      </div>
    </div>
  );
}


export default FabWithTooltip;
