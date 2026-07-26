/**
 * Single source of truth for every library CONTENT count in the product.
 *
 * Each figure derives from the real catalogue array, so a new component, icon,
 * palette, gradient or texture updates every count that reads from here - the
 * landing stats band, page subtitles, and anywhere else - with no manual edit.
 *
 * ─── Server-only ────────────────────────────────────────────────────────────
 * This module imports the full catalogues (`COMPONENTS`, all icons),
 * so importing it into a Client Component would bundle those catalogues into
 * that component's browser chunk. Import it only from Server Components and pass
 * the resulting numbers down as props. Marketing figures with no data source
 * (teams, trusted-by) live in the client-safe `@/config/audience` instead.
 */

import { COMPONENT_COUNT } from '@/data/components';
import { ICON_COUNT } from '@/data/icons';
import { PALETTE_COUNT } from '@/data/palettes';
import { GRADIENT_COUNT } from '@/data/gradients';
import { PATTERN_COUNT } from '@/data/patterns';
import { TEXTURE_COUNT } from '@/data/textures';
import { TRUSTED_TEAMS } from '@/config/audience';
import type { Stat } from '@/data/landing';

export {
  COMPONENT_COUNT,
  ICON_COUNT,
  PALETTE_COUNT,
  GRADIENT_COUNT,
  PATTERN_COUNT,
  TEXTURE_COUNT,
};

/**
 * The landing page headline metrics, in display order. Content figures derive
 * from the catalogues; `teams` is the one marketing metric (from audience).
 * The `suffix` "+" reads the figure as a floor, so it stays true as the library
 * grows between deploys.
 */
export const LANDING_STATS: Stat[] = [
  { id: 'components', value: COMPONENT_COUNT, suffix: '+' },
  { id: 'icons', value: ICON_COUNT, suffix: '+' },
  { id: 'colors', value: PALETTE_COUNT, suffix: '+' },
  { id: 'gradients', value: GRADIENT_COUNT, suffix: '+' },
  { id: 'patterns', value: PATTERN_COUNT, suffix: '+' },
  { id: 'textures', value: TEXTURE_COUNT, suffix: '+' },
  { id: 'teams', value: TRUSTED_TEAMS, suffix: '+' },
];
