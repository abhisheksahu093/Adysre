import type { ComponentContentMap } from '../types';

/** English prose for the contact category. Keys are component slugs. */
export const contactContent: ComponentContentMap = {
  'contact-form-simple': {
    title: 'Simple Contact Form',
    description: 'A centred name, email and message form with inline validation and no chrome.',
    customization:
      'The React and TypeScript tabs run their own validation (`noValidate` hands it over) so errors render inline as `role="alert"` text wired by `aria-invalid` + `aria-describedby`; the static HTML tab keeps the browser\'s native validation. Every field has a real `<label>` and the message is a `<textarea>`. Wire `onSubmit` to your backend; by default it is a no-op.',
    seoTitle: 'Simple Contact Form - Free Tailwind CSS Component',
    seoDescription:
      'An accessible centred contact form with inline validation, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['contact form', 'simple contact form', 'tailwind contact', 'accessible form'],
  },
  'contact-split-map': {
    title: 'Contact With Map',
    description: 'A contact form beside a stylised inline-SVG map panel that stacks on mobile.',
    customization:
      'The map is inline SVG, not an embedded tile: no API key, no third-party script, no image to rot, and it recolours for dark mode with `fill-*` utilities. It carries `role="img"` and an `aria-label` so it is announced as a map. The two columns collapse to one below `md`.',
    seoTitle: 'Contact Form With Map - Free Tailwind CSS Component',
    seoDescription:
      'A split contact section pairing a form with an inline-SVG map, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['contact map', 'contact with map', 'split contact form', 'location contact'],
  },
  'contact-with-details': {
    title: 'Contact With Details',
    description: 'A form beside a column of address, phone and email with icons.',
    customization:
      'Phone and email are real `tel:`/`mailto:` links so a tap dials or composes; the icons are `aria-hidden` decoration and the visible label carries the meaning. Feed `address`, `phone` and `email` as props. Columns stack below `md`.',
    seoTitle: 'Contact Form With Details - Free Tailwind CSS Component',
    seoDescription:
      'A contact section pairing a form with an address, phone and email column, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['contact details', 'contact info', 'address contact form', 'two column contact'],
  },
  'contact-two-column': {
    title: 'Two Column Contact',
    description: 'An intro column with a response-time note beside the contact form.',
    customization:
      'The left column pairs a headline, supporting copy and an optional `note` pill; the right holds the form. Both are props with sensible defaults. The grid collapses to one column below `md`, keeping the intro above the form in reading order.',
    seoTitle: 'Two Column Contact Section - Free Tailwind CSS Component',
    seoDescription:
      'A two-column contact layout with an intro beside the form, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['two column contact', 'contact section', 'split contact', 'contact intro'],
  },
  'contact-boxed-card': {
    title: 'Boxed Card Contact',
    description: 'The contact form inside a bordered, shadowed card centred on the page.',
    customization:
      'A self-contained card with its own border, radius and shadow that sits equally well on a plain page or a busy one. Fields, labels and the submit button are the standard accessible set; `onSubmit` is a no-op you override.',
    seoTitle: 'Boxed Contact Card - Free Tailwind CSS Component',
    seoDescription:
      'A contact form inside a centred card, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['contact card', 'boxed contact form', 'card contact', 'centered contact form'],
  },
  'contact-support-options': {
    title: 'Support Options Contact',
    description: 'A department/topic radio-card picker above the contact form.',
    customization:
      'The picker is a real radio group inside a `<fieldset>`/`<legend>`, so it is announced as one labelled group and arrow keys move between options. The card styling is pure CSS: the native radio is `sr-only` and `has-[:checked]` / `has-[:focus-visible]` on the label paint the selected and focused states. Pass your own `topics`.',
    seoTitle: 'Support Options Contact Form - Free Tailwind CSS Component',
    seoDescription:
      'A contact form with an accessible department/topic radio-card picker, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['support contact', 'contact topics', 'department picker', 'radio card contact'],
  },
  'contact-gradient-side': {
    title: 'Gradient Side Contact',
    description: 'A gradient invitation panel beside the contact form, stacked on mobile.',
    customization:
      'The gradient panel paints its own dark surface, so its white text needs no `dark:` variant and looks identical on a light or dark page; only the form side inherits the theme. Set `panelTitle` and `panelText`. The panel sits above the form below `md`.',
    seoTitle: 'Gradient Contact Section - Free Tailwind CSS Component',
    seoDescription:
      'A contact form paired with a gradient side panel, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['gradient contact', 'contact panel', 'split contact form', 'gradient side'],
  },
  'contact-minimal': {
    title: 'Minimal Contact Form',
    description: 'A compact two-field email and message form with no card or chrome.',
    customization:
      'Just email and message, each with a real `<label>` and native validation, plus a neutral dark/light submit button. Ideal for a footer, a sidebar or a modal where a full contact form would be too heavy.',
    seoTitle: 'Minimal Contact Form - Free Tailwind CSS Component',
    seoDescription:
      'A compact two-field contact form, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['minimal contact form', 'compact contact', 'simple contact', 'small contact form'],
  },
  'contact-faq-combined': {
    title: 'Contact With FAQ',
    description: 'A contact form beside a short native-details FAQ, stacked on mobile.',
    customization:
      'The FAQ is native `<details>`/`<summary>`, so it opens and closes with zero JS, is keyboard-operable and announced out of the box, with the default disclosure triangle hidden and a chevron that rotates on `group-open`. Pass your own `faqs`; the columns stack below `md`.',
    seoTitle: 'Contact Form With FAQ - Free Tailwind CSS Component',
    seoDescription:
      'A contact form paired with a native-details FAQ, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['contact faq', 'contact with faq', 'faq contact form', 'support faq'],
  },
  'contact-social-links': {
    title: 'Contact With Social Links',
    description: 'A contact form followed by a row of social icon links.',
    customization:
      'Each social link is an `<a>` with an `aria-label` while the glyph is `aria-hidden`, so screen readers announce a named link rather than a lone SVG; the icons are inline SVG (X, GitHub, LinkedIn) and the targets are 40px to clear the touch minimum. Swap the `socials` prop for your own handles.',
    seoTitle: 'Contact Form With Social Links - Free Tailwind CSS Component',
    seoDescription:
      'A contact form with an accessible row of social icon links, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['contact social links', 'social contact form', 'contact with icons', 'social links'],
  },
};
