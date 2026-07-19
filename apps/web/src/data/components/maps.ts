import type { ComponentEntry } from './types';

/**
 * Maps category.
 *
 * Ten map surfaces that never touch a tile server. Every "map" here is drawn
 * with inline SVG - blob-dotted continents, dot-pattern grids, or a routed
 * polyline - so a component can ship without an API key, a third-party script,
 * or a network round-trip that leaks the visitor's IP to a maps vendor. The
 * shared constraint: the dotted surface is always decoration (`aria-hidden`),
 * and every location that matters is a real `<button>` with an `aria-label` and
 * a visible focus ring, because a pin a keyboard cannot reach is a pin that does
 * not exist. `map-embed-responsive` is the deliberate exception that proves the
 * rule - it renders a styled placeholder and leaves the live `<iframe>`
 * commented out, so nothing phones home until you opt in.
 */
export const mapsComponents: ComponentEntry[] = [
  {
    slug: 'map-world-dotted',
    category: 'maps',
    tags: ['map', 'world', 'dotted', 'svg', 'locations'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'markers', type: 'MapMarker[]', descriptionKey: 'markers' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The dotted continents are painted from a handful of blobs in the SVG below and
  are purely decorative (aria-hidden). Each city is a real button with a label so
  a keyboard and a screen reader can both reach it.
-->
<div class="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <div class="relative aspect-[2/1] w-full">
    <svg aria-hidden="true" viewBox="0 0 256 128" preserveAspectRatio="xMidYMid meet" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700">
      <defs>
        <pattern id="world-dotted-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="256" height="128" fill="url(#world-dotted-grid)" opacity="0.5" />
    </svg>
    <button type="button" aria-label="San Francisco" style="left:16%;top:42%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
    <button type="button" aria-label="London" style="left:49%;top:33%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
    <button type="button" aria-label="Singapore" style="left:74%;top:63%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
  </div>
</div>`,
      react: `const DEFAULT_MARKERS = [
  { id: 'sf', label: 'San Francisco', x: 16, y: 42 },
  { id: 'ny', label: 'New York', x: 29, y: 38 },
  { id: 'ldn', label: 'London', x: 49, y: 33 },
  { id: 'sg', label: 'Singapore', x: 74, y: 63 },
  { id: 'syd', label: 'Sydney', x: 86, y: 82 },
];

// Continents are blobs, not geography: a dot is drawn only where it falls inside
// one of these circles. Good enough to read as a world, cheap enough to inline.
const LAND = [
  [6, 5, 2.5], [6, 8, 3], [7, 11, 2.5], [8, 13, 1.8],
  [16, 5, 2], [17, 7, 2.2], [17, 10, 2.8], [18, 12, 1.8],
  [23, 5, 2.6], [26, 6, 2.6], [24, 8, 2.2], [27, 12, 1.8],
];
const COLS = 32;
const ROWS = 16;

export function MapWorldDotted({ markers = DEFAULT_MARKERS, className = '' }) {
  const isLand = (c, r) => LAND.some(([x, y, rad]) => (c - x) * (c - x) + (r - y) * (r - y) <= rad * rad);
  const dots = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (isLand(c, r)) dots.push([c, r]);
    }
  }

  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative aspect-[2/1] w-full">
        <svg aria-hidden="true" viewBox="0 0 256 128" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700">
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
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400" />
          </button>
        ))}
      </div>
    </div>
  );
}`,
      typescript: `export interface MapMarker {
  id: string;
  /** Accessible name for the pin button - a screen reader reads this aloud. */
  label: string;
  /** Horizontal position as a percentage of the panel width (0-100). */
  x: number;
  /** Vertical position as a percentage of the panel height (0-100). */
  y: number;
}

export interface MapWorldDottedProps {
  markers?: MapMarker[];
  className?: string;
}

