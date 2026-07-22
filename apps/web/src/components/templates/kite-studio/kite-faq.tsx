'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './kite-reveal';

/**
 * KITE - the FAQ accordion.
 *
 * Open state is real state on a real `<button>` with `aria-expanded`, and the
 * answer animates through `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 *
 * One panel at a time: the answers here are long, and two open at once turns the
 * section into a wall.
 */
export function KiteFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-[var(--kite-line)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="kite-eyebrow">{faq.eyebrow}</p>
          <h2 className="kite-display-sm mt-6">{faq.title}</h2>
        </Reveal>

        <div className="divide-y divide-[var(--kite-line)] border-y border-[var(--kite-line)]">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `kite-faq-panel-${index}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className={`flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-semibold tracking-[-0.02em] transition-colors hover:text-[var(--kite-acid)] ${
                      open ? 'text-[var(--kite-acid)]' : 'text-[var(--kite-paper)]'
                    }`}
                  >
                    <span>{item.question}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? 'rotate-45' : ''
                      }`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pr-6 text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
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
