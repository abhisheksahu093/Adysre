import type { ComponentContentMap } from '../types';

/** English prose for the stats & KPIs category. Keys are component slugs. */
export const statsContent: ComponentContentMap = {
  'stats-kpi-row': {
    title: 'KPI Row',
    description: 'A bare row of headline metrics in a `<dl>` that reflows from one column to four.',
    customization:
      'Each metric shows the value above the label via `order-*` while the DOM keeps `dt`-then-`dd`, so it still reads "Monthly revenue, $48,120". The grid steps 1 -> 2 -> 4 columns so four big numbers never crush into one row at 320px.',
    seoTitle: 'KPI Stats Row - Free Tailwind CSS Component',
    seoDescription:
      'A responsive row of key metrics in a semantic definition list, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['kpi row', 'stats row', 'metrics component', 'dashboard stats'],
  },
  'stats-cards-trend': {
    title: 'Trend Stat Cards',
    description: 'KPI cards where each delta pairs a direction arrow and a hidden word with its colour.',
    customization:
      'The trend is never colour alone: an arrow SVG encodes direction, an `sr-only` "Increased/Decreased" states it, and green/red is only the third, redundant cue - so it reads for a red-green colour-blind user. Pass `direction` per item to flip both arrow and colour.',
    seoTitle: 'Trend Stat Cards - Free Tailwind CSS Component',
    seoDescription:
      'Accessible KPI cards with up/down deltas encoded by shape and text, not colour alone, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['trend cards', 'kpi delta', 'stat cards', 'metric trend'],
  },
  'stats-with-sparklines': {
    title: 'Stats With Sparklines',
    description: 'Metric cards with an inline SVG sparkline drawn from each series.',
    customization:
      'The sparkline is `aria-hidden` decoration for a trend the number already states; `preserveAspectRatio="none"` stretches the 100x32 viewBox to any card width while `vector-effect="non-scaling-stroke"` keeps the line 2px. Feed `points` (>= 2 values) and it scales itself.',
    seoTitle: 'Stat Cards With Sparklines - Free React Component',
    seoDescription:
      'KPI cards with inline SVG sparklines computed from your data, in Tailwind, React and TypeScript. Responsive and MIT licensed.',
    keywords: ['sparkline stats', 'inline chart', 'svg sparkline', 'metric cards'],
  },
  'stats-big-number-hero': {
    title: 'Big Number Hero',
    description: 'A single dominant metric with a label, optional delta and supporting copy, centred.',
    customization:
      'The label is the `dt` and the value the `dd`, so the pair reads as one stat; the optional delta carries an arrow and an `sr-only` word so the trend is not colour alone. The number scales `text-5xl` to `text-6xl` from `sm:` up.',
    seoTitle: 'Big Number Stat Hero - Free Tailwind CSS Component',
    seoDescription:
      'A single hero metric with label, trend and copy, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['big number', 'stat hero', 'headline metric', 'kpi hero'],
  },
  'stats-progress-rings': {
    title: 'Progress Rings',
    description: 'A grid of SVG circular progress rings, each a real `progressbar` with a centred percentage.',
    customization:
      'Each ring is a circle whose `stroke-dasharray` is its circumference and whose `stroke-dashoffset` hides the remainder, rotated -90deg to start at 12 o\'clock. The value is clamped 0-100 and exposed via `role="progressbar"` + `aria-valuenow`; set a Tailwind `color` class per ring to tint the arc through `currentColor`.',
    seoTitle: 'SVG Progress Rings - Free Tailwind CSS Component',
    seoDescription:
      'A responsive grid of circular SVG progress rings with accessible progressbar semantics, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['progress ring', 'circular progress', 'svg ring', 'radial stats'],
  },
  'stats-comparison-grid': {
    title: 'Comparison Grid',
    description: 'Period-over-period stat cards showing the current value, delta and the prior figure.',
    customization:
      'Each card states the current value, an accessible delta (arrow + hidden word + colour) and the "vs X last period" baseline so the change is legible without inference. The grid reflows 1 -> 2 -> 4 columns.',
    seoTitle: 'Period Comparison Stats - Free Tailwind CSS Component',
    seoDescription:
      'Period-over-period KPI cards with accessible deltas and prior-value baselines, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['comparison stats', 'period over period', 'kpi comparison', 'vs last period'],
  },
  'stats-icon-tiles': {
    title: 'Icon Stat Tiles',
    description: 'Horizontal tiles pairing a coloured icon badge with a metric value and label.',
    customization:
      'The icon sits in its `aria-hidden` badge as decoration - meaning always lives in the `dt`/`dd` text, never the glyph. Pick an `icon` from the built-in set and a `tone` for the badge; the label truncates and the tile never overflows a phone.',
    seoTitle: 'Icon Stat Tiles - Free Tailwind CSS Component',
    seoDescription:
      'Metric tiles with coloured icon badges in a responsive grid, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['icon stats', 'stat tiles', 'metric tiles', 'kpi icons'],
  },
  'stats-dashboard-summary': {
    title: 'Dashboard Summary Panel',
    description: 'A titled panel wrapping a divided row of KPIs with optional deltas.',
    customization:
      'A header with `title` and `caption` sits over a `<dl>` whose cells are separated by `divide-*` - dividers switch from horizontal on mobile to vertical from `sm:` up as the row reflows 1 -> 2 -> 4. Each delta stays accessible via arrow plus hidden word.',
    seoTitle: 'Dashboard Summary Panel - Free Tailwind CSS Component',
    seoDescription:
      'A titled KPI summary panel with divided, responsive stat cells, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['dashboard summary', 'stats panel', 'kpi panel', 'overview card'],
  },
  'stats-goal-progress': {
    title: 'Goal Progress Bars',
    description: 'Labelled progress bars showing current value against a target with an accessible ratio.',
    customization:
      'Each bar is a real `progressbar` whose `aria-valuenow` is the value and `aria-valuemax` is the target, so the ratio is data rather than pixels. The fill width is the only inline style because it is a computed value; the bar turns emerald once the goal is reached. Add a `unit` suffix like `%` or `k`.',
    seoTitle: 'Goal Progress Bars - Free Tailwind CSS Component',
    seoDescription:
      'Accessible goal-vs-target progress bars with computed fills, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['goal progress', 'target bar', 'progress bar stats', 'kpi goal'],
  },
  'stats-dark-gradient': {
    title: 'Dark Gradient Stats Band',
    description: 'A dark gradient band of centred metrics that paints its own surface, no `dark:` variants.',
    customization:
      'The band paints its own `bg-gradient-to-br` dark surface so it looks identical on a light or dark page and needs no `dark:` variants; the stops are dark enough that near-white values clear AA everywhere. Values sit above labels via `order-*` while the DOM keeps reading order.',
    seoTitle: 'Dark Gradient Stats Band - Free Tailwind CSS Component',
    seoDescription:
      'A dark gradient band of headline metrics that reflows 1 to 4 columns, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['dark stats', 'gradient stats', 'stats band', 'metrics section'],
  },
};
