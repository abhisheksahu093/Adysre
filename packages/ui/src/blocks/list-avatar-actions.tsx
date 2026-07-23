/**
 * Live preview for `list-avatar-actions`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/lists.ts`.
 */
const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-fuchsia-500 to-purple-600',
  'from-amber-500 to-orange-600',
] as const;

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface ContactItem {
  id: string;
  name: string;
  email?: string;
}

interface ListAvatarActionsProps {
  items: ContactItem[];
  actionLabel?: string;
  ariaLabel?: string;
}

export function ListAvatarActions({
  items,
  actionLabel = 'Options',
  ariaLabel = 'Contacts',
}: ListAvatarActionsProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} text-xs font-semibold text-white`}
          >
            {initials(item.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.name}
            </span>
            {item.email ? (
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                {item.email}
              </span>
            ) : null}
          </span>
          <button
            type="button"
            aria-label={`${actionLabel} for ${item.name}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path d="M10 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm0 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM11.5 15.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}

const CONTACTS: ContactItem[] = [
  { id: '1', name: 'Amara Okafor', email: 'amara@adysre.com' },
  { id: '2', name: 'Bhavesh Ramachandran', email: 'bhavesh@adysre.com' },
  { id: '3', name: 'Chen Wei', email: 'chen@adysre.com' },
  { id: '4', name: 'Dara Nakamura', email: 'dara@adysre.com' },
];

export const minHeight = 260;

export default function ListAvatarActionsPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListAvatarActions items={CONTACTS} ariaLabel="Contacts" />
    </div>
  );
}
