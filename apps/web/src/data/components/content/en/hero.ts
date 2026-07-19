import type { ComponentContentMap } from '../types';

/** English prose for the hero category. Keys are component slugs. */
export const heroContent: ComponentContentMap = {
  'hero-centered': {
    title: 'Centered Hero',
    description:
      'A centred headline, sub-copy and a pair of CTAs under an eyebrow badge - the default landing hero.',
    customization:
      'The eyebrow is a `<p>`, not an `<h2>`, and that is deliberate: promoting it would put a heading *before* the `<h1>` and break the outline for anyone navigating by headings. The title uses `clamp()` in the CSS tab and a `sm:` step in the Tailwind tabs - either way it has to survive a 390px phone and a 1440px desktop with the same markup. The buttons go full width and stack below `sm`, because two 140px buttons side by side on a phone is two bad tap targets instead of one good one.',
    seoTitle: 'Centered Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A centred hero with an eyebrow badge, headline, sub-copy and dual CTAs, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['hero section', 'centered hero', 'landing page hero', 'tailwind hero', 'cta hero'],
  },
  'hero-split-image': {
    title: 'Split Image Hero',
    description:
      'Copy on the left, picture on the right, stacked in reading order on mobile.',
    customization:
      'Copy comes first in the DOM and the image second, so the mobile stack puts the headline above the picture without any `order-` gymnastics - the first thing read should not be a 300px image the visitor has to scroll past. The media box fixes a `4/3` aspect ratio so the column reserves its space before the image decodes; without it the copy jolts upward on load, which is the classic hero layout shift. `alt=""` is correct here: the headline beside it already carries the meaning, and describing it again just makes a screen reader say it twice. The Next.js tab uses `next/image` with `priority` because this picture is almost always the LCP element.',
    seoTitle: 'Split Image Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-column hero with copy and image that stacks on mobile, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['split hero', 'hero with image', 'two column hero', 'tailwind hero section'],
  },
  'hero-gradient-bg': {
    title: 'Gradient Background Hero',
    description:
      'A hero on a slowly panning CSS gradient, with a scrim that keeps the text legible at every frame.',
    customization:
      'The scrim is the component. An animated gradient moves through light and dark stops, so white text over the raw gradient passes contrast on one frame and fails on the next - `bg-black/40` is what makes 4.5:1 true at *every* frame, not just the one you screenshotted. For the same reason the sub-copy is a solid `text-gray-200` rather than `text-white/70`: a translucent white over moving colour has a contrast ratio that changes as it pans. The animation pans `background-position` across a `300%` gradient, which the compositor handles; animating the colour stops themselves would repaint every frame. Tailwind cannot declare `@keyframes`, so they travel with the component in a `<style>` tag - nothing to add to a config. Reduced motion stops the pan and keeps the gradient: the motion is the decoration, the gradient is the design.',
    seoTitle: 'Animated Gradient Hero - Free CSS Component',
    seoDescription:
      'A hero with an animated CSS gradient background, an accessibility scrim and a reduced-motion fallback. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: [
      'gradient hero',
      'animated gradient background',
      'css gradient animation',
      'hero background',
    ],
  },
  'hero-with-form': {
    title: 'Hero With Email Capture',
    description:
      'A headline over an inline email field and submit - the whole hero is the signup.',
    customization:
      'The label is hidden, not missing. A placeholder is not a label: it vanishes on the first keystroke, it is not reliably announced, and it leaves the field nameless in the accessibility tree - so `sr-only` (a clip-rect, not `display:none`) keeps it there for the people who need it. `type="email"` earns the right mobile keyboard and free browser validation, and `autocomplete="email"` lets the browser fill it; on the one field standing between a visitor and a signup, neither is optional polish. The row goes vertical below `sm` - a 90px-wide email input is not a form, it is a rumour. Drive `loading` from your submit handler so a double-tap cannot double-subscribe.',
    seoTitle: 'Hero with Email Signup Form - Free React Component',
    seoDescription:
      'A hero section with an accessible inline email capture form, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['hero with form', 'email capture hero', 'signup hero', 'waitlist hero'],
  },
  'hero-video-bg': {
    title: 'Video Background Hero',
    description:
      'A muted looping video behind a scrim, with a poster fallback and no autoplay for reduced-motion users.',
    customization:
      'Four attributes are load-bearing, not stylistic. `muted` - autoplay is blocked without it anyway. `playsinline` - without it iOS hijacks the page into fullscreen playback. `poster` - the first paint, the slow-connection fallback, and what a reduced-motion user sees instead of the video. And the scrim at `black/60` - a video is arbitrary moving pixels, and there is no colour you can give a headline that survives a cut to a white frame. Size the scrim for the worst frame, not the average one. The video is `aria-hidden` with `tabindex="-1"` and no controls: it is decoration, and decoration must not be a tab stop. Note that `motion-reduce:hidden` alone is not enough - CSS can hide a video but cannot pause it, and a hidden video keeps decoding frames and burning battery, which is why the React tabs pause it via `matchMedia`. Keep the file short and small; it is not content.',
    seoTitle: 'Video Background Hero - Free React Component',
    seoDescription:
      'A hero with a muted looping background video, an accessibility scrim, a poster fallback and a reduced-motion opt-out. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['video hero', 'video background', 'hero video section', 'background video overlay'],
  },
  'hero-bento-grid': {
    title: 'Bento Grid Hero',
    description:
      'A centred headline over a bento-style grid of gradient feature tiles that restacks cleanly on mobile.',
    customization:
      'Pass up to five `features` - the first takes the large 2x2 cell and the rest fill the grid beside it. The grid is 2 columns on phones and 4 on desktop, so the tiles reflow instead of shrinking; the offsets and spans are the layout, not decoration you can drop.',
    seoTitle: 'Bento Grid Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A hero with a responsive bento grid of feature tiles, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['bento hero', 'bento grid', 'feature grid hero', 'tailwind bento'],
  },
  'hero-stats': {
    title: 'Stats Hero',
    description:
      'A headline and CTA above a row of headline metrics that reflows from two columns to four.',
    customization:
      'Drive the numbers with the `stats` prop. Each metric is a `<dl>` pair with the value shown first via `order-*` while the DOM keeps `dt`-then-`dd`, so it reads correctly to a screen reader. The grid is two columns on phones and four on large screens - four big numbers never get crushed into one unreadable row.',
    seoTitle: 'Stats Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A hero with a responsive row of key metrics, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['stats hero', 'metrics hero', 'kpi hero', 'hero with numbers'],
  },
  'hero-search': {
    title: 'Search Hero',
    description:
      'A headline over a prominent search field with a submit button and quick-fill popular tags.',
    customization:
      'The field is a controlled input wired to `onSearch`; the popular-search chips both fill and fire the query. The label is `sr-only`, not absent - the leading magnifier is decorative and `aria-hidden`, so the input still has a real accessible name. The row stacks below `sm` because a 90px search box is a rumour, not a form.',
    seoTitle: 'Search Hero Section - Free React Component',
    seoDescription:
      'A hero with an accessible search field and quick-fill tags, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['search hero', 'hero with search', 'directory hero', 'search input hero'],
  },
  'hero-logos-strip': {
    title: 'Logos Strip Hero',
    description:
      'A headline and CTA above a wrapping strip of customer wordmarks for instant social proof.',
    customization:
      'Logos are `logos` strings rendered as muted wordmarks so the strip wraps and centres at any width and never ships a broken `<img>`; swap them for inline SVGs once you have brand assets. The `proofLabel` above the row is a plain caption, not a heading, keeping the document outline intact.',
    seoTitle: 'Logo Cloud Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A hero with a responsive customer-logo strip for social proof, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['logo cloud hero', 'logos strip', 'social proof hero', 'trusted by hero'],
  },
  'hero-app-screenshot': {
    title: 'App Screenshot Hero',
    description:
      'A centred headline above a pure-CSS browser-window mockup of the product - no image to go stale.',
    customization:
      'The whole screenshot is built from CSS: a browser chrome with traffic-light dots, a sidebar and gradient content blocks. It is `aria-hidden` because it illustrates the product rather than carrying content, and it ships no real image so there is nothing to preload or let rot. The sidebar hides below `sm` so the mock never overflows a phone.',
    seoTitle: 'App Screenshot Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A hero with a pure-CSS browser mockup of your app, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['app screenshot hero', 'product hero', 'browser mockup hero', 'saas hero'],
  },
  'hero-animated-words': {
    title: 'Animated Words Hero',
    description:
      'A headline whose last word cycles through a rotating list via a CSS-only vertical rotator.',
    customization:
      'Set the fixed `lead` and a list of `words`. The rotation is pure CSS: the column of words translates up one line per step, with a copy of the first word appended so the loop is seamless. The keyframes are written for four words, so keep that count - and `motion-reduce:animate-none` freezes it on the first, still-legible word.',
    seoTitle: 'Animated Rotating Words Hero - Free CSS Component',
    seoDescription:
      'A hero with a CSS-only rotating-word headline and a reduced-motion fallback, in Tailwind, React and TypeScript.',
    keywords: ['animated words hero', 'rotating text hero', 'word rotator', 'css text animation'],
  },
  'hero-dark-glow': {
    title: 'Dark Glow Hero',
    description:
      'A near-black hero with a soft radial glow behind the headline and a pair of CTAs.',
    customization:
      'The section paints its own `bg-gray-950` surface and a blurred radial glow, so it looks identical on a light or dark page with no `dark:` variants. The glow is `aria-hidden` and sits behind the content on the z-axis; the primary CTA is white-on-dark and the secondary is a bordered ghost, both with rings offset against the dark surface.',
    seoTitle: 'Dark Glow Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A dark hero with a radial glow backdrop and dual CTAs, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['dark hero', 'glow hero', 'radial gradient hero', 'dark mode hero'],
  },
  'hero-split-checklist': {
    title: 'Split Checklist Hero',
    description:
      'Copy and a CTA on one side, a checkmarked list of benefits on the other, stacked on mobile.',
    customization:
      'Feed the benefits through `items`. Each row pairs a decorative green check badge with its label; the checkmark is `aria-hidden` because the list already carries the meaning semantically. The two columns collapse to one below `md`, keeping the headline above the list in reading order.',
    seoTitle: 'Split Checklist Hero Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-column hero with a benefits checklist that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['checklist hero', 'benefits hero', 'split hero', 'feature list hero'],
  },
  'hero-cards-collage': {
    title: 'Cards Collage Hero',
    description:
      'A headline over a collage of testimonial cards with gradient initials avatars and staggered offsets.',
    customization:
      'Pass `cards` of `{ quote, name }`; initials and a rotating gradient avatar are derived automatically. At 320px the cards are a single clean column - the vertical offsets that make it a collage are only applied from `sm:` up, so nothing ever clips off a narrow viewport.',
    seoTitle: 'Testimonial Collage Hero - Free Tailwind CSS Component',
    seoDescription:
      'A hero with a staggered collage of testimonial cards, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['collage hero', 'testimonial hero', 'cards hero', 'social proof cards'],
  },
  'hero-announcement-banner': {
    title: 'Announcement Banner Hero',
    description:
      'A pill announcement link above the headline, pairing a launch note with the main hero CTA.',
    customization:
      'The banner is one link - the entire pill is the target, so there is no tiny "read more" hotspot - built from `bannerLabel`, `bannerText` and `bannerHref`. It wraps rather than overflowing at 320px, and its trailing arrow is decorative. Below it sits the usual headline, sub-copy and primary CTA.',
    seoTitle: 'Announcement Banner Hero - Free Tailwind CSS Component',
    seoDescription:
      'A hero with a clickable announcement pill above the headline, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['announcement hero', 'banner hero', 'launch hero', 'hero with pill'],
  },
};
