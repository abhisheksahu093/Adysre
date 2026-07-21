/**
 * Live preview for `gallery-horizontal-scroll`.
 *
 * Mirrors the `typescript` code variant verbatim. Media are CSS gradient tiles
 * (role="img" + aria-label), so the preview never touches the network. Six
 * tiles are supplied so the row actually overflows and scrolls sideways - the
 * whole reason this component exists.
 *
 * The row fills its container; the default export wraps it in a centred,
 * full-width page section, so the sideways scroll is the only overflow here.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

interface GalleryHorizontalScrollProps {
  items: GalleryTile[];
  className?: string;
}

function GalleryHorizontalScroll({ items, className = '' }: GalleryHorizontalScrollProps) {
  return (
    <ul className={`flex w-full snap-x snap-mandatory list-none gap-3 overflow-x-auto p-0 pb-2 ${className}`}>
      {items.map((item: GalleryTile) => (
        <li key={item.id} className="w-40 shrink-0 snap-start sm:w-56">
          <figure className="m-0">
            <div
              role="img"
              aria-label={item.label}
              className={`aspect-[4/3] w-full rounded-xl bg-gradient-to-br ${item.gradient}`}
            />
            <figcaption className="pt-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

const SAMPLE_TILES: GalleryTile[] = [
  { id: 'coast', title: 'Coastline', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600' },
  { id: 'canyon', title: 'Canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500' },
  { id: 'forest', title: 'Forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'dusk', title: 'Dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600' },
  { id: 'desert', title: 'Desert', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500' },
  { id: 'harbour', title: 'Harbour', label: 'Cyan to blue gradient', gradient: 'from-cyan-400 to-blue-600' },
];

export default function GalleryHorizontalScrollPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <GalleryHorizontalScroll items={SAMPLE_TILES} className="w-full" />
      </div>
    </section>
  );
}
