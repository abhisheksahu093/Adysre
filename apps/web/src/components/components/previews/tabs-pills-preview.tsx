'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-pills`.
 *
 * Mirrors the `typescript` code variant with three sample ranges. The pill fill
 * stays blue-600 in both themes - white on blue-500 would fail AA.
 * Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsPillsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsPills({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsPillsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string): void => {
    setActiveId(id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = items.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;

    event.preventDefault();
    const item = items[next];
    if (!item) return;
    select(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={`max-w-2xl ${className}`}>
      <div
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 dark:bg-gray-900"
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-${item.id}-tab`}
              aria-controls={`${baseId}-${item.id}-panel`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => select(item.id)}
              onKeyDown={onKeyDown}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item: TabItem) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-${item.id}-panel`}
          aria-labelledby={`${baseId}-${item.id}-tab`}
          tabIndex={0}
          hidden={item.id !== activeId}
          className="pt-4 text-sm leading-relaxed text-gray-600 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

const SAMPLE_ITEMS: TabItem[] = [
  {
    id: 'day',
    label: 'Day',
    content: <p>1,284 requests served today with a median latency of 42ms.</p>,
  },
  {
    id: 'week',
    label: 'Week',
    content: <p>9,731 requests this week - up 12% on the week before.</p>,
  },
  {
    id: 'month',
    label: 'Month',
    content: <p>41,208 requests this month, with no incidents recorded.</p>,
  },
];

export default function TabsPillsPreview() {
  return <TabsPills items={SAMPLE_ITEMS} ariaLabel="Report range" className="w-full" />;
}
