'use client';

import { useState } from 'react';

/**
 * Live preview for `map-store-locator-list`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: selecting a
 * row or a pin sets the shared active store. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  x: number;
  y: number;
}

interface MapStoreLocatorListProps {
  stores?: Store[];
  defaultActiveId?: string;
  className?: string;
}

const DEFAULT_STORES: Store[] = [
  { id: 'downtown', name: 'Downtown', address: '12 Market St', distance: '0.4 km', x: 38, y: 44 },
  { id: 'harbour', name: 'Harbour', address: '4 Pier Road', distance: '2.1 km', x: 68, y: 64 },
  { id: 'uptown', name: 'Uptown', address: '90 Hill Ave', distance: '3.7 km', x: 28, y: 72 },
];

function MapStoreLocatorList({
  stores = DEFAULT_STORES,
  defaultActiveId,
  className = '',
}: MapStoreLocatorListProps) {
  const [activeId, setActiveId] = useState<string>(defaultActiveId ?? stores[0]?.id ?? '');

  return (
    <div className={'grid w-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <ul className="space-y-2">
        {stores.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(s.id)}
                className={
                  'w-full rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none ' +
                  (isActive
                    ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10'
                    : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900')
                }
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{s.distance}</span>
                </span>
                <span className="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">{s.address}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="relative order-first aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 md:order-none dark:bg-gray-900">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="store-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#store-dots)" />
        </svg>
        {stores.map((s) => {
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              aria-label={s.name + ' store'}
              onClick={() => setActiveId(s.id)}
              style={{ left: s.x + '%', top: s.y + '%' }}
              className={
                'absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ' +
                (isActive ? 'h-11 w-11' : 'h-10 w-10')
              }
            >
              <span className={'rounded-full ring-4 dark:bg-blue-400 ' + (isActive ? 'h-4 w-4 bg-blue-700 ring-blue-500/40 dark:bg-blue-300' : 'h-3 w-3 bg-blue-600 ring-blue-500/25')} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const minHeight = 460;

export default function MapStoreLocatorListPreview() {
  return <MapStoreLocatorList className="w-full" />;
}
