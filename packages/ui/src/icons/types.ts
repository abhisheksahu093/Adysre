/**
 * The public shape every ADYSRE icon component accepts.
 *
 * Kept in its own module so the 448 generated components share one declaration
 * instead of redeclaring it 448 times, and so consumers can type a wrapper
 * (`function MyIcon(props: IconProps)`) without importing a specific icon.
 */

import type { SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  /** Rendered width and height. Icons are square on a 24px grid. */
  size?: number | string;
  /** Stroke colour. Defaults to `currentColor`, so it inherits text colour. */
  color?: string;
  /** Stroke weight on the 24px grid. */
  strokeWidth?: number | string;
}
