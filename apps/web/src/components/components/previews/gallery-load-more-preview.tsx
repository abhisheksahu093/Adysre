'use client';

import { useState } from 'react';

/**
 * Live preview for `gallery-load-more`.
 *
 * Mirrors the `typescript` code variant. A polite live region announces the
 * running count as tiles reveal in place; the button removes itself once
 * everything is shown. Media are CSS gradient tiles - no network.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

interface GalleryLoadMoreProps {
  items: GalleryTile[];
  step?: number;
  className?: string;
}

function GalleryLoadMore({ items, step = 4, className = '' }: GalleryLoadMoreProps) {
  const [visible, setVisible] = useState<number>(step);
  const shown = items.slice(0, visible);
  const allShown = visible >= items.length;

  return (
    <div className={className}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item: GalleryTile) => (
          <li key={item.id}>
            <figure className="m-0">
              <div role="img" aria-label={item.label} className={`aspect-square w-full rounded-xl bg-gradient-to-br ${item.gradient}`} />
              <figcaption className="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-center text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite">
        Showing {shown.length} of {items.length} photos
      </p>

      {!allShown && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(v + step, items.length))}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

const SAMPLE_TILES: GalleryTile[] = [
  { id: 'coast', title: 'Coastline', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600' },
  { id: 'canyon', title: 'Canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500' },
  { id: 'forest', title: 'Forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'dusk', title: 'Dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600' },
  { id: 'desert', title: 'Desert', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500' },
  { id: 'harbour', title: 'Harbour', label: 'Cyan to blue gradient', gradient: 'from-cyan-400 to-blue-600' },
  { id: 'meadow', title: 'Meadow', label: 'Lime to emerald gradient', gradient: 'from-lime-400 to-emerald-600' },
  { id: 'bloom', title: 'Bloom', label: 'Pink to rose gradient', gradient: 'from-pink-400 to-rose-600' },
];

export default function GalleryLoadMorePreview() {
  return <GalleryLoadMore items={SAMPLE_TILES} className="w-full max-w-xl" />;
}
