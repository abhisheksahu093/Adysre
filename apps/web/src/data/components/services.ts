import type { ComponentEntry } from './types';

/**
 * Services category - five layout sections that present a whole service
 * offering, and five detail sections that make up a single service page.
 *
 * Every entry ships all six framework variants. As in `buttons.ts`, the
 * html/css pair is the same markup twice - BEM classes plus a stylesheet that
 * carries its own `prefers-color-scheme` block - while tailwind/react/nextjs/
 * typescript converge on utilities. Sections only take `'use client'` when they
 * actually hold state; a grid of copy does not.
 */
export const servicesComponents: ComponentEntry[] = [
  {
    slug: 'services-grid',
    category: 'services',
    tags: ['services', 'grid', 'icons', 'section', 'marketing'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-11',
    updatedAt: '2026-06-29',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 1860, copies: 502, downloads: 141 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker', example: 'What we do' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'services', type: 'ServiceItem[]', required: true, descriptionKey: 'services' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The services are a <ul>, not a stack of <div>s: a screen reader announces
  "list, 6 items" before the first one, which is the count a sighted visitor
  gets for free from the grid. Each card's heading is an <h3> under the
  section's <h2> - the outline is the page's table of contents, so it cannot
  skip a level to get a font size.
-->
<section class="svc-grid" aria-labelledby="svc-grid-title">
  <div class="svc-grid__intro">
    <p class="svc-grid__kicker">What we do</p>
    <h2 class="svc-grid__title" id="svc-grid-title">Services built around your roadmap</h2>
    <p class="svc-grid__copy">
      Four practices, one team, and a single point of contact from kickoff to handover.
    </p>
  </div>

  <ul class="svc-grid__list">
    <li class="svc-grid__item">
      <span class="svc-grid__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
        </svg>
      </span>
      <h3 class="svc-grid__item-title">Product strategy</h3>
      <p class="svc-grid__item-copy">Positioning, scope and a roadmap you can actually staff.</p>
    </li>
    <li class="svc-grid__item">
      <span class="svc-grid__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
        </svg>
      </span>
      <h3 class="svc-grid__item-title">Engineering</h3>
      <p class="svc-grid__item-copy">Typed, tested delivery on a stack your team can own after we leave.</p>
    </li>
    <li class="svc-grid__item">
      <span class="svc-grid__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </span>
      <h3 class="svc-grid__item-title">Analytics</h3>
      <p class="svc-grid__item-copy">Instrumentation that answers the question you actually asked.</p>
    </li>
  </ul>
</section>`,
      css: `.svc-grid {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-grid__intro {
  max-width: 36rem;
}

.svc-grid__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.svc-grid__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.svc-grid__copy {
  margin: 0.75rem 0 0;
  line-height: 1.7;
  color: #4b5563;
}

/*
 * auto-fit + minmax rather than fixed column counts: the grid reflows from one
 * column to three on its own, so the snippet needs no breakpoints to survive
 * being dropped into a narrower container than the one it was designed in.
 */
.svc-grid__list {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

.svc-grid__item {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
}

.svc-grid__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: #eff6ff;
  color: #1d4ed8;
}

.svc-grid__icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.svc-grid__item-title {
  margin: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.svc-grid__item-copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

/*
 * Every surface here is inherited rather than painted by a control, so the
 * whole section has to be re-tuned: the page background, the card that sits on
 * it, its hairline border, and both text weights. #4b5563 body copy clears
 * 4.5:1 on white but vanishes on #111827, hence #9ca3af on the dark side.
 */
@media (prefers-color-scheme: dark) {
  .svc-grid {
    background-color: #111827;
  }

  .svc-grid__kicker {
    color: #60a5fa;
  }

  .svc-grid__title {
    color: #f3f4f6;
  }

  .svc-grid__copy,
  .svc-grid__item-copy {
    color: #9ca3af;
  }

  .svc-grid__item {
    border-color: #1f2937;
    background-color: #111827;
  }

  .svc-grid__icon {
    background-color: #172554;
    color: #93c5fd;
  }

  .svc-grid__item-title {
    color: #f3f4f6;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="svc-grid-title">
  <div class="max-w-xl">
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">What we do</p>
    <h2 id="svc-grid-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
      Services built around your roadmap
    </h2>
    <p class="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
      Four practices, one team, and a single point of contact from kickoff to handover.
    </p>
  </div>

  <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
        </svg>
      </span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Product strategy</h3>
      <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Positioning, scope and a roadmap you can actually staff.
      </p>
    </li>
    <!-- Repeat one <li> per service. -->
  </ul>
</section>`,
      react: `const SERVICES = [
  {
    id: 'strategy',
    title: 'Product strategy',
    copy: 'Positioning, scope and a roadmap you can actually staff.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true" focusable="false">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </svg>
    ),
  },
];

export function ServicesGrid({ kicker, title, copy, services = SERVICES, className = '' }) {
  const titleId = 'svc-grid-title';

  return (
    <section
      aria-labelledby={titleId}
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-xl">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id={titleId} className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface ServiceItem {
  id: string;
  title: string;
  copy: string;
  icon: ReactNode;
}

interface ServicesGridProps {
  kicker?: string;
  title: string;
  copy?: string;
  services: ServiceItem[];
  className?: string;
}

// No 'use client': this section is copy in a grid. Nothing here reads state,
// so it stays a Server Component and ships no JS at all.
export function ServicesGrid({ kicker, title, copy, services, className = '' }: ServicesGridProps) {
  const titleId = 'svc-grid-title';

  return (
    <section
      aria-labelledby={titleId}
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-xl">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id={titleId} className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: ServiceItem) => (
          <li key={service.id} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  copy: string;
  /** Rendered inside the tile and hidden from assistive tech - the heading names it. */
  icon: ReactNode;
}

export interface ServicesGridProps {
  kicker?: string;
  title: string;
  copy?: string;
  services: ServiceItem[];
  className?: string;
}

export function ServicesGrid({
  kicker,
  title,
  copy,
  services,
  className = '',
}: ServicesGridProps): JSX.Element {
  const titleId = 'svc-grid-title';

  return (
    <section
      aria-labelledby={titleId}
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-xl">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id={titleId} className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: ServiceItem) => (
          <li
            key={service.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'services-alternating',
    category: 'services',
    tags: ['services', 'alternating', 'zigzag', 'image', 'section'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-24',
    updatedAt: '2026-07-03',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1410, copies: 366, downloads: 98 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'rows', type: 'ServiceRow[]', required: true, descriptionKey: 'rows' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The zigzag is decoration, not meaning: the source order is always copy then
  image, and only CSS moves the picture to the other side. Reversing the DOM to
  get the visual would hand a keyboard and a screen reader a different reading
  order than the one on screen - the classic failure of this layout.
-->
<section class="svc-alt" aria-labelledby="svc-alt-title">
  <h2 class="svc-alt__title" id="svc-alt-title">How we work with you</h2>

  <div class="svc-alt__row">
    <div class="svc-alt__copy">
      <p class="svc-alt__kicker">Discovery</p>
      <h3 class="svc-alt__row-title">Understand before we build</h3>
      <p class="svc-alt__text">
        Two weeks of interviews, analytics and a hard look at what you already own.
      </p>
      <a class="svc-alt__link" href="/services/discovery">Explore discovery</a>
    </div>
    <div class="svc-alt__media">
      <img src="/promo/all-access.svg" alt="" width="560" height="420" />
    </div>
  </div>

  <div class="svc-alt__row svc-alt__row--reverse">
    <div class="svc-alt__copy">
      <p class="svc-alt__kicker">Delivery</p>
      <h3 class="svc-alt__row-title">Ship in fortnightly slices</h3>
      <p class="svc-alt__text">
        Every increment is deployable, typed and behind a flag you control.
      </p>
      <a class="svc-alt__link" href="/services/delivery">Explore delivery</a>
    </div>
    <div class="svc-alt__media">
      <img src="/promo/all-access.svg" alt="" width="560" height="420" />
    </div>
  </div>
</section>`,
      css: `.svc-alt {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-alt__title {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.svc-alt__row {
  display: grid;
  gap: 2rem;
  align-items: center;
  margin-top: 3rem;
}

@media (min-width: 48rem) {
  .svc-alt__row {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  /*
   * The flip lives here and nowhere else. The media is second in the DOM on
   * every row; on alternate rows it is pulled into column 1 and the copy into
   * column 2, so the tab order stays copy → image regardless of which side the
   * image lands on. Below this breakpoint the grid is one column and the rule
   * simply does not apply.
   */
  .svc-alt__row--reverse .svc-alt__media {
    grid-column: 1;
    grid-row: 1;
  }

  .svc-alt__row--reverse .svc-alt__copy {
    grid-column: 2;
    grid-row: 1;
  }
}

.svc-alt__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.svc-alt__row-title {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.svc-alt__text {
  margin: 0.75rem 0 0;
  line-height: 1.7;
  color: #4b5563;
}

.svc-alt__link {
  display: inline-block;
  margin-top: 1rem;
  font-weight: 600;
  color: #1d4ed8;
}

.svc-alt__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.svc-alt__media {
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #f9fafb;
}

.svc-alt__media img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

/* The section paints the page surface, so all four inherited colours flip. */
@media (prefers-color-scheme: dark) {
  .svc-alt {
    background-color: #111827;
  }

  .svc-alt__title,
  .svc-alt__row-title {
    color: #f3f4f6;
  }

  .svc-alt__kicker,
  .svc-alt__link {
    color: #60a5fa;
  }

  .svc-alt__text {
    color: #9ca3af;
  }

  .svc-alt__media {
    border-color: #1f2937;
    background-color: #1f2937;
  }

  .svc-alt__link:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="svc-alt-title">
  <h2 id="svc-alt-title" class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    How we work with you
  </h2>

  <div class="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
    <div>
      <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Discovery</p>
      <h3 class="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">Understand before we build</h3>
      <p class="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
        Two weeks of interviews, analytics and a hard look at what you already own.
      </p>
      <a href="/services/discovery" class="mt-4 inline-block rounded font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        Explore discovery
      </a>
    </div>
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
      <img src="/promo/all-access.svg" alt="" width="560" height="420" class="block aspect-[4/3] w-full object-cover" />
    </div>
  </div>

  <!--
    Odd row: the media stays second in the DOM and is moved with md:order-first,
    so the reading order never diverges from the visual one.
  -->
  <div class="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
    <div>
      <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Delivery</p>
      <h3 class="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">Ship in fortnightly slices</h3>
      <p class="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
        Every increment is deployable, typed and behind a flag you control.
      </p>
      <a href="/services/delivery" class="mt-4 inline-block rounded font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        Explore delivery
      </a>
    </div>
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 md:order-first dark:border-gray-800 dark:bg-gray-800">
      <img src="/promo/all-access.svg" alt="" width="560" height="420" class="block aspect-[4/3] w-full object-cover" />
    </div>
  </div>
</section>`,
      react: `export function ServicesAlternating({ kicker, title, rows, className = '' }) {
  return (
    <section
      aria-labelledby="svc-alt-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-alt-title" className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      {rows.map((row, index) => (
        <div key={row.id} className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{row.kicker}</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">{row.title}</h3>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{row.copy}</p>
            <a
              href={row.href}
              className="mt-4 inline-block rounded font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {row.linkLabel}
            </a>
          </div>

          {/* Copy is always first in the DOM; only the class moves the picture. */}
          <div
            className={[
              'overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800',
              index % 2 === 1 ? 'md:order-first' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <img src={row.imageSrc} alt={row.imageAlt ?? ''} width={560} height={420} className="block aspect-[4/3] w-full object-cover" />
          </div>
        </div>
      ))}
    </section>
  );
}`,
      nextjs: `import Image from 'next/image';
import Link from 'next/link';

interface ServiceRow {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
  imageSrc: string;
  imageAlt?: string;
}

interface ServicesAlternatingProps {
  kicker?: string;
  title: string;
  rows: ServiceRow[];
  className?: string;
}

// Stateless - no 'use client'. next/image replaces the plain <img>; the sizes
// hint matches the md:grid-cols-2 split so mobile never downloads the desktop asset.
export function ServicesAlternating({ kicker, title, rows, className = '' }: ServicesAlternatingProps) {
  return (
    <section
      aria-labelledby="svc-alt-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-alt-title" className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      {rows.map((row: ServiceRow, index: number) => (
        <div key={row.id} className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{row.kicker}</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">{row.title}</h3>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{row.copy}</p>
            <Link
              href={row.href}
              className="mt-4 inline-block rounded font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {row.linkLabel}
            </Link>
          </div>

          <div
            className={[
              'relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800',
              index % 2 === 1 ? 'md:order-first' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Image src={row.imageSrc} alt={row.imageAlt ?? ''} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      ))}
    </section>
  );
}`,
      typescript: `export interface ServiceRow {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  href: string;
  linkLabel: string;
  imageSrc: string;
  /** Empty by default: the row's own heading already names the picture. */
  imageAlt?: string;
}

export interface ServicesAlternatingProps {
  kicker?: string;
  title: string;
  rows: ServiceRow[];
  className?: string;
}

export function ServicesAlternating({
  kicker,
  title,
  rows,
  className = '',
}: ServicesAlternatingProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-alt-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-alt-title"
        className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      {rows.map((row: ServiceRow, index: number) => (
        <div key={row.id} className="mt-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{row.kicker}</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">{row.title}</h3>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{row.copy}</p>
            <a
              href={row.href}
              className="mt-4 inline-block rounded font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:text-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {row.linkLabel}
            </a>
          </div>

          {/*
            The copy is first in the DOM on every row. Only \`md:order-first\`
            moves the picture, so the visual zigzag never desynchronises from
            the tab order - and below md the rule is inert.
          */}
          <div
            className={[
              'overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800',
              index % 2 === 1 ? 'md:order-first' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <img
              src={row.imageSrc}
              alt={row.imageAlt ?? ''}
              width={560}
              height={420}
              className="block aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'services-icon-list',
    category: 'services',
    tags: ['services', 'list', 'icon', 'compact', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-08',
    updatedAt: '2026-06-21',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1120, copies: 297, downloads: 71 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'services', type: 'ServiceListItem[]', required: true, descriptionKey: 'services' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A single column, deliberately. Where the grid asks you to scan, this asks you
  to read - so the icon is a fixed 2.5rem gutter and the copy runs in one
  measure down the page. Divider rules instead of cards: nine services as nine
  boxes is nine borders competing with the text inside them.
-->
<section class="svc-list" aria-labelledby="svc-list-title">
  <p class="svc-list__kicker">Capabilities</p>
  <h2 class="svc-list__title" id="svc-list-title">Everything under one retainer</h2>

  <ul class="svc-list__items">
    <li class="svc-list__item">
      <span class="svc-list__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
        </svg>
      </span>
      <div class="svc-list__body">
        <h3 class="svc-list__item-title">Design systems</h3>
        <p class="svc-list__item-copy">A token layer and a component library your engineers reach for by default.</p>
      </div>
    </li>
    <li class="svc-list__item">
      <span class="svc-list__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7" /><path d="M2 13h20l-2 7H4l-2-7Z" />
        </svg>
      </span>
      <div class="svc-list__body">
        <h3 class="svc-list__item-title">Platform engineering</h3>
        <p class="svc-list__item-copy">CI, environments and observability that stop being a project and start being plumbing.</p>
      </div>
    </li>
    <li class="svc-list__item">
      <span class="svc-list__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      </span>
      <div class="svc-list__body">
        <h3 class="svc-list__item-title">Performance</h3>
        <p class="svc-list__item-copy">Budgets, traces and the unglamorous work of making the numbers stay down.</p>
      </div>
    </li>
  </ul>
</section>`,
      css: `.svc-list {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-list__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.svc-list__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.svc-list__items {
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.svc-list__item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e7eb;
}

/* Rules between rows, not around them - the first row needs no lid. */
.svc-list__item:first-child {
  border-top: 0;
  padding-top: 0;
}

.svc-list__icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: #eff6ff;
  color: #1d4ed8;
}

.svc-list__icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.svc-list__item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.svc-list__item-copy {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .svc-list {
    background-color: #111827;
  }

  .svc-list__kicker {
    color: #60a5fa;
  }

  .svc-list__title,
  .svc-list__item-title {
    color: #f3f4f6;
  }

  .svc-list__item-copy {
    color: #9ca3af;
  }

  .svc-list__item {
    border-top-color: #1f2937;
  }

  .svc-list__icon {
    background-color: #172554;
    color: #93c5fd;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="svc-list-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Capabilities</p>
  <h2 id="svc-list-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Everything under one retainer
  </h2>

  <ul class="mt-8">
    <li class="flex gap-4 border-t border-gray-200 py-6 first:border-t-0 first:pt-0 dark:border-gray-800">
      <span class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" />
        </svg>
      </span>
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Design systems</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          A token layer and a component library your engineers reach for by default.
        </p>
      </div>
    </li>
    <!-- Repeat one <li> per capability. -->
  </ul>
</section>`,
      react: `export function ServicesIconList({ kicker, title, services, className = '' }) {
  return (
    <section
      aria-labelledby="svc-list-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-list-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-8">
        {services.map((service) => (
          <li
            key={service.id}
            className="flex gap-4 border-t border-gray-200 py-6 first:border-t-0 first:pt-0 dark:border-gray-800"
          >
            <span
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface ServiceListItem {
  id: string;
  title: string;
  copy: string;
  icon: ReactNode;
}

interface ServicesIconListProps {
  kicker?: string;
  title: string;
  services: ServiceListItem[];
  className?: string;
}

// Stateless - no 'use client' needed.
export function ServicesIconList({ kicker, title, services, className = '' }: ServicesIconListProps) {
  return (
    <section
      aria-labelledby="svc-list-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-list-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-8">
        {services.map((service: ServiceListItem) => (
          <li
            key={service.id}
            className="flex gap-4 border-t border-gray-200 py-6 first:border-t-0 first:pt-0 dark:border-gray-800"
          >
            <span
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface ServiceListItem {
  id: string;
  title: string;
  copy: string;
  icon: ReactNode;
}

export interface ServicesIconListProps {
  kicker?: string;
  title: string;
  services: ServiceListItem[];
  className?: string;
}

export function ServicesIconList({
  kicker,
  title,
  services,
  className = '',
}: ServicesIconListProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-list-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-list-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-8">
        {services.map((service: ServiceListItem) => (
          <li
            key={service.id}
            className="flex gap-4 border-t border-gray-200 py-6 first:border-t-0 first:pt-0 dark:border-gray-800"
          >
            {/* flex-none keeps the icon a fixed gutter so every title starts on the same x. */}
            <span
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {service.icon}
            </span>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'services-tabbed',
    category: 'services',
    tags: ['services', 'tabs', 'aria', 'keyboard', 'section'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 980, copies: 214, downloads: 63 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'categories', type: 'ServiceCategory[]', required: true, descriptionKey: 'tabItems' },
      { name: 'ariaLabel', type: 'string', default: "'Service categories'", descriptionKey: 'ariaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The real tabs pattern, not a row of buttons that hide divs. Three things make
  it that: only the selected tab is in the tab sequence (roving tabindex), so
  Tab lands on the strip once and the next Tab goes to the panel rather than
  through every tab; arrows move selection inside the strip; and each panel is
  wired to its tab both ways with aria-controls / aria-labelledby.
-->
<section class="svc-tabs" aria-labelledby="svc-tabs-title">
  <h2 class="svc-tabs__title" id="svc-tabs-title">Find the engagement that fits</h2>

  <div class="svc-tabs__strip" role="tablist" aria-label="Service categories">
    <button class="svc-tabs__tab" type="button" role="tab" id="svc-tab-build" aria-controls="svc-panel-build" aria-selected="true" tabindex="0">Build</button>
    <button class="svc-tabs__tab" type="button" role="tab" id="svc-tab-scale" aria-controls="svc-panel-scale" aria-selected="false" tabindex="-1">Scale</button>
    <button class="svc-tabs__tab" type="button" role="tab" id="svc-tab-advise" aria-controls="svc-panel-advise" aria-selected="false" tabindex="-1">Advise</button>
  </div>

  <div class="svc-tabs__panel" role="tabpanel" id="svc-panel-build" aria-labelledby="svc-tab-build" tabindex="0">
    <h3 class="svc-tabs__panel-title">Build</h3>
    <p class="svc-tabs__panel-copy">A cross-functional squad that ships your first production release in twelve weeks.</p>
  </div>
  <div class="svc-tabs__panel" role="tabpanel" id="svc-panel-scale" aria-labelledby="svc-tab-scale" tabindex="0" hidden>
    <h3 class="svc-tabs__panel-title">Scale</h3>
    <p class="svc-tabs__panel-copy">Platform, performance and on-call practice for the traffic you are about to get.</p>
  </div>
  <div class="svc-tabs__panel" role="tabpanel" id="svc-panel-advise" aria-labelledby="svc-tab-advise" tabindex="0" hidden>
    <h3 class="svc-tabs__panel-title">Advise</h3>
    <p class="svc-tabs__panel-copy">Fractional architecture review for teams who need a second opinion, not a supplier.</p>
  </div>
</section>

<script>
  document.querySelectorAll('.svc-tabs').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));

    function select(tab) {
      tabs.forEach(function (item) {
        var selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        // The roving part: unselected tabs leave the tab sequence entirely.
        item.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(item.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        select(tab);
      });

      tab.addEventListener('keydown', function (event) {
        var index = tabs.indexOf(tab);
        var next = -1;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;

        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      });
    });
  });
</script>`,
      css: `.svc-tabs {
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-tabs__title {
  margin: 0 0 1.5rem;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

/*
 * The strip scrolls rather than wraps: a wrapped tablist puts two rows of tabs
 * above one panel, and which row the selected tab is on stops being obvious.
 */
.svc-tabs__strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid #e5e7eb;
}

.svc-tabs__tab {
  flex: none;
  padding: 0.75rem 1rem;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
}

.svc-tabs__tab:hover {
  color: #111827;
}

/*
 * Selection is carried by the 2px rule as well as the colour. Colour alone
 * would leave the active tab unmarked for anyone who cannot separate the hues.
 */
.svc-tabs__tab[aria-selected='true'] {
  border-bottom-color: #2563eb;
  color: #1d4ed8;
}

.svc-tabs__tab:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
  border-radius: 0.25rem;
}

.svc-tabs__panel {
  padding-top: 1.5rem;
}

/* The panel is a tab stop, so it needs a visible ring of its own. */
.svc-tabs__panel:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.5rem;
}

.svc-tabs__panel-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.svc-tabs__panel-copy {
  margin: 0.5rem 0 0;
  line-height: 1.7;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .svc-tabs {
    background-color: #111827;
  }

  .svc-tabs__title,
  .svc-tabs__panel-title {
    color: #f3f4f6;
  }

  .svc-tabs__strip {
    border-bottom-color: #1f2937;
  }

  .svc-tabs__tab {
    color: #9ca3af;
  }

  .svc-tabs__tab:hover {
    color: #f3f4f6;
  }

  .svc-tabs__tab[aria-selected='true'] {
    border-bottom-color: #60a5fa;
    color: #93c5fd;
  }

  .svc-tabs__panel-copy {
    color: #9ca3af;
  }

  .svc-tabs__tab:focus-visible,
  .svc-tabs__panel:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="svc-tabs-title">
  <h2 id="svc-tabs-title" class="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Find the engagement that fits
  </h2>

  <div class="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label="Service categories">
    <button
      type="button"
      role="tab"
      id="svc-tab-build"
      aria-controls="svc-panel-build"
      aria-selected="true"
      tabindex="0"
      class="flex-none border-b-2 border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:border-blue-400 dark:text-blue-300 dark:focus-visible:ring-blue-400"
    >
      Build
    </button>
    <button
      type="button"
      role="tab"
      id="svc-tab-scale"
      aria-controls="svc-panel-scale"
      aria-selected="false"
      tabindex="-1"
      class="flex-none border-b-2 border-transparent px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
    >
      Scale
    </button>
  </div>

  <div class="pt-6 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400" role="tabpanel" id="svc-panel-build" aria-labelledby="svc-tab-build" tabindex="0">
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Build</h3>
    <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
      A cross-functional squad that ships your first production release in twelve weeks.
    </p>
  </div>
  <div class="pt-6 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400" role="tabpanel" id="svc-panel-scale" aria-labelledby="svc-tab-scale" tabindex="0" hidden>
    <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Scale</h3>
    <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
      Platform, performance and on-call practice for the traffic you are about to get.
    </p>
  </div>
</section>

<!-- Utilities cannot rove a tabindex - wire it with the script from the HTML tab. -->`,
      react: `import { useId, useRef, useState } from 'react';

export function ServicesTabbed({ kicker, title, categories, ariaLabel = 'Service categories', className = '' }) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const tabRefs = useRef({});

  function onKeyDown(event) {
    const index = categories.findIndex((category) => category.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;

    event.preventDefault();
    const category = categories[next];
    if (!category) return;
    setActiveId(category.id);
    tabRefs.current[category.id]?.focus();
  }

  return (
    <section
      aria-labelledby={\`\${baseId}-title\`}
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id={\`\${baseId}-title\`} className="mb-6 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800" role="tablist" aria-label={ariaLabel}>
        {categories.map((category) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${category.id}-tab\`}
              aria-controls={\`\${baseId}-\${category.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                tabRefs.current[category.id] = node;
              }}
              onClick={() => setActiveId(category.id)}
              onKeyDown={onKeyDown}
              className={[
                'flex-none border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                isActive
                  ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
              ].join(' ')}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          role="tabpanel"
          id={\`\${baseId}-\${category.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${category.id}-tab\`}
          tabIndex={0}
          hidden={category.id !== activeId}
          className="pt-6 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.heading}</h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{category.copy}</p>
        </div>
      ))}
    </section>
  );
}`,
      nextjs: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ServiceCategory {
  id: string;
  label: string;
  heading: string;
  copy: string;
}

interface ServicesTabbedProps {
  kicker?: string;
  title: string;
  categories: ServiceCategory[];
  ariaLabel?: string;
  className?: string;
}

// 'use client' is required here - and only here in this category. The selected
// tab is state and the arrow keys are a real listener; the other service
// sections are copy in a layout and stay Server Components.
export function ServicesTabbed({
  kicker,
  title,
  categories,
  ariaLabel = 'Service categories',
  className = '',
}: ServicesTabbedProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(categories[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = categories.findIndex((category: ServiceCategory) => category.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;

    event.preventDefault();
    const category = categories[next];
    if (!category) return;
    setActiveId(category.id);
    tabRefs.current[category.id]?.focus();
  };

  return (
    <section
      aria-labelledby={\`\${baseId}-title\`}
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id={\`\${baseId}-title\`}
        className="mb-6 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div
        className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
      >
        {categories.map((category: ServiceCategory) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${category.id}-tab\`}
              aria-controls={\`\${baseId}-\${category.id}-panel\`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[category.id] = node;
              }}
              onClick={() => setActiveId(category.id)}
              onKeyDown={onKeyDown}
              className={[
                'flex-none border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                isActive
                  ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
              ].join(' ')}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {categories.map((category: ServiceCategory) => (
        <div
          key={category.id}
          role="tabpanel"
          id={\`\${baseId}-\${category.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${category.id}-tab\`}
          tabIndex={0}
          hidden={category.id !== activeId}
          className="pt-6 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.heading}</h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{category.copy}</p>
        </div>
      ))}
    </section>
  );
}`,
      typescript: `'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface ServiceCategory {
  id: string;
  /** Text on the tab itself. */
  label: string;
  /** Heading inside the panel - may repeat the label or expand on it. */
  heading: string;
  copy: string;
}

export interface ServicesTabbedProps {
  kicker?: string;
  title: string;
  categories: ServiceCategory[];
  /** Names the tablist, so this strip is distinguishable from any other on the page. */
  ariaLabel?: string;
  className?: string;
}

export function ServicesTabbed({
  kicker,
  title,
  categories,
  ariaLabel = 'Service categories',
  className = '',
}: ServicesTabbedProps): JSX.Element {
  const baseId = useId();
  const [activeId, setActiveId] = useState<string | undefined>(categories[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /**
   * Arrows move selection within the strip; Home/End jump to the ends. This is
   * what a tablist owes the keyboard - without it the roving tabindex below has
   * locked every tab but one out of reach rather than tidied the tab order.
   */
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const index = categories.findIndex((category: ServiceCategory) => category.id === activeId);
    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % categories.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + categories.length) % categories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categories.length - 1;
    else return;

    event.preventDefault();
    const category = categories[next];
    if (!category) return;
    setActiveId(category.id);
    tabRefs.current[category.id]?.focus();
  };

  return (
    <section
      aria-labelledby={\`\${baseId}-title\`}
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id={\`\${baseId}-title\`}
        className="mb-6 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div
        className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800"
        role="tablist"
        aria-label={ariaLabel}
      >
        {categories.map((category: ServiceCategory) => {
          const isActive = category.id === activeId;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={\`\${baseId}-\${category.id}-tab\`}
              aria-controls={\`\${baseId}-\${category.id}-panel\`}
              aria-selected={isActive}
              // The roving tabindex: one tab stop for the whole strip, so the
              // next Tab reaches the panel instead of walking every category.
              tabIndex={isActive ? 0 : -1}
              ref={(node: HTMLButtonElement | null) => {
                tabRefs.current[category.id] = node;
              }}
              onClick={() => setActiveId(category.id)}
              onKeyDown={onKeyDown}
              className={[
                'flex-none border-b-2 px-4 py-3 text-sm font-semibold transition-colors focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                isActive
                  ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
              ].join(' ')}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {categories.map((category: ServiceCategory) => (
        <div
          key={category.id}
          role="tabpanel"
          id={\`\${baseId}-\${category.id}-panel\`}
          aria-labelledby={\`\${baseId}-\${category.id}-tab\`}
          tabIndex={0}
          hidden={category.id !== activeId}
          className="pt-6 focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{category.heading}</h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{category.copy}</p>
        </div>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'services-cards-hover',
    category: 'services',
    tags: ['services', 'cards', 'hover', 'reveal', 'focus'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-17',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1330, copies: 341, downloads: 87 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'highlighted', labelKey: 'highlighted' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'services', type: 'HoverService[]', required: true, descriptionKey: 'services' },
      { name: 'ctaLabel', type: 'string', default: "'Learn more'", descriptionKey: 'ctaLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The whole card is one link, not a card containing a link: that keeps it a
  single tab stop and gives the hover target and the click target the same
  bounds. Which is also why the reveal is driven by :hover AND :focus-visible on
  that link - a card whose call to action only exists under a cursor is a card a
  keyboard user never learns is clickable.

  The CTA row is aria-hidden and the link carries the real accessible name, so
  the affordance stays decorative rather than announcing "Learn more" with no
  hint of what about.
-->
<ul class="svc-hover">
  <li>
    <a class="svc-hover__card" href="/services/discovery">
      <span class="svc-hover__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <h3 class="svc-hover__title">Discovery sprint</h3>
      <p class="svc-hover__copy">Two weeks to turn a wish list into a scoped, costed plan.</p>
      <span class="svc-hover__cta" aria-hidden="true">
        Learn more
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </a>
  </li>
</ul>`,
      css: `.svc-hover {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  list-style: none;
  background-color: #fff;
}

.svc-hover__card {
  display: block;
  height: 100%;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  text-decoration: none;
  transition: transform 200ms, box-shadow 200ms, border-color 200ms;
}

/*
 * :hover and :focus-visible share every rule. Splitting them is how a reveal
 * ends up mouse-only - the keyboard reaches the card, nothing changes, and the
 * call to action stays invisible to the person who most needs it announced.
 */
.svc-hover__card:hover,
.svc-hover__card:focus-visible {
  transform: translateY(-4px);
  border-color: #bfdbfe;
  box-shadow: 0 20px 40px -24px rgba(15, 23, 42, 0.45);
}

.svc-hover__card:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.svc-hover__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: #eff6ff;
  color: #1d4ed8;
}

.svc-hover__icon svg,
.svc-hover__cta svg {
  width: 1.25rem;
  height: 1.25rem;
}

.svc-hover__title {
  margin: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.svc-hover__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

/*
 * The reveal is opacity, not display: none. The row keeps its space at rest, so
 * the card does not grow by 1.75rem the moment a cursor touches it and shove
 * the rest of the grid down.
 */
.svc-hover__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1d4ed8;
  opacity: 0;
  transform: translateY(0.25rem);
  transition: opacity 200ms, transform 200ms;
}

.svc-hover__card:hover .svc-hover__cta,
.svc-hover__card:focus-visible .svc-hover__cta {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-color-scheme: dark) {
  .svc-hover {
    background-color: #111827;
  }

  .svc-hover__card {
    border-color: #1f2937;
    background-color: #111827;
  }

  .svc-hover__card:hover,
  .svc-hover__card:focus-visible {
    border-color: #1e40af;
    box-shadow: 0 20px 40px -24px rgba(0, 0, 0, 0.8);
  }

  .svc-hover__card:focus-visible {
    outline-color: #60a5fa;
  }

  .svc-hover__icon {
    background-color: #172554;
    color: #93c5fd;
  }

  .svc-hover__title {
    color: #f3f4f6;
  }

  .svc-hover__copy {
    color: #9ca3af;
  }

  .svc-hover__cta {
    color: #60a5fa;
  }
}

/*
 * Reduced motion keeps the reveal - it carries information - and drops only the
 * travel. The opacity fade stays because it is not the part that causes trouble.
 */
@media (prefers-reduced-motion: reduce) {
  .svc-hover__card,
  .svc-hover__cta {
    transition-property: opacity, border-color, box-shadow;
  }

  .svc-hover__card:hover,
  .svc-hover__card:focus-visible {
    transform: none;
  }

  .svc-hover__cta {
    transform: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="svc-hover-title">
  <h2 id="svc-hover-title" class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Pick a starting point
  </h2>

  <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li>
      <!--
        Every hover: utility is paired with a focus-visible: twin, and the group
        is the <a> itself - so the reveal fires for a cursor and a Tab alike.
      -->
      <a
        href="/services/discovery"
        class="group block h-full rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:-translate-y-1 focus-visible:border-blue-200 focus-visible:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800 dark:focus-visible:border-blue-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Discovery sprint</h3>
        <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Two weeks to turn a wish list into a scoped, costed plan.
        </p>
        <span
          class="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-blue-700 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-blue-400"
          aria-hidden="true"
        >
          Learn more
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </a>
    </li>
    <!-- Repeat one <li> per service. -->
  </ul>
</section>`,
      react: `function ArrowIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ServicesCardsHover({ kicker, title, services, ctaLabel = 'Learn more', className = '' }) {
  return (
    <section
      aria-labelledby="svc-hover-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-hover-title" className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.id}>
            <a
              href={service.href}
              className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:-translate-y-1 focus-visible:border-blue-200 focus-visible:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800 dark:focus-visible:border-blue-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                aria-hidden="true"
              >
                {service.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
              <span
                className="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-blue-700 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-blue-400"
                aria-hidden="true"
              >
                {ctaLabel}
                <ArrowIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `import Link from 'next/link';
import type { ReactNode } from 'react';

interface HoverService {
  id: string;
  title: string;
  copy: string;
  href: string;
  icon: ReactNode;
}

interface ServicesCardsHoverProps {
  kicker?: string;
  title: string;
  services: HoverService[];
  ctaLabel?: string;
  className?: string;
}

// Stateless - no 'use client'. The lift and the reveal are CSS, so this ships
// as a Server Component with no hydration cost at all.
export function ServicesCardsHover({
  kicker,
  title,
  services,
  ctaLabel = 'Learn more',
  className = '',
}: ServicesCardsHoverProps) {
  return (
    <section
      aria-labelledby="svc-hover-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-hover-title" className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: HoverService) => (
          <li key={service.id}>
            <Link
              href={service.href}
              className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:-translate-y-1 focus-visible:border-blue-200 focus-visible:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800 dark:focus-visible:border-blue-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                aria-hidden="true"
              >
                {service.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
              <span
                className="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-blue-700 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-blue-400"
                aria-hidden="true"
              >
                {ctaLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface HoverService {
  id: string;
  title: string;
  copy: string;
  href: string;
  icon: ReactNode;
}

export interface ServicesCardsHoverProps {
  kicker?: string;
  title: string;
  services: HoverService[];
  /** Text in the revealed affordance. Decorative - the card's heading is the link's name. */
  ctaLabel?: string;
  className?: string;
}

function ArrowIcon(): JSX.Element {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ServicesCardsHover({
  kicker,
  title,
  services,
  ctaLabel = 'Learn more',
  className = '',
}: ServicesCardsHoverProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-hover-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-hover-title"
        className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service: HoverService) => (
          <li key={service.id}>
            {/*
              The card IS the link - one tab stop, and the hover target and the
              click target share bounds. \`group\` hangs off it so the reveal below
              can respond to group-hover AND group-focus-visible together.
            */}
            <a
              href={service.href}
              className="group block h-full rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:-translate-y-1 focus-visible:border-blue-200 focus-visible:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800 dark:focus-visible:border-blue-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                aria-hidden="true"
              >
                {service.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.copy}</p>
              {/*
                opacity, not display - the row holds its space at rest so the
                card does not grow and shove the grid the moment it is hovered.
              */}
              <span
                className="mt-4 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-blue-700 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:text-blue-400"
                aria-hidden="true"
              >
                {ctaLabel}
                <ArrowIcon />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'service-detail-hero',
    category: 'services',
    tags: ['service', 'hero', 'detail', 'cta', 'meta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-21',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1590, copies: 428, downloads: 117 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker', example: 'Discovery sprint' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'meta', type: 'ServiceMeta[]', descriptionKey: 'meta' },
      { name: 'ctaLabel', type: 'string', default: "'Book a call'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'secondaryLabel', type: 'string', descriptionKey: 'secondaryLabel', example: 'See the process' },
      { name: 'secondaryHref', type: 'string', descriptionKey: 'secondaryHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The top of a single service's page, so the heading is an <h1> - not the <h2>
  the listing sections use. One page, one h1, and this is it.

  The meta row is a <dl>: "Duration / 2-3 weeks" is a term and its value, and
  marking it up as one is what lets a screen reader read the pair rather than
  six loose strings. The separators are drawn with CSS borders, never typed as
  "·" characters, which would be read aloud one by one.
-->
<section class="svc-hero">
  <p class="svc-hero__kicker">Discovery sprint</p>
  <h1 class="svc-hero__title">Know what to build before you staff it</h1>
  <p class="svc-hero__summary">
    Three weeks of interviews, analytics and prototypes that end in a scoped, costed plan
    your board can sign off - or a recommendation not to build at all.
  </p>

  <div class="svc-hero__actions">
    <a class="svc-hero__cta" href="/contact">Book a call</a>
    <a class="svc-hero__cta svc-hero__cta--secondary" href="/work">See the work</a>
  </div>

  <dl class="svc-hero__meta">
    <div class="svc-hero__meta-item">
      <dt>Duration</dt>
      <dd>2-3 weeks</dd>
    </div>
    <div class="svc-hero__meta-item">
      <dt>Team</dt>
      <dd>2 strategists, 1 engineer</dd>
    </div>
    <div class="svc-hero__meta-item">
      <dt>Starting at</dt>
      <dd>£18,000</dd>
    </div>
  </dl>
</section>`,
      css: `.svc-hero {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-hero__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.svc-hero__title {
  margin: 0.75rem 0 0;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #111827;
}

.svc-hero__summary {
  margin: 1rem 0 0;
  max-width: 40rem;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: #4b5563;
}

/* Wraps rather than scrolls: two CTAs stack happily on a narrow screen. */
.svc-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.svc-hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.svc-hero__cta:hover {
  background-color: #1d4ed8;
}

/*
 * The secondary action is bordered rather than a bare link: two CTAs of
 * different weights read as a choice, whereas a filled pair reads as a fork
 * with no recommendation.
 */
.svc-hero__cta--secondary {
  border-color: #d1d5db;
  background-color: transparent;
  color: #374151;
}

.svc-hero__cta--secondary:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.svc-hero__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.svc-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0 2rem;
  margin: 2rem 0 0;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.svc-hero__meta-item dt {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.svc-hero__meta-item dd {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

@media (prefers-color-scheme: dark) {
  .svc-hero {
    background-color: #111827;
  }

  .svc-hero__kicker {
    color: #60a5fa;
  }

  .svc-hero__title,
  .svc-hero__meta-item dd {
    color: #f3f4f6;
  }

  .svc-hero__summary {
    color: #9ca3af;
  }

  /* #6b7280 is 4.8:1 on white but only 3.4:1 on #111827 - it has to lift. */
  .svc-hero__meta-item dt {
    color: #9ca3af;
  }

  .svc-hero__meta {
    border-top-color: #1f2937;
  }

  .svc-hero__cta--secondary {
    border-color: #374151;
    color: #d1d5db;
  }

  .svc-hero__cta--secondary:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .svc-hero__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .svc-hero__cta {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Discovery sprint</p>
  <h1 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
    Know what to build before you staff it
  </h1>
  <p class="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-[1.0625rem] dark:text-gray-400">
    Three weeks of interviews, analytics and prototypes that end in a scoped, costed plan your
    board can sign off - or a recommendation not to build at all.
  </p>

  <div class="mt-6 flex flex-wrap gap-3">
    <a
      href="/contact"
      class="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Book a call
    </a>
    <a
      href="/work"
      class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      See the work
    </a>
  </div>

  <dl class="mt-8 flex flex-wrap gap-x-8 border-t border-gray-200 pt-6 dark:border-gray-800">
    <div>
      <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Duration</dt>
      <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">2-3 weeks</dd>
    </div>
    <div>
      <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Team</dt>
      <dd class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">2 strategists, 1 engineer</dd>
    </div>
  </dl>
</section>`,
      react: `export function ServiceDetailHero({
  kicker,
  title,
  copy,
  meta = [],
  ctaLabel = 'Book a call',
  ctaHref = '#',
  secondaryLabel,
  secondaryHref,
  className = '',
}) {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-[1.0625rem] dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
        {secondaryLabel && secondaryHref ? (
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryLabel}
          </a>
        ) : null}
      </div>

      {meta.length > 0 ? (
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
          {meta.map((entry) => (
            <div key={entry.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {entry.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}`,
      nextjs: `import Link from 'next/link';

interface ServiceMeta {
  label: string;
  value: string;
}

interface ServiceDetailHeroProps {
  kicker?: string;
  title: string;
  copy?: string;
  meta?: ServiceMeta[];
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

// Stateless - no 'use client'. next/link prefetches the two destinations.
export function ServiceDetailHero({
  kicker,
  title,
  copy,
  meta = [],
  ctaLabel = 'Book a call',
  ctaHref = '#',
  secondaryLabel,
  secondaryHref,
  className = '',
}: ServiceDetailHeroProps) {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h1>
      {copy ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-[1.0625rem] dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>

      {meta.length > 0 ? (
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
          {meta.map((entry: ServiceMeta) => (
            <div key={entry.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {entry.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}`,
      typescript: `export interface ServiceMeta {
  label: string;
  value: string;
}

export interface ServiceDetailHeroProps {
  kicker?: string;
  title: string;
  copy?: string;
  /** Rendered as a definition list - each label/value is a real dt/dd pair. */
  meta?: ServiceMeta[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Both must be present for the secondary action to render at all. */
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function ServiceDetailHero({
  kicker,
  title,
  copy,
  meta = [],
  ctaLabel = 'Book a call',
  ctaHref = '#',
  secondaryLabel,
  secondaryHref,
  className = '',
}: ServiceDetailHeroProps): JSX.Element {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}

      {/* An <h1>, not an <h2>: this is one service's own page, and this is its title. */}
      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-[1.0625rem] dark:text-gray-400">
          {copy}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
        {secondaryLabel && secondaryHref ? (
          <a
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {secondaryLabel}
          </a>
        ) : null}
      </div>

      {/*
        A <dl>, because "Duration / 2-3 weeks" is a term and its value. Marked
        up as one, a screen reader reads the pair; marked up as divs and styled
        with a middot, it reads six loose strings and a punctuation mark.
      */}
      {meta.length > 0 ? (
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
          {meta.map((entry: ServiceMeta) => (
            <div key={entry.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {entry.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'service-detail-features',
    category: 'services',
    tags: ['service', 'features', 'checklist', 'detail', 'columns'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-09',
    updatedAt: '2026-07-06',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1040, copies: 268, downloads: 64 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'groups', type: 'FeatureGroup[]', required: true, descriptionKey: 'groups' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Two groups, each with its own <h3> and its own <ul>. The heading is not a
  label floating above a list - it is the list's owner, and keeping them in one
  <div> is what makes that relationship survive the columns collapsing.

  The ticks are aria-hidden. Every item in a checklist has one, so announcing
  "tick" before each would add a word and no information; the list already says
  "list, 5 items" and the heading already says what they are.
-->
<section class="svc-feat" aria-labelledby="svc-feat-title">
  <p class="svc-feat__kicker">What you get</p>
  <h2 class="svc-feat__title" id="svc-feat-title">Everything in the sprint</h2>

  <div class="svc-feat__cols">
    <div class="svc-feat__group">
      <h3 class="svc-feat__group-title">Research</h3>
      <ul class="svc-feat__list">
        <li class="svc-feat__item">
          <svg class="svc-feat__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          Ten user interviews, recorded and tagged
        </li>
        <li class="svc-feat__item">
          <svg class="svc-feat__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          A funnel audit of your existing analytics
        </li>
      </ul>
    </div>

    <div class="svc-feat__group">
      <h3 class="svc-feat__group-title">Deliverables</h3>
      <ul class="svc-feat__list">
        <li class="svc-feat__item">
          <svg class="svc-feat__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          A clickable prototype of the core journey
        </li>
        <li class="svc-feat__item">
          <svg class="svc-feat__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          A costed backlog, sized by your team's velocity
        </li>
      </ul>
    </div>
  </div>
</section>`,
      css: `.svc-feat {
  width: 100%;
  max-width: 60rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-feat__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.svc-feat__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.svc-feat__cols {
  display: grid;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

@media (min-width: 40rem) {
  .svc-feat__cols {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

.svc-feat__group-title {
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #111827;
}

.svc-feat__list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
 * align-items: start rather than center - a two-line item would otherwise sit
 * its tick halfway down the second line instead of beside the first word.
 */
.svc-feat__item {
  display: flex;
  align-items: start;
  gap: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.svc-feat__tick {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  /* Nudge onto the cap height of the first line. */
  margin-top: 0.125rem;
  color: #2563eb;
}

@media (prefers-color-scheme: dark) {
  .svc-feat {
    background-color: #111827;
  }

  .svc-feat__kicker {
    color: #60a5fa;
  }

  .svc-feat__title,
  .svc-feat__group-title {
    color: #f3f4f6;
  }

  .svc-feat__group-title {
    border-bottom-color: #1f2937;
  }

  .svc-feat__item {
    color: #d1d5db;
  }

  .svc-feat__tick {
    color: #60a5fa;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="svc-feat-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">What you get</p>
  <h2 id="svc-feat-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Everything in the sprint
  </h2>

  <div class="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
    <div>
      <h3 class="mb-4 border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-gray-100">
        Research
      </h3>
      <ul class="grid gap-3">
        <li class="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <svg class="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          Ten user interviews, recorded and tagged
        </li>
      </ul>
    </div>

    <div>
      <h3 class="mb-4 border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-gray-100">
        Deliverables
      </h3>
      <ul class="grid gap-3">
        <li class="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <svg class="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
          A clickable prototype of the core journey
        </li>
      </ul>
    </div>
  </div>
</section>`,
      react: `function TickIcon() {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ServiceDetailFeatures({ kicker, title, groups, className = '' }) {
  return (
    <section
      aria-labelledby="svc-feat-title"
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-feat-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-gray-100">
              {group.heading}
            </h3>
            <ul className="grid gap-3">
              {group.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <TickIcon />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      nextjs: `interface FeatureGroup {
  heading: string;
  features: string[];
}

interface ServiceDetailFeaturesProps {
  kicker?: string;
  title: string;
  groups: FeatureGroup[];
  className?: string;
}

function TickIcon() {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

// Stateless - no 'use client' needed.
export function ServiceDetailFeatures({ kicker, title, groups, className = '' }: ServiceDetailFeaturesProps) {
  return (
    <section
      aria-labelledby="svc-feat-title"
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-feat-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {groups.map((group: FeatureGroup) => (
          <div key={group.heading}>
            <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-gray-100">
              {group.heading}
            </h3>
            <ul className="grid gap-3">
              {group.features.map((feature: string) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <TickIcon />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export interface FeatureGroup {
  heading: string;
  features: string[];
}

export interface ServiceDetailFeaturesProps {
  kicker?: string;
  title: string;
  /** One column per group. Two reads best; three needs a wider container. */
  groups: FeatureGroup[];
  className?: string;
}

function TickIcon(): JSX.Element {
  return (
    <svg
      // mt-0.5 drops the tick onto the cap height of the first line, so a
      // two-line item does not centre its tick against the wrap.
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ServiceDetailFeatures({
  kicker,
  title,
  groups,
  className = '',
}: ServiceDetailFeaturesProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-feat-title"
      className={['mx-auto w-full max-w-5xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-feat-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-12">
        {groups.map((group: FeatureGroup) => (
          // The heading and its list share a wrapper, so the pairing survives
          // the columns collapsing to one on a narrow screen.
          <div key={group.heading}>
            <h3 className="mb-4 border-b border-gray-200 pb-3 text-sm font-bold uppercase tracking-wide text-gray-900 dark:border-gray-800 dark:text-gray-100">
              {group.heading}
            </h3>
            <ul className="grid gap-3">
              {group.features.map((feature: string) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                >
                  <TickIcon />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'service-detail-process',
    category: 'services',
    tags: ['service', 'process', 'steps', 'numbered', 'connector'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-26',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 870, copies: 209, downloads: 55 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'steps', type: 'ProcessStep[]', required: true, descriptionKey: 'steps' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  An <ol>, because the order is the whole point - these steps happen in sequence
  and a screen reader gets that from the element, not from the numbers drawn in
  the circles. Those numbers are aria-hidden precisely because the list already
  announces "1 of 4"; leaving them audible would say "one one Kickoff".

  The connector is drawn with ::before on each step and is pure decoration.
-->
<section class="svc-proc" aria-labelledby="svc-proc-title">
  <p class="svc-proc__kicker">How it runs</p>
  <h2 class="svc-proc__title" id="svc-proc-title">Four steps, three weeks</h2>

  <ol class="svc-proc__steps">
    <li class="svc-proc__step">
      <span class="svc-proc__marker" aria-hidden="true">1</span>
      <div class="svc-proc__body">
        <h3 class="svc-proc__step-title">Kickoff</h3>
        <p class="svc-proc__step-copy">Half a day with your team to agree the question we are answering.</p>
      </div>
    </li>
    <li class="svc-proc__step">
      <span class="svc-proc__marker" aria-hidden="true">2</span>
      <div class="svc-proc__body">
        <h3 class="svc-proc__step-title">Research</h3>
        <p class="svc-proc__step-copy">Interviews, analytics and a read of the code you already have.</p>
      </div>
    </li>
    <li class="svc-proc__step">
      <span class="svc-proc__marker" aria-hidden="true">3</span>
      <div class="svc-proc__body">
        <h3 class="svc-proc__step-title">Prototype</h3>
        <p class="svc-proc__step-copy">A clickable core journey, tested with five people outside your building.</p>
      </div>
    </li>
    <li class="svc-proc__step">
      <span class="svc-proc__marker" aria-hidden="true">4</span>
      <div class="svc-proc__body">
        <h3 class="svc-proc__step-title">Handover</h3>
        <p class="svc-proc__step-copy">A costed backlog and a recommendation you can act on the same week.</p>
      </div>
    </li>
  </ol>
</section>`,
      css: `.svc-proc {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-proc__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.svc-proc__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.svc-proc__steps {
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

.svc-proc__step {
  position: relative;
  display: flex;
  gap: 1rem;
  padding-bottom: 2rem;
}

/*
 * The connector: a 2px rule from the bottom of one marker to the top of the
 * next, drawn on the step rather than between them so it cannot desynchronise
 * from the list. left: 1.25rem centres it under a 2.5rem marker.
 */
.svc-proc__step::before {
  content: '';
  position: absolute;
  top: 2.5rem;
  bottom: 0.5rem;
  left: 1.25rem;
  width: 2px;
  margin-left: -1px;
  background-color: #e5e7eb;
}

/* The last step has nothing to connect to, so it draws no tail. */
.svc-proc__step:last-child {
  padding-bottom: 0;
}

.svc-proc__step:last-child::before {
  display: none;
}

.svc-proc__marker {
  position: relative;
  z-index: 1;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.svc-proc__step-title {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.svc-proc__step-copy {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .svc-proc {
    background-color: #111827;
  }

  .svc-proc__kicker {
    color: #60a5fa;
  }

  .svc-proc__title,
  .svc-proc__step-title {
    color: #f3f4f6;
  }

  .svc-proc__step-copy {
    color: #9ca3af;
  }

  /* The rail is a hairline on a dark surface, so it lifts to stay visible. */
  .svc-proc__step::before {
    background-color: #374151;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="svc-proc-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">How it runs</p>
  <h2 id="svc-proc-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Four steps, three weeks
  </h2>

  <ol class="mt-10">
    <!--
      The connector is an arbitrary-variant ::before on each step. last:pb-0 and
      last:before:hidden stop the final step drawing a tail into nothing.
    -->
    <li class="relative flex gap-4 pb-8 before:absolute before:bottom-2 before:left-5 before:top-10 before:-ml-px before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden dark:before:bg-gray-700">
      <span class="relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold tabular-nums text-white" aria-hidden="true">1</span>
      <div>
        <h3 class="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">Kickoff</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Half a day with your team to agree the question we are answering.
        </p>
      </div>
    </li>
    <li class="relative flex gap-4 pb-8 before:absolute before:bottom-2 before:left-5 before:top-10 before:-ml-px before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden dark:before:bg-gray-700">
      <span class="relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold tabular-nums text-white" aria-hidden="true">2</span>
      <div>
        <h3 class="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">Research</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Interviews, analytics and a read of the code you already have.
        </p>
      </div>
    </li>
  </ol>
</section>`,
      react: `export function ServiceDetailProcess({ kicker, title, steps, className = '' }) {
  return (
    <section
      aria-labelledby="svc-proc-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-proc-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ol className="mt-10">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relative flex gap-4 pb-8 before:absolute before:bottom-2 before:left-5 before:top-10 before:-ml-px before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden dark:before:bg-gray-700"
          >
            <span
              className="relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold tabular-nums text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
      nextjs: `interface ProcessStep {
  title: string;
  copy: string;
}

interface ServiceDetailProcessProps {
  kicker?: string;
  title: string;
  steps: ProcessStep[];
  className?: string;
}

// Stateless - no 'use client' needed.
export function ServiceDetailProcess({ kicker, title, steps, className = '' }: ServiceDetailProcessProps) {
  return (
    <section
      aria-labelledby="svc-proc-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="svc-proc-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ol className="mt-10">
        {steps.map((step: ProcessStep, index: number) => (
          <li
            key={step.title}
            className="relative flex gap-4 pb-8 before:absolute before:bottom-2 before:left-5 before:top-10 before:-ml-px before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden dark:before:bg-gray-700"
          >
            <span
              className="relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold tabular-nums text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
      typescript: `export interface ProcessStep {
  title: string;
  copy: string;
}

export interface ServiceDetailProcessProps {
  kicker?: string;
  title: string;
  /** Rendered in order. The visible numbers are derived, never authored. */
  steps: ProcessStep[];
  className?: string;
}

export function ServiceDetailProcess({
  kicker,
  title,
  steps,
  className = '',
}: ServiceDetailProcessProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-proc-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="svc-proc-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      {/* An <ol>: the sequence is the content, so it belongs in the element. */}
      <ol className="mt-10">
        {steps.map((step: ProcessStep, index: number) => (
          // The connector is a ::before rule on the step itself, so it can never
          // drift out of step with the list. last:before:hidden stops the final
          // marker trailing a rule into nothing.
          <li
            key={step.title}
            className="relative flex gap-4 pb-8 before:absolute before:bottom-2 before:left-5 before:top-10 before:-ml-px before:w-0.5 before:bg-gray-200 last:pb-0 last:before:hidden dark:before:bg-gray-700"
          >
            {/*
              aria-hidden, and deliberately so: the <ol> already announces
              "1 of 4". Leaving the glyph audible would read "one one Kickoff".
            */}
            <span
              className="relative z-10 inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold tabular-nums text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
    },
  },
  {
    slug: 'service-detail-pricing-cta',
    category: 'services',
    tags: ['service', 'pricing', 'cta', 'inclusions', 'detail'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-02',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 640, copies: 158, downloads: 41 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'highlighted', labelKey: 'highlighted' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'price', type: 'string', required: true, descriptionKey: 'price', example: '£18,000' },
      { name: 'period', type: 'string', default: "'fixed fee'", descriptionKey: 'period' },
      { name: 'note', type: 'string', descriptionKey: 'note', example: 'Excludes VAT and travel' },
      { name: 'features', type: 'string[]', required: true, descriptionKey: 'features' },
      { name: 'ctaLabel', type: 'string', default: "'Book a call'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'highlighted', type: 'boolean', default: 'false', descriptionKey: 'highlighted' },
      {
        name: 'bandCopy',
        type: 'string',
        descriptionKey: 'bandCopy',
        example: 'Two sprint slots left this quarter.',
      },
    ],
    code: {
      html: `<!--
  The price is a real text node, not an image or a background - it is the single
  fact most likely to be copied, read aloud or translated.

  Note the CTA band is inside the same <section> as the price rather than a
  separate strip below it: a person reading "£18,000 fixed fee" and a person
  pressing "Book a call" are the same person one second apart, and splitting
  them across two landmarks makes a screen reader walk out of one and into
  another to complete a single thought.
-->
<section class="svc-price" aria-labelledby="svc-price-title">
  <div class="svc-price__head">
    <h2 class="svc-price__title" id="svc-price-title">Discovery sprint</h2>
    <p class="svc-price__amount">
      <span class="svc-price__value">£18,000</span>
      <span class="svc-price__period">fixed fee</span>
    </p>
    <p class="svc-price__note">Three weeks, invoiced 50% on kickoff and 50% on handover.</p>
  </div>

  <ul class="svc-price__list">
    <li class="svc-price__item">
      <svg class="svc-price__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      Ten user interviews, recorded and tagged
    </li>
    <li class="svc-price__item">
      <svg class="svc-price__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      A clickable prototype of the core journey
    </li>
    <li class="svc-price__item">
      <svg class="svc-price__tick" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      A costed backlog, sized by your team's velocity
    </li>
  </ul>

  <div class="svc-price__band">
    <p class="svc-price__band-copy">Two sprint slots left this quarter.</p>
    <a class="svc-price__cta" href="/contact">Book a call</a>
  </div>
</section>`,
      css: `.svc-price {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
}

.svc-price__head {
  padding: 2rem 2rem 0;
}

.svc-price__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.svc-price__amount {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.75rem 0 0;
}

.svc-price__value {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #111827;
  /* The figure is the point - stop it reflowing as digits change. */
  font-variant-numeric: tabular-nums;
}

.svc-price__period {
  font-size: 0.875rem;
  color: #6b7280;
}

.svc-price__note {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.svc-price__list {
  display: grid;
  gap: 0.75rem;
  margin: 1.5rem 0 0;
  padding: 0 2rem 2rem;
  list-style: none;
}

.svc-price__item {
  display: flex;
  align-items: start;
  gap: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}

.svc-price__tick {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  color: #2563eb;
}

/*
 * The band is a tinted footer of the same card, not a separate strip: it shares
 * the border and the radius, so the price and the action it leads to stay one
 * object.
 */
.svc-price__band {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 2rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.svc-price__band-copy {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.svc-price__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1.25rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 150ms;
}

.svc-price__cta:hover {
  background-color: #1d4ed8;
}

.svc-price__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .svc-price {
    border-color: #1f2937;
    background-color: #111827;
  }

  .svc-price__title,
  .svc-price__value {
    color: #f3f4f6;
  }

  .svc-price__period,
  .svc-price__note,
  .svc-price__band-copy {
    color: #9ca3af;
  }

  .svc-price__item {
    color: #d1d5db;
  }

  .svc-price__tick {
    color: #60a5fa;
  }

  /* The band tint inverts: a shade lighter than the card, not darker. */
  .svc-price__band {
    border-top-color: #1f2937;
    background-color: #1f2937;
  }

  .svc-price__cta:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .svc-price__cta {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" aria-labelledby="svc-price-title">
  <div class="px-6 pt-8 sm:px-8">
    <h2 id="svc-price-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">Discovery sprint</h2>
    <p class="mt-3 flex items-baseline gap-2">
      <span class="text-4xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100">£18,000</span>
      <span class="text-sm text-gray-500 dark:text-gray-400">fixed fee</span>
    </p>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Three weeks, invoiced 50% on kickoff and 50% on handover.
    </p>
  </div>

  <ul class="mt-6 grid gap-3 px-6 pb-8 sm:px-8">
    <li class="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      <svg class="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
      </svg>
      Ten user interviews, recorded and tagged
    </li>
  </ul>

  <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8 dark:border-gray-800 dark:bg-gray-800">
    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Two sprint slots left this quarter.</p>
    <a
      href="/contact"
      class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
    >
      Book a call
    </a>
  </div>
</section>`,
      react: `function TickIcon() {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ServiceDetailPricingCta({
  name,
  price,
  period = 'fixed fee',
  note,
  features,
  bandCopy,
  ctaLabel = 'Book a call',
  ctaHref = '#',
  highlighted = false,
}) {
  return (
    <section
      aria-labelledby="svc-price-title"
      className={[
        'mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 dark:border-gray-800',
      ].join(' ')}
    >
      <div className="px-6 pt-8 sm:px-8">
        <h2 id="svc-price-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </h2>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100">{price}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
        </p>
        {note ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{note}</p> : null}
      </div>

      <ul className="mt-6 grid gap-3 px-6 pb-8 sm:px-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <TickIcon />
            {feature}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8 dark:border-gray-800 dark:bg-gray-800">
        {bandCopy ? <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{bandCopy}</p> : null}
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}`,
      nextjs: `import Link from 'next/link';

interface ServiceDetailPricingCtaProps {
  name: string;
  price: string;
  period?: string;
  note?: string;
  features: string[];
  bandCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

function TickIcon() {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

// Stateless - no 'use client' needed.
export function ServiceDetailPricingCta({
  name,
  price,
  period = 'fixed fee',
  note,
  features,
  bandCopy,
  ctaLabel = 'Book a call',
  ctaHref = '#',
  highlighted = false,
}: ServiceDetailPricingCtaProps) {
  return (
    <section
      aria-labelledby="svc-price-title"
      className={[
        'mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 dark:border-gray-800',
      ].join(' ')}
    >
      <div className="px-6 pt-8 sm:px-8">
        <h2 id="svc-price-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </h2>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100">{price}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
        </p>
        {note ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{note}</p> : null}
      </div>

      <ul className="mt-6 grid gap-3 px-6 pb-8 sm:px-8">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <TickIcon />
            {feature}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8 dark:border-gray-800 dark:bg-gray-800">
        {bandCopy ? <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{bandCopy}</p> : null}
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}`,
      typescript: `export interface ServiceDetailPricingCtaProps {
  name: string;
  /** Pre-formatted, currency symbol included - this component never does maths. */
  price: string;
  period?: string;
  note?: string;
  features: string[];
  /** Optional line in the CTA band, e.g. remaining availability. */
  bandCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
}

function TickIcon(): JSX.Element {
  return (
    <svg
      className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-blue-600 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ServiceDetailPricingCta({
  name,
  price,
  period = 'fixed fee',
  note,
  features,
  bandCopy,
  ctaLabel = 'Book a call',
  ctaHref = '#',
  highlighted = false,
}: ServiceDetailPricingCtaProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-price-title"
      className={[
        'mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-gray-900',
        highlighted
          ? 'border border-blue-600 shadow-[0_20px_40px_-24px_rgba(37,99,235,0.55)]'
          : 'border border-gray-200 dark:border-gray-800',
      ].join(' ')}
    >
      <div className="px-6 pt-8 sm:px-8">
        <h2 id="svc-price-title" className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {name}
        </h2>
        <p className="mt-3 flex items-baseline gap-2">
          {/* tabular-nums so the figure does not reflow between prices. */}
          <span className="text-4xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
        </p>
        {note ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{note}</p> : null}
      </div>

      <ul className="mt-6 grid gap-3 px-6 pb-8 sm:px-8">
        {features.map((feature: string) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
          >
            <TickIcon />
            {feature}
          </li>
        ))}
      </ul>

      {/*
        The band is a tinted footer of the same card, inside the same section.
        Splitting the price from the action it leads to across two landmarks
        makes a screen reader leave one and enter another to finish one thought.
      */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8 dark:border-gray-800 dark:bg-gray-800">
        {bandCopy ? <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{bandCopy}</p> : null}
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-800"
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
    slug: 'service-detail-faq',
    category: 'services',
    tags: ['service', 'faq', 'details', 'accordion', 'detail'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-30',
    updatedAt: '2026-07-10',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1210, copies: 314, downloads: 79 },
    variants: [
      { id: 'single', labelKey: 'single' },
      { id: 'multiple', labelKey: 'multiple' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'items', type: 'FaqItem[]', required: true, descriptionKey: 'items' },
      { name: 'defaultOpenId', type: 'string', descriptionKey: 'defaultOpenId' },
      { name: 'allowMultiple', type: 'boolean', default: 'false', descriptionKey: 'allowMultiple' },
      { name: 'groupName', type: 'string', default: "'service-faq'", descriptionKey: 'groupName' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  <details> and <summary>, not a div with a click handler. The browser already
  gives this the disclosure role, the expanded state, Enter/Space, and - the
  part hand-rolled accordions almost always miss - find-in-page: Chrome and
  Safari open a closed <details> when the search lands inside it. A JS accordion
  hides that text from Ctrl+F entirely.

  The shared name attribute makes the group exclusive natively: opening one
  closes the rest, with no script at all. Drop it for a multi-open FAQ.

  Scoped to one service on purpose - the questions are "how long is the sprint",
  not "how do I reset my password", so this sits on the service page rather
  than in a global FAQ nobody scrolls to.
-->
<section class="svc-faq" aria-labelledby="svc-faq-title">
  <h2 class="svc-faq__title" id="svc-faq-title">Questions about the sprint</h2>

  <div class="svc-faq__items">
    <details class="svc-faq__item" name="service-faq" open>
      <summary class="svc-faq__q">
        What happens if you tell us not to build it?
        <svg class="svc-faq__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p class="svc-faq__a">
        You still get the research, the prototype and the reasoning. Roughly one sprint in six
        ends that way, and it is the cheapest outcome on offer.
      </p>
    </details>

    <details class="svc-faq__item" name="service-faq">
      <summary class="svc-faq__q">
        Who needs to be available from our side?
        <svg class="svc-faq__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p class="svc-faq__a">
        One decision-maker for two hours a week, and whoever knows the current system best for
        a single afternoon.
      </p>
    </details>

    <details class="svc-faq__item" name="service-faq">
      <summary class="svc-faq__q">
        Can the sprint roll straight into delivery?
        <svg class="svc-faq__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p class="svc-faq__a">
        Yes, and about half do. The backlog is sized for your team, so it is equally usable if
        you take it in-house.
      </p>
    </details>
  </div>
</section>`,
      css: `.svc-faq {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.svc-faq__title {
  margin: 0 0 1.5rem;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.svc-faq__item {
  border-bottom: 1px solid #e5e7eb;
}

.svc-faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  cursor: pointer;
  /* Suppress the default triangle; the chevron below replaces it. */
  list-style: none;
}

.svc-faq__q::-webkit-details-marker {
  display: none;
}

.svc-faq__q:hover {
  color: #1d4ed8;
}

/*
 * The ring goes on the <summary> because that is what actually takes focus -
 * putting it on the <details> would draw a box around the open answer too.
 */
.svc-faq__q:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.svc-faq__chevron {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #6b7280;
  transition: transform 200ms;
}

.svc-faq__item[open] .svc-faq__chevron {
  transform: rotate(180deg);
}

.svc-faq__a {
  margin: 0;
  padding: 0 0 1.25rem;
  max-width: 40rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .svc-faq {
    background-color: #111827;
  }

  .svc-faq__title,
  .svc-faq__q {
    color: #f3f4f6;
  }

  .svc-faq__q:hover {
    color: #93c5fd;
  }

  .svc-faq__item {
    border-bottom-color: #1f2937;
  }

  .svc-faq__chevron {
    color: #9ca3af;
  }

  .svc-faq__a {
    color: #9ca3af;
  }

  .svc-faq__q:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .svc-faq__chevron {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="svc-faq-title">
  <h2 id="svc-faq-title" class="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Questions about the sprint
  </h2>

  <div>
    <!-- The shared name makes the group exclusive with no JavaScript. -->
    <details class="group border-b border-gray-200 dark:border-gray-800" name="service-faq" open>
      <summary class="flex cursor-pointer items-center justify-between gap-4 py-[1.125rem] text-[0.9375rem] font-semibold text-gray-900 marker:content-none hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        What happens if you tell us not to build it?
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p class="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        You still get the research, the prototype and the reasoning. Roughly one sprint in six ends
        that way, and it is the cheapest outcome on offer.
      </p>
    </details>

    <details class="group border-b border-gray-200 dark:border-gray-800" name="service-faq">
      <summary class="flex cursor-pointer items-center justify-between gap-4 py-[1.125rem] text-[0.9375rem] font-semibold text-gray-900 marker:content-none hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        Who needs to be available from our side?
        <svg class="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <p class="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        One decision-maker for two hours a week, and whoever knows the current system best for a
        single afternoon.
      </p>
    </details>
  </div>
</section>`,
      react: `function ChevronIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ServiceDetailFaq({
  title,
  items,
  defaultOpenId,
  allowMultiple = false,
  groupName = 'service-faq',
  className = '',
}) {
  return (
    <section
      aria-labelledby="svc-faq-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <h2 id="svc-faq-title" className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <div>
        {items.map((item) => (
          <details
            key={item.id}
            className="group border-b border-gray-200 dark:border-gray-800"
            name={allowMultiple ? undefined : groupName}
            open={item.id === defaultOpenId}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-[1.125rem] text-[0.9375rem] font-semibold text-gray-900 marker:content-none hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
              {item.question}
              <ChevronIcon />
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}`,
      nextjs: `interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ServiceDetailFaqProps {
  title: string;
  items: FaqItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  groupName?: string;
  className?: string;
}

function ChevronIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// No 'use client' - and that is the whole point of building this on <details>.
// The exclusive behaviour is the browser's, so a Server Component can ship a
// working accordion with zero JavaScript.
export function ServiceDetailFaq({
  title,
  items,
  defaultOpenId,
  allowMultiple = false,
  groupName = 'service-faq',
  className = '',
}: ServiceDetailFaqProps) {
  return (
    <section
      aria-labelledby="svc-faq-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <h2 id="svc-faq-title" className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <div>
        {items.map((item: FaqItem) => (
          <details
            key={item.id}
            className="group border-b border-gray-200 dark:border-gray-800"
            name={allowMultiple ? undefined : groupName}
            open={item.id === defaultOpenId}
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-[1.125rem] text-[0.9375rem] font-semibold text-gray-900 marker:content-none hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
              {item.question}
              <ChevronIcon />
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceDetailFaqProps {
  title: string;
  items: FaqItem[];
  /** Open on mount. One open answer shows the pattern is expandable at all. */
  defaultOpenId?: string;
  /** Drops the shared name, so answers stop closing each other. */
  allowMultiple?: boolean;
  /** Scopes the exclusive group - unique per FAQ if a page carries two. */
  groupName?: string;
  className?: string;
}

function ChevronIcon(): JSX.Element {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] flex-none text-gray-500 transition group-open:rotate-180 motion-reduce:transition-none dark:text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ServiceDetailFaq({
  title,
  items,
  defaultOpenId,
  allowMultiple = false,
  groupName = 'service-faq',
  className = '',
}: ServiceDetailFaqProps): JSX.Element {
  return (
    <section
      aria-labelledby="svc-faq-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <h2
        id="svc-faq-title"
        className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div>
        {items.map((item: FaqItem) => (
          /*
           * <details> rather than a div and a state hook. The browser brings the
           * disclosure role, the expanded state, Enter/Space - and find-in-page,
           * which opens a closed answer when Ctrl+F lands inside it. A JS
           * accordion hides that text from the browser's own search.
           *
           * The shared \`name\` makes the group exclusive natively; dropping it is
           * the entire implementation of allowMultiple.
           */
          <details
            key={item.id}
            className="group border-b border-gray-200 dark:border-gray-800"
            name={allowMultiple ? undefined : groupName}
            open={item.id === defaultOpenId}
          >
            {/* The ring belongs on the summary - that is what takes focus. */}
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-[1.125rem] text-[0.9375rem] font-semibold text-gray-900 marker:content-none hover:text-blue-700 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:hover:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
              {item.question}
              <ChevronIcon />
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
];
