import { Shapes, Wand2, Blend, Palette, Blocks, type LucideIcon } from 'lucide-react';

/**
 * Product announcements shown in the topbar bell.
 *
 * Static, ordered newest-first. Copy is translated under the `notifications`
 * namespace (`notifications.items.<key>.{title,body}`), so adding an
 * announcement means one entry here plus its keys in every catalogue. Read and
 * dismissed state lives in the notifications store, keyed by `id`.
 */
export interface NotificationItem {
  /** Stable id - the store keys read/dismissed state on it, so never reuse. */
  id: string;
  /** Key under `notifications.items`, e.g. 'icons' → items.icons.title. */
  key: string;
  icon: LucideIcon;
  /** Where the announcement points; opened on click. */
  href: string;
  /** ISO date the feature shipped; rendered as relative time. */
  date: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'feature-icons', key: 'icons', icon: Shapes, href: '/icons', date: '2026-07-18' },
  { id: 'feature-playground', key: 'playground', icon: Wand2, href: '/components', date: '2026-07-09' },
  { id: 'feature-gradients', key: 'gradients', icon: Blend, href: '/gradients', date: '2026-06-27' },
  { id: 'feature-palettes', key: 'palettes', icon: Palette, href: '/palettes', date: '2026-06-14' },
  { id: 'feature-components', key: 'components', icon: Blocks, href: '/components', date: '2026-05-30' },
];
