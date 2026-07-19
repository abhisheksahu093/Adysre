import type { ComponentEntry } from './types';

/**
 * Timeline category.
 *
 * Ten structurally different timelines, not ten recolours of one rail: a plain
 * vertical stack, an alternating two-side layout, a horizontal scroller, a
 * roadmap keyed on status, an activity feed, a changelog, milestone cards, a
 * year-grouped list, a progress line and a dense log. The shared constraint is
 * the rail: a vertical line drawn with `border-s`/`-start-*` so it survives RTL,
 * and - for anything that alternates or scrolls - a layout that must fall back
 * to a single readable column at 320px. The alternating layout in particular is
 * a md-and-up enhancement; its base state is one column, because two half-width
 * cards straddling a centre line is unreadable on a phone.
 */
export const timelineComponents: ComponentEntry[] = [
  {
    slug: 'timeline-vertical-basic',
    category: 'timeline',
    tags: ['timeline', 'vertical', 'history', 'steps', 'list'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1840, copies: 402, downloads: 96 },
    props: [
      { name: 'items', type: 'TimelineItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The rail is the list's own inline-start border, so it flips with the document
  direction; the dot is pulled onto it with -start-1.5 (half its width). Each
  dot is absolutely positioned but has no top set: with no offset an absolute
  box keeps the vertical spot it would have had in flow, so it tracks its <li>.
-->
<ol class="relative mx-auto w-full max-w-2xl border-s border-gray-200 dark:border-gray-800">
  <li class="ms-6 pb-8 last:pb-0">
    <span class="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
    <time class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">March 2026</time>
    <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Series A closed</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Raised $12M to grow the platform and support teams.</p>
  </li>
  <li class="ms-6 pb-8 last:pb-0">
    <span class="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
    <time class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">May 2026</time>
    <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Shipped v2</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">A full rebuild of the editor and a new sync engine.</p>
  </li>
  <li class="ms-6 pb-8 last:pb-0">
    <span class="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
    <time class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">July 2026</time>
    <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">10,000 teams</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Crossed ten thousand active workspaces worldwide.</p>
  </li>
</ol>`,
      react: `export function TimelineVerticalBasic({ items, className = '' }) {
  return (
    <ol className={\`relative mx-auto w-full max-w-2xl border-s border-gray-200 dark:border-gray-800 \${className}\`}>
      {items.map((item, i) => (
        <li key={i} className="ms-6 pb-8 last:pb-0">
          <span
            className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
            aria-hidden="true"
          />
          <time className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {item.time}
          </time>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
          {item.description ? (
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface TimelineItem {
  /** Short label rendered in the <time> slot, e.g. "March 2026". */
  time: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface TimelineVerticalBasicProps {
  items: TimelineItem[];
  className?: string;
}

export function TimelineVerticalBasic({
  items,
  className = '',
}: TimelineVerticalBasicProps): JSX.Element {
  return (
    <ol className={\`relative mx-auto w-full max-w-2xl border-s border-gray-200 dark:border-gray-800 \${className}\`}>
      {items.map((item, i) => (
        <li key={i} className="ms-6 pb-8 last:pb-0">
          {/* No top offset: the absolutely positioned dot keeps its in-flow
              vertical spot, so it stays level with this row's <time>. */}
          <span
            className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
            aria-hidden="true"
          />
          <time className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {item.time}
          </time>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
          {item.description ? (
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'timeline-alternating',
    category: 'timeline',
    tags: ['timeline', 'alternating', 'zigzag', 'responsive', 'vertical'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2210, copies: 588, downloads: 141 },
    props: [
      { name: 'items', type: 'AlternatingItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Single column is the base layout; the left/right alternation is a md-and-up
  enhancement. On a phone the rail is pinned to the left and every row clears it
  with ps-12 - two half-width cards straddling a centre line is unreadable at
  320px. From md the rail centres and each row becomes a 2-col grid, with the
  content dropped into column 1 (right-aligned toward the line) or column 2.
-->
<ol class="relative mx-auto w-full max-w-3xl">
  <span class="absolute bottom-2 top-2 left-4 w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2 dark:bg-gray-800" aria-hidden="true"></span>

  <li class="relative mb-8 ps-12 last:mb-0 md:grid md:grid-cols-2 md:gap-x-10 md:ps-0">
    <span class="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 md:left-1/2 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
    <div class="md:col-start-1 md:text-right">
      <time class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">2019</time>
      <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Founded</h3>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Two people, one laptop, a very long to-do list.</p>
    </div>
  </li>

  <li class="relative mb-8 ps-12 last:mb-0 md:grid md:grid-cols-2 md:gap-x-10 md:ps-0">
    <span class="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 md:left-1/2 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
    <div class="md:col-start-2">
      <time class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">2022</time>
      <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">First 1,000 customers</h3>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Word of mouth did what the ad budget could not.</p>
    </div>
  </li>

  <li class="relative mb-8 ps-12 last:mb-0 md:grid md:grid-cols-2 md:gap-x-10 md:ps-0">
    <span class="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 md:left-1/2 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
    <div class="md:col-start-1 md:text-right">
      <time class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">2026</time>
      <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Global launch</h3>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Now serving teams in over sixty countries.</p>
    </div>
  </li>
</ol>`,
      react: `export function TimelineAlternating({ items, className = '' }) {
  return (
    <ol className={\`relative mx-auto w-full max-w-3xl \${className}\`}>
      <span
        className="absolute bottom-2 top-2 left-4 w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2 dark:bg-gray-800"
        aria-hidden="true"
      />
      {items.map((item, i) => (
        <li
          key={i}
          className="relative mb-8 ps-12 last:mb-0 md:grid md:grid-cols-2 md:gap-x-10 md:ps-0"
        >
          <span
            className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 md:left-1/2 dark:border-gray-950 dark:bg-blue-500"
            aria-hidden="true"
          />
          <div className={i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}>
            <time className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {item.time}
            </time>
            <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface AlternatingItem {
  time: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface TimelineAlternatingProps {
  items: AlternatingItem[];
  className?: string;
}

export function TimelineAlternating({
  items,
  className = '',
}: TimelineAlternatingProps): JSX.Element {
  return (
    <ol className={\`relative mx-auto w-full max-w-3xl \${className}\`}>
      {/* Rail: left on phones, centred from md up. */}
      <span
        className="absolute bottom-2 top-2 left-4 w-px bg-gray-200 md:left-1/2 md:-translate-x-1/2 dark:bg-gray-800"
        aria-hidden="true"
      />
      {items.map((item, i) => (
        <li
          key={i}
          className="relative mb-8 ps-12 last:mb-0 md:grid md:grid-cols-2 md:gap-x-10 md:ps-0"
        >
          <span
            className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 md:left-1/2 dark:border-gray-950 dark:bg-blue-500"
            aria-hidden="true"
          />
          {/* Even rows sit in column 1 (right-aligned toward the line), odd in
              column 2. Below md both classes are inert and everything stacks. */}
          <div className={i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}>
            <time className="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {item.time}
            </time>
            <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'timeline-horizontal-scroll',
    category: 'timeline',
    tags: ['timeline', 'horizontal', 'scroll', 'snap', 'cards'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1590, copies: 351, downloads: 82 },
    props: [
      { name: 'items', type: 'HScrollItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A horizontal rail cannot wrap, so it scrolls: the inner list is min-w-max and
  the wrapper owns overflow-x-auto with scroll snapping. Fixed-width cards keep
  the row from collapsing at 320px - the page never scrolls sideways, only this
  strip does. The connector line is inset-x so it stops at the first and last
  card rather than bleeding to the scroll edges.
-->
<div class="w-full overflow-x-auto pb-4">
  <ol class="relative flex min-w-max snap-x snap-mandatory gap-4 px-1">
    <span class="pointer-events-none absolute inset-x-4 top-2 h-px bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>

    <li class="relative w-60 shrink-0 snap-start pt-6">
      <span class="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <time class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Q1</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Discovery</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Interviews, research and a very messy whiteboard.</p>
      </div>
    </li>

    <li class="relative w-60 shrink-0 snap-start pt-6">
      <span class="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <time class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Q2</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Prototype</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">The first thing you could actually click.</p>
      </div>
    </li>

    <li class="relative w-60 shrink-0 snap-start pt-6">
      <span class="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <time class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Q3</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Beta</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Fifty teams, endless feedback, zero regrets.</p>
      </div>
    </li>

    <li class="relative w-60 shrink-0 snap-start pt-6">
      <span class="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <time class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Q4</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Launch</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Doors open, coffee cold, dashboards green.</p>
      </div>
    </li>
  </ol>
</div>`,
      react: `export function TimelineHorizontalScroll({ items, className = '' }) {
  return (
    <div className={\`w-full overflow-x-auto pb-4 \${className}\`}>
      <ol className="relative flex min-w-max snap-x snap-mandatory gap-4 px-1">
        <span
          className="pointer-events-none absolute inset-x-4 top-2 h-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />
        {items.map((item, i) => (
          <li key={i} className="relative w-60 shrink-0 snap-start pt-6">
            <span
              className="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
              aria-hidden="true"
            />
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <time className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {item.time}
              </time>
              <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HScrollItem {
  time: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface TimelineHorizontalScrollProps {
  items: HScrollItem[];
  className?: string;
}

export function TimelineHorizontalScroll({
  items,
  className = '',
}: TimelineHorizontalScrollProps): JSX.Element {
  return (
    <div className={\`w-full overflow-x-auto pb-4 \${className}\`}>
      {/* min-w-max forces the row past the wrapper, so only this strip scrolls
          sideways - never the page. */}
      <ol className="relative flex min-w-max snap-x snap-mandatory gap-4 px-1">
        <span
          className="pointer-events-none absolute inset-x-4 top-2 h-px bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
        />
        {items.map((item, i) => (
          <li key={i} className="relative w-60 shrink-0 snap-start pt-6">
            <span
              className="absolute left-4 top-2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
              aria-hidden="true"
            />
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <time className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {item.time}
              </time>
              <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}`,
    },
  },
  {
    slug: 'timeline-roadmap',
    category: 'timeline',
    tags: ['timeline', 'roadmap', 'status', 'planning', 'product'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1980, copies: 476, downloads: 118 },
    props: [
      { name: 'items', type: 'RoadmapItem[]', required: true, descriptionKey: 'items' },
      { name: 'labels', type: 'Record<RoadmapStatus, string>', descriptionKey: 'labels' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Status drives colour, and colour never carries the meaning alone: every dot is
  paired with a text badge ("Shipped", "In progress", "Planned"), so the state
  is legible to anyone who cannot tell emerald from blue. The connector is the
  flex-grow spacer under each marker and is simply omitted on the last row.
-->
<ol class="mx-auto w-full max-w-xl">
  <li class="relative flex gap-4 pb-8">
    <div class="flex flex-col items-center">
      <span class="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-gray-950" aria-hidden="true"></span>
      <span class="mt-1 w-px grow bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
    </div>
    <div class="-mt-0.5 flex-1 pb-1">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Public API</h3>
        <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Shipped</span>
      </div>
      <time class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Q1 2026</time>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">REST and webhooks, versioned and documented.</p>
    </div>
  </li>

  <li class="relative flex gap-4 pb-8">
    <div class="flex flex-col items-center">
      <span class="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-950" aria-hidden="true"></span>
      <span class="mt-1 w-px grow bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
    </div>
    <div class="-mt-0.5 flex-1 pb-1">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Mobile app</h3>
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">In progress</span>
      </div>
      <time class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Q3 2026</time>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">iOS first, Android close behind.</p>
    </div>
  </li>

  <li class="relative flex gap-4">
    <div class="flex flex-col items-center">
      <span class="mt-1 h-3 w-3 shrink-0 rounded-full bg-gray-300 ring-4 ring-white dark:bg-gray-600 dark:ring-gray-950" aria-hidden="true"></span>
    </div>
    <div class="-mt-0.5 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Offline mode</h3>
        <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">Planned</span>
      </div>
      <time class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Q4 2026</time>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Local-first sync for flaky connections.</p>
    </div>
  </li>
</ol>`,
      react: `const ROADMAP_STATUS = {
  shipped: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  active: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  planned: {
    dot: 'bg-gray-300 dark:bg-gray-600',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
};

const DEFAULT_LABELS = { shipped: 'Shipped', active: 'In progress', planned: 'Planned' };

export function TimelineRoadmap({ items, labels = DEFAULT_LABELS, className = '' }) {
  return (
    <ol className={\`mx-auto w-full max-w-xl \${className}\`}>
      {items.map((item, i) => {
        const style = ROADMAP_STATUS[item.status];
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={\`relative flex gap-4 \${isLast ? '' : 'pb-8'}\`}>
            <div className="flex flex-col items-center">
              <span
                className={\`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-white dark:ring-gray-950 \${style.dot}\`}
                aria-hidden="true"
              />
              {!isLast ? (
                <span className="mt-1 w-px grow bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
              ) : null}
            </div>
            <div className="-mt-0.5 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <span className={\`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium \${style.badge}\`}>
                  {labels[item.status]}
                </span>
              </div>
              {item.period ? (
                <time className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{item.period}</time>
              ) : null}
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export type RoadmapStatus = 'shipped' | 'active' | 'planned';

export interface RoadmapItem {
  title: ReactNode;
  description?: ReactNode;
  period?: string;
  status: RoadmapStatus;
}

export interface TimelineRoadmapProps {
  items: RoadmapItem[];
  /** Override the badge text per status (i18n, or renaming "active"). */
  labels?: Record<RoadmapStatus, string>;
  className?: string;
}

// Colour is a hint, never the message: each entry pairs its dot with a worded
// badge, so status survives colour-blindness and greyscale printing.
const ROADMAP_STATUS: Record<RoadmapStatus, { dot: string; badge: string }> = {
  shipped: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
  active: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  },
  planned: {
    dot: 'bg-gray-300 dark:bg-gray-600',
    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
};

const DEFAULT_LABELS: Record<RoadmapStatus, string> = {
  shipped: 'Shipped',
  active: 'In progress',
  planned: 'Planned',
};

export function TimelineRoadmap({
  items,
  labels = DEFAULT_LABELS,
  className = '',
}: TimelineRoadmapProps): JSX.Element {
  return (
    <ol className={\`mx-auto w-full max-w-xl \${className}\`}>
      {items.map((item, i) => {
        const style = ROADMAP_STATUS[item.status];
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={\`relative flex gap-4 \${isLast ? '' : 'pb-8'}\`}>
            <div className="flex flex-col items-center">
              <span
                className={\`mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-white dark:ring-gray-950 \${style.dot}\`}
                aria-hidden="true"
              />
              {!isLast ? (
                <span className="mt-1 w-px grow bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
              ) : null}
            </div>
            <div className="-mt-0.5 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                <span className={\`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium \${style.badge}\`}>
                  {labels[item.status]}
                </span>
              </div>
              {item.period ? (
                <time className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{item.period}</time>
              ) : null}
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'timeline-activity-feed',
    category: 'timeline',
    tags: ['timeline', 'activity', 'feed', 'avatars', 'log'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2040, copies: 512, downloads: 127 },
    props: [
      { name: 'items', type: 'ActivityItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Avatars are CSS gradients with initials, so the component needs no image host.
  The connector runs from just under one avatar to the next; it is dropped on
  the last row so the line does not dangle past the final entry.
-->
<ol class="mx-auto w-full max-w-xl">
  <li class="relative flex gap-4 pb-6">
    <span class="absolute left-[1.125rem] top-9 bottom-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
    <span class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white">AL</span>
    <div class="min-w-0 flex-1 pt-1">
      <p class="text-sm text-gray-600 dark:text-gray-400"><span class="font-semibold text-gray-900 dark:text-gray-100">Alex Lee</span> opened <span class="font-medium text-gray-900 dark:text-gray-100">Invoice #1024</span></p>
      <time class="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">2 hours ago</time>
    </div>
  </li>

  <li class="relative flex gap-4 pb-6">
    <span class="absolute left-[1.125rem] top-9 bottom-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
    <span class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-semibold text-white">MR</span>
    <div class="min-w-0 flex-1 pt-1">
      <p class="text-sm text-gray-600 dark:text-gray-400"><span class="font-semibold text-gray-900 dark:text-gray-100">Maria Ruiz</span> commented on <span class="font-medium text-gray-900 dark:text-gray-100">Design review</span></p>
      <time class="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">4 hours ago</time>
    </div>
  </li>

  <li class="relative flex gap-4">
    <span class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 text-xs font-semibold text-white">JK</span>
    <div class="min-w-0 flex-1 pt-1">
      <p class="text-sm text-gray-600 dark:text-gray-400"><span class="font-semibold text-gray-900 dark:text-gray-100">Jon Kim</span> closed <span class="font-medium text-gray-900 dark:text-gray-100">Sprint 42</span></p>
      <time class="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">Yesterday</time>
    </div>
  </li>
</ol>`,
      react: `export function TimelineActivityFeed({ items, className = '' }) {
  return (
    <ol className={\`mx-auto w-full max-w-xl \${className}\`}>
      {items.map((item, i) => {
        const initials = item.initials ?? item.actor.slice(0, 2).toUpperCase();
        const gradient = item.gradient ?? 'from-blue-500 to-indigo-500';
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={\`relative flex gap-4 \${isLast ? '' : 'pb-6'}\`}>
            {!isLast ? (
              <span
                className="absolute left-[1.125rem] top-9 bottom-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-800"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={\`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white \${gradient}\`}
              aria-hidden="true"
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{item.actor}</span> {item.action}
                {item.target ? (
                  <>
                    {' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.target}</span>
                  </>
                ) : null}
              </p>
              <time className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">{item.time}</time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface ActivityItem {
  actor: string;
  /** The verb phrase, e.g. "commented on". */
  action: ReactNode;
  target?: ReactNode;
  time: string;
  /** Falls back to the first two letters of \`actor\`. */
  initials?: string;
  /** Tailwind gradient stops for the avatar, e.g. 'from-blue-500 to-indigo-500'. */
  gradient?: string;
}

export interface TimelineActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function TimelineActivityFeed({
  items,
  className = '',
}: TimelineActivityFeedProps): JSX.Element {
  return (
    <ol className={\`mx-auto w-full max-w-xl \${className}\`}>
      {items.map((item, i) => {
        const initials = item.initials ?? item.actor.slice(0, 2).toUpperCase();
        const gradient = item.gradient ?? 'from-blue-500 to-indigo-500';
        const isLast = i === items.length - 1;
        return (
          <li key={i} className={\`relative flex gap-4 \${isLast ? '' : 'pb-6'}\`}>
            {!isLast ? (
              <span
                className="absolute left-[1.125rem] top-9 bottom-0 w-px -translate-x-1/2 bg-gray-200 dark:bg-gray-800"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={\`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white \${gradient}\`}
              aria-hidden="true"
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{item.actor}</span> {item.action}
                {item.target ? (
                  <>
                    {' '}
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.target}</span>
                  </>
                ) : null}
              </p>
              <time className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">{item.time}</time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'timeline-changelog',
    category: 'timeline',
    tags: ['timeline', 'changelog', 'releases', 'versions', 'updates'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1720, copies: 431, downloads: 109 },
    props: [
      { name: 'entries', type: 'ChangelogEntry[]', required: true, descriptionKey: 'entries' },
      { name: 'labels', type: 'Record<ChangeType, string>', descriptionKey: 'labels' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A two-column release layout: version + date on the left, the change list on
  the right. The columns are a md-only grid - on a phone the version block sits
  above its changes in one column. Each change carries a worded type tag so the
  colour is never the only signal.
-->
<div class="mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800">
  <article class="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr]">
    <header class="md:pt-0.5">
      <span class="inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">v2.4.0</span>
      <time class="mt-2 block text-xs text-gray-500 dark:text-gray-400">Jul 12, 2026</time>
    </header>
    <ul class="space-y-2">
      <li class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="mt-0.5 inline-flex h-5 shrink-0 items-center rounded bg-emerald-50 px-1.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Added</span>
        <span>Keyboard shortcuts for every toolbar action.</span>
      </li>
      <li class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="mt-0.5 inline-flex h-5 shrink-0 items-center rounded bg-amber-50 px-1.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">Fixed</span>
        <span>Drag-and-drop no longer drops items on the wrong row.</span>
      </li>
    </ul>
  </article>

  <article class="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr]">
    <header class="md:pt-0.5">
      <span class="inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">v2.3.0</span>
      <time class="mt-2 block text-xs text-gray-500 dark:text-gray-400">Jun 28, 2026</time>
    </header>
    <ul class="space-y-2">
      <li class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="mt-0.5 inline-flex h-5 shrink-0 items-center rounded bg-blue-50 px-1.5 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">Changed</span>
        <span>Faster initial load on large workspaces.</span>
      </li>
      <li class="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
        <span class="mt-0.5 inline-flex h-5 shrink-0 items-center rounded bg-rose-50 px-1.5 text-xs font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Removed</span>
        <span>Retired the legacy v1 export format.</span>
      </li>
    </ul>
  </article>
</div>`,
      react: `const CHANGE_TYPES = {
  added: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  fixed: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  changed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  removed: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

const CHANGE_LABELS = { added: 'Added', fixed: 'Fixed', changed: 'Changed', removed: 'Removed' };

export function TimelineChangelog({ entries, labels = CHANGE_LABELS, className = '' }) {
  return (
    <div className={\`mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800 \${className}\`}>
      {entries.map((entry, i) => (
        <article key={i} className="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr]">
          <header className="md:pt-0.5">
            <span className="inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
              {entry.version}
            </span>
            <time className="mt-2 block text-xs text-gray-500 dark:text-gray-400">{entry.date}</time>
          </header>
          <ul className="space-y-2">
            {entry.changes.map((change, j) => (
              <li key={j} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className={\`mt-0.5 inline-flex h-5 shrink-0 items-center rounded px-1.5 text-xs font-medium \${CHANGE_TYPES[change.type]}\`}>
                  {labels[change.type]}
                </span>
                <span>{change.text}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export type ChangeType = 'added' | 'fixed' | 'changed' | 'removed';

export interface ChangelogChange {
  type: ChangeType;
  text: ReactNode;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: ChangelogChange[];
}

export interface TimelineChangelogProps {
  entries: ChangelogEntry[];
  labels?: Record<ChangeType, string>;
  className?: string;
}

const CHANGE_TYPES: Record<ChangeType, string> = {
  added: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  fixed: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  changed: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  removed: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
};

const CHANGE_LABELS: Record<ChangeType, string> = {
  added: 'Added',
  fixed: 'Fixed',
  changed: 'Changed',
  removed: 'Removed',
};

export function TimelineChangelog({
  entries,
  labels = CHANGE_LABELS,
  className = '',
}: TimelineChangelogProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800 \${className}\`}>
      {entries.map((entry, i) => (
        <article key={i} className="grid gap-4 py-6 first:pt-0 last:pb-0 md:grid-cols-[8rem_1fr]">
          <header className="md:pt-0.5">
            <span className="inline-flex items-center rounded-md bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
              {entry.version}
            </span>
            <time className="mt-2 block text-xs text-gray-500 dark:text-gray-400">{entry.date}</time>
          </header>
          <ul className="space-y-2">
            {entry.changes.map((change, j) => (
              <li key={j} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span
                  className={\`mt-0.5 inline-flex h-5 shrink-0 items-center rounded px-1.5 text-xs font-medium \${CHANGE_TYPES[change.type]}\`}
                >
                  {labels[change.type]}
                </span>
                <span>{change.text}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'timeline-milestones-cards',
    category: 'timeline',
    tags: ['timeline', 'milestones', 'cards', 'icons', 'vertical'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1660, copies: 388, downloads: 94 },
    props: [
      { name: 'items', type: 'MilestoneItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A rail with a circular marker per milestone and a card beside it. The marker is
  2.5rem wide and the rail sits at left-5 (1.25rem) so it runs through the centre
  of every marker. Cards carry their own border, so the whole row reads on either
  theme without a surface behind it.
-->
<ol class="relative mx-auto w-full max-w-2xl">
  <span class="absolute bottom-4 left-5 top-4 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>

  <li class="relative flex gap-5 pb-6 last:pb-0">
    <span class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
    </span>
    <div class="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Incorporated</h3>
        <time class="text-xs text-gray-500 dark:text-gray-400">Jan 2019</time>
      </div>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Signed the papers and named the company.</p>
    </div>
  </li>

  <li class="relative flex gap-5 pb-6 last:pb-0">
    <span class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
    </span>
    <div class="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">First hire</h3>
        <time class="text-xs text-gray-500 dark:text-gray-400">Aug 2020</time>
      </div>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Employee number three still runs the support desk.</p>
    </div>
  </li>

  <li class="relative flex gap-5 pb-6 last:pb-0">
    <span class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
    </span>
    <div class="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Profitable</h3>
        <time class="text-xs text-gray-500 dark:text-gray-400">2024</time>
      </div>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Five years in, the books finally turned black.</p>
    </div>
  </li>
</ol>`,
      react: `const CheckIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export function TimelineMilestonesCards({ items, className = '' }) {
  return (
    <ol className={\`relative mx-auto w-full max-w-2xl \${className}\`}>
      <span className="absolute bottom-4 left-5 top-4 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
      {items.map((item, i) => (
        <li key={i} className="relative flex gap-5 pb-6 last:pb-0">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
            {item.icon ?? <CheckIcon />}
          </span>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              {item.date ? <time className="text-xs text-gray-500 dark:text-gray-400">{item.date}</time> : null}
            </div>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface MilestoneItem {
  title: ReactNode;
  date?: string;
  description?: ReactNode;
  /** Marker glyph; defaults to a check. Pass any 20x20 icon node. */
  icon?: ReactNode;
}

export interface TimelineMilestonesCardsProps {
  items: MilestoneItem[];
  className?: string;
}

const CheckIcon = (): JSX.Element => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export function TimelineMilestonesCards({
  items,
  className = '',
}: TimelineMilestonesCardsProps): JSX.Element {
  return (
    <ol className={\`relative mx-auto w-full max-w-2xl \${className}\`}>
      {/* Rail centred on the 2.5rem markers: 1.25rem == left-5. */}
      <span className="absolute bottom-4 left-5 top-4 w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
      {items.map((item, i) => (
        <li key={i} className="relative flex gap-5 pb-6 last:pb-0">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-blue-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-blue-400">
            {item.icon ?? <CheckIcon />}
          </span>
          <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              {item.date ? <time className="text-xs text-gray-500 dark:text-gray-400">{item.date}</time> : null}
            </div>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'timeline-year-grouped',
    category: 'timeline',
    tags: ['timeline', 'grouped', 'year', 'sticky', 'archive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1480, copies: 322, downloads: 78 },
    props: [
      { name: 'groups', type: 'YearGroup[]', required: true, descriptionKey: 'groups' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Entries are bucketed under a year heading that sticks to the top of the
  viewport while its own group scrolls past, then yields to the next year. The
  heading has a translucent backdrop so text scrolling under it stays legible.
-->
<div class="mx-auto w-full max-w-2xl">
  <section>
    <h2 class="sticky top-0 z-10 mb-4 bg-white/80 py-1 text-lg font-bold text-gray-900 backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">2026</h2>
    <ol class="relative border-s border-gray-200 dark:border-gray-800">
      <li class="ms-6 pb-6 last:pb-0">
        <span class="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
        <time class="block text-xs font-medium text-gray-500 dark:text-gray-400">March</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Opened the Berlin office</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Twelve desks and one very good espresso machine.</p>
      </li>
      <li class="ms-6 pb-6 last:pb-0">
        <span class="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
        <time class="block text-xs font-medium text-gray-500 dark:text-gray-400">June</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Passed SOC 2</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">A long audit with a short, happy ending.</p>
      </li>
    </ol>
  </section>

  <section class="mt-8">
    <h2 class="sticky top-0 z-10 mb-4 bg-white/80 py-1 text-lg font-bold text-gray-900 backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">2025</h2>
    <ol class="relative border-s border-gray-200 dark:border-gray-800">
      <li class="ms-6 pb-6 last:pb-0">
        <span class="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500" aria-hidden="true"></span>
        <time class="block text-xs font-medium text-gray-500 dark:text-gray-400">November</time>
        <h3 class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">Hit $1M ARR</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Small number, big party.</p>
      </li>
    </ol>
  </section>
</div>`,
      react: `export function TimelineYearGrouped({ groups, className = '' }) {
  return (
    <div className={\`mx-auto w-full max-w-2xl \${className}\`}>
      {groups.map((group, gi) => (
        <section key={gi} className={gi === 0 ? '' : 'mt-8'}>
          <h2 className="sticky top-0 z-10 mb-4 bg-white/80 py-1 text-lg font-bold text-gray-900 backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">
            {group.year}
          </h2>
          <ol className="relative border-s border-gray-200 dark:border-gray-800">
            {group.items.map((item, i) => (
              <li key={i} className="ms-6 pb-6 last:pb-0">
                <span
                  className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
                  aria-hidden="true"
                />
                <time className="block text-xs font-medium text-gray-500 dark:text-gray-400">{item.date}</time>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface YearItem {
  /** Sub-year label, e.g. a month. */
  date: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface YearGroup {
  year: string;
  items: YearItem[];
}

export interface TimelineYearGroupedProps {
  groups: YearGroup[];
  className?: string;
}

export function TimelineYearGrouped({
  groups,
  className = '',
}: TimelineYearGroupedProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-2xl \${className}\`}>
      {groups.map((group, gi) => (
        <section key={gi} className={gi === 0 ? '' : 'mt-8'}>
          {/* Sticky heading needs a backdrop, or rows scroll straight through it. */}
          <h2 className="sticky top-0 z-10 mb-4 bg-white/80 py-1 text-lg font-bold text-gray-900 backdrop-blur dark:bg-gray-950/80 dark:text-gray-100">
            {group.year}
          </h2>
          <ol className="relative border-s border-gray-200 dark:border-gray-800">
            {group.items.map((item, i) => (
              <li key={i} className="ms-6 pb-6 last:pb-0">
                <span
                  className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600 dark:border-gray-950 dark:bg-blue-500"
                  aria-hidden="true"
                />
                <time className="block text-xs font-medium text-gray-500 dark:text-gray-400">{item.date}</time>
                <h3 className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'timeline-progress-line',
    category: 'timeline',
    tags: ['timeline', 'progress', 'steps', 'status', 'stepper'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1900, copies: 505, downloads: 133 },
    props: [
      { name: 'steps', type: 'ProgressStep[]', required: true, descriptionKey: 'steps' },
      { name: 'currentStep', type: 'number', default: '0', descriptionKey: 'currentStep' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Three states, and each is announced by more than colour: completed steps get a
  filled dot with a check, the current step gets a ringed hollow dot plus
  aria-current="step", upcoming steps get a muted outline. The connector below a
  completed step is filled blue; everything ahead is grey.
-->
<ol class="mx-auto w-full max-w-md">
  <li class="relative flex gap-4 pb-6">
    <div class="flex flex-col items-center">
      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
        <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
      </span>
      <span class="mt-1 w-0.5 grow bg-blue-600 dark:bg-blue-500" aria-hidden="true"></span>
    </div>
    <div class="-mt-0.5 pb-1">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Order placed</h3>
      <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">We received your order.</p>
    </div>
  </li>

  <li class="relative flex gap-4 pb-6" aria-current="step">
    <div class="flex flex-col items-center">
      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:border-blue-500 dark:bg-gray-950">
        <span class="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500"></span>
      </span>
      <span class="mt-1 w-0.5 grow bg-gray-200 dark:bg-gray-800" aria-hidden="true"></span>
    </div>
    <div class="-mt-0.5 pb-1">
      <h3 class="text-sm font-semibold text-blue-700 dark:text-blue-300">Packed</h3>
      <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">Your parcel is being prepared.</p>
    </div>
  </li>

  <li class="relative flex gap-4">
    <div class="flex flex-col items-center">
      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950"></span>
    </div>
    <div class="-mt-0.5">
      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400">Delivered</h3>
      <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-500">Estimated in 2 days.</p>
    </div>
  </li>
</ol>`,
      react: `const CheckMark = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export function TimelineProgressLine({ steps, currentStep = 0, className = '' }) {
  return (
    <ol className={\`mx-auto w-full max-w-md \${className}\`}>
      {steps.map((step, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={i}
            className={\`relative flex gap-4 \${isLast ? '' : 'pb-6'}\`}
            aria-current={active ? 'step' : undefined}
          >
            <div className="flex flex-col items-center">
              {completed ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                  <CheckMark />
                </span>
              ) : active ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:border-blue-500 dark:bg-gray-950">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                </span>
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950" />
              )}
              {!isLast ? (
                <span
                  className={\`mt-1 w-0.5 grow \${completed ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'}\`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className={\`-mt-0.5 \${isLast ? '' : 'pb-1'}\`}>
              <h3
                className={\`text-sm font-semibold \${active ? 'text-blue-700 dark:text-blue-300' : completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}\`}
              >
                {step.title}
              </h3>
              {step.description ? (
                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface ProgressStep {
  title: ReactNode;
  description?: ReactNode;
}

export interface TimelineProgressLineProps {
  steps: ProgressStep[];
  /** Index of the in-progress step. Everything before it is complete. */
  currentStep?: number;
  className?: string;
}

const CheckMark = (): JSX.Element => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
      clipRule="evenodd"
    />
  </svg>
);

export function TimelineProgressLine({
  steps,
  currentStep = 0,
  className = '',
}: TimelineProgressLineProps): JSX.Element {
  return (
    <ol className={\`mx-auto w-full max-w-md \${className}\`}>
      {steps.map((step, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={i}
            className={\`relative flex gap-4 \${isLast ? '' : 'pb-6'}\`}
            // State is announced, not just coloured: SRs hear "current step".
            aria-current={active ? 'step' : undefined}
          >
            <div className="flex flex-col items-center">
              {completed ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white dark:bg-blue-500">
                  <CheckMark />
                </span>
              ) : active ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white dark:border-blue-500 dark:bg-gray-950">
                  <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                </span>
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-950" />
              )}
              {!isLast ? (
                <span
                  className={\`mt-1 w-0.5 grow \${completed ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'}\`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <div className={\`-mt-0.5 \${isLast ? '' : 'pb-1'}\`}>
              <h3
                className={\`text-sm font-semibold \${active ? 'text-blue-700 dark:text-blue-300' : completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}\`}
              >
                {step.title}
              </h3>
              {step.description ? (
                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
    },
  },
  {
    slug: 'timeline-compact-dense',
    category: 'timeline',
    tags: ['timeline', 'compact', 'dense', 'log', 'list'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1550, copies: 364, downloads: 88 },
    props: [
      { name: 'items', type: 'CompactItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A tight log: a fixed, tabular-nums time column keeps timestamps aligned, and
  the rail is each row's own inline-start border with a small dot pulled onto
  it. The last row's border is made transparent so the line stops with the log.
-->
<ol class="mx-auto w-full max-w-lg">
  <li class="relative flex gap-3">
    <time class="w-16 shrink-0 pt-px text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">09:24</time>
    <div class="relative flex-1 border-s border-gray-200 pb-4 ps-4 dark:border-gray-800">
      <span class="absolute -start-1 top-1 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true"></span>
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Deployment started</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">build #4821 &middot; production</p>
    </div>
  </li>
  <li class="relative flex gap-3">
    <time class="w-16 shrink-0 pt-px text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">09:26</time>
    <div class="relative flex-1 border-s border-gray-200 pb-4 ps-4 dark:border-gray-800">
      <span class="absolute -start-1 top-1 h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true"></span>
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Migrations applied</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">3 changes, no downtime</p>
    </div>
  </li>
  <li class="relative flex gap-3">
    <time class="w-16 shrink-0 pt-px text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">09:31</time>
    <div class="relative flex-1 border-s border-transparent ps-4">
      <span class="absolute -start-1 top-1 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Deployment healthy</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">all checks green</p>
    </div>
  </li>
</ol>`,
      react: `export function TimelineCompactDense({ items, className = '' }) {
  return (
    <ol className={\`mx-auto w-full max-w-lg \${className}\`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="relative flex gap-3">
            <time className="w-16 shrink-0 pt-px text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">
              {item.time}
            </time>
            <div
              className={\`relative flex-1 ps-4 \${isLast ? 'border-s border-transparent' : 'border-s border-gray-200 pb-4 dark:border-gray-800'}\`}
            >
              <span
                className={\`absolute -start-1 top-1 h-2 w-2 rounded-full \${item.accent ?? 'bg-gray-300 dark:bg-gray-600'}\`}
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
              {item.meta ? <p className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CompactItem {
  time: string;
  title: ReactNode;
  meta?: ReactNode;
  /** Dot colour class, e.g. 'bg-emerald-500' to flag a success row. */
  accent?: string;
}

export interface TimelineCompactDenseProps {
  items: CompactItem[];
  className?: string;
}

export function TimelineCompactDense({
  items,
  className = '',
}: TimelineCompactDenseProps): JSX.Element {
  return (
    <ol className={\`mx-auto w-full max-w-lg \${className}\`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <li key={i} className="relative flex gap-3">
            {/* tabular-nums keeps the timestamps in a rigid column. */}
            <time className="w-16 shrink-0 pt-px text-right text-xs tabular-nums text-gray-400 dark:text-gray-500">
              {item.time}
            </time>
            <div
              className={\`relative flex-1 ps-4 \${isLast ? 'border-s border-transparent' : 'border-s border-gray-200 pb-4 dark:border-gray-800'}\`}
            >
              <span
                className={\`absolute -start-1 top-1 h-2 w-2 rounded-full \${item.accent ?? 'bg-gray-300 dark:bg-gray-600'}\`}
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
              {item.meta ? <p className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}`,
    },
  },
];
