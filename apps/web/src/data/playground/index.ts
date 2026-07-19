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

export const PLAYGROUND_SLOTS = [
  { id: 'header', category: 'navbar', required: true },
  { id: 'hero', category: 'hero', required: true },
  { id: 'services', category: 'services', required: false },
  { id: 'about', category: 'about', required: false },
  { id: 'gallery', category: 'galleries', required: false },
  { id: 'pricing', category: 'pricing', required: false },
  { id: 'comparison', category: 'comparisons', required: false },
  { id: 'faq', category: 'faq', required: false },
  { id: 'cta', category: 'marketing', required: false },
  { id: 'footer', category: 'footer', required: true },
] as const satisfies readonly { id: string; category: ComponentCategory; required: boolean }[];

export type PlaygroundSlotId = (typeof PLAYGROUND_SLOTS)[number]['id'];
export type PlaygroundSlot = (typeof PLAYGROUND_SLOTS)[number];

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

/** The page as it will render: filled slots only, in slot order. */
export function resolveSections(
  resolved: Record<PlaygroundSlotId, string | null>,
  components: LocalizedComponent[],
): PlaygroundSection[] {
  const bySlug = new Map(components.map((c) => [c.slug, c]));
  const sections: PlaygroundSection[] = [];
  for (const slot of PLAYGROUND_SLOTS) {
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
