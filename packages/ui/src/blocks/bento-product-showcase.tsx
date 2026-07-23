/**
 * Live preview for `bento-product-showcase`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface Product {
  name: string;
  tagline?: string;
  href: string;
  gradient: string;
  className?: string;
  media?: string;
}

const PRODUCTS: Product[] = [
  { name: 'Studio', tagline: 'The full design surface - canvas, components and handoff in one file.', href: '#', gradient: 'bg-gradient-to-br from-indigo-500 to-blue-600', className: 'sm:col-span-2 sm:row-span-2', media: 'min-h-40' },
  { name: 'Boards', href: '#', gradient: 'bg-gradient-to-br from-rose-500 to-orange-500', media: 'min-h-24' },
  { name: 'Docs', href: '#', gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', media: 'min-h-24' },
  { name: 'Automations', tagline: 'Wire your stack together without code.', href: '#', gradient: 'bg-gradient-to-r from-violet-500 to-fuchsia-500', className: 'sm:col-span-3', media: 'min-h-20' },
];

export function BentoProductShowcase({ products = PRODUCTS, className = '' }: { products?: Product[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-6 ${className}`}>
      {products.map((p, i) => (
        <a
          key={i}
          href={p.href}
          className={`group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900 ${p.className ?? ''}`}
        >
          <div className={`flex-1 ${p.media ?? 'min-h-24'} ${p.gradient}`} aria-hidden="true" />
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.name}</h3>
            {p.tagline ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.tagline}</p> : null}
          </div>
        </a>
      ))}
    </section>
  );
}

export const minHeight = 740;

export default function BentoProductShowcasePreview() {
  return <BentoProductShowcase />;
}