const DEFAULT_MARKERS: MapMarker[] = [
  { id: 'sf', label: 'San Francisco', x: 16, y: 42 },
  { id: 'ny', label: 'New York', x: 29, y: 38 },
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

export function MapWorldDotted({ markers = DEFAULT_MARKERS, className = '' }: MapWorldDottedProps): JSX.Element {
  const isLand = (c: number, r: number): boolean =>
    LAND.some(([x, y, rad]) => (c - x) * (c - x) + (r - y) * (r - y) <= rad * rad);
  const dots: Array<[number, number]> = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (isLand(c, r)) dots.push([c, r]);
    }
  }

  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative aspect-[2/1] w-full">
        <svg aria-hidden="true" viewBox="0 0 256 128" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700">
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
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400" />
          </button>
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'map-office-locations',
    category: 'maps',
    tags: ['map', 'offices', 'locations', 'pins', 'list'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'stacked', labelKey: 'stacked' },
    ],
    props: [
      { name: 'offices', type: 'Office[]', descriptionKey: 'offices' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="grid w-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <div class="relative order-2 aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 md:order-1 dark:bg-gray-900">
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="office-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#office-dots)" />
    </svg>
    <button type="button" aria-label="Berlin office" style="left:30%;top:34%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
    <button type="button" aria-label="Austin office" style="left:64%;top:60%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
  </div>
  <ul class="order-1 space-y-3 md:order-2">
    <li class="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Berlin</p>
      <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">Torstrasse 21, 10119</p>
    </li>
    <li class="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Austin</p>
      <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">120 Congress Ave, TX 78701</p>
    </li>
  </ul>
</div>`,
      react: `const DEFAULT_OFFICES = [
  { id: 'ber', city: 'Berlin', address: 'Torstrasse 21, 10119', x: 30, y: 34 },
  { id: 'aus', city: 'Austin', address: '120 Congress Ave, TX 78701', x: 64, y: 60 },
  { id: 'sgp', city: 'Singapore', address: '8 Marina Blvd, 018981', x: 82, y: 46 },
];

export function MapOfficeLocations({ offices = DEFAULT_OFFICES, className = '' }) {
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
}`,
      typescript: `export interface Office {
  id: string;
  city: string;
  address: string;
  /** Pin position as a percentage of the map panel (0-100). */
  x: number;
  y: number;
}

export interface MapOfficeLocationsProps {
  offices?: Office[];
  className?: string;
}

const DEFAULT_OFFICES: Office[] = [
  { id: 'ber', city: 'Berlin', address: 'Torstrasse 21, 10119', x: 30, y: 34 },
  { id: 'aus', city: 'Austin', address: '120 Congress Ave, TX 78701', x: 64, y: 60 },
  { id: 'sgp', city: 'Singapore', address: '8 Marina Blvd, 018981', x: 82, y: 46 },
];

export function MapOfficeLocations({ offices = DEFAULT_OFFICES, className = '' }: MapOfficeLocationsProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'map-contact-split',
    category: 'maps',
    tags: ['map', 'contact', 'split', 'address', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reversed', labelKey: 'reversed' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Visit us'", descriptionKey: 'title' },
      { name: 'address', type: 'string', descriptionKey: 'address' },
      { name: 'email', type: 'string', descriptionKey: 'email' },
      { name: 'phone', type: 'string', descriptionKey: 'phone' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="grid w-full items-stretch gap-6 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <div>
    <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Visit us</h2>
    <dl class="mt-4 space-y-3 text-sm">
      <div>
        <dt class="font-medium text-gray-500 dark:text-gray-400">Address</dt>
        <dd class="mt-0.5 text-gray-900 dark:text-gray-100">Torstrasse 21, 10119 Berlin</dd>
      </div>
      <div>
        <dt class="font-medium text-gray-500 dark:text-gray-400">Email</dt>
        <dd class="mt-0.5"><a href="mailto:hi@example.com" class="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">hi@example.com</a></dd>
      </div>
      <div>
        <dt class="font-medium text-gray-500 dark:text-gray-400">Phone</dt>
        <dd class="mt-0.5"><a href="tel:+493012345678" class="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">+49 30 1234 5678</a></dd>
      </div>
    </dl>
  </div>
  <div class="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="contact-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#contact-dots)" />
    </svg>
    <button type="button" aria-label="Office location on map" style="left:50%;top:50%" class="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-4 w-4 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
  </div>
</div>`,
      react: `export function MapContactSplit({
  title = 'Visit us',
  address = 'Torstrasse 21, 10119 Berlin',
  email = 'hi@example.com',
  phone = '+49 30 1234 5678',
  className = '',
}) {
  return (
    <div className={'grid w-full items-stretch gap-6 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Address</dt>
            <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{address}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="mt-0.5">
              <a href={'mailto:' + email} className="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">{email}</a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Phone</dt>
            <dd className="mt-0.5">
              <a href={'tel:' + phone.replace(/[^+\\d]/g, '')} className="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">{phone}</a>
            </dd>
          </div>
        </dl>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="contact-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-dots)" />
        </svg>
        <button type="button" aria-label="Office location on map" style={{ left: '50%', top: '50%' }} className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <span className="h-4 w-4 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400" />
        </button>
      </div>
    </div>
  );
}`,
      typescript: `export interface MapContactSplitProps {
  title?: string;
  address?: string;
  email?: string;
  phone?: string;
  className?: string;
}

export function MapContactSplit({
  title = 'Visit us',
  address = 'Torstrasse 21, 10119 Berlin',
  email = 'hi@example.com',
  phone = '+49 30 1234 5678',
  className = '',
}: MapContactSplitProps): JSX.Element {
  return (
    <div className={'grid w-full items-stretch gap-6 rounded-2xl border border-gray-200 bg-white p-6 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Address</dt>
            <dd className="mt-0.5 text-gray-900 dark:text-gray-100">{address}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="mt-0.5">
              <a href={'mailto:' + email} className="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">{email}</a>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500 dark:text-gray-400">Phone</dt>
            <dd className="mt-0.5">
              <a href={'tel:' + phone.replace(/[^+\\d]/g, '')} className="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">{phone}</a>
            </dd>
          </div>
        </dl>
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="contact-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contact-dots)" />
        </svg>
        <button type="button" aria-label="Office location on map" style={{ left: '50%', top: '50%' }} className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <span className="h-4 w-4 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400" />
        </button>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'map-region-selector',
    category: 'maps',
    tags: ['map', 'region', 'selector', 'interactive', 'grid'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'regions', type: 'Region[]', descriptionKey: 'regions' },
      { name: 'defaultSelectedId', type: 'string', descriptionKey: 'defaultSelectedId' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Static snapshot: "Europe" is the pressed tile. Wire aria-pressed to state in a framework. -->
<div class="w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
  <div role="group" aria-label="Select a region" class="grid grid-cols-2 gap-2 sm:grid-cols-3">
    <button type="button" aria-pressed="false" class="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Americas</button>
    <button type="button" aria-pressed="true" class="flex min-h-[44px] items-center justify-center rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500 dark:bg-blue-500">Europe</button>
    <button type="button" aria-pressed="false" class="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Africa</button>
    <button type="button" aria-pressed="false" class="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Middle East</button>
    <button type="button" aria-pressed="false" class="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Asia Pacific</button>
    <button type="button" aria-pressed="false" class="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Oceania</button>
  </div>
  <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">Serving <span class="font-semibold text-gray-900 dark:text-gray-100">Europe</span></p>
</div>`,
      react: `import { useState } from 'react';

const DEFAULT_REGIONS = [
  { id: 'am', label: 'Americas' },
  { id: 'eu', label: 'Europe' },
  { id: 'af', label: 'Africa' },
  { id: 'me', label: 'Middle East' },
  { id: 'ap', label: 'Asia Pacific' },
  { id: 'oc', label: 'Oceania' },
];

export function MapRegionSelector({ regions = DEFAULT_REGIONS, defaultSelectedId, onSelect, className = '' }) {
  const [selected, setSelected] = useState(defaultSelectedId || regions[0]?.id || '');
  const current = regions.find((r) => r.id === selected);

  const choose = (id) => {
    setSelected(id);
    if (onSelect) onSelect(id);
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
}`,
      typescript: `import { useState } from 'react';

export interface Region {
  id: string;
  label: string;
}

export interface MapRegionSelectorProps {
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
}: MapRegionSelectorProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'map-pin-popover',
    category: 'maps',
    tags: ['map', 'pin', 'popover', 'interactive', 'tooltip'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'open', labelKey: 'open' },
    ],
    props: [
      { name: 'places', type: 'Place[]', descriptionKey: 'places' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Static snapshot with one popover open. In a framework, toggle it from the pin's aria-expanded. -->
<div class="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <div class="relative aspect-[16/10] w-full">
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pin-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pin-dots)" />
    </svg>
    <div class="absolute" style="left:40%;top:45%">
      <button type="button" aria-expanded="true" aria-label="The Roastery" class="flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <span class="h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
      </button>
      <div role="dialog" aria-label="The Roastery" class="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">The Roastery</p>
        <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">Open until 6pm · 0.4 km away</p>
      </div>
    </div>
  </div>
</div>`,
      react: `import { useState } from 'react';

const DEFAULT_PLACES = [
  { id: 'roastery', label: 'The Roastery', detail: 'Open until 6pm · 0.4 km away', x: 40, y: 45 },
  { id: 'library', label: 'City Library', detail: 'Open until 9pm · 1.1 km away', x: 66, y: 62 },
  { id: 'park', label: 'Riverside Park', detail: 'Open 24h · 0.8 km away', x: 24, y: 70 },
];

export function MapPinPopover({ places = DEFAULT_PLACES, className = '' }) {
  const [openId, setOpenId] = useState(null);

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
}`,
      typescript: `import { useState } from 'react';

export interface Place {
  id: string;
  label: string;
  detail: string;
  /** Pin position as a percentage of the panel (0-100). */
  x: number;
  y: number;
}

export interface MapPinPopoverProps {
  places?: Place[];
  className?: string;
}

const DEFAULT_PLACES: Place[] = [
  { id: 'roastery', label: 'The Roastery', detail: 'Open until 6pm · 0.4 km away', x: 40, y: 45 },
  { id: 'library', label: 'City Library', detail: 'Open until 9pm · 1.1 km away', x: 66, y: 62 },
  { id: 'park', label: 'Riverside Park', detail: 'Open 24h · 0.8 km away', x: 24, y: 70 },
];

export function MapPinPopover({ places = DEFAULT_PLACES, className = '' }: MapPinPopoverProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'map-coverage-stats',
    category: 'maps',
    tags: ['map', 'coverage', 'stats', 'metrics', 'overlay'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'inset', labelKey: 'inset' },
    ],
    props: [
      { name: 'stats', type: 'CoverageStat[]', descriptionKey: 'stats' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <div class="relative aspect-[16/9] w-full">
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="coverage-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#coverage-dots)" />
    </svg>
    <div class="absolute inset-x-3 bottom-3 rounded-xl border border-gray-200 bg-white/90 p-3 backdrop-blur sm:inset-x-4 sm:bottom-4 dark:border-gray-800 dark:bg-gray-900/90">
      <dl class="grid grid-cols-3 gap-2 text-center">
        <div>
          <dt class="text-xs text-gray-500 dark:text-gray-400">Countries</dt>
          <dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">150+</dd>
        </div>
        <div>
          <dt class="text-xs text-gray-500 dark:text-gray-400">Cities</dt>
          <dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">4,000</dd>
        </div>
        <div>
          <dt class="text-xs text-gray-500 dark:text-gray-400">Uptime</dt>
          <dd class="text-lg font-semibold text-gray-900 dark:text-gray-100">99.99%</dd>
        </div>
      </dl>
    </div>
  </div>
</div>`,
      react: `const DEFAULT_STATS = [
  { id: 'countries', label: 'Countries', value: '150+' },
  { id: 'cities', label: 'Cities', value: '4,000' },
  { id: 'uptime', label: 'Uptime', value: '99.99%' },
];

export function MapCoverageStats({ stats = DEFAULT_STATS, className = '' }) {
  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative aspect-[16/9] w-full">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="coverage-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#coverage-dots)" />
        </svg>
        {/* Solid-ish card, not glass-only: text over an arbitrary dotted field needs its own opaque backing to clear AA. */}
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-gray-200 bg-white/90 p-3 backdrop-blur sm:inset-x-4 sm:bottom-4 dark:border-gray-800 dark:bg-gray-900/90">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.id}>
                <dt className="text-xs text-gray-500 dark:text-gray-400">{s.label}</dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `export interface CoverageStat {
  id: string;
  label: string;
  value: string;
}

export interface MapCoverageStatsProps {
  stats?: CoverageStat[];
  className?: string;
}

const DEFAULT_STATS: CoverageStat[] = [
  { id: 'countries', label: 'Countries', value: '150+' },
  { id: 'cities', label: 'Cities', value: '4,000' },
  { id: 'uptime', label: 'Uptime', value: '99.99%' },
];

export function MapCoverageStats({ stats = DEFAULT_STATS, className = '' }: MapCoverageStatsProps): JSX.Element {
  return (
    <div className={'relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative aspect-[16/9] w-full">
        <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="coverage-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.4" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#coverage-dots)" />
        </svg>
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-gray-200 bg-white/90 p-3 backdrop-blur sm:inset-x-4 sm:bottom-4 dark:border-gray-800 dark:bg-gray-900/90">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {stats.map((s) => (
              <div key={s.id}>
                <dt className="text-xs text-gray-500 dark:text-gray-400">{s.label}</dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'map-store-locator-list',
    category: 'maps',
    tags: ['map', 'store', 'locator', 'list', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'stores', type: 'Store[]', descriptionKey: 'stores' },
      { name: 'defaultActiveId', type: 'string', descriptionKey: 'defaultActiveId' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Static snapshot: the first store is active. In a framework, a shared state links list item and pin. -->
<div class="grid w-full gap-4 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
  <ul class="space-y-2">
    <li>
      <button type="button" aria-pressed="true" class="w-full rounded-xl border border-blue-600 bg-blue-50 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-500 dark:bg-blue-500/10">
        <span class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Downtown</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">0.4 km</span>
        </span>
        <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">12 Market St</span>
      </button>
    </li>
    <li>
      <button type="button" aria-pressed="false" class="w-full rounded-xl border border-gray-200 p-3 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:hover:bg-gray-900">
        <span class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Harbour</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">2.1 km</span>
        </span>
        <span class="mt-0.5 block text-sm text-gray-600 dark:text-gray-400">4 Pier Road</span>
      </button>
    </li>
  </ul>
  <div class="relative order-first aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 md:order-none dark:bg-gray-900">
    <svg aria-hidden="true" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="store-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#store-dots)" />
    </svg>
    <button type="button" aria-label="Downtown store" style="left:38%;top:44%" class="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-4 w-4 rounded-full bg-blue-700 ring-4 ring-blue-500/40 dark:bg-blue-300"></span>
    </button>
    <button type="button" aria-label="Harbour store" style="left:68%;top:64%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <span class="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-500/25 dark:bg-blue-400"></span>
    </button>
  </div>
</div>`,
      react: `import { useState } from 'react';

const DEFAULT_STORES = [
  { id: 'downtown', name: 'Downtown', address: '12 Market St', distance: '0.4 km', x: 38, y: 44 },
  { id: 'harbour', name: 'Harbour', address: '4 Pier Road', distance: '2.1 km', x: 68, y: 64 },
  { id: 'uptown', name: 'Uptown', address: '90 Hill Ave', distance: '3.7 km', x: 28, y: 72 },
];

export function MapStoreLocatorList({ stores = DEFAULT_STORES, defaultActiveId, className = '' }) {
  const [activeId, setActiveId] = useState(defaultActiveId || stores[0]?.id || '');

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
}`,
      typescript: `import { useState } from 'react';

export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  /** Pin position as a percentage of the map panel (0-100). */
  x: number;
  y: number;
}

export interface MapStoreLocatorListProps {
  stores?: Store[];
  defaultActiveId?: string;
  className?: string;
}

const DEFAULT_STORES: Store[] = [
  { id: 'downtown', name: 'Downtown', address: '12 Market St', distance: '0.4 km', x: 38, y: 44 },
  { id: 'harbour', name: 'Harbour', address: '4 Pier Road', distance: '2.1 km', x: 68, y: 64 },
  { id: 'uptown', name: 'Uptown', address: '90 Hill Ave', distance: '3.7 km', x: 28, y: 72 },
];

export function MapStoreLocatorList({
  stores = DEFAULT_STORES,
  defaultActiveId,
  className = '',
}: MapStoreLocatorListProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'map-route-steps',
    category: 'maps',
    tags: ['map', 'route', 'steps', 'directions', 'svg'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'stacked', labelKey: 'stacked' },
    ],
    props: [
      { name: 'steps', type: 'RouteStep[]', descriptionKey: 'steps' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<div class="w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
  <div class="relative w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
    <svg viewBox="0 0 300 120" role="img" aria-label="Route with 4 stops" class="h-auto w-full text-gray-300 dark:text-gray-700">
      <polyline points="30,80 120,35 210,80 270,35" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 8" />
      <circle cx="30" cy="80" r="10" class="fill-blue-600 dark:fill-blue-500" />
      <text x="30" y="84" text-anchor="middle" class="fill-white text-[11px] font-semibold">1</text>
      <circle cx="120" cy="35" r="10" class="fill-blue-600 dark:fill-blue-500" />
      <text x="120" y="39" text-anchor="middle" class="fill-white text-[11px] font-semibold">2</text>
      <circle cx="210" cy="80" r="10" class="fill-blue-600 dark:fill-blue-500" />
      <text x="210" y="84" text-anchor="middle" class="fill-white text-[11px] font-semibold">3</text>
      <circle cx="270" cy="35" r="10" class="fill-blue-600 dark:fill-blue-500" />
      <text x="270" y="39" text-anchor="middle" class="fill-white text-[11px] font-semibold">4</text>
    </svg>
  </div>
  <ol class="mt-4 space-y-3">
    <li class="flex gap-3">
      <span class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">1</span>
      <span><span class="block text-sm font-medium text-gray-900 dark:text-gray-100">Head north on Market St</span><span class="block text-xs text-gray-500 dark:text-gray-400">400 m</span></span>
    </li>
    <li class="flex gap-3">
      <span class="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">2</span>
      <span><span class="block text-sm font-medium text-gray-900 dark:text-gray-100">Turn right onto 5th Ave</span><span class="block text-xs text-gray-500 dark:text-gray-400">1.2 km</span></span>
    </li>
  </ol>
</div>`,
      react: `const DEFAULT_STEPS = [
  { id: 's1', label: 'Head north on Market St', detail: '400 m' },
  { id: 's2', label: 'Turn right onto 5th Ave', detail: '1.2 km' },
  { id: 's3', label: 'Continue past the park', detail: '600 m' },
  { id: 's4', label: 'Arrive at the office', detail: 'On the left' },
];

export function MapRouteSteps({ steps = DEFAULT_STEPS, className = '' }) {
  // Stops zig-zag so a straight list reads as a route; x is spread across the viewBox.
  const stops = steps.map((s, i) => ({
    id: s.id,
    n: i + 1,
    x: 30 + (i * 240) / Math.max(1, steps.length - 1),
    y: i % 2 === 0 ? 80 : 35,
  }));
  const line = stops.map((p) => p.x + ',' + p.y).join(' ');

  return (
    <div className={'w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
        <svg viewBox="0 0 300 120" role="img" aria-label={'Route with ' + steps.length + ' stops'} className="h-auto w-full text-gray-300 dark:text-gray-700">
          <polyline points={line} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 8" />
          {stops.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={10} className="fill-blue-600 dark:fill-blue-500" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-white text-[11px] font-semibold">{p.n}</text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s.id} className="flex gap-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">{i + 1}</span>
            <span>
              <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{s.label}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}`,
      typescript: `export interface RouteStep {
  id: string;
  label: string;
  detail: string;
}

export interface MapRouteStepsProps {
  steps?: RouteStep[];
  className?: string;
}

const DEFAULT_STEPS: RouteStep[] = [
  { id: 's1', label: 'Head north on Market St', detail: '400 m' },
  { id: 's2', label: 'Turn right onto 5th Ave', detail: '1.2 km' },
  { id: 's3', label: 'Continue past the park', detail: '600 m' },
  { id: 's4', label: 'Arrive at the office', detail: 'On the left' },
];

export function MapRouteSteps({ steps = DEFAULT_STEPS, className = '' }: MapRouteStepsProps): JSX.Element {
  const stops = steps.map((s, i) => ({
    id: s.id,
    n: i + 1,
    x: 30 + (i * 240) / Math.max(1, steps.length - 1),
    y: i % 2 === 0 ? 80 : 35,
  }));
  const line = stops.map((p) => p.x + ',' + p.y).join(' ');

  return (
    <div className={'w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
        <svg viewBox="0 0 300 120" role="img" aria-label={'Route with ' + steps.length + ' stops'} className="h-auto w-full text-gray-300 dark:text-gray-700">
          <polyline points={line} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 8" />
          {stops.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={10} className="fill-blue-600 dark:fill-blue-500" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" className="fill-white text-[11px] font-semibold">{p.n}</text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s.id} className="flex gap-3">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">{i + 1}</span>
            <span>
              <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{s.label}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}`,
    },
  },
  {
    slug: 'map-embed-responsive',
    category: 'maps',
    tags: ['map', 'embed', 'iframe', 'responsive', 'placeholder'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'placeholder', labelKey: 'placeholder' },
      { id: 'square', labelKey: 'square' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Map'", descriptionKey: 'title' },
      { name: 'label', type: 'string', default: "'Map preview'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Responsive 16:9 frame. The live map is deliberately left commented out so the
  component ships nothing that phones home until you opt in - drop your provider's
  iframe in and delete the placeholder:

  <iframe
    title="Office location"
    src="https://maps.example.com/embed?place=..."
    class="absolute inset-0 h-full w-full border-0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
  ></iframe>
-->
<div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <svg aria-hidden="true" class="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="embed-dots" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.4" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#embed-dots)" />
  </svg>
  <div class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
    <span class="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="11" r="2"/></svg>
    </span>
    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Map preview</span>
  </div>
</div>`,
      react: `export function MapEmbedResponsive({ title = 'Map', label = 'Map preview', className = '' }) {
  return (
    <div className={'relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      {/*
        Drop your provider's iframe here and delete the placeholder below. It is
        left commented out on purpose - nothing loads or phones home until you opt in:

        <iframe
          title={title}
          src="https://maps.example.com/embed?place=..."
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="embed-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#embed-dots)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="11" r="2" />
          </svg>
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}`,
      typescript: `export interface MapEmbedResponsiveProps {
  /** Passed to the iframe title once you enable it. */
  title?: string;
  label?: string;
  className?: string;
}

export function MapEmbedResponsive({
  title = 'Map',
  label = 'Map preview',
  className = '',
}: MapEmbedResponsiveProps): JSX.Element {
  // title is reserved for the iframe you drop in; referenced here to keep it in the API.
  void title;
  return (
    <div className={'relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      {/*
        Drop your provider's iframe here and delete the placeholder below. It is
        left commented out on purpose - nothing loads or phones home until you opt in:

        <iframe
          title={title}
          src="https://maps.example.com/embed?place=..."
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="embed-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#embed-dots)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="11" r="2" />
          </svg>
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'map-dark-glow',
    category: 'maps',
    tags: ['map', 'dark', 'glow', 'world', 'dotted'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'violet', labelKey: 'violet' },
    ],
    props: [
      { name: 'markers', type: 'MapMarker[]', descriptionKey: 'markers' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Paints its own near-black surface and glow, so it looks identical on a light or dark page - no dark: variants needed. -->
<div class="relative w-full overflow-hidden rounded-2xl border border-gray-800 bg-gray-950">
  <div class="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-3xl" aria-hidden="true"></div>
  <div class="relative aspect-[2/1] w-full">
    <svg aria-hidden="true" viewBox="0 0 256 128" preserveAspectRatio="xMidYMid meet" class="absolute inset-0 h-full w-full text-blue-400/40">
      <defs>
        <pattern id="darkglow-grid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="256" height="128" fill="url(#darkglow-grid)" opacity="0.5" />
    </svg>
    <button type="button" aria-label="San Francisco" style="left:16%;top:42%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
      <span class="h-3 w-3 rounded-full bg-blue-400 ring-4 ring-blue-400/30"></span>
    </button>
    <button type="button" aria-label="London" style="left:49%;top:33%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
      <span class="h-3 w-3 rounded-full bg-blue-400 ring-4 ring-blue-400/30"></span>
    </button>
    <button type="button" aria-label="Singapore" style="left:74%;top:63%" class="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
      <span class="h-3 w-3 rounded-full bg-blue-400 ring-4 ring-blue-400/30"></span>
    </button>
  </div>
</div>`,
      react: `const DEFAULT_MARKERS = [
  { id: 'sf', label: 'San Francisco', x: 16, y: 42 },
  { id: 'ldn', label: 'London', x: 49, y: 33 },
  { id: 'sg', label: 'Singapore', x: 74, y: 63 },
  { id: 'syd', label: 'Sydney', x: 86, y: 82 },
];

const LAND = [
  [6, 5, 2.5], [6, 8, 3], [7, 11, 2.5], [8, 13, 1.8],
  [16, 5, 2], [17, 7, 2.2], [17, 10, 2.8], [18, 12, 1.8],
  [23, 5, 2.6], [26, 6, 2.6], [24, 8, 2.2], [27, 12, 1.8],
];
const COLS = 32;
const ROWS = 16;

export function MapDarkGlow({ markers = DEFAULT_MARKERS, className = '' }) {
  const isLand = (c, r) => LAND.some(([x, y, rad]) => (c - x) * (c - x) + (r - y) * (r - y) <= rad * rad);
  const dots = [];
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
}`,
      typescript: `export interface MapMarker {
  id: string;
  label: string;
  /** Position as a percentage of the panel (0-100). */
  x: number;
  y: number;
}

export interface MapDarkGlowProps {
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

export function MapDarkGlow({ markers = DEFAULT_MARKERS, className = '' }: MapDarkGlowProps): JSX.Element {
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
}`,
    },
  },
];
