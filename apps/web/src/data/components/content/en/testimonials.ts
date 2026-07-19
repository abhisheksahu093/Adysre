import type { ComponentContentMap } from '../types';

/** English prose for the testimonials category. Keys are component slugs. */
export const testimonialsContent: ComponentContentMap = {
  'testimonial-grid-three': {
    title: 'Three-Column Testimonial Grid',
    description: 'A responsive grid of quote cards that stacks to one column on mobile.',
    customization:
      'Cards use `h-full` inside the grid so a longer quote in one column does not leave its neighbours short. Avatars are initials on a gradient, derived from the name - no remote image to wait on.',
    seoTitle: 'Testimonial Grid Section - Free Tailwind CSS Component',
    seoDescription:
      'A three-column testimonial grid with initial-based avatars that stacks on mobile, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['testimonial grid', 'testimonials section', 'quote cards', 'social proof'],
  },
  'testimonial-spotlight-single': {
    title: 'Single Spotlight Testimonial',
    description: 'One centred quote with a large avatar - the featured testimonial on its own.',
    customization:
      'The quote mark SVG is `aria-hidden` so it is not read as text. The title scales from `text-xl` to `sm:text-2xl` so a long quote stays readable from 320px up.',
    seoTitle: 'Spotlight Testimonial Section - Free Tailwind CSS Component',
    seoDescription:
      'A single centred spotlight testimonial with a large initial avatar, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['spotlight testimonial', 'featured quote', 'single testimonial', 'pull quote'],
  },
  'testimonial-carousel': {
    title: 'Scroll-Snap Testimonial Carousel',
    description: 'A horizontally scrollable row of quote cards using CSS scroll-snap, no JavaScript.',
    customization:
      'Pure CSS `snap-x snap-mandatory`, so it ships zero JS and stays a Server Component. The list is a focusable scroll region (`tabIndex`) with an `aria-label`, so a keyboard user can pan it too. Cards peek at `85%` on mobile to hint there is more to scroll.',
    seoTitle: 'Testimonial Carousel - Free CSS Scroll-Snap Component',
    seoDescription:
      'A CSS scroll-snap testimonial carousel with no JavaScript and keyboard support, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['testimonial carousel', 'scroll snap', 'testimonial slider', 'quotes carousel'],
  },
  'testimonial-masonry-wall': {
    title: 'Masonry Testimonial Wall',
    description: 'Variable-height quotes flowing down CSS columns for a Twitter-style wall.',
    customization:
      'CSS multi-column flow, not a grid, so cards keep their natural height; `break-inside-avoid` stops a card from splitting across a column break. Mix short and long quotes for the masonry effect to read.',
    seoTitle: 'Masonry Testimonial Wall - Free CSS Component',
    seoDescription:
      'A CSS column masonry testimonial wall with variable-height quote cards, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['masonry testimonials', 'testimonial wall', 'css columns', 'quote wall'],
  },
  'testimonial-with-logos': {
    title: 'Testimonials With Company Logos',
    description: 'Quote cards each headed by a company wordmark rendered as styled text.',
    customization:
      'The wordmark is text, not an image file, so it never 404s and stays crisp at any zoom - swap it for a real logo when you have one. The grid is two-up from `md` and single-column below.',
    seoTitle: 'Testimonials With Logos - Free Tailwind CSS Component',
    seoDescription:
      'Testimonial cards paired with company wordmarks, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['testimonials with logos', 'brand testimonials', 'customer logos', 'social proof'],
  },
  'testimonial-rating-cards': {
    title: 'Star Rating Testimonial Cards',
    description: 'Review cards led by an inline-SVG star rating with an accessible label.',
    customization:
      'The star row is one `role="img"` with a worded `aria-label` ("Rated 4 out of 5"); the individual glyphs are `aria-hidden` so the rating is announced once, not five times. The rating is clamped when rendered so a stray value cannot draw extra stars.',
    seoTitle: 'Star Rating Testimonial Cards - Free Tailwind CSS Component',
    seoDescription:
      'Testimonial cards with accessible inline-SVG star ratings, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['rating testimonials', 'star reviews', 'review cards', 'testimonial rating'],
  },
  'testimonial-video-thumb': {
    title: 'Video Thumbnail Testimonials',
    description: 'Quote cards topped by a gradient video thumbnail with an accessible play control.',
    customization:
      'The thumbnail is a CSS gradient stand-in, not a remote poster - nothing to wait on. The play button is a real link with an `sr-only` name, so it is never a nameless icon to a screen reader; point `href` at your video page or a modal trigger.',
    seoTitle: 'Video Testimonial Cards - Free Tailwind CSS Component',
    seoDescription:
      'Testimonial cards with a gradient video thumbnail and an accessible play control, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['video testimonials', 'video thumbnail', 'play button card', 'testimonial video'],
  },
  'testimonial-split-featured': {
    title: 'Split Featured Testimonial',
    description: 'A large featured quote on a gradient panel beside a stacked list of shorter ones.',
    customization:
      'The featured quote paints its own gradient surface, so its `white/20` avatar and `blue-100` role clear AA without depending on the page background. The secondary list goes two-up on tablet then single-column at `lg` beside the panel.',
    seoTitle: 'Split Featured Testimonial - Free Tailwind CSS Component',
    seoDescription:
      'A split layout with a featured gradient testimonial and a secondary list, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['featured testimonial', 'split testimonials', 'testimonial layout', 'social proof'],
  },
  'testimonial-avatar-strip': {
    title: 'Avatar Strip Social Proof',
    description: 'A compact stack of overlapping avatars over a rating, count and one-line quote.',
    customization:
      'Colour is decorative - the initials carry identity and the `+N` overflow tile is a gray neutral so it never reads as another person. The ring keeps overlapping circles legible on both themes; extra names collapse into the count automatically.',
    seoTitle: 'Avatar Strip Social Proof - Free Tailwind CSS Component',
    seoDescription:
      'A compact overlapping-avatar social-proof strip with a star rating and count, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['avatar strip', 'social proof', 'overlapping avatars', 'user count'],
  },
  'testimonial-minimal-serif': {
    title: 'Minimal Serif Testimonial',
    description: 'An editorial serif pull-quote with a single-line attribution.',
    customization:
      '`not-italic` on the name keeps it upright against the italic quote, so it reads as attribution rather than part of the sentence. The em-dash separator is `aria-hidden` so it is not spoken.',
    seoTitle: 'Minimal Serif Testimonial - Free Tailwind CSS Component',
    seoDescription:
      'A minimal editorial serif pull-quote testimonial, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['serif testimonial', 'minimal testimonial', 'editorial quote', 'pull quote'],
  },
};
