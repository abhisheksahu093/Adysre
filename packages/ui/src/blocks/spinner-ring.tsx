/**
 * Live preview for `spinner-ring`.
 *
 * Mirrors the `nextjs`/`typescript` code variant. No 'use client' - the spinner
 * is markup and a CSS animation, with nothing to hydrate.
 *
 * `motion-reduce:animate-none` is the part that matters and the part you can't
 * see here unless your OS says so: under prefers-reduced-motion the ring stops
 * but stays, because something must still mark the spot as busy. The two-tone
 * gap reads perfectly well standing still, and the role="status" label is what
 * carries the meaning either way.
 *
 * Keep this in step with `src/data/components/loaders.ts`.
 */
interface SpinnerRingProps {
  label?: string;
  className?: string;
}

export function SpinnerRing({ label = 'Loading…', className = '' }: SpinnerRingProps) {
  return (
    <div role="status" className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Decoration - a spinning SVG has nothing an assistive tech can read.
          The transparent quarter is load-bearing: a solid ring spinning looks
          exactly like a solid ring at rest. */}
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700 motion-reduce:animate-none dark:border-blue-800 dark:border-t-blue-300"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function SpinnerRingPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SpinnerRing />

      {/* The visible caption is preview scaffolding - the real component's only
          text is the sr-only label, which is the point. */}
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Announced as &ldquo;Loading&hellip;&rdquo; &mdash; the ring itself is aria-hidden.
      </p>
    </div>
  );
}
