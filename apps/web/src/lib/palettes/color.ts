/**
 * Colour maths — now published in `adysre/palettes`.
 *
 * The implementation moved into the UI package so the npm consumers and this app
 * run the identical code (Rule 3: never duplicate). This file stays as the
 * app-local alias the rest of `apps/web` already imports, so no call site had to
 * change. Prefer importing from `adysre/palettes` in new code.
 */

export {
  colorDistance,
  contrastRatio,
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
  type HarmonyScheme,
  type Hsl,
  type Rgb,
} from 'adysre/palettes';
