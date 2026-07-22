'use client';

import { useState } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - questions.
 *
 * Open state is real state on a real button carrying `aria-expanded`, and the
 * answer opens via `grid-template-rows: 0fr -> 1fr`, which transitions smoothly
 * without measuring height or pinning the panel to a fixed size.
 *
 * The toggle mark is two hairline spans rather than an icon: at this scale a
 * drawn plus sits on the same 1px grid as every rule on the page, which no
 * stroked glyph would.
 */
export function AtelierFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-y border-[var(--atelier-rule)] bg-[var(--atelier-wash)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
        <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
          <Reveal>
            <p className="atelier-label">{faq.eyebrow}</p>
            <span className="atelier-draw mt-6 max-w-24" aria-hidden />
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              <h2 className="atelier-heading max-w-2xl text-balance text-3xl sm:text-5xl">{faq.title}</h2>
            </Reveal>

            <div className="mt-16 border-t border-[var(--atelier-rule)]">
              {faq.items.map((item, index) => {
                const open = openIndex === index;
                return (
                  <div key={item.question} className="border-b border-[var(--atelier-rule)]">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenIndex(open ? null : index)}
                        className="flex w-full items-center gap-6 py-6 text-left transition-opacity duration-300 hover:opacity-60"
                      >
                        <span className="atelier-label shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[17px] font-light leading-snug sm:text-xl">
                          {item.question}
                        </span>
                        <span className="relative ml-auto h-3 w-3 shrink-0" aria-hidden>
                          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-[var(--atelier-ink)]" />
                          <span
                            className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[var(--atelier-ink)] transition-transform duration-500 ease-out ${
                              open ? 'scale-y-0' : 'scale-y-100'
                            }`}
                          />
                        </span>
                      </button>
                    </h3>

                    <div
                      className={`grid transition-all duration-500 ease-out ${
                        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 pl-0 text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)] sm:pl-16">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
