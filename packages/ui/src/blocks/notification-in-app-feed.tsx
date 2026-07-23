/**
 * Live preview for `notification-in-app-feed`.
 *
 * Mirrors the `typescript` code variant. No live region: the user opened this
 * feed, so nothing in it is an interruption. Keep this in step with
 * `src/data/components/notifications.ts`.
 */
type FeedNotificationType = 'success' | 'info' | 'warning';

interface FeedNotification {
  id: string;
  type: FeedNotificationType;
  title: string;
  timestamp: string;
}

interface NotificationInAppFeedProps {
  items: FeedNotification[];
  title?: string;
  className?: string;
}

const TYPE_META: Record<FeedNotificationType, { label: string; tint: string; path: string }> = {
  success: {
    label: 'Success',
    tint: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  },
  info: {
    label: 'Update',
    tint: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    path: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z',
  },
  warning: {
    label: 'Warning',
    tint: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    path: 'M10.9 3.6a1 1 0 0 0-1.8 0l-6 11A1 1 0 0 0 4 16h12a1 1 0 0 0 .9-1.4l-6-11ZM9 8a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V8Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  },
};

export function NotificationInAppFeed({ items, title = 'Activity', className = '' }: NotificationInAppFeedProps) {
  return (
    <section
      aria-labelledby="preview-feed-heading"
      className={`w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <h2
        id="preview-feed-heading"
        className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
      >
        {title}
      </h2>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => {
          const meta = TYPE_META[item.type];
          return (
            <li key={item.id} className="flex gap-3 px-4 py-3">
              <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${meta.tint}`}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d={meta.path} />
                </svg>
                <span className="sr-only">{meta.label}. </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const SEED: FeedNotification[] = [
  { id: 'f1', type: 'success', title: 'Deploy #914 finished in 42s', timestamp: '2m ago' },
  { id: 'f2', type: 'warning', title: 'Usage is at 82% of your monthly quota', timestamp: '1h ago' },
  { id: 'f3', type: 'info', title: 'Dana accepted your invite to the Growth team', timestamp: 'Yesterday' },
];

export default function NotificationInAppFeedPreview() {
  return (
    <div className="w-full max-w-md">
      <NotificationInAppFeed items={SEED} />
    </div>
  );
}

export const minHeight = 300;
