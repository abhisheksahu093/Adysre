'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `accordion-multi-open`.
 *
 * Mirrors the `typescript` code variant verbatim, with two of the three sample
 * answers open on mount to show off what makes this one different: nothing
 * collapses when you open something else.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionMultiOpenProps {
  items: FaqItem[];
  defaultOpenIds?: string[];
  className?: string;
}

function AccordionMultiOpen({ items, defaultOpenIds = [], className = '' }: AccordionMultiOpenProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(defaultOpenIds));
  const allOpen = openIds.size === items.length;

  const toggle = (id: string): void => {
    setOpenIds((current: Set<string>) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (): void => {
    setOpenIds(allOpen ? new Set<string>() : new Set(items.map((item: FaqItem) => item.id)));
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-end pb-1">
        <button
          type="button"
          onClick={toggleAll}
          className="inline-flex min-h-10 items-center rounded-md px-2.5 text-xs font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-400"
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      {items.map((item: FaqItem) => {
        const isOpen = openIds.has(item.id);
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
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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
    id: 'delivery',
    question: 'How long does delivery take?',
    answer:
      'Standard delivery arrives in 3-5 working days. Express orders placed before 2pm ship the same day.',
  },
  {
    id: 'tracking',
    question: 'Can I track my order?',
    answer: 'Every shipment gets a tracking link by email the moment it leaves our warehouse.',
  },
  {
    id: 'returns',
    question: 'What is your returns window?',
    answer: 'Send anything back within 60 days of delivery and we cover the return postage.',
  },
];

export default function AccordionMultiOpenPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <AccordionMultiOpen items={SAMPLE_ITEMS} defaultOpenIds={['delivery', 'tracking']} />
      </div>
    </section>
  );
}
