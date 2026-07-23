'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-separated`.
 *
 * Mirrors the `typescript` code variant verbatim: detached cards with a gap,
 * defaulting to allowMultiple so each card toggles independently.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionSeparatedProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

export function AccordionSeparated({
  items,
  allowMultiple = true,
  defaultOpenId,
  className = '',
}: AccordionSeparatedProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []));

  const toggle = (id: string): void => {
    setOpenIds((current: string[]) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {items.map((item: FaqItem) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:shadow-none"
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
              >
                {item.question}
                <svg
                  className={`h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition-transform duration-200 motion-reduce:transition-none dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
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
              <p className="px-4 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'setup',
    question: 'How long does setup take?',
    answer:
      'Most teams are importing data within an hour. The guided setup walks you through it step by step.',
  },
  {
    id: 'migrate',
    question: 'Can I migrate from another tool?',
    answer:
      'Yes. We import CSV exports from every major competitor, and our team will run the migration for you on annual plans.',
  },
  {
    id: 'training',
    question: 'Is training included?',
    answer: 'Every plan includes live onboarding sessions and unlimited access to the course library.',
  },
];

export default function AccordionSeparatedPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionSeparated items={SAMPLE_ITEMS} defaultOpenId="setup" />
      </div>
    </section>
  );
}
