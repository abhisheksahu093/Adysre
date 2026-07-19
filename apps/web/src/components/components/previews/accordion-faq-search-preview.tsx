'use client';

import { useId, useMemo, useState } from 'react';

/**
 * Live preview for `accordion-faq-search`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: typing in
 * the field filters the list live and the aria-live count announces the change.
 * Keep this in step with `src/data/components/faq.ts`.
 */
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionFaqSearchProps {
  items: FaqItem[];
  defaultOpenId?: string;
  className?: string;
}

function AccordionFaqSearch({ items, defaultOpenId, className = '' }: AccordionFaqSearchProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  // Answers are searched too, so "refund" finds a question that never says it.
  const results = useMemo<FaqItem[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item: FaqItem) =>
        item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term),
    );
  }, [items, query]);

  const searchId = `${baseId}-search`;

  return (
    <div className={`max-w-2xl ${className}`}>
      <form className="mb-3" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="sr-only" htmlFor={searchId}>
          Search questions
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
      </form>

      {/* Announces the new count as the list reflows. */}
      <p className="mb-2 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'question' : 'questions'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">
          No questions match “{query}”.
        </p>
      ) : (
        results.map((item: FaqItem) => {
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
                  className="flex w-full items-center justify-between gap-4 px-1 py-3.5 text-left text-[0.9375rem] font-medium text-gray-900 hover:text-blue-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:text-blue-400 dark:focus-visible:ring-blue-400"
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
                <p className="px-1 pb-3.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const SAMPLE_ITEMS: FaqItem[] = [
  {
    id: 'export',
    question: 'Can I export my data?',
    answer:
      'Any time, from Settings → Export. You get a ZIP of CSV and JSON - no lock-in and no support ticket.',
  },
  {
    id: 'mobile',
    question: 'Do you have a mobile app?',
    answer: 'Native apps for iOS and Android, plus an installable web app that works offline.',
  },
  {
    id: 'integrations',
    question: 'Which integrations are supported?',
    answer:
      'Slack, GitHub, Jira, Zapier and around forty more, all managed from the integrations directory.',
  },
];

export default function AccordionFaqSearchPreview() {
  return <AccordionFaqSearch items={SAMPLE_ITEMS} defaultOpenId="export" className="w-full" />;
}
