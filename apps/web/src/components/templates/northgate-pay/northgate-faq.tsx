'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - FAQ accordion.
 *
 * Open state is real state on a real `<button>` carrying `aria-expanded`, and
 * the answer expands via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 */
export function NorthgateFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  // Settlement timing is the first thing every merchant asks, so it is open on
  // load rather than costing a click.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg)]">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="ngp-eyebrow">{faq.eyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{faq.title}</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-t border-[var(--ngp-rule)]">
            {faq.items.map((item, index) => {
              const open = openIndex === index;
              const panelId = `northgate-faq-panel-${index}`;
              return (
                <div key={item.question} className="border-b border-[var(--ngp-rule)]">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-start justify-between gap-8 py-6 text-left transition-colors hover:text-[var(--ngp-indigo-deep)]"
                    >
                      <span className="ngp-display text-[18px] leading-snug">{item.question}</span>
                      <Plus
                        className={`mt-1 h-4 w-4 shrink-0 text-[var(--ngp-indigo-deep)] transition-transform duration-300 ${
                          open ? 'rotate-45' : ''
                        }`}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    className={`grid transition-all duration-300 ease-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-6 text-[14.5px] leading-[1.85] text-[var(--ngp-ink-soft)]">
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
