import type { ComponentContentMap } from '../types';

/** English prose for the Blog category. Keys are component slugs. */
export const blogContent: ComponentContentMap = {
  'blog-card-vertical': {
    title: 'Vertical Blog Card',
    description:
      'A cover image over a category, title, excerpt and author row - the default post card for a grid.',
    customization:
      'The whole card is a single link, so nothing inside it is a nested anchor. The heading is an `<h3>` because the card repeats in a grid where a section already owns the `<h2>`. The cover sits in an `aspect-[16/10]` box so the grid stays even before any photo decodes, and `line-clamp-2` keeps a long excerpt from breaking the row height.',
    seoTitle: 'Vertical Blog Card - Free Tailwind Component',
    seoDescription:
      'A responsive blog post card with cover image, category, excerpt and author, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['blog card', 'post card', 'article card', 'tailwind blog'],
  },
  'blog-card-horizontal': {
    title: 'Horizontal Blog Card',
    description:
      'An image and copy split side by side that stacks to image-over-text on small screens.',
    customization:
      'The grid is `grid-cols-1` then `sm:grid-cols-[40%_1fr]`, so below `sm` the image sits above the copy in reading order rather than squeezing into a thin column. Swap to the reverse variant by moving the media column with `sm:order-last`. The image box keeps `aspect-video` on mobile and stretches to the copy height on `sm` and up.',
    seoTitle: 'Horizontal Blog Card - Free Tailwind Component',
    seoDescription:
      'A horizontal blog card with a media split that stacks on mobile, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['horizontal blog card', 'media card', 'post preview', 'tailwind card'],
  },
  'blog-post-grid': {
    title: 'Blog Post Grid',
    description:
      'A titled section that lays posts out one, two or three across as the viewport grows.',
    customization:
      'Each post is an `<article>` with its own heading link, not a whole-card link, so the cover and the title can point at the same URL while keeping the excerpt selectable. The grid steps from one column to three at `sm` and `lg`; drop the `lg:grid-cols-3` for the two-column variant.',
    seoTitle: 'Blog Post Grid Section - Free Tailwind Component',
    seoDescription:
      'A responsive blog listing grid with cover images and post meta, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['blog grid', 'post listing', 'blog section', 'tailwind blog grid'],
  },
  'blog-featured-hero': {
    title: 'Featured Post Hero',
    description:
      'A large cover with the title reversed out over a gradient scrim for the lead story.',
    customization:
      'The `from-black/80` gradient is the component, not decoration: white text over an arbitrary photo only clears 4.5:1 once a dark layer is guaranteed beneath it. The excerpt is hidden below `sm` so the title never gets crowded on a phone, and the focus ring is offset so it reads against the photo.',
    seoTitle: 'Featured Blog Post Hero - Free Tailwind Component',
    seoDescription:
      'A featured post hero with an image, gradient scrim and reversed title, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['featured post', 'blog hero', 'image overlay', 'tailwind hero'],
  },
  'blog-post-header': {
    title: 'Article Header',
    description:
      'A kicker, headline, author-and-date meta row and cover image to open a post.',
    customization:
      "The article's own heading is an `<h2>` because the site chrome owns the page `<h1>`; the meta row is muted body text, not headings, so the outline stays a title and its sections. The cover uses `aspect-[16/9]` to hold its space, and the meta wraps gracefully with `flex-wrap` on narrow screens.",
    seoTitle: 'Blog Article Header - Free Tailwind Component',
    seoDescription:
      'An article header with kicker, title, author meta and cover image, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['article header', 'post header', 'blog title', 'tailwind article'],
  },
  'blog-author-byline': {
    title: 'Author Byline',
    description:
      'An avatar beside the author name, role, date and read time for the top of a post.',
    customization:
      'The avatar carries the author name as its `alt`, so it is not decorative here. The meta line uses `flex-wrap` and `min-w-0` with `truncate` on the name, so a long name or a narrow column degrades cleanly instead of overflowing. Drop the role and time for the compact variant.',
    seoTitle: 'Author Byline - Free Tailwind Component',
    seoDescription:
      'An author byline with avatar, role, date and read time, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['author byline', 'post meta', 'avatar byline', 'tailwind byline'],
  },
  'blog-post-list': {
    title: 'Compact Post List',
    description:
      'A divided list of posts with optional thumbnails - the dense archive or search-result view.',
    customization:
      'Each row is one link with a thumbnail that hides below `sm`, so the list stays readable on a phone without the images crowding the text. `divide-y` draws the separators from the list itself, so adding a row needs no extra markup. `line-clamp-1` keeps every row the same height.',
    seoTitle: 'Compact Blog Post List - Free Tailwind Component',
    seoDescription:
      'A dense, divided blog post list with optional thumbnails, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['post list', 'blog archive', 'article list', 'tailwind list'],
  },
  'blog-newsletter-inline': {
    title: 'Inline Newsletter Signup',
    description:
      'A subscribe card with an email field and button that stacks on mobile - drop it mid-article.',
    customization:
      'The input has a visually hidden `<label>` rather than relying on the placeholder, which disappears on focus and was never a name to a screen reader. The field and button stack with `flex-col` then sit inline at `sm`, so two controls never fight for a phone-width row. Wire `onSubmit` to your list provider; the markup ships accessible and unstyled of any vendor.',
    seoTitle: 'Inline Newsletter Signup - Free Tailwind Component',
    seoDescription:
      'An inline newsletter subscribe card with an accessible email field, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['newsletter signup', 'email capture', 'subscribe form', 'tailwind newsletter'],
  },
};
