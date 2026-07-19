import type { ComponentEntry } from './types';

/**
 * Images category - the ways an interface presents photography.
 *
 * Eight distinct patterns, not eight crops of one photo: a captioned figure, an
 * even gallery grid, a CSS-columns masonry wall, an overlay caption card, a
 * fixed aspect-ratio frame, a thumbnail strip, a blur-up loader and an
 * overlapping avatar group.
 *
 * Two rules hold across all of them. First, every meaningful image carries real
 * `alt` text and a `bg-gray-*` box behind it, so a slow or failed load leaves a
 * neutral placeholder rather than a jumping layout - the box also reserves the
 * space via `aspect-*`, which is the actual fix for cumulative layout shift.
 * Second, decorative images (the ones a caption already describes) get
 * `alt=""`, because narrating them twice is noise. Placeholder art references
 * `/images/*.jpg`, never an external host.
 */
export const imagesComponents: ComponentEntry[] = [
  {
    slug: 'image-figure-caption',
    category: 'images',
    tags: ['image', 'figure', 'caption', 'photo', 'figcaption'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1210, copies: 318, downloads: 80 },
    props: [
      { name: 'src', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'caption', type: 'string', descriptionKey: 'caption' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    code: {
      tailwind: `<!-- figure + figcaption ties the caption to the image semantically. The image
     is decorative to the caption's text, but here it carries its own meaning,
     so it keeps real alt. -->
<figure class="mx-auto w-full max-w-lg">
  <div class="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
    <img src="/images/photo-1.jpg" alt="Sunrise over a mountain ridge" loading="lazy" class="h-full w-full object-cover" />
  </div>
  <figcaption class="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
    First light on the ridge, shot on a 35mm lens at f/8.
  </figcaption>
</figure>`,
      react: `export function ImageFigureCaption({ src, imageAlt = '', caption, className = '' }) {
  return (
    <figure className={['mx-auto w-full max-w-lg', className].filter(Boolean).join(' ')}>
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img src={src} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{caption}</figcaption>
      ) : null}
    </figure>
  );
}`,
    },
  },
  {
    slug: 'image-gallery-grid',
    category: 'images',
    tags: ['image', 'gallery', 'grid', 'photos', 'thumbnails'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1560, copies: 410, downloads: 120 },
    props: [
      { name: 'images', type: 'GalleryImage[]', required: true, descriptionKey: 'items' },
      { name: 'columns', type: 'number', default: '3', descriptionKey: 'columns' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    code: {
      tailwind: `<ul class="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
  <!-- Repeat per image. Each aspect-square box reserves its slot so nothing
       reflows as photos decode. -->
  <li>
    <a href="#" class="block aspect-square overflow-hidden rounded-lg bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-800 dark:focus-visible:ring-offset-gray-950">
      <img src="/images/photo-1.jpg" alt="Harbour at golden hour" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transform-none" />
    </a>
  </li>
</ul>`,
      react: `export function ImageGalleryGrid({ images = [], columns = 3, className = '' }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4' }[columns] || 'sm:grid-cols-3';
  return (
    <ul className={['grid w-full grid-cols-2 gap-2 sm:gap-3', cols, className].filter(Boolean).join(' ')}>
      {images.map((image) => (
        <li key={image.id}>
          <a href={image.href || '#'} className="block aspect-square overflow-hidden rounded-lg bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-800 dark:focus-visible:ring-offset-gray-950">
            <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transform-none" />
          </a>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'image-masonry',
    category: 'images',
    tags: ['image', 'masonry', 'columns', 'gallery', 'pinterest'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1340, copies: 356, downloads: 98 },
    props: [
      { name: 'images', type: 'MasonryImage[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'threeColumn', labelKey: 'threeColumn' },
    ],
    code: {
      tailwind: `<!-- CSS columns give a masonry wall with zero JavaScript. break-inside-avoid
     keeps a photo from splitting across a column, and the varied natural
     heights do the staggering for free. -->
<div class="columns-2 gap-3 [column-fill:_balance] sm:columns-3">
  <!-- Repeat per image. -->
  <figure class="mb-3 break-inside-avoid overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
    <img src="/images/photo-2.jpg" alt="Neon signs reflected in a rain-soaked street" loading="lazy" class="w-full object-cover" />
  </figure>
</div>`,
      react: `export function ImageMasonry({ images = [], className = '' }) {
  return (
    <div className={['columns-2 gap-3 [column-fill:_balance] sm:columns-3', className].filter(Boolean).join(' ')}>
      {images.map((image) => (
        <figure key={image.id} className="mb-3 break-inside-avoid overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <img src={image.src} alt={image.alt} loading="lazy" className="w-full object-cover" />
        </figure>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'image-card-overlay',
    category: 'images',
    tags: ['image', 'card', 'overlay', 'caption', 'gradient'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1280, copies: 340, downloads: 92 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'meta', type: 'string', descriptionKey: 'meta' },
      { name: 'src', type: 'string', descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'href', type: 'string', default: "'#'", descriptionKey: 'href' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'gradient', labelKey: 'gradient' },
      { id: 'glow', labelKey: 'glow' },
    ],
    code: {
      tailwind: `<a
  href="#"
  class="group relative flex aspect-[3/4] w-full max-w-xs items-end overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
>
  <img src="/images/photo-3.jpg" alt="Portrait of a ceramicist at their wheel" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true"></div>
  <div class="relative p-4">
    <h3 class="text-base font-semibold text-white">Hands and clay</h3>
    <p class="mt-0.5 text-xs text-gray-200">Studio series &middot; No. 04</p>
  </div>
</a>`,
      react: `export function ImageCardOverlay({
  title,
  meta,
  src = '/images/photo-3.jpg',
  imageAlt = '',
  href = '#',
  className = '',
}) {
  return (
    <a
      href={href}
      className={['group relative flex aspect-[3/4] w-full max-w-xs items-end overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950', className].filter(Boolean).join(' ')}
    >
      <img src={src} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
      <div className="relative p-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {meta ? <p className="mt-0.5 text-xs text-gray-200">{meta}</p> : null}
      </div>
    </a>
  );
}`,
    },
  },
  {
    slug: 'image-aspect-ratio',
    category: 'images',
    tags: ['image', 'aspect-ratio', 'responsive', 'frame', 'cls'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 980, copies: 250, downloads: 58 },
    props: [
      { name: 'src', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'ratio', type: "'square' | 'video' | 'portrait'", default: "'video'", descriptionKey: 'ratio' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'square', labelKey: 'square' },
      { id: 'video', labelKey: 'video' },
      { id: 'portrait', labelKey: 'portrait' },
    ],
    code: {
      tailwind: `<!-- The aspect box reserves layout height before the image decodes, so the
     page never jumps (the real cause of a bad CLS score). Swap the ratio class
     for aspect-square or aspect-[3/4] as needed. -->
<div class="w-full max-w-md">
  <div class="aspect-video overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
    <img src="/images/photo-4.jpg" alt="Studio desk with a camera and prints" loading="lazy" class="h-full w-full object-cover" />
  </div>
</div>`,
      react: `export function ImageAspectRatio({ src, imageAlt = '', ratio = 'video', className = '' }) {
  const ratioClass = { square: 'aspect-square', video: 'aspect-video', portrait: 'aspect-[3/4]' }[ratio] || 'aspect-video';
  return (
    <div className={['w-full max-w-md', className].filter(Boolean).join(' ')}>
      <div className={['overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800', ratioClass].join(' ')}>
        <img src={src} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'image-thumbnail-strip',
    category: 'images',
    tags: ['image', 'thumbnails', 'strip', 'product', 'preview'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1100, copies: 290, downloads: 76 },
    props: [
      { name: 'images', type: 'ThumbImage[]', required: true, descriptionKey: 'items' },
      { name: 'activeIndex', type: 'number', default: '0', descriptionKey: 'activeIndex' },
      { name: 'onSelect', type: '(index: number) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'vertical', labelKey: 'vertical' },
    ],
    code: {
      tailwind: `<div class="mx-auto w-full max-w-md">
  <div class="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
    <img src="/images/photo-5.jpg" alt="Leather backpack, front view" class="h-full w-full object-cover" />
  </div>
  <div class="mt-3 flex gap-2" role="tablist" aria-label="Product images">
    <!-- The selected thumb is a pressed toggle, announced via aria-selected. -->
    <button type="button" role="tab" aria-selected="true" class="aspect-square w-16 overflow-hidden rounded-lg ring-2 ring-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
      <img src="/images/thumb-1.jpg" alt="Front view" class="h-full w-full object-cover" />
    </button>
    <button type="button" role="tab" aria-selected="false" class="aspect-square w-16 overflow-hidden rounded-lg ring-1 ring-gray-200 hover:ring-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-gray-700">
      <img src="/images/thumb-2.jpg" alt="Side view" class="h-full w-full object-cover" />
    </button>
  </div>
</div>`,
      react: `export function ImageThumbnailStrip({ images = [], activeIndex = 0, onSelect, className = '' }) {
  const active = images[activeIndex] || images[0];
  return (
    <div className={['mx-auto w-full max-w-md', className].filter(Boolean).join(' ')}>
      <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {active ? <img src={active.src} alt={active.alt} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="mt-3 flex gap-2" role="tablist" aria-label="Product images">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => onSelect?.(index)}
            className={['aspect-square w-16 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600', index === activeIndex ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200 hover:ring-gray-300 dark:ring-gray-700'].join(' ')}
          >
            <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'image-blur-load',
    category: 'images',
    tags: ['image', 'blur', 'placeholder', 'loading', 'lqip'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1190, copies: 322, downloads: 84 },
    props: [
      { name: 'src', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'placeholder', type: 'string', descriptionKey: 'placeholder' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
    ],
    code: {
      tailwind: `<!-- A gradient stands in while the photo loads; onload swaps opacity so the
     real image fades in over it. A pure-CSS shimmer covers the wait. -->
<div class="relative aspect-video w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
  <img
    src="/images/photo-6.jpg"
    alt="City skyline through morning fog"
    loading="lazy"
    onload="this.style.opacity=1"
    class="h-full w-full object-cover opacity-0 transition-opacity duration-500 motion-reduce:transition-none"
  />
</div>`,
      react: `import { useState } from 'react';

export function ImageBlurLoad({ src, imageAlt = '', placeholder, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={['relative aspect-video w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700', className].filter(Boolean).join(' ')}>
      {placeholder ? (
        <img src={placeholder} alt="" aria-hidden="true" className={['absolute inset-0 h-full w-full scale-105 object-cover blur-xl transition-opacity duration-500', loaded ? 'opacity-0' : 'opacity-100'].join(' ')} />
      ) : null}
      <img
        src={src}
        alt={imageAlt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={['relative h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none', loaded ? 'opacity-100' : 'opacity-0'].join(' ')}
      />
    </div>
  );
}`,
    },
  },
  {
    slug: 'image-avatar-group',
    category: 'images',
    tags: ['image', 'avatar', 'group', 'stack', 'overlap'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1070, copies: 288, downloads: 66 },
    props: [
      { name: 'avatars', type: 'Avatar[]', required: true, descriptionKey: 'members' },
      { name: 'max', type: 'number', default: '4', descriptionKey: 'max' },
      { name: 'label', type: 'string', descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    code: {
      tailwind: `<!-- The overlap is decorative, so each ring-2 keeps the faces separable. One
     group label carries the meaning for assistive tech; individual alts stay
     empty to avoid a spoken pile of names. -->
<div class="flex items-center gap-3">
  <ul class="flex -space-x-3" aria-label="7 people are attending">
    <li><img src="/images/avatar-1.jpg" alt="" class="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-950" /></li>
    <li><img src="/images/avatar-2.jpg" alt="" class="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-950" /></li>
    <li><img src="/images/avatar-3.jpg" alt="" class="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-950" /></li>
    <li><img src="/images/avatar-4.jpg" alt="" class="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-950" /></li>
    <li>
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">+3</span>
    </li>
  </ul>
  <span class="text-sm text-gray-600 dark:text-gray-400">attending</span>
</div>`,
      react: `export function ImageAvatarGroup({ avatars = [], max = 4, label, className = '' }) {
  const shown = avatars.slice(0, max);
  const overflow = avatars.length - shown.length;
  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <ul className="flex -space-x-3" aria-label={label || avatars.length + ' people'}>
        {shown.map((avatar) => (
          <li key={avatar.id}>
            <img src={avatar.src} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-950" />
          </li>
        ))}
        {overflow > 0 ? (
          <li>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
              +{overflow}
            </span>
          </li>
        ) : null}
      </ul>
      {label ? <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span> : null}
    </div>
  );
}`,
    },
  },
];
