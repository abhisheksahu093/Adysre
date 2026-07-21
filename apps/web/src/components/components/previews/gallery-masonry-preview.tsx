/**
 * Live preview for `gallery-masonry`.
 *
 * Mirrors the `typescript` code variant. The photos are inline SVG data URIs so
 * the preview never touches the network; both the hue and the height come from
 * the tile's index, never Math.random(), so the server and the client agree and
 * hydration matches. The varying heights are the whole point - they are what
 * the columns balance against.
 *
 * The column list carries no width cap of its own and steps 2 -> 3 -> 4 columns;
 * the default export wraps it in a centred, full-width page section.
 * Keep this in step with `src/data/components/galleries.ts`.
 */
interface GalleryPhoto {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  width?: number;
  height?: number;
}

interface GalleryMasonryProps {
  items: GalleryPhoto[];
  className?: string;
}

function GalleryMasonry({ items, className = '' }: GalleryMasonryProps) {
  return (
    <ul className={`w-full list-none columns-2 gap-3 p-0 sm:columns-3 lg:columns-4 ${className}`}>
      {items.map((item: GalleryPhoto) => (
        // break-inside-avoid: without it a tile splits across the column edge.
        <li key={item.id} className="mb-3 break-inside-avoid">
          <figure className="m-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            { }
            <img
              className="block h-auto w-full"
              src={item.imageSrc}
              alt={item.imageAlt}
              width={item.width}
              height={item.height}
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

/** Heights are fixed per index, not random - a masonry needs varied heights,
 *  and hydration needs the same ones on both sides of the render. */
function photo(index: number, id: string, title: string, imageAlt: string, height: number): GalleryPhoto {
  return { id, title, imageAlt, imageSrc: swatch(index, 800, height), width: 800, height };
}

const SAMPLE_PHOTOS: GalleryPhoto[] = [
  photo(0, 'harbour', 'Harbour at dawn', 'Fishing boats moored under an orange sky', 600),
  photo(1, 'ridge', 'Ridge trail', 'A footpath switching back through pine forest', 1100),
  photo(2, 'stairwell', 'Stairwell study', 'Concrete stairwell seen from directly below', 800),
  photo(3, 'crossing', 'Night crossing', 'Long exposure of traffic crossing a bridge at night', 500),
  photo(4, 'salt', 'Salt flats', 'Salt flats meeting a pale horizon', 1000),
  photo(5, 'market', 'Market row', 'Market awnings in bright primary colours', 700),
];

export default function GalleryMasonryPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <GalleryMasonry items={SAMPLE_PHOTOS} className="w-full" />
      </div>
    </section>
  );
}
