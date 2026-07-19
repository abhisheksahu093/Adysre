'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-card-panels`.
 *
 * Pill tabs above a raised card panel. The panel is a bordered, shadowed surface
 * so the switch reads as swapping the contents of one card rather than editing
 * loose prose. Same ARIA + roving tabindex throughout. Keep this in step with
 * `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsCardPanelsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsCardPanels({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsCardPanelsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  return (
    <div className={`max-w-2xl ${className}`}>
      <div className="mb-3 flex max-w-full gap-1 overflow-x-auto" role="tablist" aria-label={ariaLabel}>
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
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
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
          className="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-blue-400"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

const SAMPLE_ITEMS: TabItem[] = [
  {
    id: 'shipping',
    label: 'Shipping',
    content: <p>Free two-day shipping on orders over $50, tracked end to end.</p>,
  },
  {
    id: 'returns',
    label: 'Returns',
    content: <p>30-day returns, prepaid label, refunded within three business days.</p>,
  },
  {
    id: 'warranty',
    label: 'Warranty',
    content: <p>Two-year limited warranty covering manufacturing defects.</p>,
  },
];

export default function TabsCardPanelsPreview() {
  return <TabsCardPanels items={SAMPLE_ITEMS} ariaLabel="Product details" className="w-full" />;
}
