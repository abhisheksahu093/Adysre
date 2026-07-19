'use client';

/**
 * Live preview for `map-office-locations`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface Office {
  id: string;
  city: string;
  address: string;
  x: number;
  y: number;
}

interface MapOfficeLocationsProps {
  offices?: Office[];
  className?: string;
}

const DEFAULT_OFFICES: Office[] = [
  { id: 'ber', city: 'Berlin', address: 'Torstrasse 21, 10119', x: 30, y: 34 },
  { id: 'aus', city: 'Austin', address: '120 Congress Ave, TX 78701', x: 64, y: 60 },
  { id: 'sgp', city: 'Singapore', address: '8 Marina Blvd, 018981', x: 82, y: 46 },
];

function MapOfficeLocations({ offices = DEFAULT_OFFICES, className = '' }: MapOfficeLocationsProps) {
  return (
    <div className={'grid w-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 md:order-1 dark:bg-gray-900">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="office-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#office-dots)" />
        </svg>
        {offices.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-label={o.city + ' office'}
            style={{ left: o.x + '%', top: o.y + '%' }}
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400" />
          </button>
        ))}
      </div>
      <ul className="order-1 space-y-3 md:order-2">
        {offices.map((o) => (
          <li key={o.id} className="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{o.city}</p>
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{o.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const minHeight = 440;

export default function MapOfficeLocationsPreview() {
  return <MapOfficeLocations className="w-full" />;
}
