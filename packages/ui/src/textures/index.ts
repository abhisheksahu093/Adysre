/**
 * `adysre/textures` - 28 curated surface textures as data, style and JSX.
 *
 *   import { TextureSurface } from 'adysre/textures';
 *   <TextureSurface texture="ink-noise" className="h-64 rounded-xl" />
 *
 * Noise, grain and paper are an inline SVG turbulence filter; carbon and fabric
 * are layered CSS gradients. Either way it is a data URI, not an image request.
 */

import { TEXTURES, type Texture } from './data.ts';
import { textureToStyle } from './css.ts';
import { indexById, renderSurface, resolveById, type SurfaceBaseProps } from '../lib/surface.ts';

export {
  TEXTURES,
  TEXTURE_COUNT,
  ALL_TEXTURE_TAGS,
  similarTextures,
  type Texture,
  type TextureType,
} from './data.ts';

export {
  TEXTURE_FORMATS,
  TEXTURE_TYPES,
  formatTexture,
  textureToStyle,
  downloadTexturePng,
  type TextureFormat,
  type TextureFormatId,
} from './css.ts';

const INDEX = indexById(TEXTURES);

/** Look up a curated texture by id, e.g. `ink-noise`. */
export function getTexture(id: string): Texture | undefined {
  return INDEX.get(id);
}

export interface TextureSurfaceProps extends SurfaceBaseProps {
  /** A texture record, or the id of a curated one. */
  texture: Texture | string;
}

/** A box finished with a texture. Everything else is forwarded to the element. */
export function TextureSurface({ texture, ...rest }: TextureSurfaceProps) {
  const resolved = resolveById(texture, INDEX);
  return renderSurface(resolved ? textureToStyle(resolved) : undefined, rest);
}
