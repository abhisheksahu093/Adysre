/**
 * Live preview for `comparison-side-by-side-cards`.
 *
 * Mirrors the `typescript` code variant. Two product cards that stack below
 * 40rem; the avatar is a gradient tile with initials, so there is no external
 * image to load. Keep this in step with `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface SideCard {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

interface ComparisonSideBySideCardsProps {
  products: SideCard[];
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function ComparisonSideBySideCards({ products, className = '' }: ComparisonSideBySideCardsProps) {
  return (
    <div className={`grid w-full gap-4 sm:grid-cols-2 ${className}`}>
      {products.map((product) => (
        <section
          key={product.id}
          aria-label={product.name}
          className={`flex flex-col rounded-xl border bg-white p-5 dark:bg-gray-900 ${
            product.featured ? 'border-blue-600 dark:border-blue-400' : 'border-gray-200 dark:border-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white"
            >
              {initials(product.name)}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{product.name}</h3>
              {product.subtitle ? (
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{product.subtitle}</p>
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{product.price}</p>

          <ul className="mt-3 grid gap-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="grid grid-cols-[1rem_1fr] items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <span aria-hidden="true" className="font-bold text-emerald-700 dark:text-emerald-400">
                  ✓
                </span>
                <span>
                  <span className="sr-only">Included: </span>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={product.ctaHref}
            className={`mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${
              product.featured
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {product.ctaLabel}
          </a>
        </section>
      ))}
    </div>
  );
}

const SAMPLE_PRODUCTS: SideCard[] = [
  {
    id: 'cloud',
    name: 'ADYSRE Cloud',
    subtitle: 'Fully managed',
    price: '$29/mo',
    features: ['Zero maintenance', 'Automatic backups', '99.99% uptime SLA'],
    ctaLabel: 'Start free',
    ctaHref: '#',
  },
  {
    id: 'self',
    name: 'Self Hosted',
    subtitle: 'Your infrastructure',
    price: '$0/mo',
    featured: true,
    features: ['Data in your VPC', 'No per-seat billing', 'Full source access'],
    ctaLabel: 'View the docs',
    ctaHref: '#',
  },
];

export default function ComparisonSideBySideCardsPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonSideBySideCards products={SAMPLE_PRODUCTS} />
      </div>
    </section>
  );
}

export const minHeight = 420;
