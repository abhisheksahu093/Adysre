'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - FAQ accordion.
 *
 * Open state is real state on a real `<button>` with `aria-expanded`, and the
 * answer animates via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 */
export function VantaFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-[var(--vanta-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <Reveal>
            <p className="vanta-eyebrow">{faq.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{faq.title}</h2>
          </Reveal>

          <div className="divide-y divide-[var(--vanta-line)] border-y border-[var(--vanta-line)]">
            {faq.items.map((item, index) => {
              const open = openIndex === index;
              const panelId = `vanta-faq-panel-${index}`;
              return (
                <div key={item.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[var(--vanta-up)]"
                    >
                      <span className="text-[15px] font-medium sm:text-base">{item.question}</span>
                      <Plus
                        className={`h-4 w-4 shrink-0 text-[var(--vanta-faint)] transition-transform duration-500 ${
                          open ? 'rotate-45' : ''
                        }`}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    className={`grid transition-all duration-500 ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-7 pr-8 text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
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
    </section>
  );
}
