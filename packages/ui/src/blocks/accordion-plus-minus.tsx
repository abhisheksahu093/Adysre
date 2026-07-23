'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-plus-minus`.
 *
 * Mirrors the `typescript` code variant verbatim: the vertical bar collapses
 * with scale-x-0 so + morphs into − as a panel opens.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionPlusMinusProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionPlusMinus({ items, defaultOpenId, className = '' }: AccordionPlusMinusProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={`w-full ${className}`}>
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id} className="border-b border-gray-200 dark:border-gray-800">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                {item.question}
                <span className="relative h-3.5 w-3.5 flex-none" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <span
                    className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-90 rounded-full bg-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:bg-gray-400 ${isOpen ? 'scale-x-0' : ''}`}
                  />
                </span>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'trial',
    question: 'Is there a free trial?',
    answer:
      '14 days on any paid plan, no card required. You keep everything you build during the trial.',
  },
  {
    id: 'trial-end',
    question: 'What happens when the trial ends?',
    answer:
      'Your workspace drops to the free tier. Nothing is deleted, and you can upgrade again whenever you like.',
  },
  {
    id: 'extend',
    question: 'Can I extend my trial?',
    answer: 'Email support and we will add another 14 days once, no questions asked.',
  },
];

export default function AccordionPlusMinusPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionPlusMinus items={SAMPLE_ITEMS} defaultOpenId="trial" />
      </div>
    </section>
  );
}
