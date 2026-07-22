'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './nova-reveal';

/**
 * NOVA - FAQ accordion.
 *
 * Open/closed is real state on a real button with `aria-expanded`, and the
 * answer animates via `grid-template-rows: 0fr -> 1fr`, which transitions
 * smoothly without measuring height or locking the panel to a fixed size.
 */
export function NovaFaq({ content }: { content: TemplateContent }) {
  const { faq } = content;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-y border-[var(--nova-line)] bg-[var(--nova-surface)]/40"
    >
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="text-center">
          <p className="nova-mono text-[10px] text-[var(--nova-accent-2)]">{faq.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {faq.title}
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-[var(--nova-line)] border-y border-[var(--nova-line)]">
          {faq.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--nova-accent-2)]"
                  >
                    <span className="text-[15px] font-medium sm:text-base">{item.question}</span>
                    <Plus
                      className={`h-4 w-4 shrink-0 text-[var(--nova-faint)] transition-transform duration-300 ${
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
                    <p className="pb-5 pr-10 text-[15px] leading-relaxed text-[var(--nova-muted)]">
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
