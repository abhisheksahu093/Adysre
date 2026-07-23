'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tabs-animated-indicator`.
 *
 * A single underline bar slides between tabs instead of one indicator per tab.
 * Its position is measured from the active tab's `offsetLeft`/`offsetWidth` after
 * layout, so it survives wrapping and font swaps; the slide is disabled under
 * `motion-reduce`. Keep this in step with `src/data/components/tabs.ts`.
 */
interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsAnimatedIndicatorProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
  ariaLabel?: string;
}

export function TabsAnimatedIndicator({
  items,
  defaultTabId,
  className = '',
  ariaLabel = 'Tabs',
}: TabsAnimatedIndicatorProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(defaultTabId ?? items[0]?.id);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const measure = (): void => {
    const node = activeId ? tabRefs.current[activeId] : null;
    if (node) setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  };

  useLayoutEffect(measure, [activeId, items]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

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
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
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
                className={`whitespace-nowrap px-0.5 py-3 text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-[left,width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ left: indicator.left, width: indicator.width }}
        />
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
  { id: 'design', label: 'Design', content: <p>Wireframes approved, hi-fi mocks in review.</p> },
  { id: 'build', label: 'Build', content: <p>Two of five milestones shipped this sprint.</p> },
  { id: 'launch', label: 'Launch', content: <p>Targeting the last week of the quarter.</p> },
];

export default function TabsAnimatedIndicatorPreview() {
  return <TabsAnimatedIndicator items={SAMPLE_ITEMS} ariaLabel="Project phase" className="w-full" />;
}
