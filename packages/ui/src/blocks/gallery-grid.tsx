/**
 * Live preview for `gallery-grid`.
 *
 * Mirrors the `typescript` code variant. The photos are inline SVG data URIs so
 * the preview never touches the network - there is no image service behind this
 * app, and a real <img src> to an external host would simply fail. Each hue is
 * derived from the tile's index rather than randomised, so the server and the
 * client paint the same colours and hydration matches.
 *
 * The grid carries no width cap of its own - it fills its container and steps
 * 2 -> 3 -> 4 columns - and the default export wraps it in a centred, full-width
 * page section, which is how the playground stacks it.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

interface GalleryGridProps {
  items: GalleryPhoto[];
  className?: string;
}

export function GalleryGrid({ items, className = '' }: GalleryGridProps) {
  return (
    <ul className={`grid w-full list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {items.map((item: GalleryPhoto) => (
        <li key={item.id}>
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            { }
            <img
              className="block aspect-[4/3] w-full object-cover"
              src={item.imageSrc}
              alt={item.imageAlt}
              loading="lazy"
            />
            <figcaption className="px-2.5 py-2 text-[0.8125rem] leading-snug text-gray-700 dark:text-gray-300">
              {item.title}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

/** A self-contained SVG swatch as a data URI - no network request, no asset. */
function swatch(index: number, width: number, height: number): string {
  const hue = (index * 47 + 205) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 60% 48%)"/>
      <stop offset="1" stop-color="hsl(${(hue + 38) % 360} 56% 30%)"/>
    </linearGradient></defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SAMPLE_PHOTOS: GalleryPhoto[] = [
  { id: 'harbour', title: 'Harbour at dawn', imageAlt: 'Fishing boats moored under an orange sky', imageSrc: swatch(0, 800, 600) },
  { id: 'ridge', title: 'Ridge trail', imageAlt: 'A footpath switching back through pine forest', imageSrc: swatch(1, 800, 600) },
  { id: 'stairwell', title: 'Stairwell study', imageAlt: 'Concrete stairwell seen from directly below', imageSrc: swatch(2, 800, 600) },
  { id: 'crossing', title: 'Night crossing', imageAlt: 'Long exposure of traffic crossing a bridge at night', imageSrc: swatch(3, 800, 600) },
  { id: 'salt', title: 'Salt flats', imageAlt: 'Salt flats meeting a pale horizon', imageSrc: swatch(4, 800, 600) },
  { id: 'market', title: 'Market row', imageAlt: 'Market awnings in bright primary colours', imageSrc: swatch(5, 800, 600) },
];

export default function GalleryGridPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <GalleryGrid items={SAMPLE_PHOTOS} className="w-full" />
      </div>
    </section>
  );
}
