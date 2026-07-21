/**
 * Live preview for `gallery-instagram-grid`.
 *
 * Mirrors the `typescript` code variant. The like/comment overlay reveals on
 * hover and focus-visible and is mirrored in an sr-only label. grid-cols-3 holds
 * at 320px. Media are CSS gradient tiles - no network.
 *
 * The grid fills its container and deliberately stays at three columns at every
 * width - that square three-up rhythm is the whole look. The default export
 * wraps it in a centred, full-width page section.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface SocialTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  likes: number;
  comments: number;
}

interface GalleryInstagramGridProps {
  items: SocialTile[];
  className?: string;
}

function GalleryInstagramGrid({ items, className = '' }: GalleryInstagramGridProps) {
  return (
    <ul className={`grid w-full list-none grid-cols-3 gap-1 p-0 sm:gap-2 ${className}`}>
      {items.map((item: SocialTile) => (
        <li key={item.id}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span role="img" aria-label={item.label} className={`block aspect-square w-full bg-gradient-to-br ${item.gradient}`} />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center gap-4 bg-black/45 text-sm font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
            >
              <span>&#9829; {item.likes}</span>
              <span>&#128172; {item.comments}</span>
            </span>
            <span className="sr-only">{`${item.title}: ${item.likes} likes, ${item.comments} comments`}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const SAMPLE_TILES: SocialTile[] = [
  { id: 'coast', title: 'Coastline', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600', likes: 128, comments: 12 },
  { id: 'canyon', title: 'Canyon', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500', likes: 96, comments: 5 },
  { id: 'forest', title: 'Forest', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600', likes: 204, comments: 31 },
  { id: 'dusk', title: 'Dusk', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600', likes: 77, comments: 8 },
  { id: 'desert', title: 'Desert', label: 'Amber to red gradient', gradient: 'from-amber-400 to-red-500', likes: 143, comments: 19 },
  { id: 'harbour', title: 'Harbour', label: 'Cyan to blue gradient', gradient: 'from-cyan-400 to-blue-600', likes: 61, comments: 3 },
];

export default function GalleryInstagramGridPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <GalleryInstagramGrid items={SAMPLE_TILES} className="w-full" />
      </div>
    </section>
  );
}
