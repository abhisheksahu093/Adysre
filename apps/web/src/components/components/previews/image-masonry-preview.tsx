/**
 * Live preview for `image-masonry`.
 * Keep in step with `src/data/components/images.ts`.
 */
const ITEMS = [
  { gradient: 'from-blue-400 to-indigo-500', h: 'h-40' },
  { gradient: 'from-rose-400 to-orange-300', h: 'h-28' },
  { gradient: 'from-emerald-400 to-teal-500', h: 'h-32' },
  { gradient: 'from-violet-500 to-fuchsia-500', h: 'h-44' },
  { gradient: 'from-cyan-400 to-blue-500', h: 'h-24' },
  { gradient: 'from-amber-300 to-orange-400', h: 'h-36' },
];

function ImageMasonry() {
  return (
    <div className="w-full max-w-2xl columns-2 gap-3 sm:columns-3">
      {ITEMS.map((item, i) => (
        <figure key={i} className={`mb-3 break-inside-avoid overflow-hidden rounded-lg bg-gradient-to-br ${item.gradient} ${item.h}`} aria-hidden="true" />
      ))}
    </div>
  );
}

export const minHeight = 320;

export default function ImageMasonryPreview() {
  return <ImageMasonry />;
}
