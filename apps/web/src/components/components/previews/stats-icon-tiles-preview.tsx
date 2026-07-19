/**
 * Live preview for `stats-icon-tiles`. Mirrors the `typescript` variant verbatim.
 * Keep in step with `src/data/components/stats.ts`.
 */
type IconTileGlyph = 'pulse' | 'users' | 'cart' | 'star';

interface IconTileItem {
  label: string;
  value: string;
  icon: IconTileGlyph;
  tone: string;
}

interface StatsIconTilesProps {
  items?: IconTileItem[];
  className?: string;
}

const ICONS: Record<IconTileGlyph, string> = {
  pulse: 'M3 12h4l3 8 4-16 3 8h4',
  users: 'M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M21 20v-2a4 4 0 0 0-3-3.87',
  cart: 'M3 3h2l2 12h11l2-8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2M18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2',
  star: 'M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9z',
};

const DEFAULT_ITEMS: IconTileItem[] = [
  { label: 'Total visits', value: '128,940', icon: 'pulse', tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
  { label: 'Members', value: '8,412', icon: 'users', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { label: 'Orders', value: '2,180', icon: 'cart', tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
  { label: 'Reviews', value: '4.9/5', icon: 'star', tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
];

function StatsIconTiles({ items = DEFAULT_ITEMS, className = '' }: StatsIconTilesProps) {
  return (
    <dl className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${item.tone}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d={ICONS[item.icon]} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="min-w-0">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</dt>
            <dd className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{item.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export const minHeight = 220;

export default function StatsIconTilesPreview() {
  return <StatsIconTiles />;
}
