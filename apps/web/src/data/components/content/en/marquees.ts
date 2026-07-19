import type { ComponentContentMap } from '../types';

/** English prose for the marquees category. Keys are component slugs. */
export const marqueesContent: ComponentContentMap = {
  'marquee-logos-strip': {
    title: 'Logos Marquee Strip',
    description: 'An endless horizontal strip of wordmarks that loops seamlessly for social proof.',
    customization:
      'Swap the text `logos` for inline SVGs and the loop is unchanged. Tune `durationSeconds` - below ~15s it reads frantic - and note each group\'s `pr-12` must always match its `gap-12` or the seam hiccups once per lap.',
    seoTitle: 'Logos Marquee Strip - Free Tailwind Component',
    seoDescription:
      'An infinite, seamless logo marquee with a reduced-motion fallback and no page overflow. Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['logo marquee', 'infinite scroll logos', 'social proof strip', 'tailwind marquee'],
  },
  'marquee-text-ticker': {
    title: 'Text Ticker Marquee',
    description: 'Bold phrases that slide past with a dot between each, like a headline ticker.',
    customization:
      'The dot is a trailing decoration on every item, so it appears at the seam too with no special-casing. Feed `items` your own phrases and raise `durationSeconds` to slow it down.',
    seoTitle: 'Text Ticker Marquee - Free Tailwind Component',
    seoDescription:
      'A looping text ticker with bullet separators, a reduced-motion wrapped-row fallback and no horizontal overflow. Tailwind, React, TypeScript. MIT licensed.',
    keywords: ['text ticker', 'news ticker', 'scrolling headline', 'marquee text'],
  },
  'marquee-testimonials-strip': {
    title: 'Testimonials Marquee',
    description: 'Fixed-width quote cards that scroll continuously, each with an avatar and role.',
    customization:
      'Cards are `w-72` so every quote takes the same width and the loop advances at a steady rhythm - variable widths make the -50% seam land mid-card. Pass your own `items` array of quote, name and role.',
    seoTitle: 'Testimonials Marquee - Free Tailwind Component',
    seoDescription:
      'A seamless scrolling testimonials strip of fixed-width quote cards with a reduced-motion fallback. Tailwind, React, TypeScript. WCAG AA, MIT licensed.',
    keywords: ['testimonials marquee', 'scrolling quotes', 'review carousel', 'social proof cards'],
  },
  'marquee-vertical-scroll': {
    title: 'Vertical Scroll Marquee',
    description: 'A fixed-height column of items that scrolls upward and loops, for activity feeds.',
    customization:
      'The transform is on Y and the viewport clips at a fixed height; each group\'s `pb-3` mirrors its `gap-3`. Reduced motion swaps the clip for a real `overflow-y-auto` scroll so every row stays reachable.',
    seoTitle: 'Vertical Scroll Marquee - Free Tailwind Component',
    seoDescription:
      'A vertical looping marquee for activity feeds, with a fixed-height clipped viewport and a scrollable reduced-motion fallback. Tailwind, React, TypeScript. MIT.',
    keywords: ['vertical marquee', 'scrolling feed', 'activity ticker', 'vertical scroll loop'],
  },
  'marquee-dual-row-opposite': {
    title: 'Dual-Row Opposite Marquee',
    description: 'Two chip rows that scroll in opposite directions using a single keyframe.',
    customization:
      'One keyframe serves both rows; the bottom track adds `[animation-direction:reverse]`, and because -50% and 0 show identical content the reverse is seamless. Give `topItems` and `bottomItems` different sets for contrast.',
    seoTitle: 'Dual-Row Opposite Marquee - Free Tailwind Component',
    seoDescription:
      'Two marquee rows scrolling in opposite directions from one keyframe, each in its own clipped viewport with a reduced-motion fallback. Tailwind, React, TypeScript.',
    keywords: ['dual row marquee', 'opposite direction scroll', 'reverse marquee', 'two row ticker'],
  },
  'marquee-pause-on-hover': {
    title: 'Pause-on-Hover Marquee',
    description: 'A looping row that pauses on hover and on keyboard focus so items stay clickable.',
    customization:
      'The pause uses both `hover:` and `focus-within:[animation-play-state:paused]` so it is reachable by keyboard; the items are links for that reason. The clone\'s links get `tabIndex -1` to avoid duplicate tab stops.',
    seoTitle: 'Pause-on-Hover Marquee - Free Tailwind Component',
    seoDescription:
      'A marquee that pauses on hover and focus so a reader can click a moving target, with a reduced-motion fallback. Tailwind, React, TypeScript. WCAG AA, MIT.',
    keywords: ['pause on hover marquee', 'hover pause scroll', 'interactive marquee', 'focus pause'],
  },
  'marquee-gradient-mask-edges': {
    title: 'Gradient Mask Marquee',
    description: 'A scrolling strip whose edges fade to transparent with a CSS mask.',
    customization:
      'The `mask-image` lives on the overflow-hidden strip, never the moving track - masking the track would fade the wrong pixels as it slides. A `-webkit-mask-image` copy covers Safari; adjust the `12%`/`88%` stops to widen or narrow the fade.',
    seoTitle: 'Gradient Mask Marquee - Free Tailwind Component',
    seoDescription:
      'An infinite marquee with mask-image gradient fades on both edges and a reduced-motion fallback. Tailwind, React, TypeScript. WCAG AA, MIT licensed.',
    keywords: ['gradient mask marquee', 'fade edges scroll', 'mask-image marquee', 'faded marquee'],
  },
  'marquee-image-tiles': {
    title: 'Image Tiles Marquee',
    description: 'A row of fixed-size gradient tiles that scrolls endlessly, ready to swap for photos.',
    customization:
      'Tiles are CSS gradients standing in for images, each `h-28 w-40` so the track width stays constant. Swap the gradient div for an `<img>` in the same box and pass your own `tiles` with label and gradient stops.',
    seoTitle: 'Image Tiles Marquee - Free Tailwind Component',
    seoDescription:
      'A scrolling image-tile marquee using CSS gradient placeholders, with fixed-size tiles and a reduced-motion fallback. Tailwind, React, TypeScript. MIT licensed.',
    keywords: ['image marquee', 'photo tiles scroll', 'gallery marquee', 'gradient tiles'],
  },
  'marquee-announcement-bar': {
    title: 'Announcement Bar Marquee',
    description: 'A slim full-width banner that loops short messages on a solid colour surface.',
    customization:
      'The bar owns a solid blue surface, so its white text clears AA on any page behind it without a scrim. Feed `messages` your own copy; a dot separator is drawn after each, including at the seam.',
    seoTitle: 'Announcement Bar Marquee - Free Tailwind Component',
    seoDescription:
      'A slim looping announcement banner with a solid surface, bullet separators and a reduced-motion fallback. Tailwind, React, TypeScript. WCAG AA, MIT licensed.',
    keywords: ['announcement bar', 'marquee banner', 'promo ticker', 'top bar marquee'],
  },
  'marquee-skills-chips': {
    title: 'Skills Chips Marquee',
    description: 'A looping row of dotted skill pills, ideal for a portfolio or about page.',
    customization:
      'Each pill carries a small accent dot; pass your own `skills` array and tune `durationSeconds`. Reduced motion collapses the loop into a static centred wrapped row and drops the clone.',
    seoTitle: 'Skills Chips Marquee - Free Tailwind Component',
    seoDescription:
      'A scrolling marquee of skill pills for portfolios, with a reduced-motion wrapped-row fallback and no page overflow. Tailwind, React, TypeScript. MIT licensed.',
    keywords: ['skills marquee', 'tech chips scroll', 'portfolio skills', 'pill marquee'],
  },
};
