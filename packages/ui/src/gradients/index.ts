/**
 * `adysre/gradients` - 78 curated CSS gradients as data, style and JSX.
 *
 *   import { GradientSurface } from 'adysre/gradients';
 *   <GradientSurface gradient="warm-flame" className="h-64 rounded-xl" />
 *
 *   import { gradientToStyle, getGradient } from 'adysre/gradients';
 *   <div style={gradientToStyle(getGradient('warm-flame')!)} />
 *
 * A gradient is plain data (type, angle, stops), so it renders with no images,
 * no runtime CSS injection and no dependency beyond React.
 */

import { GRADIENTS, type Gradient } from './data.ts';
import { gradientToStyle } from './css.ts';
import { indexById, renderSurface, resolveById, type SurfaceBaseProps } from '../lib/surface.ts';

export {
  GRADIENTS,
  GRADIENT_COUNT,
  ALL_GRADIENT_TAGS,
  similarGradients,
  type Gradient,
  type GradientStop,
  type GradientType,
} from './data.ts';

export {
  GRADIENT_FORMATS,
  formatGradient,
  gradientToCss,
  gradientToStyle,
  downloadGradientPng,
  type GradientFormat,
  type GradientFormatId,
} from './css.ts';

const INDEX = indexById(GRADIENTS);

/** Look up a curated gradient by id, e.g. `warm-flame`. */
export function getGradient(id: string): Gradient | undefined {
  return INDEX.get(id);
}

export interface GradientSurfaceProps extends SurfaceBaseProps {
  /** A gradient record, or the id of a curated one. */
  gradient: Gradient | string;
}

/** A box painted with a gradient. Everything else is forwarded to the element. */
export function GradientSurface({ gradient, ...rest }: GradientSurfaceProps) {
  const resolved = resolveById(gradient, INDEX);
  return renderSurface(resolved ? gradientToStyle(resolved) : undefined, rest);
}
