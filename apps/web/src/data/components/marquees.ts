import type { ComponentEntry } from './types';

/**
 * Marquees category.
 *
 * Ten loops built on one mechanism: a track holding two identical copies of
 * the content, translated by exactly -50% (or -50% on Y for the vertical one)
 * and restarted. The restart is invisible only if the seam between copy two
 * and copy one is the same width as every other gap - which is why every group
 * carries a trailing padding equal to its own gap. Miss that and the loop
 * hiccups once per cycle.
 *
 * The other shared constraints are not stylistic. The viewport strip is
 * `overflow-hidden`, always: a marquee that lets its track escape gives the
 * whole page a horizontal scrollbar. The duplicate copy is `aria-hidden`,
 * always: a screen reader should meet each item once, not once per lap. And
 * every loop answers `prefers-reduced-motion` - either by pausing or by
 * collapsing into a static wrapped row - because indefinitely moving content
 * with no off switch is a WCAG 2.2.2 failure, not a taste issue.
 *
 * Only `tailwind`, `react` and `typescript` ship here; the loops are pure CSS,
 * so none of them needs `'use client'`.
 */
export const marqueesComponents: ComponentEntry[] = [
  {
    slug: 'marquee-logos-strip',
    category: 'marquees',
    tags: ['marquee', 'logos', 'infinite-scroll', 'social-proof', 'landing'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1840, copies: 512, downloads: 133 },
    props: [
      { name: 'logos', type: 'string[]', default: '8 sample wordmarks', descriptionKey: 'logos' },
      { name: 'durationSeconds', type: 'number', default: '32', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Tailwind cannot declare @keyframes, so they travel in a <style> block. The
  loop: two identical groups on a w-max track, slid by -50%. Each group's
  pr-12 mirrors its gap-12 so the seam between the copies is invisible.
  Reduced motion turns the strip into a static wrapped row and drops the clone.
-->
<style>
  @keyframes marquee-logos-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden py-8" aria-label="Trusted by these companies">
  <div class="flex w-max animate-[marquee-logos-scroll_32s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <ul class="flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0">
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Adysre Corp</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Northwind</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Globex</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Initech</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Umbrella</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Stark Labs</li>
    </ul>
    <ul class="flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden" aria-hidden="true">
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Adysre Corp</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Northwind</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Globex</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Initech</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Umbrella</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">Stark Labs</li>
    </ul>
  </div>
</section>`,
      react: `const LOGOS_KEYFRAMES = \`
  @keyframes marquee-logos-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_LOGOS = ['Adysre Corp', 'Northwind', 'Globex', 'Initech', 'Umbrella', 'Stark Labs', 'Wayne Tech', 'Hooli'];

export function MarqueeLogosStrip({ logos = DEFAULT_LOGOS, durationSeconds = 32, className = '' }) {
  const group = (hidden) => (
    <ul
      className={
        hidden
          ? 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden'
          : 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'
      }
      aria-hidden={hidden || undefined}
    >
      {logos.map((logo) => (
        <li key={logo} className="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">
          {logo}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-8 \${className}\`} aria-label="Trusted by these companies">
      <style>{LOGOS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-logos-scroll_32s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `const LOGOS_KEYFRAMES = \`
  @keyframes marquee-logos-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_LOGOS = ['Adysre Corp', 'Northwind', 'Globex', 'Initech', 'Umbrella', 'Stark Labs', 'Wayne Tech', 'Hooli'];

export interface MarqueeLogosStripProps {
  /** Wordmarks to loop. Text stands in for SVG logos - swap in your own. */
  logos?: string[];
  /** One full lap. Slower reads calmer; below ~15s it reads frantic. */
  durationSeconds?: number;
  className?: string;
}

export function MarqueeLogosStrip({
  logos = DEFAULT_LOGOS,
  durationSeconds = 32,
  className = '',
}: MarqueeLogosStripProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul
      className={
        hidden
          ? 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden'
          : 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'
      }
      aria-hidden={hidden || undefined}
    >
      {logos.map((logo) => (
        <li key={logo} className="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-500 dark:text-gray-400">
          {logo}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-8 \${className}\`} aria-label="Trusted by these companies">
      {/* Two identical halves; the animation slides exactly one half (-50%) and
          restarts invisibly. Each half's pr-12 mirrors its gap-12 so the seam is
          as wide as every other gap. The clone is aria-hidden and vanishes under
          reduced motion, where the first half becomes a static wrapped row. */}
      <style>{LOGOS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-logos-scroll_32s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-text-ticker',
    category: 'marquees',
    tags: ['marquee', 'ticker', 'text', 'headline', 'scrolling'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1420, copies: 388, downloads: 96 },
    props: [
      { name: 'items', type: 'string[]', default: '6 sample phrases', descriptionKey: 'items' },
      { name: 'durationSeconds', type: 'number', default: '24', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes marquee-ticker-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden py-4" aria-label="Product highlights">
  <div class="flex w-max animate-[marquee-ticker-scroll_24s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <div class="flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2">
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Ship in minutes</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      </span>
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Zero config</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      </span>
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Type-safe by default</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      </span>
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Scales to zero</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
      </span>
    </div>
    <div class="flex shrink-0 items-center motion-reduce:hidden" aria-hidden="true">
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Ship in minutes</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></span>
      </span>
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Zero config</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></span>
      </span>
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Type-safe by default</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></span>
      </span>
      <span class="inline-flex shrink-0 items-center gap-6 pr-6">
        <span class="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Scales to zero</span>
        <span class="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></span>
      </span>
    </div>
  </div>
</section>`,
      react: `const TICKER_KEYFRAMES = \`
  @keyframes marquee-ticker-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS = ['Ship in minutes', 'Zero config', 'Type-safe by default', 'Scales to zero', 'Edge-ready', 'Open source'];

export function MarqueeTextTicker({ items = DEFAULT_ITEMS, durationSeconds = 24, className = '' }) {
  const group = (hidden) => (
    <div
      className={hidden ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2'}
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <span key={item} className="inline-flex shrink-0 items-center gap-6 pr-6">
          <span className="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={\`w-full overflow-hidden py-4 \${className}\`} aria-label="Product highlights">
      <style>{TICKER_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-ticker-scroll_24s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `const TICKER_KEYFRAMES = \`
  @keyframes marquee-ticker-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS = ['Ship in minutes', 'Zero config', 'Type-safe by default', 'Scales to zero', 'Edge-ready', 'Open source'];

export interface MarqueeTextTickerProps {
  /** Short phrases; a dot is drawn after each, including across the seam. */
  items?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeTextTicker({
  items = DEFAULT_ITEMS,
  durationSeconds = 24,
  className = '',
}: MarqueeTextTickerProps): JSX.Element {
  const group = (hidden: boolean) => (
    <div
      className={hidden ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2'}
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <span key={item} className="inline-flex shrink-0 items-center gap-6 pr-6">
          <span className="whitespace-nowrap text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{item}</span>
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={\`w-full overflow-hidden py-4 \${className}\`} aria-label="Product highlights">
      {/* The dot is a trailing decoration on every item, so it appears at the
          seam too - no special-casing the last phrase. */}
      <style>{TICKER_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-ticker-scroll_24s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-testimonials-strip',
    category: 'marquees',
    tags: ['marquee', 'testimonials', 'quotes', 'social-proof', 'cards'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1310, copies: 402, downloads: 118 },
    props: [
      { name: 'items', type: '{ quote: string; name: string; role: string }[]', default: '4 sample quotes', descriptionKey: 'items' },
      { name: 'durationSeconds', type: 'number', default: '40', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes marquee-testimonials-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden py-6" aria-label="What customers say">
  <div class="flex w-max animate-[marquee-testimonials-scroll_40s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <ul class="flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0">
      <li class="w-72 shrink-0">
        <figure class="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;It paid for itself in the first week. We shipped the migration in two days.&rdquo;</blockquote>
          <figcaption class="mt-4 flex items-center gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white" aria-hidden="true">MR</span>
            <span class="min-w-0"><span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Maya Rao</span><span class="block truncate text-xs text-gray-500 dark:text-gray-400">Head of Platform</span></span>
          </figcaption>
        </figure>
      </li>
      <li class="w-72 shrink-0">
        <figure class="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;Support answered in minutes and actually fixed the root cause. Rare.&rdquo;</blockquote>
          <figcaption class="mt-4 flex items-center gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white" aria-hidden="true">JL</span>
            <span class="min-w-0"><span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Jonah Lee</span><span class="block truncate text-xs text-gray-500 dark:text-gray-400">CTO, Northwind</span></span>
          </figcaption>
        </figure>
      </li>
    </ul>
    <ul class="flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:hidden" aria-hidden="true">
      <li class="w-72 shrink-0">
        <figure class="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;It paid for itself in the first week. We shipped the migration in two days.&rdquo;</blockquote>
          <figcaption class="mt-4 flex items-center gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">MR</span>
            <span class="min-w-0"><span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Maya Rao</span><span class="block truncate text-xs text-gray-500 dark:text-gray-400">Head of Platform</span></span>
          </figcaption>
        </figure>
      </li>
      <li class="w-72 shrink-0">
        <figure class="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;Support answered in minutes and actually fixed the root cause. Rare.&rdquo;</blockquote>
          <figcaption class="mt-4 flex items-center gap-3">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">JL</span>
            <span class="min-w-0"><span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Jonah Lee</span><span class="block truncate text-xs text-gray-500 dark:text-gray-400">CTO, Northwind</span></span>
          </figcaption>
        </figure>
      </li>
    </ul>
  </div>
</section>`,
      react: `const TESTIMONIALS_KEYFRAMES = \`
  @keyframes marquee-testimonials-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS = [
  { quote: 'It paid for itself in the first week. We shipped the migration in two days.', name: 'Maya Rao', role: 'Head of Platform' },
  { quote: 'Support answered in minutes and actually fixed the root cause. Rare.', name: 'Jonah Lee', role: 'CTO, Northwind' },
  { quote: 'The API is the first one my team did not fight. It just does the obvious thing.', name: 'Priya Shah', role: 'Staff Engineer' },
  { quote: 'We cut onboarding from a week to an afternoon. The docs carry their weight.', name: 'Diego Ruiz', role: 'VP Engineering' },
];

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0, 2).join('');

export function MarqueeTestimonialsStrip({ items = DEFAULT_ITEMS, durationSeconds = 40, className = '' }) {
  const group = (hidden) => (
    <ul
      className={hidden ? 'flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:hidden' : 'flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'}
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li key={item.name} className="w-72 shrink-0">
          <figure className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white" aria-hidden="true">{initials(item.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="What customers say">
      <style>{TESTIMONIALS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-testimonials-scroll_40s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS_KEYFRAMES = \`
  @keyframes marquee-testimonials-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'It paid for itself in the first week. We shipped the migration in two days.', name: 'Maya Rao', role: 'Head of Platform' },
  { quote: 'Support answered in minutes and actually fixed the root cause. Rare.', name: 'Jonah Lee', role: 'CTO, Northwind' },
  { quote: 'The API is the first one my team did not fight. It just does the obvious thing.', name: 'Priya Shah', role: 'Staff Engineer' },
  { quote: 'We cut onboarding from a week to an afternoon. The docs carry their weight.', name: 'Diego Ruiz', role: 'VP Engineering' },
];

const initials = (name: string): string => name.split(' ').map((part) => part[0]).slice(0, 2).join('');

export interface MarqueeTestimonialsStripProps {
  items?: Testimonial[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeTestimonialsStrip({
  items = DEFAULT_ITEMS,
  durationSeconds = 40,
  className = '',
}: MarqueeTestimonialsStripProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul
      className={hidden ? 'flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:hidden' : 'flex shrink-0 items-stretch gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'}
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li key={item.name} className="w-72 shrink-0">
          <figure className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{item.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              {/* Fixed-width cards (w-72) keep every quote the same length on the
                  track, so the loop advances at a steady rhythm. */}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white" aria-hidden="true">{initials(item.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="What customers say">
      <style>{TESTIMONIALS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-testimonials-scroll_40s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-vertical-scroll',
    category: 'marquees',
    tags: ['marquee', 'vertical', 'scroll', 'activity', 'feed'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1180, copies: 341, downloads: 88 },
    props: [
      { name: 'items', type: 'string[]', default: '6 sample events', descriptionKey: 'items' },
      { name: 'durationSeconds', type: 'number', default: '22', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Vertical variant: the track is a column and the transform is on Y. The
  viewport has a fixed height and clips; each group's pb-3 mirrors its gap-3 so
  the vertical seam is invisible. Reduced motion turns the strip into a normal
  scrollable list (overflow-y-auto) and drops the clone.
-->
<style>
  @keyframes marquee-vertical-scroll {
    to { transform: translateY(-50%); }
  }
</style>

<section class="h-64 w-full overflow-hidden motion-reduce:overflow-y-auto" aria-label="Latest activity">
  <div class="flex flex-col animate-[marquee-vertical-scroll_22s_linear_infinite] motion-reduce:animate-none">
    <ul class="flex flex-col gap-3 pb-3 motion-reduce:pb-0">
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>Maya deployed to production</li>
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>New signup from Berlin</li>
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>Invoice #4021 paid</li>
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true"></span>Nightly backup completed</li>
    </ul>
    <ul class="flex flex-col gap-3 pb-3 motion-reduce:hidden" aria-hidden="true">
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span>Maya deployed to production</li>
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span>New signup from Berlin</li>
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span>Invoice #4021 paid</li>
      <li class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"><span class="h-2 w-2 shrink-0 rounded-full bg-emerald-500"></span>Nightly backup completed</li>
    </ul>
  </div>
</section>`,
      react: `const VERTICAL_KEYFRAMES = \`
  @keyframes marquee-vertical-scroll {
    to { transform: translateY(-50%); }
  }
\`;

const DEFAULT_ITEMS = ['Maya deployed to production', 'New signup from Berlin', 'Invoice #4021 paid', 'Nightly backup completed', 'API latency down 12%', 'Weekly report is ready'];

export function MarqueeVerticalScroll({ items = DEFAULT_ITEMS, durationSeconds = 22, className = '' }) {
  const group = (hidden) => (
    <ul className={hidden ? 'flex flex-col gap-3 pb-3 motion-reduce:hidden' : 'flex flex-col gap-3 pb-3 motion-reduce:pb-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`h-64 w-full overflow-hidden motion-reduce:overflow-y-auto \${className}\`} aria-label="Latest activity">
      <style>{VERTICAL_KEYFRAMES}</style>
      <div
        className="flex flex-col animate-[marquee-vertical-scroll_22s_linear_infinite] motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `const VERTICAL_KEYFRAMES = \`
  @keyframes marquee-vertical-scroll {
    to { transform: translateY(-50%); }
  }
\`;

const DEFAULT_ITEMS = ['Maya deployed to production', 'New signup from Berlin', 'Invoice #4021 paid', 'Nightly backup completed', 'API latency down 12%', 'Weekly report is ready'];

export interface MarqueeVerticalScrollProps {
  items?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeVerticalScroll({
  items = DEFAULT_ITEMS,
  durationSeconds = 22,
  className = '',
}: MarqueeVerticalScrollProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex flex-col gap-3 pb-3 motion-reduce:hidden' : 'flex flex-col gap-3 pb-3 motion-reduce:pb-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`h-64 w-full overflow-hidden motion-reduce:overflow-y-auto \${className}\`} aria-label="Latest activity">
      {/* Fixed-height viewport clips the column; the transform is on Y. Reduced
          motion swaps the clip for a real scroll so every row stays reachable. */}
      <style>{VERTICAL_KEYFRAMES}</style>
      <div
        className="flex flex-col animate-[marquee-vertical-scroll_22s_linear_infinite] motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-dual-row-opposite',
    category: 'marquees',
    tags: ['marquee', 'dual-row', 'opposite', 'tags', 'reverse'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1090, copies: 297, downloads: 74 },
    props: [
      { name: 'topItems', type: 'string[]', default: '6 sample tags', descriptionKey: 'topItems' },
      { name: 'bottomItems', type: 'string[]', default: '6 sample tags', descriptionKey: 'bottomItems' },
      { name: 'durationSeconds', type: 'number', default: '30', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two rows, one keyframe. The bottom track adds [animation-direction:reverse]
  so it slides the other way - and because -50% and 0 both show identical
  content, reverse is seamless without a second keyframe.
-->
<style>
  @keyframes marquee-dual-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="flex w-full flex-col gap-4" aria-label="Technologies we use">
  <div class="w-full overflow-hidden">
    <div class="flex w-max animate-[marquee-dual-scroll_30s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
      <ul class="flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0">
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">TypeScript</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">React</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Next.js</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Tailwind</li>
      </ul>
      <ul class="flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden" aria-hidden="true">
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">TypeScript</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">React</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Next.js</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Tailwind</li>
      </ul>
    </div>
  </div>
  <div class="w-full overflow-hidden">
    <div class="flex w-max animate-[marquee-dual-scroll_30s_linear_infinite] [animation-direction:reverse] motion-reduce:w-full motion-reduce:animate-none">
      <ul class="flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0">
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Postgres</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Redis</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Docker</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">GraphQL</li>
      </ul>
      <ul class="flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden" aria-hidden="true">
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Postgres</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Redis</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Docker</li>
        <li class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">GraphQL</li>
      </ul>
    </div>
  </div>
</section>`,
      react: `const DUAL_KEYFRAMES = \`
  @keyframes marquee-dual-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_TOP = ['TypeScript', 'React', 'Next.js', 'Tailwind', 'Zod', 'Vite'];
const DEFAULT_BOTTOM = ['Postgres', 'Redis', 'Docker', 'GraphQL', 'Prisma', 'BullMQ'];

const CHIP = 'inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';

export function MarqueeDualRowOpposite({ topItems = DEFAULT_TOP, bottomItems = DEFAULT_BOTTOM, durationSeconds = 30, className = '' }) {
  const group = (items, hidden) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden' : 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className={CHIP}>{item}</li>
      ))}
    </ul>
  );

  const row = (items, reverse) => (
    <div className="w-full overflow-hidden">
      <div
        className={\`flex w-max animate-[marquee-dual-scroll_30s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none \${reverse ? '[animation-direction:reverse]' : ''}\`}
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(items, false)}
        {group(items, true)}
      </div>
    </div>
  );

  return (
    <section className={\`flex w-full flex-col gap-4 \${className}\`} aria-label="Technologies we use">
      <style>{DUAL_KEYFRAMES}</style>
      {row(topItems, false)}
      {row(bottomItems, true)}
    </section>
  );
}`,
      typescript: `const DUAL_KEYFRAMES = \`
  @keyframes marquee-dual-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_TOP = ['TypeScript', 'React', 'Next.js', 'Tailwind', 'Zod', 'Vite'];
const DEFAULT_BOTTOM = ['Postgres', 'Redis', 'Docker', 'GraphQL', 'Prisma', 'BullMQ'];

const CHIP = 'inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300';

export interface MarqueeDualRowOppositeProps {
  topItems?: string[];
  bottomItems?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeDualRowOpposite({
  topItems = DEFAULT_TOP,
  bottomItems = DEFAULT_BOTTOM,
  durationSeconds = 30,
  className = '',
}: MarqueeDualRowOppositeProps): JSX.Element {
  const group = (items: string[], hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden' : 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className={CHIP}>{item}</li>
      ))}
    </ul>
  );

  const row = (items: string[], reverse: boolean) => (
    <div className="w-full overflow-hidden">
      {/* One keyframe for both rows; reverse flips the bottom one. Each row is
          its own overflow-hidden viewport, so neither can widen the page. */}
      <div
        className={\`flex w-max animate-[marquee-dual-scroll_30s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none \${reverse ? '[animation-direction:reverse]' : ''}\`}
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(items, false)}
        {group(items, true)}
      </div>
    </div>
  );

  return (
    <section className={\`flex w-full flex-col gap-4 \${className}\`} aria-label="Technologies we use">
      <style>{DUAL_KEYFRAMES}</style>
      {row(topItems, false)}
      {row(bottomItems, true)}
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-pause-on-hover',
    category: 'marquees',
    tags: ['marquee', 'pause', 'hover', 'focus', 'interactive'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1260, copies: 366, downloads: 101 },
    props: [
      { name: 'items', type: '{ label: string; href: string }[]', default: '6 sample links', descriptionKey: 'items' },
      { name: 'durationSeconds', type: 'number', default: '30', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  play-state:paused on hover AND focus-within: the pause has to be reachable by
  keyboard too, so the items are links and tabbing into one stops the loop. That
  is what lets a reader actually click a moving target.
-->
<style>
  @keyframes marquee-pause-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden py-6" aria-label="Browse categories">
  <div class="flex w-max animate-[marquee-pause-scroll_30s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
    <ul class="flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0">
      <li><a href="#" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">Design</a></li>
      <li><a href="#" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">Engineering</a></li>
      <li><a href="#" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">Product</a></li>
      <li><a href="#" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">Marketing</a></li>
    </ul>
    <ul class="flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden" aria-hidden="true">
      <li><a href="#" tabindex="-1" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Design</a></li>
      <li><a href="#" tabindex="-1" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Engineering</a></li>
      <li><a href="#" tabindex="-1" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Product</a></li>
      <li><a href="#" tabindex="-1" class="inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Marketing</a></li>
    </ul>
  </div>
</section>`,
      react: `const PAUSE_KEYFRAMES = \`
  @keyframes marquee-pause-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS = [
  { label: 'Design', href: '#' },
  { label: 'Engineering', href: '#' },
  { label: 'Product', href: '#' },
  { label: 'Marketing', href: '#' },
  { label: 'Sales', href: '#' },
  { label: 'Support', href: '#' },
];

const CHIP = 'inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';

export function MarqueePauseOnHover({ items = DEFAULT_ITEMS, durationSeconds = 30, className = '' }) {
  const group = (hidden) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden' : 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.label}>
          <a href={item.href} tabIndex={hidden ? -1 : undefined} className={CHIP}>{item.label}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="Browse categories">
      <style>{PAUSE_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-pause-scroll_30s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `interface LinkItem {
  label: string;
  href: string;
}

const PAUSE_KEYFRAMES = \`
  @keyframes marquee-pause-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS: LinkItem[] = [
  { label: 'Design', href: '#' },
  { label: 'Engineering', href: '#' },
  { label: 'Product', href: '#' },
  { label: 'Marketing', href: '#' },
  { label: 'Sales', href: '#' },
  { label: 'Support', href: '#' },
];

const CHIP = 'inline-flex whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400';

export interface MarqueePauseOnHoverProps {
  items?: LinkItem[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueePauseOnHover({
  items = DEFAULT_ITEMS,
  durationSeconds = 30,
  className = '',
}: MarqueePauseOnHoverProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:hidden' : 'flex shrink-0 items-center gap-3 pr-3 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.label}>
          {/* The clone is aria-hidden, so its links are also removed from the tab
              order with tabIndex -1 - no invisible duplicate tab stops. */}
          <a href={item.href} tabIndex={hidden ? -1 : undefined} className={CHIP}>{item.label}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="Browse categories">
      <style>{PAUSE_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-pause-scroll_30s_linear_infinite] [animation-play-state:running] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-gradient-mask-edges',
    category: 'marquees',
    tags: ['marquee', 'mask', 'gradient', 'fade', 'edges'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1150, copies: 318, downloads: 82 },
    props: [
      { name: 'items', type: 'string[]', default: '6 sample wordmarks', descriptionKey: 'items' },
      { name: 'durationSeconds', type: 'number', default: '28', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A mask-image on the viewport fades both edges to transparent, so items enter
  and leave instead of popping at a hard border. -webkit-mask-image is repeated
  for Safari. The mask is on the clipping strip, never the animated track.
-->
<style>
  @keyframes marquee-mask-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section
  class="w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
  aria-label="Featured brands"
>
  <div class="flex w-max animate-[marquee-mask-scroll_28s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <ul class="flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0">
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Vertex</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Lumen</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Cobalt</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Aurora</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Nimbus</li>
    </ul>
    <ul class="flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden" aria-hidden="true">
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Vertex</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Lumen</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Cobalt</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Aurora</li>
      <li class="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">Nimbus</li>
    </ul>
  </div>
</section>`,
      react: `const MASK_KEYFRAMES = \`
  @keyframes marquee-mask-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS = ['Vertex', 'Lumen', 'Cobalt', 'Aurora', 'Nimbus', 'Quartz'];

export function MarqueeGradientMaskEdges({ items = DEFAULT_ITEMS, durationSeconds = 28, className = '' }) {
  const group = (hidden) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden' : 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">{item}</li>
      ))}
    </ul>
  );

  return (
    <section
      className={\`w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] \${className}\`}
      aria-label="Featured brands"
    >
      <style>{MASK_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-mask-scroll_28s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `const MASK_KEYFRAMES = \`
  @keyframes marquee-mask-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_ITEMS = ['Vertex', 'Lumen', 'Cobalt', 'Aurora', 'Nimbus', 'Quartz'];

export interface MarqueeGradientMaskEdgesProps {
  items?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeGradientMaskEdges({
  items = DEFAULT_ITEMS,
  durationSeconds = 28,
  className = '',
}: MarqueeGradientMaskEdgesProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:hidden' : 'flex shrink-0 items-center gap-12 pr-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap text-lg font-semibold tracking-tight text-gray-600 dark:text-gray-300">{item}</li>
      ))}
    </ul>
  );

  return (
    <section
      /* The mask lives on the overflow-hidden strip, not the track: masking the
         moving layer would fade the wrong pixels as it slides. */
      className={\`w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] \${className}\`}
      aria-label="Featured brands"
    >
      <style>{MASK_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-mask-scroll_28s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-image-tiles',
    category: 'marquees',
    tags: ['marquee', 'images', 'tiles', 'gallery', 'gradient'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1075, copies: 289, downloads: 71 },
    props: [
      { name: 'tiles', type: '{ label: string; gradient: string }[]', default: '5 gradient tiles', descriptionKey: 'tiles' },
      { name: 'durationSeconds', type: 'number', default: '36', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Gradient tiles stand in for photos - no external images. Each tile fixes its
  own aspect via h-28 w-40 so the track width is stable and the loop stays
  smooth. Swap the gradient div for an <img> with the same box when you have art.
-->
<style>
  @keyframes marquee-tiles-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden py-6" aria-label="Recent shots">
  <div class="flex w-max animate-[marquee-tiles-scroll_36s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <ul class="flex shrink-0 items-center gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0">
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Ridgeline</span></li>
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-orange-500"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Harbor</span></li>
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Canopy</span></li>
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Dusk</span></li>
    </ul>
    <ul class="flex shrink-0 items-center gap-4 pr-4 motion-reduce:hidden" aria-hidden="true">
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Ridgeline</span></li>
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-rose-500 to-orange-500"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Harbor</span></li>
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Canopy</span></li>
      <li class="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600"><span class="absolute bottom-2 left-3 text-xs font-semibold text-white">Dusk</span></li>
    </ul>
  </div>
</section>`,
      react: `const TILES_KEYFRAMES = \`
  @keyframes marquee-tiles-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_TILES = [
  { label: 'Ridgeline', gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Harbor', gradient: 'from-rose-500 to-orange-500' },
  { label: 'Canopy', gradient: 'from-emerald-500 to-teal-600' },
  { label: 'Dusk', gradient: 'from-violet-500 to-fuchsia-600' },
  { label: 'Tundra', gradient: 'from-cyan-500 to-sky-600' },
];

export function MarqueeImageTiles({ tiles = DEFAULT_TILES, durationSeconds = 36, className = '' }) {
  const group = (hidden) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-4 pr-4 motion-reduce:hidden' : 'flex shrink-0 items-center gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {tiles.map((tile) => (
        <li key={tile.label} className={\`relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br \${tile.gradient}\`}>
          <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">{tile.label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="Recent shots">
      <style>{TILES_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-tiles-scroll_36s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `interface Tile {
  label: string;
  /** Two Tailwind gradient stops, e.g. 'from-blue-500 to-indigo-600'. */
  gradient: string;
}

const TILES_KEYFRAMES = \`
  @keyframes marquee-tiles-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_TILES: Tile[] = [
  { label: 'Ridgeline', gradient: 'from-blue-500 to-indigo-600' },
  { label: 'Harbor', gradient: 'from-rose-500 to-orange-500' },
  { label: 'Canopy', gradient: 'from-emerald-500 to-teal-600' },
  { label: 'Dusk', gradient: 'from-violet-500 to-fuchsia-600' },
  { label: 'Tundra', gradient: 'from-cyan-500 to-sky-600' },
];

export interface MarqueeImageTilesProps {
  tiles?: Tile[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeImageTiles({
  tiles = DEFAULT_TILES,
  durationSeconds = 36,
  className = '',
}: MarqueeImageTilesProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-4 pr-4 motion-reduce:hidden' : 'flex shrink-0 items-center gap-4 pr-4 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {tiles.map((tile) => (
        <li key={tile.label} className={\`relative h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br \${tile.gradient}\`}>
          {/* Fixed-size tiles keep the track width constant - a variable-width
              tile would make the -50% seam land mid-image. */}
          <span className="absolute bottom-2 left-3 text-xs font-semibold text-white">{tile.label}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="Recent shots">
      <style>{TILES_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-tiles-scroll_36s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-announcement-bar',
    category: 'marquees',
    tags: ['marquee', 'announcement', 'bar', 'banner', 'ticker'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1330, copies: 375, downloads: 109 },
    props: [
      { name: 'messages', type: 'string[]', default: '4 sample messages', descriptionKey: 'messages' },
      { name: 'durationSeconds', type: 'number', default: '26', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A slim full-width banner that loops short messages. The bar owns a solid blue
  surface, so its white text clears AA on any page behind it - no scrim needed.
-->
<style>
  @keyframes marquee-announce-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden bg-blue-600 py-2 text-white dark:bg-blue-700" aria-label="Announcements">
  <div class="flex w-max animate-[marquee-announce-scroll_26s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <div class="flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1">
      <span class="inline-flex shrink-0 items-center gap-4 pr-4"><span class="whitespace-nowrap text-sm font-medium">Version 3.0 is live</span><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true"></span></span>
      <span class="inline-flex shrink-0 items-center gap-4 pr-4"><span class="whitespace-nowrap text-sm font-medium">Free shipping over $50</span><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true"></span></span>
      <span class="inline-flex shrink-0 items-center gap-4 pr-4"><span class="whitespace-nowrap text-sm font-medium">Join 10,000+ teams</span><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true"></span></span>
    </div>
    <div class="flex shrink-0 items-center motion-reduce:hidden" aria-hidden="true">
      <span class="inline-flex shrink-0 items-center gap-4 pr-4"><span class="whitespace-nowrap text-sm font-medium">Version 3.0 is live</span><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70"></span></span>
      <span class="inline-flex shrink-0 items-center gap-4 pr-4"><span class="whitespace-nowrap text-sm font-medium">Free shipping over $50</span><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70"></span></span>
      <span class="inline-flex shrink-0 items-center gap-4 pr-4"><span class="whitespace-nowrap text-sm font-medium">Join 10,000+ teams</span><span class="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70"></span></span>
    </div>
  </div>
</section>`,
      react: `const ANNOUNCE_KEYFRAMES = \`
  @keyframes marquee-announce-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_MESSAGES = ['Version 3.0 is live', 'Free shipping over $50', 'Join 10,000+ teams', 'Now with dark mode'];

export function MarqueeAnnouncementBar({ messages = DEFAULT_MESSAGES, durationSeconds = 26, className = '' }) {
  const group = (hidden) => (
    <div className={hidden ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1'} aria-hidden={hidden || undefined}>
      {messages.map((message) => (
        <span key={message} className="inline-flex shrink-0 items-center gap-4 pr-4">
          <span className="whitespace-nowrap text-sm font-medium">{message}</span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={\`w-full overflow-hidden bg-blue-600 py-2 text-white dark:bg-blue-700 \${className}\`} aria-label="Announcements">
      <style>{ANNOUNCE_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-announce-scroll_26s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `const ANNOUNCE_KEYFRAMES = \`
  @keyframes marquee-announce-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_MESSAGES = ['Version 3.0 is live', 'Free shipping over $50', 'Join 10,000+ teams', 'Now with dark mode'];

export interface MarqueeAnnouncementBarProps {
  messages?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeAnnouncementBar({
  messages = DEFAULT_MESSAGES,
  durationSeconds = 26,
  className = '',
}: MarqueeAnnouncementBarProps): JSX.Element {
  const group = (hidden: boolean) => (
    <div className={hidden ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1'} aria-hidden={hidden || undefined}>
      {messages.map((message) => (
        <span key={message} className="inline-flex shrink-0 items-center gap-4 pr-4">
          <span className="whitespace-nowrap text-sm font-medium">{message}</span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={\`w-full overflow-hidden bg-blue-600 py-2 text-white dark:bg-blue-700 \${className}\`} aria-label="Announcements">
      {/* The bar paints its own blue surface, so it reads identically on a light
          or dark page - nothing here inherits the theme except the darker dark: tint. */}
      <style>{ANNOUNCE_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-announce-scroll_26s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'marquee-skills-chips',
    category: 'marquees',
    tags: ['marquee', 'skills', 'chips', 'pills', 'portfolio'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1215, copies: 344, downloads: 95 },
    props: [
      { name: 'skills', type: 'string[]', default: '10 sample skills', descriptionKey: 'skills' },
      { name: 'durationSeconds', type: 'number', default: '34', descriptionKey: 'durationSeconds' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<style>
  @keyframes marquee-skills-scroll {
    to { transform: translateX(-50%); }
  }
</style>

<section class="w-full overflow-hidden py-6" aria-label="Skills">
  <div class="flex w-max animate-[marquee-skills-scroll_34s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none">
    <ul class="flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2.5 motion-reduce:pr-0">
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>TypeScript</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>React</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>Node.js</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>GraphQL</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>PostgreSQL</li>
    </ul>
    <ul class="flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:hidden" aria-hidden="true">
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>TypeScript</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>React</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>Node.js</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>GraphQL</li>
      <li class="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"><span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>PostgreSQL</li>
    </ul>
  </div>
</section>`,
      react: `const SKILLS_KEYFRAMES = \`
  @keyframes marquee-skills-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_SKILLS = ['TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind', 'Figma', 'Redis'];

const CHIP = 'inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200';

export function MarqueeSkillsChips({ skills = DEFAULT_SKILLS, durationSeconds = 34, className = '' }) {
  const group = (hidden) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:hidden' : 'flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2.5 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <li key={skill} className={CHIP}>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {skill}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="Skills">
      <style>{SKILLS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-skills-scroll_34s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
      typescript: `const SKILLS_KEYFRAMES = \`
  @keyframes marquee-skills-scroll {
    to { transform: translateX(-50%); }
  }
\`;

const DEFAULT_SKILLS = ['TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind', 'Figma', 'Redis'];

const CHIP = 'inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200';

export interface MarqueeSkillsChipsProps {
  skills?: string[];
  durationSeconds?: number;
  className?: string;
}

export function MarqueeSkillsChips({
  skills = DEFAULT_SKILLS,
  durationSeconds = 34,
  className = '',
}: MarqueeSkillsChipsProps): JSX.Element {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:hidden' : 'flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2.5 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <li key={skill} className={CHIP}>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {skill}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={\`w-full overflow-hidden py-6 \${className}\`} aria-label="Skills">
      <style>{SKILLS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-skills-scroll_34s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: \`\${durationSeconds}s\` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}`,
    },
  },
];
