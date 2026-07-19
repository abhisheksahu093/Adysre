import type { ComponentContentMap } from '../types';

/** English prose for the footer category. Keys are component slugs. */
export const footerContent: ComponentContentMap = {
  'footer-simple': {
    title: 'Simple Footer',
    description: 'A logo, one row of links and a copyright line - stacked on mobile, spread on desktop.',
    customization:
      '`<footer>` is a landmark, but the links inside it are navigation and need their own `<nav aria-label="Footer">` - without the label a page with a main nav and a footer nav announces "navigation, navigation" and the user has to enter each one to find out which is which. The year comes from `new Date().getFullYear()`, which in Next.js runs on the server at render time; the `<time datetime>` wrapper makes it machine-readable rather than a bare number that happens to look like a date. Watch the small print: `text-gray-500` on white is 4.8:1 and clears AA, `text-gray-400` is 2.8:1 and does not - the shade below is where this component usually breaks.',
    seoTitle: 'Simple Footer - Free Tailwind CSS Component',
    seoDescription:
      'A minimal responsive footer with a logo, a link row and a copyright line, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['tailwind footer', 'simple footer', 'responsive footer', 'react footer', 'website footer'],
  },
  'footer-multi-column': {
    title: 'Multi-Column Footer',
    description:
      'A four-column sitemap with a brand blurb - the full footer for a marketing site.',
    customization:
      'Each column is a real `<h2>` over a `<ul>`, not a styled `<div>` over a stack of `<a>`s. The headings are how a screen reader user skims a sitemap; without them it is thirty links in a row with no indication of where one group ends and the next begins. The whole grid sits in **one** `<nav aria-label="Footer">` - it is one navigation region containing four groups, not four navigations. The grid steps 2 → 4 columns deliberately rather than using `auto-fit` + `minmax`, which collapses to unpredictable counts mid-range and leaves a lone orphan column. Edit `COLUMNS` to reshape the sitemap; the markup follows the data.',
    seoTitle: 'Multi-Column Footer - Free Tailwind Sitemap Footer',
    seoDescription:
      'A four-column footer with link groups and a brand blurb, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible, responsive and MIT licensed.',
    keywords: ['multi column footer', 'sitemap footer', 'tailwind footer columns', 'large footer', 'react footer'],
  },
  'footer-newsletter': {
    title: 'Newsletter Footer',
    description:
      'An email capture beside two link columns, with inline validation announced to screen readers.',
    customization:
      'The parts people skip are the ones that make an email capture usable. A real `<label>`, visually hidden but present - placeholder text vanishes the instant you type, so the field loses its name exactly when you want to check what you typed. `type="email"` and `autocomplete="email"`, which is what summons the @-key phone keyboard and the browser\'s autofill. And the result in an `aria-live` region: turning the button green tells a sighted user it worked and tells everyone else nothing. `noValidate` suppresses the browser\'s own bubble so there is one message channel, not two, while `checkValidity()` still gives you the parsing for free. The status colours are the fiddly part - `red-600`/`green-600` clear AA on white but fail on `gray-900`, so dark mode lifts both to the 400 shades. Swap `onSubmit` for a Server Action or your provider\'s endpoint.',
    seoTitle: 'Newsletter Footer with Email Signup - Free React Component',
    seoDescription:
      'A footer with an accessible newsletter signup form, inline validation and aria-live feedback, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['newsletter footer', 'email signup footer', 'subscribe form footer', 'react newsletter form'],
  },
  'footer-social': {
    title: 'Social Footer',
    description: 'A centred stack - wordmark, links, a row of social icon buttons and a copyright.',
    customization:
      'Every social icon is an icon-only link, so every one needs its own accessible name - "GitHub", not "link". The name comes from a visually hidden `<span>` rather than `aria-label`, deliberately: a span survives automatic page translation, an `aria-label` frequently does not. The `<svg>` is `aria-hidden` so it cannot compete with it. The targets are 40px even though the glyphs are 20px - a 20px tap target fails on a phone regardless of how tidy it looks. Marks are drawn with `fill="currentColor"`, so recolouring the link recolours the icon and dark mode is one text colour rather than three fills. Pass your own `socials` array; each needs a `name`, an `href` and the `d` of a 24×24 path. `rel="noreferrer"` alongside `target="_blank"` because modern browsers imply `noopener` but not `noreferrer`.',
    seoTitle: 'Social Media Footer - Free Tailwind CSS Component',
    seoDescription:
      'A centred footer with accessible social media icon links, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA, dark mode and MIT licensed.',
    keywords: ['social footer', 'social media icons footer', 'icon links footer', 'tailwind social footer'],
  },
  'footer-minimal-legal': {
    title: 'Minimal Legal Footer',
    description: 'One line - copyright and the legal links. For an app shell or a checkout page.',
    customization:
      'The whole design problem is the separator. A "·" typed into the link text is announced as "middle dot" between every entry; here it is its own `aria-hidden` list item, so it is drawn but never read. This is the footer for a place where a sitemap would be noise but Privacy and Terms still have to exist - an app shell, a checkout, an embedded view. Contrast matters more than usual at 13px: `text-gray-500` on white is 4.8:1 and `text-gray-400` on `gray-900` is 7.0:1, both over the line, and the tempting shade lighter is not. It wraps to two centred lines on narrow screens rather than shrinking the type.',
    seoTitle: 'Minimal Legal Footer - Free Tailwind CSS Component',
    seoDescription:
      'A single-line footer with a copyright and legal links, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Compact, accessible and MIT licensed.',
    keywords: ['minimal footer', 'legal footer', 'copyright footer', 'compact footer', 'app footer'],
  },
  'footer-mega-links': {
    title: 'Mega Links Footer',
    description: 'Five columns of links under a brand blurb - a full sitemap that never squeezes on a phone.',
    customization:
      'A five-group sitemap that steps 2 → 3 → 5 columns by breakpoint. Five columns at 320px are 50px each, which is not a sitemap but confetti, so the base layout is two columns and the `sm` step to three deliberately leaves two groups on a second, orphan row - a cleaner read than a squeeze. Every column is a real `<h2>` over a `<ul>` inside a single `<nav aria-label="Footer">`, so a screen reader skims the group headings instead of hearing twenty links in a row. Reshape it by editing `COLUMNS`; the markup follows the data.',
    seoTitle: 'Mega Links Footer - Free Tailwind Sitemap Footer',
    seoDescription:
      'A five-column mega footer with grouped link lists and a brand blurb, in Tailwind, React and TypeScript. Responsive, accessible and MIT licensed.',
    keywords: ['mega footer', 'sitemap footer', 'five column footer', 'large footer', 'tailwind footer'],
  },
  'footer-cta-banner': {
    title: 'CTA Banner Footer',
    description: 'A last-chance conversion panel above an ordinary link row, painting its own colour in both themes.',
    customization:
      'The panel heading is an `<h2>`, never an `<h1>` - a footer does not own the page\'s top heading, and promoting this for visual weight would be a second `<h1>` to anyone navigating by headings. The panel brings its own `blue-600`, so it looks identical in light and dark and nothing inside it carries a `dark:` class; white on `blue-600` and `blue-100` for the sub-copy both clear AA. The two buttons stack below `sm` because two buttons sharing a 288px row are two bad tap targets. Pass `ctaTitle`, `ctaCopy` and the two href/label pairs; the secondary button is optional in spirit - drop it for a single call to action.',
    seoTitle: 'CTA Banner Footer - Free Tailwind Conversion Footer',
    seoDescription:
      'A footer with a call-to-action banner above the link row, in Tailwind, React and TypeScript. Responsive, accessible, dark mode and MIT licensed.',
    keywords: ['cta footer', 'call to action footer', 'conversion footer', 'banner footer', 'tailwind footer'],
  },
  'footer-app-badges': {
    title: 'App Store Badges Footer',
    description: 'App Store and Google Play badges over a link row, drawn in inline SVG.',
    customization:
      'The badges are drawn in HTML + inline SVG and are deliberately generic: the official badge artwork is trademarked and ships with its own usage rules, so this is a stand-in you replace with the real assets for production. Because the badge is real text, its accessible name is simply its contents - "Download on the App Store" - with no `alt` to keep in sync. The two badges wrap rather than shrink: at 320px they stack, because a half-width store badge is an unreadable one. Each is at least 48px tall to stay a comfortable tap target. Pass `appStoreHref` and `playStoreHref`.',
    seoTitle: 'App Store Badges Footer - Free Tailwind Component',
    seoDescription:
      'A footer with App Store and Google Play download badges in inline SVG, in Tailwind, React and TypeScript. Responsive, accessible and MIT licensed.',
    keywords: ['app badges footer', 'app store footer', 'download footer', 'mobile app footer', 'tailwind footer'],
  },
  'footer-centered-logo': {
    title: 'Centered Logo Footer',
    description: 'A centred logo mark, link row and social icons stacked down the middle.',
    customization:
      'The logo is an icon-only home link, so its letterform is `aria-hidden` decoration and the real name lives in an `sr-only` span - "A" is not a name, and neither is "link". The social row uses the same pattern: an `aria-hidden` `<svg>` drawn with `fill="currentColor"` and a visually hidden `<span>` for the name, each in a 40px target even though the glyph is 20px. Everything is a centred flex stack that only splits the copyright and socials onto one row at `sm`. Pass `brand`; its first character becomes the mark, and edit `SOCIALS`/`LINKS` to taste.',
    seoTitle: 'Centered Logo Footer - Free Tailwind CSS Component',
    seoDescription:
      'A centred footer with a logo mark, link row and social icon links, in Tailwind, React and TypeScript. WCAG AA, dark mode and MIT licensed.',
    keywords: ['centered footer', 'logo footer', 'social footer', 'minimal footer', 'tailwind footer'],
  },
  'footer-contact-split': {
    title: 'Contact Split Footer',
    description: 'Contact details as a real address beside two link columns.',
    customization:
      'The contact block is a real `<address>` with `not-italic`, because browsers italicise it by default. The phone is a `tel:` link and the email a `mailto:` - on a phone these are the two most useful taps in the footer, so both get 40px-tall targets, and the `tel:` href is derived by stripping the typography from the display number, since `tel:` wants digits, not "(415) 555-". `break-all` keeps a long email wrapping inside 320px instead of pushing the page sideways. The layout is a single column below `md` and a two-up split above. Pass `street`, `city`, `phone` and `email`.',
    seoTitle: 'Contact Split Footer - Free Tailwind CSS Component',
    seoDescription:
      'A footer with contact details in an <address> beside link columns, with tel and mailto links, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['contact footer', 'address footer', 'tel mailto footer', 'business footer', 'tailwind footer'],
  },
  'footer-language-currency': {
    title: 'Language & Currency Footer',
    description: 'A locale and currency switcher beside the link row, for a footer that serves several markets.',
    customization:
      'Each `<select>` is a real control with its own visually hidden `<label>` - a bare select carries no accessible name, so a screen reader announces only "combobox". The focus ring lives on the wrapper via `focus-within`, so the native select keeps its own affordance while the whole control lights up on keyboard focus, and each is at least 40px tall. The selects are uncontrolled (`defaultValue`) with optional `onLocaleChange`/`onCurrencyChange` callbacks, so the component works as static markup or wired to your i18n store. The block stacks above `md` so the switchers never land on top of the links at 320px.',
    seoTitle: 'Language & Currency Footer - Free Tailwind Component',
    seoDescription:
      'A footer with accessible language and currency selectors beside the link row, in Tailwind, React and TypeScript. Responsive, i18n-ready and MIT licensed.',
    keywords: ['language footer', 'currency selector footer', 'i18n footer', 'locale switcher', 'tailwind footer'],
  },
  'footer-stats-strip': {
    title: 'Stats Strip Footer',
    description: 'A row of headline stats over the link columns, marked up as a description list.',
    customization:
      'The stats are a `<dl>`, not a row of `<div>`s: each figure is a `<dd>` value paired with a `<dt>` label, so a screen reader reads "Teams onboard, 12,000+" as one unit rather than two loose scraps. `flex-col-reverse` lifts the big number above its label visually while the `<dt>` stays first in source, the order the markup wants. The grid steps 1 → 2 → 4 so the numbers never shrink to an unreadable sliver at 320px. Pass a `stats` array of `{ value, label }`; the values are pre-formatted strings, so localise them upstream.',
    seoTitle: 'Stats Strip Footer - Free Tailwind CSS Component',
    seoDescription:
      'A footer with a headline metrics strip over the link row, marked up as a description list, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['stats footer', 'metrics footer', 'numbers footer', 'kpi footer', 'tailwind footer'],
  },
  'footer-dark-gradient-brand': {
    title: 'Dark Gradient Brand Footer',
    description: 'A self-painted dark gradient footer with an oversized wordmark and link columns.',
    customization:
      'The footer paints its own `bg-gradient-to-br` dark surface, so it looks identical in light and dark mode and carries no `dark:` classes at all. Because the surface is fixed, the contrast is set against it once: white on the near-black end clears ~17:1, the muted `gray-400` links ~7:1. The wordmark grows fluidly from `text-4xl` to `text-6xl` rather than at a fixed size that would push past 320px, and the columns fall from three to two on the narrowest screens. Pass `brand` and `tagline`; edit `COLUMNS` for the link groups.',
    seoTitle: 'Dark Gradient Brand Footer - Free Tailwind Component',
    seoDescription:
      'A dark gradient footer with a large brand wordmark and link columns, self-painted for both themes, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['dark footer', 'gradient footer', 'brand footer', 'wordmark footer', 'tailwind footer'],
  },
  'footer-accordion-mobile': {
    title: 'Accordion Mobile Footer',
    description: 'Link columns that collapse to native accordions on phones and open to a grid on desktop.',
    customization:
      'The columns are native `<details>` accordions on a phone and a static grid from `md` up, with no JavaScript - the toggle, keyboard handling and `aria-expanded` are all the browser\'s. They ship with the `open` attribute so the links are always in the DOM and indexable; on `md` the summary is set to `pointer-events-none` and the chevron `md:hidden`, which freezes each group open as an ordinary heading. `list-none` and `[&::-webkit-details-marker]:hidden` drop the two default disclosure triangles, and `group-open:rotate-180` flips the custom chevron. This is the one footer where a phone can carry a full sitemap, because only one section is expanded at a time. Pass a `columns` array to reshape it.',
    seoTitle: 'Accordion Mobile Footer - Free Tailwind Component',
    seoDescription:
      'A footer whose link columns collapse to native <details> accordions on mobile and open to a grid on desktop, no JavaScript, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['accordion footer', 'mobile footer', 'collapsible footer', 'details footer', 'responsive footer'],
  },
  'footer-minimal-floating': {
    title: 'Minimal Floating Footer',
    description: 'A compact floating card footer that sits inset from the page edges.',
    customization:
      'The footer floats as an inset card rather than a full-bleed bar: the outer padding is the gap to the page edge, and the rounded, shadowed surface sets it off from the page. Everything lives in one flex row that stacks below `sm`, so the brand, links and copyright are never clipped by the card\'s own `px-6` at 320px. The card is centred and capped at `max-w-5xl`. Pass `brand` and a `links` array; it is the lean footer for a docs page, an app shell or a landing page that wants a light touch at the bottom.',
    seoTitle: 'Minimal Floating Footer - Free Tailwind CSS Component',
    seoDescription:
      'A compact floating card footer inset from the page edges, in Tailwind, React and TypeScript. Responsive, accessible, dark mode and MIT licensed.',
    keywords: ['floating footer', 'minimal footer', 'card footer', 'compact footer', 'tailwind footer'],
  },
};
