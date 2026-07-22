'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * NOVA - integration marquee. The list renders twice inside a track that
 * translates -50%, so the loop is seamless without cloning logic. The duplicate
 * is aria-hidden: a screen reader should hear each name once.
 */
export function NovaMarquee({ content }: { content: TemplateContent }) {
  return (
    <section className="border-y border-[var(--nova-line)] py-7">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="nova-marquee flex w-max items-center gap-14 pr-14">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center gap-14 pr-14" aria-hidden={pass === 1}>
              {content.marquee.map((name) => (
                <span
                  key={`${pass}-${name}`}
                  className="nova-mono whitespace-nowrap text-[11px] text-[var(--nova-faint)]"
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
