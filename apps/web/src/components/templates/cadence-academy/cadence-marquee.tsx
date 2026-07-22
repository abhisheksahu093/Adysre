'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * CADENCE - the topic strip.
 *
 * The list is rendered twice so the CSS animation can translate exactly -50%
 * and land on the seam; the duplicate is `aria-hidden` so a screen reader hears
 * each topic once. Every second item takes the lime pill, which gives the strip
 * a rhythm without needing a second data field.
 */
export function CadenceMarquee({ content }: { content: TemplateContent }) {
  const items = content.marquee;

  return (
    <div className="overflow-hidden bg-[var(--cad-cream-warm)] py-6">
      <div className="cad-marquee flex w-max items-center gap-4 whitespace-nowrap px-4">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center gap-4"
            {...(copy === 1 ? { 'aria-hidden': true } : {})}
          >
            {items.map((item, index) => (
              <li
                key={item}
                className={`rounded-[var(--cad-radius-pill)] px-6 py-3 text-base font-semibold ${
                  index % 2 === 0
                    ? 'bg-[var(--cad-lime)] text-[var(--cad-ink)]'
                    : 'bg-[var(--cad-cream)] text-[var(--cad-ink-soft)]'
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
