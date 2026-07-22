'use client';

import type { LumiereVessel } from '@/data/templates/lumiere-salon-content';

/**
 * LUMIERE - a product, drawn.
 *
 * The template ships no images, so every product visual is the same arch with a
 * different `.lumi-vessel--<vessel>` composition inside it (see lumiere.css).
 * Because the shapes are pseudo-elements they need a positioned host, which is
 * Tailwind's `relative` here and NOT a rule in the stylesheet - a scoped selector
 * would outrank Tailwind's `.absolute` elsewhere on the page.
 *
 * `aspect` is passed as a full utility rather than a ratio because Tailwind
 * generates classes from source text: an interpolated `aspect-[${x}]` would never
 * be emitted.
 */
export function LumiereProductVisual({
  vessel,
  aspect = 'aspect-[4/5]',
  label,
}: {
  vessel: LumiereVessel;
  aspect?: string;
  label: string;
}) {
  return (
    <div
      /*
       * `img` with a label rather than `aria-hidden`: this IS the product
       * photograph, so a screen reader should be told what it depicts instead of
       * meeting a nameless box where every sighted visitor sees the bottle.
       */
      role="img"
      aria-label={label}
      className={`lumi-arch lumi-vessel lumi-vessel--${vessel} relative w-full ${aspect}`}
    />
  );
}
