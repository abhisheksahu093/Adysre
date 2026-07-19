import type { ComponentContentMap } from '../types';

/** English prose for the faq category. Keys are component slugs. */
export const faqContent: ComponentContentMap = {
  'faq-accordion': {
    title: 'FAQ Accordion',
    description: 'An accessible accordion where one answer opens at a time.',
    customization:
      'Feed it an array of question/answer pairs. Keep the `aria-expanded` and `aria-controls` wiring intact - it is what makes the control announce correctly to a screen reader.',
    seoTitle: 'FAQ Accordion - Free Accessible React Component',
    seoDescription:
      'A keyboard-accessible FAQ accordion with correct ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['faq accordion', 'accessible accordion', 'react accordion', 'tailwind faq'],
  },

  'accordion-multi-open': {
    title: 'Multi-Open Accordion',
    description: 'An accordion where any number of answers can stay open at once.',
    customization:
      'The opposite trade-off to the single-open accordion: nothing collapses behind the user, so answers can be compared side by side, at the cost of a page that grows as they read. Prefer it when questions are short or related. The React tabs track a `Set` of open ids and add an Expand all / Collapse all control; the HTML tabs get the same behaviour for free by omitting the `name` attribute from `<details>` - that attribute is what makes a group exclusive.',
    seoTitle: 'Multi-Open Accordion - Free Accessible Component',
    seoDescription:
      'An accordion that keeps several panels open at once, with Expand all and correct ARIA. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['multi open accordion', 'expand all accordion', 'accordion multiple', 'react accordion'],
  },

  'accordion-bordered': {
    title: 'Bordered Accordion',
    description: 'One outlined container with hairline dividers between the rows.',
    customization:
      'The radius lives on the container and `overflow-hidden` clips the rows to it, so the first and last rows round correctly without per-row corner rules - change `rounded-xl` in one place and the whole card follows. The focus ring is inset (`ring-inset`) because a standard outset ring would be clipped by that same `overflow-hidden`.',
    seoTitle: 'Bordered Accordion - Free Accessible Component',
    seoDescription:
      'An outlined FAQ accordion with divided rows and correct ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['bordered accordion', 'outlined accordion', 'faq accordion', 'tailwind accordion'],
  },

  'accordion-separated': {
    title: 'Separated Accordion',
    description: 'Each question is a detached card, separated by whitespace instead of dividers.',
    customization:
      'Gaps rather than dividers, which suits marketing pages where each answer should read as its own object. It defaults to `allowMultiple` because detached cards do not visually imply a group - set it to `false` for exclusive behaviour. Adjust the rhythm with `space-y-3` and keep the card radius on both the wrapper and the button so the focus ring follows the corner.',
    seoTitle: 'Separated Card Accordion - Free Accessible Component',
    seoDescription:
      'An FAQ accordion of detached cards with correct ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['card accordion', 'separated accordion', 'stacked faq', 'tailwind faq cards'],
  },

  'accordion-icon-left': {
    title: 'Left Icon Accordion',
    description: 'A disclosure accordion with the chevron leading the label.',
    customization:
      'The chevron points right when closed and rotates to point down when open, which reads as "this expands" rather than as a dropdown marker. The answer is indented by exactly the icon width plus the gap (`1rem + 0.625rem = 1.875rem`) so it lines up with the question text, not the icon - change the icon size and that padding has to move with it.',
    seoTitle: 'Left Icon Accordion - Free Accessible Component',
    seoDescription:
      'An FAQ accordion with a leading chevron and correct ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['icon left accordion', 'chevron accordion', 'faq accordion', 'react disclosure'],
  },

  'accordion-plus-minus': {
    title: 'Plus / Minus Accordion',
    description: 'An accordion whose + indicator morphs into a − as the panel opens.',
    customization:
      'The indicator is two bars stacked at the same point: the horizontal one is always visible and the vertical one collapses with `scale-x-0`, so + becomes − with a single transform and no icon swap. Both bars are `aria-hidden` - `aria-expanded` on the button is what a screen reader announces, so the glyph is pure decoration. The transition is disabled under `prefers-reduced-motion`, leaving the state change instant but still visible.',
    seoTitle: 'Plus Minus Accordion - Free Accessible Component',
    seoDescription:
      'An FAQ accordion with an animated plus/minus indicator and correct ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['plus minus accordion', 'animated accordion icon', 'faq accordion', 'css morph icon'],
  },

  'accordion-native-details': {
    title: 'Native Details Accordion',
    description: 'An exclusive accordion built on `<details name>` with no JavaScript at all.',
    customization:
      'Everything the ARIA disclosure pattern hand-builds - the expanded state, keyboard handling, the screen-reader announcement - is already in `<details>`; `name` makes the group exclusive the way it does for radio buttons, and the browser closes the open panel for you. Pass a unique `name` when two accordions share a page or they will close each other. The Next.js tab is deliberately not a client component: with no state to hydrate it renders on the server and ships zero JavaScript. Reach for the JS accordion instead only when the open state has to be controlled from outside.',
    seoTitle: 'Native Details Accordion - Free No-JS Component',
    seoDescription:
      'A zero-JavaScript FAQ accordion using native details and summary, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['details accordion', 'no javascript accordion', 'html details name', 'native accordion'],
  },

  'accordion-nested': {
    title: 'Nested Accordion',
    description: 'An accordion inside an accordion panel, with the heading levels kept correct.',
    customization:
      'The heading ranks are the part to get right: outer questions sit in `<h3>` and inner ones in `<h4>`, so the document outline nests the same way the boxes do and a screen reader’s heading list stays navigable. Skipping a rank (h3 → h5) breaks that even though it looks identical. Outer and inner open state are tracked separately, so collapsing a section does not lose the child a user had open. Two levels is the practical limit - deeper nesting is a sign the content wants its own page.',
    seoTitle: 'Nested Accordion - Free Accessible Component',
    seoDescription:
      'A two-level nested FAQ accordion with correct heading levels and ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['nested accordion', 'multi level accordion', 'accordion hierarchy', 'react accordion'],
  },

  'accordion-filled': {
    title: 'Filled Accordion',
    description: 'An accordion that tints the whole card while its answer is open.',
    customization:
      'The tint is redundant reinforcement rather than the state itself - `aria-expanded` and the chevron already carry it - so the component still reads correctly with colour filtering or a forced-colours mode on. Swap `bg-blue-50` / `dark:bg-blue-950` for any tint, but re-check the question text against it: the open row darkens to `text-blue-900` (and lightens to `text-blue-100` in dark mode) precisely to hold 4.5:1 on the fill.',
    seoTitle: 'Filled Accordion - Free Accessible Component',
    seoDescription:
      'An FAQ accordion with a tinted open panel and correct ARIA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['filled accordion', 'tinted accordion', 'highlighted faq', 'tailwind accordion'],
  },

  'accordion-faq-search': {
    title: 'Searchable FAQ Accordion',
    description: 'An FAQ accordion with a search box that filters the questions as you type.',
    customization:
      'Filtering matches answers as well as questions, so a search for "refund" finds a question whose title never uses the word - the substring match is the piece to replace first if you outgrow it. The result count sits in an `aria-live="polite"` region so a screen-reader user hears the list change instead of it silently reflowing beneath them, and the label is `sr-only` rather than absent, because a placeholder is not a label. The HTML tabs degrade to a plain `<details>` list: with JavaScript off the field does nothing and every answer stays readable.',
    seoTitle: 'Searchable FAQ Accordion - Free Accessible Component',
    seoDescription:
      'An FAQ accordion with live search filtering, an aria-live result count and correct ARIA. HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['searchable faq', 'faq search accordion', 'filter accordion', 'react faq search'],
  },
};
