'use client';

import type { LumiereMastheadCopy } from '@/data/templates/lumiere-salon-content';
import { LumiereHairline } from './lumiere-hairline';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the band that opens every page except home.
 *
 * Home has a hero; the other six pages have this instead, so a visitor always
 * lands on a page that announces itself. It owns the `h1` for those pages, which
 * is why nothing inside them may use one.
 *
 * The blush band and the arch cut-out at the foot give each page the same
 * silhouette without repeating the hero's weight.
 */
export function LumiereMasthead({ copy }: { copy: LumiereMastheadCopy }) {
  return (
    <section className="lumi-band">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-20">
        <Reveal className="flex flex-col items-center text-center">
          <p className="lumi-eyebrow">{copy.eyebrow}</p>
          <span className="lumi-underline mt-4" aria-hidden />
          <h1 className="lumi-title mt-6 max-w-3xl text-balance">{copy.title}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-[17px] leading-[1.8] text-[var(--lumi-ink-soft)]">
            {copy.subtitle}
          </p>
          <LumiereHairline className="mt-10 w-40" />
        </Reveal>
      </div>
    </section>
  );
}
