import type { ComponentContentMap } from '../types';

/** English prose for the galleries category. Keys are component slugs. */
export const galleriesContent: ComponentContentMap = {
  'gallery-grid': {
    title: 'Photo Grid Gallery',
    description: 'An even, responsive grid of captioned photos with no JavaScript.',
    customization:
      'Two details do most of the work. The columns come from `auto-fill` + `minmax(10rem, 1fr)` rather than a count, so the grid reflows to its *container* - drop it in a sidebar and it thins to two columns without a breakpoint being involved. And `aspect-ratio: 4/3` with `object-fit: cover` is what keeps the rows aligned when the source photos are not all the same shape; the alternative is a grid that stair-steps. The part worth resisting is writing the caption into the `alt` as well: the caption is the visible title, the alt describes what the photo actually *shows*, and collapsing the two leaves a blind user with the title read twice and the image undescribed. Both the HTML and Next.js tabs render on the server and ship no JavaScript at all.',
    seoTitle: 'Photo Grid Gallery - Free Responsive Image Grid',
    seoDescription:
      'A responsive, accessible photo grid with figure captions and no JavaScript. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['image gallery', 'photo grid', 'responsive gallery', 'css grid gallery', 'react gallery'],
  },

  'gallery-masonry': {
    title: 'Masonry Gallery',
    description: 'A Pinterest-style wall of varying-height photos, built on CSS columns.',
    customization:
      'Read the trade-off before reaching for this. CSS columns flow top-to-bottom and *then* across, so items 1-2 fill the first column and 3-4 the second: the DOM order - which is also the tab and screen-reader order - runs down each column while a sighted eye scans across rows. For a photo wall where sequence carries no meaning that costs nothing, and you get a real masonry for two declarations with no JavaScript, no measuring and no reflow on resize. For anything *ranked* - search results, a chronological feed - it is simply wrong, and the even grid is the honest answer. `break-inside: avoid` is not optional; without it a tile splits across the column boundary, half at the bottom of one and half at the top of the next. Carry intrinsic `width`/`height` if you can: the columns cannot balance until every height is known, so without them the wall visibly reshuffles as the files land.',
    seoTitle: 'Masonry Gallery - Free CSS Columns Image Wall',
    seoDescription:
      'A no-JavaScript masonry photo gallery using CSS columns, with the reading-order trade-off documented. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['masonry gallery', 'css columns masonry', 'pinterest layout', 'image wall', 'react masonry'],
  },

  'gallery-lightbox': {
    title: 'Lightbox Gallery',
    description: 'A thumbnail grid whose photos open in a real modal dialog.',
    customization:
      'A lightbox is a modal dialog that happens to contain a photo, and it owes the user everything a dialog owes: `role="dialog"` with `aria-modal`, a focus trap, Escape to close, and focus handed back to the thumbnail that opened it. That last one is the most-skipped line in every lightbox on the web - without it a keyboard user closes the fourth photo and lands on `<body>`, back at the top of the page, which is why the component tracks *which* thumb opened it rather than just whether it is open. The trap is genuinely load-bearing too: `aria-modal` hides the page behind from a screen reader but does nothing whatsoever to the tab order, so Tab walks straight out into content the user cannot see. The backdrop closes on click, but only when the backdrop itself is the event target - skip that check and a click on the photo bubbles up and closes the dialog under the user.',
    seoTitle: 'Lightbox Gallery - Free Accessible Modal Image Viewer',
    seoDescription:
      'An image lightbox built as a real modal dialog with a focus trap, Escape to close and focus restoration. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['lightbox gallery', 'image lightbox', 'accessible modal', 'focus trap dialog', 'react lightbox'],
  },

  'gallery-carousel-thumbs': {
    title: 'Filmstrip Gallery',
    description: 'A photo stage with prev/next arrows, a position counter and a scrolling thumbnail filmstrip.',
    customization:
      'The shape to reach for once there are more thumbnails than fit on one line - where a fixed strip either wraps into a second row or shrinks every thumb into uselessness. The strip is an `overflow-x-auto` scroll-snap region, so it stays one line however many photos arrive, and selecting a photo scrolls its thumb into view. Note `block: \'nearest\'` on that `scrollIntoView`: without it the browser is free to scroll the whole *page* vertically to bring the strip into frame, yanking the layout out from under someone who only pressed Next. The scroll call lives inside the click handler rather than an effect for the same reason - it can then only ever run because a user asked for it, never on mount. The counter states position in words ("3 of 6") because a highlighted thumb only conveys that to someone who can see the entire strip at once, and selection shows as a ring *and* full opacity - two signals, never colour alone.',
    seoTitle: 'Filmstrip Gallery - Free Accessible Photo Carousel',
    seoDescription:
      'A photo carousel with a scroll-snap thumbnail filmstrip, prev/next arrows, a position counter and a polite live region. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['filmstrip gallery', 'thumbnail carousel', 'photo carousel', 'scroll snap gallery', 'react gallery'],
  },

  'gallery-filterable': {
    title: 'Filterable Gallery',
    description: 'A photo grid with tag filters and a live-announced result count.',
    customization:
      'Two decisions carry this one. The filters are `aria-pressed` toggle buttons rather than radios or links, because they are neither: a radio group would claim these are exclusive answers to a question in a form, and links would claim navigation, when in fact they toggle a list re-render in place. And the result count sits in an `aria-live="polite"` region, because pressing a filter silently reflows the grid - a sighted user watches it happen while a screen-reader user hears nothing at all and cannot tell whether the press registered. One polite region ("Showing 3 of 6 photos") is the whole fix. The pressed style keys off the `aria-pressed` attribute rather than a parallel class, so the state a screen reader reads and the fill a sighted user sees cannot drift apart - there is only one thing to set. In the vanilla tabs the filtered-out tiles use the `hidden` attribute rather than a class, which takes them out of the accessibility tree too; hide them with `opacity` and they are still sitting in the screen reader\'s list of six.',
    seoTitle: 'Filterable Gallery - Free Accessible Filtered Image Grid',
    seoDescription:
      'A tag-filterable photo gallery with aria-pressed toggles and a live-announced result count. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['filterable gallery', 'filter image grid', 'aria-pressed filter', 'portfolio gallery', 'react filter gallery'],
  },

  'gallery-horizontal-scroll': {
    title: 'Horizontal Scroll Gallery',
    description: 'A single scroll-snap row of gradient tiles that pans sideways instead of wrapping.',
    customization:
      'The whole point is `overflow-x-auto` on the list: the overflow lives inside the row, so the page never scrolls sideways - the exact failure a fixed-width row causes at 320px. Swap the per-tile `w-40 sm:w-56` to trade how many tiles peek in at once, and each tile is a CSS gradient (`role="img"` + `aria-label`) so nothing hits an image host.',
    seoTitle: 'Horizontal Scroll Gallery - Free Scroll-Snap Image Row',
    seoDescription:
      'A responsive horizontal scroll-snap gallery of CSS gradient tiles with no page overflow. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['horizontal gallery', 'scroll snap gallery', 'sideways scroll', 'react gallery'],
  },

  'gallery-hover-zoom': {
    title: 'Hover Zoom Gallery',
    description: 'A responsive grid whose tiles scale up on hover and keyboard focus.',
    customization:
      'The scale sits on the inner tile and the clip on the button, so `group-hover` and `group-focus-visible` produce identical feedback - a keyboard user gets the zoom a mouse user does. `motion-reduce` cancels the scale for anyone who asked the OS to still animations.',
    seoTitle: 'Hover Zoom Gallery - Free Accessible Image Zoom Grid',
    seoDescription:
      'A responsive image grid with a hover-and-focus zoom that respects reduced motion. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['hover zoom gallery', 'image zoom grid', 'focus zoom', 'react gallery'],
  },

  'gallery-tabs-category': {
    title: 'Category Tabs Gallery',
    description: 'A grid whose visible tiles switch with single-select category chips.',
    customization:
      'The chips are `aria-pressed` toggles, not radios: category selection re-renders a list in place rather than answering a form question. The pressed fill keys off the attribute itself, so the state a screen reader reads and the fill a sighted user sees are one thing that cannot drift apart.',
    seoTitle: 'Category Tabs Gallery - Free Tabbed Image Filter',
    seoDescription:
      'A category-tabbed image gallery using aria-pressed chips to switch the grid in place. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['category gallery', 'tabbed gallery', 'filter tabs', 'react gallery'],
  },

  'gallery-masonry-captions': {
    title: 'Masonry Gallery with Captions',
    description: 'A CSS-columns masonry wall with captions overlaid on a readable scrim.',
    customization:
      'Each caption sits on a `from-black/70` to-transparent gradient so it stays legible over any tile colour, and `break-inside-avoid` stops a tile splitting across a column boundary. The per-tile `heightClass` is what makes it read as masonry rather than a grid - vary it freely.',
    seoTitle: 'Masonry Gallery with Captions - Free CSS Columns Wall',
    seoDescription:
      'A no-JavaScript masonry gallery with overlaid captions on a legible scrim. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['masonry captions', 'css columns gallery', 'caption overlay', 'react masonry'],
  },

  'gallery-justified': {
    title: 'Justified Gallery',
    description: 'A Flickr-style justified wall where each row stretches edge-to-edge.',
    customization:
      'No measuring JavaScript: a fixed row height plus `grow` on every tile stretches each row full width, while the per-tile `basisClass` gives tiles different natural widths so the ragged seam lands differently each row. `flex-wrap` keeps it inside the container at any width.',
    seoTitle: 'Justified Gallery - Free Flexbox Justified Image Rows',
    seoDescription:
      'A justified photo wall built on flexbox grow with no layout JavaScript. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['justified gallery', 'flickr layout', 'flexbox gallery', 'react gallery'],
  },

  'gallery-carousel-fullwidth': {
    title: 'Full-Width Carousel Gallery',
    description: 'A one-slide-at-a-time carousel with arrows, dot navigation and a live caption.',
    customization:
      'The stage is an `aria-live="polite"` region so the caption change is announced, and the dots carry `aria-current` shown as a ring plus fill - two signals, never colour alone. The arrow controls clear the 40px minimum target; wrap-around indexing keeps Previous and Next always live.',
    seoTitle: 'Full-Width Carousel Gallery - Free Accessible Image Slider',
    seoDescription:
      'A full-width image carousel with arrows, dot indicators, a polite live region and wrap-around paging. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['fullwidth carousel', 'image slider', 'accessible carousel', 'react carousel'],
  },

  'gallery-polaroid': {
    title: 'Polaroid Gallery',
    description: 'Snapshot cards on white print frames, tilted and straightening on interaction.',
    customization:
      'Alternating `-rotate-2`/`rotate-2` gives the scattered-prints look; each card is a button so the straighten fires on `focus-visible` as well as hover, and `motion-reduce` drops the tilt entirely. The white frame is deliberately fixed in both themes - a photo print is not a UI surface to theme.',
    seoTitle: 'Polaroid Gallery - Free Tilted Snapshot Image Grid',
    seoDescription:
      'A polaroid-style image gallery with tilted print frames that straighten on hover and focus. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['polaroid gallery', 'tilted photos', 'snapshot grid', 'react gallery'],
  },

  'gallery-instagram-grid': {
    title: 'Instagram Grid Gallery',
    description: 'A tight three-across square grid with a like and comment overlay on interaction.',
    customization:
      'The overlay reveals on `group-hover` and `group-focus-visible` so it is reachable by keyboard, with the counts also mirrored in an `sr-only` label since the overlay is decorative. `grid-cols-3` holds even at 320px, and there is no `lg` bump on purpose - the three-column identity is the point.',
    seoTitle: 'Instagram Grid Gallery - Free Social Profile Image Grid',
    seoDescription:
      'A three-column square social-profile gallery with an accessible like/comment hover overlay. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['instagram grid', 'social gallery', 'square image grid', 'react gallery'],
  },

  'gallery-video-thumbs': {
    title: 'Video Thumbnails Gallery',
    description: 'A video-wall mock with a pure-CSS play button and duration badge - no real video.',
    customization:
      'The play glyph is a bordered zero-size box (a CSS triangle), not an asset or a `<video>`, and the duration is a `tabular-nums` badge. The button scales on hover and focus alike with `motion-reduce` holding it still, and each card is named "Play <title>" for screen readers.',
    seoTitle: 'Video Thumbnails Gallery - Free CSS Play-Button Grid',
    seoDescription:
      'A video-thumbnail gallery with a pure-CSS play button and duration badge and no real video. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['video gallery', 'video thumbnails', 'css play button', 'react gallery'],
  },

  'gallery-load-more': {
    title: 'Load More Gallery',
    description: 'A grid that reveals more tiles in place with a live-announced running count.',
    customization:
      'A polite live region states "Showing X of Y" so a screen-reader user learns the count grew without any page move, and the button removes itself once everything is shown rather than sitting there dead. Tune the reveal batch through the `step` prop.',
    seoTitle: 'Load More Gallery - Free Reveal-In-Place Image Grid',
    seoDescription:
      'An image gallery with a Load more button that reveals tiles in place and announces the running count. Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['load more gallery', 'reveal pagination', 'show more grid', 'react gallery'],
  },
};
