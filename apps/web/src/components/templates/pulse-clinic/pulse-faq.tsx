'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pulse-reveal';

/**
 * PULSE - questions.
 *
 * Open/closed is real state on a real button carrying `aria-expanded`, and the
 * answer animates through `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 * Each row is its own rounded card so a closed accordion still looks like the
 * rest of the page rather than a stack of rules.
 */
export function PulseFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="pulse-wash scroll-mt-24 border-y border-[var(--pulse-line)]">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="text-center">
          <p className="pulse-eyebrow">{faq.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-4xl">
            {faq.title}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-3">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `pulse-faq-panel-${index}`;
            return (
              <Reveal key={item.question} delay={0.04 * index}>
                <div className="pulse-card px-6 sm:px-7">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[var(--pulse-accent)]"
                    >
                      <span className="text-[16px] font-semibold tracking-[-0.01em]">{item.question}</span>
                      <span
                        className={`pulse-tile grid h-9 w-9 shrink-0 place-items-center transition-transform duration-300 ${
                          open ? 'rotate-45' : ''
                        }`}
                        aria-hidden
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    className={`grid transition-all duration-300 ease-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-6 text-[15px] leading-[1.8] text-[var(--pulse-ink-soft)]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
