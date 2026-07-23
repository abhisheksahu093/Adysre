/**
 * Live preview for `list-divided-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface ListItem {
  id: string;
  primary: string;
  secondary?: string;
}

interface ListDividedBasicProps {
  items: ListItem[];
  ariaLabel?: string;
}

export function ListDividedBasic({ items, ariaLabel = 'List' }: ListDividedBasicProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
            {item.primary}
          </span>
          {item.secondary ? (
            <span className="hidden shrink-0 text-xs text-gray-500 sm:inline dark:text-gray-400">
              {item.secondary}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

const ITEMS: ListItem[] = [
  { id: '1', primary: 'Amara Okafor', secondary: 'Owner' },
  { id: '2', primary: 'Bhavesh Ramachandran', secondary: 'Admin' },
  { id: '3', primary: 'Chen Wei', secondary: 'Member' },
  { id: '4', primary: 'Dara Nakamura', secondary: 'Member' },
];

export const minHeight = 240;

export default function ListDividedBasicPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListDividedBasic items={ITEMS} ariaLabel="Team members" />
    </div>
  );
}
