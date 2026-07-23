/**
 * `adysre/palettes` - 102 curated colour palettes, plus the colour maths
 * behind them.
 *
 *   import { getPalette, contrastRatio } from 'adysre/palettes';
 *   const p = getPalette('nordic-calm');
 *
 * Palettes are plain hex arrays: use them for charts, theme presets, or to seed
 * your own tokens. The `harmony`, `contrastRatio` and `readableText` helpers are
 * the same ones the ADYSRE palette editor runs on.
 */

import { PALETTES, type Palette } from './data.ts';

export {
  PALETTES,
  PALETTE_COUNT,
  ALL_PALETTE_TAGS,
  similarPalettes,
  type Palette,
} from './data.ts';

export {
  contrastRatio,
  colorDistance,
  harmony,
  hexToHsl,
  hexToRgb,
  hslToHex,
  hslToRgb,
  hueName,
  isHex,
  luminance,
  normalizeHex,
  readableText,
  rgbToHex,
  rgbToHsl,
  sortByHue,
  type Hsl,
  type HarmonyScheme,
  type Rgb,
} from '../lib/color.ts';

const INDEX = new Map(PALETTES.map((palette) => [palette.id, palette]));

/** Look up a curated palette by id. */
export function getPalette(id: string): Palette | undefined {
  return INDEX.get(id);
}
