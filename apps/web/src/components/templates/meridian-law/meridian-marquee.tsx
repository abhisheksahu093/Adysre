'use client';

import type { TemplateContent } from '@/data/templates/types';
import { MERIDIAN_LABELS } from '@/data/templates/meridian-law-content';

/**
 * MERIDIAN - recognition strip.
 *
 * Directory rankings and memberships, drifting slowly between two hairlines.
 * The list renders twice inside a track that translates -50%, so the loop is
 * seamless without cloning logic; the duplicate is aria-hidden because a screen
 * reader should hear each accolade once.
 */
export function MeridianMarquee({ content }: { content: TemplateContent }) {
  return (
    <section
      aria-label={MERIDIAN_LABELS.homeCredentials}
      className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory-2)] py-6"
    >
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="mer-marquee flex w-max items-center">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
              {content.marquee.map((name) => (
                <span
                  key={`${pass}-${name}`}
                  className="whitespace-nowrap border-r border-[var(--mer-rule)] px-10 text-[11px] uppercase tracking-[0.2em] text-[var(--mer-ink-faint)]"
                >
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
