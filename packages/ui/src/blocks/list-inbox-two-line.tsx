/**
 * Live preview for `list-inbox-two-line`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface InboxItem {
  id: string;
  sender: string;
  subject: string;
  time: string;
  preview?: string;
  href?: string;
  unread?: boolean;
}

interface ListInboxTwoLineProps {
  items: InboxItem[];
  ariaLabel?: string;
}

export function ListInboxTwoLine({ items, ariaLabel = 'Inbox' }: ListInboxTwoLineProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="w-full divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
    >
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href ?? '#'}
            className="flex gap-3 px-4 py-3 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <span
              aria-label={item.unread ? 'Unread' : undefined}
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.unread ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}`}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span
                  className={`min-w-0 truncate text-sm text-gray-900 dark:text-gray-100 ${item.unread ? 'font-semibold' : 'font-medium'}`}
                >
                  {item.sender}
                </span>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{item.time}</span>
              </span>
              <span className="mt-0.5 block truncate text-sm text-gray-700 dark:text-gray-300">
                {item.subject}
              </span>
              {item.preview ? (
                <span className="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">
                  {item.preview}
                </span>
              ) : null}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const MESSAGES: InboxItem[] = [
  {
    id: '1',
    sender: 'Stripe',
    subject: 'Your payout is on the way',
    time: '9:41 AM',
    preview: '$4,208.00 will arrive in your account within 2 business days.',
    unread: true,
  },
  {
    id: '2',
    sender: 'Linear',
    subject: 'ADY-482 was assigned to you',
    time: '8:12 AM',
    preview: 'Fix the sticky header z-index on the grouped list.',
    unread: true,
  },
  {
    id: '3',
    sender: 'Dara Nakamura',
    subject: 'Re: Q3 planning notes',
    time: 'Yesterday',
    preview: 'Looks good - I left a couple of comments on the roadmap doc.',
  },
];

export const minHeight = 260;

export default function ListInboxTwoLinePreview() {
  return (
    <div className="w-full max-w-sm">
      <ListInboxTwoLine items={MESSAGES} ariaLabel="Inbox" />
    </div>
  );
}
