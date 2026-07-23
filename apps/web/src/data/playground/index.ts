/**
 * Playground - assemble a full page out of library sections.
 *
 * This registry defines only the page's SLOTS (header → footer, in render
 * order) and which library category fills each one. The variations offered for
 * a slot are never listed here - they are derived at runtime from
 * `@/data/components`, so publishing a new hero to the library makes it appear
 * in the playground with no change to this file.
 */

import type { ComponentCategory, LocalizedComponent } from '@/data/components';
import { hasPreview } from '@/components/components/previews/registry';
import type { SectionStyle } from '@/lib/playground/section-style';

/**
 * The page's sections, in render order.
 *
 * Every slot must name a category that actually has previewable components, or
 * it resolves to `null` for everyone and reads as a broken option. Order here IS
 * the order on the page, so a new slot goes where it belongs in a real layout,
 * not on the end.
 */
export const PLAYGROUND_SLOTS = [
  { id: 'header', category: 'navbar', required: true },
  { id: 'hero', category: 'hero', required: true },
  { id: 'logos', category: 'marquees', required: false },
  { id: 'services', category: 'services', required: false },
  { id: 'features', category: 'bento', required: false },
  { id: 'about', category: 'about', required: false },
  { id: 'stats', category: 'stats', required: false },
  { id: 'team', category: 'team', required: false },
  { id: 'gallery', category: 'galleries', required: false },
  { id: 'testimonials', category: 'testimonials', required: false },
  { id: 'pricing', category: 'pricing', required: false },
  { id: 'comparison', category: 'comparisons', required: false },
  { id: 'faq', category: 'faq', required: false },
  { id: 'blog', category: 'blog', required: false },
  { id: 'contact', category: 'contact', required: false },
  { id: 'cta', category: 'marketing', required: false },
  { id: 'footer', category: 'footer', required: true },
] as const satisfies readonly { id: string; category: ComponentCategory; required: boolean }[];

export type PlaygroundSlotId = (typeof PLAYGROUND_SLOTS)[number]['id'];
export type PlaygroundSlot = (typeof PLAYGROUND_SLOTS)[number];

/**
 * The slots that belong to the SITE rather than to one page.
 *
 * A multipage site shares its chrome: changing the navbar on About must change
 * it on Home, or every page drifts into its own little website. These two are
 * therefore stored once, outside any page, and rendered around every page's
 * body. Everything else is per page.
 */
export const SITE_SLOT_IDS = ['header', 'footer'] as const;

export function isSiteSlot(id: PlaygroundSlotId): boolean {
  return (SITE_SLOT_IDS as readonly string[]).includes(id);
}

/** Page-scoped slots, in the order a fresh page starts with. */
export const DEFAULT_PAGE_ORDER: PlaygroundSlotId[] = PLAYGROUND_SLOTS.filter(
  (slot) => !isSiteSlot(slot.id),
).map((slot) => slot.id);

/** One page of the site: its own body sections, in its own order. */
export interface PlaygroundPage {
  id: string;
  name: string;
  /** Page-scoped slot ids in render order - the user's arrangement. */
  order: PlaygroundSlotId[];
  selections: PlaygroundSelections;
  sectionStyles: Partial<Record<PlaygroundSlotId, SectionStyle>>;
}

/**
 * A stored order, reconciled with the slots that exist today.
 *
 * Order is persisted, so it ages exactly like selections do: a release that adds
 * a slot would otherwise leave it permanently unreachable on existing sites, and
 * one that removes a slot would leave a dangling id. Unknown ids are dropped and
 * missing ones appended in their default position.
 *
 * Duplicates are collapsed to their first occurrence. A stored order should
 * never contain one, but the result keys a React list and indexes a drag - a
 * repeated id would render the same section twice and make "move item 3"
 * ambiguous, so it is not left to chance.
 */
