'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * VANTA - the venue strip.
 *
 * Deliberately quieter and slower than the quote ticker above it: venues do not
 * change, so nothing here pulses or colours. The list is rendered twice so the
 * CSS animation can translate exactly -50% and land on the seam; the duplicate
 * is `aria-hidden` so a screen reader hears each venue once.
 */
export function VantaMarquee({ content }: { content: TemplateContent }) {
  return (
    <div className="overflow-hidden border-y border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)] py-6">
      <div className="vanta-marquee flex w-max items-center gap-16 px-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center gap-16"
            {...(copy === 1 ? { 'aria-hidden': true } : {})}
          >
            {content.marquee.map((venue) => (
              <li key={venue} className="vanta-label">
                {venue}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
