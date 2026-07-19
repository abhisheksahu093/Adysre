import type { ComponentContentMap } from '../types';

/** English prose for the CTA category. Keys are component slugs. */
export const ctaContent: ComponentContentMap = {
  'cta-centered-simple': {
    title: 'Centered CTA',
    description:
      'A centred heading, sub-copy and a primary/secondary button pair - the default closing call-to-action.',
    customization:
      'The heading is an `<h2>` on purpose: a CTA sits mid-page after the hero owns the `<h1>`, so promoting it would break the outline. The buttons go full width and stack below `sm`, because two 140px buttons side by side on a phone are two bad tap targets instead of one good one.',
    seoTitle: 'Centered Call-to-Action Section - Free Tailwind Component',
    seoDescription:
      'A centred CTA with heading, sub-copy and dual buttons, in Tailwind, React and TypeScript. Responsive, WCAG AA and MIT licensed.',
    keywords: ['cta section', 'centered cta', 'call to action', 'tailwind cta'],
  },
  'cta-split-image': {
    title: 'Split CTA With Media',
    description:
      'Copy and a button on one side, a pure-CSS gradient media panel on the other, stacked on mobile.',
    customization:
      'The media column is a gradient with a decorative inline SVG rather than a shipped image, so there is nothing to preload or let rot, and it is `aria-hidden` because it illustrates rather than informs. The grid collapses to one column below `md`, keeping the copy above the panel in reading order.',
    seoTitle: 'Split Call-to-Action Section - Free Tailwind Component',
    seoDescription:
      'A two-column CTA with a gradient media panel that stacks on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['split cta', 'cta with image', 'two column cta', 'tailwind cta section'],
  },
  'cta-gradient-banner': {
    title: 'Gradient Banner CTA',
    description:
      'A rounded CTA banner on a colour gradient, with a scrim that keeps the white text legible.',
    customization:
      'The `bg-black/30` scrim is the component, not decoration: a gradient runs through light and dark stops, so white text over the raw gradient clears contrast in one region and fails in another - the scrim is what makes 4.5:1 true across it. The button ring is offset against `gray-900` because that is the darkest the banner ever gets.',
    seoTitle: 'Gradient Banner CTA - Free Tailwind Component',
    seoDescription:
      'A gradient CTA banner with an accessibility scrim and a high-contrast button, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['gradient cta', 'cta banner', 'call to action banner', 'gradient banner'],
  },
  'cta-with-email-capture': {
    title: 'CTA With Email Capture',
    description:
      'A heading over an inline email field and submit button - the whole CTA is the signup.',
    customization:
      'The label is `sr-only`, not missing: a placeholder is not a label - it vanishes on the first keystroke and leaves the field nameless in the accessibility tree. The row stacks below `sm` because a 90px email input is a rumour, and `loading` disables the button so a double-tap cannot double-subscribe.',
    seoTitle: 'Email Capture CTA Section - Free React Component',
    seoDescription:
      'A CTA with an accessible inline email signup form, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['email cta', 'newsletter cta', 'signup cta', 'email capture'],
  },
  'cta-stats-band': {
    title: 'Stats Band CTA',
    description:
      'A heading and button above a row of headline metrics that reflows from two columns to four.',
    customization:
      'Drive the numbers with the `stats` prop. Each metric is a `<dl>` pair with the value shown first via `order-*` while the DOM keeps `dt`-then-`dd`, so it reads correctly to a screen reader. The grid is two columns on phones and four from `sm`, so four big numbers never get crushed into one row.',
    seoTitle: 'Stats Band Call-to-Action - Free Tailwind Component',
    seoDescription:
      'A CTA with a responsive row of key metrics, in Tailwind, React and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['stats cta', 'metrics cta', 'social proof cta', 'cta with numbers'],
  },
  'cta-dark-glow': {
    title: 'Dark Glow CTA',
    description:
      'A near-black CTA with a soft radial glow behind the heading and a pair of buttons.',
    customization:
      'The section paints its own `bg-gray-950` surface and a blurred radial glow, so it looks identical on a light or dark page with no `dark:` variants. The glow is `aria-hidden` and behind the content on the z-axis; both button rings are offset against `gray-950`, the surface they actually sit on.',
    seoTitle: 'Dark Glow Call-to-Action - Free Tailwind Component',
    seoDescription:
      'A dark CTA with a radial glow backdrop and dual buttons, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['dark cta', 'glow cta', 'radial gradient cta', 'dark mode cta'],
  },
  'cta-two-button': {
    title: 'Two-Button CTA',
    description:
      'A heading over two buttons of equal weight - a genuine self-serve-or-demo decision.',
    customization:
      'Both buttons carry `sm:min-w-[11rem]` so the filled primary and the bordered secondary read as an even either/or rather than a button with an afterthought. They stack full width below `sm`.',
    seoTitle: 'Two-Button Call-to-Action - Free Tailwind Component',
    seoDescription:
      'A CTA with two equal-weight buttons that stack on mobile, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['two button cta', 'dual cta', 'call to action buttons', 'decision cta'],
  },
  'cta-card-floating': {
    title: 'Floating Card CTA',
    description:
      'A CTA inside an elevated card that reads as lifted off the page with a ring and soft shadow.',
    customization:
      'The shadow is tuned per theme - `gray-900/5` on light, `black/20` on dark - because a light-mode shadow is invisible on a dark surface. The card content is centred and capped at `max-w-xl` so the measure stays readable inside the wider panel.',
    seoTitle: 'Floating Card Call-to-Action - Free Tailwind Component',
    seoDescription:
      'A CTA in an elevated card with a theme-aware shadow, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['card cta', 'floating cta', 'elevated cta', 'cta card'],
  },
  'cta-full-bleed-pattern': {
    title: 'Full-Bleed Pattern CTA',
    description:
      'An edge-to-edge CTA over a CSS dot pattern, with a scrim gradient holding the white text.',
    customization:
      'It spans full width (`w-full`, no `max-w`) with the content re-centred inside. The dot pattern varies the surface luminance, so the `gray-900/70` to `/95` scrim gradient is load-bearing - it is what holds white text at 4.5:1 across the whole band, not a mood filter.',
    seoTitle: 'Full-Bleed Pattern CTA - Free Tailwind Component',
    seoDescription:
      'A full-width CTA over a CSS dot pattern with an accessibility scrim, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['full bleed cta', 'pattern cta', 'dot pattern cta', 'full width cta'],
  },
  'cta-app-download': {
    title: 'App Download CTA',
    description:
      'A heading and copy above App Store and Google Play badges built from inline SVG.',
    customization:
      'The store badges are inline SVG rather than shipped images, so there is nothing to preload or let rot. Each badge is a single link whose two-line label gives it a real accessible name, so the SVG glyph stays `aria-hidden`; the badges go full width and stack below `sm`.',
    seoTitle: 'App Download CTA Section - Free Tailwind Component',
    seoDescription:
      'A CTA with inline-SVG App Store and Google Play badges, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['app download cta', 'app store badge', 'google play badge', 'download app cta'],
  },
};
