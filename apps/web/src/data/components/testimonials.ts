import type { ComponentEntry } from './types';

/**
 * Testimonials category.
 *
 * Ten structurally different ways to show social proof - a grid, a single
 * spotlight, a scroll-snap carousel, a masonry wall, logo-paired quotes, star
 * cards, video thumbnails, a split featured layout, an avatar strip and a
 * minimal serif pull-quote. Two constraints recur and are worth stating once:
 *
 *   - Avatars are initials on a gradient, never remote images. A testimonial
 *     wall that waits on a dozen network round-trips paints last and shifts
 *     layout as each face decodes; deriving initials from the name paints
 *     instantly and never 404s.
 *   - Stars are inline SVG wrapped in `role="img"` with an `aria-label`. A row
 *     of five glyphs is meaningless to a screen reader - the rating has to be
 *     said in words, once, not spelled out star by star.
 *
 * Only the three lean framework variants ship per entry (tailwind, react,
 * typescript); the tab strip renders what is present.
 */
export const testimonialsComponents: ComponentEntry[] = [
  {
    slug: 'testimonial-grid-three',
    category: 'testimonials',
    tags: ['testimonials', 'grid', 'quotes', 'social-proof', 'cards'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'heading', type: 'string', descriptionKey: 'heading', example: 'Loved by teams everywhere' },
      { name: 'items', type: 'Testimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
  <h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Loved by teams everywhere
  </h2>

  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li>
      <figure class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <blockquote class="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          &ldquo;We shipped in a week what used to take a quarter.&rdquo;
        </blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <span aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
            AO
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Amara Okafor</span>
            <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Head of Operations, Northwind</span>
          </span>
        </figcaption>
      </figure>
    </li>
    <!-- Repeat <li> per testimonial. Cards use h-full so a longer quote in one
         column does not leave its neighbours short. -->
  </ul>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', role: 'Head of Operations, Northwind' },
  { quote: 'Support actually answers, and the docs are good enough that we rarely need them.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
  { quote: 'It paid for itself in the first month. I do not say that about many tools.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
];

function initials(name) {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialGridThree({ heading, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {heading}
        </h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

export interface TestimonialGridThreeProps {
  heading?: string;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', role: 'Head of Operations, Northwind' },
  { quote: 'Support actually answers, and the docs are good enough that we rarely need them.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
  { quote: 'It paid for itself in the first month. I do not say that about many tools.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
];

// Initials from the name, not a remote avatar - the wall paints instantly and
// never waits on a face to decode.
function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialGridThree({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialGridThreeProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {heading}
        </h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">
                  {initials(t.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-spotlight-single',
    category: 'testimonials',
    tags: ['testimonials', 'spotlight', 'quote', 'featured', 'single'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'boxed', labelKey: 'boxed' },
    ],
    props: [
      { name: 'quote', type: 'string', required: true, descriptionKey: 'quote' },
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'role', type: 'string', descriptionKey: 'role' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="mx-auto h-8 w-8 text-blue-500/40 dark:text-blue-400/40">
    <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2H5v2h4V9zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2h-2v2h4V9z" />
  </svg>

  <figure>
    <blockquote class="mt-5 text-xl font-medium leading-relaxed tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
      &ldquo;The migration was boring in the best way - nothing broke, and nobody noticed.&rdquo;
    </blockquote>
    <figcaption class="mt-6 flex flex-col items-center gap-3">
      <span aria-hidden="true" class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-base font-semibold text-white">
        SB
      </span>
      <span>
        <span class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Sofia Bianchi</span>
        <span class="block text-xs text-gray-500 dark:text-gray-400">Product Designer, Vela</span>
      </span>
    </figcaption>
  </figure>
</section>`,
      react: `function initials(name) {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialSpotlightSingle({ quote, name, role, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 \${className}\`}>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mx-auto h-8 w-8 text-blue-500/40 dark:text-blue-400/40">
        <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2H5v2h4V9zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2h-2v2h4V9z" />
      </svg>

      <figure>
        <blockquote className="mt-5 text-xl font-medium leading-relaxed tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex flex-col items-center gap-3">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-base font-semibold text-white">
            {initials(name)}
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
            {role ? <span className="block text-xs text-gray-500 dark:text-gray-400">{role}</span> : null}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}`,
      typescript: `export interface TestimonialSpotlightSingleProps {
  quote: string;
  name: string;
  role?: string;
  className?: string;
}

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialSpotlightSingle({
  quote,
  name,
  role,
  className = '',
}: TestimonialSpotlightSingleProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 \${className}\`}>
      {/* Decorative quote mark - aria-hidden so it is not read as text. */}
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mx-auto h-8 w-8 text-blue-500/40 dark:text-blue-400/40">
        <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2H5v2h4V9zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v2h-2v2h4V9z" />
      </svg>

      <figure>
        <blockquote className="mt-5 text-xl font-medium leading-relaxed tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-6 flex flex-col items-center gap-3">
          <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-base font-semibold text-white">
            {initials(name)}
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
            {role ? <span className="block text-xs text-gray-500 dark:text-gray-400">{role}</span> : null}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-carousel',
    category: 'testimonials',
    tags: ['testimonials', 'carousel', 'scroll-snap', 'slider', 'quotes'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'peek', labelKey: 'peek' },
    ],
    props: [
      { name: 'heading', type: 'string', descriptionKey: 'heading' },
      { name: 'items', type: 'Testimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
  <h2 class="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    What customers say
  </h2>

  <!-- CSS scroll-snap, no JS. The list is focusable (tabindex) so it can be
       scrolled by keyboard; snap-mandatory settles each card to the edge. -->
  <ul
    tabindex="0"
    aria-label="Customer testimonials, scroll horizontally"
    class="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
  >
    <li class="w-full shrink-0 basis-[85%] snap-start sm:basis-[46%] lg:basis-[31%]">
      <figure class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <blockquote class="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          &ldquo;Our error rate dropped by half after we switched.&rdquo;
        </blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <span aria-hidden="true" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">MC</span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Marcus Chen</span>
            <span class="block truncate text-xs text-gray-500 dark:text-gray-400">CTO, Basepoint</span>
          </span>
        </figcaption>
      </figure>
    </li>
    <!-- Repeat <li> per testimonial. -->
  </ul>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', role: 'CTO, Basepoint' },
  { quote: 'Finally a dashboard the whole company reads instead of ignoring.', name: 'Lena Vogel', role: 'Marketing Director, Fathom' },
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
  { quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
];

function initials(name) {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialCarousel({ heading, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul
        tabIndex={0}
        aria-label="Customer testimonials, scroll horizontally"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
      >
        {items.map((t, i) => (
          <li key={i} className="w-full shrink-0 basis-[85%] snap-start sm:basis-[46%] lg:basis-[31%]">
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">{initials(t.name)}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

export interface TestimonialCarouselProps {
  heading?: string;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', role: 'CTO, Basepoint' },
  { quote: 'Finally a dashboard the whole company reads instead of ignoring.', name: 'Lena Vogel', role: 'Marketing Director, Fathom' },
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
  { quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

// Pure CSS scroll-snap - no state, no effect, so this stays a Server Component.
// The list is a focusable scroll region so a keyboard user can pan it too.
export function TestimonialCarousel({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialCarouselProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul
        tabIndex={0}
        aria-label="Customer testimonials, scroll horizontally"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400"
      >
        {items.map((t, i) => (
          <li key={i} className="w-full shrink-0 basis-[85%] snap-start sm:basis-[46%] lg:basis-[31%]">
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">{initials(t.name)}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-masonry-wall',
    category: 'testimonials',
    tags: ['testimonials', 'masonry', 'wall', 'columns', 'quotes'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'dense', labelKey: 'dense' },
    ],
    props: [
      { name: 'heading', type: 'string', descriptionKey: 'heading' },
      { name: 'items', type: 'Testimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
  <h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    From the wall
  </h2>

  <!-- CSS multi-column masonry: variable-height quotes flow down each column.
       break-inside-avoid keeps a card from splitting across a column break. -->
  <div class="columns-1 gap-4 sm:columns-2 lg:columns-3">
    <figure class="mb-4 break-inside-avoid rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        &ldquo;We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.&rdquo;
      </blockquote>
      <figcaption class="mt-4 flex items-center gap-3">
        <span aria-hidden="true" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">AO</span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Amara Okafor</span>
          <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Head of Operations, Northwind</span>
        </span>
      </figcaption>
    </figure>
    <!-- Repeat <figure> per testimonial; mix short and long quotes. -->
  </div>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { quote: 'We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.', name: 'Amara Okafor', role: 'Head of Operations, Northwind' },
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
  { quote: 'The migration was boring in the best way - nothing broke, and nobody noticed. That is the highest praise I can give an infra change.', name: 'Sofia Bianchi', role: 'Product Designer, Vela' },
  { quote: 'Support actually answers.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
  { quote: 'Our error rate dropped by half after we switched. Hard to argue with that.', name: 'Marcus Chen', role: 'CTO, Basepoint' },
  { quote: 'Finally a dashboard the whole company reads instead of ignoring.', name: 'Lena Vogel', role: 'Marketing Director, Fathom' },
];

function initials(name) {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialMasonryWall({ heading, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((t, i) => (
          <figure key={i} className="mb-4 break-inside-avoid rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">{initials(t.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

export interface TestimonialMasonryWallProps {
  heading?: string;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.', name: 'Amara Okafor', role: 'Head of Operations, Northwind' },
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead, Cadence' },
  { quote: 'The migration was boring in the best way - nothing broke, and nobody noticed. That is the highest praise I can give an infra change.', name: 'Sofia Bianchi', role: 'Product Designer, Vela' },
  { quote: 'Support actually answers.', name: 'Diego Ramirez', role: 'Founder, Loom Labs' },
  { quote: 'Our error rate dropped by half after we switched. Hard to argue with that.', name: 'Marcus Chen', role: 'CTO, Basepoint' },
  { quote: 'Finally a dashboard the whole company reads instead of ignoring.', name: 'Lena Vogel', role: 'Marketing Director, Fathom' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialMasonryWall({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialMasonryWallProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      {/* Multi-column flow, not grid: cards keep their natural height and
          break-inside-avoid stops one from splitting across a column. */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((t, i) => (
          <figure key={i} className="mb-4 break-inside-avoid rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white">{initials(t.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{t.role}</span> : null}
              </span>
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
    slug: 'testimonial-with-logos',
    category: 'testimonials',
    tags: ['testimonials', 'logos', 'brands', 'quotes', 'social-proof'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'plain', labelKey: 'plain' },
    ],
    props: [
      { name: 'heading', type: 'string', descriptionKey: 'heading' },
      { name: 'items', type: 'LogoTestimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
  <h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Trusted across industries
  </h2>

  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <li>
      <figure class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <!-- Wordmark as styled text, not an image file - no request, always crisp. -->
        <p class="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Northwind</p>
        <blockquote class="mt-3 flex-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">
          &ldquo;We shipped in a week what used to take a quarter.&rdquo;
        </blockquote>
        <figcaption class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-gray-100">Amara Okafor</span> · Head of Operations
        </figcaption>
      </figure>
    </li>
    <!-- Repeat <li> per testimonial. -->
  </ul>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { logo: 'Northwind', quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', role: 'Head of Operations' },
  { logo: 'Loom Labs', quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder' },
  { logo: 'Cadence', quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead' },
  { logo: 'Fathom', quote: 'Finally a dashboard the whole company reads.', name: 'Lena Vogel', role: 'Marketing Director' },
];

export function TestimonialWithLogos({ heading, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.logo}</p>
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? \` · \${t.role}\` : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface LogoTestimonial {
  /** Company wordmark, rendered as styled text - no image request. */
  logo: string;
  quote: string;
  name: string;
  role?: string;
}

export interface TestimonialWithLogosProps {
  heading?: string;
  items?: LogoTestimonial[];
  className?: string;
}

const DEFAULT_ITEMS: LogoTestimonial[] = [
  { logo: 'Northwind', quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', role: 'Head of Operations' },
  { logo: 'Loom Labs', quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder' },
  { logo: 'Cadence', quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead' },
  { logo: 'Fathom', quote: 'Finally a dashboard the whole company reads.', name: 'Lena Vogel', role: 'Marketing Director' },
];

export function TestimonialWithLogos({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialWithLogosProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              {/* Wordmark is text, not an SVG or PNG - it never 404s and stays
                  crisp at any zoom. Swap for a real logo when you have one. */}
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{t.logo}</p>
              <blockquote className="mt-3 flex-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? \` · \${t.role}\` : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-rating-cards',
    category: 'testimonials',
    tags: ['testimonials', 'rating', 'stars', 'reviews', 'cards'],
    difficulty: 'beginner',
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
      { name: 'heading', type: 'string', descriptionKey: 'heading' },
      { name: 'items', type: 'RatedTestimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
  <h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Rated by real users
  </h2>

  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li>
      <figure class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <!-- The whole row is one image with a worded label; the five glyphs
             themselves are aria-hidden so the rating is announced once. -->
        <div class="flex items-center gap-0.5" role="img" aria-label="Rated 5 out of 5">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
        </div>
        <blockquote class="mt-4 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          &ldquo;It paid for itself in the first month.&rdquo;
        </blockquote>
        <figcaption class="mt-4 text-sm">
          <span class="font-semibold text-gray-900 dark:text-gray-100">Priya Nair</span>
          <span class="text-gray-500 dark:text-gray-400"> · Engineering Lead</span>
        </figcaption>
      </figure>
    </li>
    <!-- Repeat <li> per review. -->
  </ul>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { rating: 5, quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead' },
  { rating: 5, quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder' },
  { rating: 4, quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', role: 'CTO' },
];

function Stars({ rating = 5, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={\`Rated \${rating} out of \${max}\`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={\`h-4 w-4 \${i < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialRatingCards({ heading, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <Stars rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="text-gray-500 dark:text-gray-400"> · {t.role}</span> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface RatedTestimonial {
  /** 0-5. Clamped when rendered so a stray 7 cannot draw seven stars. */
  rating: number;
  quote: string;
  name: string;
  role?: string;
}

export interface TestimonialRatingCardsProps {
  heading?: string;
  items?: RatedTestimonial[];
  className?: string;
}

const DEFAULT_ITEMS: RatedTestimonial[] = [
  { rating: 5, quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Engineering Lead' },
  { rating: 5, quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Founder' },
  { rating: 4, quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', role: 'CTO' },
];

// One role="img" with a worded label; the individual glyphs are aria-hidden so
// the rating is announced as "Rated 4 out of 5", not five separate "star"s.
function Stars({ rating = 5, max = 5 }: { rating?: number; max?: number }): JSX.Element {
  const filled = Math.max(0, Math.min(max, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={\`Rated \${filled} out of \${max}\`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={\`h-4 w-4 \${i < filled ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialRatingCards({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialRatingCardsProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <Stars rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="text-gray-500 dark:text-gray-400"> · {t.role}</span> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-video-thumb',
    category: 'testimonials',
    tags: ['testimonials', 'video', 'thumbnail', 'play', 'cards'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'stacked', labelKey: 'stacked' },
    ],
    props: [
      { name: 'heading', type: 'string', descriptionKey: 'heading' },
      { name: 'items', type: 'VideoTestimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
  <h2 class="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Hear it from them
  </h2>

  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li>
      <figure class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <!-- The thumbnail is a gradient stand-in, not a remote poster. The play
             control is a real link with an accessible name - not a bare icon. -->
        <a href="#" class="group relative block aspect-video bg-gradient-to-br from-slate-700 to-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400">
          <span class="absolute inset-0 grid place-items-center">
            <span class="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110 motion-reduce:transition-none">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5 translate-x-0.5 text-gray-900"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
          <span class="sr-only">Play video testimonial from Amara Okafor</span>
        </a>
        <figcaption class="flex flex-1 flex-col p-5">
          <blockquote class="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            &ldquo;We shipped in a week what used to take a quarter.&rdquo;
          </blockquote>
          <span class="mt-3 text-sm">
            <span class="font-semibold text-gray-900 dark:text-gray-100">Amara Okafor</span>
            <span class="text-gray-500 dark:text-gray-400"> · Northwind</span>
          </span>
        </figcaption>
      </figure>
    </li>
    <!-- Repeat <li> per testimonial. -->
  </ul>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', company: 'Northwind', href: '#' },
  { quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', company: 'Basepoint', href: '#' },
  { quote: 'Finally a dashboard the whole company reads.', name: 'Lena Vogel', company: 'Fathom', href: '#' },
];

export function TestimonialVideoThumb({ heading, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <a href={t.href ?? '#'} className="group relative block aspect-video bg-gradient-to-br from-slate-700 to-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400">
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110 motion-reduce:transition-none">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 translate-x-0.5 text-gray-900"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
                <span className="sr-only">Play video testimonial from {t.name}</span>
              </a>
              <figcaption className="flex flex-1 flex-col p-5">
                <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
                <span className="mt-3 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.company ? <span className="text-gray-500 dark:text-gray-400"> · {t.company}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface VideoTestimonial {
  quote: string;
  name: string;
  company?: string;
  /** Where the play control links - a video page or modal trigger. */
  href?: string;
}

export interface TestimonialVideoThumbProps {
  heading?: string;
  items?: VideoTestimonial[];
  className?: string;
}

const DEFAULT_ITEMS: VideoTestimonial[] = [
  { quote: 'We shipped in a week what used to take a quarter.', name: 'Amara Okafor', company: 'Northwind', href: '#' },
  { quote: 'Our error rate dropped by half after we switched.', name: 'Marcus Chen', company: 'Basepoint', href: '#' },
  { quote: 'Finally a dashboard the whole company reads.', name: 'Lena Vogel', company: 'Fathom', href: '#' },
];

export function TestimonialVideoThumb({
  heading,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialVideoThumbProps): JSX.Element {
  return (
    <section className={\`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 \${className}\`}>
      {heading ? (
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h2>
      ) : null}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              {/* Gradient stand-in for a poster - no remote image to wait on.
                  The play control is a real link with an sr-only name, so it is
                  never a nameless icon to a screen reader. */}
              <a href={t.href ?? '#'} className="group relative block aspect-video bg-gradient-to-br from-slate-700 to-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400">
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110 motion-reduce:transition-none">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 translate-x-0.5 text-gray-900"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
                <span className="sr-only">Play video testimonial from {t.name}</span>
              </a>
              <figcaption className="flex flex-1 flex-col p-5">
                <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
                <span className="mt-3 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                  {t.company ? <span className="text-gray-500 dark:text-gray-400"> · {t.company}</span> : null}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-split-featured',
    category: 'testimonials',
    tags: ['testimonials', 'split', 'featured', 'layout', 'quotes'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'inverted', labelKey: 'inverted' },
    ],
    props: [
      { name: 'featured', type: 'Testimonial', descriptionKey: 'featured' },
      { name: 'items', type: 'Testimonial[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2">
  <!-- Featured quote gets its own painted surface so it reads as primary even
       before the smaller list loads beside it. -->
  <figure class="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 text-white">
    <blockquote class="text-xl font-medium leading-relaxed sm:text-2xl">
      &ldquo;We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.&rdquo;
    </blockquote>
    <figcaption class="mt-6 flex items-center gap-3">
      <span aria-hidden="true" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">AO</span>
      <span>
        <span class="block text-sm font-semibold">Amara Okafor</span>
        <span class="block text-xs text-blue-100">Head of Operations, Northwind</span>
      </span>
    </figcaption>
  </figure>

  <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
    <li>
      <figure class="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <blockquote class="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          &ldquo;It paid for itself in the first month.&rdquo;
        </blockquote>
        <figcaption class="mt-4 text-sm">
          <span class="font-semibold text-gray-900 dark:text-gray-100">Priya Nair</span>
          <span class="text-gray-500 dark:text-gray-400"> · Cadence</span>
        </figcaption>
      </figure>
    </li>
    <!-- Repeat secondary <li> items. -->
  </ul>
</section>`,
      react: `const DEFAULT_FEATURED = {
  quote: 'We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.',
  name: 'Amara Okafor',
  role: 'Head of Operations, Northwind',
};

const DEFAULT_ITEMS = [
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Cadence' },
  { quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Loom Labs' },
];

function initials(name) {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialSplitFeatured({ featured = DEFAULT_FEATURED, items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 \${className}\`}>
      <figure className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 text-white">
        <blockquote className="text-xl font-medium leading-relaxed sm:text-2xl">&ldquo;{featured.quote}&rdquo;</blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">{initials(featured.name)}</span>
          <span>
            <span className="block text-sm font-semibold">{featured.name}</span>
            {featured.role ? <span className="block text-xs text-blue-100">{featured.role}</span> : null}
          </span>
        </figcaption>
      </figure>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="text-gray-500 dark:text-gray-400"> · {t.role}</span> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

export interface TestimonialSplitFeaturedProps {
  featured?: Testimonial;
  items?: Testimonial[];
  className?: string;
}

const DEFAULT_FEATURED: Testimonial = {
  quote: 'We shipped in a week what used to take a quarter. The team stopped fighting the tooling and started building.',
  name: 'Amara Okafor',
  role: 'Head of Operations, Northwind',
};

const DEFAULT_ITEMS: Testimonial[] = [
  { quote: 'It paid for itself in the first month.', name: 'Priya Nair', role: 'Cadence' },
  { quote: 'Support actually answers, and the docs are good.', name: 'Diego Ramirez', role: 'Loom Labs' },
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

export function TestimonialSplitFeatured({
  featured = DEFAULT_FEATURED,
  items = DEFAULT_ITEMS,
  className = '',
}: TestimonialSplitFeaturedProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-2 \${className}\`}>
      {/* Featured quote paints its own surface - the white/20 avatar and
          blue-100 role both clear AA on the gradient, which is fixed here so it
          does not have to survive an arbitrary page background. */}
      <figure className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 text-white">
        <blockquote className="text-xl font-medium leading-relaxed sm:text-2xl">&ldquo;{featured.quote}&rdquo;</blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">{initials(featured.name)}</span>
          <span>
            <span className="block text-sm font-semibold">{featured.name}</span>
            {featured.role ? <span className="block text-xs text-blue-100">{featured.role}</span> : null}
          </span>
        </figcaption>
      </figure>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {items.map((t, i) => (
          <li key={i}>
            <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
                {t.role ? <span className="text-gray-500 dark:text-gray-400"> · {t.role}</span> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-avatar-strip',
    category: 'testimonials',
    tags: ['testimonials', 'avatars', 'strip', 'social-proof', 'compact'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'left', labelKey: 'left' },
    ],
    props: [
      { name: 'names', type: 'string[]', descriptionKey: 'names' },
      { name: 'rating', type: 'number', default: '5', descriptionKey: 'rating' },
      { name: 'label', type: 'string', descriptionKey: 'label' },
      { name: 'quote', type: 'string', descriptionKey: 'quote' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-xl px-4 py-10 text-center sm:px-6">
  <!-- Overlapping avatars: an unordered list of initials; the ring makes the
       stack legible where circles overlap on both themes. -->
  <ul class="flex justify-center -space-x-3">
    <li class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950">AO</li>
    <li class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950">DR</li>
    <li class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950">PN</li>
    <li class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950">SB</li>
    <li class="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-950">+9</li>
  </ul>

  <div class="mt-4 flex items-center justify-center gap-0.5" role="img" aria-label="Rated 5 out of 5">
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-4 w-4 text-amber-400"><path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" /></svg>
  </div>

  <p class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Loved by 2,000+ teams</p>
  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">&ldquo;The one tool nobody on the team wants to give up.&rdquo;</p>
</section>`,
      react: `const DEFAULT_NAMES = ['Amara Okafor', 'Diego Ramirez', 'Priya Nair', 'Sofia Bianchi'];
const GRADIENTS = [
  'from-blue-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
];

function initials(name) {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

function Stars({ rating = 5, max = 5 }) {
  return (
    <div className="mt-4 flex items-center justify-center gap-0.5" role="img" aria-label={\`Rated \${rating} out of \${max}\`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={\`h-4 w-4 \${i < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialAvatarStrip({
  names = DEFAULT_NAMES,
  rating = 5,
  label = 'Loved by 2,000+ teams',
  quote = 'The one tool nobody on the team wants to give up.',
  className = '',
}) {
  const shown = names.slice(0, 4);
  const extra = names.length - shown.length;
  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-10 text-center sm:px-6 \${className}\`}>
      <ul className="flex justify-center -space-x-3">
        {shown.map((name, i) => (
          <li key={i} className={\`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br \${GRADIENTS[i % GRADIENTS.length]} text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950\`}>
            {initials(name)}
          </li>
        ))}
        {extra > 0 ? (
          <li className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-950">
            +{extra}
          </li>
        ) : null}
      </ul>

      <Stars rating={rating} />

      <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {quote ? <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">&ldquo;{quote}&rdquo;</p> : null}
    </section>
  );
}`,
      typescript: `export interface TestimonialAvatarStripProps {
  names?: string[];
  rating?: number;
  label?: string;
  quote?: string;
  className?: string;
}

const DEFAULT_NAMES = ['Amara Okafor', 'Diego Ramirez', 'Priya Nair', 'Sofia Bianchi'];
const GRADIENTS = [
  'from-blue-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
];

function initials(name: string): string {
  return name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase();
}

function Stars({ rating = 5, max = 5 }: { rating?: number; max?: number }): JSX.Element {
  const filled = Math.max(0, Math.min(max, Math.round(rating)));
  return (
    <div className="mt-4 flex items-center justify-center gap-0.5" role="img" aria-label={\`Rated \${filled} out of \${max}\`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={\`h-4 w-4 \${i < filled ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}\`}>
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.77l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialAvatarStrip({
  names = DEFAULT_NAMES,
  rating = 5,
  label = 'Loved by 2,000+ teams',
  quote = 'The one tool nobody on the team wants to give up.',
  className = '',
}: TestimonialAvatarStripProps): JSX.Element {
  const shown = names.slice(0, 4);
  const extra = names.length - shown.length;
  return (
    <section className={\`mx-auto w-full max-w-xl px-4 py-10 text-center sm:px-6 \${className}\`}>
      {/* Colour is decorative; the initials carry identity, and the +N tile is a
          gray neutral so it never reads as another person. */}
      <ul className="flex justify-center -space-x-3">
        {shown.map((name, i) => (
          <li key={i} className={\`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br \${GRADIENTS[i % GRADIENTS.length]} text-xs font-semibold text-white ring-2 ring-white dark:ring-gray-950\`}>
            {initials(name)}
          </li>
        ))}
        {extra > 0 ? (
          <li className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-950">
            +{extra}
          </li>
        ) : null}
      </ul>

      <Stars rating={rating} />

      <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {quote ? <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">&ldquo;{quote}&rdquo;</p> : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'testimonial-minimal-serif',
    category: 'testimonials',
    tags: ['testimonials', 'serif', 'minimal', 'quote', 'editorial'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'left', labelKey: 'left' },
    ],
    props: [
      { name: 'quote', type: 'string', required: true, descriptionKey: 'quote' },
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'role', type: 'string', descriptionKey: 'role' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<figure class="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
  <blockquote class="font-serif text-2xl italic leading-snug text-gray-900 sm:text-3xl dark:text-gray-100">
    &ldquo;The migration was boring in the best way - nothing broke, and nobody noticed.&rdquo;
  </blockquote>
  <figcaption class="mt-6 text-sm text-gray-500 dark:text-gray-400">
    <span class="font-semibold not-italic text-gray-900 dark:text-gray-100">Sofia Bianchi</span>
    <span class="mx-2 text-gray-300 dark:text-gray-600" aria-hidden="true">-</span>
    Product Designer, Vela
  </figcaption>
</figure>`,
      react: `export function TestimonialMinimalSerif({ quote, name, role, className = '' }) {
  return (
    <figure className={\`mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 \${className}\`}>
      <blockquote className="font-serif text-2xl italic leading-snug text-gray-900 sm:text-3xl dark:text-gray-100">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold not-italic text-gray-900 dark:text-gray-100">{name}</span>
        {role ? (
          <>
            <span className="mx-2 text-gray-300 dark:text-gray-600" aria-hidden="true">-</span>
            {role}
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}`,
      typescript: `export interface TestimonialMinimalSerifProps {
  quote: string;
  name: string;
  role?: string;
  className?: string;
}

export function TestimonialMinimalSerif({
  quote,
  name,
  role,
  className = '',
}: TestimonialMinimalSerifProps): JSX.Element {
  return (
    <figure className={\`mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6 \${className}\`}>
      {/* not-italic on the name keeps it upright against the italic quote, so it
          reads as attribution rather than part of the sentence. */}
      <blockquote className="font-serif text-2xl italic leading-snug text-gray-900 sm:text-3xl dark:text-gray-100">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold not-italic text-gray-900 dark:text-gray-100">{name}</span>
        {role ? (
          <>
            <span className="mx-2 text-gray-300 dark:text-gray-600" aria-hidden="true">-</span>
            {role}
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}`,
    },
  },
];
