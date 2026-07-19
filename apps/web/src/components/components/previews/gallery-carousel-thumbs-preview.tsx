'use client';

import { useRef, useState } from 'react';

/**
 * Live preview for `gallery-carousel-thumbs`.
 *
 * Mirrors the `typescript` code variant with six photos - enough that the
 * filmstrip actually overflows and scrolls, which is the whole reason this
 * exists rather than the fixed strip in `carousel-thumbnails`. The photos are
 * inline SVG data URIs so the preview never touches the network.
 *
 * The scrollIntoView call sits inside `select` rather than an effect so it can
 * only ever run because a user pressed something - an effect would fire on
 * mount and scroll the page hosting this iframe. `block: 'nearest'` keeps it
 * from scrolling vertically at all.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

interface GalleryCarouselThumbsProps {
  items: GalleryPhoto[];
  onSelect?: (index: number) => void;
  className?: string;
}

function GalleryCarouselThumbs({ items, onSelect, className = '' }: GalleryCarouselThumbsProps) {
  const [index, setIndex] = useState<number>(0);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = items[index];

  const select = (next: number): void => {
    const bounded = (next + items.length) % items.length;
    setIndex(bounded);
    onSelect?.(bounded);
    thumbRefs.current[bounded]?.scrollIntoView({
      inline: 'nearest',
      block: 'nearest',
      behavior: 'smooth',
    });
  };

  if (!active) return null;

  return (
    <div className={`max-w-lg ${className}`}>
      <section aria-roledescription="carousel" aria-label="Photo gallery">
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          {/* key forces a swap so the live region sees a new node, not a mutated src. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={active.id} className="block h-56 w-full object-cover" src={active.imageSrc} alt={active.imageAlt} />
        </div>

        <div className="flex items-center gap-2 pt-2.5">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => select(index - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            ‹
          </button>
          <p className="m-0 flex-1 text-center">
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">{active.title}</span>
            {/* "3 of 6" in words: a highlighted thumb only says this to someone
                who can see the whole strip at once. */}
            <span className="block text-xs tabular-nums text-gray-600 dark:text-gray-400">
              {index + 1} of {items.length}
            </span>
          </p>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => select(index + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            ›
          </button>
        </div>
      </section>

      <ul className="flex snap-x snap-mandatory list-none gap-2 overflow-x-auto p-0 pt-3">
        {items.map((item: GalleryPhoto, i: number) => (
          <li key={item.id}>
            <button
              ref={(node: HTMLButtonElement | null) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-current={i === index ? true : undefined}
              onClick={() => select(i)}
              className={`block w-16 shrink-0 snap-start overflow-hidden rounded-lg border bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
                i === index
                  ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                  : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
              }`}
            >
              {/* alt="" - the sr-only span is this button's accessible name. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{`Show ${item.title}`}</span>
            </button>
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

const SAMPLE_PHOTOS: GalleryPhoto[] = [
  { id: 'harbour', title: 'Harbour at dawn', imageAlt: 'Fishing boats moored under an orange sky', imageSrc: swatch(0, 800, 600) },
  { id: 'ridge', title: 'Ridge trail', imageAlt: 'A footpath switching back through pine forest', imageSrc: swatch(1, 800, 600) },
  { id: 'stairwell', title: 'Stairwell study', imageAlt: 'Concrete stairwell seen from directly below', imageSrc: swatch(2, 800, 600) },
  { id: 'crossing', title: 'Night crossing', imageAlt: 'Long exposure of traffic crossing a bridge at night', imageSrc: swatch(3, 800, 600) },
  { id: 'salt', title: 'Salt flats', imageAlt: 'Salt flats meeting a pale horizon', imageSrc: swatch(4, 800, 600) },
  { id: 'market', title: 'Market row', imageAlt: 'Market awnings in bright primary colours', imageSrc: swatch(5, 800, 600) },
];

export default function GalleryCarouselThumbsPreview() {
  return <GalleryCarouselThumbs items={SAMPLE_PHOTOS} className="w-full" />;
}
