/**
 * Live preview for `loader-bar-indeterminate`.
 *
 * Mirrors the `nextjs`/`typescript` code variant. No 'use client' - markup and
 * a CSS animation.
 *
 * ─── Why there's a <style> tag in here ──────────────────────────────────────
 * The sweep needs keyframes, and Tailwind has no utility for them. The skeleton
 * shimmer solves this with a helper in `globals.css`; this component is the only
 * thing in the library that wants `.ind-sweep`, so it carries its own rather
 * than growing the global sheet for one preview. The snippet tells you to add
 * the same helper once, globally - which is the right call in an app, where more
 * than one thing will use it. The rules are byte-identical either way.
 *
 * The reduced-motion block does more than `animation: none`, and that's the
 * point of the entry: a 40% stub frozen mid-sweep reads as "40% done", which is
 * exactly the claim an indeterminate bar must not make. It widens to the full
 * track instead.
 *
 * Keep this in step with `src/data/components/loaders.ts`.
 */
const SWEEP_CSS = `
@keyframes ind-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(250%); }
}
.ind-sweep { animation: ind-sweep 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .ind-sweep {
    position: static;
    width: 100%;
    opacity: 0.5;
    animation: none;
  }
}
`;

interface LoaderBarIndeterminateProps {
  label?: string;
  className?: string;
}

function LoaderBarIndeterminate({
  label = 'Loading…',
  className = '',
}: LoaderBarIndeterminateProps) {
  return (
    // No aria-valuenow, and no role="progressbar" either: for a bar that will
    // never have a value, role="status" with a real sentence says more than
    // "busy". Inventing a number would be worse than both.
    <div role="status" className={`w-full max-w-xs ${className}`}>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {/* A 40% segment that sweeps clean off the right edge - a bar that
            fills implies a finish line this component can't promise. */}
        <div className="ind-sweep absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-700 dark:bg-blue-400" />
      </div>
    </div>
  );
}

export default function LoaderBarIndeterminatePreview() {
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <style>{SWEEP_CSS}</style>

      <LoaderBarIndeterminate label="Loading results…" />

      <p className="text-center text-xs text-gray-600 dark:text-gray-400">
        No <code className="font-mono">aria-valuenow</code> &mdash; its absence is what means
        &ldquo;amount unknown&rdquo;.
      </p>
    </div>
  );
}
