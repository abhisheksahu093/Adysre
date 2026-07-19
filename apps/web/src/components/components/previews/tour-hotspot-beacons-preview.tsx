'use client';

import { useId, useState, type KeyboardEvent } from 'react';

/**
 * Live preview for `tour-hotspot-beacons`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive: focus or click a
 * pulsing beacon to open its tip; Escape closes it. The pulse yields to
 * `motion-reduce`. Keep in step with `src/data/components/tour.ts`.
 */
interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  tip: string;
}

interface HotspotBeaconsProps {
  hotspots: Hotspot[];
  className?: string;
}

function alignFor(x: number): string {
  if (x < 40) return 'left-0';
  if (x > 60) return 'right-0';
  return 'left-1/2 -translate-x-1/2';
}

function HotspotBeacons({ hotspots, className = '' }: HotspotBeaconsProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`relative isolate mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950 ${className}`}>
      <div className="absolute inset-0 p-4" aria-hidden="true">
        <div className="h-3 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="mt-3 h-16 w-full rounded-lg bg-white/70 dark:bg-gray-800/70" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
          <div className="h-10 rounded-lg bg-white/70 dark:bg-gray-800/70" />
        </div>
      </div>

      {hotspots.map((h) => {
        const isOpen = openId === h.id;
        const tipId = `${baseId}-${h.id}`;
        return (
          <div key={h.id} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={tipId}
              aria-label={h.label}
              onFocus={() => setOpenId(h.id)}
              onBlur={() => setOpenId((cur) => (cur === h.id ? null : cur))}
              onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => { if (e.key === 'Escape') setOpenId(null); }}
              className="relative -ml-2 -mt-2 flex h-4 w-4 items-center justify-center rounded-full focus:outline-none"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500/70 motion-reduce:hidden" aria-hidden="true" />
              <span className={`relative inline-flex h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white dark:ring-gray-900 ${isOpen ? 'ring-blue-300 dark:ring-blue-500' : ''}`} />
            </button>

            {isOpen ? (
              <div id={tipId} role="tooltip" className={`absolute top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xl dark:border-gray-700 dark:bg-gray-900 ${alignFor(h.x)}`}>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{h.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{h.tip}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

const SAMPLE_HOTSPOTS: Hotspot[] = [
  { id: 'search', x: 24, y: 22, label: 'Search', tip: 'Jump to any record from here - no menu-hunting.' },
  { id: 'filters', x: 70, y: 50, label: 'Filters', tip: 'Narrow the list by owner, status or date.' },
  { id: 'invite', x: 48, y: 30, label: 'Invite', tip: 'Add teammates and set their roles in one place.' },
];

export const minHeight = 320;

export default function TourHotspotBeaconsPreview() {
  return <HotspotBeacons hotspots={SAMPLE_HOTSPOTS} />;
}
