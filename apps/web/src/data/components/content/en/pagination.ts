import type { ComponentContentMap } from '../types';

/** English prose for the pagination category. Keys are component slugs. */
export const paginationContent: ComponentContentMap = {
  'pagination-numbered': {
    title: 'Numbered Pagination',
    description: 'A numbered page strip that collapses long runs to an ellipsis.',
    customization:
      'The piece worth keeping is that every page is an `<a href>`. Pagination is navigation, and an anchor is what makes page 7 bookmarkable, middle-clickable into a new tab, crawlable, and reachable with JavaScript off - a `<button>` calling `router.push` looks identical and quietly loses all four. Because the page number lives in the URL rather than in state, the Next.js tab is a Server Component and ships no JavaScript at all; swap `<a>` for `<Link>` if you want client-side transitions. `pageRange` returns a union of numbers and gap markers rather than sentinel values like `-1`, which is what stops a gap ever being rendered as a link to page NaN. Tune `siblingCount` for how many pages flank the current one; the ellipsis stays `aria-hidden` because the numbers either side of it already say pages were skipped.',
    seoTitle: 'Numbered Pagination - Free Accessible React Component',
    seoDescription:
      'An accessible numbered pagination component with ellipsis truncation, real links and aria-current. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pagination component', 'numbered pagination', 'react pagination', 'accessible pagination'],
  },

  'pagination-prev-next': {
    title: 'Previous / Next Pagination',
    description: 'Two step links either side of a live "Page 3 of 10" readout.',
    customization:
      'Prefer this over a numbered strip when the total is unknown or unstable - a cursor-paged API, a feed that grows while it is read - because a numbered strip promises a page 7 that may not exist by the time someone clicks it. The readout is the part most Previous/Next pairs are missing: without it the control answers "where can I go" but never "where am I", and it has to be a real text node rather than a `title` attribute to be that answer for everyone. It sits in a polite live region so the position is re-announced after a client-side navigation, and polite rather than assertive because the change is the user\'s own doing and should queue behind whatever they are already hearing. `rel="prev"` and `rel="next"` are not decoration; they tell crawlers and reader modes how the sequence is ordered.',
    seoTitle: 'Previous Next Pagination - Free Accessible Component',
    seoDescription:
      'A minimal previous/next pagination control with a live page readout and correctly disabled bounds. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['prev next pagination', 'simple pagination', 'react pagination', 'cursor pagination ui'],
  },

  'pagination-load-more': {
    title: 'Load More Pagination',
    description: 'An append-on-demand list that announces its new result count.',
    customization:
      'The status line is the component, not an accessory to it. Appending rows is a silent DOM mutation: a sighted user watches the list grow, a screen-reader user hears nothing and has no way to tell whether the button did anything at all - so "Showing 12 of 48 results" is the entire feedback loop for them. It is rendered unconditionally rather than only once results arrive, because a live region that mounts at the same moment its text changes is usually not announced; the browser has to have been watching it beforehand. That single detail is the most common way this pattern is got wrong. When the list is exhausted the button stays in the DOM and relabels rather than unmounting - removing the element a user just activated drops their focus to `<body>` and loses their place on the page.',
    seoTitle: 'Load More Pagination - Free Accessible Component',
    seoDescription:
      'A load-more pagination button with an aria-live result count, busy state and exhausted state. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['load more button', 'load more pagination', 'aria-live results', 'react load more'],
  },

  'pagination-infinite-sentinel': {
    title: 'Infinite Scroll Sentinel',
    description: 'An IntersectionObserver sentinel that keeps a real Load more button beside it.',
    customization:
      'Infinite scroll is notoriously inaccessible, and it is worth being precise about why: it assumes scrolling a viewport is how people move through a list. Keyboard users move by focus, screen-reader users move by virtual cursor, and neither reliably trips a sentinel - so a feed with nothing but an observer is operable by mouse wheel and nothing else. This component treats the sentinel as a shortcut over a real Load more button rather than a replacement for it: both paths call the same `loadMore`, the button is always present and focusable, and the polite live region names the count after every append so rows arriving unprompted are not silent. Keep the button. It is the accessible escape hatch and the whole reason this version is shippable. The sentinel needs a box to intersect - `h-px`, never `display: none` - and `rootMargin` sets how far ahead the next page is fetched: widen it to prefetch sooner, at the cost of loading pages nobody scrolls to. Pass `root` when the feed scrolls inside a panel rather than the page, or the sentinel is measured against the viewport and either never fires or fires immediately.',
    seoTitle: 'Infinite Scroll Sentinel - Free Accessible Component',
    seoDescription:
      'An accessible infinite scroll built on IntersectionObserver, with an aria-live count and a real Load more fallback. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['infinite scroll react', 'intersection observer pagination', 'accessible infinite scroll', 'scroll sentinel'],
  },

  'pagination-with-page-size': {
    title: 'Pagination with Page Size',
    description: 'A table footer bar: a range readout, a rows-per-page select and two step links.',
    customization:
      'Changing the page size resets to page 1, which is a decision rather than a convenience - page 5 of a 10-per-page list is nowhere in particular once the size becomes 50, and landing the user at an unrelated offset is worse than sending them to the top. `totalPages` is derived from `totalItems / pageSize` on every render rather than stored, because a cached copy is a second source of truth that drifts the moment the size changes under it. The control is a native `<select>` with a real `<label for>`: native buys the mobile wheel picker, type-ahead and the platform keyboard model for free, none of which is worth rebuilding for four options. Keep the label visible rather than `sr-only` - a bare "10" next to two arrows is a riddle for sighted users too. The select is also the only reason the Next.js tab needs `use client`; wire it to a form GET and the boundary disappears entirely.',
    seoTitle: 'Pagination with Page Size - Free Accessible Component',
    seoDescription:
      'A table pagination footer with a rows-per-page select, a live range readout and disabled bounds. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['rows per page', 'page size selector', 'table pagination', 'react pagination footer'],
  },

  'pagination-compact-dots': {
    title: 'Compact Dots Pagination',
    description: 'A dot-per-page pager where each 10px mark sits inside a 40px tap target.',
    customization:
      'Best for small, known page counts - an onboarding flow, a gallery, a card carousel - where numbers would be more than the reader needs. Each dot stays a real `<a href>` so the page remains bookmarkable, and the visible 10px mark is wrapped in a 40px-square link so the hit area clears the touch minimum the mark itself does not. The current page is both wider and filled, and carries `aria-current`, so "you are here" survives colour blindness and screen readers alike.',
    seoTitle: 'Compact Dots Pagination - Free Accessible Component',
    seoDescription:
      'A compact dot pagination control with real links, 40px tap targets and aria-current. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['dot pagination', 'compact pagination', 'react pagination dots'],
  },

  'pagination-rounded-pills': {
    title: 'Rounded Pills Pagination',
    description: 'Fully-rounded pill page links that collapse long runs to an ellipsis.',
    customization:
      'A softer take on the numbered strip: every page is a rounded pill, the current one filled solid rather than tinted so it reads in forced-colours mode too. `pageRange` returns a union of numbers and gap markers rather than sentinel values, which is what stops a gap ever rendering as a link to page NaN; tune `siblingCount` for how many pages flank the current one. The strip wraps rather than overflowing on narrow screens.',
    seoTitle: 'Rounded Pills Pagination - Free Accessible Component',
    seoDescription:
      'A rounded pill pagination component with ellipsis truncation, real links and aria-current. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['pill pagination', 'rounded pagination', 'react pagination'],
  },

  'pagination-arrows-only': {
    title: 'Arrows Only Pagination',
    description: 'First, previous, next and last icon links with a visually-hidden status.',
    customization:
      'Four icon-only controls, so each carries an `aria-label` the glyph replaces visually, and a `sr-only` live region names "Page 3 of 10" for anyone who cannot watch the arrows change. Bounds are disabled by dropping the href rather than styling alone, which is what actually makes them unfocusable and inert. Prefer this where horizontal space is scarce and the exact page number matters less than stepping through.',
    seoTitle: 'Arrows Only Pagination - Free Accessible Component',
    seoDescription:
      'An icon-only pagination control with first/prev/next/last links, aria-labels and a screen-reader status. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['icon pagination', 'arrows pagination', 'first last pagination'],
  },

  'pagination-jump-to-page': {
    title: 'Jump to Page Pagination',
    description: 'A number field that jumps straight to a typed page, with prev/next either side.',
    customization:
      'For long lists where stepping one page at a time is tedious. The field is clamped to `[1, totalPages]` on submit rather than trusting the input, because `min`/`max` on a number input is advisory and a hand-typed 999 must still be caught. It is the one interactive entry in the set - `use client` is required because the typed value lives in React state - so wire `onPageChange` to your router. The row wraps under 320px so the field never pushes the arrows off-screen.',
    seoTitle: 'Jump to Page Pagination - Free Accessible Component',
    seoDescription:
      'A jump-to-page pagination control with a clamped number input and prev/next steppers. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['jump to page', 'page input pagination', 'react pagination input'],
  },

  'pagination-range-info': {
    title: 'Range Info Pagination',
    description: 'A "Showing 11–20 of 240" readout paired with previous and next links.',
    customization:
      'The range is derived from `currentPage` and `pageSize` on every render rather than stored, so it can never drift from the page it describes. It sits in a polite live region so the count is re-announced after a client-side navigation. On a phone the readout stacks above the controls; from `sm` up they sit on one row, justified apart. `totalItems === 0` guards the first index so an empty list reads "0" rather than "1".',
    seoTitle: 'Range Info Pagination - Free Accessible Component',
    seoDescription:
      'A pagination control with a live results-range readout and disabled bounds. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['range pagination', 'showing results pagination', 'react pagination range'],
  },

  'pagination-bordered': {
    title: 'Bordered Pagination',
    description: 'A segmented group of page links joined by a shared border and hairline dividers.',
    customization:
      'One border wraps the whole group and `divide-x` draws the hairlines between cells, so the segments read as a single control rather than loose buttons; `overflow-hidden` clips the current cell fill to the rounded corners. The container scrolls (`overflow-x-auto`) instead of overflowing the viewport when the range is wide on a narrow screen. Focus rings are inset so they are not clipped by that same overflow.',
    seoTitle: 'Bordered Pagination - Free Accessible Component',
    seoDescription:
      'A segmented bordered pagination component with ellipsis truncation and inset focus rings. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['bordered pagination', 'segmented pagination', 'react pagination group'],
  },

  'pagination-simple-count': {
    title: 'Simple Count Pagination',
    description: 'Two chevron links either side of a compact "Page 3 of 12" readout.',
    customization:
      'The smallest complete pager: where can I go, and where am I, in one line. The count is a live region so it is re-announced after a client navigation, and the chevron links carry `aria-label`s because their glyphs have no text. Bounds disable by dropping the href. Reach for this in a card footer or a detail panel where a full numbered strip would be too much furniture.',
    seoTitle: 'Simple Count Pagination - Free Accessible Component',
    seoDescription:
      'A minimal pagination control with chevron links and a live page-count readout. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['simple pagination', 'page count pagination', 'minimal pagination'],
  },

  'pagination-table-footer': {
    title: 'Table Footer Pagination',
    description: 'A full-width footer bar joining a table above with a range readout and steppers.',
    customization:
      'Built to sit under a data table: `border-t` joins it to the grid, and it stacks to two rows under `sm` so the range readout never collides with the controls on a phone. Both the range and the page count derive from `currentPage`, `pageSize` and `totalItems` on each render rather than being stored. Drop it directly beneath a `<table>` or inside a card footer.',
    seoTitle: 'Table Footer Pagination - Free Accessible Component',
    seoDescription:
      'A table-footer pagination bar with a results range, page count and disabled bounds. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['table pagination footer', 'data table pagination', 'react pagination bar'],
  },

  'pagination-cursor-based': {
    title: 'Cursor Pagination',
    description: 'Two links driven by opaque next/previous cursors, hidden when an end is reached.',
    customization:
      'The right control for keyset or cursor APIs, where there are no page numbers to render - the server returns an opaque token for each direction and a null token is the only signal an end was reached. Each link is present only when its cursor exists, so the disabled state is a genuine absence of a destination rather than a styled dead link. Prefer this over numbered pages for feeds that grow while they are read, where a fixed page 7 would drift underneath the reader.',
    seoTitle: 'Cursor Pagination - Free Accessible Component',
    seoDescription:
      'A cursor-based pagination control for keyset APIs with next/previous tokens and end detection. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['cursor pagination', 'keyset pagination', 'react cursor pagination'],
  },

  'pagination-mini': {
    title: 'Mini Pagination',
    description: 'A pill-shaped inline pager with a tiny count and full-size arrow tap targets.',
    customization:
      'A dense control for a card header or toolbar. The label shrinks to `text-xs`, but the two arrow links keep a full 40px-square hit area - visual density never drops the tap target below the accessible minimum. The count is a live region, the arrows carry `aria-label`s, and bounds disable by dropping the href. Inline `border` and rounded ends make it read as one compact object.',
    seoTitle: 'Mini Pagination - Free Accessible Component',
    seoDescription:
      'A compact inline pagination pill with a page count and 40px arrow tap targets. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['mini pagination', 'compact pagination', 'inline pagination'],
  },
};
