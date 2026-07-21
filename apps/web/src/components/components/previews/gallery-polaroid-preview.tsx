/**
 * Live preview for `gallery-polaroid`.
 *
 * Mirrors the `typescript` code variant. Alternating tilt gives the scattered
 * look; each card is a button so it straightens on focus-visible as well as
 * hover, with motion-reduce dropping the tilt. Media are CSS gradient tiles.
 *
 * The grid fills its container; the default export wraps it in a centred,
 * full-width page section.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
}

interface GalleryPolaroidProps {
  items: GalleryTile[];
  className?: string;
}

function GalleryPolaroid({ items, className = '' }: GalleryPolaroidProps) {
  return (
    <ul className={`grid w-full list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {items.map((item: GalleryTile, i: number) => (
        <li key={item.id}>
          <button
            type="button"
            className={`group block w-full rounded-sm bg-white p-2 pb-1 shadow-md transition-transform hover:rotate-0 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none motion-reduce:rotate-0 ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}`}
          >
            <span role="img" aria-label={item.label} className={`block aspect-square w-full bg-gradient-to-br ${item.gradient}`} />
            <span className="mt-2 block text-center text-sm font-medium text-gray-800">{item.title}</span>
          </button>
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
];

export default function GalleryPolaroidPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <GalleryPolaroid items={SAMPLE_TILES} className="w-full" />
      </div>
    </section>
  );
}
