import type { ComponentContentMap } from '../types';

/** English prose for the tour category. Keys are component slugs. */
export const tourContent: ComponentContentMap = {
  'tour-coach-mark-spotlight': {
    title: 'Coach Mark Spotlight',
    description:
      'A spotlit target with a positioned callout card - Step X of N, Back, Next and Skip, all scoped to its own box.',
    customization:
      'Feed the walkthrough through `steps` (each a `target`, `title` and `body`); the callout is `role="dialog"` with `aria-modal` and takes focus as you advance, but only after the first mount so it never yanks the page to itself. The dim layer is `absolute inset-0` inside the container, never `fixed` over the document, and the card is width-clamped so it cannot overflow a 320px phone.',
    seoTitle: 'Coach Mark Spotlight Tour - Free React Component',
    seoDescription:
      'An accessible product-tour coach mark with a spotlit target, a positioned callout, keyboard controls and a scoped dim layer, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['coach mark', 'spotlight tour', 'product tour', 'onboarding walkthrough'],
  },
  'tour-onboarding-checklist': {
    title: 'Onboarding Checklist',
    description:
      'A getting-started card with checkable tasks, a live progress bar and a collapse toggle.',
    customization:
      'Drive it with `tasks` of `{ id, label, description?, ctaLabel?, ctaHref?, done? }`; the header count and the `role="progressbar"` update as items are checked. Each toggle is a `role="checkbox"` button and the collapse control owns `aria-expanded` + `aria-controls`, so the whole card is keyboard-operable.',
    seoTitle: 'Onboarding Checklist - Free React Component',
    seoDescription:
      'An accessible getting-started checklist with a progress bar, per-task CTAs and a collapsible body, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['onboarding checklist', 'getting started', 'progress checklist', 'setup guide'],
  },
  'tour-feature-announcement-modal': {
    title: 'Feature Announcement Modal',
    description:
      "A scoped \"what's new\" dialog with an inline-SVG illustration, a version tag, feature bullets and dual actions.",
    customization:
      'Pass `version`, `title`, `features` and the action labels. The illustration is pure inline SVG on a gradient - nothing to preload - and the overlay is `absolute inset-0` within its stage rather than a fixed portal, so it never locks the page. Focus moves into the dialog on open and returns to the trigger on close; Escape and a scrim click both dismiss it.',
    seoTitle: "What's New Feature Announcement Modal - Free React Component",
    seoDescription:
      'An accessible feature-announcement dialog with an inline-SVG illustration, version tag and feature list, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['whats new modal', 'feature announcement', 'changelog dialog', 'release modal'],
  },
  'tour-hotspot-beacons': {
    title: 'Hotspot Beacons',
    description:
      'Pulsing beacon dots over a mock UI that open a small tip popover on click or focus.',
    customization:
      'Place beacons with `hotspots` of `{ id, x, y, label, tip }` where `x`/`y` are percentages. The pulse is `animate-ping` with `motion-reduce:hidden`, so reduced-motion users get a steady dot; the popover flips its anchor by position so an edge beacon opens inward instead of off the box. Each beacon is a real button - Escape closes its tip.',
    seoTitle: 'Hotspot Beacons Tour - Free React Component',
    seoDescription:
      'Accessible pulsing hotspot beacons over a mock UI with tip popovers and a reduced-motion fallback, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['hotspot beacons', 'pulsing beacon', 'tooltip hotspots', 'onboarding hints'],
  },
  'tour-step-tooltip-sequence': {
    title: 'Step Tooltip Sequence',
    description:
      'A driver.js-style sequence whose highlight and tooltip caret move along a mock toolbar as you advance.',
    customization:
      'Supply `steps` of `{ target, title, body }`; the ring moves to the active toolbar target and the caret is positioned by index - targets share the row evenly, so slot `i`’s centre is `(i + 0.5)/total`, no measuring. Next/Prev, the progress dots (which double as jump controls) and the Arrow keys all drive the same index, and `aria-current="step"` tracks it.',
    seoTitle: 'Step Tooltip Sequence Tour - Free React Component',
    seoDescription:
      'A driver.js-style guided tooltip sequence with a moving highlight, caret and progress dots, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['tooltip sequence', 'driver.js tour', 'guided tour', 'step tooltips'],
  },
};
