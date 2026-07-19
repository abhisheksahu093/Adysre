import type { ComponentEntry } from './types';

/**
 * Stats & KPIs category.
 *
 * Ten structurally different ways to show numbers, not ten recolours of one
 * card: a bare KPI row, trend cards, sparkline cards, a single hero number,
 * circular rings, a period-over-period grid, icon tiles, a dashboard panel,
 * goal bars and a dark gradient band. Two constraints run through all of them.
 *
 *   1. A stat is a name/value pair, so the semantic home is a `<dl>` - the value
 *      shown first visually with `order-*` while the DOM keeps `dt`-then-`dd`,
 *      so it still reads "Revenue, 48,120" and not "48,120, Revenue".
 *   2. A trend is never encoded by colour alone. Red and green are invisible to
 *      the most common form of colour blindness, so every delta also carries a
 *      direction *arrow* (a shape) and an `sr-only` word ("Increased"/"Decreased").
 *      The colour is the third, redundant channel - never the only one.
 *
 * Grids reflow 1 -> 2 -> 4 columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
 * so four big numbers never get crushed into one unreadable row at 320px.
 */
export const statsComponents: ComponentEntry[] = [
  {
    slug: 'stats-kpi-row',
    category: 'stats',
    tags: ['stats', 'kpi', 'metrics', 'row', 'dashboard'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'KpiItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each stat is a <div> inside a <dl>. The value (dd) is painted above the label
  (dt) with order utilities, but the DOM order stays dt-then-dd so a screen
  reader announces "Monthly revenue, $48,120", not the number stranded first.
-->
<dl class="grid w-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-800">
  <div class="flex flex-col bg-white p-5 dark:bg-gray-900">
    <dt class="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">Monthly revenue</dt>
    <dd class="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">$48,120</dd>
  </div>
  <div class="flex flex-col bg-white p-5 dark:bg-gray-900">
    <dt class="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">Active users</dt>
    <dd class="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">12,480</dd>
  </div>
  <div class="flex flex-col bg-white p-5 dark:bg-gray-900">
    <dt class="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">Conversion</dt>
    <dd class="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">3.8%</dd>
  </div>
  <div class="flex flex-col bg-white p-5 dark:bg-gray-900">
    <dt class="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">Avg. order</dt>
    <dd class="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">$86.40</dd>
  </div>
</dl>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Monthly revenue', value: '$48,120' },
  { label: 'Active users', value: '12,480' },
  { label: 'Conversion', value: '3.8%' },
  { label: 'Avg. order', value: '$86.40' },
];

export function StatsKpiRow({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-800 \${className}\`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col bg-white p-5 dark:bg-gray-900">
          {/* order-* flips the visual stack; the DOM keeps label-then-value. */}
          <dt className="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}`,
      typescript: `export interface KpiItem {
  label: string;
  value: string;
}

export interface StatsKpiRowProps {
  items?: KpiItem[];
  className?: string;
}

const DEFAULT_ITEMS: KpiItem[] = [
  { label: 'Monthly revenue', value: '$48,120' },
  { label: 'Active users', value: '12,480' },
  { label: 'Conversion', value: '3.8%' },
  { label: 'Avg. order', value: '$86.40' },
];

export function StatsKpiRow({ items = DEFAULT_ITEMS, className = '' }: StatsKpiRowProps): JSX.Element {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-gray-800 dark:bg-gray-800 \${className}\`}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col bg-white p-5 dark:bg-gray-900">
          <dt className="order-2 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="order-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-cards-trend',
    category: 'stats',
    tags: ['stats', 'trend', 'delta', 'cards', 'kpi'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'up', labelKey: 'up' },
      { id: 'down', labelKey: 'down' },
    ],
    props: [
      { name: 'items', type: 'TrendItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The delta is a shape + a word + a colour, in that order of importance. The
  arrow SVG encodes direction, the sr-only "Increased/Decreased" states it in
  words, and the green/red is only the third, redundant cue - so the trend still
  reads for a red-green colour-blind user, who is ~8% of men.
-->
<dl class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</dt>
    <dd class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">$48,120</span>
      <span class="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V3M3 6l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="sr-only">Increased by</span>12.5%
      </span>
    </dd>
    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">vs last month</p>
  </div>
  <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Churn</dt>
    <dd class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">2.1%</span>
      <span class="inline-flex items-center gap-1 text-sm font-semibold text-red-600 dark:text-red-400">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3v6M9 6l-3 3-3-3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="sr-only">Decreased by</span>0.4%
      </span>
    </dd>
    <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">vs last month</p>
  </div>
</dl>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Revenue', value: '$48,120', delta: '12.5%', direction: 'up', hint: 'vs last month' },
  { label: 'New users', value: '1,204', delta: '8.2%', direction: 'up', hint: 'vs last month' },
  { label: 'Churn', value: '2.1%', delta: '0.4%', direction: 'down', hint: 'vs last month' },
  { label: 'Refunds', value: '$1,120', delta: '3.1%', direction: 'down', hint: 'vs last month' },
];

export function StatsCardsTrend({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => {
        const up = item.direction === 'up';
        return (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item.value}</span>
              <span className={\`inline-flex items-center gap-1 text-sm font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                {item.delta}
              </span>
            </dd>
            {item.hint ? <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{item.hint}</p> : null}
          </div>
        );
      })}
    </dl>
  );
}`,
      typescript: `export interface TrendItem {
  label: string;
  value: string;
  delta: string;
  /** Shape + word, never colour alone - this is what makes the trend accessible. */
  direction: 'up' | 'down';
  hint?: string;
}

export interface StatsCardsTrendProps {
  items?: TrendItem[];
  className?: string;
}

const DEFAULT_ITEMS: TrendItem[] = [
  { label: 'Revenue', value: '$48,120', delta: '12.5%', direction: 'up', hint: 'vs last month' },
  { label: 'New users', value: '1,204', delta: '8.2%', direction: 'up', hint: 'vs last month' },
  { label: 'Churn', value: '2.1%', delta: '0.4%', direction: 'down', hint: 'vs last month' },
  { label: 'Refunds', value: '$1,120', delta: '3.1%', direction: 'down', hint: 'vs last month' },
];

export function StatsCardsTrend({ items = DEFAULT_ITEMS, className = '' }: StatsCardsTrendProps): JSX.Element {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => {
        const up = item.direction === 'up';
        return (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item.value}</span>
              <span className={\`inline-flex items-center gap-1 text-sm font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                {item.delta}
              </span>
            </dd>
            {item.hint ? <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{item.hint}</p> : null}
          </div>
        );
      })}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-with-sparklines',
    category: 'stats',
    tags: ['stats', 'sparkline', 'svg', 'trend', 'chart'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'up', labelKey: 'up' },
      { id: 'down', labelKey: 'down' },
    ],
    props: [
      { name: 'items', type: 'SparkItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The sparkline is decorative shorthand for a trend the numbers already state, so
  it is aria-hidden. preserveAspectRatio="none" lets the 100x32 viewBox stretch
  to whatever width the card ends up, and vector-effect keeps the stroke 2px wide
  when it does - a scaled SVG otherwise fattens the line.
-->
<dl class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Sessions</dt>
    <dd class="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">18,420</dd>
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" class="mt-3 h-8 w-full text-emerald-500" aria-hidden="true">
      <polyline points="0,26 20,20 40,22 60,12 80,14 100,4" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Bounce rate</dt>
    <dd class="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">41.2%</dd>
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" class="mt-3 h-8 w-full text-red-500" aria-hidden="true">
      <polyline points="0,6 20,10 40,8 60,18 80,20 100,28" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</dl>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Sessions', value: '18,420', direction: 'up', points: [40, 52, 48, 70, 66, 92] },
  { label: 'Signups', value: '1,204', direction: 'up', points: [20, 30, 28, 45, 60, 72] },
  { label: 'Bounce rate', value: '41.2%', direction: 'down', points: [80, 72, 76, 50, 44, 30] },
  { label: 'Latency', value: '128ms', direction: 'down', points: [90, 84, 88, 60, 52, 40] },
];

function sparkPoints(values) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? 100 / (values.length - 1) : 0;
  return values
    .map((v, i) => \`\${(i * step).toFixed(1)},\${(32 - ((v - min) / range) * 32).toFixed(1)}\`)
    .join(' ');
}

export function StatsWithSparklines({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className={\`mt-3 h-8 w-full \${item.direction === 'up' ? 'text-emerald-500' : 'text-red-500'}\`}
            aria-hidden="true"
          >
            <polyline
              points={sparkPoints(item.points)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </dl>
  );
}`,
      typescript: `export interface SparkItem {
  label: string;
  value: string;
  direction: 'up' | 'down';
  /** Raw series; scaled to the 100x32 viewBox at render time. Needs >= 2 points. */
  points: number[];
}

export interface StatsWithSparklinesProps {
  items?: SparkItem[];
  className?: string;
}

const DEFAULT_ITEMS: SparkItem[] = [
  { label: 'Sessions', value: '18,420', direction: 'up', points: [40, 52, 48, 70, 66, 92] },
  { label: 'Signups', value: '1,204', direction: 'up', points: [20, 30, 28, 45, 60, 72] },
  { label: 'Bounce rate', value: '41.2%', direction: 'down', points: [80, 72, 76, 50, 44, 30] },
  { label: 'Latency', value: '128ms', direction: 'down', points: [90, 84, 88, 60, 52, 40] },
];

function sparkPoints(values: number[]): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = values.length > 1 ? 100 / (values.length - 1) : 0;
  return values
    .map((v, i) => \`\${(i * step).toFixed(1)},\${(32 - ((v - min) / range) * 32).toFixed(1)}\`)
    .join(' ');
}

export function StatsWithSparklines({ items = DEFAULT_ITEMS, className = '' }: StatsWithSparklinesProps): JSX.Element {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          <dd className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
          <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className={\`mt-3 h-8 w-full \${item.direction === 'up' ? 'text-emerald-500' : 'text-red-500'}\`}
            aria-hidden="true"
          >
            <polyline
              points={sparkPoints(item.points)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-big-number-hero',
    category: 'stats',
    tags: ['stats', 'hero', 'big-number', 'metric', 'headline'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'up', labelKey: 'up' },
      { id: 'plain', labelKey: 'plain' },
    ],
    props: [
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'delta', type: 'string', descriptionKey: 'delta' },
      { name: 'direction', type: "'up' | 'down'", default: "'up'", descriptionKey: 'direction' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center dark:border-gray-800 dark:bg-gray-900">
  <dl>
    <dt class="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Total processed</dt>
    <dd class="mt-3 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">$4.2M</dd>
  </dl>
  <p class="mx-auto mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
    <svg viewBox="0 0 12 12" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V3M3 6l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span class="sr-only">Increased by</span>18% this quarter
  </p>
  <p class="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Across every workspace since launch, settled and reconciled in real time.
  </p>
</section>`,
      react: `export function StatsBigNumberHero({
  value,
  label,
  description,
  delta,
  direction = 'up',
  className = '',
}) {
  const up = direction === 'up';
  return (
    <section className={\`mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <dl>
        <dt className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-3 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">{value}</dd>
      </dl>
      {delta ? (
        <p className={\`mx-auto mt-3 inline-flex items-center gap-1.5 text-sm font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
          {delta}
        </p>
      ) : null}
      {description ? (
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
      ) : null}
    </section>
  );
}`,
      typescript: `export interface StatsBigNumberHeroProps {
  value: string;
  label: string;
  description?: string;
  delta?: string;
  direction?: 'up' | 'down';
  className?: string;
}

export function StatsBigNumberHero({
  value,
  label,
  description,
  delta,
  direction = 'up',
  className = '',
}: StatsBigNumberHeroProps): JSX.Element {
  const up = direction === 'up';
  return (
    <section className={\`mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <dl>
        <dt className="text-sm font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</dt>
        <dd className="mt-3 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">{value}</dd>
      </dl>
      {delta ? (
        <p className={\`mx-auto mt-3 inline-flex items-center gap-1.5 text-sm font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
          {delta}
        </p>
      ) : null}
      {description ? (
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
      ) : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'stats-progress-rings',
    category: 'stats',
    tags: ['stats', 'progress', 'ring', 'svg', 'circular'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'quad', labelKey: 'quad' },
      { id: 'duo', labelKey: 'duo' },
    ],
    props: [
      { name: 'items', type: 'RingItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A ring is a circle whose stroke-dasharray is its full circumference and whose
  stroke-dashoffset hides the unfilled remainder. It is rotated -90deg so the arc
  starts at 12 o'clock. role="progressbar" + aria-valuenow makes it a real
  measured value to assistive tech; the centred percentage is the sighted copy.
-->
<dl class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <div class="flex flex-col items-center">
    <div class="relative" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="Storage used">
      <svg viewBox="0 0 88 88" class="h-24 w-24 -rotate-90 text-blue-600 dark:text-blue-400">
        <circle cx="44" cy="44" r="36" fill="none" stroke="currentColor" stroke-width="8" class="text-gray-200 dark:text-gray-800"/>
        <circle cx="44" cy="44" r="36" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-dasharray="226.19" stroke-dashoffset="63.33"/>
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-gray-100">72%</span>
    </div>
    <dt class="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">Storage used</dt>
  </div>
</dl>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Storage used', value: 72, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Uptime', value: 99, color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Quota', value: 48, color: 'text-violet-600 dark:text-violet-400' },
  { label: 'Coverage', value: 86, color: 'text-amber-600 dark:text-amber-400' },
];

const R = 36;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function StatsProgressRings({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, item.value));
        const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
        return (
          <div key={item.label} className="flex flex-col items-center">
            <div
              className={\`relative \${item.color}\`}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={item.label}
            >
              <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90">
                <circle cx="44" cy="44" r={R} fill="none" strokeWidth={8} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                <circle
                  cx="44"
                  cy="44"
                  r={R}
                  fill="none"
                  strokeWidth={8}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-gray-100">{pct}%</span>
            </div>
            <dt className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          </div>
        );
      })}
    </dl>
  );
}`,
      typescript: `export interface RingItem {
  label: string;
  /** 0-100; clamped before it drives the arc. */
  value: number;
  /** Tailwind text colour class(es) applied to the ring via currentColor. */
  color: string;
}

export interface StatsProgressRingsProps {
  items?: RingItem[];
  className?: string;
}

const DEFAULT_ITEMS: RingItem[] = [
  { label: 'Storage used', value: 72, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Uptime', value: 99, color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Quota', value: 48, color: 'text-violet-600 dark:text-violet-400' },
  { label: 'Coverage', value: 86, color: 'text-amber-600 dark:text-amber-400' },
];

const R = 36;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function StatsProgressRings({ items = DEFAULT_ITEMS, className = '' }: StatsProgressRingsProps): JSX.Element {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, item.value));
        const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
        return (
          <div key={item.label} className="flex flex-col items-center">
            <div
              className={\`relative \${item.color}\`}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={item.label}
            >
              <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90">
                <circle cx="44" cy="44" r={R} fill="none" strokeWidth={8} stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                <circle
                  cx="44"
                  cy="44"
                  r={R}
                  fill="none"
                  strokeWidth={8}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={offset}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-900 dark:text-gray-100">{pct}%</span>
            </div>
            <dt className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
          </div>
        );
      })}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-comparison-grid',
    category: 'stats',
    tags: ['stats', 'comparison', 'period', 'grid', 'delta'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'ComparisonItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<dl class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</dt>
    <dd class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$48,120</dd>
    <p class="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
      <span class="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V3M3 6l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="sr-only">Increased by</span>12.5%
      </span>
      vs $42,760 last period
    </p>
  </div>
</dl>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Revenue', value: '$48,120', previous: '$42,760', delta: '12.5%', direction: 'up' },
  { label: 'Orders', value: '1,204', previous: '1,110', delta: '8.5%', direction: 'up' },
  { label: 'Refund rate', value: '1.8%', previous: '2.3%', delta: '0.5%', direction: 'down' },
  { label: 'Support load', value: '312', previous: '344', delta: '9.3%', direction: 'down' },
];

export function StatsComparisonGrid({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => {
        const up = item.direction === 'up';
        return (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className={\`inline-flex items-center gap-1 font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                {item.delta}
              </span>
              vs {item.previous} last period
            </p>
          </div>
        );
      })}
    </dl>
  );
}`,
      typescript: `export interface ComparisonItem {
  label: string;
  value: string;
  previous: string;
  delta: string;
  direction: 'up' | 'down';
}

export interface StatsComparisonGridProps {
  items?: ComparisonItem[];
  className?: string;
}

const DEFAULT_ITEMS: ComparisonItem[] = [
  { label: 'Revenue', value: '$48,120', previous: '$42,760', delta: '12.5%', direction: 'up' },
  { label: 'Orders', value: '1,204', previous: '1,110', delta: '8.5%', direction: 'up' },
  { label: 'Refund rate', value: '1.8%', previous: '2.3%', delta: '0.5%', direction: 'down' },
  { label: 'Support load', value: '312', previous: '344', delta: '9.3%', direction: 'down' },
];

export function StatsComparisonGrid({ items = DEFAULT_ITEMS, className = '' }: StatsComparisonGridProps): JSX.Element {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => {
        const up = item.direction === 'up';
        return (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className={\`inline-flex items-center gap-1 font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                {item.delta}
              </span>
              vs {item.previous} last period
            </p>
          </div>
        );
      })}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-icon-tiles',
    category: 'stats',
    tags: ['stats', 'icon', 'tiles', 'metrics', 'grid'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'soft', labelKey: 'soft' },
    ],
    props: [
      { name: 'items', type: 'IconTileItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The icon is inside its coloured badge as decoration (aria-hidden) - it repeats
  the label, it does not replace it. Meaning always lives in the dt/dd text.
-->
<dl class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l3 8 4-16 3 8h4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <div class="min-w-0">
      <dt class="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total visits</dt>
      <dd class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">128,940</dd>
    </div>
  </div>
</dl>`,
      react: `const ICONS = {
  pulse: 'M3 12h4l3 8 4-16 3 8h4',
  users: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M21 20v-2a4 4 0 0 0-3-3.87',
  cart: 'M3 3h2l2 12h11l2-8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  star: 'M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9z',
};

const DEFAULT_ITEMS = [
  { label: 'Total visits', value: '128,940', icon: 'pulse', tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { label: 'Members', value: '8,412', icon: 'users', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { label: 'Orders', value: '2,180', icon: 'cart', tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  { label: 'Reviews', value: '4.9/5', icon: 'star', tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
];

export function StatsIconTiles({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <span className={\`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg \${item.tone}\`} aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d={ICONS[item.icon]} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}`,
      typescript: `export type IconTileGlyph = 'pulse' | 'users' | 'cart' | 'star';

export interface IconTileItem {
  label: string;
  value: string;
  icon: IconTileGlyph;
  /** Tailwind background + text classes for the icon badge. */
  tone: string;
}

export interface StatsIconTilesProps {
  items?: IconTileItem[];
  className?: string;
}

const ICONS: Record<IconTileGlyph, string> = {
  pulse: 'M3 12h4l3 8 4-16 3 8h4',
  users: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M21 20v-2a4 4 0 0 0-3-3.87',
  cart: 'M3 3h2l2 12h11l2-8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  star: 'M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9z',
};

const DEFAULT_ITEMS: IconTileItem[] = [
  { label: 'Total visits', value: '128,940', icon: 'pulse', tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { label: 'Members', value: '8,412', icon: 'users', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { label: 'Orders', value: '2,180', icon: 'cart', tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  { label: 'Reviews', value: '4.9/5', icon: 'star', tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
];

export function StatsIconTiles({ items = DEFAULT_ITEMS, className = '' }: StatsIconTilesProps): JSX.Element {
  return (
    <dl className={\`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 \${className}\`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <span className={\`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg \${item.tone}\`} aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d={ICONS[item.icon]} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-dashboard-summary',
    category: 'stats',
    tags: ['stats', 'dashboard', 'summary', 'panel', 'kpi'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'titled', labelKey: 'titled' },
      { id: 'plain', labelKey: 'plain' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Overview'", descriptionKey: 'title' },
      { name: 'caption', type: 'string', descriptionKey: 'caption' },
      { name: 'items', type: 'SummaryItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Overview</h3>
    <p class="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
  </div>
  <dl class="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 dark:divide-gray-800">
    <div class="p-5">
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</dt>
      <dd class="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">$48,120</dd>
      <p class="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9V3M3 6l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="sr-only">Increased by</span>12.5%
      </p>
    </div>
  </dl>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Revenue', value: '$48,120', delta: '12.5%', direction: 'up' },
  { label: 'Orders', value: '1,204', delta: '8.2%', direction: 'up' },
  { label: 'Avg. order', value: '$86.40', delta: '1.1%', direction: 'down' },
  { label: 'Refunds', value: '$1,120', delta: '3.1%', direction: 'down' },
];

export function StatsDashboardSummary({
  title = 'Overview',
  caption,
  items = DEFAULT_ITEMS,
  className = '',
}) {
  return (
    <section className={\`w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {caption ? <p className="text-xs text-gray-500 dark:text-gray-400">{caption}</p> : null}
      </div>
      <dl className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 dark:divide-gray-800">
        {items.map((item) => {
          const up = item.direction === 'up';
          return (
            <div key={item.label} className="p-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
              {item.delta ? (
                <p className={\`mt-1 inline-flex items-center gap-1 text-xs font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                  {item.delta}
                </p>
              ) : null}
            </div>
          );
        })}
      </dl>
    </section>
  );
}`,
      typescript: `export interface SummaryItem {
  label: string;
  value: string;
  delta?: string;
  direction?: 'up' | 'down';
}

export interface StatsDashboardSummaryProps {
  title?: string;
  caption?: string;
  items?: SummaryItem[];
  className?: string;
}

const DEFAULT_ITEMS: SummaryItem[] = [
  { label: 'Revenue', value: '$48,120', delta: '12.5%', direction: 'up' },
  { label: 'Orders', value: '1,204', delta: '8.2%', direction: 'up' },
  { label: 'Avg. order', value: '$86.40', delta: '1.1%', direction: 'down' },
  { label: 'Refunds', value: '$1,120', delta: '3.1%', direction: 'down' },
];

export function StatsDashboardSummary({
  title = 'Overview',
  caption,
  items = DEFAULT_ITEMS,
  className = '',
}: StatsDashboardSummaryProps): JSX.Element {
  return (
    <section className={\`w-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {caption ? <p className="text-xs text-gray-500 dark:text-gray-400">{caption}</p> : null}
      </div>
      <dl className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 dark:divide-gray-800">
        {items.map((item) => {
          const up = item.direction === 'up';
          return (
            <div key={item.label} className="p-5">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
              {item.delta ? (
                <p className={\`mt-1 inline-flex items-center gap-1 text-xs font-semibold \${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}\`}>
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d={up ? 'M6 9V3M3 6l3-3 3 3' : 'M6 3v6M9 6l-3 3-3-3'} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only">{up ? 'Increased by' : 'Decreased by'}</span>
                  {item.delta}
                </p>
              ) : null}
            </div>
          );
        })}
      </dl>
    </section>
  );
}`,
    },
  },
  {
    slug: 'stats-goal-progress',
    category: 'stats',
    tags: ['stats', 'goal', 'progress', 'target', 'bar'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reached', labelKey: 'reached' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'GoalItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each bar is a real progressbar: aria-valuenow is the current value and
  aria-valuemax is the target, so the ratio is exposed as data, not implied by
  pixels. The fill width is the only inline style - it is a computed value, not a
  colour, which is why it cannot be a static utility class.
-->
<dl class="w-full space-y-6">
  <div>
    <div class="flex items-baseline justify-between gap-3">
      <dt class="text-sm font-medium text-gray-700 dark:text-gray-300">New signups</dt>
      <dd class="text-sm text-gray-500 tabular-nums dark:text-gray-400"><span class="font-semibold text-gray-900 dark:text-gray-100">740</span> / 1,000</dd>
    </div>
    <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" role="progressbar" aria-valuenow="740" aria-valuemin="0" aria-valuemax="1000" aria-label="New signups">
      <div class="h-full rounded-full bg-blue-600 dark:bg-blue-500" style="width:74%"></div>
    </div>
  </div>
</dl>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'New signups', value: 740, target: 1000 },
  { label: 'MRR target', value: 42, target: 50, unit: 'k' },
  { label: 'Tickets closed', value: 318, target: 300 },
  { label: 'Onboarding', value: 56, target: 100, unit: '%' },
];

export function StatsGoalProgress({ items = DEFAULT_ITEMS, className = '' }) {
  const fmt = (n) => n.toLocaleString('en-US');
  return (
    <dl className={\`w-full space-y-6 \${className}\`}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, (item.value / item.target) * 100));
        const reached = item.value >= item.target;
        const unit = item.unit ?? '';
        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</dt>
              <dd className="text-sm text-gray-500 tabular-nums dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{fmt(item.value)}{unit}</span> / {fmt(item.target)}{unit}
              </dd>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
              role="progressbar"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={item.target}
              aria-label={item.label}
            >
              <div
                className={\`h-full rounded-full \${reached ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'}\`}
                style={{ width: \`\${pct}%\` }}
              />
            </div>
          </div>
        );
      })}
    </dl>
  );
}`,
      typescript: `export interface GoalItem {
  label: string;
  value: number;
  target: number;
  /** Suffix appended to both numbers, e.g. '%' or 'k'. */
  unit?: string;
}

export interface StatsGoalProgressProps {
  items?: GoalItem[];
  className?: string;
}

const DEFAULT_ITEMS: GoalItem[] = [
  { label: 'New signups', value: 740, target: 1000 },
  { label: 'MRR target', value: 42, target: 50, unit: 'k' },
  { label: 'Tickets closed', value: 318, target: 300 },
  { label: 'Onboarding', value: 56, target: 100, unit: '%' },
];

export function StatsGoalProgress({ items = DEFAULT_ITEMS, className = '' }: StatsGoalProgressProps): JSX.Element {
  const fmt = (n: number): string => n.toLocaleString('en-US');
  return (
    <dl className={\`w-full space-y-6 \${className}\`}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, (item.value / item.target) * 100));
        const reached = item.value >= item.target;
        const unit = item.unit ?? '';
        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</dt>
              <dd className="text-sm text-gray-500 tabular-nums dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{fmt(item.value)}{unit}</span> / {fmt(item.target)}{unit}
              </dd>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
              role="progressbar"
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={item.target}
              aria-label={item.label}
            >
              <div
                className={\`h-full rounded-full \${reached ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-blue-600 dark:bg-blue-500'}\`}
                style={{ width: \`\${pct}%\` }}
              />
            </div>
          </div>
        );
      })}
    </dl>
  );
}`,
    },
  },
  {
    slug: 'stats-dark-gradient',
    category: 'stats',
    tags: ['stats', 'dark', 'gradient', 'band', 'metrics'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'indigo', labelKey: 'indigo' },
      { id: 'plain', labelKey: 'plain' },
    ],
    props: [
      { name: 'items', type: 'DarkStatItem[]', required: true, descriptionKey: 'items' },
      { name: 'eyebrow', type: 'string', descriptionKey: 'eyebrow' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  This band paints its own dark surface and gradient, so it looks identical on a
  light or dark page - there is nothing here that inherits the theme and hence no
  dark: variants. The gradient stops are dark enough that the near-white values
  clear AA everywhere on them.
-->
<section class="w-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 px-6 py-10 sm:px-10">
  <p class="text-center text-xs font-semibold uppercase tracking-widest text-blue-300">By the numbers</p>
  <dl class="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <div class="flex flex-col text-center">
      <dd class="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">99.98%</dd>
      <dt class="order-2 mt-1 text-sm text-gray-400">Uptime SLA</dt>
    </div>
    <div class="flex flex-col text-center">
      <dd class="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">140+</dd>
      <dt class="order-2 mt-1 text-sm text-gray-400">Countries served</dt>
    </div>
  </dl>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { label: 'Uptime SLA', value: '99.98%' },
  { label: 'Countries served', value: '140+' },
  { label: 'Requests / day', value: '2.4B' },
  { label: 'Avg. response', value: '48ms' },
];

export function StatsDarkGradient({ items = DEFAULT_ITEMS, eyebrow, className = '' }) {
  return (
    <section className={\`w-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 px-6 py-10 sm:px-10 \${className}\`}>
      {eyebrow ? (
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-300">{eyebrow}</p>
      ) : null}
      <dl className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col text-center">
            <dd className="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{item.value}</dd>
            <dt className="order-2 mt-1 text-sm text-gray-400">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
      typescript: `export interface DarkStatItem {
  label: string;
  value: string;
}

export interface StatsDarkGradientProps {
  items?: DarkStatItem[];
  eyebrow?: string;
  className?: string;
}

const DEFAULT_ITEMS: DarkStatItem[] = [
  { label: 'Uptime SLA', value: '99.98%' },
  { label: 'Countries served', value: '140+' },
  { label: 'Requests / day', value: '2.4B' },
  { label: 'Avg. response', value: '48ms' },
];

export function StatsDarkGradient({ items = DEFAULT_ITEMS, eyebrow, className = '' }: StatsDarkGradientProps): JSX.Element {
  return (
    <section className={\`w-full rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-950 px-6 py-10 sm:px-10 \${className}\`}>
      {eyebrow ? (
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-300">{eyebrow}</p>
      ) : null}
      <dl className="mx-auto mt-6 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col text-center">
            <dd className="order-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{item.value}</dd>
            <dt className="order-2 mt-1 text-sm text-gray-400">{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
    },
  },
];
