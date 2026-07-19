import type { ComponentContentMap } from '../types';

/** English prose for the Images category. Keys are component slugs. */
export const imagesContent: ComponentContentMap = {
  'image-figure-caption': {
    title: 'Captioned Figure',
    description:
      'An image and its caption tied together with figure and figcaption, in a rounded frame.',
    customization:
      '`<figure>` with `<figcaption>` links the caption to the image semantically, so assistive tech reads them as one unit. The image keeps real `alt` because it carries meaning of its own here; make the `alt` empty only when the caption fully describes it. The `aspect-[4/3]` box reserves height so the caption never jumps up as the photo decodes.',
    seoTitle: 'Captioned Image Figure - Free Tailwind Component',
    seoDescription:
      'A semantic figure and figcaption image with a rounded frame, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['image caption', 'figure figcaption', 'photo caption', 'tailwind figure'],
  },
  'image-gallery-grid': {
    title: 'Image Gallery Grid',
    description:
      'An even, responsive grid of square thumbnails that steps from two up to four across.',
    customization:
      'Every cell is an `aspect-square` box, so the grid stays perfectly even and reserves its slots before any photo decodes - the fix for layout shift. The column count is a prop mapped to a static class (Tailwind cannot see an interpolated `grid-cols-${n}`), so pass 2, 3 or 4. Each thumbnail is a focusable link with a visible ring.',
    seoTitle: 'Responsive Image Gallery Grid - Free Tailwind Component',
    seoDescription:
      'An even, responsive image gallery grid with square thumbnails, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['image gallery', 'photo grid', 'thumbnail grid', 'tailwind gallery'],
  },
  'image-masonry': {
    title: 'Masonry Image Wall',
    description:
      'A Pinterest-style masonry wall built from CSS columns, with no JavaScript for the layout.',
    customization:
      'CSS `columns-2 sm:columns-3` plus `break-inside-avoid` gives a staggered wall with zero layout script - the photos keep their natural heights and flow into the shortest column. Reading order follows the source top-to-bottom per column; if strict left-to-right order matters, a grid is the better tool. Each figure keeps a neutral background so a slow image never flashes empty.',
    seoTitle: 'CSS Masonry Image Wall - Free Tailwind Component',
    seoDescription:
      'A JavaScript-free masonry image wall using CSS columns, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['masonry gallery', 'css columns', 'pinterest layout', 'tailwind masonry'],
  },
  'image-card-overlay': {
    title: 'Image Overlay Card',
    description:
      'A tall image card with a title and meta reversed out over a gradient at the base.',
    customization:
      'The `from-black/75` gradient guarantees contrast for the white caption regardless of what the photo does at the bottom edge - it is the legibility layer, not styling. The card is a single link with a focus ring offset against the image. The glow variant adds a coloured `shadow`, and the gradient variant swaps the photo for a pure-CSS gradient when you have no art yet.',
    seoTitle: 'Image Overlay Card - Free Tailwind Component',
    seoDescription:
      'An image card with a gradient overlay caption, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['image overlay', 'overlay card', 'photo caption card', 'tailwind image card'],
  },
  'image-aspect-ratio': {
    title: 'Aspect Ratio Frame',
    description:
      'A fixed-ratio image frame - square, 16:9 or portrait - that holds its space as it loads.',
    customization:
      'The aspect box reserves the exact layout height before the image decodes, which is the real fix for a poor cumulative-layout-shift score. The ratio is a prop mapped to a static class (`aspect-square`, `aspect-video`, `aspect-[3/4]`) rather than an interpolated one, so Tailwind ships the class. `object-cover` crops to fill; switch to `object-contain` to letterbox instead.',
    seoTitle: 'Aspect Ratio Image Frame - Free Tailwind Component',
    seoDescription:
      'A fixed aspect-ratio image frame that prevents layout shift, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['aspect ratio', 'image frame', 'no layout shift', 'tailwind aspect'],
  },
  'image-thumbnail-strip': {
    title: 'Thumbnail Strip',
    description:
      'A main image above a row of thumbnails, the product-gallery pattern, with a selected state.',
    customization:
      'The thumbnails are a `role="tablist"` of `role="tab"` buttons, and the selected one is marked with `aria-selected` and a ring, so the control is a real, announced selector rather than a set of look-alike images. Wire `onSelect` to swap the main image. For the vertical variant, move the strip beside the main image with a `flex` row and `flex-col` thumbnails.',
    seoTitle: 'Image Thumbnail Strip - Free Tailwind Component',
    seoDescription:
      'A product-style image thumbnail strip with an accessible selected state, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['thumbnail strip', 'product gallery', 'image selector', 'tailwind thumbnails'],
  },
  'image-blur-load': {
    title: 'Blur-Up Image Loader',
    description:
      'A low-quality placeholder blurs in first, then the full image fades over it once loaded.',
    customization:
      'A gradient (or a tiny blurred `placeholder` image) fills the frame while the photo loads, then `onLoad` flips opacity so the real image fades in - no empty box, no jump. The `motion-reduce:transition-none` opt-out drops the fade for anyone who asked for less motion. The plain-HTML tab uses an inline `onload` opacity swap; the React tab tracks a `loaded` state instead.',
    seoTitle: 'Blur-Up Image Loader - Free Tailwind Component',
    seoDescription:
      'A blur-up image loader with a placeholder that fades to the full image, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['blur up', 'image placeholder', 'lqip', 'tailwind lazy image'],
  },
  'image-avatar-group': {
    title: 'Overlapping Avatar Group',
    description:
      'A row of overlapping circular photos with an overflow count - who is here, at a glance.',
    customization:
      'The overlap is decorative, so each avatar gets a `ring-2` in the surface colour to stay separable, and the individual `alt` values are empty - one `aria-label` on the list carries the meaning so a screen reader is not read a pile of names. The `max` prop caps the shown faces and rolls the rest into a `+N` chip. Swap `-space-x-3` for `-space-x-2` in the compact variant.',
    seoTitle: 'Overlapping Avatar Group - Free Tailwind Component',
    seoDescription:
      'An overlapping avatar group with an overflow count, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['avatar group', 'avatar stack', 'overlapping avatars', 'tailwind avatars'],
  },
};
