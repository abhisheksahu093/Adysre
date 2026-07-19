/**
 * Live preview for `list-media-thumbnail`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/lists.ts`.
 */
const THUMB_GRADIENTS = [
  'from-rose-500 to-orange-500',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-green-600',
] as const;

interface MediaItem {
  id: string;
  title: string;
  glyph: string;
  description?: string;
  badge?: string;
}

interface ListMediaThumbnailProps {
  items: MediaItem[];
  ariaLabel?: string;
}

function ListMediaThumbnail({ items, ariaLabel = 'Media' }: ListMediaThumbnailProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <span
            aria-hidden="true"
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]} text-sm font-bold text-white`}
          >
            {item.glyph}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.title}
            </span>
            {item.description ? (
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </span>
            ) : null}
          </span>
          {item.badge ? (
            <span className="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline dark:bg-gray-800 dark:text-gray-300">
              {item.badge}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const MEDIA: MediaItem[] = [
  { id: '1', title: 'Launch teaser final cut', glyph: 'MP4', description: '1920x1080 · 24 MB · edited 2h ago', badge: 'Video' },
  { id: '2', title: 'Brand palette exploration', glyph: 'FIG', description: '12 frames · updated yesterday', badge: 'Design' },
  { id: '3', title: 'Q3 revenue report', glyph: 'PDF', description: '18 pages · 1.2 MB', badge: 'Doc' },
  { id: '4', title: 'Customer interviews', glyph: 'CSV', description: '3,204 rows · 480 KB', badge: 'Data' },
];

export const minHeight = 260;

export default function ListMediaThumbnailPreview() {
  return (
    <div className="w-full max-w-md">
      <ListMediaThumbnail items={MEDIA} ariaLabel="Media library" />
    </div>
  );
}
