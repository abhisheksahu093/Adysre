'use client';

/**
 * Live preview for `notification-list-panel`.
 *
 * Mirrors the `typescript` code variant. The panel is a plain in-flow block -
 * in a real app it hangs off a bell in a popover, but the popover isn't this
 * component and wrapping the preview in one would only obscure what is.
 *
 * Note what isn't here: a live region. The user opened this panel; announcing a
 * list they asked to read would be noise. That's the deliberate difference from
 * every toast in this category.
 *
 * Keep this in step with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface PanelNotification {
  id: string;
  title: string;
  timestamp: string;
  read?: boolean;
}

const SEED: PanelNotification[] = [
  { id: 'n1', title: 'Deploy #914 finished in 42s', timestamp: '2m ago' },
  { id: 'n2', title: 'Dana accepted your invite', timestamp: '1h ago' },
  { id: 'n3', title: 'Weekly usage report is ready', timestamp: 'Yesterday', read: true },
];

export function NotificationListPanel() {
  const [items, setItems] = useState<PanelNotification[]>(SEED);

  const unread: number = items.filter((item) => item.read !== true).length;

  const select = (id: string): void => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  const dismiss = (id: string): void => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full max-w-sm">
      <section
        aria-labelledby="preview-panel-heading"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] dark:border-gray-800 dark:bg-gray-900"
      >
        <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h2
            id="preview-panel-heading"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            Notifications
            {unread > 0 ? (
              <span className="ml-1 font-normal text-gray-600 dark:text-gray-400">({unread})</span>
            ) : null}
          </h2>
        </header>

        <ul className="max-h-72 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2.5 border-b border-gray-100 px-2 last:border-0 dark:border-gray-800"
            >
              {/* Rendered even when read, just transparent - so marking a row
                  read never shifts its text sideways. */}
              <span
                className={`mt-4 h-1.5 w-1.5 flex-none rounded-full ${item.read === true ? 'bg-transparent' : 'bg-blue-700 dark:bg-blue-300'}`}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => select(item.id)}
                className="grid flex-1 gap-0.5 rounded-md px-2 py-2.5 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                {/* The dot is colour-only; this is what makes it not. */}
                {item.read !== true ? <span className="sr-only">Unread. </span> : null}
                <span
                  className={`text-sm text-gray-900 dark:text-gray-100 ${item.read === true ? '' : 'font-semibold'}`}
                >
                  {item.title}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</span>
              </button>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label={`Dismiss: ${item.title}`}
                className="mt-2.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {items.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            You&rsquo;re all caught up.
          </p>
        ) : null}
      </section>

      <button
        type="button"
        onClick={() => setItems(SEED)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}


export default NotificationListPanel;
