/**
 * Live preview for `fab-progress-ring`.
 *
 * Mirrors the `typescript` code variant with two preview-only changes: the root
 * is `absolute` inside this bounded card rather than `fixed`, and the focus ring
 * offset matches this card (`ring-offset-gray-50`). The ring is decorative
 * (aria-hidden) and shown at a fixed sample progress; the button keeps a plain
 * aria-label.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = 65;

export default function FabProgressRingPreview() {
  const clamped = Math.max(0, Math.min(100, PROGRESS));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        The ring tracks progress ({clamped}%); the button stays a plain labelled control.
      </p>

      <div className="absolute bottom-6 right-6 h-14 w-14">
        <svg
          className="absolute inset-0 h-14 w-14 -rotate-90"
          viewBox="0 0 56 56"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="28" cy="28" r={RADIUS} fill="none" strokeWidth="4" className="stroke-blue-100 dark:stroke-gray-800" />
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none dark:stroke-blue-400"
          />
        </svg>
        <button
          type="button"
          aria-label="Cancel upload"
          className="absolute inset-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
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
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
