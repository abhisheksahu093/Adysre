'use client';

import type { MeridianPageHead } from '@/data/templates/meridian-law-content';

/**
 * MERIDIAN - the masthead each dedicated page opens with.
 *
 * The home page has a hero; the other three open on this instead - a centred
 * navy band with the page title in serif. Shared rather than repeated so all
 * three pages start at exactly the same height and rhythm, which is what makes
 * moving between them feel like one document.
 */
export function MeridianPageHead({ head }: { head: MeridianPageHead }) {
  return (
    <section className="mer-hatch border-b border-[var(--mer-gold)] bg-[var(--mer-navy)] text-[var(--mer-on-navy)]">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-10 sm:py-24">
        <p className="mer-eyebrow mer-eyebrow-invert">{head.eyebrow}</p>
        <h1 className="mer-display mt-5 text-balance text-3xl leading-[1.2] sm:text-5xl">
          {head.title}
        </h1>
        <div className="mt-7 flex justify-center">
          <span className="mer-hairline" aria-hidden />
        </div>
        <p className="mx-auto mt-7 max-w-2xl text-pretty text-[15px] leading-[1.85] text-[var(--mer-on-navy-soft)]">
          {head.intro}
        </p>
      </div>
    </section>
  );
}
