'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the four commitments.
 *
 * A ledger rather than a grid of cards: the services section already spent the
 * page's card budget, so these are numbered rows divided by rules. Numbering
 * them makes four unrelated promises read as one list a firm can be held to.
 */
export function PinnacleWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <Reveal>
          <p className="pin-eyebrow">{why.eyebrow}</p>
          <h2 className="pin-h2 mt-6">{why.title}</h2>
          <p className="pin-body mt-6 text-[var(--pin-text-muted)]">{why.subtitle}</p>
        </Reveal>

        <ul className="mt-14 border-t border-[var(--pin-line)]">
          {why.items.map((item, index) => (
            <li key={item.title} className="border-b border-[var(--pin-line)]">
              <Reveal
                delay={index * 0.07}
                className="grid gap-5 py-9 sm:grid-cols-[auto_1fr] sm:gap-10 lg:grid-cols-[auto_0.8fr_1.2fr]"
              >
                <span className="pin-figure-num text-[1.75rem] text-[var(--pin-brand)]">
                  {/* Two digits, so the column stays even from 01 to 04. */}
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex items-start gap-4">
                  <item.icon
                    className="mt-1 h-5 w-5 shrink-0 text-[var(--pin-brand-ink)] lg:hidden"
                    aria-hidden
                  />
                  <h3 className="pin-h3">{item.title}</h3>
                </div>

                <p className="pin-body text-[0.9375rem] text-[var(--pin-text-muted)]">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
