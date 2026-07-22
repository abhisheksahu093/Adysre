'use client';

import type { TemplateContent } from '@/data/templates/types';
import { PINNACLE_LABELS } from '@/data/templates/pinnacle-advisory-content';

/**
 * PINNACLE - client strip.
 *
 * Client names drifting slowly between two rules. The list renders twice inside
 * a track that translates -50%, so the loop is seamless without cloning logic;
 * the second pass is `aria-hidden` because a screen reader should hear each
 * client once. Names are set as type rather than as logo marks - there are no
 * images anywhere in this template, and a wordmark in the page's own face reads
 * as more honest than a fake logo would.
 */
export function PinnacleMarquee({ content }: { content: TemplateContent }) {
  return (
    <section aria-label={PINNACLE_LABELS.clientsLabel} className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-[80rem] border-y border-[var(--pin-line)] py-7">
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="pin-marquee flex w-max items-center">
            {[0, 1].map((pass) => (
              <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
                {content.marquee.map((name) => (
                  <span
                    key={`${pass}-${name}`}
                    className="whitespace-nowrap px-9 text-[1.0625rem] font-[550] tracking-[-0.015em] text-[var(--pin-text-faint)]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
