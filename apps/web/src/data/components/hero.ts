import type { ComponentEntry } from './types';

/**
 * Hero category.
 *
 * Five structurally different heroes, not five recolours of one: a centred
 * stack, a two-column split, an animated gradient, an inline email capture, and
 * a video backdrop. The interesting constraint is shared: the moment a hero
 * stops painting a flat surface and starts putting text over a gradient, an
 * image or a video, contrast stops being a colour choice and becomes a
 * structural one - hence the scrim layer in `hero-gradient-bg` and
 * `hero-video-bg`. It is not decoration; it is the only thing guaranteeing 4.5:1
 * over pixels the component does not control.
 */
export const heroComponents: ComponentEntry[] = [
  {
    slug: 'hero-centered',
    category: 'hero',
    tags: ['hero', 'centered', 'cta', 'badge', 'landing'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-12',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3120, copies: 884, downloads: 231 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker', example: 'New - v2.0 is out' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start free trial'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The eyebrow is a <p>, not a heading. It reads as a label above the title, but
  promoting it to <h2> would put a heading *before* the <h1> and break the
  document outline for anyone navigating by headings.
-->
<section class="hero-centered">
  <p class="hero-centered__kicker">
    <span class="hero-centered__dot" aria-hidden="true"></span>
    New - v2.0 is out
  </p>
  <h1 class="hero-centered__title">Ship your product, not your infrastructure</h1>
  <p class="hero-centered__copy">
    Everything you need to launch, measure and scale - in one place, with no
    servers to babysit.
  </p>
  <div class="hero-centered__actions">
    <a class="hero-centered__cta" href="#">Start free trial</a>
    <a class="hero-centered__cta hero-centered__cta--secondary" href="#">Book a demo</a>
  </div>
</section>`,
      css: `.hero-centered {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  text-align: center;
}

.hero-centered__kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.25rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background-color: #f9fafb;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
}

.hero-centered__dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: #2563eb;
}

.hero-centered__title {
  /* Fluid rather than a breakpoint jump: the hero is the one block that has to
     survive a 390px phone and a 1440px desktop with the same markup. */
  margin: 1.25rem 0 0;
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #111827;
}

.hero-centered__copy {
  max-width: 36rem;
  margin: 1rem auto 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
  color: #4b5563;
}

.hero-centered__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

@media (min-width: 640px) {
  .hero-centered__actions {
    flex-direction: row;
  }
}

.hero-centered__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.625rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms;
}

@media (min-width: 640px) {
  .hero-centered__cta {
    width: auto;
  }
}

.hero-centered__cta:hover {
  background-color: #1d4ed8;
}

.hero-centered__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.hero-centered__cta--secondary {
  border-color: #d1d5db;
  background-color: transparent;
  color: #374151;
}

.hero-centered__cta--secondary:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/*
 * The hero paints no surface of its own - it sits on the page background - so
 * every text colour here inherits the theme and has to be re-tuned. The primary
 * CTA is the exception: it brings its own blue and its white label clears AA on
 * either theme, so only its focus ring moves.
 */
