'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * VERDANT - the neighbourhood strip.
 *
 * The list is rendered twice so the CSS animation can translate exactly -50%
 * and land on the seam; the duplicate is `aria-hidden` so a screen reader hears
 * each neighbourhood once.
 */
export function VerdantMarquee({ content }: { content: TemplateContent }) {
  const items = content.marquee;

  return (
    <div className="overflow-hidden border-y border-[var(--verdant-rule)] bg-[var(--verdant-sand-deep)] py-5">
      <div className="verdant-marquee flex w-max items-center gap-14 whitespace-nowrap px-7">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center gap-14"
            {...(copy === 1 ? { 'aria-hidden': true } : {})}
          >
            {items.map((item) => (
              <li
                key={item}
                className="text-[11px] uppercase tracking-[0.26em] text-[var(--verdant-ink-faint)]"
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
