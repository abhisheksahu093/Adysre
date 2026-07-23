/**
 * The shared half of the three decorative surfaces (gradient, pattern, texture).
 *
 * All three resolve a catalogue id to its record, turn that record into inline
 * style, and paint it on an element. Only the resolver and the style builder
 * differ, so the rest lives here and each surface stays a ten-line wrapper with
 * its own named prop (`gradient=`, `pattern=`, `texture=`) and its own types.
 */

import { createElement, type CSSProperties, type ElementType, type ReactNode } from 'react';

/** Props every surface accepts alongside its own `gradient`/`pattern`/`texture`. */
export interface SurfaceBaseProps {
  /** Element to render. Defaults to `div`; pass `section`, `header`, `span`… */
  as?: ElementType;
  /** Merged over the generated background, so a caller can always override. */
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** Build the id lookup once per module rather than once per render. */
export function indexById<T extends { id: string }>(items: readonly T[]): ReadonlyMap<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

/** Accept either a record or its catalogue id. */
export function resolveById<T extends { id: string }>(
  value: T | string,
  index: ReadonlyMap<string, T>,
): T | undefined {
  return typeof value === 'string' ? index.get(value) : value;
}

/**
 * Paint `surfaceStyle` on the chosen element.
 *
 * An unresolved id yields no background rather than throwing: a typo should not
 * take a page down, and a blank box is obvious the moment you look at it.
 */
export function renderSurface(
  surfaceStyle: CSSProperties | undefined,
  { as = 'div', style, ...rest }: SurfaceBaseProps & Record<string, unknown>,
) {
  return createElement(as as ElementType, { ...rest, style: { ...surfaceStyle, ...style } });
}
