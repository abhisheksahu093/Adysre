/**
 * Live preview for `loader-dots`.
 *
 * Mirrors the `nextjs`/`typescript` code variant. No 'use client' - markup and
 * CSS animation only.
 *
 * The inline `animationDelay` is not a shortcut around the token rules: Tailwind
 * has no animation-delay utility, and the stagger IS the component. Give all
 * three dots the same delay and you get one blinking blob rather than a wave.
 *
 * `motion-reduce:animate-none` stops them; `motion-reduce:opacity-100` is the
 * half people forget - without it the dots freeze at the keyframe's 45% opacity
 * and read as disabled rather than busy.
 *
 * Keep this in step with `src/data/components/loaders.ts`.
 */
const DOT =
  'h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300';

const DELAYS: readonly number[] = [0, 160, 320];

interface LoaderDotsProps {
  label?: string;
  className?: string;
}

export function LoaderDots({ label = 'Loading…', className = '' }: LoaderDotsProps) {
  return (
    <div role="status" className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {DELAYS.map((delay: number) => (
          <span key={delay} className={DOT} style={{ animationDelay: `${delay}ms` }} />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function LoaderDotsPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LoaderDots />

      <p className="text-xs text-gray-600 dark:text-gray-400">
        Announced as &ldquo;Loading&hellip;&rdquo; &mdash; the dots are aria-hidden.
      </p>
    </div>
  );
}
