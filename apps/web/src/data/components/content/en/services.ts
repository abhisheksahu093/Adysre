import type { ComponentContentMap } from '../types';

/** English prose for the services category. Keys are component slugs. */
export const servicesContent: ComponentContentMap = {
  'services-grid': {
    title: 'Services Grid',
    description: 'A three-column grid of services, each an icon, a title and a line of copy.',
    customization:
      'The CSS variant uses `auto-fit` with `minmax(15rem, 1fr)` rather than a fixed column count, so it reflows from one column to three with no breakpoints - worth keeping if you drop it into a container narrower than the one you designed for. The services are a `<ul>`: a screen reader announces "list, 6 items" before the first, which is the count the grid gives a sighted visitor for free. Each tile heading is an `<h3>` under the section `<h2>`; do not skip to `<h4>` to get a smaller font - set the size with a class and leave the outline intact.',
    seoTitle: 'Services Grid Section - Free Tailwind CSS Component',
    seoDescription:
      'A responsive three-column services grid with icons, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['services grid', 'services section', 'tailwind services', 'icon grid'],
  },
  'services-alternating': {
    title: 'Services Alternating Rows',
    description: 'Image-and-copy rows that alternate sides down the page.',
    customization:
      'The zigzag is decoration, and the code treats it that way: the copy is always first in the DOM and only `md:order-first` moves the picture on odd rows. Reversing the markup to get the visual is the classic failure of this layout - it hands a keyboard and a screen reader a reading order that no longer matches the screen. Below `md` the grid is one column and the rule is inert, so the mobile stack is always copy-then-image. Swap `<img>` for `next/image` as the Next.js variant does, and keep the `sizes` hint in step with the column split or mobile downloads the desktop asset.',
    seoTitle: 'Alternating Services Section - Free React Component',
    seoDescription:
      'A zigzag image-and-copy services layout with a source order that never diverges from the visual one. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['alternating sections', 'zigzag layout', 'services rows', 'image copy section'],
  },
  'services-icon-list': {
    title: 'Services Icon List',
    description: 'A single-column list of services with the icon in a fixed left gutter.',
    customization:
      'Where the grid asks you to scan, this asks you to read - one measure, one column, dividers between rows instead of a card around each. Nine services as nine boxes is nine borders competing with the text inside them. `flex-none` on the icon is what keeps it a fixed gutter so every title starts on the same x; drop it and a long title will squeeze the icon narrower than its neighbours. Reach for this over `services-grid` when the copy per item runs past a line or two.',
    seoTitle: 'Services Icon List - Free Tailwind CSS Component',
    seoDescription:
      'A vertical services list with icons in a fixed gutter, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['icon list', 'services list', 'feature list', 'tailwind list section'],
  },
  'services-tabbed': {
    title: 'Services Tabbed Panels',
    description: 'Category tabs switching service panels, with the full ARIA tabs keyboard pattern.',
    customization:
      'This is the real tabs pattern, not a row of buttons that hide divs. Three things make it that. The roving tabindex means only the selected tab is in the tab sequence, so Tab enters the strip once and the next Tab goes to the panel rather than through every category. Arrow keys move selection inside the strip, with Home and End jumping to the ends - without them the roving tabindex has locked every tab but one out of reach rather than tidied the tab order. And each panel is wired to its tab both ways with `aria-controls` and `aria-labelledby`. Selection is marked by a 2px rule as well as colour, because colour alone leaves the active tab unmarked for anyone who cannot separate the hues. The strip scrolls rather than wraps: two rows of tabs above one panel and it stops being obvious which is selected.',
    seoTitle: 'Tabbed Services Section - Accessible React Tabs Component',
    seoDescription:
      'A tabbed services section implementing the full ARIA tabs pattern - roving tabindex, arrow keys, Home/End. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['tabbed services', 'aria tabs', 'accessible tabs', 'roving tabindex', 'react tabs'],
  },
  'services-cards-hover': {
    title: 'Services Hover Cards',
    description: 'Service cards that lift and reveal a call to action on hover and on focus.',
    customization:
      'Every `hover:` utility here has a `focus-visible:` twin, and that pairing is the whole point: a card whose call to action only exists under a cursor is a card a keyboard user never learns is clickable. The card *is* the link rather than a card containing one, which keeps it a single tab stop and gives the hover target and the click target the same bounds - and lets `group` hang off the anchor so the reveal answers `group-focus-visible` too. The reveal is `opacity`, not `display`, so the CTA row holds its space at rest and the card does not grow and shove the grid the moment a cursor touches it. Reduced motion drops the travel and keeps the fade, since the fade is the part that carries information.',
    seoTitle: 'Hover Reveal Service Cards - Free React Component',
    seoDescription:
      'Service cards that lift and reveal a CTA on hover and keyboard focus alike, honouring prefers-reduced-motion. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['hover cards', 'card hover effect', 'services cards', 'reveal on hover'],
  },
  'service-detail-hero': {
    title: 'Service Detail Hero',
    description: 'The top of a single service page - kicker, title, summary, dual CTA and a meta row.',
    customization:
      'The heading is an `<h1>`, not the `<h2>` the listing sections use: this is one service\'s own page and this is its title. The meta row is a `<dl>` because "Duration / 2-3 weeks" is a term and its value - marked up as one, a screen reader reads the pair; marked up as divs with a middot between them, it reads six loose strings and a punctuation mark. Draw any separators with CSS borders, never as typed "·" characters. The secondary CTA is bordered rather than a bare link: two actions of different weights read as a recommendation, whereas a filled pair reads as a fork with no advice.',
    seoTitle: 'Service Detail Hero - Free Tailwind CSS Component',
    seoDescription:
      'A service page hero with kicker, summary, dual CTA and a semantic definition-list meta row. HTML, CSS, Tailwind, React, Next.js and TypeScript.',
    keywords: ['service hero', 'page hero', 'detail hero', 'tailwind hero section'],
  },
  'service-detail-features': {
    title: 'Service Detail Features',
    description: 'A two-column feature checklist, each column under its own heading.',
    customization:
      'The heading owns its list rather than floating above it - they share a wrapper, so the pairing survives the columns collapsing to one on a narrow screen. The ticks are `aria-hidden` on purpose: every item in a checklist has one, so announcing "tick" before each adds a word and no information, and the list already says "list, 5 items" under a heading that says what they are. `items-start` plus `mt-0.5` on the icon puts the tick on the cap height of the first line; centre them and a two-line item sits its tick against the wrap. Two groups reads best - three needs a wider container than `max-w-5xl`.',
    seoTitle: 'Service Features Checklist - Free React Component',
    seoDescription:
      'A two-column feature checklist with grouped headings and accessible tick icons. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['feature checklist', 'features list', 'service features', 'tick list'],
  },
  'service-detail-process': {
    title: 'Service Detail Process',
    description: 'A numbered step flow with a connector rail running between the markers.',
    customization:
      'An `<ol>`, because the sequence is the content - a screen reader gets "1 of 4" from the element, not from the numbers drawn in the circles. Those numbers are `aria-hidden` for exactly that reason: leave them audible and it reads "one one Kickoff". They are derived from the index too, so renumbering is impossible to get wrong. The connector is a `::before` on the step itself rather than an element between steps, so it cannot desynchronise from the list, and `last:before:hidden` stops the final marker trailing a rule into nothing.',
    seoTitle: 'Numbered Process Steps - Free Tailwind CSS Component',
    seoDescription:
      'A numbered process flow with a connector rail, built on a semantic ordered list. HTML, CSS, Tailwind, React, Next.js and TypeScript. MIT licensed.',
    keywords: ['process steps', 'numbered steps', 'step flow', 'how it works section'],
  },
  'service-detail-pricing-cta': {
    title: 'Service Detail Pricing CTA',
    description: 'A price block with inclusions and a CTA band across the foot of the same card.',
    customization:
      'The band is a tinted footer of the same `<section>`, not a separate strip below it. That is deliberate: someone reading "£18,000 fixed fee" and someone pressing "Book a call" are the same person one second apart, and splitting them across two landmarks makes a screen reader leave one and enter another to finish a single thought. `price` is a pre-formatted string, symbol included - this component never does maths, because localising currency belongs to the page that knows the visitor. `tabular-nums` stops the figure reflowing between plans. In dark mode the band tint inverts: a shade *lighter* than the card, where on light it was darker.',
    seoTitle: 'Service Pricing Block with CTA - Free React Component',
    seoDescription:
      'A service price block with inclusions and an attached CTA band, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Accessible and MIT licensed.',
    keywords: ['pricing block', 'price cta', 'service pricing', 'cta band'],
  },
  'service-detail-faq': {
    title: 'Service Detail FAQ',
    description: 'A questions-and-answers block scoped to one service, built on native disclosure.',
    customization:
      '`<details>` and `<summary>`, not a div with a click handler. The browser already brings the disclosure role, the expanded state, Enter and Space - and find-in-page, which is the part hand-rolled accordions almost always lose: Chrome and Safari open a closed `<details>` when Ctrl+F lands inside it, whereas a JS accordion hides that text from the browser\'s own search. The shared `name` attribute makes the group exclusive natively, so `allowMultiple` is implemented by simply dropping it - and the whole thing stays a Server Component with no JavaScript at all. Give each FAQ on a page its own `groupName`, or two accordions will close each other\'s answers. Scope the questions to the service ("how long is the sprint"), not the product - a global FAQ is a different component in a different place.',
    seoTitle: 'Service FAQ Accordion - Free HTML details Component',
    seoDescription:
      'A no-JavaScript FAQ accordion built on native details/summary with exclusive groups and find-in-page support. HTML, CSS, Tailwind, React, Next.js, TypeScript.',
    keywords: ['faq accordion', 'details summary', 'no javascript accordion', 'service faq'],
  },
};
