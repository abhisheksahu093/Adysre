'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * SAFFRON - accolades strip. Quieter than NOVA's logo marquee: serif small
 * caps drifting slowly between two hairlines. The duplicate pass is
 * aria-hidden so each accolade is announced once.
 */
export function SaffronMarquee({ content }: { content: TemplateContent }) {
  return (
    <section className="border-y border-[var(--saf-rule)] py-6">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="saf-marquee flex w-max items-center gap-16 pr-16">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center gap-16 pr-16" aria-hidden={pass === 1}>
              {content.marquee.map((name) => (
                <span
                  key={`${pass}-${name}`}
                  className="whitespace-nowrap text-[11px] uppercase tracking-[0.28em] text-[var(--saf-ink-faint)]"
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
