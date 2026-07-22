'use client';

import { Reveal } from './kite-reveal';

/**
 * KITE - the inner-page masthead.
 *
 * Every page except home opens with the same three moves at the same scale: an
 * acid eyebrow, a two-part headline whose second word is outlined, and a single
 * paragraph. Sharing one component is what keeps the four inner pages feeling
 * like one site rather than four hero variants.
 *
 * Every prop is required. Under `exactOptionalPropertyTypes` an optional prop
 * cannot receive `undefined`, and a masthead with a missing half-headline is not
 * a state this template has - so the type says so.
 */
export function KiteMasthead({
  eyebrow,
  title,
  outline,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  /** The word set as an outline. Carries the page's visual signature. */
  outline: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--kite-line)]">
      {/*
       * The drifting mesh, positioned entirely by Tailwind: kite.css never sets
       * `position` on `.kite-blob`, because a scoped selector would outrank the
       * `.absolute` utility and silently break the placement.
       */}
      <div
        className="kite-blob pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
        <Reveal>
          <p className="kite-eyebrow">{eyebrow}</p>
          <h1 className="kite-display mt-7">
            {title} <span className="kite-outline">{outline}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-[1.75] text-[var(--kite-paper-soft)] sm:text-lg">
            {subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
