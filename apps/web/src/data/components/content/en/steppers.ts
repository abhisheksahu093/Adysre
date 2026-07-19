import type { ComponentContentMap } from '../types';

/** English prose for the steppers category. Keys are component slugs. */
export const steppersContent: ComponentContentMap = {
  'stepper-horizontal-numbered': {
    title: 'Horizontal Numbered Stepper',
    description: 'A row of numbered markers joined by connectors, with completed steps shown as checks.',
    customization:
      'Labels sit beside the markers only from `sm` up - a four-step labelled row cannot fit 320px, so below the breakpoint the markers stand alone. The connector before a step turns blue only once that step is done, and the active `<li>` carries `aria-current="step"`.',
    seoTitle: 'Horizontal Numbered Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A responsive numbered step indicator with connectors and completed-state checks, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['stepper', 'numbered stepper', 'progress steps', 'tailwind stepper'],
  },
  'stepper-vertical-detailed': {
    title: 'Vertical Detailed Stepper',
    description: 'A vertical list of steps, each with a title and description and a connecting rail.',
    customization:
      'The connector runs down a fixed-width left rail as a `flex-1` line, so it stretches to whatever height the title-plus-description needs with no absolute positioning to drift. Pass `steps` as `{ title, description? }` and set `current` to the active index.',
    seoTitle: 'Vertical Stepper with Descriptions - Free Tailwind CSS Component',
    seoDescription:
      'A vertical step indicator with per-step titles and descriptions, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['vertical stepper', 'detailed stepper', 'step list', 'onboarding steps'],
  },
  'stepper-icons': {
    title: 'Icon Stepper',
    description: 'A horizontal stepper whose markers hold your icons, swapping to a check once complete.',
    customization:
      'Each step takes an `icon` node rendered inside the marker; a completed step shows a check instead so "done" never rides on colour alone. Like every horizontal row here, labels appear only from `sm` up so it survives 320px.',
    seoTitle: 'Icon Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A responsive step indicator with custom icon markers, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['icon stepper', 'stepper with icons', 'progress steps', 'onboarding stepper'],
  },
  'stepper-dots-compact': {
    title: 'Compact Dots Stepper',
    description: 'The smallest footprint of the set: a row of dots plus a single active-step line.',
    customization:
      'The active dot stretches into a pill so position survives without colour, and each dot carries its state as `sr-only` text. Ideal for mobile flows and carousels where a labelled row would be too heavy.',
    seoTitle: 'Compact Dots Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A minimal dot-based step indicator with an active pill, in Tailwind, React and TypeScript. Mobile-friendly and MIT licensed.',
    keywords: ['dots stepper', 'compact stepper', 'progress dots', 'mobile stepper'],
  },
  'stepper-progress-fraction': {
    title: 'Progress Fraction Stepper',
    description: 'A titled "Step 2 of 5" fraction over a real progressbar fill.',
    customization:
      'The bar is a genuine `role="progressbar"` with the `aria-value*` trio, and the visible fraction states the same fact for everyone else. The fill width is the only inline style because it is data, not decoration.',
    seoTitle: 'Progress Fraction Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A step indicator combining a fraction label with an accessible progress bar, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['progress bar stepper', 'step fraction', 'progressbar', 'percentage stepper'],
  },
  'stepper-checkout': {
    title: 'Checkout Stepper',
    description: 'A four-stage checkout indicator that restates the active stage as a line on mobile.',
    customization:
      'The labelled row would never fit 320px, so below `sm` the labels drop out and the active stage is restated above the row as "Step 2 of 4: Shipping". Feed the stage names through `steps` and drive `current` from your checkout state.',
    seoTitle: 'Checkout Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A responsive multi-stage checkout progress indicator, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['checkout stepper', 'ecommerce steps', 'cart progress', 'checkout flow'],
  },
  'stepper-wizard-interactive': {
    title: 'Interactive Wizard Stepper',
    description: 'A stepper header over a content panel with working Back and Next controls.',
    customization:
      'State lives in the React and TypeScript tabs: Back is disabled on the first step and Next becomes a disabled "Done" on the last, so the controls never point past the ends. Pass `steps` as `{ title, description? }` and an optional `initialStep`.',
    seoTitle: 'Interactive Wizard Stepper - Free React Component',
    seoDescription:
      'A stateful multi-step wizard with Back/Next navigation and a content panel, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['wizard stepper', 'multi-step form', 'interactive stepper', 'next back wizard'],
  },
  'stepper-segmented-bar': {
    title: 'Segmented Bar Stepper',
    description: 'A row of even segments that fill as you progress, with a fraction label above.',
    customization:
      'Each segment is `flex-1`, so the bar splits evenly at any width and never overflows a phone. Filled segments cover done-and-current steps, and the fraction is restated in text because a bar alone is not an accessible label.',
    seoTitle: 'Segmented Bar Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A segmented progress indicator that fills per step, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['segmented stepper', 'progress segments', 'step bar', 'multi-segment progress'],
  },
  'stepper-clickable-navigation': {
    title: 'Clickable Navigation Stepper',
    description: 'A horizontal stepper whose visited steps are buttons you can click to jump back.',
    customization:
      'Each marker is a real button that clears a 40px touch target, so the marker is `h-10 w-10` rather than the read-only rows’ `h-9`. Only visited and current steps are enabled - upcoming ones are disabled so you cannot skip ahead - and an `onStepChange` callback reports jumps.',
    seoTitle: 'Clickable Stepper Navigation - Free React Component',
    seoDescription:
      'A stepper with clickable visited steps and disabled upcoming steps, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['clickable stepper', 'stepper navigation', 'interactive steps', 'step buttons'],
  },
  'stepper-status-mixed': {
    title: 'Mixed Status Stepper',
    description: 'A vertical stepper where each step declares its own state, including error.',
    customization:
      'Status is explicit per step rather than derived from an index, so a step can fail: the error step gets a red marker and title, and its state is spelled out in `sr-only` text so it never rides on colour alone. Pass each step a `status` of complete, current, error or upcoming.',
    seoTitle: 'Mixed Status Stepper - Free Tailwind CSS Component',
    seoDescription:
      'A vertical step indicator with per-step complete, current, error and upcoming states, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['status stepper', 'error step', 'stepper states', 'vertical stepper'],
  },
};