export function normalizePageOrder(order: readonly string[]): PlaygroundSlotId[] {
  const known = new Set<string>(DEFAULT_PAGE_ORDER);
  const seen = new Set<string>();
  const kept = order.filter((id): id is PlaygroundSlotId => {
    if (!known.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return [...kept, ...DEFAULT_PAGE_ORDER.filter((id) => !seen.has(id))];
}

/**
 * `list` with the item at `from` moved to `to`.
 *
 * Pure and index-based rather than id-based: both the drag handler and the
 * keyboard reorder speak in positions, and a shared implementation is what keeps
 * "drop below the third section" and "press ArrowDown twice" landing in the same
 * place.
 */
export function reorder<T>(list: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= list.length) return [...list];
  const next = [...list];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return [...list];
  next.splice(Math.max(0, Math.min(next.length, to)), 0, moved);
  return next;
}

/** A page, ready to use. `order` is normalised so callers never have to. */
export function createPlaygroundPage(id: string, name: string): PlaygroundPage {
  return { id, name, order: [...DEFAULT_PAGE_ORDER], selections: {}, sectionStyles: {} };
}

/**
 * The user's choices, as persisted: absent = never touched (use the default),
 * `null` = deliberately removed, a slug = that variation.
 */
export type PlaygroundSelections = Partial<Record<PlaygroundSlotId, string | null>>;

/** A slot resolved to a concrete component, ready to render/export. */
export interface PlaygroundSection {
  slot: PlaygroundSlot;
  component: LocalizedComponent;
}

/**
 * Every library component that can fill this slot: same category, and it must
 * have a live preview - a section the canvas cannot render would be a dead
 * choice.
 */
export function slotVariations(
  slot: PlaygroundSlot,
  components: LocalizedComponent[],
): LocalizedComponent[] {
  return components.filter((c) => c.category === slot.category && hasPreview(c.slug));
}

/**
 * Selections normalised against what the library offers TODAY.
 *
 * Persisted state ages: a stored slug may since have been renamed or lost its
 * preview. Rather than rendering a hole, an invalid or missing choice falls
 * back to the slot's first available variation; an explicit `null` (the user
 * removed the section) is honoured. Slots whose category has no previewable
 * entries resolve to `null` regardless.
 */
export function resolveSelections(
  selections: PlaygroundSelections,
  components: LocalizedComponent[],
): Record<PlaygroundSlotId, string | null> {
  const out = {} as Record<PlaygroundSlotId, string | null>;
  for (const slot of PLAYGROUND_SLOTS) {
    const available = slotVariations(slot, components);
    const chosen = selections[slot.id];
    if (chosen === null) {
      out[slot.id] = null;
    } else if (chosen !== undefined && available.some((c) => c.slug === chosen)) {
      out[slot.id] = chosen;
    } else {
      out[slot.id] = available[0]?.slug ?? null;
    }
  }
  return out;
}

/**
 * The page as it will render: filled slots only.
 *
 * `order` is the page's own arrangement of its body sections; the shared header
 * and footer are wrapped around it here rather than living in the order, so a
 * drag can never strand a page without its chrome or put the footer in the
 * middle. Omit `order` to fall back to the declared slot order.
 */
export function resolveSections(
  resolved: Record<PlaygroundSlotId, string | null>,
  components: LocalizedComponent[],
  order: readonly PlaygroundSlotId[] = DEFAULT_PAGE_ORDER,
): PlaygroundSection[] {
  const bySlug = new Map(components.map((c) => [c.slug, c]));
  const bySlot = new Map(PLAYGROUND_SLOTS.map((slot) => [slot.id, slot]));

  const header = PLAYGROUND_SLOTS.filter((slot) => slot.id === 'header');
  const footer = PLAYGROUND_SLOTS.filter((slot) => slot.id === 'footer');
  const body = normalizePageOrder(order)
    .map((id) => bySlot.get(id))
    .filter((slot): slot is PlaygroundSlot => slot !== undefined);

  const sections: PlaygroundSection[] = [];
  for (const slot of [...header, ...body, ...footer]) {
    const slug = resolved[slot.id];
    if (slug === null) continue;
    const component = bySlug.get(slug);
    if (component) sections.push({ slot, component });
  }
  return sections;
}

/**
 * The neighbouring variation for prev/next switching, wrapping at the ends.
 * Returns `undefined` when there is nothing to switch to.
 */
export function adjacentVariation(
  current: string,
  available: LocalizedComponent[],
  direction: 1 | -1,
): LocalizedComponent | undefined {
  if (available.length < 2) return undefined;
  const index = available.findIndex((c) => c.slug === current);
  if (index === -1) return available[0];
  return available[(index + direction + available.length) % available.length];
}
