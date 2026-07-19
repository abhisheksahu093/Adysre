import type { ComponentContentMap } from '../types';

/** English prose for the loaders category. Keys are component slugs. */
export const loadersContent: ComponentContentMap = {
  'skeleton-loader': {
    title: 'Skeleton Loader',
    description: 'Content-shaped placeholders that stand in while data loads.',
    customization:
      'Match each bar to the shape of the real content it replaces - a skeleton that differs from the loaded layout causes a jarring shift. Honour reduced-motion by slowing or dropping the shimmer.',
    seoTitle: 'Skeleton Loader - Free Tailwind CSS Component',
    seoDescription:
      'An accessible skeleton loading placeholder with shimmer, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['skeleton loader', 'loading placeholder', 'shimmer', 'tailwind skeleton'],
  },
  'spinner-ring': {
    title: 'Spinner Ring',
    description: 'The rotating ring, with a sentence attached for anyone who can’t see it.',
    customization:
      'The transparent quarter is what makes rotation visible - a solid ring spinning looks exactly like a solid ring at rest. Under prefers-reduced-motion the ring stops but stays: something must still mark the spot as busy, and the two-tone gap reads perfectly well standing still. Never ship it without the role="status" label; a spinning SVG has nothing an assistive technology can read.',
    seoTitle: 'Spinner Ring - Free Tailwind CSS Component',
    seoDescription:
      'An accessible ring spinner with a reduced-motion fallback, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['spinner', 'loading spinner', 'ring spinner', 'tailwind spinner'],
  },
  'loader-dots': {
    title: 'Dots Loader',
    description: 'Three dots on a stagger - the “still thinking” loader.',
    customization:
      'The stagger is the component: identical delays give you three dots pulsing in unison, which reads as one blinking blob rather than a wave. Tailwind has no animation-delay utility, so those stay inline. The reduced-motion fallback needs one more line than people expect - reset the opacity too, or the dots freeze mid-fade at 45% and read as disabled rather than busy.',
    seoTitle: 'Dots Loader - Free Tailwind CSS Component',
    seoDescription:
      'A staggered three-dot loader with a reduced-motion fallback, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['dots loader', 'typing indicator', 'bouncing dots', 'tailwind loader'],
  },
  'progress-bar': {
    title: 'Progress Bar',
    description: 'A determinate bar that knows its number and says so.',
    customization:
      'Only use this when you genuinely have the value - a hardcoded aria-valuenow="50" is a lie the screen reader repeats with total confidence, and loader-bar-indeterminate exists precisely for the other case. Write aria-valuemin and aria-valuemax even though they default to 0 and 100; the defaults are patchily implemented and the day someone switches to bytes the omission becomes a bug. Don\'t add aria-live: role="progressbar" isn\'t a live region, and making it one turns a 1→100 tick into a hundred announcements.',
    seoTitle: 'Progress Bar - Free Tailwind CSS Component',
    seoDescription:
      'An accessible determinate progress bar with correct ARIA values, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['progress bar', 'determinate progress', 'aria progressbar', 'tailwind progress'],
  },
  'loader-skeleton-card': {
    title: 'Skeleton Card',
    description: 'A media card’s placeholder - cover, title, body, byline.',
    customization:
      'Copy the proportions of the card it replaces, not a generic set of bars: a skeleton whose shape differs from the loaded layout produces a visible jolt at swap time, which is worse than showing nothing. The cover reserves an aspect ratio rather than a fixed height, so the swap stays stable at every width. One role="status" for the card and aria-hidden on every bar - a screen reader reading out nine anonymous placeholders is noise, not progress.',
    seoTitle: 'Skeleton Card - Free Tailwind CSS Component',
    seoDescription:
      'A media-card skeleton with shimmer and a reduced-motion fallback, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['skeleton card', 'card placeholder', 'loading card', 'tailwind skeleton card'],
  },
  'loader-bar-indeterminate': {
    title: 'Indeterminate Bar',
    description: 'A sweeping bar for work whose length nobody knows.',
    customization:
      'The absence of aria-valuenow is the semantic, not an oversight to tidy up later - a progressbar without a value means "in progress, amount unknown", which is the truth here. The segment sweeps clean off the right edge rather than filling, because a bar that fills implies a finish line this component can\'t promise. The reduced-motion fallback needs care: a 40% stub frozen mid-sweep reads as "40% done", so widen it to the full track instead of merely stopping the animation.',
    seoTitle: 'Indeterminate Progress Bar - Free Tailwind CSS Component',
    seoDescription:
      'An indeterminate loading bar with honest ARIA and a reduced-motion fallback, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['indeterminate progress', 'loading bar', 'unknown progress', 'tailwind loading bar'],
  },
};
