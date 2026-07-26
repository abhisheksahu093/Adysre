/**
 * Canvas image engine. Pure client-side primitives the tools compose: decode a
 * file to a bitmap, draw it (with rotation, resize and fit) to a canvas, and
 * encode the canvas back to a Blob. No network, no worker required, no deps.
 */

export interface LoadedImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
}

export type FitMode = 'contain' | 'cover' | 'stretch';

export interface DrawOptions {
  targetWidth?: number;
  targetHeight?: number;
  rotation?: number;
  fit?: FitMode;
  /** Background fill (for letterboxing / non-transparent formats). */
  background?: string;
}

/** Decode a file to an ImageBitmap, honoring EXIF orientation. */
export async function loadImage(file: Blob): Promise<LoadedImage> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

/** Read the pixel dimensions of an image file without keeping the bitmap. */
export async function readDimensions(file: Blob): Promise<{ width: number; height: number }> {
  const { bitmap } = await loadImage(file);
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

/**
 * Draw a bitmap to a fresh canvas at the requested size/rotation. Rotation is
 * applied first (so width/height swap for 90/270); the target size then frames
 * the rotated image using the fit mode.
 */
export function drawToCanvas(bitmap: ImageBitmap, options: DrawOptions = {}): HTMLCanvasElement {
  const rotation = ((options.rotation ?? 0) % 360 + 360) % 360;
  const swapped = rotation === 90 || rotation === 270;
  const srcW = swapped ? bitmap.height : bitmap.width;
  const srcH = swapped ? bitmap.width : bitmap.height;

  const targetW = Math.max(1, Math.round(options.targetWidth ?? srcW));
  const targetH = Math.max(1, Math.round(options.targetHeight ?? srcH));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (options.background) {
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  // Compute the destination rect of the (unrotated) source within the target.
  const fit = options.fit ?? 'stretch';
  let dw = targetW;
  let dh = targetH;
  if (fit !== 'stretch') {
    const scale =
      fit === 'contain' ? Math.min(targetW / srcW, targetH / srcH) : Math.max(targetW / srcW, targetH / srcH);
    dw = srcW * scale;
    dh = srcH * scale;
  }
  const dx = (targetW - dw) / 2;
  const dy = (targetH - dh) / 2;

  ctx.save();
  ctx.translate(targetW / 2, targetH / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  // After rotating the context, draw the source centered; for 90/270 the source
  // box is drawn against the swapped axis, which the swapped dims already encode.
  const drawW = swapped ? dh : dw;
  const drawH = swapped ? dw : dh;
  ctx.drawImage(bitmap, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
  void dx;
  void dy;
  return canvas;
}

/** Encode a canvas to a Blob. Rejects if the browser cannot encode the mime. */
export function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error(`Cannot encode ${mime} in this browser`))),
      mime,
      quality,
    );
  });
}

const encodeSupport = new Map<string, boolean>();

/** True when `canvas.toBlob` actually produces the given mime (AVIF varies). */
export async function canEncode(mime: string): Promise<boolean> {
  const cached = encodeSupport.get(mime);
  if (cached !== undefined) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 2;
  const supported = await new Promise<boolean>((resolve) => {
    canvas.toBlob((blob) => resolve(Boolean(blob) && blob!.type === mime), mime, 0.9);
  });
  encodeSupport.set(mime, supported);
  return supported;
}
