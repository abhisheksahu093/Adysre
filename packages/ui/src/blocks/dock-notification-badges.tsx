/**
 * Live preview for `dock-notification-badges`.
 *
 * Mirrors the `typescript` code variant with one preview-only change: the dock
 * is `absolute` inside this bounded card rather than `fixed` to the viewport.
 * The shipped component uses `fixed bottom-6 left-1/2 -translate-x-1/2`.
 *
 * No 'use client': the badges are static markup. Each badge is `aria-hidden`
 * decoration - the count (or "new activity" for a bare dot) is repeated in a
 * clipped span so it is announced, not merely seen. Above 99 the pill collapses
 * to "99+". Keep this in step with `src/data/components/docks.ts`.
 */
interface BadgeDockItem {
  id: string;
  label: string;
  path: string;
  count?: number;
  dot?: boolean;
  current?: boolean;
}

const ITEMS: readonly BadgeDockItem[] = [
  { id: 'home', label: 'Home', current: true, path: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5' },
  { id: 'inbox', label: 'Inbox', count: 8, path: 'M4 13h4l1.5 3h5L16 13h4M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5Z' },
  { id: 'chat', label: 'Chat', count: 128, path: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4Z' },
  { id: 'activity', label: 'Activity', dot: true, path: 'M3 12h4l2 6 4-14 2 8h6' },
  { id: 'profile', label: 'Profile', path: 'M12 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM5 20a7 7 0 0 1 14 0' },
];

export function DockNotificationBadges() {
  return (
    <div className="relative flex min-h-56 w-full items-end justify-center overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-rose-100 to-purple-200 p-4 dark:border-gray-800 dark:from-slate-800 dark:to-purple-950">
      <p className="absolute left-4 top-4 text-sm text-gray-700 dark:text-gray-300">Counts and a status dot.</p>

      <nav
        aria-label="Dock"
        className="absolute bottom-4 left-1/2 inline-block -translate-x-1/2 rounded-2xl border border-black/10 bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md dark:border-white/10 dark:bg-gray-900/85"
      >
        <ul className="flex items-center gap-1">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                aria-current={item.current ? 'page' : undefined}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 aria-[current=page]:text-blue-700 dark:text-gray-200 dark:hover:bg-white/10 dark:focus-visible:ring-blue-400 dark:aria-[current=page]:text-blue-300"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  <path d={item.path} />
                </svg>
                {typeof item.count === 'number' ? (
                  <span aria-hidden="true" className="absolute right-1 top-1 min-w-4 rounded-full bg-red-600 px-1 text-center text-[0.625rem] font-bold leading-4 text-white ring-2 ring-white dark:ring-gray-900">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                ) : null}
                {item.dot ? (
                  <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
                ) : null}
                <span className="sr-only">
                  {item.label}
                  {typeof item.count === 'number' ? ', ' + item.count + ' unread' : item.dot ? ', new activity' : ''}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}


export default DockNotificationBadges;
