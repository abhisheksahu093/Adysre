import type { ComponentContentMap } from '../types';

/** English prose for the social category. Keys are component slugs. */
export const socialContent: ComponentContentMap = {
  'social-links-bar': {
    title: 'Social Links Bar',
    description: 'A wrapping row of icon-only social links, each an inline SVG with an accessible name.',
    customization:
      'Pass a `links` array of `{ platform, href }`; the brand glyph, the accessible name and the label all come from an internal map keyed by `platform`. Icon-only means the name lives on the `<a>` via `aria-label` while the SVG is `aria-hidden`, and each target is a 40px tap area.',
    seoTitle: 'Social Links Bar - Free Tailwind CSS Component',
    seoDescription:
      'A responsive row of social media icon links with inline SVG brand icons and accessible names, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['social links', 'social icons', 'social media bar', 'footer social icons'],
  },
  'social-share-buttons': {
    title: 'Social Share Buttons',
    description: 'Labelled share buttons that open real share-intent URLs in a new, isolated tab.',
    customization:
      'Give it the `url` and `title` of the page; each button builds its network share-intent URL and opens it with `rel="noopener"` so the target cannot reach back through `window.opener`. The visible "Share on X" text is the accessible name, so no `aria-label` is needed, and the row wraps before it can overflow a phone.',
    seoTitle: 'Social Share Buttons - Free Tailwind CSS Component',
    seoDescription:
      'Accessible labelled social share buttons with real share-intent links and inline SVG icons, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['share buttons', 'social share', 'share this', 'share intent buttons'],
  },
  'social-follow-card': {
    title: 'Follow Card',
    description: 'A profile card with a gradient-initials avatar and a follow button that toggles state.',
    customization:
      'The follow button carries `aria-pressed` and flips between "Follow" and "Following" from internal state, calling `onToggle` so a parent can persist it. The avatar is initials on a gradient - no `<img>` to break - and the name and handle truncate rather than wrap the card.',
    seoTitle: 'Follow Card - Free React Component',
    seoDescription:
      'A social follow card with a gradient avatar and an accessible aria-pressed follow toggle, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['follow card', 'follow button', 'profile card', 'social card'],
  },
  'social-feed-cards': {
    title: 'Feed Post Cards',
    description: 'A stack of post cards, each with an author row and icon-plus-number engagement counts.',
    customization:
      'Drive it with a `posts` array; each post renders as an `<article>` with a gradient-initials avatar chosen round-robin. Engagement is always an icon plus a formatted number (1.2K, 3.4M) with an `sr-only` label - never colour alone - so counts read correctly in greyscale and to a screen reader.',
    seoTitle: 'Social Feed Post Cards - Free Tailwind CSS Component',
    seoDescription:
      'A responsive social feed of post cards with author rows and accessible engagement counts, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['feed cards', 'social feed', 'post cards', 'timeline cards'],
  },
  'social-profile-header': {
    title: 'Profile Header',
    description: 'A profile header with a gradient cover, overlapping avatar, verified badge and stats.',
    customization:
      'The cover is a pure-CSS gradient and the avatar overlaps it with a negative margin and a ring matching the surface, so it reads as a cutout in both themes. The optional `verified` badge is an SVG with a real `aria-label`, and stats are a `<dl>` where each figure is a value plus its caption.',
    seoTitle: 'Social Profile Header - Free Tailwind CSS Component',
    seoDescription:
      'A social profile header card with a gradient cover, overlapping avatar, verified badge and stats, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['profile header', 'profile card', 'cover photo', 'social profile'],
  },
  'social-icon-grid': {
    title: 'Social Icon Grid',
    description: 'A responsive grid of labelled social tiles - two columns on phones, three from small up.',
    customization:
      'Pass a `links` array of `{ platform, href }`; each tile stacks a brand SVG over a visible label that doubles as the link name, so no `aria-label` is required. The grid goes two-up on phones and three-up from `sm`, so a six-icon set never crushes into one unreadable row.',
    seoTitle: 'Social Icon Grid - Free Tailwind CSS Component',
    seoDescription:
      'A responsive grid of labelled social media tiles with inline SVG brand icons, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['social icon grid', 'social tiles', 'social media grid', 'icon links grid'],
  },
  'social-proof-strip': {
    title: 'Social Proof Strip',
    description: 'An as-seen-on wordmark row paired with follower counts for instant social proof.',
    customization:
      'Two proofs in one strip: `logos` render as muted wordmarks so nothing ships a broken `<img>`, and `followers` render as icon-plus-count figures. Both rows wrap and centre at any width. Swap the wordmarks for inline SVG once you have brand assets.',
    seoTitle: 'Social Proof Strip - Free Tailwind CSS Component',
    seoDescription:
      'A social-proof strip pairing as-seen-on wordmarks with follower counts, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['social proof', 'as seen on', 'follower count', 'trusted by strip'],
  },
  'social-testimonial-tweet': {
    title: 'Testimonial Tweet Card',
    description: 'A tweet-style quote card built from real figure and blockquote semantics.',
    customization:
      'Marked up as `<figure>`/`<blockquote>`/`<figcaption>` so the quote is announced as a testimonial, not loose text. The corner X mark is decorative and `aria-hidden`, the optional verified badge has a real name, and the like figure is an icon plus a number with an `sr-only` label.',
    seoTitle: 'Testimonial Tweet Card - Free Tailwind CSS Component',
    seoDescription:
      'A tweet-style testimonial quote card with figure/blockquote semantics and inline SVG icons, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['tweet card', 'testimonial tweet', 'quote card', 'social testimonial'],
  },
  'social-share-floating': {
    title: 'Floating Share Rail',
    description: 'A vertical share rail that sticks beside the article as it scrolls, scoped to its row.',
    customization:
      'The rail is `position: sticky` scoped to the flex row - not `fixed` to the window - so it pins beside the article while scrolling but never floats over other sections. At 320px it sits as a compact 40px column beside the flowing `children`, which fill the remaining `min-w-0` space.',
    seoTitle: 'Floating Share Rail - Free React Component',
    seoDescription:
      'A sticky vertical social share rail scoped beside article content, with inline SVG icons, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['floating share', 'sticky share bar', 'share rail', 'article share buttons'],
  },
  'social-counters': {
    title: 'Social Counters',
    description: 'A wrapping row of metric counters, each an icon plus a number plus a label.',
    customization:
      'Feed it a `counters` array of `{ icon, value, label }`; the metric icon (followers, likes, posts, views) sits beside a bold value and caption. It is a `<dl>` so a screen reader reads "Followers, 48.2K", and every counter carries an icon and a number so meaning never rests on colour.',
    seoTitle: 'Social Counters - Free Tailwind CSS Component',
    seoDescription:
      'A responsive row of social metric counters with icons and numbers, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['social counters', 'follower count', 'stat counters', 'metric tiles'],
  },
};
