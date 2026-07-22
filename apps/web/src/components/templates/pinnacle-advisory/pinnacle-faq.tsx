'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - FAQ accordion.
 *
 * Open state is real state on a real `<button>` carrying `aria-expanded`, and
 * the answer expands via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 *
 * The heading column is narrow and the answers are indented under it, so the
 * list reads as a document rather than as a widget.
 */
export function PinnacleFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  // Price is open on load: it is the question every buyer arrived with, and
  // making them click for it is the wrong first impression for this firm.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-[80rem] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <Reveal>
          <p className="pin-eyebrow">{faq.eyebrow}</p>
          <h2 className="pin-h2 mt-6">{faq.title}</h2>
        </Reveal>

        <div className="border-t border-[var(--pin-line)]">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `pinnacle-faq-panel-${index}`;
            return (
              <Reveal key={item.question} delay={index * 0.05}>
                <div className="border-b border-[var(--pin-line)]">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-start justify-between gap-8 py-7 text-left transition-colors duration-300 hover:text-[var(--pin-brand-ink)]"
                    >
                      <span className="pin-h3">{item.question}</span>
                      <span
                        aria-hidden
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--pin-line-strong)] transition-transform duration-500 ${
                          open ? 'rotate-45' : ''
                        }`}
                      >
                        <Plus className="h-4 w-4 text-[var(--pin-brand-ink)]" />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    className={`grid transition-all duration-500 ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pin-body pr-12 pb-8 text-[0.9375rem] text-[var(--pin-text-muted)]">
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
