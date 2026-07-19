import type { ComponentEntry } from './types';

/**
 * CTA category - call-to-action sections.
 *
 * Ten structurally different closers, not ten recolours of one button row: a
 * plain centred stack, a split with a gradient media panel, a gradient banner,
 * an inline email capture, a stats band, a dark glow, a two-button decision,
 * a floating card, a full-bleed pattern, and an app-download pair.
 *
 * The shared constraint is contrast. The moment a CTA stops painting a flat
 * surface and puts white text over a gradient or a pattern, 4.5:1 stops being a
 * colour choice and becomes a structural one - hence the scrim layer in
 * `cta-gradient-banner` and `cta-full-bleed-pattern`. It is not decoration; it
 * is the only thing guaranteeing legibility over pixels the component's colour
 * props do not control. The second shared rule: every button row is
 * `flex-col sm:flex-row`, because two 140px buttons side by side at 320px are
 * two bad tap targets instead of one good one.
 */
export const ctaComponents: ComponentEntry[] = [
  {
    slug: 'cta-centered-simple',
    category: 'cta',
    tags: ['cta', 'centered', 'call-to-action', 'buttons', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1840, copies: 512, downloads: 140 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'secondaryCtaLabel', type: 'string', descriptionKey: 'secondaryCtaLabel' },
      { name: 'secondaryCtaHref', type: 'string', default: "'#'", descriptionKey: 'secondaryCtaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A CTA sits mid-page, after a hero and sections that already own the <h1>, so
  its heading is an <h2>. Promoting it to <h1> would put a second top-level
  heading in the document and break the outline.
-->
<section class="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
    Ready to ship faster?
  </h2>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
    Start free, invite your team, and go to production in an afternoon.
  </p>

  <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
    <a
      href="#"
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Get started
    </a>
    <a
      href="#"
      class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Talk to sales
    </a>
  </div>
</section>`,
      react: `export function CtaCenteredSimple({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
        {secondaryCtaLabel ? (
          <a
            href={secondaryCtaHref}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryCtaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaCenteredSimpleProps {
  /** The section heading. A CTA sits mid-page, so this is an <h2>, not an <h1>. */
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function CtaCenteredSimple({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: CtaCenteredSimpleProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
        {secondaryCtaLabel ? (
          <a
            href={secondaryCtaHref}
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryCtaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-split-image',
    category: 'cta',
    tags: ['cta', 'split', 'two-column', 'gradient', 'responsive'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1610, copies: 430, downloads: 118 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
    ],
    code: {
      tailwind: `<!--
  The media column is a pure-CSS gradient panel with a decorative inline SVG, so
  there is no image to preload or let rot. It is aria-hidden because it
  illustrates rather than carries meaning. On mobile the grid stacks, copy first.
-->
<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
  <div class="grid overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-col justify-center p-8 sm:p-10">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        Bring your whole workflow together
      </h2>
      <p class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
        Plan, build and ship without switching tabs - one place for the whole team.
      </p>
      <div class="mt-7">
        <a
          href="#"
          class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Get started
        </a>
      </div>
    </div>

    <div
      class="relative min-h-[12rem] overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
      aria-hidden="true"
    >
      <svg class="absolute inset-0 h-full w-full text-white/20" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" fill="none">
        <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="8" />
        <circle cx="150" cy="130" r="70" stroke="currentColor" stroke-width="8" />
      </svg>
    </div>
  </div>
</section>`,
      react: `export function CtaSplitImage({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          ) : null}
          <div className="mt-7">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <div
          className="relative min-h-[12rem] overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
          aria-hidden="true"
        >
          <svg className="absolute inset-0 h-full w-full text-white/20" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" fill="none">
            <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" />
            <circle cx="150" cy="130" r="70" stroke="currentColor" strokeWidth="8" />
          </svg>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaSplitImageProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CtaSplitImage({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
}: CtaSplitImageProps): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white md:grid-cols-2 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          ) : null}
          <div className="mt-7">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <div
          className="relative min-h-[12rem] overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
          aria-hidden="true"
        >
          <svg className="absolute inset-0 h-full w-full text-white/20" preserveAspectRatio="xMidYMid slice" viewBox="0 0 200 200" fill="none">
            <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" />
            <circle cx="150" cy="130" r="70" stroke="currentColor" strokeWidth="8" />
          </svg>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-gradient-banner',
    category: 'cta',
    tags: ['cta', 'gradient', 'banner', 'scrim', 'contrast'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2010, copies: 604, downloads: 171 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start free trial'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two layers behind the text, both load-bearing: the gradient, then a flat
  black/30 scrim. The scrim is not a mood filter - a gradient runs through light
  and dark stops, so white text over the raw gradient clears contrast in one
  region and fails in another. The scrim is what makes 4.5:1 true across it.
-->
<section class="relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl">
  <div class="absolute inset-0 -z-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" aria-hidden="true"></div>
  <div class="absolute inset-0 -z-10 bg-black/30" aria-hidden="true"></div>

  <div class="px-6 py-12 text-center sm:px-10 sm:py-16">
    <h2 class="text-2xl font-bold tracking-tight text-white sm:text-4xl">
      Everything your team needs, in one place
    </h2>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-100">
      Start free today. No credit card, no setup call, cancel whenever.
    </p>

    <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        href="#"
        class="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
      >
        Start free trial
      </a>
    </div>
  </div>
</section>`,
      react: `export function CtaGradientBanner({
  title,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl \${className}\`}>
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" aria-hidden="true" />
      {/* The scrim guarantees 4.5:1 for white text across the whole gradient. */}
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-100">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaGradientBannerProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function CtaGradientBanner({
  title,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: CtaGradientBannerProps): JSX.Element {
  return (
    <section className={\`relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl \${className}\`}>
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" aria-hidden="true" />
      {/* The scrim guarantees 4.5:1 for white text across the whole gradient. */}
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-100">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-with-email-capture',
    category: 'cta',
    tags: ['cta', 'email', 'form', 'newsletter', 'conversion'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1720, copies: 498, downloads: 133 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'placeholder', type: 'string', default: "'you@company.com'", descriptionKey: 'placeholder' },
      { name: 'ctaLabel', type: 'string', default: "'Subscribe'", descriptionKey: 'ctaLabel' },
      { name: 'note', type: 'string', descriptionKey: 'note' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
    ],
    code: {
      tailwind: `<!--
  A real <form> with a real <label>. The label is visually hidden, not absent:
  a placeholder is not a label - it vanishes on the first keystroke and leaves
  the field nameless to a screen reader. The row stacks below sm because a 90px
  email input is a rumour, not a form.
-->
<section class="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
    Get the monthly changelog
  </h2>
  <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
    One email a month. New features, nothing else. Unsubscribe any time.
  </p>

  <form class="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row" action="#" method="post">
    <label class="sr-only" for="cta-email">Email address</label>
    <input
      id="cta-email"
      name="email"
      type="email"
      autocomplete="email"
      placeholder="you@company.com"
      required
      class="w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    />
    <button
      type="submit"
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Subscribe
    </button>
  </form>

  <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">We only email once a month.</p>
</section>`,
      react: `export function CtaWithEmailCapture({
  title,
  copy,
  placeholder = 'you@company.com',
  ctaLabel = 'Subscribe',
  note,
  loading = false,
}) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <form className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row" action="#" method="post">
        <label className="sr-only" htmlFor="cta-email">
          Email address
        </label>
        <input
          id="cta-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          required
          className="w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Subscribing…' : ctaLabel}
        </button>
      </form>

      {note ? <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{note}</p> : null}
    </section>
  );
}`,
      typescript: `export interface CtaWithEmailCaptureProps {
  title: string;
  copy?: string;
  placeholder?: string;
  ctaLabel?: string;
  note?: string;
  /** Drive from your submit handler so a double-tap can't double-subscribe. */
  loading?: boolean;
}

export function CtaWithEmailCapture({
  title,
  copy,
  placeholder = 'you@company.com',
  ctaLabel = 'Subscribe',
  note,
  loading = false,
}: CtaWithEmailCaptureProps): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <form className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row" action="#" method="post">
        <label className="sr-only" htmlFor="cta-email">
          Email address
        </label>
        <input
          id="cta-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          required
          className="w-full min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {loading ? 'Subscribing…' : ctaLabel}
        </button>
      </form>

      {note ? <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{note}</p> : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-stats-band',
    category: 'cta',
    tags: ['cta', 'stats', 'metrics', 'social-proof', 'band'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1480, copies: 388, downloads: 101 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'stats', type: 'Array<{ value: string; label: string }>', descriptionKey: 'stats' },
    ],
    code: {
      tailwind: `<!--
  Each metric is a <dl> pair with the value shown first via order-* while the
  DOM keeps dt-then-dd, so it still reads correctly to a screen reader. The grid
  is two columns on phones and four from sm: up, so four big numbers never get
  crushed into one unreadable row.
-->
<section class="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
  <div class="flex flex-col items-center gap-8 text-center">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        Trusted by teams that ship
      </h2>
      <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
        Join thousands of teams already building on the platform.
      </p>
      <div class="mt-7">
        <a
          href="#"
          class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Get started
        </a>
      </div>
    </div>

    <dl class="grid w-full grid-cols-2 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-4 dark:border-gray-800">
      <div class="flex flex-col">
        <dt class="order-2 text-sm text-gray-600 dark:text-gray-400">Active teams</dt>
        <dd class="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">12k+</dd>
      </div>
      <div class="flex flex-col">
        <dt class="order-2 text-sm text-gray-600 dark:text-gray-400">Uptime</dt>
        <dd class="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">99.99%</dd>
      </div>
      <div class="flex flex-col">
        <dt class="order-2 text-sm text-gray-600 dark:text-gray-400">Deploys / day</dt>
        <dd class="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">2.4M</dd>
      </div>
      <div class="flex flex-col">
        <dt class="order-2 text-sm text-gray-600 dark:text-gray-400">Countries</dt>
        <dd class="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">90+</dd>
      </div>
    </dl>
  </div>
</section>`,
      react: `const DEFAULT_STATS = [
  { value: '12k+', label: 'Active teams' },
  { value: '99.99%', label: 'Uptime' },
  { value: '2.4M', label: 'Deploys / day' },
  { value: '90+', label: 'Countries' },
];

export function CtaStatsBand({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  stats = DEFAULT_STATS,
}) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {copy}
            </p>
          ) : null}
          <div className="mt-7">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <dl className="grid w-full grid-cols-2 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-4 dark:border-gray-800">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
              <dd className="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}`,
      typescript: `export interface CtaStat {
  value: string;
  label: string;
}

export interface CtaStatsBandProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  stats?: CtaStat[];
}

const DEFAULT_STATS: CtaStat[] = [
  { value: '12k+', label: 'Active teams' },
  { value: '99.99%', label: 'Uptime' },
  { value: '2.4M', label: 'Deploys / day' },
  { value: '90+', label: 'Countries' },
];

export function CtaStatsBand({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  stats = DEFAULT_STATS,
}: CtaStatsBandProps): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {copy}
            </p>
          ) : null}
          <div className="mt-7">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <dl className="grid w-full grid-cols-2 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-4 dark:border-gray-800">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
              <dd className="order-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-dark-glow',
    category: 'cta',
    tags: ['cta', 'dark', 'glow', 'radial', 'gradient'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1930, copies: 571, downloads: 160 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'secondaryCtaLabel', type: 'string', descriptionKey: 'secondaryCtaLabel' },
      { name: 'secondaryCtaHref', type: 'string', default: "'#'", descriptionKey: 'secondaryCtaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The section paints its own near-black surface and a blurred radial glow, so it
  looks identical on a light or a dark page and needs no dark: variants. The
  glow is aria-hidden and sits behind the content on the z-axis; the button
  rings are offset against gray-950, the surface they actually sit on.
-->
<section class="relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-950">
  <div class="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true"></div>

  <div class="px-6 py-14 text-center sm:px-10 sm:py-20">
    <h2 class="text-2xl font-bold tracking-tight text-white sm:text-4xl">
      Build in the dark, ship in the light
    </h2>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">
      A focused workspace for teams that would rather ship than configure.
    </p>

    <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        href="#"
        class="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
      >
        Get started
      </a>
      <a
        href="#"
        class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
      >
        Read the docs
      </a>
    </div>
  </div>
</section>`,
      react: `export function CtaDarkGlow({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}) {
  return (
    <section className={\`relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-950 \${className}\`}>
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-10 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel ? (
            <a
              href={secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaDarkGlowProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function CtaDarkGlow({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: CtaDarkGlowProps): JSX.Element {
  return (
    <section className={\`relative isolate mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-gray-950 \${className}\`}>
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-10 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel ? (
            <a
              href={secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-two-button',
    category: 'cta',
    tags: ['cta', 'buttons', 'decision', 'dual', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1390, copies: 361, downloads: 95 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'primaryLabel', type: 'string', default: "'Start free'", descriptionKey: 'primaryLabel' },
      { name: 'primaryHref', type: 'string', default: "'#'", descriptionKey: 'primaryHref' },
      { name: 'secondaryLabel', type: 'string', default: "'Book a demo'", descriptionKey: 'secondaryLabel' },
      { name: 'secondaryHref', type: 'string', default: "'#'", descriptionKey: 'secondaryHref' },
    ],
    code: {
      tailwind: `<!--
  Two paths of equal visual weight: a filled primary and a bordered secondary,
  each sm:min-w-[11rem] so they read as a genuine either/or rather than a button
  with an afterthought. They stack full-width below sm.
-->
<section class="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
    Pick the path that fits your team
  </h2>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
    Self-serve in minutes, or let us walk you through it - either way, no card up front.
  </p>

  <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
    <a
      href="#"
      class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Start free
    </a>
    <a
      href="#"
      class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Book a demo
    </a>
  </div>
</section>`,
      react: `export function CtaTwoButton({
  title,
  copy,
  primaryLabel = 'Start free',
  primaryHref = '#',
  secondaryLabel = 'Book a demo',
  secondaryHref = '#',
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={primaryHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {primaryLabel}
        </a>
        <a
          href={secondaryHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {secondaryLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaTwoButtonProps {
  title: ReactNode;
  copy?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaTwoButton({
  title,
  copy,
  primaryLabel = 'Start free',
  primaryHref = '#',
  secondaryLabel = 'Book a demo',
  secondaryHref = '#',
}: CtaTwoButtonProps): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={primaryHref}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {primaryLabel}
        </a>
        <a
          href={secondaryHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto sm:min-w-[11rem] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {secondaryLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-card-floating',
    category: 'cta',
    tags: ['cta', 'card', 'elevated', 'shadow', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1550, copies: 402, downloads: 110 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  An elevated card that reads as lifted off the page: a ring plus a soft shadow.
  The shadow is tuned per theme (gray-900/5 on light, black/20 on dark) because
  a light-mode shadow is invisible on a dark surface.
-->
<section class="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
  <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-900/5 ring-1 ring-black/5 sm:p-12 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 dark:ring-white/10">
    <div class="mx-auto max-w-xl text-center">
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        Your next release starts here
      </h2>
      <p class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
        Spin up a project, invite the team and ship - all before your coffee cools.
      </p>
      <div class="mt-7 flex justify-center">
        <a
          href="#"
          class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Get started
        </a>
      </div>
    </div>
  </div>
</section>`,
      react: `export function CtaCardFloating({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 \${className}\`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-900/5 ring-1 ring-black/5 sm:p-12 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 dark:ring-white/10">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          ) : null}
          <div className="mt-7 flex justify-center">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaCardFloatingProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function CtaCardFloating({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: CtaCardFloatingProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 \${className}\`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-900/5 ring-1 ring-black/5 sm:p-12 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/20 dark:ring-white/10">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            {title}
          </h2>
          {copy ? (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          ) : null}
          <div className="mt-7 flex justify-center">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-full-bleed-pattern',
    category: 'cta',
    tags: ['cta', 'pattern', 'full-bleed', 'scrim', 'dots'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1670, copies: 445, downloads: 122 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Full-bleed (w-full, no max-w) so it spans edge to edge. Three layers: a CSS
  dot pattern, a vertical scrim gradient, then the content. The scrim is
  load-bearing - the dots vary the surface luminance, so a gradient overlay is
  what holds white text at 4.5:1 across the whole band.
-->
<section class="relative isolate w-full overflow-hidden bg-gray-900">
  <div class="absolute inset-0 -z-20 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true"></div>
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/70 to-gray-900/95" aria-hidden="true"></div>

  <div class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
    <h2 class="text-2xl font-bold tracking-tight text-white sm:text-4xl">
      Ship it. We'll handle the rest.
    </h2>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">
      Push to main and watch it deploy - no pipelines to babysit, no servers to patch.
    </p>

    <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a
        href="#"
        class="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
      >
        Get started
      </a>
    </div>
  </div>
</section>`,
      react: `export function CtaFullBleedPattern({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`relative isolate w-full overflow-hidden bg-gray-900 \${className}\`}>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true" />
      {/* The scrim holds white text at 4.5:1 across a patterned surface. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/70 to-gray-900/95" aria-hidden="true" />

      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CtaFullBleedPatternProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function CtaFullBleedPattern({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: CtaFullBleedPatternProps): JSX.Element {
  return (
    <section className={\`relative isolate w-full overflow-hidden bg-gray-900 \${className}\`}>
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px]" aria-hidden="true" />
      {/* The scrim holds white text at 4.5:1 across a patterned surface. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/70 to-gray-900/95" aria-hidden="true" />

      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'cta-app-download',
    category: 'cta',
    tags: ['cta', 'app', 'download', 'app-store', 'google-play'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1760, copies: 489, downloads: 138 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'appStoreHref', type: 'string', default: "'#'", descriptionKey: 'appStoreHref' },
      { name: 'playStoreHref', type: 'string', default: "'#'", descriptionKey: 'playStoreHref' },
    ],
    code: {
      tailwind: `<!--
  Store badges built from inline SVG, not a shipped image - nothing to preload or
  let rot. Each badge is one <a>; the two-line label inside gives it a real
  accessible name ("Download on the App Store"), so the SVG glyph stays
  aria-hidden. The badges go full-width and stack below sm.
-->
<section class="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
    Take it with you
  </h2>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
    The full workspace in your pocket - free on iOS and Android.
  </p>

  <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
    <a
      href="#"
      class="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <svg class="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.06-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      <span class="text-left leading-none">
        <span class="block text-[0.625rem] font-medium opacity-80">Download on the</span>
        <span class="mt-0.5 block text-lg font-semibold">App Store</span>
      </span>
    </a>

    <a
      href="#"
      class="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      <svg class="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 4 3.5z" />
      </svg>
      <span class="text-left leading-none">
        <span class="block text-[0.625rem] font-medium opacity-80">Get it on</span>
        <span class="mt-0.5 block text-lg font-semibold">Google Play</span>
      </span>
    </a>
  </div>
</section>`,
      react: `export function CtaAppDownload({
  title,
  copy,
  appStoreHref = '#',
  playStoreHref = '#',
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={appStoreHref}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.06-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[0.625rem] font-medium opacity-80">Download on the</span>
            <span className="mt-0.5 block text-lg font-semibold">App Store</span>
          </span>
        </a>

        <a
          href={playStoreHref}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 4 3.5z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[0.625rem] font-medium opacity-80">Get it on</span>
            <span className="mt-0.5 block text-lg font-semibold">Google Play</span>
          </span>
        </a>
      </div>
    </section>
  );
}`,
      typescript: `export interface CtaAppDownloadProps {
  title: string;
  copy?: string;
  appStoreHref?: string;
  playStoreHref?: string;
}

export function CtaAppDownload({
  title,
  copy,
  appStoreHref = '#',
  playStoreHref = '#',
}: CtaAppDownloadProps): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={appStoreHref}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.06-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[0.625rem] font-medium opacity-80">Download on the</span>
            <span className="mt-0.5 block text-lg font-semibold">App Store</span>
          </span>
        </a>

        <a
          href={playStoreHref}
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gray-900 px-5 py-3 text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          <svg className="h-7 w-7 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 3.5v17a1 1 0 0 0 1.5.87l14-8.5a1 1 0 0 0 0-1.74l-14-8.5A1 1 0 0 0 4 3.5z" />
          </svg>
          <span className="text-left leading-none">
            <span className="block text-[0.625rem] font-medium opacity-80">Get it on</span>
            <span className="mt-0.5 block text-lg font-semibold">Google Play</span>
          </span>
        </a>
      </div>
    </section>
  );
}`,
    },
  },
];
