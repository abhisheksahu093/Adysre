'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * PULSE - insurer and registration strip. The list renders twice inside a track
 * that translates -50%, so the loop is seamless without cloning logic. The
 * duplicate pass is aria-hidden: a screen reader should hear each name once.
 *
 * Names sit in pills rather than plain type - on a light page a bare grey word
 * at 11px would fall under the contrast floor.
 */
export function PulseMarquee({ content }: { content: TemplateContent }) {
  return (
    <section className="border-y border-[var(--pulse-line)] bg-[var(--pulse-surface)] py-8">
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="pulse-marquee flex w-max items-center gap-4 pr-4">
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-center gap-4 pr-4" aria-hidden={pass === 1}>
              {content.marquee.map((name) => (
                <span
                  key={`${pass}-${name}`}
                  className="whitespace-nowrap rounded-full bg-[var(--pulse-bg)] px-5 py-2.5 text-[14px] font-medium text-[var(--pulse-ink-soft)]"
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
