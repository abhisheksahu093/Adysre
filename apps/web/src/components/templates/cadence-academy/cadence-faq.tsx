'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the FAQ accordion.
 *
 * Open state is real state on a real `<button>` with `aria-expanded`, and the
 * answer animates via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or pinning the panel to a fixed size.
 *
 * One question is open on load. A visitor who has scrolled this far is looking
 * for a specific answer, and an all-closed list gives them nothing to read.
 */
export function CadenceFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-3 pb-20 sm:px-4 sm:pb-28">
      <div className="mx-auto max-w-4xl px-2 sm:px-8">
        <Reveal>
          <p className="cad-eyebrow">{faq.eyebrow}</p>
          <span className="cad-underline mt-4" aria-hidden />
          <h2 className="cad-display-sm mt-7 text-balance">{faq.title}</h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `cadence-faq-panel-${index}`;
            return (
              <div
                key={item.question}
                className={`rounded-[var(--cad-radius)] px-7 transition-colors duration-300 sm:px-9 ${
                  open ? 'bg-[var(--cad-cream-warm)]' : 'bg-[var(--cad-cream)]'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-bold tracking-[-0.01em]">{item.question}</span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] transition-all duration-300 ${
                        open
                          ? 'rotate-45 bg-[var(--cad-violet)] text-[var(--cad-on-ink)]'
                          : 'bg-[var(--cad-cream-warm)] text-[var(--cad-ink)]'
                      }`}
                      aria-hidden
                    >
                      <Plus className="h-5 w-5" />
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
                    <p className="pb-7 pr-10 text-[16px] leading-[1.75] text-[var(--cad-ink-soft)]">
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
