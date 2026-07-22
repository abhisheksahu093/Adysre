'use client';

import type { LumenArt } from '@/data/templates/lumen-store-content';

/**
 * LUMEN - a product, drawn.
 *
 * The template ships no images, so every product visual is the same element with
 * a different `.lum-art--<art>` composition behind it (see lumen.css). Because
 * the shapes are pseudo-elements they need a positioned host, which is Tailwind's
 * `relative` here and NOT a rule in the stylesheet - a scoped selector would
 * outrank Tailwind's `.absolute` elsewhere on the page.
 *
 * `aspect` is passed as a full utility rather than a ratio because Tailwind
 * generates classes from source text: an interpolated `aspect-[${x}]` would never
 * be emitted.
 */
export function LumenProductVisual({
  art,
  aspect = 'aspect-[4/5]',
  label,
}: {
  art: LumenArt;
  aspect?: string;
  label: string;
}) {
  return (
    <div
      /*
       * `img` with a label rather than `aria-hidden`: this IS the product
       * photograph, so a screen reader should be told what it depicts instead of
       * meeting a nameless box where every sighted visitor sees the item.
       */
      role="img"
      aria-label={label}
      className={`lum-art lum-art--${art} relative w-full ${aspect}`}
    />
  );
}
