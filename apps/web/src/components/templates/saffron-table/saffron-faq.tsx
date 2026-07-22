'use client';

import { useState } from 'react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './saffron-reveal';

/**
 * SAFFRON - visiting. Same accessible accordion contract as NOVA (a real
 * button, `aria-expanded`, a `0fr -> 1fr` grid transition rather than measured
 * heights), dressed as printed type: a serif question and a thin rule.
 */
export function SaffronFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--saf-paper-2)]">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10 sm:py-32">
        <Reveal>
          <p className="saf-eyebrow">{faq.eyebrow}</p>
          <span className="saf-rule mt-4" aria-hidden />
          <h2 className="mt-6 text-balance text-4xl leading-[1.15] tracking-[-0.01em] sm:text-5xl">
            {faq.title}
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-[var(--saf-rule)]">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question} className="border-b border-[var(--saf-rule)]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-baseline justify-between gap-8 py-6 text-left transition-colors hover:text-[var(--saf-accent)]"
                  >
                    <span className="text-xl tracking-[-0.01em]">{item.question}</span>
                    <span
                      className={`shrink-0 text-[var(--saf-accent)] transition-transform duration-500 ${
                        open ? 'rotate-45' : ''
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-7 pr-10 text-[16px] leading-[1.85] text-[var(--saf-ink-soft)]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
