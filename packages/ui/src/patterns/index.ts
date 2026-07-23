/**
 * `adysre/patterns` - 50 curated background patterns as data, style and JSX.
 *
 *   import { PatternSurface } from 'adysre/patterns';
 *   <PatternSurface pattern="blueprint-grid" className="h-64 rounded-xl" />
 *
 * Every pattern is built from CSS gradients, so there are no image files to host
 * and the exported CSS is self-contained.
 */

import { PATTERNS, type Pattern } from './data.ts';
import { patternToStyle } from './css.ts';
import { indexById, renderSurface, resolveById, type SurfaceBaseProps } from '../lib/surface.ts';

export {
  PATTERNS,
  PATTERN_COUNT,
  ALL_PATTERN_TAGS,
  similarPatterns,
  type Pattern,
  type PatternType,
} from './data.ts';

export {
  PATTERN_FORMATS,
  PATTERN_TYPES,
  formatPattern,
  patternToStyle,
  downloadPatternPng,
  type PatternFormat,
  type PatternFormatId,
} from './css.ts';

const INDEX = indexById(PATTERNS);

/** Look up a curated pattern by id, e.g. `blueprint-grid`. */
export function getPattern(id: string): Pattern | undefined {
  return INDEX.get(id);
}

export interface PatternSurfaceProps extends SurfaceBaseProps {
  /** A pattern record, or the id of a curated one. */
  pattern: Pattern | string;
}

/** A box tiled with a pattern. Everything else is forwarded to the element. */
export function PatternSurface({ pattern, ...rest }: PatternSurfaceProps) {
  const resolved = resolveById(pattern, INDEX);
  return renderSurface(resolved ? patternToStyle(resolved) : undefined, rest);
}
