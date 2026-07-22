'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './aurora-reveal';

/**
 * AURORA - FAQ accordion.
 *
 * Open/closed is real state on a real button with `aria-expanded`, and the
 * answer animates via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 */
export function AuroraFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-y-2 border-[var(--aurora-line)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="aurora-tag text-[10px] text-[var(--aurora-acid)]">{faq.eyebrow}</p>
          <h2 className="aurora-display mt-5 text-5xl sm:text-6xl">{faq.title}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border-t-2 border-[var(--aurora-line)]">
            {faq.items.map((item, index) => {
              const open = openIndex === index;
              return (
                <div key={item.question} className="border-b-2 border-[var(--aurora-line)]">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className={`aurora-display flex w-full items-center justify-between gap-6 py-5 text-left text-2xl transition-colors hover:text-[var(--aurora-acid)] sm:text-3xl ${
                        open ? 'text-[var(--aurora-acid)]' : ''
                      }`}
                    >
                      <span>{item.question}</span>
                      <Plus
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                          open ? 'rotate-45' : ''
                        }`}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-6 pr-8 text-[15px] leading-relaxed text-[var(--aurora-muted)]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
