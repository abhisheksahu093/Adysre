'use client';

import { useState } from 'react';

/**
 * Live preview for `map-region-selector`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: picking a
 * tile updates the pressed state and the caption. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface Region {
  id: string;
  label: string;
}

interface MapRegionSelectorProps {
  regions?: Region[];
  defaultSelectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

const DEFAULT_REGIONS: Region[] = [
  { id: 'am', label: 'Americas' },
  { id: 'eu', label: 'Europe' },
  { id: 'af', label: 'Africa' },
  { id: 'me', label: 'Middle East' },
  { id: 'ap', label: 'Asia Pacific' },
  { id: 'oc', label: 'Oceania' },
];

export function MapRegionSelector({
  regions = DEFAULT_REGIONS,
  defaultSelectedId,
  onSelect,
  className = '',
}: MapRegionSelectorProps) {
  const [selected, setSelected] = useState<string>(defaultSelectedId ?? regions[0]?.id ?? '');
  const current = regions.find((r) => r.id === selected);

  const choose = (id: string): void => {
    setSelected(id);
    onSelect?.(id);
  };

  return (
    <div className={'w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div role="group" aria-label="Select a region" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {regions.map((r) => {
          const isSelected = r.id === selected;
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => choose(r.id)}
              className={
                'flex min-h-[44px] items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none ' +
                (isSelected
                  ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800')
              }
            >
              {r.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Serving <span className="font-semibold text-gray-900 dark:text-gray-100">{current ? current.label : '-'}</span>
      </p>
    </div>
  );
}

export const minHeight = 240;

export default function MapRegionSelectorPreview() {
  return <MapRegionSelector defaultSelectedId="eu" className="w-full" />;
}
