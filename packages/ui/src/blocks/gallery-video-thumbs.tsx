/**
 * Live preview for `gallery-video-thumbs`.
 *
 * Mirrors the `typescript` code variant. The play glyph is a pure-CSS triangle
 * (a bordered zero-size box) - no asset, no real <video>. It scales on hover
 * and focus-visible; motion-reduce holds it still. Media are CSS gradient tiles.
 *
 * The grid fills its container; the default export wraps it in a centred,
 * full-width page section.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface VideoTile {
  id: string;
  title: string;
  label: string;
  gradient: string;
  duration: string;
}

interface GalleryVideoThumbsProps {
  items: VideoTile[];
  className?: string;
}

export function GalleryVideoThumbs({ items, className = '' }: GalleryVideoThumbsProps) {
  return (
    <ul className={`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {items.map((item: VideoTile) => (
        <li key={item.id}>
          <button
            type="button"
            className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <span role="img" aria-label={item.label} className={`block aspect-video w-full bg-gradient-to-br ${item.gradient}`} />
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 ring-1 ring-white/40 transition-transform group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none">
                <span className="ml-0.5 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white" />
              </span>
            </span>
            <span aria-hidden="true" className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
              {item.duration}
            </span>
            <span className="sr-only">{`Play ${item.title}`}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const SAMPLE_TILES: VideoTile[] = [
  { id: 'reef', title: 'Reef dive', label: 'Sky-blue to indigo gradient', gradient: 'from-sky-400 to-indigo-600', duration: '4:12' },
  { id: 'canyon', title: 'Canyon flyover', label: 'Rose to orange gradient', gradient: 'from-rose-400 to-orange-500', duration: '2:47' },
  { id: 'forest', title: 'Forest walk', label: 'Emerald to teal gradient', gradient: 'from-emerald-400 to-teal-600', duration: '6:03' },
  { id: 'city', title: 'City nights', label: 'Violet to fuchsia gradient', gradient: 'from-violet-400 to-fuchsia-600', duration: '1:58' },
];

export default function GalleryVideoThumbsPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <GalleryVideoThumbs items={SAMPLE_TILES} className="w-full" />
      </div>
    </section>
  );
}
