'use client';

/**
 * Live preview for `map-contact-split`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/maps.ts`.
 */
interface MapContactSplitProps {
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
}: MapContactSplitProps) {
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
              <a href={'tel:' + phone.replace(/[^+\d]/g, '')} className="rounded text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400">{phone}</a>
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
}

export const minHeight = 460;

export default function MapContactSplitPreview() {
  return <MapContactSplit className="w-full" />;
}
