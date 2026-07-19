'use client';

import { useState } from 'react';

/**
 * Live preview for `carousel-thumbnails`.
 *
 * Mirrors the `typescript` code variant with four sample images. The images are
 * inline SVG data URIs so the preview never touches the network and each view is
 * visibly distinct. Clicking a thumb swaps the main image and moves the ring.
 * Keep this in step with `src/data/components/carousel.ts`.
 */
interface GalleryImage {
  id: string;
  imageSrc: string;
  imageAlt: string;
}

interface CarouselThumbnailsProps {
  items: GalleryImage[];
  className?: string;
  ariaLabel?: string;
}

function CarouselThumbnails({ items, className = '', ariaLabel = 'Gallery' }: CarouselThumbnailsProps) {
  const [index, setIndex] = useState<number>(0);
  const active = items[index];

  if (!active) return null;

  return (
    <div className={`max-w-lg ${className}`}>
      <section aria-roledescription="carousel" aria-label={ariaLabel}>
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          {/* key forces a swap so the live region sees a new node, not a mutated src. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active.id}
            className="block h-64 w-full object-contain"
            src={active.imageSrc}
            alt={active.imageAlt}
          />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pt-3" role="group" aria-label="Choose an image">
        {items.map((item: GalleryImage, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show ${item.imageAlt}`}
            aria-current={i === index ? true : undefined}
            onClick={() => setIndex(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ${
              i === index
                ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
            }`}
          >
            {/* alt="" - the button's label already names this image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="h-full w-full object-contain" src={item.imageSrc} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

/** A self-contained SVG swatch as a data URI - no network request, no asset. */
function swatch(from: string, to: string, glyph: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="160" height="120" fill="url(#g)"/>
    <text x="80" y="76" font-family="system-ui, sans-serif" font-size="48" font-weight="600" fill="#ffffff" text-anchor="middle">${glyph}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_IMAGES: GalleryImage[] = [
  { id: 'front', imageSrc: swatch('#2563eb', '#4f46e5', '1'), imageAlt: 'Front view' },
  { id: 'side', imageSrc: swatch('#4f46e5', '#7c3aed', '2'), imageAlt: 'Side view' },
  { id: 'detail', imageSrc: swatch('#0f766e', '#0369a1', '3'), imageAlt: 'Detail view' },
  { id: 'packaging', imageSrc: swatch('#b45309', '#be123c', '4'), imageAlt: 'Packaging' },
];

export default function CarouselThumbnailsPreview() {
  return <CarouselThumbnails items={SAMPLE_IMAGES} ariaLabel="Product gallery" className="w-full" />;
}
