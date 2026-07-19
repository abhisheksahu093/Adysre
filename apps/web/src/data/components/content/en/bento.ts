import type { ComponentContentMap } from '../types';

/** English prose for the bento category. Keys are component slugs. */
export const bentoContent: ComponentContentMap = {
  'bento-features-3x2': {
    title: 'Feature Bento 3x2',
    description:
      'Asymmetric feature tiles where a hero cell spans two columns and two rows and the rest pack around it.',
    customization:
      'Feed the `features` array; each tile carries its own span classes (`sm:col-span-2 sm:row-span-2`, etc.) because the span is the layout, not decoration. Those spans are all `sm:`-prefixed, so below the breakpoint the grid is `grid-cols-1` and every tile is one full-width row - nothing can overflow a 320px phone.',
    seoTitle: 'Feature Bento Grid - Free Tailwind CSS Component',
    seoDescription:
      'A responsive bento grid of feature tiles with column and row spans, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['bento grid', 'feature bento', 'asymmetric grid', 'tailwind bento'],
  },
  'bento-product-showcase': {
    title: 'Product Showcase Bento',
    description:
      'A grid of whole-card product links with gradient art panels and one large feature tile.',
    customization:
      'Pass `products` of `{ name, tagline, href, gradient, className }`; the entire card is the link, so there is no tiny hotspot to miss, and the focus ring lives on the anchor. Gradient panels stand in for product art, so nothing loads or rots. Spans are `sm:`-prefixed and the base grid is one column.',
    seoTitle: 'Product Showcase Bento - Free Tailwind CSS Component',
    seoDescription:
      'A responsive bento grid of product cards with gradient panels, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['product bento', 'showcase grid', 'product cards', 'bento links'],
  },
  'bento-stats-mixed': {
    title: 'Mixed Stats Bento',
    description:
      'Key metrics as bento tiles - one hero number on a gradient panel, the rest bordered around it.',
    customization:
      'Drive it with `stats`; mark one `featured` to promote it to the large gradient cell. Each metric is a `<dl>` pair with the value shown first via `order-*` while the DOM keeps `dt`-then-`dd`, so a screen reader still reads label then value. The grid collapses to one column below `sm`.',
    seoTitle: 'Stats Bento Grid - Free Tailwind CSS Component',
    seoDescription:
      'A responsive bento grid of key metrics with one featured stat, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['stats bento', 'metrics grid', 'kpi bento', 'dashboard stats'],
  },
  'bento-gradient-tiles': {
    title: 'Gradient Tiles Bento',
    description:
      'Colourful gradient panels in an asymmetric bento layout, each captioned with a single word.',
    customization:
      'Pass `tiles` of `{ label, gradient, className }`. Every tile paints its own gradient and white `font-semibold` labels clear AA on each stop, so there is no dark-mode block. The spans are `sm:`-prefixed; at 320px it is a single stacked column.',
    seoTitle: 'Gradient Tiles Bento - Free Tailwind CSS Component',
    seoDescription:
      'A responsive bento grid of gradient tiles, in Tailwind, React and TypeScript. Colourful, accessible and MIT licensed.',
    keywords: ['gradient bento', 'gradient tiles', 'colorful grid', 'bento gradients'],
  },
  'bento-image-collage': {
    title: 'Image Collage Bento',
    description:
      'A photo-collage bento built from CSS gradient panels, so there is no external image to preload.',
    customization:
      'Each item is a real `<figure>` with a `<figcaption>` rather than alt text on a fake `<img>`; swap the gradient panels for `<img>` once you have assets. The hero cell spans two columns and two rows on `sm:` up and collapses to a single column on phones.',
    seoTitle: 'Image Collage Bento - Free Tailwind CSS Component',
    seoDescription:
      'A responsive photo-collage bento using CSS gradient placeholders, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['collage bento', 'photo grid', 'gallery bento', 'image collage'],
  },
  'bento-app-preview': {
    title: 'App Preview Bento',
    description:
      'A pure-CSS app mockup as the hero tile, flanked by feature cards in a bento grid.',
    customization:
      'The mockup is built entirely from CSS - window chrome, traffic-light dots and gradient content blocks - and is `aria-hidden` because it illustrates the product rather than carrying content, so nothing loads or rots. Feed the side cards through `features`; the grid is one column on phones.',
    seoTitle: 'App Preview Bento - Free Tailwind CSS Component',
    seoDescription:
      'A bento grid with a pure-CSS app mockup and feature cards, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['app bento', 'saas mockup', 'product preview', 'bento dashboard'],
  },
  'bento-testimonial-mix': {
    title: 'Testimonial Mix Bento',
    description:
      'Testimonials at mixed sizes - one hero quote on a dark tile, shorter quotes packed beside it.',
    customization:
      'Pass `testimonials` of `{ quote, name, role, gradient }` and mark one `featured`. Initials are derived from the name and shown on a gradient avatar that is `aria-hidden` since the name label already carries it. Quotes are real `<blockquote>`/`<figcaption>` pairs; the grid stacks to one column on phones.',
    seoTitle: 'Testimonial Bento Grid - Free Tailwind CSS Component',
    seoDescription:
      'A responsive bento grid of testimonials at mixed sizes, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['testimonial bento', 'quotes grid', 'social proof bento', 'reviews grid'],
  },
  'bento-icon-features': {
    title: 'Icon Features Bento',
    description:
      'Feature tiles each led by an inline-SVG icon in a rounded badge, arranged as a bento grid.',
    customization:
      'Icons are inline SVG chosen by an `icon` key (`bolt`, `shield`, `chart`) and rendered `aria-hidden` because the heading names the feature. Pass `features` with an optional span `className`; the grid is a single column below `sm`, and the wide tile only spans from `sm:` up.',
    seoTitle: 'Icon Features Bento - Free Tailwind CSS Component',
    seoDescription:
      'A responsive bento grid of icon feature tiles with inline SVG, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['icon bento', 'feature tiles', 'svg icons', 'features grid'],
  },
  'bento-dark-glass': {
    title: 'Dark Glass Bento',
    description:
      'A near-black bento with a soft radial glow and frosted glass tiles over it.',
    customization:
      'The section paints its own `bg-gray-950` surface and a blurred glow, so it looks identical on a light or dark page with no `dark:` variants. Tiles are `bg-white/5` with `backdrop-blur` and a hairline `white/10` border; the glow is `aria-hidden` and sits behind the content. The grid collapses to one column on phones.',
    seoTitle: 'Dark Glass Bento - Free Tailwind CSS Component',
    seoDescription:
      'A dark glassmorphism bento grid with a radial glow, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['dark bento', 'glass bento', 'glassmorphism grid', 'dark mode bento'],
  },
  'bento-portfolio-masonry': {
    title: 'Portfolio Masonry Bento',
    description:
      'A portfolio of whole-tile project links over gradient thumbnails with a masonry-style span layout.',
    customization:
      'Pass `projects` of `{ title, category, href, gradient, className }`; the whole tile is the link with a focus ring offset against the surface. Varying `row-span`s give the masonry feel on desktop, but every span is `sm:`-prefixed so at 320px it is one clean column and nothing clips.',
    seoTitle: 'Portfolio Masonry Bento - Free Tailwind CSS Component',
    seoDescription:
      'A responsive portfolio bento with gradient thumbnails and a masonry span layout, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['portfolio bento', 'masonry grid', 'project cards', 'work grid'],
  },
};
