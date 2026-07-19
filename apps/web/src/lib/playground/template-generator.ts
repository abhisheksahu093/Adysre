/**
 * Turn an uploaded reference image (a sketch or a homepage screenshot) into a
 * starting template - a set of section choices the builder then renders.
 *
 * ─── What this does, honestly ───────────────────────────────────────────────
 * There is no vision model behind this in the app today. Instead the reference
 * is analysed IN THE BROWSER: it is drawn to a small canvas and reduced to a
 * few signals - aspect ratio, overall tone, and how many horizontal "bands" it
 * appears to have - which then drive how many sections the template includes
 * and which variation fills each slot. The image never leaves the device.
 *
 * Because the mapping is a pure function of those signals, the same reference
 * always yields the same template, and different references yield different
 * ones. It is a heuristic, not recognition - a sensible, editable starting
 * point, which the user refines in the builder.
 *
 * ─── Scaling to real generation ─────────────────────────────────────────────
 * `TemplateGenerator` is the seam. A server-side vision endpoint can implement
 * the same interface (take the file, return selections) and be swapped in with
 * no change to the UI, which only ever calls `generator.generate(...)`.
 */

import type { LocalizedComponent } from '@/data/components';
import {
  PLAYGROUND_SLOTS,
  slotVariations,
  type PlaygroundSelections,
  type PlaygroundSlot,
} from '@/data/playground';

export interface ReferenceFeatures {
  width: number;
  height: number;
  /** height / width - tall screenshots imply more sections than wide sketches. */
  aspect: number;
  /** Average luma, 0 (black) … 1 (white). */
  brightness: number;
  tone: 'light' | 'dark';
  /** Dominant-ish average colour as #rrggbb (informational). */
  accent: string;
  /** Estimated count of distinct horizontal regions. */
  bands: number;
  /** Deterministic seed derived from the pixels. */
  hash: number;
}

export interface GeneratedTemplate {
  selections: PlaygroundSelections;
  features: ReferenceFeatures;
  /** How many sections the template includes (non-empty slots). */
  sectionCount: number;
}

/** The contract a future server-side vision generator can also implement. */
export interface TemplateGenerator {
  generate(file: File, components: LocalizedComponent[]): Promise<GeneratedTemplate>;
}

/** Accepted upload constraints, shared with the UI. */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB

/** Longest edge of the downscaled analysis canvas - plenty for coarse signals. */
const ANALYSIS_MAX_DIM = 100;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function toHex(n: number): string {
  return clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
}

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
}

/** Decode the file to something drawable, preferring the zero-copy path. */
async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fall through to the <img> path.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode-failed'));
      el.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth || 1,
      height: img.naturalHeight || 1,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/** Reduce the reference to the handful of signals the mapping needs. */
export async function extractReferenceFeatures(file: File): Promise<ReferenceFeatures> {
  const decoded = await decode(file);
  try {
    const w0 = decoded.width || 1;
    const h0 = decoded.height || 1;
    const scale = Math.min(1, ANALYSIS_MAX_DIM / Math.max(w0, h0));
    const w = Math.max(1, Math.round(w0 * scale));
    const h = Math.max(1, Math.round(h0 * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('no-2d-context');
    ctx.drawImage(decoded.source, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let lumaSum = 0;
    let hash = (w * 73856093) ^ (h * 19349663);
    const rowLuma: number[] = new Array(h).fill(0);

    for (let y = 0; y < h; y++) {
      let rowSum = 0;
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        rSum += r;
        gSum += g;
        bSum += b;
        const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        rowSum += luma;
        lumaSum += luma;
        hash = (Math.imul(hash, 31) + (r >> 4) + (g >> 4) * 3 + (b >> 4) * 7) >>> 0;
      }
      rowLuma[y] = rowSum / w;
    }

    const pixels = w * h;
    const brightness = lumaSum / pixels;

    // Count horizontal bands: quantise each row's brightness and count how many
    // times the band changes down the image - a coarse proxy for "how many
    // stacked strips does this layout have".
    let bands = 1;
    let prevBucket = Math.round((rowLuma[0] ?? 0) * 6);
    for (let y = 1; y < h; y++) {
      const bucket = Math.round((rowLuma[y] ?? 0) * 6);
      if (Math.abs(bucket - prevBucket) >= 1) {
        bands++;
        prevBucket = bucket;
      }
    }

    return {
      width: w0,
      height: h0,
      aspect: h0 / w0,
      brightness,
      tone: brightness < 0.5 ? 'dark' : 'light',
      accent: `#${toHex(rSum / pixels)}${toHex(gSum / pixels)}${toHex(bSum / pixels)}`,
      bands: clamp(bands, 3, 12),
      hash: hash >>> 0,
    };
  } finally {
    decoded.cleanup();
  }
}

/** Pick a variation slug for a slot, deterministic in the reference's hash. */
function pickVariation(
  slot: PlaygroundSlot,
  components: LocalizedComponent[],
  features: ReferenceFeatures,
  salt: number,
): string | null {
  const vars = slotVariations(slot, components);
  if (vars.length === 0) return null;

  let index = (features.hash + Math.imul(salt, 2654435761)) % vars.length;
  if (index < 0) index += vars.length;

  // A dark reference nudges visually-themeable slots toward their darker
  // variations, when one exists - a small nod to the source's mood.
  if (features.tone === 'dark' && (features.hash & 1) === 1) {
    const darkPref = vars.findIndex((v) => /dark|gradient|glow|video/.test(v.slug));
    if (darkPref >= 0) index = darkPref;
  }

  return vars[index]?.slug ?? vars[0]?.slug ?? null;
}

/** Map extracted features onto concrete section selections. */
export function mapFeaturesToTemplate(
  features: ReferenceFeatures,
  components: LocalizedComponent[],
): { selections: PlaygroundSelections; sectionCount: number } {
  const optionalSlots = PLAYGROUND_SLOTS.filter((s) => !s.required);
  const requiredCount = PLAYGROUND_SLOTS.length - optionalSlots.length;

  // More apparent bands (and taller references) → a longer page.
  const targetOptional = clamp(
    Math.round(features.bands - requiredCount + (features.aspect - 1) * 1.5),
    2,
    optionalSlots.length,
  );

  const selections: PlaygroundSelections = {};
  let optionalSeen = 0;
  let sectionCount = 0;

  PLAYGROUND_SLOTS.forEach((slot, i) => {
    let slug: string | null;
    if (slot.required) {
      slug = pickVariation(slot, components, features, i + 1);
    } else {
      slug = optionalSeen < targetOptional ? pickVariation(slot, components, features, i + 1) : null;
      optionalSeen++;
    }
    selections[slot.id] = slug;
    if (slug !== null) sectionCount++;
  });

  return { selections, sectionCount };
}

/** The default, on-device generator. Swap for a server generator via the interface. */
export const localTemplateGenerator: TemplateGenerator = {
  async generate(file, components) {
    const features = await extractReferenceFeatures(file);
    const { selections, sectionCount } = mapFeaturesToTemplate(features, components);
    return { selections, features, sectionCount };
  },
};
