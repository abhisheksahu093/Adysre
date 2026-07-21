'use client';

import { useState } from 'react';

/**
 * Live preview for `gallery-carousel-fullwidth`.
 *
 * Mirrors the `typescript` code variant. The stage is a polite live region; the
 * dots carry aria-current shown as ring + fill. Wrap-around paging keeps both
 * arrows live. Media are CSS gradient tiles - no network.
 *
 * The carousel carries no width cap of its own, so the default export lets it
 * run the full width of the page section rather than centring it in a column.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

interface GalleryCarouselFullwidthProps {
  items: GalleryTile[];
  className?: string;
}

function GalleryCarouselFullwidth({ items, className = '' }: GalleryCarouselFullwidthProps) {
  const [index, setIndex] = useState<number>(0);
  const active = items[index];
  if (!active) return null;

  const step = (delta: number): void => setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <section
      className={`relative w-full ${className}`}
      aria-roledescription="carousel"
      aria-label="Featured photos"
    >
      <div className="overflow-hidden rounded-2xl" aria-live="polite">
        <div key={active.id} role="img" aria-label={active.label} className={`relative aspect-video w-full bg-gradient-to-br ${active.gradient}`}>
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-base font-semibold text-white">
            {active.title}
          </p>
        </div>
      </div>

      <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">‹</button>
      <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">›</button>

      <div className="mt-3 flex justify-center gap-2">
        {items.map((item: GalleryTile, i: number) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index ? true : undefined}
            onClick={() => setIndex(i)}
            className="h-2.5 w-2.5 rounded-full bg-gray-300 ring-blue-600 aria-[current=true]:bg-blue-600 aria-[current=true]:ring-2 aria-[current=true]:ring-offset-2 dark:bg-gray-700 dark:aria-[current=true]:bg-blue-400"
          />
        ))}
      </div>
    </section>
  );
}

const SAMPLE_TILES: GalleryTile[] = [
  { id: 'coast', title: 'Coastline at dawn', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600' },
  { id: 'canyon', title: 'Red canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500' },
  { id: 'forest', title: 'Pine ridge', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'dusk', title: 'City dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600' },
];

export default function GalleryCarouselFullwidthPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <GalleryCarouselFullwidth items={SAMPLE_TILES} className="w-full" />
    </section>
  );
}
