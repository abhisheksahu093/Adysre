'use client';

import { cn } from 'adysre';
import type { Tone } from '../constants/http';
import { toneSoft } from '../constants/tone';

/**
 * The tone-aware pill, and the client re-exports of the tone helpers.
 *
 * The maps themselves live in `../constants/tone`, which carries no
 * `'use client'` so the landing page can build the same method and status pills
 * on the server. Everything inside the studio keeps importing from here.
 */

export { toneText, toneSoft, toneFill } from '../constants/tone';

/** A small uppercase label in a tone. Used for methods and status codes. */
export function TonePill({
  tone,
  children,
  className,
  title,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide',
        toneSoft(tone),
        className,
      )}
    >
      {children}
    </span>
  );
}
