'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-filled`.
 *
 * Mirrors the `typescript` code variant verbatim: the open card takes a blue
 * tint and its question text darkens to hold contrast against the fill.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionFilledProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AccordionFilled({ items, defaultOpenId, className = '' }: AccordionFilledProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {items.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className={`rounded-xl transition-colors duration-200 motion-reduce:transition-none ${isOpen ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                  isOpen
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                {item.question}
                <svg
                  className={`h-[1.125rem] w-[1.125rem] flex-none transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen
                      ? 'rotate-180 text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-4 pb-3.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'hours',
    question: 'What are your support hours?',
    answer:
      'Support is staffed 24/5, Monday to Friday. Enterprise plans add weekend cover for urgent incidents.',
  },
  {
    id: 'reply',
    question: 'How fast do you reply?',
    answer:
      'The median first reply is under two hours. Priority tickets carry a one-hour contractual SLA.',
  },
  {
    id: 'human',
    question: 'Can I talk to a human?',
    answer: 'Always. There is no bot gate - every ticket goes straight to a support engineer.',
  },
];

export default function AccordionFilledPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionFilled items={SAMPLE_ITEMS} defaultOpenId="hours" />
      </div>
    </section>
  );
}
