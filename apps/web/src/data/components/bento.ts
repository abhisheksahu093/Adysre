import type { ComponentEntry } from './types';

/**
 * Bento category - asymmetric tile grids.
 *
 * The whole category rests on one responsive rule: the desktop bento look comes
 * from `col-span`/`row-span` on a multi-column grid, but the *base* layout is a
 * single column and every span is `sm:`-prefixed. Below the breakpoint the grid
 * is `grid-cols-1` and no tile spans anything, so nothing can push past a 320px
 * viewport. The span is the layout, not decoration - but it is desktop-only.
 */
export const bentoComponents: ComponentEntry[] = [
  {
    slug: 'bento-features-3x2',
    category: 'bento',
    tags: ['bento', 'features', 'grid', 'spans', 'asymmetric'],
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
      { name: 'features', type: 'Feature[]', descriptionKey: 'features' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The grid is grid-cols-1 on phones; every span is sm:-prefixed. The big tile's
  sm:col-span-2 sm:row-span-2 is the whole bento effect, and it is desktop-only -
  at 320px each tile is one full-width row and nothing can overflow.
-->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
  <article class="flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 sm:row-span-2">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Realtime sync</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Every change lands on every device the instant it happens - no refresh, no merge dialog.</p>
  </article>
  <article class="flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Version history</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Roll back to any point.</p>
  </article>
  <article class="flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Access control</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Roles down to the field.</p>
  </article>
  <article class="flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Audit log</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Who did what, when.</p>
  </article>
  <article class="flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Integrations</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Connect the tools your team already lives in, in a couple of clicks.</p>
  </article>
</section>`,
      react: `const DEFAULT_FEATURES = [
  { title: 'Realtime sync', description: 'Every change lands on every device the instant it happens - no refresh, no merge dialog.', className: 'sm:col-span-2 sm:row-span-2' },
  { title: 'Version history', description: 'Roll back to any point.' },
  { title: 'Access control', description: 'Roles down to the field.' },
  { title: 'Audit log', description: 'Who did what, when.' },
  { title: 'Integrations', description: 'Connect the tools your team already lives in, in a couple of clicks.', className: 'sm:col-span-2' },
];

export function BentoFeatures3x2({ features = DEFAULT_FEATURES, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {features.map((f, i) => (
        <article
          key={i}
          className={\`flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${f.className ?? ''}\`}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}`,
      typescript: `export interface Feature {
  title: string;
  description: string;
  /** Tailwind span classes - the layout. Prefix with sm: so it stays desktop-only. */
  className?: string;
}

export interface BentoFeatures3x2Props {
  features?: Feature[];
  className?: string;
}

const DEFAULT_FEATURES: Feature[] = [
  { title: 'Realtime sync', description: 'Every change lands on every device the instant it happens - no refresh, no merge dialog.', className: 'sm:col-span-2 sm:row-span-2' },
  { title: 'Version history', description: 'Roll back to any point.' },
  { title: 'Access control', description: 'Roles down to the field.' },
  { title: 'Audit log', description: 'Who did what, when.' },
  { title: 'Integrations', description: 'Connect the tools your team already lives in, in a couple of clicks.', className: 'sm:col-span-2' },
];

export function BentoFeatures3x2({ features = DEFAULT_FEATURES, className = '' }: BentoFeatures3x2Props): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {features.map((f, i) => (
        <article
          key={i}
          className={\`flex min-h-32 flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${f.className ?? ''}\`}
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-product-showcase',
    category: 'bento',
    tags: ['bento', 'product', 'showcase', 'links', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'flat', labelKey: 'flat' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'products', type: 'Product[]', descriptionKey: 'products' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Each tile is a whole-card link (focus ring on the anchor). Gradient panels
     stand in for product art so there is no image to preload or let rot. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
  <a href="#" class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900 sm:col-span-2 sm:row-span-2">
    <div class="min-h-40 flex-1 bg-gradient-to-br from-indigo-500 to-blue-600" aria-hidden="true"></div>
    <div class="p-5">
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Studio</h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">The full design surface - canvas, components and handoff in one file.</p>
    </div>
  </a>
  <a href="#" class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900">
    <div class="min-h-24 flex-1 bg-gradient-to-br from-rose-500 to-orange-500" aria-hidden="true"></div>
    <div class="p-4"><h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Boards</h3></div>
  </a>
  <a href="#" class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900">
    <div class="min-h-24 flex-1 bg-gradient-to-br from-emerald-500 to-teal-600" aria-hidden="true"></div>
    <div class="p-4"><h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Docs</h3></div>
  </a>
  <a href="#" class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900 sm:col-span-3">
    <div class="min-h-20 flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" aria-hidden="true"></div>
    <div class="p-4"><h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Automations</h3><p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Wire your stack together without code.</p></div>
  </a>
</section>`,
      react: `const DEFAULT_PRODUCTS = [
  { name: 'Studio', tagline: 'The full design surface - canvas, components and handoff in one file.', href: '#', gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600', className: 'sm:col-span-2 sm:row-span-2', media: 'min-h-40' },
  { name: 'Boards', href: '#', gradient: 'bg-gradient-to-br from-rose-500 to-orange-500', media: 'min-h-24' },
  { name: 'Docs', href: '#', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', media: 'min-h-24' },
  { name: 'Automations', tagline: 'Wire your stack together without code.', href: '#', gradient: 'bg-gradient-to-r from-violet-500 to-fuchsia-500', className: 'sm:col-span-3', media: 'min-h-20' },
];

export function BentoProductShowcase({ products = DEFAULT_PRODUCTS, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {products.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className={\`group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900 \${p.className ?? ''}\`}
        >
          <div className={\`flex-1 \${p.media ?? 'min-h-24'} \${p.gradient}\`} aria-hidden="true" />
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</h3>
            {p.tagline ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.tagline}</p> : null}
          </div>
        </a>
      ))}
    </section>
  );
}`,
      typescript: `export interface Product {
  name: string;
  tagline?: string;
  href: string;
  /** Tailwind gradient class for the media panel. */
  gradient: string;
  /** Span classes (sm:-prefixed) that build the bento shape. */
  className?: string;
  /** min-height utility for the media panel. */
  media?: string;
}

export interface BentoProductShowcaseProps {
  products?: Product[];
  className?: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  { name: 'Studio', tagline: 'The full design surface - canvas, components and handoff in one file.', href: '#', gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600', className: 'sm:col-span-2 sm:row-span-2', media: 'min-h-40' },
  { name: 'Boards', href: '#', gradient: 'bg-gradient-to-br from-rose-500 to-orange-500', media: 'min-h-24' },
  { name: 'Docs', href: '#', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', media: 'min-h-24' },
  { name: 'Automations', tagline: 'Wire your stack together without code.', href: '#', gradient: 'bg-gradient-to-r from-violet-500 to-fuchsia-500', className: 'sm:col-span-3', media: 'min-h-20' },
];

export function BentoProductShowcase({ products = DEFAULT_PRODUCTS, className = '' }: BentoProductShowcaseProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {products.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className={\`group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900 \${p.className ?? ''}\`}
        >
          <div className={\`flex-1 \${p.media ?? 'min-h-24'} \${p.gradient}\`} aria-hidden="true" />
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</h3>
            {p.tagline ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.tagline}</p> : null}
          </div>
        </a>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-stats-mixed',
    category: 'bento',
    tags: ['bento', 'stats', 'metrics', 'kpi', 'grid'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'accent', labelKey: 'accent' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'stats', type: 'Stat[]', descriptionKey: 'stats' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Each metric is a <dl> pair: dt (label) then dd (value) in the DOM, but the
     value is shown first with order-* so a screen reader still reads label→value. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-4 sm:p-6">
  <dl class="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white sm:col-span-2 sm:row-span-2">
    <dd class="order-1 text-4xl font-bold tracking-tight sm:text-5xl">99.99%</dd>
    <dt class="order-2 mt-2 text-sm font-medium text-blue-100">Uptime across all regions, measured every minute</dt>
  </dl>
  <dl class="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
    <dd class="order-1 text-3xl font-bold text-gray-900 dark:text-gray-100">2.4M</dd>
    <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">Requests per minute</dt>
  </dl>
  <dl class="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dd class="order-1 text-3xl font-bold text-gray-900 dark:text-gray-100">38ms</dd>
    <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">p95 latency</dt>
  </dl>
  <dl class="flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <dd class="order-1 text-3xl font-bold text-gray-900 dark:text-gray-100">150+</dd>
    <dt class="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">Edge locations</dt>
  </dl>
</section>`,
      react: `const DEFAULT_STATS = [
  { value: '99.99%', label: 'Uptime across all regions, measured every minute', featured: true, className: 'sm:col-span-2 sm:row-span-2' },
  { value: '2.4M', label: 'Requests per minute', className: 'sm:col-span-2' },
  { value: '38ms', label: 'p95 latency' },
  { value: '150+', label: 'Edge locations' },
];

export function BentoStatsMixed({ stats = DEFAULT_STATS, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-4 sm:p-6 \${className}\`}>
      {stats.map((s, i) =>
        s.featured ? (
          <dl key={i} className={\`flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white \${s.className ?? ''}\`}>
            <dd className="order-1 text-4xl font-bold tracking-tight sm:text-5xl">{s.value}</dd>
            <dt className="order-2 mt-2 text-sm font-medium text-blue-100">{s.label}</dt>
          </dl>
        ) : (
          <dl key={i} className={\`flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${s.className ?? ''}\`}>
            <dd className="order-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
            <dt className="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">{s.label}</dt>
          </dl>
        ),
      )}
    </section>
  );
}`,
      typescript: `export interface Stat {
  value: string;
  label: string;
  /** The one hero metric rendered on a gradient panel. */
  featured?: boolean;
  /** Span classes (sm:-prefixed). */
  className?: string;
}

export interface BentoStatsMixedProps {
  stats?: Stat[];
  className?: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: '99.99%', label: 'Uptime across all regions, measured every minute', featured: true, className: 'sm:col-span-2 sm:row-span-2' },
  { value: '2.4M', label: 'Requests per minute', className: 'sm:col-span-2' },
  { value: '38ms', label: 'p95 latency' },
  { value: '150+', label: 'Edge locations' },
];

export function BentoStatsMixed({ stats = DEFAULT_STATS, className = '' }: BentoStatsMixedProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-4 sm:p-6 \${className}\`}>
      {stats.map((s, i) =>
        s.featured ? (
          <dl key={i} className={\`flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white \${s.className ?? ''}\`}>
            <dd className="order-1 text-4xl font-bold tracking-tight sm:text-5xl">{s.value}</dd>
            <dt className="order-2 mt-2 text-sm font-medium text-blue-100">{s.label}</dt>
          </dl>
        ) : (
          <dl key={i} className={\`flex flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${s.className ?? ''}\`}>
            <dd className="order-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
            <dt className="order-2 mt-1 text-sm text-gray-600 dark:text-gray-400">{s.label}</dt>
          </dl>
        ),
      )}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-gradient-tiles',
    category: 'bento',
    tags: ['bento', 'gradient', 'tiles', 'colorful', 'grid'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'vivid', labelKey: 'vivid' },
      { id: 'muted', labelKey: 'muted' },
    ],
    props: [
      { name: 'tiles', type: 'GradientTile[]', descriptionKey: 'tiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Labels sit on their own gradient, which each tile paints; white text plus a
     font-semibold weight clears AA on every stop, so there is no theme block. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
  <div class="flex min-h-40 items-end rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-700 p-5 sm:col-span-2 sm:row-span-2">
    <span class="text-lg font-semibold text-white">Design</span>
  </div>
  <div class="flex min-h-32 items-end rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-5">
    <span class="text-base font-semibold text-white">Build</span>
  </div>
  <div class="flex min-h-32 items-end rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5">
    <span class="text-base font-semibold text-white">Ship</span>
  </div>
  <div class="flex min-h-32 items-end rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-5 sm:col-span-3">
    <span class="text-base font-semibold text-white">Measure</span>
  </div>
</section>`,
      react: `const DEFAULT_TILES = [
  { label: 'Design', gradient: 'bg-gradient-to-br from-fuchsia-600 to-purple-700', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-40' },
  { label: 'Build', gradient: 'bg-gradient-to-br from-sky-500 to-blue-600', minH: 'min-h-32' },
  { label: 'Ship', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', minH: 'min-h-32' },
  { label: 'Measure', gradient: 'bg-gradient-to-r from-amber-500 to-orange-600', className: 'sm:col-span-3', minH: 'min-h-32' },
];

export function BentoGradientTiles({ tiles = DEFAULT_TILES, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {tiles.map((t, i) => (
        <div key={i} className={\`flex items-end rounded-2xl p-5 \${t.minH ?? 'min-h-32'} \${t.gradient} \${t.className ?? ''}\`}>
          <span className="text-base font-semibold text-white">{t.label}</span>
        </div>
      ))}
    </section>
  );
}`,
      typescript: `export interface GradientTile {
  label: string;
  /** Tailwind gradient class. */
  gradient: string;
  /** Span classes (sm:-prefixed). */
  className?: string;
  /** min-height utility. */
  minH?: string;
}

export interface BentoGradientTilesProps {
  tiles?: GradientTile[];
  className?: string;
}

const DEFAULT_TILES: GradientTile[] = [
  { label: 'Design', gradient: 'bg-gradient-to-br from-fuchsia-600 to-purple-700', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-40' },
  { label: 'Build', gradient: 'bg-gradient-to-br from-sky-500 to-blue-600', minH: 'min-h-32' },
  { label: 'Ship', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', minH: 'min-h-32' },
  { label: 'Measure', gradient: 'bg-gradient-to-r from-amber-500 to-orange-600', className: 'sm:col-span-3', minH: 'min-h-32' },
];

export function BentoGradientTiles({ tiles = DEFAULT_TILES, className = '' }: BentoGradientTilesProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {tiles.map((t, i) => (
        <div key={i} className={\`flex items-end rounded-2xl p-5 \${t.minH ?? 'min-h-32'} \${t.gradient} \${t.className ?? ''}\`}>
          <span className="text-base font-semibold text-white">{t.label}</span>
        </div>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-image-collage',
    category: 'bento',
    tags: ['bento', 'collage', 'gallery', 'figure', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'captioned', labelKey: 'captioned' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'CollageItem[]', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Gradient panels stand in for photos, so there is no external image. Each is a
     <figure> with a real <figcaption> rather than alt text on a fake <img>. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 p-4 sm:grid-cols-4 sm:p-6">
  <figure class="overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2">
    <div class="min-h-48 w-full bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200" aria-hidden="true"></div>
    <figcaption class="p-3 text-sm text-gray-600 dark:text-gray-400">Sunrise, Dolomites</figcaption>
  </figure>
  <figure class="overflow-hidden rounded-2xl">
    <div class="min-h-28 w-full bg-gradient-to-br from-cyan-400 to-blue-500" aria-hidden="true"></div>
    <figcaption class="p-3 text-sm text-gray-600 dark:text-gray-400">Coastline</figcaption>
  </figure>
  <figure class="overflow-hidden rounded-2xl">
    <div class="min-h-28 w-full bg-gradient-to-br from-violet-500 to-fuchsia-500" aria-hidden="true"></div>
    <figcaption class="p-3 text-sm text-gray-600 dark:text-gray-400">Night market</figcaption>
  </figure>
  <figure class="overflow-hidden rounded-2xl sm:col-span-2">
    <div class="min-h-28 w-full bg-gradient-to-r from-emerald-400 to-teal-500" aria-hidden="true"></div>
    <figcaption class="p-3 text-sm text-gray-600 dark:text-gray-400">Rice terraces</figcaption>
  </figure>
</section>`,
      react: `const DEFAULT_ITEMS = [
  { caption: 'Sunrise, Dolomites', gradient: 'bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-48' },
  { caption: 'Coastline', gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500', minH: 'min-h-28' },
  { caption: 'Night market', gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-500', minH: 'min-h-28' },
  { caption: 'Rice terraces', gradient: 'bg-gradient-to-r from-emerald-400 to-teal-500', className: 'sm:col-span-2', minH: 'min-h-28' },
];

export function BentoImageCollage({ items = DEFAULT_ITEMS, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 p-4 sm:grid-cols-4 sm:p-6 \${className}\`}>
      {items.map((it, i) => (
        <figure key={i} className={\`overflow-hidden rounded-2xl \${it.className ?? ''}\`}>
          <div className={\`w-full \${it.minH ?? 'min-h-28'} \${it.gradient}\`} aria-hidden="true" />
          <figcaption className="p-3 text-sm text-gray-600 dark:text-gray-400">{it.caption}</figcaption>
        </figure>
      ))}
    </section>
  );
}`,
      typescript: `export interface CollageItem {
  caption: string;
  /** Tailwind gradient standing in for the photo. */
  gradient: string;
  /** Span classes (sm:-prefixed). */
  className?: string;
  minH?: string;
}

export interface BentoImageCollageProps {
  items?: CollageItem[];
  className?: string;
}

const DEFAULT_ITEMS: CollageItem[] = [
  { caption: 'Sunrise, Dolomites', gradient: 'bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-48' },
  { caption: 'Coastline', gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500', minH: 'min-h-28' },
  { caption: 'Night market', gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-500', minH: 'min-h-28' },
  { caption: 'Rice terraces', gradient: 'bg-gradient-to-r from-emerald-400 to-teal-500', className: 'sm:col-span-2', minH: 'min-h-28' },
];

export function BentoImageCollage({ items = DEFAULT_ITEMS, className = '' }: BentoImageCollageProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 p-4 sm:grid-cols-4 sm:p-6 \${className}\`}>
      {items.map((it, i) => (
        <figure key={i} className={\`overflow-hidden rounded-2xl \${it.className ?? ''}\`}>
          <div className={\`w-full \${it.minH ?? 'min-h-28'} \${it.gradient}\`} aria-hidden="true" />
          <figcaption className="p-3 text-sm text-gray-600 dark:text-gray-400">{it.caption}</figcaption>
        </figure>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-app-preview',
    category: 'bento',
    tags: ['bento', 'app', 'mockup', 'saas', 'grid'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'light', labelKey: 'light' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'features', type: 'AppFeature[]', descriptionKey: 'features' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The big tile is a pure-CSS app mockup (aria-hidden - it illustrates, it does
     not carry content). The bars are gradient divs, so nothing loads or rots. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 sm:row-span-2" aria-hidden="true">
    <div class="flex items-center gap-1.5 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      <span class="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
    </div>
    <div class="space-y-3 p-5">
      <div class="h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600"></div>
      <div class="grid grid-cols-3 gap-3">
        <div class="h-14 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
        <div class="h-14 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
        <div class="h-14 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
      </div>
      <div class="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800"></div>
    </div>
  </div>
  <article class="flex min-h-28 flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">One dashboard</h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Everything in a glance.</p>
  </article>
  <article class="flex min-h-28 flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Live data</h3>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Updates as it happens.</p>
  </article>
</section>`,
      react: `const DEFAULT_FEATURES = [
  { title: 'One dashboard', description: 'Everything in a glance.' },
  { title: 'Live data', description: 'Updates as it happens.' },
];

export function BentoAppPreview({ features = DEFAULT_FEATURES, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 sm:row-span-2" aria-hidden="true">
        <div className="flex items-center gap-1.5 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="space-y-3 p-5">
          <div className="h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
      {features.map((f, i) => (
        <article key={i} className="flex min-h-28 flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}`,
      typescript: `export interface AppFeature {
  title: string;
  description: string;
}

export interface BentoAppPreviewProps {
  features?: AppFeature[];
  className?: string;
}

const DEFAULT_FEATURES: AppFeature[] = [
  { title: 'One dashboard', description: 'Everything in a glance.' },
  { title: 'Live data', description: 'Updates as it happens.' },
];

export function BentoAppPreview({ features = DEFAULT_FEATURES, className = '' }: BentoAppPreviewProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 sm:row-span-2" aria-hidden="true">
        <div className="flex items-center gap-1.5 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="space-y-3 p-5">
          <div className="h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
            <div className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
      {features.map((f, i) => (
        <article key={i} className="flex min-h-28 flex-col justify-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-testimonial-mix',
    category: 'bento',
    tags: ['bento', 'testimonials', 'quotes', 'social-proof', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'accent', labelKey: 'accent' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'testimonials', type: 'Testimonial[]', descriptionKey: 'testimonials' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Initials avatars are gradient circles (aria-hidden - the name is the label).
     Quote is a <blockquote>, attribution a <figcaption>. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
  <figure class="flex flex-col justify-between rounded-2xl bg-gray-900 p-6 text-white dark:bg-gray-800 sm:col-span-2 sm:row-span-2">
    <blockquote class="text-lg font-medium leading-relaxed">"We shipped a rebuild in six weeks that we'd budgeted six months for. It is the tool we didn't know the team was missing."</blockquote>
    <figcaption class="mt-5 flex items-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 text-sm font-semibold" aria-hidden="true">AM</span>
      <span><span class="block text-sm font-semibold">Ana Mendes</span><span class="block text-xs text-gray-300">VP Engineering, Northwind</span></span>
    </figcaption>
  </figure>
  <figure class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">"Setup took an afternoon."</blockquote>
    <figcaption class="mt-4 flex items-center gap-3">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-500 text-xs font-semibold text-white" aria-hidden="true">TK</span>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Tomas K.</span>
    </figcaption>
  </figure>
  <figure class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <blockquote class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">"Support actually replies."</blockquote>
    <figcaption class="mt-4 flex items-center gap-3">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-semibold text-white" aria-hidden="true">RL</span>
      <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Rin L.</span>
    </figcaption>
  </figure>
</section>`,
      react: `function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

const DEFAULT_TESTIMONIALS = [
  { quote: "We shipped a rebuild in six weeks that we'd budgeted six months for. It is the tool we didn't know the team was missing.", name: 'Ana Mendes', role: 'VP Engineering, Northwind', gradient: 'from-indigo-400 to-blue-500', featured: true, className: 'sm:col-span-2 sm:row-span-2' },
  { quote: 'Setup took an afternoon.', name: 'Tomas K.', gradient: 'from-rose-400 to-orange-500' },
  { quote: 'Support actually replies.', name: 'Rin L.', gradient: 'from-emerald-400 to-teal-500' },
];

export function BentoTestimonialMix({ testimonials = DEFAULT_TESTIMONIALS, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {testimonials.map((t, i) =>
        t.featured ? (
          <figure key={i} className={\`flex flex-col justify-between rounded-2xl bg-gray-900 p-6 text-white dark:bg-gray-800 \${t.className ?? ''}\`}>
            <blockquote className="text-lg font-medium leading-relaxed">{'"'}{t.quote}{'"'}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className={\`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold \${t.gradient}\`} aria-hidden="true">{initials(t.name)}</span>
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                {t.role ? <span className="block text-xs text-gray-300">{t.role}</span> : null}
              </span>
            </figcaption>
          </figure>
        ) : (
          <figure key={i} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{'"'}{t.quote}{'"'}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className={\`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white \${t.gradient}\`} aria-hidden="true">{initials(t.name)}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
            </figcaption>
          </figure>
        ),
      )}
    </section>
  );
}`,
      typescript: `export interface Testimonial {
  quote: string;
  name: string;
  role?: string;
  /** Tailwind gradient stops for the initials avatar, e.g. 'from-indigo-400 to-blue-500'. */
  gradient: string;
  featured?: boolean;
  /** Span classes (sm:-prefixed). */
  className?: string;
}

export interface BentoTestimonialMixProps {
  testimonials?: Testimonial[];
  className?: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { quote: "We shipped a rebuild in six weeks that we'd budgeted six months for. It is the tool we didn't know the team was missing.", name: 'Ana Mendes', role: 'VP Engineering, Northwind', gradient: 'from-indigo-400 to-blue-500', featured: true, className: 'sm:col-span-2 sm:row-span-2' },
  { quote: 'Setup took an afternoon.', name: 'Tomas K.', gradient: 'from-rose-400 to-orange-500' },
  { quote: 'Support actually replies.', name: 'Rin L.', gradient: 'from-emerald-400 to-teal-500' },
];

export function BentoTestimonialMix({ testimonials = DEFAULT_TESTIMONIALS, className = '' }: BentoTestimonialMixProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {testimonials.map((t, i) =>
        t.featured ? (
          <figure key={i} className={\`flex flex-col justify-between rounded-2xl bg-gray-900 p-6 text-white dark:bg-gray-800 \${t.className ?? ''}\`}>
            <blockquote className="text-lg font-medium leading-relaxed">{'"'}{t.quote}{'"'}</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className={\`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold \${t.gradient}\`} aria-hidden="true">{initials(t.name)}</span>
              <span>
                <span className="block text-sm font-semibold">{t.name}</span>
                {t.role ? <span className="block text-xs text-gray-300">{t.role}</span> : null}
              </span>
            </figcaption>
          </figure>
        ) : (
          <figure key={i} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{'"'}{t.quote}{'"'}</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className={\`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white \${t.gradient}\`} aria-hidden="true">{initials(t.name)}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t.name}</span>
            </figcaption>
          </figure>
        ),
      )}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-icon-features',
    category: 'bento',
    tags: ['bento', 'icons', 'features', 'svg', 'grid'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'boxed', labelKey: 'boxed' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'features', type: 'IconFeature[]', descriptionKey: 'features' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Inline SVG icons (aria-hidden - the heading names the feature). Grid is one
     column on phones; the wide tile only spans from sm: up. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">
  <article class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
    <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg>
    </span>
    <h3 class="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">Fast by default</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Edge-rendered and cached - pages arrive before the spinner would.</p>
  </article>
  <article class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4"/></svg>
    </span>
    <h3 class="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">Secure</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">SOC 2 controls baked in.</p>
  </article>
  <article class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5m0 14h16M8 15v-4m4 4V9m4 6v-2"/></svg>
    </span>
    <h3 class="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">Insightful</h3>
    <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Metrics that mean something.</p>
  </article>
</section>`,
      react: `function Icon({ name }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, className: 'h-5 w-5', 'aria-hidden': true };
  if (name === 'shield')
    return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></svg>);
  if (name === 'chart')
    return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M8 15v-4m4 4V9m4 6v-2" /></svg>);
  return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>);
}

const DEFAULT_FEATURES = [
  { icon: 'bolt', title: 'Fast by default', description: 'Edge-rendered and cached - pages arrive before the spinner would.', className: 'sm:col-span-2' },
  { icon: 'shield', title: 'Secure', description: 'SOC 2 controls baked in.' },
  { icon: 'chart', title: 'Insightful', description: 'Metrics that mean something.' },
];

export function BentoIconFeatures({ features = DEFAULT_FEATURES, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 \${className}\`}>
      {features.map((f, i) => (
        <article key={i} className={\`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${f.className ?? ''}\`}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Icon name={f.icon} />
          </span>
          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}`,
      typescript: `type IconName = 'bolt' | 'shield' | 'chart';

export interface IconFeature {
  icon: IconName;
  title: string;
  description: string;
  /** Span classes (sm:-prefixed). */
  className?: string;
}

export interface BentoIconFeaturesProps {
  features?: IconFeature[];
  className?: string;
}

function Icon({ name }: { name: IconName }): JSX.Element {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, className: 'h-5 w-5', 'aria-hidden': true } as const;
  if (name === 'shield')
    return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></svg>);
  if (name === 'chart')
    return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M8 15v-4m4 4V9m4 6v-2" /></svg>);
  return (<svg {...common}><path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg>);
}

const DEFAULT_FEATURES: IconFeature[] = [
  { icon: 'bolt', title: 'Fast by default', description: 'Edge-rendered and cached - pages arrive before the spinner would.', className: 'sm:col-span-2' },
  { icon: 'shield', title: 'Secure', description: 'SOC 2 controls baked in.' },
  { icon: 'chart', title: 'Insightful', description: 'Metrics that mean something.' },
];

export function BentoIconFeatures({ features = DEFAULT_FEATURES, className = '' }: BentoIconFeaturesProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 \${className}\`}>
      {features.map((f, i) => (
        <article key={i} className={\`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${f.className ?? ''}\`}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Icon name={f.icon} />
          </span>
          <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{f.description}</p>
        </article>
      ))}
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-dark-glass',
    category: 'bento',
    tags: ['bento', 'dark', 'glass', 'glassmorphism', 'grid'],
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
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'tiles', type: 'GlassTile[]', descriptionKey: 'tiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- The section paints its own dark surface and glow, so it looks identical on a
     light or dark page - no dark: variants. Glass tiles are white/5 over the glow. -->
<section class="relative isolate w-full overflow-hidden rounded-3xl bg-gray-950">
  <div class="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/40 blur-3xl" aria-hidden="true"></div>
  <div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
    <article class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:col-span-2 sm:row-span-2">
      <h3 class="text-lg font-semibold text-white">Built for scale</h3>
      <p class="mt-2 text-sm leading-relaxed text-gray-300">Multi-region by default, with automatic failover you never have to think about.</p>
    </article>
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h3 class="text-sm font-semibold text-white">Zero config</h3>
      <p class="mt-1 text-sm text-gray-300">Push to deploy.</p>
    </article>
    <article class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h3 class="text-sm font-semibold text-white">Observability</h3>
      <p class="mt-1 text-sm text-gray-300">Traces out of the box.</p>
    </article>
  </div>
</section>`,
      react: `const DEFAULT_TILES = [
  { title: 'Built for scale', description: 'Multi-region by default, with automatic failover you never have to think about.', className: 'sm:col-span-2 sm:row-span-2' },
  { title: 'Zero config', description: 'Push to deploy.' },
  { title: 'Observability', description: 'Traces out of the box.' },
];

export function BentoDarkGlass({ tiles = DEFAULT_TILES, className = '' }) {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-3xl bg-gray-950 \${className}\`}>
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/40 blur-3xl" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
        {tiles.map((t, i) => (
          <article key={i} className={\`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur \${t.className ?? ''}\`}>
            <h3 className="text-sm font-semibold text-white">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">{t.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export interface GlassTile {
  title: string;
  description: string;
  /** Span classes (sm:-prefixed). */
  className?: string;
}

export interface BentoDarkGlassProps {
  tiles?: GlassTile[];
  className?: string;
}

const DEFAULT_TILES: GlassTile[] = [
  { title: 'Built for scale', description: 'Multi-region by default, with automatic failover you never have to think about.', className: 'sm:col-span-2 sm:row-span-2' },
  { title: 'Zero config', description: 'Push to deploy.' },
  { title: 'Observability', description: 'Traces out of the box.' },
];

export function BentoDarkGlass({ tiles = DEFAULT_TILES, className = '' }: BentoDarkGlassProps): JSX.Element {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-3xl bg-gray-950 \${className}\`}>
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/40 blur-3xl" aria-hidden="true" />
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
        {tiles.map((t, i) => (
          <article key={i} className={\`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur \${t.className ?? ''}\`}>
            <h3 className="text-sm font-semibold text-white">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-300">{t.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'bento-portfolio-masonry',
    category: 'bento',
    tags: ['bento', 'portfolio', 'masonry', 'links', 'grid'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'labelled', labelKey: 'labelled' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'projects', type: 'Project[]', descriptionKey: 'projects' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Whole-tile links over gradient thumbnails; the caption sits in a scrim gradient
     so its text clears AA on any thumbnail. Varying row-spans give the masonry feel
     on desktop only - one clean column at 320px. -->
<section class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6">
  <a href="#" class="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 sm:col-span-2 sm:row-span-2">
    <span class="relative text-lg font-semibold text-white">Aurora - brand system</span>
    <span class="relative text-sm text-white/80">Identity</span>
  </a>
  <a href="#" class="group relative flex min-h-40 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900">
    <span class="relative text-base font-semibold text-white"> Member app</span>
    <span class="relative text-sm text-white/80">Product</span>
  </a>
  <a href="#" class="group relative flex min-h-40 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900">
    <span class="relative text-base font-semibold text-white">Field report</span>
    <span class="relative text-sm text-white/80">Editorial</span>
  </a>
</section>`,
      react: `const DEFAULT_PROJECTS = [
  { title: 'Aurora - brand system', category: 'Identity', href: '#', gradient: 'bg-gradient-to-br from-purple-600 to-indigo-700', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-56' },
  { title: 'Member app', category: 'Product', href: '#', gradient: 'bg-gradient-to-br from-rose-500 to-orange-500', minH: 'min-h-40' },
  { title: 'Field report', category: 'Editorial', href: '#', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', minH: 'min-h-40' },
];

export function BentoPortfolioMasonry({ projects = DEFAULT_PROJECTS, className = '' }) {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {projects.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className={\`group relative flex flex-col justify-end overflow-hidden rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 \${p.minH ?? 'min-h-40'} \${p.gradient} \${p.className ?? ''}\`}
        >
          <span className="relative text-base font-semibold text-white">{p.title}</span>
          <span className="relative text-sm text-white/80">{p.category}</span>
        </a>
      ))}
    </section>
  );
}`,
      typescript: `export interface Project {
  title: string;
  category: string;
  href: string;
  /** Tailwind gradient class standing in for the thumbnail. */
  gradient: string;
  /** Span classes (sm:-prefixed) - the masonry shape. */
  className?: string;
  minH?: string;
}

export interface BentoPortfolioMasonryProps {
  projects?: Project[];
  className?: string;
}

const DEFAULT_PROJECTS: Project[] = [
  { title: 'Aurora - brand system', category: 'Identity', href: '#', gradient: 'bg-gradient-to-br from-purple-600 to-indigo-700', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-56' },
  { title: 'Member app', category: 'Product', href: '#', gradient: 'bg-gradient-to-br from-rose-500 to-orange-500', minH: 'min-h-40' },
  { title: 'Field report', category: 'Editorial', href: '#', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', minH: 'min-h-40' },
];

export function BentoPortfolioMasonry({ projects = DEFAULT_PROJECTS, className = '' }: BentoPortfolioMasonryProps): JSX.Element {
  return (
    <section className={\`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 \${className}\`}>
      {projects.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className={\`group relative flex flex-col justify-end overflow-hidden rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900 \${p.minH ?? 'min-h-40'} \${p.gradient} \${p.className ?? ''}\`}
        >
          <span className="relative text-base font-semibold text-white">{p.title}</span>
          <span className="relative text-sm text-white/80">{p.category}</span>
        </a>
      ))}
    </section>
  );
}`,
    },
  },
];
