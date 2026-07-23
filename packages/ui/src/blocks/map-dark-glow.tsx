'use client';

/**
 * Live preview for `map-dark-glow`.
 *
 * Mirrors the `typescript` code variant verbatim. The panel paints its own dark
 * surface, so it looks the same in either theme. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface MapMarker {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface MapDarkGlowProps {
  markers?: MapMarker[];
  className?: string;
}

const DEFAULT_MARKERS: MapMarker[] = [
  { id: 'sf', label: 'San Francisco', x: 16, y: 42 },
  { id: 'ldn', label: 'London', x: 49, y: 33 },
  { id: 'sg', label: 'Singapore', x: 74, y: 63 },
  { id: 'syd', label: 'Sydney', x: 86, y: 82 },
];

const LAND: Array<[number, number, number]> = [
  [6, 5, 2.5], [6, 8, 3], [7, 11, 2.5], [8, 13, 1.8],
  [16, 5, 2], [17, 7, 2.2], [17, 10, 2.8], [18, 12, 1.8],
  [23, 5, 2.6], [26, 6, 2.6], [24, 8, 2.2], [27, 12, 1.8],
];
const COLS = 32;
const ROWS = 16;

export function MapDarkGlow({ markers = DEFAULT_MARKERS, className = '' }: MapDarkGlowProps) {
  const isLand = (c: number, r: number): boolean =>
    LAND.some(([x, y, rad]) => (c - x) * (c - x) + (r - y) * (r - y) <= rad * rad);
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (isLand(c, r)) dots.push([c, r]);
    }
  }

  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 ' + className}>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true" />
      <div className="relative aspect-[2/1] w-full">
        <svg aria-hidden="true" viewBox="0 0 256 128" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full text-blue-400/40">
          {dots.map(([c, r]) => (
            <circle key={c + '-' + r} cx={c * 8 + 4} cy={r * 8 + 4} r={1.6} fill="currentColor" />
          ))}
        </svg>
        {markers.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-label={m.label}
            style={{ left: m.x + '%', top: m.y + '%' }}
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="h-3 w-3 rounded-full bg-blue-400 ring-4 ring-blue-400/30" />
          </button>
        ))}
      </div>
    </div>
  );
}

export const minHeight = 260;

export default function MapDarkGlowPreview() {
  return <MapDarkGlow className="w-full" />;
}
