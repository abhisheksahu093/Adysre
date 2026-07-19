/**
 * Live preview for `bento-image-collage`.
 * Mirrors the `typescript` code variant. Keep in step with
 * `src/data/components/bento.ts`.
 */
interface CollageItem {
  caption: string;
  gradient: string;
  className?: string;
  minH?: string;
}

const ITEMS: CollageItem[] = [
  { caption: 'Sunrise, Dolomites', gradient: 'bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200', className: 'sm:col-span-2 sm:row-span-2', minH: 'min-h-48' },
  { caption: 'Coastline', gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500', minH: 'min-h-28' },
  { caption: 'Night market', gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-500', minH: 'min-h-28' },
  { caption: 'Rice terraces', gradient: 'bg-gradient-to-r from-emerald-400 to-teal-500', className: 'sm:col-span-2', minH: 'min-h-28' },
];

function BentoImageCollage({ items = ITEMS, className = '' }: { items?: CollageItem[]; className?: string }) {
  return (
    <section className={`mx-auto grid w-full max-w-5xl grid-cols-1 gap-3 p-4 sm:grid-cols-4 sm:p-6 ${className}`}>
      {items.map((it, i) => (
        <figure key={i} className={`overflow-hidden rounded-2xl ${it.className ?? ''}`}>
          <div className={`w-full ${it.minH ?? 'min-h-28'} ${it.gradient}`} aria-hidden="true" />
          <figcaption className="p-3 text-sm text-gray-600 dark:text-gray-400">{it.caption}</figcaption>
        </figure>
      ))}
    </section>
  );
}

export const minHeight = 760;

export default function BentoImageCollagePreview() {
  return <BentoImageCollage />;
}
