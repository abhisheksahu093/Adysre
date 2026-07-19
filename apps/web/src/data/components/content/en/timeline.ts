import type { ComponentContentMap } from '../types';

/** English prose for the timeline category. Keys are component slugs. */
export const timelineContent: ComponentContentMap = {
  'timeline-vertical-basic': {
    title: 'Basic Vertical Timeline',
    description:
      'A plain vertical rail with a dot, time, title and description per entry - the default timeline.',
    customization:
      'The rail is the list’s own `border-s`, so it flips for RTL, and each dot is pulled onto it with `-start-1.5`. Swap `bg-blue-600` on the dots for any accent, or widen `max-w-2xl` to give descriptions more room.',
    seoTitle: 'Vertical Timeline - Free Tailwind CSS Component',
    seoDescription:
      'A responsive vertical timeline with dots, dates and descriptions, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['vertical timeline', 'tailwind timeline', 'history timeline', 'timeline component'],
  },
  'timeline-alternating': {
    title: 'Alternating Timeline',
    description:
      'Entries zig-zag either side of a centre line on desktop and collapse to one column on phones.',
    customization:
      'Single column is the base layout and the left/right alternation is a `md`-and-up enhancement, so it stays readable at 320px. Even rows land in grid column one (right-aligned toward the line), odd rows in column two - control which side an item takes purely by its index.',
    seoTitle: 'Alternating Timeline - Free Responsive Component',
    seoDescription:
      'A two-sided alternating timeline that collapses to a single column on mobile, in Tailwind, React and TypeScript. Free and MIT licensed.',
    keywords: ['alternating timeline', 'zigzag timeline', 'responsive timeline', 'centered timeline'],
  },
  'timeline-horizontal-scroll': {
    title: 'Horizontal Scroll Timeline',
    description:
      'A horizontal strip of milestone cards on a rail that scroll-snaps instead of wrapping.',
    customization:
      'The inner list is `min-w-max` and the wrapper owns `overflow-x-auto`, so only the strip scrolls sideways, never the page. Adjust card width with `w-60` and the snap feel with `snap-mandatory`.',
    seoTitle: 'Horizontal Timeline - Free Scrolling Component',
    seoDescription:
      'A horizontal scroll-snap timeline of milestone cards, in Tailwind, React and TypeScript. Responsive, WCAG AA and MIT licensed.',
    keywords: ['horizontal timeline', 'scroll timeline', 'snap timeline', 'timeline cards'],
  },
  'timeline-roadmap': {
    title: 'Roadmap Timeline',
    description:
      'A status-driven roadmap where every item pairs a coloured dot with a worded state badge.',
    customization:
      'Colour is only a hint: each `status` renders a dot and a matching text badge, so state survives colour-blindness and greyscale. Pass `labels` to rename or translate the three states without touching the palette map.',
    seoTitle: 'Product Roadmap Timeline - Free Component',
    seoDescription:
      'A roadmap timeline with shipped, in-progress and planned states, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['roadmap timeline', 'product roadmap', 'status timeline', 'planning timeline'],
  },
  'timeline-activity-feed': {
    title: 'Activity Feed Timeline',
    description:
      'A compact feed of who-did-what, with gradient initial avatars and relative timestamps.',
    customization:
      'Avatars are CSS gradients with initials, so there is no image host to wire up - `initials` falls back to the first two letters of `actor` and `gradient` defaults to blue-indigo. The connector is dropped on the last row so it never dangles.',
    seoTitle: 'Activity Feed Timeline - Free React Component',
    seoDescription:
      'An activity feed timeline with gradient avatars and timestamps, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['activity feed', 'activity timeline', 'feed component', 'audit log timeline'],
  },
  'timeline-changelog': {
    title: 'Changelog Timeline',
    description:
      'A release log with version and date on the left and typed, tagged changes on the right.',
    customization:
      'The two columns are a `md`-only grid, so on a phone the version block simply sits above its change list. Each change carries a worded type tag (Added, Fixed, Changed, Removed); pass `labels` to translate them.',
    seoTitle: 'Changelog Timeline - Free Release Notes Component',
    seoDescription:
      'A changelog timeline with version badges and typed change tags, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['changelog', 'release notes', 'version timeline', 'changelog component'],
  },
  'timeline-milestones-cards': {
    title: 'Milestone Cards Timeline',
    description:
      'A vertical rail of circular icon markers, each paired with a bordered milestone card.',
    customization:
      'The rail sits at `left-5` so it runs through the centre of every 2.5rem marker. Each item takes an optional `icon` node (a check by default), so you can give milestones distinct glyphs.',
    seoTitle: 'Milestone Timeline Cards - Free Component',
    seoDescription:
      'A milestone timeline with icon markers and cards, in Tailwind, React and TypeScript. Responsive, accessible and MIT licensed.',
    keywords: ['milestone timeline', 'timeline cards', 'company milestones', 'icon timeline'],
  },
  'timeline-year-grouped': {
    title: 'Year-Grouped Timeline',
    description:
      'Entries bucketed under sticky year headings that pin while their own group scrolls past.',
    customization:
      'Each year heading is `sticky top-0` with a translucent `backdrop-blur`, so text scrolling underneath stays legible. Group your data into `{ year, items }` buckets and the headings and rails render per section.',
    seoTitle: 'Year Grouped Timeline - Free Sticky Component',
    seoDescription:
      'A timeline grouped by year with sticky headings, in Tailwind, React and TypeScript. Responsive, WCAG AA and MIT licensed.',
    keywords: ['year timeline', 'grouped timeline', 'sticky headings', 'archive timeline'],
  },
  'timeline-progress-line': {
    title: 'Progress Line Timeline',
    description:
      'A step tracker that fills the rail up to the current step and marks each state clearly.',
    customization:
      'Drive it with a single `currentStep` index: earlier steps get a filled check, the current step a ringed dot plus `aria-current="step"`, and later steps a muted outline - colour is never the only signal. The connector below a completed step is filled blue.',
    seoTitle: 'Progress Timeline - Free Step Tracker Component',
    seoDescription:
      'A progress-line timeline with completed, current and upcoming states, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['progress timeline', 'step tracker', 'order tracking', 'progress stepper'],
  },
  'timeline-compact-dense': {
    title: 'Compact Dense Timeline',
    description:
      'A tight event log with an aligned tabular time column and small dots on a slim rail.',
    customization:
      'A fixed `w-16` `tabular-nums` time column keeps timestamps in a rigid line, and the last row’s rail is made transparent so the line stops with the log. Pass `accent` per item to flag a row - e.g. `bg-emerald-500` for a success.',
    seoTitle: 'Compact Timeline Log - Free Dense Component',
    seoDescription:
      'A dense, compact timeline log with aligned timestamps, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['compact timeline', 'dense timeline', 'event log', 'activity log timeline'],
  },
};
