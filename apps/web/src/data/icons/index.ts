/**
 * The icon library's data model.
 *
 * Icons are static, unlocalised assets (like gradients/palettes): the geometry
 * and search tags are baked into `RAW_ICONS` in `./generated`, and only the
 * surrounding chrome (titles, buttons, category labels) is translated via
 * next-intl. Every icon is an original 24x24 line drawing - see
 * `documents`/CLAUDE.md; nothing here is derived from a third-party icon set.
 */

import { humanize } from '@/lib/icons/svg';
import { RAW_ICONS } from './generated';

/** The thematic groups icons are filed under. Labels come from i18n. */
export const ICON_CATEGORY_IDS = [
  'interface',
  'arrows',
  'communication',
  'media',
  'files',
  'commerce',
  'devices',
  'weather',
  'social',
  'editing',
  'maps',
  'status',
] as const;

export type IconCategoryId = (typeof ICON_CATEGORY_IDS)[number];

/** An icon exactly as authored. */
export interface RawIcon {
  name: string;
  category: IconCategoryId;
  tags: string[];
  /** SVG child elements, injected into a 24x24 `<svg>` wrapper. */
  body: string;
}

/** An icon enriched with its display title. */
export interface Icon extends RawIcon {
  /** Human-readable label, e.g. `Arrow Up Right`. */
  title: string;
}

/** The full, de-duplicated icon set, sorted by category order then name. */
export const ICONS: Icon[] = (() => {
  const seen = new Set<string>();
  const order = new Map(ICON_CATEGORY_IDS.map((id, i) => [id, i]));
  return RAW_ICONS.filter((raw) => {
    if (seen.has(raw.name)) return false;
    seen.add(raw.name);
    return true;
  })
    .map((raw) => ({ ...raw, title: humanize(raw.name) }))
    .sort((a, b) => {
      const ca = order.get(a.category) ?? 0;
      const cb = order.get(b.category) ?? 0;
      return ca !== cb ? ca - cb : a.name.localeCompare(b.name);
    });
})();

/** Categories that actually have icons, in canonical order, with counts. */
export const ICON_CATEGORIES: { id: IconCategoryId; count: number }[] = ICON_CATEGORY_IDS.map(
  (id) => ({ id, count: ICONS.filter((i) => i.category === id).length }),
).filter((c) => c.count > 0);

export const ICON_COUNT = ICONS.length;

const BY_NAME = new Map(ICONS.map((i) => [i.name, i]));

export function getIcon(name: string): Icon | undefined {
  return BY_NAME.get(name);
}

/**
 * Other icons worth showing next to `icon`: same category first, then a stable
 * fill from the rest, excluding the icon itself.
 */
export function similarIcons(icon: Icon, limit = 12): Icon[] {
  const sameCategory = ICONS.filter((i) => i.category === icon.category && i.name !== icon.name);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = ICONS.filter((i) => i.category !== icon.category);
  return [...sameCategory, ...others].slice(0, limit);
}
