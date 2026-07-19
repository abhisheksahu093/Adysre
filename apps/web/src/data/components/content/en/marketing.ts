import type { ComponentContentMap } from '../types';

/** English prose for the marketing category. Keys are component slugs. */
export const marketingContent: ComponentContentMap = {
  'newsletter-inline': {
    title: 'Inline Newsletter Form',
    description:
      'One row, one field, one button - the smallest honest email capture.',
    customization:
      'Smallest does not mean the label is negotiable. It is hidden with `sr-only` - a clip-rect, not `display:none`, which would take it out of the accessibility tree along with the pixels - because an input described only by a placeholder announces as "edit text, blank" the moment the user types. The row goes vertical below `sm`: a 90px email input is not a form. Drop this under a blog post or into a sidebar; when it needs a heading and a privacy note, reach for `newsletter-card` instead of bolting them onto this one.',
    seoTitle: 'Inline Newsletter Signup Form - Free Tailwind Component',
    seoDescription:
      'A single-row newsletter subscribe form with an accessible hidden label, in HTML, CSS, Tailwind, React, Next.js and TypeScript. WCAG AA and MIT licensed.',
    keywords: [
      'newsletter form',
      'inline subscribe form',
      'email signup form',
      'tailwind newsletter',
    ],
  },
  'newsletter-card': {
    title: 'Newsletter Card',
    description:
      'A bordered card with a heading, a pitch, the form, and the privacy note underneath.',
    customization:
      '`aria-labelledby` points the `<section>` at its own heading, so it announces as "Subscribe to the changelog, region" rather than an anonymous landmark - cheaper than `aria-label` and it cannot drift from the visible text. The privacy note is a real `<p>` under the form, not a tooltip: it is the answer to the only question the visitor is actually asking, so do not hide it behind a hover. One dark-mode detail worth keeping: the input goes to `gray-950` while the card sits at `gray-900`. A field the same colour as its container dissolves into it - on a card, the input has to go a step *darker* than the surface it sits on, not lighter.',
    seoTitle: 'Newsletter Signup Card - Free Tailwind CSS Component',
    seoDescription:
      'A bordered newsletter card with a heading, sub-copy, accessible form and privacy note, in HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['newsletter card', 'subscribe card', 'email signup card', 'newsletter widget'],
  },
  'newsletter-split': {
    title: 'Split Newsletter',
    description: 'The pitch on the left, the form on the right, stacked on mobile.',
    customization:
      'Copy and form are one `<section>` tied to one heading, and they stack in source order on mobile - pitch, then ask, which is the order a reader needs them in anyway. The `md:grid-cols-[1.2fr_1fr]` split gives the copy the wider column on purpose: the form is three controls and does not grow, while the sentence that has to earn the subscription does. Swap the social-proof line for a real number or delete it - a made-up count is worse than none.',
    seoTitle: 'Split Newsletter Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-column newsletter section with copy and an accessible subscribe form, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: [
      'split newsletter',
      'newsletter section',
      'two column subscribe',
      'email capture section',
    ],
  },
  'newsletter-footer-bar': {
    title: 'Newsletter Footer Bar',
    description: 'A full-width strip that sits above the site footer.',
    customization:
      'The bar paints its own dark surface at both themes and has no `dark:` variants at all - that is what makes it read as a band across the page rather than one more card, and it means the white text has a fixed contrast ratio instead of an inherited one. The field inside is styled for the dark band, not the page, so it stays `gray-950` in light mode too. Below `md` the copy and the form stack and the form goes full width; above it, `min-w-96` keeps the input from being crushed by a long headline sharing the row.',
    seoTitle: 'Newsletter Footer Bar - Free Tailwind CSS Component',
    seoDescription:
      'A full-width newsletter strip for the foot of a page, with an accessible subscribe form. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['newsletter bar', 'footer newsletter', 'subscribe strip', 'footer email signup'],
  },
  'newsletter-modal': {
    title: 'Newsletter Modal',
    description:
      'A subscribe dialog built on native `<dialog>` - focus trap, Escape, and backdrop dismissal.',
    customization:
      'Built on `<dialog>` and `showModal()`, because that one call gives you what hand-rolled modals get wrong for years: the focus trap, Escape to close, an inert background a screen reader cannot wander behind, the `::backdrop` pseudo-element, and focus restored to the opener on close. No overlay div, no `z-index` war - the top layer sits above the document. Note `showModal()`, not `show()`, and not the `open` attribute: a dialog opened by the attribute alone is not modal and traps nothing. The one behaviour `<dialog>` does *not* give you is backdrop dismissal, so it is the single thing wired by hand - and the trick is that a click on the backdrop reports the dialog itself as its target, while a click on any child reports that child, so comparing `event.target` is the whole test. The `close` event fires for Escape, the close button and a programmatic `close()` alike, which is why `onDismiss` hangs off it rather than off the button. Ration this one: a dialog that interrupts a first-time reader converts badly and annoys reliably.',
    seoTitle: 'Newsletter Modal Dialog - Free Accessible React Component',
    seoDescription:
      'A newsletter subscribe modal on the native dialog element, with a focus trap, Escape and backdrop dismissal. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['newsletter modal', 'subscribe modal', 'dialog focus trap', 'accessible modal'],
  },
  'marketing-feature-highlight': {
    title: 'Feature Highlight',
    description: 'A copy-and-media split with a decorative gradient panel and a single CTA.',
    customization:
      'The media is a gradient with inline SVG - no external image - and carries no text, so it needs no scrim. On mobile the copy leads and the panel follows via `order-*`; the CTA is full width until `sm`. Swap the SVG shapes for a screenshot only if you can guarantee the asset ships responsive.',
    seoTitle: 'Feature Highlight Section - Free Tailwind Component',
    seoDescription:
      'A responsive feature highlight with copy, a gradient media panel and a CTA, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['feature highlight', 'feature section', 'product feature', 'marketing section'],
  },
  'marketing-logos-social-proof': {
    title: 'Logo Social Proof',
    description: 'A "trusted by" wall of inline-SVG brand marks that wraps instead of overflowing.',
    customization:
      'Each logo is an inline SVG mark plus a wordmark, so there are no external image requests and the marks recolour with `currentColor` on hover. The list is a `flex-wrap` row that reflows at any width rather than scrolling off the edge at 320px. Feed it real brand names via the `logos` prop.',
    seoTitle: 'Logo Cloud / Social Proof - Free Tailwind Component',
    seoDescription:
      'A responsive trusted-by logo wall using inline SVG marks, in Tailwind, React and TypeScript. No external images, WCAG AA, MIT licensed.',
    keywords: ['logo cloud', 'social proof', 'trusted by logos', 'brand wall'],
  },
  'marketing-announcement-bar': {
    title: 'Announcement Bar',
    description: 'A dismissible page-top notice with a message, a link and a close button.',
    customization:
      'Message and link stack below `sm` so nothing overflows at 320px, and the close control is a 40px square tap target with a real `aria-label`. Dismissal is local state in the React/TS variants and calls `onDismiss` so the parent can persist it; the plain markup is the visible shell.',
    seoTitle: 'Announcement Bar - Free Dismissible Tailwind Component',
    seoDescription:
      'A dismissible top-of-page announcement bar with a link and accessible close button, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['announcement bar', 'notification bar', 'top banner', 'dismissible notice'],
  },
  'marketing-promo-banner': {
    title: 'Promo Banner',
    description: 'A gradient promo card with a badge, headline and CTA over a contrast scrim.',
    customization:
      'The white text sits over a gradient, so a `bg-black/25` scrim layer sits between them to hold WCAG-AA contrast wherever the gradient lands - the copy is never trusted to the gradient alone. The CTA drops below the copy and goes full width on mobile. Recolour by swapping the `from-`/`via-`/`to-` stops; keep the scrim.',
    seoTitle: 'Promo Banner - Free Gradient Tailwind Component',
    seoDescription:
      'A gradient promotional banner with a badge, headline, sub-copy and CTA over a contrast scrim, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['promo banner', 'gradient banner', 'offer banner', 'marketing cta'],
  },
  'marketing-countdown-offer': {
    title: 'Countdown Offer',
    description: 'A live countdown to a deadline with a CTA that respects reduced motion.',
    customization:
      'The four unit tiles wrap and never overflow at 320px, and the numerals pulse only under `motion-safe` - `motion-reduce:animate-none` stops the throb while the clock keeps ticking. The visual tiles are `aria-hidden`; a visually-hidden `aria-live` line narrates the remaining time. Pass an ISO `deadline`; past deadlines clamp to zero.',
    seoTitle: 'Countdown Timer Offer - Free Tailwind React Component',
    seoDescription:
      'A live countdown offer with days/hours/minutes/seconds, an accessible live region and a reduced-motion-safe pulse, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['countdown timer', 'offer countdown', 'sale timer', 'urgency component'],
  },
  'marketing-value-props': {
    title: 'Value Props Grid',
    description: 'A three-up grid of benefits, each with an inline-SVG icon, title and copy.',
    customization:
      'One column on phones, two at `sm`, three at `lg`, so the cells never crowd at 320px. Icons are inline SVG tinted with `currentColor`. Drive it entirely from the `items` prop; the `key` is the item title, so keep those unique.',
    seoTitle: 'Value Propositions Grid - Free Tailwind Component',
    seoDescription:
      'A responsive three-column value-props grid with inline SVG icons, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['value props', 'benefits grid', 'feature grid', 'icon grid'],
  },
  'marketing-lead-magnet': {
    title: 'Lead Magnet',
    description: 'A gated-download card with a gradient cover and a UI-only email form.',
    customization:
      'The cover is an inline-SVG gradient - no external image - and stacks above the copy on mobile while the email row goes vertical below `sm`. The form is UI-only: submit is prevented and `onSubmit` receives the email for you to wire. The label is hidden with `sr-only`, never dropped.',
    seoTitle: 'Lead Magnet Download Card - Free Tailwind Component',
    seoDescription:
      'A lead-magnet card with a gradient ebook cover and an accessible email capture form, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['lead magnet', 'ebook download', 'gated content', 'email capture'],
  },
  'marketing-webinar-signup': {
    title: 'Webinar Signup',
    description: 'A webinar registration card with a date badge and a UI-only email form.',
    customization:
      '`aria-labelledby` ties the section to its heading. The date badge and the email row both stack on mobile, and the form is UI-only - submit is prevented and `onSubmit` hands you the email. Pass `dateLabel`/`timeLabel` as pre-formatted strings so the component stays locale-agnostic.',
    seoTitle: 'Webinar Signup Card - Free Tailwind React Component',
    seoDescription:
      'A webinar registration card with a date badge, presenter line and accessible email form, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['webinar signup', 'event registration', 'webinar form', 'register card'],
  },
  'marketing-referral-card': {
    title: 'Referral Card',
    description: 'A referral share card with a read-only code field and a copy-to-clipboard button.',
    customization:
      'The code field and the copy button stack on mobile so nothing overflows at 320px. The button copies via the guarded Clipboard API, flips to "Copied!" for two seconds, and mirrors that into an `aria-live` line so it is announced. The field is `readOnly`, not disabled, so it stays focusable and selectable.',
    seoTitle: 'Referral Card - Free Copy-Code Tailwind Component',
    seoDescription:
      'A referral card with a read-only code field and an accessible copy-to-clipboard button, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['referral card', 'invite friends', 'copy code', 'referral program'],
  },
  'marketing-stats-band': {
    title: 'Stats Band',
    description: 'A gradient metrics band whose white numerals sit over a contrast scrim.',
    customization:
      'A `bg-black/30` scrim holds the white numerals at WCAG AA over the full sweep of the gradient. The grid collapses to one column on phones and grows to four. Each stat is a `<dd>` value over a `<dt>` label, reordered visually so the number reads first while the markup stays a real description list.',
    seoTitle: 'Stats Band - Free Gradient Metrics Tailwind Component',
    seoDescription:
      'A responsive gradient stats band with large metrics over a contrast scrim, in Tailwind, React and TypeScript. WCAG AA, MIT licensed.',
    keywords: ['stats band', 'metrics section', 'kpi band', 'numbers strip'],
  },
};
