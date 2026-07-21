'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `faq-accordion`.
 *
 * Mirrors the `nextjs`/`typescript` code variant verbatim, rendered with three
 * sample questions and the first one open. Fully interactive - clicking a
 * question toggles it, exactly as the copied snippet would.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  className?: string;
}

function FaqAccordion({
  items,
  allowMultiple = false,
  defaultOpenId,
  className = '',
}: FaqAccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(() => (defaultOpenId ? [defaultOpenId] : []));

  const toggle = (id: string): void => {
    setOpenIds((current: string[]) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {items.map((item: FaqItem) => {
        const isOpen = openIds.includes(item.id);
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

            {/* hidden (not unmounted) keeps the panel findable by in-page search. */}
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="px-1 pb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'plan',
    question: 'Can I change my plan later?',
    answer:
      'Yes. Upgrades apply immediately and downgrades take effect at the end of the current billing period.',
  },
  {
    id: 'refunds',
    question: 'Do you offer refunds?',
    answer: 'We refund any annual plan in full within 30 days of purchase, no questions asked.',
  },
  {
    id: 'free-tier',
    question: 'Is there a free tier?',
    answer: 'Yes - the free tier includes three projects and never expires. No card required.',
  },
];

export default function FaqAccordionPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <FaqAccordion items={SAMPLE_ITEMS} defaultOpenId="plan" />
      </div>
    </section>
  );
}