@media (prefers-color-scheme: dark) {
  .hero-centered__kicker {
    border-color: #1f2937;
    background-color: #111827;
    color: #d1d5db;
  }

  .hero-centered__dot {
    background-color: #60a5fa;
  }

  .hero-centered__title {
    color: #f3f4f6;
  }

  .hero-centered__copy {
    color: #9ca3af;
  }

  .hero-centered__cta:focus-visible {
    outline-color: #60a5fa;
  }

  .hero-centered__cta--secondary {
    border-color: #374151;
    color: #d1d5db;
  }

  .hero-centered__cta--secondary:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-centered__cta {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20">
  <p class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
    <span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
    New - v2.0 is out
  </p>

  <h1 class="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Ship your product, not your infrastructure
  </h1>

  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
    Everything you need to launch, measure and scale - in one place, with no
    servers to babysit.
  </p>

  <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
    <a
      href="#"
      class="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Start free trial
    </a>
    <a
      href="#"
      class="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Book a demo
    </a>
  </div>
</section>`,
      react: `export function HeroCentered({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 \${className}\`}>
      {kicker ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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
      nextjs: `import type { ReactNode } from 'react';

interface HeroCenteredProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

// No 'use client' - the hero holds no state. Hover and focus are pure CSS, so
// it renders as a Server Component and ships no JS at all.
export function HeroCentered({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: HeroCenteredProps) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 \${className}\`}>
      {kicker ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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

export interface HeroCenteredProps {
  /** The page's h1. There must be exactly one of these per document. */
  title: ReactNode;
  /** Eyebrow above the title. A <p>, not a heading - see the markup. */
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function HeroCentered({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: HeroCenteredProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20 \${className}\`}>
      {kicker ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={ctaHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
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
    slug: 'hero-split-image',
    category: 'hero',
    tags: ['hero', 'split', 'image', 'two-column', 'responsive'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-02',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.1.0',
    featured: true,
    stats: { views: 4010, copies: 1102, downloads: 297 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'imageSrc', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
    ],
    code: {
      html: `<!--
  Copy first in the DOM, image second. On mobile the columns stack in source
  order, which is what you want: the headline should be the first thing read,
  not a 300px picture the reader has to scroll past.
-->
<section class="hero-split">
  <div class="hero-split__copy">
    <p class="hero-split__kicker">Analytics</p>
    <h1 class="hero-split__title">See what your customers actually do</h1>
    <p class="hero-split__text">
      Session-level insight without a tag manager, a data team, or a six-week
      rollout.
    </p>
    <a class="hero-split__cta" href="#">Get started</a>
  </div>

  <div class="hero-split__media">
    <!-- alt="" because the headline beside it already carries the meaning;
         a description here would be read out twice. -->
    <img class="hero-split__img" src="/images/dashboard.svg" alt="" width="560" height="420" />
  </div>
</section>`,
      css: `.hero-split {
  display: grid;
  gap: 2rem;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  align-items: center;
}

/* One column below 768px - the stack, not the split, is the default. */
@media (min-width: 768px) {
  .hero-split {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 4rem 1.5rem;
  }
}

.hero-split__kicker {
  margin: 0;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-split__title {
  margin: 0.75rem 0 0;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #111827;
}

.hero-split__text {
  max-width: 32rem;
  margin: 1rem 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
}

.hero-split__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms;
}

.hero-split__cta:hover {
  background-color: #1d4ed8;
}

.hero-split__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.hero-split__media {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #f9fafb;
}

.hero-split__img {
  display: block;
  width: 100%;
  /* Fixed ratio so the column does not collapse and then jolt when the image
     decodes - the classic hero layout shift. */
  aspect-ratio: 4 / 3;
  height: auto;
  object-fit: cover;
}

@media (prefers-color-scheme: dark) {
  .hero-split__kicker {
    color: #60a5fa;
  }

  .hero-split__title {
    color: #f3f4f6;
  }

  .hero-split__text {
    color: #9ca3af;
  }

  .hero-split__cta:focus-visible {
    outline-color: #60a5fa;
  }

  .hero-split__media {
    border-color: #1f2937;
    background-color: #111827;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-split__cta {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
      Analytics
    </p>

    <h1 class="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem] dark:text-gray-100">
      See what your customers actually do
    </h1>

    <p class="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
      Session-level insight without a tag manager, a data team, or a six-week
      rollout.
    </p>

    <a
      href="#"
      class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Get started
    </a>
  </div>

  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
    <img
      src="/images/dashboard.svg"
      alt=""
      width="560"
      height="420"
      class="block aspect-[4/3] w-full object-cover"
    />
  </div>
</section>`,
      react: `export function HeroSplitImage({
  title,
  kicker,
  copy,
  imageSrc,
  imageAlt = '',
  ctaLabel = 'Get started',
  ctaHref = '#',
}) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem] dark:text-gray-100">
          {title}
        </h1>

        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={560}
          height={420}
          className="block aspect-[4/3] w-full object-cover"
        />
      </div>
    </section>
  );
}`,
      nextjs: `import Image from 'next/image';
import type { ReactNode } from 'react';

interface HeroSplitImageProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  imageSrc: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

// Stateless - no 'use client'. next/image is used here rather than a bare <img>
// so the hero picture gets a priority preload and an automatic srcset; it is
// almost always the Largest Contentful Paint element on the page.
export function HeroSplitImage({
  title,
  kicker,
  copy,
  imageSrc,
  imageAlt = '',
  ctaLabel = 'Get started',
  ctaHref = '#',
}: HeroSplitImageProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem] dark:text-gray-100">
          {title}
        </h1>

        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={560}
          height={420}
          priority
          className="block aspect-[4/3] w-full object-cover"
        />
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroSplitImageProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  imageSrc: string;
  /** Leave empty when the headline beside it already carries the meaning. */
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function HeroSplitImage({
  title,
  kicker,
  copy,
  imageSrc,
  imageAlt = '',
  ctaLabel = 'Get started',
  ctaHref = '#',
}: HeroSplitImageProps): JSX.Element {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem] dark:text-gray-100">
          {title}
        </h1>

        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={560}
          height={420}
          className="block aspect-[4/3] w-full object-cover"
        />
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-gradient-bg',
    category: 'hero',
    tags: ['hero', 'gradient', 'animated', 'background', 'motion'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-21',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 2870, copies: 731, downloads: 188 },
    variants: [
      { id: 'gradient', labelKey: 'gradient' },
      { id: 'glow', labelKey: 'glow' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start building'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Three layers, and all three are load-bearing:
    1. the animated gradient (decorative, aria-hidden),
    2. a flat scrim over it,
    3. the content.
  The scrim is not a mood filter. An animated gradient moves through light and
  dark stops, so white text over the *raw* gradient passes contrast at one frame
  and fails at the next. The scrim is what makes 4.5:1 true at every frame.
-->
<section class="hero-gradient">
  <div class="hero-gradient__bg" aria-hidden="true"></div>
  <div class="hero-gradient__scrim" aria-hidden="true"></div>

  <div class="hero-gradient__content">
    <p class="hero-gradient__kicker">Now in public beta</p>
    <h1 class="hero-gradient__title">Build faster than you can spec it</h1>
    <p class="hero-gradient__copy">
      A single toolkit for the whole team - design, ship and measure without
      leaving the tab.
    </p>
    <a class="hero-gradient__cta" href="#">Start building</a>
  </div>
</section>`,
      css: `.hero-gradient {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  border-radius: 1rem;
}

.hero-gradient__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  /* 300% wide so there is somewhere to pan to. Animating background-position on
     an oversized gradient is compositor-cheap; animating the gradient stops
     themselves would repaint every frame. */
  background-image: linear-gradient(115deg, #1e1b4b, #1d4ed8, #4c1d95, #1e1b4b);
  background-size: 300% 300%;
  animation: hero-gradient-pan 18s ease infinite;
}

@keyframes hero-gradient-pan {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/*
 * Motion is the decoration; the gradient is the design. Reduced motion stops
 * the pan and leaves a static gradient - it does not strip the look.
 */
@media (prefers-reduced-motion: reduce) {
  .hero-gradient__bg {
    animation: none;
  }
}

.hero-gradient__scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.4);
}

.hero-gradient__content {
  padding: 3rem 1.5rem;
  text-align: center;
}

@media (min-width: 640px) {
  .hero-gradient__content {
    padding: 5rem 2rem;
  }
}

.hero-gradient__kicker {
  display: inline-block;
  margin: 0;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}

.hero-gradient__title {
  margin: 1.25rem 0 0;
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #fff;
}

.hero-gradient__copy {
  max-width: 36rem;
  margin: 1rem auto 0;
  font-size: 1rem;
  line-height: 1.6;
  /* Not rgba(255,255,255,0.7): translucent white over a *moving* gradient has a
     contrast ratio that changes with the frame. A solid near-white is
     predictable - it clears AA over the scrim no matter where the pan is. */
  color: #e5e7eb;
}

.hero-gradient__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.75rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms;
}

.hero-gradient__cta:hover {
  background-color: #e5e7eb;
}

.hero-gradient__cta:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

/*
 * No dark-mode block, on purpose. The hero paints its own dark surface and its
 * own scrim, so it looks identical on a white page and a black one - there is
 * nothing here that inherits the theme.
 */

@media (prefers-reduced-motion: reduce) {
  .hero-gradient__cta {
    transition: none;
  }
}`,
      tailwind: `<!--
  Tailwind has no utility that declares @keyframes, so the pan lives in a <style>
  block. Everything else - including the reduced-motion opt-out - is utilities.
-->
<style>
  @keyframes hero-gradient-pan {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
</style>

<section class="relative isolate w-full overflow-hidden rounded-2xl">
  <div
    class="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#1e1b4b,#1d4ed8,#4c1d95,#1e1b4b)] bg-[length:300%_300%] animate-[hero-gradient-pan_18s_ease_infinite] motion-reduce:animate-none"
    aria-hidden="true"
  ></div>
  <div class="absolute inset-0 -z-10 bg-black/40" aria-hidden="true"></div>

  <div class="px-6 py-12 text-center sm:px-8 sm:py-20">
    <p class="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
      Now in public beta
    </p>

    <h1 class="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
      Build faster than you can spec it
    </h1>

    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">
      A single toolkit for the whole team - design, ship and measure without
      leaving the tab.
    </p>

    <a
      href="#"
      class="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
    >
      Start building
    </a>
  </div>
</section>`,
      react: `const PAN_KEYFRAMES = \`
  @keyframes hero-gradient-pan {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
\`;

export function HeroGradientBg({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl \${className}\`}>
      {/* Keyframes travel with the component so it stays copy-pasteable -
          nothing to add to a global stylesheet or a Tailwind config. */}
      <style>{PAN_KEYFRAMES}</style>

      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#1e1b4b,#1d4ed8,#4c1d95,#1e1b4b)] bg-[length:300%_300%] animate-[hero-gradient-pan_18s_ease_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      />
      {/* The scrim is what guarantees 4.5:1 at every frame of the pan. */}
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

const PAN_KEYFRAMES = \`
  @keyframes hero-gradient-pan {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
\`;

interface HeroGradientBgProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

// No 'use client'. The animation is CSS and the reduced-motion opt-out is a
// media query - there is no state and no effect, so this stays a Server
// Component and the whole hero ships zero JS.
export function HeroGradientBg({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}: HeroGradientBgProps) {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl \${className}\`}>
      <style>{PAN_KEYFRAMES}</style>

      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#1e1b4b,#1d4ed8,#4c1d95,#1e1b4b)] bg-[length:300%_300%] animate-[hero-gradient-pan_18s_ease_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const PAN_KEYFRAMES = \`
  @keyframes hero-gradient-pan {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
\`;

export interface HeroGradientBgProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroGradientBg({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}: HeroGradientBgProps): JSX.Element {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl \${className}\`}>
      <style>{PAN_KEYFRAMES}</style>

      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#1e1b4b,#1d4ed8,#4c1d95,#1e1b4b)] bg-[length:300%_300%] animate-[hero-gradient-pan_18s_ease_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-with-form',
    category: 'hero',
    tags: ['hero', 'form', 'email', 'signup', 'conversion'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-09',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 2240, copies: 618, downloads: 154 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get early access'", descriptionKey: 'ctaLabel' },
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A real <form> with a real <label>. The label is visually hidden, not absent -
  placeholder text is not a label: it vanishes the moment you type, it is not
  reliably announced, and it leaves the field nameless to a screen reader.

  type="email" gets the right mobile keyboard and free browser validation;
  autocomplete="email" lets the browser fill it. Neither is optional polish on
  the one field standing between a visitor and a signup.
-->
<section class="hero-form">
  <p class="hero-form__kicker">Launching this autumn</p>
  <h1 class="hero-form__title">Get on the list</h1>
  <p class="hero-form__copy">
    One email when we open the doors. No drip campaign, no spam.
  </p>

  <form class="hero-form__form" action="/api/subscribe" method="post">
    <label class="hero-form__label" for="hero-form-email">Email address</label>
    <div class="hero-form__row">
      <input
        class="hero-form__input"
        id="hero-form-email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="you@company.com"
        required
      />
      <button class="hero-form__submit" type="submit">Get early access</button>
    </div>
  </form>

  <p class="hero-form__note">We only email once. Unsubscribe any time.</p>
</section>`,
      css: `.hero-form {
  width: 100%;
  max-width: 40rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  text-align: center;
}

.hero-form__kicker {
  margin: 0;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-form__title {
  margin: 0.75rem 0 0;
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #111827;
}

.hero-form__copy {
  margin: 1rem 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
}

.hero-form__form {
  margin-top: 1.75rem;
}

/* Hidden from sight, not from the accessibility tree. display:none or
   visibility:hidden would remove it from both and leave the input unnamed. */
.hero-form__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hero-form__row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* The "inline" capture is only inline when there is room for it. Below 640px
   the button goes full width under the field rather than squeezing both. */
@media (min-width: 640px) {
  .hero-form__row {
    flex-direction: row;
  }
}

.hero-form__input {
  flex: 1;
  min-width: 0;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
}

.hero-form__input::placeholder {
  color: #6b7280;
}

.hero-form__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-color: transparent;
}

.hero-form__submit {
  padding: 0.625rem 1.25rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.hero-form__submit:hover {
  background-color: #1d4ed8;
}

.hero-form__submit:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.hero-form__note {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .hero-form__kicker {
    color: #60a5fa;
  }

  .hero-form__title {
    color: #f3f4f6;
  }

  .hero-form__copy {
    color: #9ca3af;
  }

  .hero-form__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  /* #6b7280 on a dark field drops under 4.5:1 - placeholder text is content,
     not chrome, so it gets re-tuned like everything else. */
  .hero-form__input::placeholder {
    color: #9ca3af;
  }

  .hero-form__input:focus-visible,
  .hero-form__submit:focus-visible {
    outline-color: #60a5fa;
  }

  .hero-form__note {
    color: #9ca3af;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-form__submit {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-xl px-4 py-12 text-center sm:py-16">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
    Launching this autumn
  </p>

  <h1 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Get on the list
  </h1>

  <p class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
    One email when we open the doors. No drip campaign, no spam.
  </p>

  <form action="/api/subscribe" method="post" class="mt-7">
    <label for="hero-form-email" class="sr-only">Email address</label>
    <div class="flex flex-col gap-2 sm:flex-row">
      <input
        id="hero-form-email"
        name="email"
        type="email"
        autocomplete="email"
        placeholder="you@company.com"
        required
        class="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
      <button
        type="submit"
        class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Get early access
      </button>
    </div>
  </form>

  <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
    We only email once. Unsubscribe any time.
  </p>
</section>`,
      react: `import { useId, useState } from 'react';

export function HeroWithForm({
  title,
  kicker,
  copy,
  ctaLabel = 'Get early access',
  onSubmit,
  className = '',
}) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-7">
        {/* Visually hidden, not missing - sr-only keeps it in the a11y tree. */}
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        We only email once. Unsubscribe any time.
      </p>
    </section>
  );
}`,
      nextjs: `'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

interface HeroWithFormProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

// 'use client' is required here and only here among the heroes: the field is
// controlled, so this component owns state.
export function HeroWithForm({
  title,
  kicker,
  copy,
  ctaLabel = 'Get early access',
  loading = false,
  onSubmit,
  className = '',
}: HeroWithFormProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-7">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        We only email once. Unsubscribe any time.
      </p>
    </section>
  );
}`,
      typescript: `import { useId, useState, type FormEvent, type ReactNode } from 'react';

export interface HeroWithFormProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  /** Disables the submit and sets aria-busy while the request is in flight. */
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function HeroWithForm({
  title,
  kicker,
  copy,
  ctaLabel = 'Get early access',
  loading = false,
  onSubmit,
  className = '',
}: HeroWithFormProps): JSX.Element {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-7">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        We only email once. Unsubscribe any time.
      </p>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-video-bg',
    category: 'hero',
    tags: ['hero', 'video', 'background', 'scrim', 'poster'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-27',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1590, copies: 402, downloads: 121 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Watch the tour'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Four things make a background video legal rather than merely pretty:

  1. muted - autoplay without it is blocked by every browser anyway.
  2. playsinline - without it iOS hijacks the page into fullscreen playback.
  3. poster - the first paint, the fallback on a slow connection, and what the
     reduced-motion user sees instead of the video. It is not a placeholder.
  4. the scrim - a video is arbitrary moving pixels. There is no colour you can
     give the headline that survives a cut to a white frame. The scrim is the
     only reason the text has a contrast ratio at all.

  The video is aria-hidden and has no controls: it is decoration, and a
  decorative element must not be a tab stop.
-->
<section class="hero-video">
  <video
    class="hero-video__media"
    autoplay
    muted
    loop
    playsinline
    preload="none"
    poster="/media/hero-poster.jpg"
    aria-hidden="true"
    tabindex="-1"
  >
    <source src="/media/hero.webm" type="video/webm" />
    <source src="/media/hero.mp4" type="video/mp4" />
  </video>

  <div class="hero-video__scrim" aria-hidden="true"></div>

  <div class="hero-video__content">
    <p class="hero-video__kicker">Field tested</p>
    <h1 class="hero-video__title">Built for the days it all goes wrong</h1>
    <p class="hero-video__copy">
      Uptime you can point at, support that answers, and a rollback that takes
      one click.
    </p>
    <a class="hero-video__cta" href="#">Watch the tour</a>
  </div>
</section>`,
      css: `.hero-video {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  border-radius: 1rem;
  /* A dark base under the video: it is what shows while the poster loads, and
     it keeps the text legible for the one frame before either arrives. */
  background-color: #111827;
}

.hero-video__media {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*
 * Reduced motion means no autoplaying video, full stop - a looping backdrop is
 * exactly the kind of ambient motion the setting exists to stop. Hiding the
 * <video> element reveals the poster painted underneath, so the hero keeps its
 * picture and loses only the movement.
 *
 * Pair this with the JS below: CSS can hide the video but cannot pause it, and
 * a hidden video still decodes frames and burns battery.
 */
.hero-video__poster {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (prefers-reduced-motion: reduce) {
  .hero-video__media {
    display: none;
  }
}

.hero-video__scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  /* 60% rather than a tasteful 30%: the floor has to hold against a white
     frame, not against the average frame. */
  background-color: rgba(0, 0, 0, 0.6);
}

.hero-video__content {
  padding: 3rem 1.5rem;
  text-align: center;
}

@media (min-width: 640px) {
  .hero-video__content {
    padding: 5rem 2rem;
  }
}

.hero-video__kicker {
  display: inline-block;
  margin: 0;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 9999px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
}

.hero-video__title {
  margin: 1.25rem 0 0;
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #fff;
}

.hero-video__copy {
  max-width: 36rem;
  margin: 1rem auto 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #e5e7eb;
}

.hero-video__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.75rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms;
}

.hero-video__cta:hover {
  background-color: #e5e7eb;
}

.hero-video__cta:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

/*
 * No dark-mode block: the hero paints its own dark base and its own scrim, so
 * it is identical on a light page and a dark one.
 */

@media (prefers-reduced-motion: reduce) {
  .hero-video__cta {
    transition: none;
  }
}`,
      tailwind: `<section class="relative isolate w-full overflow-hidden rounded-2xl bg-gray-900">
  <!--
    motion-reduce:hidden swaps the video out for the poster underneath it. The
    scrim at black/60 is sized for the worst frame, not the average one.
  -->
  <video
    autoplay
    muted
    loop
    playsinline
    preload="none"
    poster="/media/hero-poster.jpg"
    aria-hidden="true"
    tabindex="-1"
    class="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
  >
    <source src="/media/hero.webm" type="video/webm" />
    <source src="/media/hero.mp4" type="video/mp4" />
  </video>

  <img
    src="/media/hero-poster.jpg"
    alt=""
    aria-hidden="true"
    class="absolute inset-0 -z-30 h-full w-full object-cover"
  />

  <div class="absolute inset-0 -z-10 bg-black/60" aria-hidden="true"></div>

  <div class="px-6 py-12 text-center sm:px-8 sm:py-20">
    <p class="inline-block rounded-full border border-white/35 px-3 py-1 text-xs font-semibold text-white">
      Field tested
    </p>

    <h1 class="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
      Built for the days it all goes wrong
    </h1>

    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">
      Uptime you can point at, support that answers, and a rollback that takes
      one click.
    </p>

    <a
      href="#"
      class="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
    >
      Watch the tour
    </a>
  </div>
</section>`,
      react: `import { useEffect, useRef } from 'react';

export function HeroVideoBg({
  title,
  kicker,
  copy,
  videoSrc,
  posterSrc,
  ctaLabel = 'Watch the tour',
  ctaHref = '#',
  className = '',
}) {
  const videoRef = useRef(null);

  // CSS can hide the video for a reduced-motion user but it cannot pause it,
  // and a hidden video keeps decoding frames. Pausing is the actual fix.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const video = videoRef.current;
      if (!video) return;
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-900 \${className}\`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={posterSrc}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/35 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface HeroVideoBgProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  videoSrc: string;
  posterSrc: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

// 'use client' because of the reduced-motion effect below. If you drop the
// pause behaviour and rely on motion-reduce:hidden alone, this can go back to
// being a Server Component - at the cost of a hidden video that still decodes.
export function HeroVideoBg({
  title,
  kicker,
  copy,
  videoSrc,
  posterSrc,
  ctaLabel = 'Watch the tour',
  ctaHref = '#',
  className = '',
}: HeroVideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (): void => {
      const video = videoRef.current;
      if (!video) return;
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-900 \${className}\`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={posterSrc}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* eslint-disable-next-line @next/next/no-img-element --
          the poster must be the same element the <video> paints over, and
          next/image wraps it in a span that breaks the -z-30 stacking. */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/35 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
      typescript: `import { useEffect, useRef, type ReactNode } from 'react';

export interface HeroVideoBgProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  /** Muted, looping, decorative. Keep it short and small - it is not content. */
  videoSrc: string;
  /** Required, not optional: it is the first paint, the slow-connection
   *  fallback, and what a reduced-motion user sees instead of the video. */
  posterSrc: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroVideoBg({
  title,
  kicker,
  copy,
  videoSrc,
  posterSrc,
  ctaLabel = 'Watch the tour',
  ctaHref = '#',
  className = '',
}: HeroVideoBgProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (): void => {
      const video = videoRef.current;
      if (!video) return;
      if (query.matches) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-900 \${className}\`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={posterSrc}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-20 h-full w-full object-cover motion-reduce:hidden"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/35 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-bento-grid',
    category: 'hero',
    tags: ['hero', 'bento', 'grid', 'features', 'landing'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'features', type: 'string[]', descriptionKey: 'features' },
      { name: 'ctaLabel', type: 'string', default: "'Explore the platform'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-2xl text-center">
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Platform</p>
    <h1 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
      One workspace for every team
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
      Docs, tasks and dashboards in a single, fast, keyboard-first surface.
    </p>
    <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Explore the platform
    </a>
  </div>

  <!-- The first tile spans two columns and two rows; the rest fill the 2x2 to
       its right. At the 2-col mobile base it becomes a full-width banner with a
       2x2 of small tiles beneath - the same cells, restacked, never overflowing. -->
  <div class="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
    <div class="col-span-2 flex min-h-[9rem] flex-col justify-end rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:row-span-2 sm:min-h-[15rem]">
      <span class="text-sm font-semibold text-white">Realtime docs</span>
    </div>
    <div class="flex min-h-[7rem] flex-col justify-end rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-4">
      <span class="text-sm font-semibold text-white">Tasks &amp; sprints</span>
    </div>
    <div class="flex min-h-[7rem] flex-col justify-end rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-4">
      <span class="text-sm font-semibold text-white">Automations</span>
    </div>
    <div class="flex min-h-[7rem] flex-col justify-end rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 p-4">
      <span class="text-sm font-semibold text-white">Live dashboards</span>
    </div>
    <div class="flex min-h-[7rem] flex-col justify-end rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 p-4">
      <span class="text-sm font-semibold text-white">Team inbox</span>
    </div>
  </div>
</section>`,
      react: `const TILE_STYLES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-fuchsia-500 to-purple-600',
  'from-sky-400 to-cyan-600',
];

const DEFAULT_FEATURES = [
  'Realtime docs',
  'Tasks & sprints',
  'Automations',
  'Live dashboards',
  'Team inbox',
];

export function HeroBentoGrid({
  title,
  kicker,
  copy,
  features = DEFAULT_FEATURES,
  ctaLabel = 'Explore the platform',
  ctaHref = '#',
  className = '',
}) {
  const tiles = features.slice(0, 5);
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 \${className}\`}>
      <div className="mx-auto max-w-2xl text-center">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          {title}
        </h1>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
        {tiles.map((label, i) => (
          <div
            key={label}
            className={\`flex flex-col justify-end rounded-2xl bg-gradient-to-br \${TILE_STYLES[i % TILE_STYLES.length]} p-4 \${
              i === 0 ? 'col-span-2 min-h-[9rem] sm:row-span-2 sm:min-h-[15rem]' : 'min-h-[7rem]'
            }\`}
          >
            <span className="text-sm font-semibold text-white">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const TILE_STYLES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-fuchsia-500 to-purple-600',
  'from-sky-400 to-cyan-600',
] as const;

const DEFAULT_FEATURES = [
  'Realtime docs',
  'Tasks & sprints',
  'Automations',
  'Live dashboards',
  'Team inbox',
];

export interface HeroBentoGridProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  /** Up to five tile labels; the first gets the large 2x2 cell. */
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroBentoGrid({
  title,
  kicker,
  copy,
  features = DEFAULT_FEATURES,
  ctaLabel = 'Explore the platform',
  ctaHref = '#',
  className = '',
}: HeroBentoGridProps): JSX.Element {
  const tiles = features.slice(0, 5);
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 \${className}\`}>
      <div className="mx-auto max-w-2xl text-center">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          {title}
        </h1>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:gap-4">
        {tiles.map((label, i) => (
          <div
            key={label}
            className={\`flex flex-col justify-end rounded-2xl bg-gradient-to-br \${TILE_STYLES[i % TILE_STYLES.length]} p-4 \${
              i === 0 ? 'col-span-2 min-h-[9rem] sm:row-span-2 sm:min-h-[15rem]' : 'min-h-[7rem]'
            }\`}
          >
            <span className="text-sm font-semibold text-white">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-stats',
    category: 'hero',
    tags: ['hero', 'stats', 'metrics', 'proof', 'landing'],
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
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'stats', type: 'Array<{ value: string; label: string }>', descriptionKey: 'stats' },
      { name: 'ctaLabel', type: 'string', default: "'Start free'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Trusted at scale</p>
  <h1 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Numbers teams grow into
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    From first commit to global rollout, the platform keeps up.
  </p>
  <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Start free
  </a>

  <!-- One column at 320px, two on small phones, four on desktop - the grid
       reflows rather than shrinking four numbers into an unreadable row. -->
  <dl class="mt-10 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
    <div class="flex flex-col items-center">
      <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">Active teams</dt>
      <dd class="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">12k+</dd>
    </div>
    <div class="flex flex-col items-center">
      <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">Uptime</dt>
      <dd class="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">99.99%</dd>
    </div>
    <div class="flex flex-col items-center">
      <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">Requests / day</dt>
      <dd class="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">840M</dd>
    </div>
    <div class="flex flex-col items-center">
      <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">Countries</dt>
      <dd class="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">70+</dd>
    </div>
  </dl>
</section>`,
      react: `const DEFAULT_STATS = [
  { value: '12k+', label: 'Active teams' },
  { value: '99.99%', label: 'Uptime' },
  { value: '840M', label: 'Requests / day' },
  { value: '70+', label: 'Countries' },
];

export function HeroStats({
  title,
  kicker,
  copy,
  stats = DEFAULT_STATS,
  ctaLabel = 'Start free',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      {/* A <dl> because these are label/value pairs; the value is visually first
          but the DOM order stays dt-then-dd via order-* so it reads correctly. */}
      <dl className="mt-10 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <dt className="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroStatsProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  stats?: HeroStat[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_STATS: HeroStat[] = [
  { value: '12k+', label: 'Active teams' },
  { value: '99.99%', label: 'Uptime' },
  { value: '840M', label: 'Requests / day' },
  { value: '70+', label: 'Countries' },
];

export function HeroStats({
  title,
  kicker,
  copy,
  stats = DEFAULT_STATS,
  ctaLabel = 'Start free',
  ctaHref = '#',
  className = '',
}: HeroStatsProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <dl className="mt-10 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <dt className="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="order-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-search',
    category: 'hero',
    tags: ['hero', 'search', 'input', 'directory', 'query'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'placeholder', type: 'string', default: "'Search 20,000+ templates…'", descriptionKey: 'placeholder' },
      { name: 'tags', type: 'string[]', descriptionKey: 'tags' },
      { name: 'onSearch', type: '(query: string) => void', descriptionKey: 'onSearch' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-2xl px-4 py-12 text-center sm:py-16">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Find the right component in seconds
  </h1>
  <p class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Search a growing library of accessible, responsive building blocks.
  </p>

  <form action="/search" method="get" class="mx-auto mt-7 max-w-xl" role="search">
    <label for="hero-search-input" class="sr-only">Search templates</label>
    <div class="flex flex-col gap-2 sm:flex-row">
      <div class="relative min-w-0 flex-1">
        <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </span>
        <input id="hero-search-input" name="q" type="search" placeholder="Search 20,000+ templates…" class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-3.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
      </div>
      <button type="submit" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        Search
      </button>
    </div>
  </form>

  <ul class="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
    <li class="text-gray-500 dark:text-gray-400">Popular:</li>
    <li><a href="#" class="rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Pricing</a></li>
    <li><a href="#" class="rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Dashboards</a></li>
    <li><a href="#" class="rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Forms</a></li>
  </ul>
</section>`,
      react: `import { useId, useState } from 'react';

const DEFAULT_TAGS = ['Pricing', 'Dashboards', 'Forms'];

export function HeroSearch({
  title,
  kicker,
  copy,
  placeholder = 'Search 20,000+ templates…',
  tags = DEFAULT_TAGS,
  onSearch,
  className = '',
}) {
  const inputId = useId();
  const [query, setQuery] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSearch?.(query);
  }

  return (
    <section className={\`mx-auto w-full max-w-2xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-xl" role="search">
        <label htmlFor={inputId} className="sr-only">
          Search templates
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              id={inputId}
              name="q"
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-3.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Search
          </button>
        </div>
      </form>

      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <li className="text-gray-500 dark:text-gray-400">Popular:</li>
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => {
                  setQuery(tag);
                  onSearch?.(tag);
                }}
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}`,
      typescript: `'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';

export interface HeroSearchProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  placeholder?: string;
  /** Quick-fill chips under the field. */
  tags?: string[];
  onSearch?: (query: string) => void;
  className?: string;
}

const DEFAULT_TAGS = ['Pricing', 'Dashboards', 'Forms'];

export function HeroSearch({
  title,
  kicker,
  copy,
  placeholder = 'Search 20,000+ templates…',
  tags = DEFAULT_TAGS,
  onSearch,
  className = '',
}: HeroSearchProps): JSX.Element {
  const inputId = useId();
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch?.(query);
  }

  return (
    <section className={\`mx-auto w-full max-w-2xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-xl" role="search">
        <label htmlFor={inputId} className="sr-only">
          Search templates
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              id={inputId}
              name="q"
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-3.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Search
          </button>
        </div>
      </form>

      {tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <li className="text-gray-500 dark:text-gray-400">Popular:</li>
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => {
                  setQuery(tag);
                  onSearch?.(tag);
                }}
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-logos-strip',
    category: 'hero',
    tags: ['hero', 'logos', 'social-proof', 'trust', 'brands'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'muted', labelKey: 'muted' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'proofLabel', type: 'string', default: "'Trusted by teams at'", descriptionKey: 'proofLabel' },
      { name: 'logos', type: 'string[]', descriptionKey: 'logos' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    The backbone of modern product teams
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Ship confidently on infrastructure the best companies already rely on.
  </p>
  <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Get started
  </a>

  <p class="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Trusted by teams at</p>
  <!-- Wordmarks, not image logos - they wrap and centre at any width and never
       ship a broken <img>. Swap for real SVGs when you have brand assets. -->
  <ul class="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
    <li class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Northwind</li>
    <li class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Adysre</li>
    <li class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Globex</li>
    <li class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Umbrella</li>
    <li class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Initech</li>
  </ul>
</section>`,
      react: `const DEFAULT_LOGOS = ['Northwind', 'Adysre', 'Globex', 'Umbrella', 'Initech'];

export function HeroLogosStrip({
  title,
  kicker,
  copy,
  proofLabel = 'Trusted by teams at',
  logos = DEFAULT_LOGOS,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {proofLabel}
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {logos.map((logo) => (
          <li key={logo} className="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">
            {logo}
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroLogosStripProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  proofLabel?: string;
  /** Brand names rendered as wordmarks. Replace with SVGs when available. */
  logos?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_LOGOS = ['Northwind', 'Adysre', 'Globex', 'Umbrella', 'Initech'];

export function HeroLogosStrip({
  title,
  kicker,
  copy,
  proofLabel = 'Trusted by teams at',
  logos = DEFAULT_LOGOS,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: HeroLogosStripProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {proofLabel}
      </p>
      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {logos.map((logo) => (
          <li key={logo} className="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">
            {logo}
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-app-screenshot',
    category: 'hero',
    tags: ['hero', 'screenshot', 'product', 'mockup', 'saas'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start building'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Your whole workflow, one screen
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    A calm, fast interface that gets out of the way so the work stays in view.
  </p>
  <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Start building
  </a>

  <!-- A pure-CSS browser chrome so the hero ships no screenshot to go stale.
       aria-hidden: it is an illustration of the product, not content. -->
  <div class="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900" aria-hidden="true">
    <div class="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
      <span class="h-3 w-3 rounded-full bg-red-400"></span>
      <span class="h-3 w-3 rounded-full bg-amber-400"></span>
      <span class="h-3 w-3 rounded-full bg-green-400"></span>
      <span class="ml-3 hidden h-5 flex-1 rounded bg-gray-200 sm:block dark:bg-gray-800"></span>
    </div>
    <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[8rem_1fr]">
      <div class="hidden space-y-2 sm:block">
        <span class="block h-6 rounded bg-gradient-to-r from-blue-500 to-indigo-500"></span>
        <span class="block h-4 rounded bg-gray-100 dark:bg-gray-800"></span>
        <span class="block h-4 rounded bg-gray-100 dark:bg-gray-800"></span>
        <span class="block h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800"></span>
      </div>
      <div class="space-y-3 text-left">
        <div class="grid grid-cols-3 gap-3">
          <span class="h-14 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500"></span>
          <span class="h-14 rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500"></span>
          <span class="h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500"></span>
        </div>
        <span class="block h-24 rounded-lg bg-gray-100 dark:bg-gray-800"></span>
      </div>
    </div>
  </div>
</section>`,
      react: `export function HeroAppScreenshot({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      {/* Pure-CSS chrome, aria-hidden - an illustration of the product, not content. */}
      <div
        className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 hidden h-5 flex-1 rounded bg-gray-200 sm:block dark:bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[8rem_1fr]">
          <div className="hidden space-y-2 sm:block">
            <span className="block h-6 rounded bg-gradient-to-r from-blue-500 to-indigo-500" />
            <span className="block h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="block h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="block h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="space-y-3 text-left">
            <div className="grid grid-cols-3 gap-3">
              <span className="h-14 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500" />
              <span className="h-14 rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500" />
              <span className="h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500" />
            </div>
            <span className="block h-24 rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroAppScreenshotProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroAppScreenshot({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}: HeroAppScreenshotProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <div
        className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="ml-3 hidden h-5 flex-1 rounded bg-gray-200 sm:block dark:bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[8rem_1fr]">
          <div className="hidden space-y-2 sm:block">
            <span className="block h-6 rounded bg-gradient-to-r from-blue-500 to-indigo-500" />
            <span className="block h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="block h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <span className="block h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="space-y-3 text-left">
            <div className="grid grid-cols-3 gap-3">
              <span className="h-14 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-500" />
              <span className="h-14 rounded-lg bg-gradient-to-br from-violet-400 to-fuchsia-500" />
              <span className="h-14 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500" />
            </div>
            <span className="block h-24 rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-animated-words',
    category: 'hero',
    tags: ['hero', 'animated', 'rotating', 'words', 'motion'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'static', labelKey: 'static' },
    ],
    props: [
      { name: 'lead', type: 'string', required: true, descriptionKey: 'lead' },
      { name: 'words', type: 'string[]', descriptionKey: 'words' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A CSS-only word rotator. The column of words is translated up one line per
  step; a copy of the first word is appended so the loop from last back to first
  is seamless rather than a snap. The keyframes are written for four words -
  change the count and you change the step maths, so keep them in sync.
  motion-reduce:animate-none freezes it on the first word, which stays legible.
-->
<style>
  @keyframes hero-word-rotate {
    0%, 16%   { transform: translateY(0); }
    25%, 41%  { transform: translateY(-100%); }
    50%, 66%  { transform: translateY(-200%); }
    75%, 91%  { transform: translateY(-300%); }
    100%      { transform: translateY(-400%); }
  }
</style>

<section class="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-20">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Software that
    <span class="relative inline-flex h-[1.15em] overflow-hidden align-bottom text-blue-600 dark:text-blue-400">
      <span class="flex flex-col animate-[hero-word-rotate_9s_infinite] motion-reduce:animate-none">
        <span class="flex h-[1.15em] items-center leading-none">ships</span>
        <span class="flex h-[1.15em] items-center leading-none">scales</span>
        <span class="flex h-[1.15em] items-center leading-none">adapts</span>
        <span class="flex h-[1.15em] items-center leading-none">delights</span>
        <span class="flex h-[1.15em] items-center leading-none">ships</span>
      </span>
    </span>
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    One platform that keeps pace with your team, whatever you are building.
  </p>
  <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Get started
  </a>
</section>`,
      react: `const ROTATE_KEYFRAMES = \`
  @keyframes hero-word-rotate {
    0%, 16%   { transform: translateY(0); }
    25%, 41%  { transform: translateY(-100%); }
    50%, 66%  { transform: translateY(-200%); }
    75%, 91%  { transform: translateY(-300%); }
    100%      { transform: translateY(-400%); }
  }
\`;

const DEFAULT_WORDS = ['ships', 'scales', 'adapts', 'delights'];

export function HeroAnimatedWords({
  lead,
  words = DEFAULT_WORDS,
  kicker,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-20 \${className}\`}>
      {/* Keyframes travel with the component - nothing to add to a config. */}
      <style>{ROTATE_KEYFRAMES}</style>

      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {lead}{' '}
        <span className="relative inline-flex h-[1.15em] overflow-hidden align-bottom text-blue-600 dark:text-blue-400">
          <span className="flex flex-col animate-[hero-word-rotate_9s_infinite] motion-reduce:animate-none">
            {[...words, words[0]].map((word, i) => (
              <span key={i} className="flex h-[1.15em] items-center leading-none">
                {word}
              </span>
            ))}
          </span>
        </span>
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const ROTATE_KEYFRAMES = \`
  @keyframes hero-word-rotate {
    0%, 16%   { transform: translateY(0); }
    25%, 41%  { transform: translateY(-100%); }
    50%, 66%  { transform: translateY(-200%); }
    75%, 91%  { transform: translateY(-300%); }
    100%      { transform: translateY(-400%); }
  }
\`;

export interface HeroAnimatedWordsProps {
  /** The fixed part of the headline, before the rotating word. */
  lead: ReactNode;
  /** Designed for four words - the keyframes step through exactly four. */
  words?: string[];
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_WORDS = ['ships', 'scales', 'adapts', 'delights'];

export function HeroAnimatedWords({
  lead,
  words = DEFAULT_WORDS,
  kicker,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: HeroAnimatedWordsProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-20 \${className}\`}>
      <style>{ROTATE_KEYFRAMES}</style>

      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {lead}{' '}
        <span className="relative inline-flex h-[1.15em] overflow-hidden align-bottom text-blue-600 dark:text-blue-400">
          <span className="flex flex-col animate-[hero-word-rotate_9s_infinite] motion-reduce:animate-none">
            {[...words, words[0]].map((word, i) => (
              <span key={i} className="flex h-[1.15em] items-center leading-none">
                {word}
              </span>
            ))}
          </span>
        </span>
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-dark-glow',
    category: 'hero',
    tags: ['hero', 'dark', 'glow', 'radial', 'gradient'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'violet', labelKey: 'violet' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start free'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'secondaryCtaLabel', type: 'string', descriptionKey: 'secondaryCtaLabel' },
      { name: 'secondaryCtaHref', type: 'string', default: "'#'", descriptionKey: 'secondaryCtaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The hero paints its own near-black surface and its own glow, so it looks
  identical on a light page or a dark one - no dark: variants needed. The glow is
  a radial blur layer, aria-hidden and behind the content on the z-axis. -->
<section class="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950">
  <div class="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/40 blur-3xl sm:h-96 sm:w-96" aria-hidden="true"></div>

  <div class="px-6 py-14 text-center sm:px-8 sm:py-24">
    <p class="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200">Now in beta</p>
    <h1 class="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
      The dark-mode-native command center
    </h1>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">
      Built for the people who live in their terminal and never turn the lights on.
    </p>
    <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a href="#" class="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto">
        Start free
      </a>
      <a href="#" class="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto">
        Read the docs
      </a>
    </div>
  </div>
</section>`,
      react: `export function HeroDarkGlow({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}) {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 \${className}\`}>
      <div
        className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/40 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-24">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200">
            {kicker}
          </p>
        ) : null}
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">{copy}</p>
        ) : null}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel ? (
            <a
              href={secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
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

export interface HeroDarkGlowProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export function HeroDarkGlow({
  title,
  kicker,
  copy,
  ctaLabel = 'Start free',
  ctaHref = '#',
  secondaryCtaLabel,
  secondaryCtaHref = '#',
  className = '',
}: HeroDarkGlowProps): JSX.Element {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 \${className}\`}>
      <div
        className="absolute left-1/2 top-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/40 blur-3xl sm:h-96 sm:w-96"
        aria-hidden="true"
      />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-24">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-gray-200">
            {kicker}
          </p>
        ) : null}
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">{copy}</p>
        ) : null}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
          >
            {ctaLabel}
          </a>
          {secondaryCtaLabel ? (
            <a
              href={secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-gray-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none sm:w-auto"
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
    slug: 'hero-split-checklist',
    category: 'hero',
    tags: ['hero', 'split', 'checklist', 'benefits', 'two-column'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'items', type: 'string[]', descriptionKey: 'items' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Migrate in a day</p>
    <h1 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
      Everything you need, nothing you don't
    </h1>
    <p class="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
      Move your stack over without the month-long project and the change freeze.
    </p>
    <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Get started
    </a>
  </div>

  <!-- The checkmark is decorative (aria-hidden): each row is already,
       semantically, a satisfied item in a list. -->
  <ul class="space-y-3">
    <li class="flex items-start gap-3">
      <span class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z" clip-rule="evenodd" /></svg>
      </span>
      <span class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">No-downtime data import</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z" clip-rule="evenodd" /></svg>
      </span>
      <span class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">SSO and SCIM on every plan</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z" clip-rule="evenodd" /></svg>
      </span>
      <span class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">Usage-based pricing, no seats</span>
    </li>
    <li class="flex items-start gap-3">
      <span class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z" clip-rule="evenodd" /></svg>
      </span>
      <span class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">24/7 human support</span>
    </li>
  </ul>
</section>`,
      react: `const DEFAULT_ITEMS = [
  'No-downtime data import',
  'SSO and SCIM on every plan',
  'Usage-based pricing, no seats',
  '24/7 human support',
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HeroSplitChecklist({
  title,
  kicker,
  copy,
  items = DEFAULT_ITEMS,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16 \${className}\`}>
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h1>
        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroSplitChecklistProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  items?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const DEFAULT_ITEMS = [
  'No-downtime data import',
  'SSO and SCIM on every plan',
  'Usage-based pricing, no seats',
  '24/7 human support',
];

function CheckIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 10.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function HeroSplitChecklist({
  title,
  kicker,
  copy,
  items = DEFAULT_ITEMS,
  ctaLabel = 'Get started',
  ctaHref = '#',
  className = '',
}: HeroSplitChecklistProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16 \${className}\`}>
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h1>
        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-cards-collage',
    category: 'hero',
    tags: ['hero', 'collage', 'cards', 'testimonial', 'grid'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'cards', type: 'Array<{ quote: string; name: string }>', descriptionKey: 'cards' },
      { name: 'ctaLabel', type: 'string', default: "'Join them'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    Loved by the teams who ship
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    Read why thousands of builders made the switch and never looked back.
  </p>
  <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Join them
  </a>

  <!-- A single-column stack at 320px, a real collage with vertical offsets only
       once there is room (sm:). The offsets are decorative and never applied
       while stacked, so nothing clips off the narrow viewport. -->
  <div class="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
    <figure class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-6 dark:border-gray-800 dark:bg-gray-900">
      <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;We cut our deploy time in half the first week.&rdquo;</blockquote>
      <figcaption class="mt-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">AR</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Ada R.</span>
      </figcaption>
    </figure>
    <figure class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;The one tool the whole team actually agreed on.&rdquo;</blockquote>
      <figcaption class="mt-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">JM</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Jamal M.</span>
      </figcaption>
    </figure>
    <figure class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-6 dark:border-gray-800 dark:bg-gray-900">
      <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;Onboarding took an afternoon, not a quarter.&rdquo;</blockquote>
      <figcaption class="mt-4 flex items-center gap-3">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-xs font-bold text-white">SK</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Sofia K.</span>
      </figcaption>
    </figure>
  </div>
</section>`,
      react: `const AVATAR_STYLES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
];

const DEFAULT_CARDS = [
  { quote: 'We cut our deploy time in half the first week.', name: 'Ada R.' },
  { quote: 'The one tool the whole team actually agreed on.', name: 'Jamal M.' },
  { quote: 'Onboarding took an afternoon, not a quarter.', name: 'Sofia K.' },
];

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function HeroCardsCollage({
  title,
  kicker,
  copy,
  cards = DEFAULT_CARDS,
  ctaLabel = 'Join them',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {cards.slice(0, 3).map((card, i) => (
          <figure
            key={card.name}
            className={\`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${
              i % 2 === 0 ? 'sm:mt-6' : ''
            }\`}
          >
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              &ldquo;{card.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                className={\`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br \${AVATAR_STYLES[i % AVATAR_STYLES.length]} text-xs font-bold text-white\`}
              >
                {initials(card.name)}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{card.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroCollageCard {
  quote: string;
  name: string;
}

export interface HeroCardsCollageProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  cards?: HeroCollageCard[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const AVATAR_STYLES = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
] as const;

const DEFAULT_CARDS: HeroCollageCard[] = [
  { quote: 'We cut our deploy time in half the first week.', name: 'Ada R.' },
  { quote: 'The one tool the whole team actually agreed on.', name: 'Jamal M.' },
  { quote: 'Onboarding took an afternoon, not a quarter.', name: 'Sofia K.' },
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function HeroCardsCollage({
  title,
  kicker,
  copy,
  cards = DEFAULT_CARDS,
  ctaLabel = 'Join them',
  ctaHref = '#',
  className = '',
}: HeroCardsCollageProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {cards.slice(0, 3).map((card, i) => (
          <figure
            key={card.name}
            className={\`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${
              i % 2 === 0 ? 'sm:mt-6' : ''
            }\`}
          >
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              &ldquo;{card.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                className={\`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br \${AVATAR_STYLES[i % AVATAR_STYLES.length]} text-xs font-bold text-white\`}
              >
                {initials(card.name)}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{card.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'hero-announcement-banner',
    category: 'hero',
    tags: ['hero', 'banner', 'announcement', 'launch', 'cta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'subtle', labelKey: 'subtle' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'bannerLabel', type: 'string', default: "'New'", descriptionKey: 'bannerLabel' },
      { name: 'bannerText', type: 'string', required: true, descriptionKey: 'bannerText' },
      { name: 'bannerHref', type: 'string', default: "'#'", descriptionKey: 'bannerHref' },
      { name: 'ctaLabel', type: 'string', default: "'Start free trial'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-16">
  <!-- The banner is a single link: the whole pill is the target, so there is no
       tiny "read more" tap area. It wraps its text rather than overflowing at
       320px, and the arrow is decorative. -->
  <a href="#" class="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
    <span class="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">New</span>
    <span class="font-medium">Version 3.0 is live - see what changed</span>
    <span aria-hidden="true" class="text-gray-400">&rarr;</span>
  </a>

  <h1 class="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
    The fastest way to ship your next idea
  </h1>
  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    From prototype to production without leaving the editor.
  </p>
  <a href="#" class="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Start free trial
  </a>
</section>`,
      react: `export function HeroAnnouncementBanner({
  title,
  copy,
  bannerLabel = 'New',
  bannerText,
  bannerHref = '#',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}) {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      <a
        href={bannerHref}
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
          {bannerLabel}
        </span>
        <span className="font-medium">{bannerText}</span>
        <span aria-hidden="true" className="text-gray-400">
          &rarr;
        </span>
      </a>

      <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HeroAnnouncementBannerProps {
  title: ReactNode;
  copy?: string;
  bannerLabel?: string;
  bannerText: string;
  bannerHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroAnnouncementBanner({
  title,
  copy,
  bannerLabel = 'New',
  bannerText,
  bannerHref = '#',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: HeroAnnouncementBannerProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-3xl px-4 py-12 text-center sm:py-16 \${className}\`}>
      <a
        href={bannerHref}
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
          {bannerLabel}
        </span>
        <span className="font-medium">{bannerText}</span>
        <span aria-hidden="true" className="text-gray-400">
          &rarr;
        </span>
      </a>

      <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
      <a
        href={ctaHref}
        className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}`,
    },
  },
];
