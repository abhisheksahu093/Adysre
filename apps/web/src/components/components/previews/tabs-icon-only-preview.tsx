'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-icon-only`.
 *
 * Compact icon tabs with no visible label, so each tab MUST carry an `aria-label`
 * - the icon is `aria-hidden` and the label is the only accessible name. Buttons
 * are 40px square to stay a comfortable tap target. Keep this in step with
 * `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface TabsIconOnlyProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsIconOnly({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsIconOnlyProps) {
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
      <div
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
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
              aria-label={item.label}
              id={`${baseId}-${item.id}-tab`}
              aria-controls={`${baseId}-${item.id}-panel`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[item.id] = node;
              }}
              onClick={() => setActiveId(item.id)}
              onKeyDown={onKeyDown}
              className={`flex h-10 w-10 flex-none items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                isActive
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-950 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              <span className="h-5 w-5" aria-hidden="true">
                {item.icon}
              </span>
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

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: '1.6' } as const;

const SAMPLE_ITEMS: TabItem[] = [
  {
    id: 'grid',
    label: 'Grid view',
    icon: (
      <svg viewBox="0 0 20 20" {...stroke} className="h-full w-full">
        <path d="M3 3h6v6H3V3Zm8 0h6v6h-6V3ZM3 11h6v6H3v-6Zm8 0h6v6h-6v-6Z" strokeLinejoin="round" />
      </svg>
    ),
    content: <p>Assets shown as a grid of thumbnails.</p>,
  },
  {
    id: 'list',
    label: 'List view',
    icon: (
      <svg viewBox="0 0 20 20" {...stroke} className="h-full w-full">
        <path d="M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01" strokeLinecap="round" />
      </svg>
    ),
    content: <p>Assets shown as a dense, sortable list.</p>,
  },
  {
    id: 'map',
    label: 'Map view',
    icon: (
      <svg viewBox="0 0 20 20" {...stroke} className="h-full w-full">
        <path d="M7.5 3 3 5v12l4.5-2 5 2 4.5-2V3l-4.5 2-5-2Zm0 0v12m5-10v12" strokeLinejoin="round" />
      </svg>
    ),
    content: <p>Assets plotted by location on a map.</p>,
  },
];

export default function TabsIconOnlyPreview() {
  return <TabsIconOnly items={SAMPLE_ITEMS} ariaLabel="View mode" className="w-full" />;
}
