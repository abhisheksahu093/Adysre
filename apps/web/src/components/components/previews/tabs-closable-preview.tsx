'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-closable`.
 *
 * Editor-style tabs you can close. Each tab pairs a `role="tab"` button with a
 * real `<button>` carrying an `aria-label` - not an icon glyph inside the tab,
 * which a screen reader could never activate. Closing the active tab moves
 * selection to a neighbour. Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsClosableProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

function TabsClosable({ items, defaultTabId, className = '', ariaLabel = 'Tabs' }: TabsClosableProps) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState<TabItem[]>(items);
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = openItems.findIndex((item: TabItem) => item.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % openItems.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + openItems.length) % openItems.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = openItems.length - 1;
    else return;

    event.preventDefault();
    const item = openItems[next];
    if (!item) return;
    setActiveId(item.id);
    tabRefs.current[item.id]?.focus();
  };

  const close = (id: string): void => {
    const index = openItems.findIndex((item: TabItem) => item.id === id);
    const remaining = openItems.filter((item: TabItem) => item.id !== id);
    setOpenItems(remaining);
    if (id === activeId) {
      const fallback = remaining[index] ?? remaining[index - 1] ?? remaining[0];
      setActiveId(fallback?.id);
      if (fallback) window.requestAnimationFrame(() => tabRefs.current[fallback.id]?.focus());
    }
  };

  return (
    <div className={`max-w-2xl ${className}`}>
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {openItems.map((item: TabItem) => {
          const isActive = item.id === activeId;

          return (
            <span key={item.id} className="inline-flex shrink-0 items-center">
              <button
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
                className={`-mb-px whitespace-nowrap rounded-t-md border-b-2 py-2 pl-3 pr-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </button>
              <button
                type="button"
                onClick={() => close(item.id)}
                aria-label={`Close ${item.label}`}
                className="-mb-px flex h-6 w-6 flex-none items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          );
        })}
      </div>

      {openItems.map((item: TabItem) => (
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

      {openItems.length === 0 ? (
        <p className="pt-4 text-sm text-gray-500 dark:text-gray-400">All tabs closed.</p>
      ) : null}
    </div>
  );
}

const SAMPLE_ITEMS: TabItem[] = [
  { id: 'index', label: 'index.ts', content: <p>The entry point that wires the app together.</p> },
  { id: 'app', label: 'app.tsx', content: <p>The root component and its providers.</p> },
  { id: 'styles', label: 'styles.css', content: <p>Global tokens and the base layer.</p> },
];

export default function TabsClosablePreview() {
  return <TabsClosable items={SAMPLE_ITEMS} ariaLabel="Open files" className="w-full" />;
}
