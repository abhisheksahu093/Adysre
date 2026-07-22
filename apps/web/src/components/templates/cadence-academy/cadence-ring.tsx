'use client';

import type { CSSProperties } from 'react';

/**
 * CADENCE - a conic-gradient progress ring.
 *
 * Shared by the inverted proof section and the course page's track record, so
 * the two can never draw the same figure differently. The ring is the number
 * rendered, not a decoration beside it, which is why the percentage is also
 * printed as text in the middle and the surrounding label describes it.
 *
 * The only thing set inline is `--cad-ring-target`, and it is data rather than
 * styling: a completion figure from the content module. Everything visual -
 * colour, thickness, the easing, the hole punched through the middle - lives in
 * `cadence.css`, which transitions the registered `--cad-ring-fill` towards
 * this target once the wrapping `Reveal` adds `cad-revealed`.
 */
export function CadenceRing({
  value,
  tone = 'ink',
  label,
}: {
  value: number;
  /** `ink` draws violet on cream; `inverse` draws lime on the aubergine band. */
  tone?: 'ink' | 'inverse';
  /** Accessible name for the figure, since the ring itself is decoration. */
  label: string;
}) {
  // A custom property is not part of `CSSProperties`, so the cast is the one
  // place this pattern needs it. Narrowed to a single known key.
  const target = { '--cad-ring-target': `${value}%` } as CSSProperties;

  return (
    <div
      className="relative grid h-32 w-32 shrink-0 place-items-center sm:h-36 sm:w-36"
      role="img"
      aria-label={`${value}% ${label}`}
    >
      <span
        className={`cad-ring absolute inset-0 ${tone === 'inverse' ? 'cad-ring-inverse' : ''}`}
        style={target}
        aria-hidden
      />
      <span
        className={`cad-figures relative text-3xl font-bold sm:text-4xl ${
          tone === 'inverse' ? 'text-[var(--cad-on-ink)]' : 'text-[var(--cad-ink)]'
        }`}
        aria-hidden
      >
        {value}%
      </span>
    </div>
  );
}
