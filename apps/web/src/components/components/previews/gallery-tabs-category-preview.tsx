'use client';

import { useState } from 'react';

/**
 * Live preview for `gallery-tabs-category`.
 *
 * Mirrors the `typescript` code variant. Category chips are aria-pressed
 * toggles; the pressed fill keys off the attribute so state and style cannot
 * drift. Media are CSS gradient tiles - no network.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface CategorisedTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  category: string;
}

interface CategoryTab {
  id: string;
  label: string;
}

interface GalleryTabsCategoryProps {
  items: CategorisedTile[];
  categories: CategoryTab[];
  className?: string;
}

function GalleryTabsCategory({ items, categories, className = '' }: GalleryTabsCategoryProps) {
  const [active, setActive] = useState<string>('all');
  const shown = active === 'all' ? items : items.filter((item) => item.category === active);
  const tabs: CategoryTab[] = [{ id: 'all', label: 'All' }, ...categories];

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active === tab.id}
            onClick={() => setActive(tab.id)}
            className="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="mt-3 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item: CategorisedTile) => (
          <li key={item.id}>
            <figure className="m-0">
              <div role="img" aria-label={item.label} className={`aspect-square w-full rounded-xl bg-gradient-to-br ${item.gradient}`} />
              <figcaption className="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SAMPLE_CATEGORIES: CategoryTab[] = [
  { id: 'nature', label: 'Nature' },
  { id: 'urban', label: 'Urban' },
];

const SAMPLE_TILES: CategorisedTile[] = [
  { id: 'forest', title: 'Forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600', category: 'nature' },
  { id: 'coast', title: 'Coastline', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600', category: 'nature' },
  { id: 'skyline', title: 'Skyline', label: 'Slate gradient', gradient: 'from-slate-400 to-slate-700', category: 'urban' },
  { id: 'subway', title: 'Subway', label: 'Zinc gradient', gradient: 'from-zinc-400 to-zinc-700', category: 'urban' },
  { id: 'meadow', title: 'Meadow', label: 'Lime to emerald gradient', gradient: 'from-lime-400 to-emerald-600', category: 'nature' },
  { id: 'bridge', title: 'Bridge', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500', category: 'urban' },
];

export default function GalleryTabsCategoryPreview() {
  return <GalleryTabsCategory items={SAMPLE_TILES} categories={SAMPLE_CATEGORIES} className="w-full max-w-xl" />;
}
