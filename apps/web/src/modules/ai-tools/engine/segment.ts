/**
 * On-device foreground segmentation with MediaPipe (selfie segmenter).
 *
 * Reuses the vision WASM runtime already vendored for face detection; only the
 * small .tflite model is added. Returns a per-pixel foreground probability
 * (0..1) at the requested size, so background removal / smart crop stay offline
 * and the image never leaves the browser.
 */

const WASM_PATH = '/models/mediapipe/wasm';
const MODEL_PATH = '/models/mediapipe/selfie_segmenter.tflite';

interface MPMaskLike {
  width: number;
  height: number;
  getAsFloat32Array(): Float32Array;
  close(): void;
}

interface SegmenterResult {
  confidenceMasks?: MPMaskLike[];
  categoryMask?: MPMaskLike;
  close(): void;
}

interface ImageSegmenterLike {
  segment(source: HTMLCanvasElement | ImageBitmap): SegmenterResult;
}

let segmenterPromise: Promise<ImageSegmenterLike> | null = null;

async function getSegmenter(): Promise<ImageSegmenterLike> {
  segmenterPromise ??= (async () => {
    const { FilesetResolver, ImageSegmenter } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);
    return (await ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_PATH },
      runningMode: 'IMAGE',
      outputConfidenceMasks: true,
      outputCategoryMask: false,
    })) as unknown as ImageSegmenterLike;
  })();
  return segmenterPromise;
}

/** Bilinear-resample a mask from (mw,mh) to (tw,th). */
function resample(src: Float32Array, mw: number, mh: number, tw: number, th: number): Float32Array {
  if (mw === tw && mh === th) return src;
  const out = new Float32Array(tw * th);
  for (let y = 0; y < th; y++) {
    const sy = (y / th) * mh;
    const y0 = Math.min(mh - 1, Math.floor(sy));
    const y1 = Math.min(mh - 1, y0 + 1);
    const fy = sy - y0;
    for (let x = 0; x < tw; x++) {
      const sx = (x / tw) * mw;
      const x0 = Math.min(mw - 1, Math.floor(sx));
      const x1 = Math.min(mw - 1, x0 + 1);
      const fx = sx - x0;
      const a = src[y0 * mw + x0]!;
      const b = src[y0 * mw + x1]!;
      const c = src[y1 * mw + x0]!;
      const d = src[y1 * mw + x1]!;
      out[y * tw + x] = a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy;
    }
  }
  return out;
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Tight bounding box of foreground pixels above `threshold`, or null if none. */
export function foregroundBounds(foreground: Float32Array, width: number, height: number, threshold = 0.5): Box | null {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (foreground[y * width + x]! > threshold) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Foreground probability (0..1) per pixel, at the given target size. */
export async function segmentForeground(
  source: HTMLCanvasElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
): Promise<Float32Array> {
  const segmenter = await getSegmenter();
  const result = segmenter.segment(source);
  const masks = result.confidenceMasks;
  // The general selfie segmenter returns a single mask whose value is the
  // FOREGROUND (person) probability. A multi-class model would put foreground
  // last, so take the final mask in either case.
  const mask = (masks && masks.length > 0 ? masks[masks.length - 1] : undefined) ?? result.categoryMask;
  if (!mask) {
    result.close();
    throw new Error('Segmentation produced no mask');
  }
  const raw = mask.getAsFloat32Array();
  const scaled = resample(raw, mask.width, mask.height, targetWidth, targetHeight);
  const out = scaled === raw ? scaled.slice() : scaled;
  mask.close();
  result.close();
  return out;
}
