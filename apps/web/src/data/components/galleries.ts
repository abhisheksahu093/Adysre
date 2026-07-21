import type { ComponentEntry } from './types';

/**
 * Galleries category.
 *
 * Five structurally different answers to "show a set of images", not five
 * skins of one grid: an even grid, a real CSS-columns masonry, a modal
 * lightbox, a filmstrip carousel and a filtered set. What they share is the
 * markup contract - a gallery is a list, so every one of them is a `<ul>`, and
 * every tile is a `<figure>` whose caption is tied to its image rather than
 * merely sitting near it.
 */
export const galleriesComponents: ComponentEntry[] = [
  {
    slug: 'gallery-grid',
    category: 'galleries',
    tags: ['gallery', 'grid', 'images', 'responsive', 'figure'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-06-21',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 1960, copies: 528, downloads: 137 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'items',
        type: 'GalleryPhoto[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'harbour', title: 'Harbour at dawn', imageSrc: '/images/photo-1.jpg', imageAlt: 'Fishing boats moored under an orange sky' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A gallery is a list, so it is marked up as one. A screen reader announces
  "list, 6 items" before the first tile - the fact a user needs in order to
  decide whether to walk it at all. A stack of divs announces nothing.

  alt and figcaption are NOT the same string. The caption is the visible title;
  the alt describes what the photo actually shows, for someone who cannot see
  it. Writing the title into both makes the caption redundant noise and leaves
  the image undescribed.
-->
<ul class="photo-grid">
  <li>
    <figure class="photo-grid__figure">
      <img class="photo-grid__image" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" width="800" height="600" loading="lazy" />
      <figcaption class="photo-grid__caption">Harbour at dawn</figcaption>
    </figure>
  </li>
  <li>
    <figure class="photo-grid__figure">
      <img class="photo-grid__image" src="/images/photo-2.jpg" alt="A footpath switching back through pine forest" width="800" height="600" loading="lazy" />
      <figcaption class="photo-grid__caption">Ridge trail</figcaption>
    </figure>
  </li>
  <li>
    <figure class="photo-grid__figure">
      <img class="photo-grid__image" src="/images/photo-3.jpg" alt="Concrete stairwell seen from directly below" width="800" height="600" loading="lazy" />
      <figcaption class="photo-grid__caption">Stairwell study</figcaption>
    </figure>
  </li>
  <li>
    <figure class="photo-grid__figure">
      <img class="photo-grid__image" src="/images/photo-4.jpg" alt="Long exposure of traffic crossing a bridge at night" width="800" height="600" loading="lazy" />
      <figcaption class="photo-grid__caption">Night crossing</figcaption>
    </figure>
  </li>
  <li>
    <figure class="photo-grid__figure">
      <img class="photo-grid__image" src="/images/photo-5.jpg" alt="Salt flats meeting a pale horizon" width="800" height="600" loading="lazy" />
      <figcaption class="photo-grid__caption">Salt flats</figcaption>
    </figure>
  </li>
  <li>
    <figure class="photo-grid__figure">
      <img class="photo-grid__image" src="/images/photo-6.jpg" alt="Market awnings in bright primary colours" width="800" height="600" loading="lazy" />
      <figcaption class="photo-grid__caption">Market row</figcaption>
    </figure>
  </li>
</ul>`,
      css: `.photo-grid {
  display: grid;
  /*
   * auto-fill + minmax rather than a column count: the number of columns is
   * "however many fit", so the gallery is responsive with no breakpoints to
   * maintain - and it reflows to its CONTAINER, not the viewport, which is
   * what you want the moment it lands in a sidebar.
   */
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.photo-grid__figure {
  /* <figure> ships with a default margin; the grid gap owns spacing here. */
  margin: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}

.photo-grid__image {
  display: block;
  width: 100%;
  /*
   * A fixed ratio is what keeps the rows aligned whatever the source
   * dimensions are, and object-fit crops rather than distorts. The width and
   * height attributes on the tag are still worth setting: they reserve the box
   * before the file arrives and stop the page shifting under the reader.
   */
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.photo-grid__caption {
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #374151;
}

/*
 * The photo paints itself and needs nothing. The tile surface and its caption
 * are the parts that sit on the page background, so those are the only two
 * things re-tuned for dark surfaces.
 */
@media (prefers-color-scheme: dark) {
  .photo-grid__figure {
    border-color: #1f2937;
    background-color: #111827;
  }

  .photo-grid__caption {
    color: #d1d5db;
  }
}`,
      tailwind: `<ul class="grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
  <li>
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Harbour at dawn</figcaption>
    </figure>
  </li>
  <li>
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-2.jpg" alt="A footpath switching back through pine forest" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Ridge trail</figcaption>
    </figure>
  </li>
  <li>
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-3.jpg" alt="Concrete stairwell seen from directly below" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Stairwell study</figcaption>
    </figure>
  </li>
  <li>
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-4.jpg" alt="Long exposure of traffic crossing a bridge at night" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Night crossing</figcaption>
    </figure>
  </li>
  <li>
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-5.jpg" alt="Salt flats meeting a pale horizon" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Salt flats</figcaption>
    </figure>
  </li>
  <li>
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-6.jpg" alt="Market awnings in bright primary colours" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Market row</figcaption>
    </figure>
  </li>
</ul>`,
      react: `export function GalleryGrid({ items, className = '' }) {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <li key={item.id}>
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <img
              className="block aspect-[4/3] w-full object-cover"
              src={item.imageSrc}
              alt={item.imageAlt}
              loading="lazy"
            />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
      nextjs: `import type { GalleryPhoto } from './types';

interface GalleryGridProps {
  items: GalleryPhoto[];
  className?: string;
}

// No 'use client' - a static grid holds no state, so it renders on the server
// and ships no JavaScript at all.
export function GalleryGrid({ items, className = '' }: GalleryGridProps) {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <li key={item.id}>
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            {/* next/image fits here: add fill + a sizes matching the columns. */}
            <img
              className="block aspect-[4/3] w-full object-cover"
              src={item.imageSrc}
              alt={item.imageAlt}
              width={800}
              height={600}
              loading="lazy"
            />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface GalleryPhoto {
  id: string;
  /** The visible caption. */
  title: string;
  imageSrc: string;
  /** What the photo shows - never a copy of \`title\`. */
  imageAlt: string;
}

export interface GalleryGridProps {
  items: GalleryPhoto[];
  className?: string;
}

export function GalleryGrid({ items, className = '' }: GalleryGridProps): JSX.Element {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item: GalleryPhoto) => (
        <li key={item.id}>
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <img
              className="block aspect-[4/3] w-full object-cover"
              src={item.imageSrc}
              alt={item.imageAlt}
              width={800}
              height={600}
              loading="lazy"
            />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-masonry',
    category: 'galleries',
    tags: ['gallery', 'masonry', 'columns', 'images', 'layout'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-02',
    updatedAt: '2026-06-28',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1730, copies: 442, downloads: 118 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'GalleryPhoto[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'harbour', title: 'Harbour at dawn', imageSrc: '/images/photo-1.jpg', imageAlt: 'Fishing boats moored under an orange sky' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Masonry with CSS columns and no JavaScript - but read the trade-off before
  you reach for it.

  Columns flow top-to-bottom, THEN across: items 1-2 fill the first column,
  3-4 the second. So the DOM order (which is the screen-reader and tab order)
  runs down each column, while a sighted eye scans across rows. For a photo
  wall where order carries no meaning that is free; for anything ranked -
  search results, a feed - it is wrong, and an even grid is the honest answer.
-->
<ul class="masonry">
  <li class="masonry__item">
    <figure class="masonry__figure">
      <img class="masonry__image" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" width="800" height="600" loading="lazy" />
      <figcaption class="masonry__caption">Harbour at dawn</figcaption>
    </figure>
  </li>
  <li class="masonry__item">
    <figure class="masonry__figure">
      <img class="masonry__image" src="/images/photo-2.jpg" alt="A footpath switching back through pine forest" width="800" height="1100" loading="lazy" />
      <figcaption class="masonry__caption">Ridge trail</figcaption>
    </figure>
  </li>
  <li class="masonry__item">
    <figure class="masonry__figure">
      <img class="masonry__image" src="/images/photo-3.jpg" alt="Concrete stairwell seen from directly below" width="800" height="800" loading="lazy" />
      <figcaption class="masonry__caption">Stairwell study</figcaption>
    </figure>
  </li>
  <li class="masonry__item">
    <figure class="masonry__figure">
      <img class="masonry__image" src="/images/photo-4.jpg" alt="Long exposure of traffic crossing a bridge at night" width="800" height="500" loading="lazy" />
      <figcaption class="masonry__caption">Night crossing</figcaption>
    </figure>
  </li>
  <li class="masonry__item">
    <figure class="masonry__figure">
      <img class="masonry__image" src="/images/photo-5.jpg" alt="Salt flats meeting a pale horizon" width="800" height="1000" loading="lazy" />
      <figcaption class="masonry__caption">Salt flats</figcaption>
    </figure>
  </li>
  <li class="masonry__item">
    <figure class="masonry__figure">
      <img class="masonry__image" src="/images/photo-6.jpg" alt="Market awnings in bright primary colours" width="800" height="700" loading="lazy" />
      <figcaption class="masonry__caption">Market row</figcaption>
    </figure>
  </li>
</ul>`,
      css: `.masonry {
  /*
   * The whole layout, in two declarations. column-width rather than
   * column-count so the track count falls out of the available width - same
   * container-driven behaviour as the grid gallery, no breakpoints.
   */
  column-width: 11rem;
  column-gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.masonry__item {
  /*
   * Without break-inside a tile is free to split across the column boundary -
   * half a photo at the bottom of one column and half at the top of the next.
   * This single line is what makes columns usable for media at all.
   */
  break-inside: avoid;
  /* Column gap handles the horizontal rhythm; this handles the vertical. */
  margin-bottom: 0.75rem;
}

.masonry__figure {
  margin: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}

.masonry__image {
  display: block;
  width: 100%;
  /*
   * No aspect-ratio and no object-fit - the varying intrinsic heights ARE the
   * effect. Constrain them and you have rebuilt the even grid.
   */
  height: auto;
}

.masonry__caption {
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #374151;
}

/*
 * As with the grid: the photos carry their own contrast, so only the tile
 * surface and the caption text need a dark treatment.
 */
@media (prefers-color-scheme: dark) {
  .masonry__figure {
    border-color: #1f2937;
    background-color: #111827;
  }

  .masonry__caption {
    color: #d1d5db;
  }
}`,
      tailwind: `<!--
  columns-2 sm:columns-3 lg:columns-4 is the whole layout. break-inside-avoid
  on the item is not optional: without it a tile splits across the column
  boundary.
-->
<ul class="w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4">
  <li class="mb-3 break-inside-avoid">
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block h-auto w-full" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" width="800" height="600" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Harbour at dawn</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block h-auto w-full" src="/images/photo-2.jpg" alt="A footpath switching back through pine forest" width="800" height="1100" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Ridge trail</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block h-auto w-full" src="/images/photo-3.jpg" alt="Concrete stairwell seen from directly below" width="800" height="800" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Stairwell study</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block h-auto w-full" src="/images/photo-4.jpg" alt="Long exposure of traffic crossing a bridge at night" width="800" height="500" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Night crossing</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block h-auto w-full" src="/images/photo-5.jpg" alt="Salt flats meeting a pale horizon" width="800" height="1000" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Salt flats</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <img class="block h-auto w-full" src="/images/photo-6.jpg" alt="Market awnings in bright primary colours" width="800" height="700" loading="lazy" />
      <figcaption class="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Market row</figcaption>
    </figure>
  </li>
</ul>`,
      react: `export function GalleryMasonry({ items, className = '' }) {
  return (
    <ul className={\`w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4 \${className}\`}>
      {items.map((item) => (
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <img className="block h-auto w-full" src={item.imageSrc} alt={item.imageAlt} loading="lazy" />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
      nextjs: `import type { GalleryPhoto } from './types';

interface GalleryMasonryProps {
  items: GalleryPhoto[];
  className?: string;
}

// Stateless - no 'use client'. The layout is pure CSS, so this is a Server
// Component that ships zero JavaScript. That is the argument for a columns
// masonry over a JS one: the JS libraries measure and absolutely position, so
// they cannot render on the server and they reflow on every resize.
export function GalleryMasonry({ items, className = '' }: GalleryMasonryProps) {
  return (
    <ul className={\`w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4 \${className}\`}>
      {items.map((item) => (
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <img
              className="block h-auto w-full"
              src={item.imageSrc}
              alt={item.imageAlt}
              width={item.width}
              height={item.height}
              loading="lazy"
            />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  /**
   * Intrinsic dimensions. Worth carrying for a masonry specifically: the
   * columns cannot be balanced until every tile's height is known, so without
   * them the layout visibly reshuffles as the files arrive.
   */
  width?: number;
  height?: number;
}

export interface GalleryMasonryProps {
  items: GalleryPhoto[];
  className?: string;
}

export function GalleryMasonry({ items, className = '' }: GalleryMasonryProps): JSX.Element {
  return (
    <ul className={\`w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4 \${className}\`}>
      {items.map((item: GalleryPhoto) => (
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <img
              className="block h-auto w-full"
              src={item.imageSrc}
              alt={item.imageAlt}
              width={item.width}
              height={item.height}
              loading="lazy"
            />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-lightbox',
    category: 'galleries',
    tags: ['gallery', 'lightbox', 'dialog', 'modal', 'focus-trap'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2380, copies: 611, downloads: 174 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'items',
        type: 'GalleryPhoto[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'harbour', title: 'Harbour at dawn', imageSrc: '/images/photo-1.jpg', imageAlt: 'Fishing boats moored under an orange sky' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A lightbox is a modal dialog that happens to contain a photo, and it owes the
  user everything a dialog owes: role="dialog" + aria-modal, a focus trap,
  Escape to close, and focus returned to the thumbnail that opened it.

  Skip the last one and a keyboard user is dumped back on <body> - they close
  the fourth photo and find themselves at the top of the page. It is the single
  most-skipped line in every lightbox on the web.
-->
<div class="lightbox" data-lightbox>
  <ul class="lightbox__grid">
    <li>
      <button class="lightbox__thumb" type="button" aria-haspopup="dialog" data-index="0" data-full="/images/photo-1.jpg" data-alt="Fishing boats moored under an orange sky" data-title="Harbour at dawn">
        <img src="/images/thumb-1.jpg" alt="" />
        <span class="lightbox__sr">Open Harbour at dawn</span>
      </button>
    </li>
    <li>
      <button class="lightbox__thumb" type="button" aria-haspopup="dialog" data-index="1" data-full="/images/photo-2.jpg" data-alt="A footpath switching back through pine forest" data-title="Ridge trail">
        <img src="/images/thumb-2.jpg" alt="" />
        <span class="lightbox__sr">Open Ridge trail</span>
      </button>
    </li>
    <li>
      <button class="lightbox__thumb" type="button" aria-haspopup="dialog" data-index="2" data-full="/images/photo-3.jpg" data-alt="Concrete stairwell seen from directly below" data-title="Stairwell study">
        <img src="/images/thumb-3.jpg" alt="" />
        <span class="lightbox__sr">Open Stairwell study</span>
      </button>
    </li>
    <li>
      <button class="lightbox__thumb" type="button" aria-haspopup="dialog" data-index="3" data-full="/images/photo-4.jpg" data-alt="Long exposure of traffic crossing a bridge at night" data-title="Night crossing">
        <img src="/images/thumb-4.jpg" alt="" />
        <span class="lightbox__sr">Open Night crossing</span>
      </button>
    </li>
  </ul>

  <div class="lightbox__overlay" data-lightbox-overlay hidden>
    <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-caption" data-lightbox-dialog>
      <img class="lightbox__image" src="" alt="" data-lightbox-image />
      <p class="lightbox__caption" id="lightbox-caption" data-lightbox-caption></p>
      <div class="lightbox__actions">
        <button class="lightbox__action" type="button" data-lightbox-prev>Previous</button>
        <span class="lightbox__counter" data-lightbox-counter aria-hidden="true"></span>
        <button class="lightbox__action" type="button" data-lightbox-next>Next</button>
        <button class="lightbox__action lightbox__action--close" type="button" data-lightbox-close>Close</button>
      </div>
    </div>
  </div>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-lightbox]').forEach(function (root) {
      var overlay = root.querySelector('[data-lightbox-overlay]');
      var dialog = root.querySelector('[data-lightbox-dialog]');
      var image = root.querySelector('[data-lightbox-image]');
      var caption = root.querySelector('[data-lightbox-caption]');
      var counter = root.querySelector('[data-lightbox-counter]');
      var closeButton = root.querySelector('[data-lightbox-close]');
      var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-index]'));
      var opener = null;
      var index = 0;

      function show(next) {
        index = (next + thumbs.length) % thumbs.length;
        var thumb = thumbs[index];
        image.src = thumb.dataset.full;
        image.alt = thumb.dataset.alt;
        caption.textContent = thumb.dataset.title;
        counter.textContent = index + 1 + ' / ' + thumbs.length;
      }

      function open(thumb) {
        // Remember WHICH thumb opened us; close() has to hand focus back to it.
        opener = thumb;
        overlay.hidden = false;
        show(Number(thumb.dataset.index));
        closeButton.focus();
      }

      function close() {
        overlay.hidden = true;
        if (opener) opener.focus();
        opener = null;
      }

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          open(thumb);
        });
      });

      closeButton.addEventListener('click', close);
      root.querySelector('[data-lightbox-prev]').addEventListener('click', function () {
        show(index - 1);
      });
      root.querySelector('[data-lightbox-next]').addEventListener('click', function () {
        show(index + 1);
      });

      // Backdrop click closes, but only when the backdrop itself is the target
      // - without that check a click on the photo bubbles up and closes too.
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) close();
      });

      document.addEventListener('keydown', function (event) {
        if (overlay.hidden) return;

        if (event.key === 'Escape') {
          close();
          return;
        }
        if (event.key !== 'Tab') return;

        // The trap. aria-modal hides the page behind from a screen reader, but
        // it does nothing to the tab order - without this, Tab walks straight
        // out of the dialog and into a page the user cannot see.
        var focusable = dialog.querySelectorAll('button');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    });
  })();
</script>`,
      css: `.lightbox__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lightbox__thumb {
  display: block;
  overflow: hidden;
  width: 100%;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  cursor: pointer;
}

.lightbox__thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.lightbox__thumb:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The button's accessible name, available to a screen reader and to nobody
 * else. clip-path over display:none because a hidden element is removed from
 * the accessibility tree entirely - which would leave the button nameless,
 * exactly the bug this span exists to prevent.
 */
.lightbox__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.lightbox__overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: rgba(3, 7, 18, 0.85);
}

/*
 * display:flex above beats the [hidden] attribute's UA display:none, so the
 * overlay would stay on screen while claiming to be hidden. This line is what
 * makes the hidden attribute the single source of truth for open state.
 */
.lightbox__overlay[hidden] {
  display: none;
}

.lightbox__dialog {
  width: 100%;
  max-width: 36rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
}

.lightbox__image {
  display: block;
  width: 100%;
  max-height: 60vh;
  border-radius: 0.5rem;
  object-fit: contain;
  background-color: #f3f4f6;
}

.lightbox__caption {
  margin: 0.625rem 0 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.lightbox__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.625rem;
}

.lightbox__action {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
}

.lightbox__action:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.lightbox__action:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.lightbox__action--close {
  margin-left: auto;
}

.lightbox__counter {
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: #6b7280;
}

/*
 * The backdrop is already near-black in both themes - it is the dialog CARD
 * that is a light surface floating on it, so the card, its caption and its
 * buttons are what invert. The counter is lifted to #9ca3af because #6b7280
 * on #111827 falls under 4.5:1.
 */
@media (prefers-color-scheme: dark) {
  .lightbox__thumb {
    border-color: #1f2937;
    background-color: #111827;
  }

  .lightbox__thumb:focus-visible,
  .lightbox__action:focus-visible {
    outline-color: #60a5fa;
  }

  .lightbox__dialog {
    background-color: #111827;
  }

  .lightbox__image {
    background-color: #1f2937;
  }

  .lightbox__caption {
    color: #f9fafb;
  }

  .lightbox__action {
    border-color: #374151;
    color: #d1d5db;
  }

  .lightbox__action:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .lightbox__counter {
    color: #9ca3af;
  }
}`,
      tailwind: `<!-- Same script as the HTML tab; only the classes change. -->
<div class="w-full" data-lightbox>
  <ul class="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
    <li>
      <button
        class="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-haspopup="dialog" data-index="0" data-full="/images/photo-1.jpg" data-alt="Fishing boats moored under an orange sky" data-title="Harbour at dawn"
      >
        <img class="block aspect-square w-full object-cover" src="/images/thumb-1.jpg" alt="" />
        <span class="sr-only">Open Harbour at dawn</span>
      </button>
    </li>
    <li>
      <button
        class="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-haspopup="dialog" data-index="1" data-full="/images/photo-2.jpg" data-alt="A footpath switching back through pine forest" data-title="Ridge trail"
      >
        <img class="block aspect-square w-full object-cover" src="/images/thumb-2.jpg" alt="" />
        <span class="sr-only">Open Ridge trail</span>
      </button>
    </li>
    <li>
      <button
        class="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-haspopup="dialog" data-index="2" data-full="/images/photo-3.jpg" data-alt="Concrete stairwell seen from directly below" data-title="Stairwell study"
      >
        <img class="block aspect-square w-full object-cover" src="/images/thumb-3.jpg" alt="" />
        <span class="sr-only">Open Stairwell study</span>
      </button>
    </li>
    <li>
      <button
        class="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        type="button" aria-haspopup="dialog" data-index="3" data-full="/images/photo-4.jpg" data-alt="Long exposure of traffic crossing a bridge at night" data-title="Night crossing"
      >
        <img class="block aspect-square w-full object-cover" src="/images/thumb-4.jpg" alt="" />
        <span class="sr-only">Open Night crossing</span>
      </button>
    </li>
  </ul>

  <!-- [hidden]:hidden - the flex display would otherwise defeat the attribute. -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 p-6 [&[hidden]]:hidden"
    data-lightbox-overlay hidden
  >
    <div
      class="w-full max-w-xl rounded-xl bg-white p-3 dark:bg-gray-900"
      role="dialog" aria-modal="true" aria-labelledby="lightbox-caption" data-lightbox-dialog
    >
      <img class="block max-h-[60vh] w-full rounded-lg bg-gray-100 object-contain dark:bg-gray-800" src="" alt="" data-lightbox-image />
      <p class="mt-2.5 text-sm font-semibold text-gray-900 dark:text-gray-50" id="lightbox-caption" data-lightbox-caption></p>
      <div class="flex items-center gap-2 pt-2.5">
        <button class="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900" type="button" data-lightbox-prev>Previous</button>
        <span class="text-xs tabular-nums text-gray-500 dark:text-gray-400" data-lightbox-counter aria-hidden="true"></span>
        <button class="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900" type="button" data-lightbox-next>Next</button>
        <button class="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900" type="button" data-lightbox-close>Close</button>
      </div>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function GalleryLightbox({ items, className = '' }) {
  const [openIndex, setOpenIndex] = useState(null);
  const dialogRef = useRef(null);
  const thumbRefs = useRef([]);
  // Which thumb opened us. close() hands focus back to exactly this node.
  const openerIndex = useRef(null);

  function open(i) {
    openerIndex.current = i;
    setOpenIndex(i);
  }

  function close() {
    const back = openerIndex.current;
    setOpenIndex(null);
    openerIndex.current = null;
    if (back !== null) thumbRefs.current[back]?.focus();
  }

  function step(delta) {
    setOpenIndex((current) => (current + delta + items.length) % items.length);
  }

  useEffect(() => {
    if (openIndex === null) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    dialog.querySelector('button')?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      // aria-modal hides the page behind from a screen reader but leaves the
      // tab order alone. Without this loop, Tab walks out of the dialog.
      const nodes = dialog.querySelectorAll('button');
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <div className={\`w-full \${className}\`}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              ref={(node) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(i)}
              className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            >
              {/* alt="" - the sr-only span below is this button's name. */}
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{\`Open \${item.title}\`}</span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 p-6"
          onClick={(event) => {
            // Only the backdrop closes; a click on the photo bubbles here too.
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="w-full max-w-xl rounded-xl bg-white p-3 dark:bg-gray-900"
          >
            <img
              className="block max-h-[60vh] w-full rounded-lg bg-gray-100 object-contain dark:bg-gray-800"
              src={active.imageSrc}
              alt={active.imageAlt}
            />
            <p className="mt-2.5 text-sm font-semibold text-gray-900 dark:text-gray-50">{active.title}</p>
            <div className="flex items-center gap-2 pt-2.5">
              <button type="button" onClick={() => step(-1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Previous
              </button>
              <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400" aria-hidden="true">
                {openIndex + 1} / {items.length}
              </span>
              <button type="button" onClick={() => step(1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Next
              </button>
              <button type="button" onClick={close} className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from './types';

interface GalleryLightboxProps {
  items: GalleryPhoto[];
  className?: string;
}

export function GalleryLightbox({ items, className = '' }: GalleryLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openerIndex = useRef<number | null>(null);

  function open(i: number): void {
    openerIndex.current = i;
    setOpenIndex(i);
  }

  function close(): void {
    const back = openerIndex.current;
    setOpenIndex(null);
    openerIndex.current = null;
    // The line every lightbox forgets. Without it a keyboard user closes the
    // dialog and lands on <body> - back at the top of the page.
    if (back !== null) thumbRefs.current[back]?.focus();
  }

  function step(delta: number): void {
    setOpenIndex((current) => (current === null ? null : (current + delta + items.length) % items.length));
  }

  useEffect(() => {
    if (openIndex === null) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    dialog.querySelector('button')?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;

      const nodes = dialog.querySelectorAll<HTMLButtonElement>('button');
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <div className={\`w-full \${className}\`}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              ref={(node) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(i)}
              className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            >
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{\`Open \${item.title}\`}</span>
            </button>
          </li>
        ))}
      </ul>

      {active && openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="w-full max-w-xl rounded-xl bg-white p-3 dark:bg-gray-900"
          >
            <img
              className="block max-h-[60vh] w-full rounded-lg bg-gray-100 object-contain dark:bg-gray-800"
              src={active.imageSrc}
              alt={active.imageAlt}
            />
            <p className="mt-2.5 text-sm font-semibold text-gray-900 dark:text-gray-50">{active.title}</p>
            <div className="flex items-center gap-2 pt-2.5">
              <button type="button" onClick={() => step(-1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Previous
              </button>
              <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400" aria-hidden="true">
                {openIndex + 1} / {items.length}
              </span>
              <button type="button" onClick={() => step(1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Next
              </button>
              <button type="button" onClick={close} className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';

export interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export interface GalleryLightboxProps {
  items: GalleryPhoto[];
  className?: string;
}

export function GalleryLightbox({ items, className = '' }: GalleryLightboxProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const openerIndex = useRef<number | null>(null);

  const open = (i: number): void => {
    openerIndex.current = i;
    setOpenIndex(i);
  };

  const close = (): void => {
    const back = openerIndex.current;
    setOpenIndex(null);
    openerIndex.current = null;
    if (back !== null) thumbRefs.current[back]?.focus();
  };

  const step = (delta: number): void => {
    setOpenIndex((current: number | null) =>
      current === null ? null : (current + delta + items.length) % items.length,
    );
  };

  useEffect(() => {
    if (openIndex === null) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    dialog.querySelector('button')?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const nodes: NodeListOf<HTMLButtonElement> = dialog.querySelectorAll('button');
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  const active: GalleryPhoto | null = openIndex === null ? null : (items[openIndex] ?? null);

  return (
    <div className={\`w-full \${className}\`}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item: GalleryPhoto, i: number) => (
          <li key={item.id}>
            <button
              ref={(node: HTMLButtonElement | null) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(i)}
              className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            >
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{\`Open \${item.title}\`}</span>
            </button>
          </li>
        ))}
      </ul>

      {active !== null && openIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/85 p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="w-full max-w-xl rounded-xl bg-white p-3 dark:bg-gray-900"
          >
            <img
              className="block max-h-[60vh] w-full rounded-lg bg-gray-100 object-contain dark:bg-gray-800"
              src={active.imageSrc}
              alt={active.imageAlt}
            />
            <p className="mt-2.5 text-sm font-semibold text-gray-900 dark:text-gray-50">{active.title}</p>
            <div className="flex items-center gap-2 pt-2.5">
              <button type="button" onClick={() => step(-1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Previous
              </button>
              <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400" aria-hidden="true">
                {openIndex + 1} / {items.length}
              </span>
              <button type="button" onClick={() => step(1)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Next
              </button>
              <button type="button" onClick={close} className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },

  {
    slug: 'gallery-carousel-thumbs',
    category: 'galleries',
    tags: ['gallery', 'carousel', 'filmstrip', 'scroll-snap', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-25',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1140, copies: 268, downloads: 71 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      {
        name: 'items',
        type: 'GalleryPhoto[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'harbour', title: 'Harbour at dawn', imageSrc: '/images/photo-1.jpg', imageAlt: 'Fishing boats moored under an orange sky' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A stage plus a SCROLLING filmstrip - the shape you want once there are more
  thumbs than fit on one line, where a fixed strip would either wrap into a
  second row or shrink every thumb into uselessness.

  Two pieces earn their keep beyond the plain thumbnail carousel:
  the strip is a scroll-snap region, so the active thumb can be scrolled into
  view as the user pages through it with the arrows; and the counter states
  position in words, because "3 of 6" is information a highlighted thumb only
  conveys to someone who can see the whole strip at once.
-->
<div class="filmstrip" data-filmstrip>
  <section class="filmstrip__stage" aria-roledescription="carousel" aria-label="Photo gallery">
    <div class="filmstrip__viewport" aria-live="polite">
      <img class="filmstrip__image" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" data-filmstrip-image />
    </div>

    <div class="filmstrip__bar">
      <button class="filmstrip__nav" type="button" aria-label="Previous photo" data-filmstrip-prev>‹</button>
      <p class="filmstrip__meta">
        <span class="filmstrip__title" data-filmstrip-title>Harbour at dawn</span>
        <span class="filmstrip__counter" data-filmstrip-counter>1 of 6</span>
      </p>
      <button class="filmstrip__nav" type="button" aria-label="Next photo" data-filmstrip-next>›</button>
    </div>
  </section>

  <ul class="filmstrip__strip" data-filmstrip-strip>
    <li>
      <button class="filmstrip__thumb" type="button" aria-current="true" data-index="0" data-full="/images/photo-1.jpg" data-alt="Fishing boats moored under an orange sky" data-title="Harbour at dawn">
        <img src="/images/thumb-1.jpg" alt="" />
        <span class="filmstrip__sr">Show Harbour at dawn</span>
      </button>
    </li>
    <li>
      <button class="filmstrip__thumb" type="button" data-index="1" data-full="/images/photo-2.jpg" data-alt="A footpath switching back through pine forest" data-title="Ridge trail">
        <img src="/images/thumb-2.jpg" alt="" />
        <span class="filmstrip__sr">Show Ridge trail</span>
      </button>
    </li>
    <li>
      <button class="filmstrip__thumb" type="button" data-index="2" data-full="/images/photo-3.jpg" data-alt="Concrete stairwell seen from directly below" data-title="Stairwell study">
        <img src="/images/thumb-3.jpg" alt="" />
        <span class="filmstrip__sr">Show Stairwell study</span>
      </button>
    </li>
    <li>
      <button class="filmstrip__thumb" type="button" data-index="3" data-full="/images/photo-4.jpg" data-alt="Long exposure of traffic crossing a bridge at night" data-title="Night crossing">
        <img src="/images/thumb-4.jpg" alt="" />
        <span class="filmstrip__sr">Show Night crossing</span>
      </button>
    </li>
    <li>
      <button class="filmstrip__thumb" type="button" data-index="4" data-full="/images/photo-5.jpg" data-alt="Salt flats meeting a pale horizon" data-title="Salt flats">
        <img src="/images/thumb-5.jpg" alt="" />
        <span class="filmstrip__sr">Show Salt flats</span>
      </button>
    </li>
    <li>
      <button class="filmstrip__thumb" type="button" data-index="5" data-full="/images/photo-6.jpg" data-alt="Market awnings in bright primary colours" data-title="Market row">
        <img src="/images/thumb-6.jpg" alt="" />
        <span class="filmstrip__sr">Show Market row</span>
      </button>
    </li>
  </ul>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-filmstrip]').forEach(function (root) {
      var image = root.querySelector('[data-filmstrip-image]');
      var title = root.querySelector('[data-filmstrip-title]');
      var counter = root.querySelector('[data-filmstrip-counter]');
      var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-index]'));
      var index = 0;

      function select(next) {
        index = (next + thumbs.length) % thumbs.length;
        var thumb = thumbs[index];

        image.src = thumb.dataset.full;
        // The alt travels with the src so the live region announces WHICH
        // photo landed, not just that something changed.
        image.alt = thumb.dataset.alt;
        title.textContent = thumb.dataset.title;
        counter.textContent = index + 1 + ' of ' + thumbs.length;

        thumbs.forEach(function (other) {
          if (other === thumb) other.setAttribute('aria-current', 'true');
          else other.removeAttribute('aria-current');
        });

        // block:'nearest' matters - without it the browser is free to scroll
        // the PAGE vertically to bring the strip into view, yanking the layout
        // out from under someone who only pressed Next.
        thumb.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
      }

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          select(Number(thumb.dataset.index));
        });
      });

      root.querySelector('[data-filmstrip-prev]').addEventListener('click', function () {
        select(index - 1);
      });
      root.querySelector('[data-filmstrip-next]').addEventListener('click', function () {
        select(index + 1);
      });
    });
  })();
</script>`,
      css: `.filmstrip {
  /* The caller owns the width - the filmstrip fills whatever box it lands in. */
  width: 100%;
}

.filmstrip__viewport {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}

.filmstrip__image {
  display: block;
  width: 100%;
  height: 16rem;
  object-fit: cover;
}

/* The stage grows with the container so a full-width filmstrip is not a strip. */
@media (min-width: 640px) {
  .filmstrip__image {
    height: 20rem;
  }
}

@media (min-width: 1024px) {
  .filmstrip__image {
    height: 28rem;
  }
}

.filmstrip__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.625rem;
}

.filmstrip__meta {
  flex: 1;
  margin: 0;
  text-align: center;
}

.filmstrip__title {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.filmstrip__counter {
  display: block;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: #4b5563;
}

.filmstrip__nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* 2.25rem clears the minimum target size for a control this small. */
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
}

.filmstrip__nav:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.filmstrip__nav:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.filmstrip__strip {
  display: flex;
  gap: 0.5rem;
  /*
   * The strip scrolls rather than wraps. scroll-snap makes a dragged strip
   * settle on a thumb instead of halfway between two, and it costs one line.
   */
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin: 0;
  padding: 0.75rem 0 0;
  list-style: none;
}

.filmstrip__thumb {
  display: block;
  flex: 0 0 auto;
  overflow: hidden;
  width: 4.5rem;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  opacity: 0.65;
  cursor: pointer;
  scroll-snap-align: start;
}

.filmstrip__thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.filmstrip__thumb:hover {
  opacity: 1;
}

.filmstrip__thumb:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Selected = ring + full opacity. Two signals, never colour alone. */
.filmstrip__thumb[aria-current='true'] {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px #2563eb;
  opacity: 1;
}

.filmstrip__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .filmstrip__strip {
    scroll-behavior: auto;
  }
}

/*
 * The photos paint themselves; the chrome around them does not. Note the
 * counter is #4b5563 rather than the #6b7280 a caption would use - it sits on
 * the page background at 12px, and #6b7280 would miss 4.5:1 there.
 */
@media (prefers-color-scheme: dark) {
  .filmstrip__viewport,
  .filmstrip__thumb {
    border-color: #1f2937;
    background-color: #111827;
  }

  .filmstrip__title {
    color: #f9fafb;
  }

  .filmstrip__counter {
    color: #9ca3af;
  }

  .filmstrip__nav {
    border-color: #374151;
    color: #d1d5db;
  }

  .filmstrip__nav:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .filmstrip__nav:focus-visible,
  .filmstrip__thumb:focus-visible {
    outline-color: #60a5fa;
  }

  .filmstrip__thumb[aria-current='true'] {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px #60a5fa;
  }
}`,
      tailwind: `<!-- Same script as the HTML tab. aria-current drives the ring, so the
     selected state lives in exactly one attribute. -->
<div class="w-full" data-filmstrip>
  <section aria-roledescription="carousel" aria-label="Photo gallery">
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900" aria-live="polite">
      <img class="block h-64 w-full object-cover sm:h-80 lg:h-[28rem]" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" data-filmstrip-image />
    </div>

    <div class="flex items-center gap-2 pt-2.5">
      <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Previous photo" data-filmstrip-prev>‹</button>
      <p class="m-0 flex-1 text-center">
        <span class="block text-sm font-semibold text-gray-900 dark:text-gray-50" data-filmstrip-title>Harbour at dawn</span>
        <span class="block text-xs tabular-nums text-gray-600 dark:text-gray-400" data-filmstrip-counter>1 of 6</span>
      </p>
      <button class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-lg leading-none text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950" type="button" aria-label="Next photo" data-filmstrip-next>›</button>
    </div>
  </section>

  <ul class="flex snap-x snap-mandatory list-none gap-2 overflow-x-auto p-0 pt-3" data-filmstrip-strip>
    <li>
      <button class="block w-18 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" aria-current="true" data-index="0" data-full="/images/photo-1.jpg" data-alt="Fishing boats moored under an orange sky" data-title="Harbour at dawn">
        <img class="block aspect-square w-full object-cover" src="/images/thumb-1.jpg" alt="" />
        <span class="sr-only">Show Harbour at dawn</span>
      </button>
    </li>
    <li>
      <button class="block w-18 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" data-index="1" data-full="/images/photo-2.jpg" data-alt="A footpath switching back through pine forest" data-title="Ridge trail">
        <img class="block aspect-square w-full object-cover" src="/images/thumb-2.jpg" alt="" />
        <span class="sr-only">Show Ridge trail</span>
      </button>
    </li>
    <li>
      <button class="block w-18 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" data-index="2" data-full="/images/photo-3.jpg" data-alt="Concrete stairwell seen from directly below" data-title="Stairwell study">
        <img class="block aspect-square w-full object-cover" src="/images/thumb-3.jpg" alt="" />
        <span class="sr-only">Show Stairwell study</span>
      </button>
    </li>
    <li>
      <button class="block w-18 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" data-index="3" data-full="/images/photo-4.jpg" data-alt="Long exposure of traffic crossing a bridge at night" data-title="Night crossing">
        <img class="block aspect-square w-full object-cover" src="/images/thumb-4.jpg" alt="" />
        <span class="sr-only">Show Night crossing</span>
      </button>
    </li>
    <li>
      <button class="block w-18 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" data-index="4" data-full="/images/photo-5.jpg" data-alt="Salt flats meeting a pale horizon" data-title="Salt flats">
        <img class="block aspect-square w-full object-cover" src="/images/thumb-5.jpg" alt="" />
        <span class="sr-only">Show Salt flats</span>
      </button>
    </li>
    <li>
      <button class="block w-18 shrink-0 snap-start overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0 opacity-65 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[current=true]:border-blue-600 aria-[current=true]:opacity-100 aria-[current=true]:ring-2 aria-[current=true]:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[current=true]:border-blue-400 dark:aria-[current=true]:ring-blue-400" type="button" data-index="5" data-full="/images/photo-6.jpg" data-alt="Market awnings in bright primary colours" data-title="Market row">
        <img class="block aspect-square w-full object-cover" src="/images/thumb-6.jpg" alt="" />
        <span class="sr-only">Show Market row</span>
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useRef, useState } from 'react';

export function GalleryCarouselThumbs({ items, onSelect, className = '' }) {
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef([]);
  const active = items[index];

  function select(next) {
    const bounded = (next + items.length) % items.length;
    setIndex(bounded);
    if (onSelect) onSelect(bounded);

    // Scroll on the way in, not from an effect: this only ever runs because a
    // user pressed something, so it can never fire on mount and move the page
    // under a reader who has not touched the gallery.
    thumbRefs.current[bounded]?.scrollIntoView({
      inline: 'nearest',
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  if (!active) return null;

  return (
    <div className={\`w-full \${className}\`}>
      <section aria-roledescription="carousel" aria-label="Photo gallery">
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          {/* key forces a swap so the live region sees a new node. */}
          <img key={active.id} className="block h-64 w-full object-cover sm:h-80 lg:h-[28rem]" src={active.imageSrc} alt={active.imageAlt} />
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
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              ref={(node) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-current={i === index ? true : undefined}
              onClick={() => select(i)}
              className={\`block w-18 shrink-0 snap-start overflow-hidden rounded-lg border bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                i === index
                  ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                  : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
              }\`}
            >
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{\`Show \${item.title}\`}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      nextjs: `'use client';

import { useRef, useState } from 'react';
import type { GalleryPhoto } from './types';

interface GalleryCarouselThumbsProps {
  items: GalleryPhoto[];
  onSelect?: (index: number) => void;
  className?: string;
}

export function GalleryCarouselThumbs({ items, onSelect, className = '' }: GalleryCarouselThumbsProps) {
  const [index, setIndex] = useState(0);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = items[index];

  function select(next: number): void {
    const bounded = (next + items.length) % items.length;
    setIndex(bounded);
    onSelect?.(bounded);
    thumbRefs.current[bounded]?.scrollIntoView({
      inline: 'nearest',
      // 'nearest' vertically, or the browser may scroll the whole page to
      // bring the strip into view when the user only pressed Next.
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  if (!active) return null;

  return (
    <div className={\`w-full \${className}\`}>
      <section aria-roledescription="carousel" aria-label="Photo gallery">
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          <img key={active.id} className="block h-64 w-full object-cover sm:h-80 lg:h-[28rem]" src={active.imageSrc} alt={active.imageAlt} />
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
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              ref={(node) => {
                thumbRefs.current[i] = node;
              }}
              type="button"
              aria-current={i === index ? true : undefined}
              onClick={() => select(i)}
              className={\`block w-18 shrink-0 snap-start overflow-hidden rounded-lg border bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                i === index
                  ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                  : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
              }\`}
            >
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{\`Show \${item.title}\`}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `import { useRef, useState } from 'react';

export interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export interface GalleryCarouselThumbsProps {
  items: GalleryPhoto[];
  onSelect?: (index: number) => void;
  className?: string;
}

export function GalleryCarouselThumbs({
  items,
  onSelect,
  className = '',
}: GalleryCarouselThumbsProps): JSX.Element | null {
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
    <div className={\`w-full \${className}\`}>
      <section aria-roledescription="carousel" aria-label="Photo gallery">
        <div
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
          aria-live="polite"
        >
          <img key={active.id} className="block h-64 w-full object-cover sm:h-80 lg:h-[28rem]" src={active.imageSrc} alt={active.imageAlt} />
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
              className={\`block w-18 shrink-0 snap-start overflow-hidden rounded-lg border bg-gray-50 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
                i === index
                  ? 'border-blue-600 opacity-100 ring-2 ring-blue-600 dark:border-blue-400 dark:ring-blue-400'
                  : 'border-gray-200 opacity-65 hover:opacity-100 dark:border-gray-800'
              }\`}
            >
              <img className="block aspect-square w-full object-cover" src={item.imageSrc} alt="" />
              <span className="sr-only">{\`Show \${item.title}\`}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },

  {
    slug: 'gallery-filterable',
    category: 'galleries',
    tags: ['gallery', 'filter', 'aria-pressed', 'live-region', 'images'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-06',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 840, copies: 197, downloads: 46 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      {
        name: 'items',
        type: 'FilterablePhoto[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'harbour', title: 'Harbour at dawn', tag: 'places', imageSrc: '/images/photo-1.jpg', imageAlt: 'Fishing boats moored under an orange sky' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Two decisions carry this component.

  1. The filters are aria-pressed toggle buttons, not radios and not links.
     A radio group would claim these are mutually exclusive choices in a form;
     links would claim navigation. They are neither - they are toggles that
     re-render a list in place, and aria-pressed is the role for exactly that.

  2. The count lives in an aria-live region. Pressing a filter silently
     reflows the list: a sighted user sees it happen, a screen-reader user
     hears nothing and has no idea whether the press did anything at all. One
     polite region ("Showing 3 of 6 photos") is the entire fix.
-->
<div class="filter-gallery" data-filter-gallery>
  <div class="filter-gallery__bar" role="group" aria-label="Filter photos by tag">
    <button class="filter-gallery__filter" type="button" aria-pressed="true" data-filter="all">All</button>
    <button class="filter-gallery__filter" type="button" aria-pressed="false" data-filter="places">Places</button>
    <button class="filter-gallery__filter" type="button" aria-pressed="false" data-filter="structures">Structures</button>
    <button class="filter-gallery__filter" type="button" aria-pressed="false" data-filter="nature">Nature</button>
  </div>

  <p class="filter-gallery__count" aria-live="polite" data-filter-count>Showing 6 of 6 photos</p>

  <ul class="filter-gallery__grid" data-filter-grid>
    <li data-tag="places">
      <figure class="filter-gallery__figure">
        <img class="filter-gallery__image" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" loading="lazy" />
        <figcaption class="filter-gallery__caption">Harbour at dawn</figcaption>
      </figure>
    </li>
    <li data-tag="nature">
      <figure class="filter-gallery__figure">
        <img class="filter-gallery__image" src="/images/photo-2.jpg" alt="A footpath switching back through pine forest" loading="lazy" />
        <figcaption class="filter-gallery__caption">Ridge trail</figcaption>
      </figure>
    </li>
    <li data-tag="structures">
      <figure class="filter-gallery__figure">
        <img class="filter-gallery__image" src="/images/photo-3.jpg" alt="Concrete stairwell seen from directly below" loading="lazy" />
        <figcaption class="filter-gallery__caption">Stairwell study</figcaption>
      </figure>
    </li>
    <li data-tag="structures">
      <figure class="filter-gallery__figure">
        <img class="filter-gallery__image" src="/images/photo-4.jpg" alt="Long exposure of traffic crossing a bridge at night" loading="lazy" />
        <figcaption class="filter-gallery__caption">Night crossing</figcaption>
      </figure>
    </li>
    <li data-tag="nature">
      <figure class="filter-gallery__figure">
        <img class="filter-gallery__image" src="/images/photo-5.jpg" alt="Salt flats meeting a pale horizon" loading="lazy" />
        <figcaption class="filter-gallery__caption">Salt flats</figcaption>
      </figure>
    </li>
    <li data-tag="places">
      <figure class="filter-gallery__figure">
        <img class="filter-gallery__image" src="/images/photo-6.jpg" alt="Market awnings in bright primary colours" loading="lazy" />
        <figcaption class="filter-gallery__caption">Market row</figcaption>
      </figure>
    </li>
  </ul>
</div>

<script>
  (function () {
    document.querySelectorAll('[data-filter-gallery]').forEach(function (root) {
      var filters = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
      var tiles = Array.prototype.slice.call(root.querySelectorAll('[data-tag]'));
      var count = root.querySelector('[data-filter-count]');

      function apply(tag) {
        var shown = 0;

        tiles.forEach(function (tile) {
          var match = tag === 'all' || tile.dataset.tag === tag;
          // The hidden attribute, not a class: it takes the tile out of the
          // accessibility tree too, so a filtered-out photo is not still
          // sitting in the screen reader's list of six.
          tile.hidden = !match;
          if (match) shown += 1;
        });

        filters.forEach(function (filter) {
          filter.setAttribute('aria-pressed', String(filter.dataset.filter === tag));
        });

        count.textContent = 'Showing ' + shown + ' of ' + tiles.length + ' photos';
      }

      filters.forEach(function (filter) {
        filter.addEventListener('click', function () {
          apply(filter.dataset.filter);
        });
      });
    });
  })();
</script>`,
      css: `.filter-gallery__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-gallery__filter {
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  background-color: transparent;
  color: #374151;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
}

.filter-gallery__filter:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.filter-gallery__filter:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * Pressed state keys off aria-pressed rather than a class, so the attribute a
 * screen reader reads and the fill a sighted user sees can never disagree -
 * there is only one thing to set.
 */
.filter-gallery__filter[aria-pressed='true'] {
  border-color: #1d4ed8;
  background-color: #1d4ed8;
  color: #ffffff;
}

.filter-gallery__count {
  margin: 0.75rem 0;
  font-size: 0.8125rem;
  color: #4b5563;
}

.filter-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.filter-gallery__figure {
  margin: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
}

.filter-gallery__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.filter-gallery__caption {
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  color: #374151;
}

/*
 * The pressed pill is #1d4ed8 in both themes: white on it clears 4.5:1 either
 * way, so there is nothing to re-tune. Everything else - the rest pill, the
 * count, the tile - sits on the page background and does need re-tuning.
 */
@media (prefers-color-scheme: dark) {
  .filter-gallery__filter {
    border-color: #374151;
    color: #d1d5db;
  }

  .filter-gallery__filter:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .filter-gallery__filter:focus-visible {
    outline-color: #60a5fa;
  }

  .filter-gallery__filter[aria-pressed='true'] {
    border-color: #3b82f6;
    background-color: #3b82f6;
    color: #0b1220;
  }

  .filter-gallery__count {
    color: #9ca3af;
  }

  .filter-gallery__figure {
    border-color: #1f2937;
    background-color: #111827;
  }

  .filter-gallery__caption {
    color: #d1d5db;
  }
}`,
      tailwind: `<!-- Same script as the HTML tab. -->
<div class="w-full" data-filter-gallery>
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter photos by tag">
    <button class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[pressed=true]:border-blue-500 dark:aria-[pressed=true]:bg-blue-500 dark:aria-[pressed=true]:text-gray-950" type="button" aria-pressed="true" data-filter="all">All</button>
    <button class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[pressed=true]:border-blue-500 dark:aria-[pressed=true]:bg-blue-500 dark:aria-[pressed=true]:text-gray-950" type="button" aria-pressed="false" data-filter="places">Places</button>
    <button class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[pressed=true]:border-blue-500 dark:aria-[pressed=true]:bg-blue-500 dark:aria-[pressed=true]:text-gray-950" type="button" aria-pressed="false" data-filter="structures">Structures</button>
    <button class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-[pressed=true]:border-blue-500 dark:aria-[pressed=true]:bg-blue-500 dark:aria-[pressed=true]:text-gray-950" type="button" aria-pressed="false" data-filter="nature">Nature</button>
  </div>

  <p class="my-3 text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite" data-filter-count>Showing 6 of 6 photos</p>

  <ul class="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4" data-filter-grid>
    <li data-tag="places">
      <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-1.jpg" alt="Fishing boats moored under an orange sky" loading="lazy" />
        <figcaption class="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Harbour at dawn</figcaption>
      </figure>
    </li>
    <li data-tag="nature">
      <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-2.jpg" alt="A footpath switching back through pine forest" loading="lazy" />
        <figcaption class="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Ridge trail</figcaption>
      </figure>
    </li>
    <li data-tag="structures">
      <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-3.jpg" alt="Concrete stairwell seen from directly below" loading="lazy" />
        <figcaption class="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Stairwell study</figcaption>
      </figure>
    </li>
    <li data-tag="structures">
      <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-4.jpg" alt="Long exposure of traffic crossing a bridge at night" loading="lazy" />
        <figcaption class="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Night crossing</figcaption>
      </figure>
    </li>
    <li data-tag="nature">
      <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-5.jpg" alt="Salt flats meeting a pale horizon" loading="lazy" />
        <figcaption class="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Salt flats</figcaption>
      </figure>
    </li>
    <li data-tag="places">
      <figure class="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img class="block aspect-[4/3] w-full object-cover" src="/images/photo-6.jpg" alt="Market awnings in bright primary colours" loading="lazy" />
        <figcaption class="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Market row</figcaption>
      </figure>
    </li>
  </ul>
</div>`,
      react: `import { useMemo, useState } from 'react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'places', label: 'Places' },
  { id: 'structures', label: 'Structures' },
  { id: 'nature', label: 'Nature' },
];

export function GalleryFilterable({ items, className = '' }) {
  const [active, setActive] = useState('all');

  const shown = useMemo(
    () => (active === 'all' ? items : items.filter((item) => item.tag === active)),
    [items, active],
  );

  return (
    <div className={\`w-full \${className}\`}>
      {/* A group, not a radiogroup: these toggle a view, they do not answer a
          question, and nothing here is submitted. */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by tag">
        {FILTERS.map((filter) => (
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

      {/* Without this the list reflows in total silence for a screen reader. */}
      <p className="my-3 text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite">
        Showing {shown.length} of {items.length} photos
      </p>

      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item) => (
          <li key={item.id}>
            <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <img className="block aspect-[4/3] w-full object-cover" src={item.imageSrc} alt={item.imageAlt} loading="lazy" />
              <figcaption className="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      nextjs: `'use client';

import { useMemo, useState } from 'react';
import type { FilterablePhoto } from './types';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'places', label: 'Places' },
  { id: 'structures', label: 'Structures' },
  { id: 'nature', label: 'Nature' },
] as const;

interface GalleryFilterableProps {
  items: FilterablePhoto[];
  className?: string;
}

export function GalleryFilterable({ items, className = '' }: GalleryFilterableProps) {
  const [active, setActive] = useState<string>('all');

  const shown = useMemo(
    () => (active === 'all' ? items : items.filter((item) => item.tag === active)),
    [items, active],
  );

  return (
    <div className={\`w-full \${className}\`}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter photos by tag">
        {FILTERS.map((filter) => (
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

      <p className="my-3 text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite">
        Showing {shown.length} of {items.length} photos
      </p>

      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item) => (
          <li key={item.id}>
            <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
              <img className="block aspect-[4/3] w-full object-cover" src={item.imageSrc} alt={item.imageAlt} loading="lazy" />
              <figcaption className="px-2.5 py-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `import { useMemo, useState } from 'react';

export interface FilterablePhoto {
  id: string;
  title: string;
  /** The single tag this photo is filed under. */
  tag: string;
  imageSrc: string;
  imageAlt: string;
}

export interface GalleryFilterableProps {
  items: FilterablePhoto[];
  className?: string;
}

interface Filter {
  id: string;
  label: string;
}

const FILTERS: Filter[] = [
  { id: 'all', label: 'All' },
  { id: 'places', label: 'Places' },
  { id: 'structures', label: 'Structures' },
  { id: 'nature', label: 'Nature' },
];

export function GalleryFilterable({ items, className = '' }: GalleryFilterableProps): JSX.Element {
  const [active, setActive] = useState<string>('all');

  const shown: FilterablePhoto[] = useMemo(
    () => (active === 'all' ? items : items.filter((item: FilterablePhoto) => item.tag === active)),
    [items, active],
  );

  return (
    <div className={\`w-full \${className}\`}>
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

      <p className="my-3 text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite">
        Showing {shown.length} of {items.length} photos
      </p>

      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item: FilterablePhoto) => (
          <li key={item.id}>
            <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
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
}`,
    },
  },

  {
    slug: 'gallery-horizontal-scroll',
    category: 'galleries',
    tags: ['gallery', 'horizontal', 'scroll-snap', 'carousel', 'responsive'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'GalleryTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal to emerald gradient tile', gradient: 'from-emerald-400 to-teal-600' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A single row that scrolls sideways instead of wrapping. overflow-x-auto keeps
  the overflow INSIDE the list, so the page itself never scrolls horizontally -
  the failure a fixed-width row causes at 320px. Media are CSS gradient tiles
  (role="img" + aria-label) so the component needs no image host.
-->
<ul class="flex w-full snap-x snap-mandatory list-none gap-3 overflow-x-auto p-0 pb-2">
  <li class="w-40 shrink-0 snap-start sm:w-56">
    <figure class="m-0">
      <div class="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></div>
      <figcaption class="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Coastline</figcaption>
    </figure>
  </li>
  <li class="w-40 shrink-0 snap-start sm:w-56">
    <figure class="m-0">
      <div class="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></div>
      <figcaption class="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Canyon</figcaption>
    </figure>
  </li>
  <li class="w-40 shrink-0 snap-start sm:w-56">
    <figure class="m-0">
      <div class="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600" role="img" aria-label="Emerald to teal gradient"></div>
      <figcaption class="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Forest</figcaption>
    </figure>
  </li>
  <li class="w-40 shrink-0 snap-start sm:w-56">
    <figure class="m-0">
      <div class="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-violet-400 to-fuchsia-600" role="img" aria-label="Violet to fuchsia gradient"></div>
      <figcaption class="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">Dusk</figcaption>
    </figure>
  </li>
</ul>`,
      react: `export function GalleryHorizontalScroll({ items, className = '' }) {
  return (
    <ul className={\`flex w-full snap-x snap-mandatory list-none gap-3 overflow-x-auto p-0 pb-2 \${className}\`}>
      {items.map((item) => (
        <li key={item.id} className="w-40 shrink-0 snap-start sm:w-56">
          <figure className="m-0">
            <div
              role="img"
              aria-label={item.label}
              className={\`aspect-[4/3] w-full rounded-xl bg-gradient-to-br \${item.gradient}\`}
            />
            <figcaption className="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface GalleryTile {
  id: string;
  /** Visible caption. */
  title: string;
  /** Describes the tile for a screen reader - never a copy of \`title\`. */
  label: string;
  /** Tailwind gradient colour stops, e.g. 'from-sky-400 to-indigo-600'. */
  gradient: string;
}

export interface GalleryHorizontalScrollProps {
  items: GalleryTile[];
  className?: string;
}

export function GalleryHorizontalScroll({ items, className = '' }: GalleryHorizontalScrollProps): JSX.Element {
  return (
    <ul className={\`flex w-full snap-x snap-mandatory list-none gap-3 overflow-x-auto p-0 pb-2 \${className}\`}>
      {items.map((item: GalleryTile) => (
        <li key={item.id} className="w-40 shrink-0 snap-start sm:w-56">
          <figure className="m-0">
            <div
              role="img"
              aria-label={item.label}
              className={\`aspect-[4/3] w-full rounded-xl bg-gradient-to-br \${item.gradient}\`}
            />
            <figcaption className="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-hover-zoom',
    category: 'galleries',
    tags: ['gallery', 'hover', 'zoom', 'grid', 'focus'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'GalleryTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal to emerald gradient tile', gradient: 'from-emerald-400 to-teal-600' }]",
      },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The zoom is on the tile, the clip is on the button: group-hover AND
  group-focus-visible both drive it, so a keyboard user tabbing through gets the
  same feedback a mouse does. motion-reduce cancels the scale for anyone who
  asked the OS to still animations.
-->
<ul class="grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
  <li>
    <button type="button" class="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-sky-400 to-indigo-600 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" role="img" aria-label="Sky-blue to indigo gradient"></span>
    </button>
  </li>
  <li>
    <button type="button" class="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-rose-400 to-orange-500 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" role="img" aria-label="Rose to orange gradient"></span>
    </button>
  </li>
  <li>
    <button type="button" class="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-emerald-400 to-teal-600 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" role="img" aria-label="Emerald to teal gradient"></span>
    </button>
  </li>
  <li>
    <button type="button" class="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-violet-400 to-fuchsia-600 transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" role="img" aria-label="Violet to fuchsia gradient"></span>
    </button>
  </li>
</ul>`,
      react: `export function GalleryHoverZoom({ items, onSelect, className = '' }) {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item, i) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect && onSelect(i)}
            className="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            {/* The scale lives on the tile; the clip on the button. Hover and
                focus-visible drive it identically. */}
            <span
              role="img"
              aria-label={item.label}
              className={\`block aspect-square w-full bg-gradient-to-br \${item.gradient} transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100\`}
            />
            <span className="sr-only">{item.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

export interface GalleryHoverZoomProps {
  items: GalleryTile[];
  onSelect?: (index: number) => void;
  className?: string;
}

export function GalleryHoverZoom({ items, onSelect, className = '' }: GalleryHoverZoomProps): JSX.Element {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item: GalleryTile, i: number) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onSelect?.(i)}
            className="group block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span
              role="img"
              aria-label={item.label}
              className={\`block aspect-square w-full bg-gradient-to-br \${item.gradient} transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100\`}
            />
            <span className="sr-only">{item.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-tabs-category',
    category: 'galleries',
    tags: ['gallery', 'tabs', 'category', 'filter', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'CategorisedTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600', category: 'nature' }]",
      },
      { name: 'categories', type: '{ id: string; label: string }[]', required: true, descriptionKey: 'categories' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Category chips are single-select, but they are not a form question, so they use
  aria-pressed rather than radios. The pressed fill keys off the attribute
  itself (aria-[pressed=true]:...) so the state a screen reader reads and the
  fill a sighted user sees are one thing, not two that can drift.
  The tab switching is wired in the React/TS tabs.
-->
<div class="w-full">
  <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
    <button type="button" aria-pressed="true" class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">All</button>
    <button type="button" aria-pressed="false" class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Nature</button>
    <button type="button" aria-pressed="false" class="rounded-full border border-gray-300 px-3 py-1.5 text-[0.8125rem] font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 aria-[pressed=true]:border-blue-700 aria-[pressed=true]:bg-blue-700 aria-[pressed=true]:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Urban</button>
  </div>

  <ul class="mt-3 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
    <li>
      <figure class="m-0">
        <div class="aspect-square w-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600" role="img" aria-label="Emerald to teal gradient"></div>
        <figcaption class="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Forest</figcaption>
      </figure>
    </li>
    <li>
      <figure class="m-0">
        <div class="aspect-square w-full rounded-xl bg-gradient-to-br from-slate-400 to-slate-700" role="img" aria-label="Slate gradient"></div>
        <figcaption class="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Skyline</figcaption>
      </figure>
    </li>
  </ul>
</div>`,
      react: `import { useState } from 'react';

export function GalleryTabsCategory({ items, categories, className = '' }) {
  const [active, setActive] = useState('all');
  const shown = active === 'all' ? items : items.filter((item) => item.category === active);
  const tabs = [{ id: 'all', label: 'All' }, ...categories];

  return (
    <div className={\`w-full \${className}\`}>
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
        {shown.map((item) => (
          <li key={item.id}>
            <figure className="m-0">
              <div role="img" aria-label={item.label} className={\`aspect-square w-full rounded-xl bg-gradient-to-br \${item.gradient}\`} />
              <figcaption className="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface CategorisedTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  category: string;
}

export interface CategoryTab {
  id: string;
  label: string;
}

export interface GalleryTabsCategoryProps {
  items: CategorisedTile[];
  categories: CategoryTab[];
  className?: string;
}

export function GalleryTabsCategory({ items, categories, className = '' }: GalleryTabsCategoryProps): JSX.Element {
  const [active, setActive] = useState<string>('all');
  const shown = active === 'all' ? items : items.filter((item) => item.category === active);
  const tabs: CategoryTab[] = [{ id: 'all', label: 'All' }, ...categories];

  return (
    <div className={\`w-full \${className}\`}>
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
              <div role="img" aria-label={item.label} className={\`aspect-square w-full rounded-xl bg-gradient-to-br \${item.gradient}\`} />
              <figcaption className="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">{item.title}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },

  {
    slug: 'gallery-masonry-captions',
    category: 'galleries',
    tags: ['gallery', 'masonry', 'captions', 'columns', 'overlay'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'MasonryTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600', heightClass: 'h-48' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  CSS-columns masonry (columns-2 sm:columns-3 lg:columns-4) with the caption overlaid on a
  dark-to-transparent scrim so it reads on any tile colour. break-inside-avoid
  is not optional: without it a tile splits across the column boundary. The
  varying heightClass per tile is what makes it read as masonry, not a grid.
-->
<ul class="w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4">
  <li class="mb-3 break-inside-avoid">
    <figure class="relative m-0 overflow-hidden rounded-xl">
      <div class="h-40 w-full bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></div>
      <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">Coastline</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="relative m-0 overflow-hidden rounded-xl">
      <div class="h-56 w-full bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></div>
      <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">Canyon</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="relative m-0 overflow-hidden rounded-xl">
      <div class="h-48 w-full bg-gradient-to-br from-emerald-400 to-teal-600" role="img" aria-label="Emerald to teal gradient"></div>
      <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">Forest</figcaption>
    </figure>
  </li>
  <li class="mb-3 break-inside-avoid">
    <figure class="relative m-0 overflow-hidden rounded-xl">
      <div class="h-36 w-full bg-gradient-to-br from-violet-400 to-fuchsia-600" role="img" aria-label="Violet to fuchsia gradient"></div>
      <figcaption class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">Dusk</figcaption>
    </figure>
  </li>
</ul>`,
      react: `export function GalleryMasonryCaptions({ items, className = '' }) {
  return (
    <ul className={\`w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4 \${className}\`}>
      {items.map((item) => (
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="relative m-0 overflow-hidden rounded-xl">
            <div role="img" aria-label={item.label} className={\`w-full bg-gradient-to-br \${item.gradient} \${item.heightClass}\`} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface MasonryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  /** Tailwind height class (e.g. 'h-40') - the varied heights are the effect. */
  heightClass: string;
}

export interface GalleryMasonryCaptionsProps {
  items: MasonryTile[];
  className?: string;
}

export function GalleryMasonryCaptions({ items, className = '' }: GalleryMasonryCaptionsProps): JSX.Element {
  return (
    <ul className={\`w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4 \${className}\`}>
      {items.map((item: MasonryTile) => (
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="relative m-0 overflow-hidden rounded-xl">
            <div role="img" aria-label={item.label} className={\`w-full bg-gradient-to-br \${item.gradient} \${item.heightClass}\`} />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-sm font-medium text-white">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-justified',
    category: 'galleries',
    tags: ['gallery', 'justified', 'flexbox', 'rows', 'responsive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'JustifiedTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600', basisClass: 'basis-52' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A Flickr-style justified wall with no measuring JS: a fixed row height plus
  flex-grow on every tile stretches each row edge-to-edge, and the per-tile
  basisClass gives them different natural widths so the ragged-right seam falls
  in a different place each row. flex-wrap keeps it within the container width.
-->
<ul class="flex w-full list-none flex-wrap gap-2 p-0">
  <li class="h-28 grow basis-52 sm:h-36">
    <div class="h-full w-full rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></div>
  </li>
  <li class="h-28 grow basis-40 sm:h-36">
    <div class="h-full w-full rounded-lg bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></div>
  </li>
  <li class="h-28 grow basis-64 sm:h-36">
    <div class="h-full w-full rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600" role="img" aria-label="Emerald to teal gradient"></div>
  </li>
  <li class="h-28 grow basis-44 sm:h-36">
    <div class="h-full w-full rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-600" role="img" aria-label="Violet to fuchsia gradient"></div>
  </li>
  <li class="h-28 grow basis-56 sm:h-36">
    <div class="h-full w-full rounded-lg bg-gradient-to-br from-amber-400 to-red-500" role="img" aria-label="Amber to red gradient"></div>
  </li>
</ul>`,
      react: `export function GalleryJustified({ items, className = '' }) {
  return (
    <ul className={\`flex w-full list-none flex-wrap gap-2 p-0 \${className}\`}>
      {items.map((item) => (
        <li key={item.id} className={\`h-28 grow sm:h-36 \${item.basisClass}\`}>
          <div role="img" aria-label={item.label} className={\`h-full w-full rounded-lg bg-gradient-to-br \${item.gradient}\`} />
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface JustifiedTile {
  id: string;
  label: string;
  gradient: string;
  /** Tailwind flex-basis class (e.g. 'basis-52') - sets the tile's natural width. */
  basisClass: string;
}

export interface GalleryJustifiedProps {
  items: JustifiedTile[];
  className?: string;
}

export function GalleryJustified({ items, className = '' }: GalleryJustifiedProps): JSX.Element {
  return (
    <ul className={\`flex w-full list-none flex-wrap gap-2 p-0 \${className}\`}>
      {items.map((item: JustifiedTile) => (
        <li key={item.id} className={\`h-28 grow sm:h-36 \${item.basisClass}\`}>
          <div role="img" aria-label={item.label} className={\`h-full w-full rounded-lg bg-gradient-to-br \${item.gradient}\`} />
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-carousel-fullwidth',
    category: 'galleries',
    tags: ['gallery', 'carousel', 'fullwidth', 'slider', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'GalleryTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  One large slide at a time. The stage is a polite live region so the caption
  change is announced; the dots carry aria-current for the selected slide (ring
  + fill, never colour alone). Arrow controls are >=40px targets. Slide logic is
  in the React/TS tabs.
-->
<section class="relative w-full" aria-roledescription="carousel" aria-label="Featured photos">
  <div class="overflow-hidden rounded-2xl" aria-live="polite">
    <div class="relative aspect-video w-full bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient">
      <p class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-base font-semibold text-white">Coastline</p>
    </div>
  </div>
  <button type="button" aria-label="Previous photo" class="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">‹</button>
  <button type="button" aria-label="Next photo" class="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">›</button>
  <div class="mt-3 flex justify-center gap-2">
    <button type="button" aria-label="Go to photo 1" aria-current="true" class="h-2.5 w-2.5 rounded-full bg-gray-300 ring-blue-600 aria-[current=true]:bg-blue-600 aria-[current=true]:ring-2 aria-[current=true]:ring-offset-2 dark:bg-gray-700 dark:aria-[current=true]:bg-blue-400"></button>
    <button type="button" aria-label="Go to photo 2" class="h-2.5 w-2.5 rounded-full bg-gray-300 ring-blue-600 aria-[current=true]:bg-blue-600 aria-[current=true]:ring-2 aria-[current=true]:ring-offset-2 dark:bg-gray-700 dark:aria-[current=true]:bg-blue-400"></button>
  </div>
</section>`,
      react: `import { useState } from 'react';

export function GalleryCarouselFullwidth({ items, className = '' }) {
  const [index, setIndex] = useState(0);
  const active = items[index];
  if (!active) return null;

  const step = (delta) => setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <section
      className={\`relative w-full \${className}\`}
      aria-roledescription="carousel"
      aria-label="Featured photos"
    >
      <div className="overflow-hidden rounded-2xl" aria-live="polite">
        <div key={active.id} role="img" aria-label={active.label} className={\`relative aspect-video w-full bg-gradient-to-br \${active.gradient}\`}>
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-base font-semibold text-white">
            {active.title}
          </p>
        </div>
      </div>

      <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">‹</button>
      <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">›</button>

      <div className="mt-3 flex justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={\`Go to photo \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => setIndex(i)}
            className="h-2.5 w-2.5 rounded-full bg-gray-300 ring-blue-600 aria-[current=true]:bg-blue-600 aria-[current=true]:ring-2 aria-[current=true]:ring-offset-2 dark:bg-gray-700 dark:aria-[current=true]:bg-blue-400"
          />
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useState } from 'react';

export interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

export interface GalleryCarouselFullwidthProps {
  items: GalleryTile[];
  className?: string;
}

export function GalleryCarouselFullwidth({ items, className = '' }: GalleryCarouselFullwidthProps): JSX.Element | null {
  const [index, setIndex] = useState<number>(0);
  const active = items[index];
  if (!active) return null;

  const step = (delta: number): void => setIndex((i) => (i + delta + items.length) % items.length);

  return (
    <section
      className={\`relative w-full \${className}\`}
      aria-roledescription="carousel"
      aria-label="Featured photos"
    >
      <div className="overflow-hidden rounded-2xl" aria-live="polite">
        <div key={active.id} role="img" aria-label={active.label} className={\`relative aspect-video w-full bg-gradient-to-br \${active.gradient}\`}>
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
            aria-label={\`Go to photo \${i + 1}\`}
            aria-current={i === index ? true : undefined}
            onClick={() => setIndex(i)}
            className="h-2.5 w-2.5 rounded-full bg-gray-300 ring-blue-600 aria-[current=true]:bg-blue-600 aria-[current=true]:ring-2 aria-[current=true]:ring-offset-2 dark:bg-gray-700 dark:aria-[current=true]:bg-blue-400"
          />
        ))}
      </div>
    </section>
  );
}`,
    },
  },

  {
    slug: 'gallery-polaroid',
    category: 'galleries',
    tags: ['gallery', 'polaroid', 'rotate', 'grid', 'hover'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'GalleryTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Snapshot cards on a white print frame, tilted alternately with odd/even
  rotation. Each is a button so the straighten-on-hover also fires on
  focus-visible; motion-reduce cancels the tilt entirely. The white frame is
  intentional in both themes - a photo print is not a UI surface.
-->
<ul class="grid w-full list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4">
  <li>
    <button type="button" class="group block w-full -rotate-2 rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0">
      <span class="block aspect-square w-full bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></span>
      <span class="mt-2 block text-center text-sm font-medium text-gray-800">Coastline</span>
    </button>
  </li>
  <li>
    <button type="button" class="group block w-full rotate-2 rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0">
      <span class="block aspect-square w-full bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></span>
      <span class="mt-2 block text-center text-sm font-medium text-gray-800">Canyon</span>
    </button>
  </li>
  <li>
    <button type="button" class="group block w-full -rotate-2 rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0">
      <span class="block aspect-square w-full bg-gradient-to-br from-emerald-400 to-teal-600" role="img" aria-label="Emerald to teal gradient"></span>
      <span class="mt-2 block text-center text-sm font-medium text-gray-800">Forest</span>
    </button>
  </li>
  <li>
    <button type="button" class="group block w-full rotate-2 rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0">
      <span class="block aspect-square w-full bg-gradient-to-br from-violet-400 to-fuchsia-600" role="img" aria-label="Violet to fuchsia gradient"></span>
      <span class="mt-2 block text-center text-sm font-medium text-gray-800">Dusk</span>
    </button>
  </li>
</ul>`,
      react: `export function GalleryPolaroid({ items, className = '' }) {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item, i) => (
        <li key={item.id}>
          <button
            type="button"
            className={\`group block w-full rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0 \${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}\`}
          >
            <span role="img" aria-label={item.label} className={\`block aspect-square w-full bg-gradient-to-br \${item.gradient}\`} />
            <span className="mt-2 block text-center text-sm font-medium text-gray-800">{item.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

export interface GalleryPolaroidProps {
  items: GalleryTile[];
  className?: string;
}

export function GalleryPolaroid({ items, className = '' }: GalleryPolaroidProps): JSX.Element {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item: GalleryTile, i: number) => (
        <li key={item.id}>
          <button
            type="button"
            className={\`group block w-full rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0 \${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}\`}
          >
            <span role="img" aria-label={item.label} className={\`block aspect-square w-full bg-gradient-to-br \${item.gradient}\`} />
            <span className="mt-2 block text-center text-sm font-medium text-gray-800">{item.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-instagram-grid',
    category: 'galleries',
    tags: ['gallery', 'instagram', 'grid', 'square', 'hover'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'SocialTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600', likes: 128, comments: 12 }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The tight 3-across square grid of a social profile. The like/comment overlay
  reveals on group-hover AND group-focus-visible, so it is reachable by keyboard,
  and motion-reduce drops the fade. grid-cols-3 holds at 320px (three ~100px
  squares); no lg bump - the three-column identity is the point.
-->
<ul class="grid w-full list-none grid-cols-3 gap-1 p-0 sm:gap-2">
  <li>
    <button type="button" class="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></span>
      <span class="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" aria-hidden="true">
        <span>&#9829; 128</span><span>&#128172; 12</span>
      </span>
      <span class="sr-only">Coastline: 128 likes, 12 comments</span>
    </button>
  </li>
  <li>
    <button type="button" class="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></span>
      <span class="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" aria-hidden="true">
        <span>&#9829; 96</span><span>&#128172; 5</span>
      </span>
      <span class="sr-only">Canyon: 96 likes, 5 comments</span>
    </button>
  </li>
  <li>
    <button type="button" class="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-square w-full bg-gradient-to-br from-emerald-400 to-teal-600" role="img" aria-label="Emerald to teal gradient"></span>
      <span class="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" aria-hidden="true">
        <span>&#9829; 204</span><span>&#128172; 31</span>
      </span>
      <span class="sr-only">Forest: 204 likes, 31 comments</span>
    </button>
  </li>
</ul>`,
      react: `export function GalleryInstagramGrid({ items, className = '' }) {
  return (
    <ul className={\`grid w-full list-none grid-cols-3 gap-1 p-0 sm:gap-2 \${className}\`}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span role="img" aria-label={item.label} className={\`block aspect-square w-full bg-gradient-to-br \${item.gradient}\`} />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              <span>&#9829; {item.likes}</span>
              <span>&#128172; {item.comments}</span>
            </span>
            <span className="sr-only">{\`\${item.title}: \${item.likes} likes, \${item.comments} comments\`}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface SocialTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  likes: number;
  comments: number;
}

export interface GalleryInstagramGridProps {
  items: SocialTile[];
  className?: string;
}

export function GalleryInstagramGrid({ items, className = '' }: GalleryInstagramGridProps): JSX.Element {
  return (
    <ul className={\`grid w-full list-none grid-cols-3 gap-1 p-0 sm:gap-2 \${className}\`}>
      {items.map((item: SocialTile) => (
        <li key={item.id}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span role="img" aria-label={item.label} className={\`block aspect-square w-full bg-gradient-to-br \${item.gradient}\`} />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              <span>&#9829; {item.likes}</span>
              <span>&#128172; {item.comments}</span>
            </span>
            <span className="sr-only">{\`\${item.title}: \${item.likes} likes, \${item.comments} comments\`}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-video-thumbs',
    category: 'galleries',
    tags: ['gallery', 'video', 'thumbnails', 'play-button', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'VideoTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Reef dive', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600', duration: '4:12' }]",
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A video wall mock: the play glyph is a pure-CSS triangle (a bordered zero-size
  box), not an asset or a real <video>, and the duration is a tabular-nums
  badge. The play button scales on group-hover and group-focus-visible alike;
  motion-reduce holds it still. Each card's accessible name says "Play <title>".
-->
<ul class="grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
  <li>
    <button type="button" class="group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-video w-full bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></span>
      <span class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span class="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/40 transition-transform group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none">
          <span class="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white"></span>
        </span>
      </span>
      <span class="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white" aria-hidden="true">4:12</span>
      <span class="sr-only">Play Reef dive</span>
    </button>
  </li>
  <li>
    <button type="button" class="group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <span class="block aspect-video w-full bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></span>
      <span class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span class="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/40 transition-transform group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none">
          <span class="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white"></span>
        </span>
      </span>
      <span class="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white" aria-hidden="true">2:47</span>
      <span class="sr-only">Play Canyon flyover</span>
    </button>
  </li>
</ul>`,
      react: `export function GalleryVideoThumbs({ items, className = '' }) {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span role="img" aria-label={item.label} className={\`block aspect-video w-full bg-gradient-to-br \${item.gradient}\`} />
            {/* Play glyph: a bordered zero-size box makes the triangle - no asset. */}
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/40 transition-transform group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none">
                <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white" />
              </span>
            </span>
            <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
              {item.duration}
            </span>
            <span className="sr-only">{\`Play \${item.title}\`}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface VideoTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  /** Runtime shown in the badge, e.g. '4:12'. */
  duration: string;
}

export interface GalleryVideoThumbsProps {
  items: VideoTile[];
  className?: string;
}

export function GalleryVideoThumbs({ items, className = '' }: GalleryVideoThumbsProps): JSX.Element {
  return (
    <ul className={\`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 \${className}\`}>
      {items.map((item: VideoTile) => (
        <li key={item.id}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span role="img" aria-label={item.label} className={\`block aspect-video w-full bg-gradient-to-br \${item.gradient}\`} />
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/40 transition-transform group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none">
                <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white" />
              </span>
            </span>
            <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
              {item.duration}
            </span>
            <span className="sr-only">{\`Play \${item.title}\`}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },

  {
    slug: 'gallery-load-more',
    category: 'galleries',
    tags: ['gallery', 'load-more', 'pagination', 'grid', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [{ id: 'default', labelKey: 'default' }],
    props: [
      {
        name: 'items',
        type: 'GalleryTile[]',
        required: true,
        descriptionKey: 'items',
        example: "[{ id: 'reef', title: 'Coral reef', label: 'Teal gradient tile', gradient: 'from-emerald-400 to-teal-600' }]",
      },
      { name: 'step', type: 'number', default: '4', descriptionKey: 'step' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Reveal-in-place pagination. A polite live region states "Showing X of Y" so a
  screen-reader user learns the count grew without a page move, and the button
  disappears once everything is shown rather than sitting there dead. Reveal
  logic is in the React/TS tabs.
-->
<div class="w-full">
  <ul class="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
    <li>
      <figure class="m-0">
        <div class="aspect-square w-full rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600" role="img" aria-label="Sky-blue to indigo gradient"></div>
        <figcaption class="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Coastline</figcaption>
      </figure>
    </li>
    <li>
      <figure class="m-0">
        <div class="aspect-square w-full rounded-xl bg-gradient-to-br from-rose-400 to-orange-500" role="img" aria-label="Rose to orange gradient"></div>
        <figcaption class="pt-2 text-[0.8125rem] text-gray-700 dark:text-gray-300">Canyon</figcaption>
      </figure>
    </li>
  </ul>

  <p class="mt-3 text-center text-[0.8125rem] text-gray-600 dark:text-gray-400" aria-live="polite">Showing 4 of 8 photos</p>

  <div class="mt-2 flex justify-center">
    <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Load more</button>
  </div>
</div>`,
      react: `import { useState } from 'react';

export function GalleryLoadMore({ items, step = 4, className = '' }) {
  const [visible, setVisible] = useState(step);
  const shown = items.slice(0, visible);
  const allShown = visible >= items.length;

  return (
    <div className={\`w-full \${className}\`}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item) => (
          <li key={item.id}>
            <figure className="m-0">
              <div role="img" aria-label={item.label} className={\`aspect-square w-full rounded-xl bg-gradient-to-br \${item.gradient}\`} />
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
}`,
      typescript: `import { useState } from 'react';

export interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

export interface GalleryLoadMoreProps {
  items: GalleryTile[];
  step?: number;
  className?: string;
}

export function GalleryLoadMore({ items, step = 4, className = '' }: GalleryLoadMoreProps): JSX.Element {
  const [visible, setVisible] = useState<number>(step);
  const shown = items.slice(0, visible);
  const allShown = visible >= items.length;

  return (
    <div className={\`w-full \${className}\`}>
      <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((item: GalleryTile) => (
          <li key={item.id}>
            <figure className="m-0">
              <div role="img" aria-label={item.label} className={\`aspect-square w-full rounded-xl bg-gradient-to-br \${item.gradient}\`} />
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
}`,
    },
  },
];
