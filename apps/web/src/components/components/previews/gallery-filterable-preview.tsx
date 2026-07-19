'use client';

import { useMemo, useState } from 'react';

/**
 * Live preview for `gallery-filterable`.
 *
 * Mirrors the `typescript` code variant. The photos are inline SVG data URIs so
 * the preview never touches the network, and each hue comes from the tile's
 * index rather than Math.random() - a random hue would differ between the
 * server and client renders and trip hydration.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface FilterablePhoto {
  id: string;
  title: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
}

interface Filter {
  id: string;
  label: string;
}

interface GalleryFilterableProps {
  items: FilterablePhoto[];
  className?: string;
}

const FILTERS: Filter[] = [
  { id: 'all', label: 'All' },
  { id: 'places', label: 'Places' },
  { id: 'structures', label: 'Structures' },
  { id: 'nature', label: 'Nature' },
];

function GalleryFilterable({ items, className = '' }: GalleryFilterableProps) {
  const [active, setActive] = useState<string>('all');

  const shown: FilterablePhoto[] = useMemo(
    () => (active === 'all' ? items : items.filter((item: FilterablePhoto) => item.tag === active)),
    [items, active],
  );

  return (
    <div className={className}>
      {/* A group, not a radiogroup: these toggle a view, they do not answer a
          question, and nothing here is submitted. */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by tag">
        {FILTERS.map((filter: Filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={active === filter.id}
            onClick={() => setActive(filter.id)}
            className="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[pressed=true]:border-blue-500 dark:aria-[pressed=true]:bg-blue-500 dark:aria-[pressed=true]:text-gray-950"
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Without this the grid reflows in total silence for a screen reader. */}
      <p className="my-3 text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite">
        Showing {shown.length} of {items.length} photos
      </p>

      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3">
        {shown.map((item: FilterablePhoto) => (
          <li key={item.id}>
            <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="block aspect-[4/3] w-full object-cover"
                src={item.imageSrc}
                alt={item.imageAlt}
                loading="lazy"
              />
              <figcaption className="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">
                {item.title}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A self-contained SVG swatch as a data URI - no network request, no asset. */
function swatch(index: number, width: number, height: number): string {
  const hue = (index * 47 + 205) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 60% 48%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 38) % 360} 56% 30%)"/>
    </linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_PHOTOS: FilterablePhoto[] = [
  { id: 'harbour', title: 'Harbour at dawn', tag: 'places', imageAlt: 'Fishing boats moored under an orange sky', imageSrc: swatch(0, 800, 600) },
  { id: 'ridge', title: 'Ridge trail', tag: 'nature', imageAlt: 'A footpath switching back through pine forest', imageSrc: swatch(1, 800, 600) },
  { id: 'stairwell', title: 'Stairwell study', tag: 'structures', imageAlt: 'Concrete stairwell seen from directly below', imageSrc: swatch(2, 800, 600) },
  { id: 'crossing', title: 'Night crossing', tag: 'structures', imageAlt: 'Long exposure of traffic crossing a bridge at night', imageSrc: swatch(3, 800, 600) },
  { id: 'salt', title: 'Salt flats', tag: 'nature', imageAlt: 'Salt flats meeting a pale horizon', imageSrc: swatch(4, 800, 600) },
  { id: 'market', title: 'Market row', tag: 'places', imageAlt: 'Market awnings in bright primary colours', imageSrc: swatch(5, 800, 600) },
];

export default function GalleryFilterablePreview() {
  return <GalleryFilterable items={SAMPLE_PHOTOS} className="w-full max-w-xl" />;
}
