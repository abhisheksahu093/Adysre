'use client';

import { useState } from 'react';

/**
 * Live preview for `map-pin-popover`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: click a pin
 * to toggle its popover; Escape closes it. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface Place {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
}

interface MapPinPopoverProps {
  places?: Place[];
  className?: string;
}

const DEFAULT_PLACES: Place[] = [
  { id: 'roastery', label: 'The Roastery', detail: 'Open until 6pm · 0.4 km away', x: 40, y: 45 },
  { id: 'library', label: 'City Library', detail: 'Open until 9pm · 1.1 km away', x: 66, y: 62 },
  { id: 'park', label: 'Riverside Park', detail: 'Open 24h · 0.8 km away', x: 24, y: 70 },
];

function MapPinPopover({ places = DEFAULT_PLACES, className = '' }: MapPinPopoverProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative aspect-[16/10] w-full">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="pin-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pin-dots)" />
        </svg>
        {places.map((p) => {
          const isOpen = openId === p.id;
          return (
            <div key={p.id} className="absolute" style={{ left: p.x + '%', top: p.y + '%' }}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-label={p.label}
                onClick={() => setOpenId(isOpen ? null : p.id)}
                onKeyDown={(e) => { if (e.key === 'Escape') setOpenId(null); }}
                className="flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className={'h-3.5 w-3.5 rounded-full ring-4 dark:bg-blue-400 ' + (isOpen ? 'bg-blue-700 ring-blue-500/40' : 'bg-blue-600 ring-blue-500/25')} />
              </button>
              {isOpen ? (
                <div role="dialog" aria-label={p.label} className="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg dark:border-gray-800 dark:bg-gray-900">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.label}</p>
                  <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{p.detail}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const minHeight = 320;

export default function MapPinPopoverPreview() {
  return <MapPinPopover className="w-full" />;
}
