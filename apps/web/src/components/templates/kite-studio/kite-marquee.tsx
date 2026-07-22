'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * KITE - the kinetic capability strip.
 *
 * The list renders twice so the CSS animation can translate exactly -50% and
 * land on the seam; the duplicate is `aria-hidden` so a screen reader hears each
 * capability once.
 *
 * Set large and outlined rather than as small caps: on this template the
 * marquee is a piece of display typography, not a caption.
 */
export function KiteMarquee({ content }: { content: TemplateContent }) {
  const items = content.marquee;

  return (
    <div className="overflow-hidden border-y border-[var(--kite-line)] bg-[var(--kite-void-deep)] py-6 sm:py-8">
      <div className="kite-marquee flex w-max items-center gap-10 whitespace-nowrap px-6">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center gap-10"
            // Spread conditionally: `exactOptionalPropertyTypes` rejects passing
            // `aria-hidden={undefined}` for the first, audible copy.
            {...(copy === 1 ? { 'aria-hidden': true } : {})}
          >
            {items.map((item, index) => (
              <li key={item} className="flex items-center gap-10">
                <span
                  className={`text-2xl font-bold tracking-[-0.03em] sm:text-4xl ${
                    // Alternating fill and outline gives the strip a rhythm as
                    // it passes, without a second colour entering the palette.
                    index % 2 === 0 ? 'kite-gradient-text' : 'kite-outline'
                  }`}
                >
                  {item}
                </span>
                <span
                  className="h-2 w-2 shrink-0 rotate-45 bg-[var(--kite-acid)]"
                  aria-hidden
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
