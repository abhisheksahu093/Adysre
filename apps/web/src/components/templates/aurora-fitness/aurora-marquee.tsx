'use client';

import type { TemplateContent } from '@/data/templates/types';

/**
 * AURORA - class-name marquee. A solid acid band skewed off the horizontal, so
 * the page gains a diagonal without any element leaving the flow: the skew is
 * on the band, and the inner strip counter-skews so the words stay level.
 *
 * The list renders twice inside a track that translates -50%, which makes the
 * loop seamless without cloning logic. The duplicate is aria-hidden: a screen
 * reader should hear each class once.
 */
export function AuroraMarquee({ content }: { content: TemplateContent }) {
  return (
    <section className="overflow-hidden py-10 sm:py-14">
      <div className="-mx-2 -rotate-2 border-y-2 border-[var(--aurora-on-acid)] bg-[var(--aurora-acid)] py-4">
        <div className="rotate-2 overflow-hidden">
          <div className="aurora-marquee flex w-max items-center">
            {[0, 1].map((pass) => (
              <div key={pass} className="flex items-center" aria-hidden={pass === 1}>
                {content.marquee.map((name) => (
                  <span key={`${pass}-${name}`} className="flex items-center">
                    <span className="aurora-display whitespace-nowrap px-7 text-3xl text-[var(--aurora-on-acid)] sm:text-4xl">
                      {name}
                    </span>
                    <span className="h-2.5 w-2.5 rotate-45 bg-[var(--aurora-on-acid)]" aria-hidden />
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
