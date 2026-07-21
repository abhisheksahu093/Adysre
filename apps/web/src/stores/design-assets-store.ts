import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createId } from '@/lib/design-playground/ids';

/**
 * Design Playground - the uploaded image library.
 *
 * Separate from the document store because an asset is not part of the DOCUMENT:
 * it survives being placed, deleted and undone, it is shared by every page, and
 * it must never enter the undo stack - dropping an image from the library is not
 * a design edit.
 *
 * Assets live in localStorage as data URLs, which is the whole reason this file
 * is careful. A browser gives the origin roughly 5MB TOTAL, shared with the
 * document draft, so an unbounded library would silently evict the user's work.
 * Every import therefore passes a per-asset cap and a whole-library cap, and a
 * bitmap that is too big is DOWNSCALED rather than refused - a 12MP phone photo
 * is still a usable asset at 2048px, and rejecting it teaches the user nothing.
 *
 * Server-side asset storage (PRD §7.4, "upload plus stock providers behind one
 * `AssetProvider` interface") replaces this; the shape of `DesignAsset` is what
 * that provider will return, so panels do not change when it lands.
 */

/** An image in the library, ready to be placed on the canvas. */
export interface DesignAsset {
  id: string;
  /** The original file name; also the placed node's name and default alt text. */
  name: string;
  /** Data URL of the STORED bitmap, which may be a downscale of the upload. */
  src: string;
  /** Natural size of the stored bitmap, used to size the placed node. */
  width: number;
  height: number;
  /** Approximate decoded size of `src`, for the library's usage accounting. */
  bytes: number;
  createdAt: number;
}

/** Why a file did not make it into the library. Each maps to a message key. */
export type AssetImportFailure =
  /** Not an image type the editor accepts. */
  | 'unsupported'
  /** Could not be read or decoded - corrupt file, or an unreadable blob. */
  | 'unreadable'
  /** Still over the per-asset cap after downscaling (typically a huge SVG). */
  | 'tooLarge'
  /** Would push the library over its total budget. */
  | 'libraryFull';

export interface AssetImportResult {
  added: number;
  failures: { name: string; reason: AssetImportFailure }[];
}

/** What the file input advertises and what an import will actually accept. */
export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

/**
 * Storage budget. Deliberately well under the ~5MB origin quota: the document
 * draft shares it, and a library that fills the quota would break autosave.
 */
export const MAX_ASSET_BYTES = 2 * 1024 * 1024;
export const MAX_LIBRARY_BYTES = 4 * 1024 * 1024;
/** Long-edge cap for a stored bitmap. Above this is invisible on a 2x canvas. */
const MAX_DIMENSION = 2048;
/** How many shrink passes before an image is declared unstorable. */
const MAX_COMPRESSION_PASSES = 6;

interface DesignAssetsStore {
  assets: DesignAsset[];
  /**
   * True when the last write to localStorage was rejected (quota exhausted, or
   * Safari private mode). The library still works in memory - the panel says so
   * rather than letting the user believe an upload was kept.
   */
  storageFailed: boolean;

  /** Read files, downscale what needs it, and add what fits. Never throws. */
  importFiles: (files: readonly File[]) => Promise<AssetImportResult>;
  remove: (id: string) => void;
  /** Bytes currently held by the library, for the usage meter and the cap. */
  usedBytes: () => number;
}

/**
 * Set by the store right after creation. The persist storage adapter needs to
 * report a failed write back into state, but it is constructed BEFORE the store
 * exists, so it goes through this hook instead of naming the store directly
 * (which would make the store's own type circular).
 */
let onStorageResult: ((ok: boolean) => void) | null = null;

const storage = createJSONStorage<Pick<DesignAssetsStore, 'assets'>>(() => {
  // Read `localStorage` here, not inside the methods: zustand only guards the
  // FACTORY, so throwing at this point is how a store opts out of persistence on
  // the server instead of blowing up during SSR hydration.
  const local = window.localStorage;

  return {
    getItem: (name) => local.getItem(name),
    setItem: (name, value) => {
      try {
        local.setItem(name, value);
        onStorageResult?.(true);
      } catch {
        // A quota error must never propagate: it would reject inside a zustand
        // `set`, tearing down the editor over a failed cache write.
        onStorageResult?.(false);
      }
    },
    removeItem: (name) => local.removeItem(name),
  };
});

export const useDesignAssetsStore = create<DesignAssetsStore>()(
  persist(
    (set, get) => ({
      assets: [],
      storageFailed: false,

      usedBytes: () => get().assets.reduce((total, asset) => total + asset.bytes, 0),

      importFiles: async (files) => {
        const failures: AssetImportResult['failures'] = [];
        const accepted: DesignAsset[] = [];
        // Budget is tracked locally across the batch so ten files dropped at
        // once cannot each individually "fit" and collectively blow the cap.
        let budget = MAX_LIBRARY_BYTES - get().usedBytes();

        for (const file of files) {
          const result = await prepareAsset(file, budget);
          if (typeof result === 'string') {
            failures.push({ name: file.name, reason: result });
            continue;
          }
          accepted.push(result);
          budget -= result.bytes;
        }

        // One `set` for the whole batch: one persist write, one re-render.
        if (accepted.length > 0) {
          set((state) => ({ assets: [...accepted.reverse(), ...state.assets] }));
        }
        return { added: accepted.length, failures };
      },

      remove: (id) =>
        set((state) => ({ assets: state.assets.filter((asset) => asset.id !== id) })),
    }),
    {
      name: 'adysre-design-assets',
      storage,
      // Only the library persists; `storageFailed` describes THIS session's
      // storage, so a stale `true` must not follow the user into the next one.
      partialize: (state) => ({ assets: state.assets }),
    },
  ),
);

onStorageResult = (ok) => {
  // Avoid a pointless re-render when the flag is already correct - persist
  // writes on every library change.
  if (useDesignAssetsStore.getState().storageFailed === !ok) return;
  useDesignAssetsStore.setState({ storageFailed: !ok });
};

/**
 * Turn one file into a storable asset, or explain why it cannot be one.
 *
 * Returns the asset on success and an `AssetImportFailure` code otherwise, so
 * the caller never has to interpret a thrown error.
 */
async function prepareAsset(file: File, budget: number): Promise<DesignAsset | AssetImportFailure> {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) return 'unsupported';

  let dataUrl: string;
  let image: HTMLImageElement;
  try {
    dataUrl = await readDataUrl(file);
    image = await decodeImage(dataUrl);
  } catch {
    return 'unreadable';
  }

  const stored =
    file.type === 'image/svg+xml'
      ? // An SVG is markup: re-encoding it through a canvas would rasterise it
        // and throw away the one property that makes it worth keeping.
        (approximateBytes(dataUrl) <= MAX_ASSET_BYTES
          ? { src: dataUrl, width: image.naturalWidth, height: image.naturalHeight }
          : null)
      : compress(image, dataUrl);

  if (!stored) return 'tooLarge';

  const bytes = approximateBytes(stored.src);
  if (bytes > budget) return 'libraryFull';

  return {
    id: createId(),
    name: file.name,
    src: stored.src,
    width: stored.width,
    height: stored.height,
    bytes,
    createdAt: Date.now(),
  };
}

/** A decoded bitmap the library is willing to store, or null if it never fits. */
function compress(
  image: HTMLImageElement,
  original: string,
): { src: string; width: number; height: number } | null {
  const { naturalWidth: width, naturalHeight: height } = image;
  const longEdge = Math.max(width, height);

  // Already small enough in both dimensions and bytes: keep the exact upload,
  // because re-encoding is lossy and would only make it worse.
  if (longEdge <= MAX_DIMENSION && approximateBytes(original) <= MAX_ASSET_BYTES) {
    return { src: original, width, height };
  }

  // PNG and GIF may be transparent, so they re-encode to WebP rather than JPEG.
  const mime = image.src.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/webp';
  let scale = Math.min(1, MAX_DIMENSION / longEdge);
  let quality = 0.9;

  for (let pass = 0; pass < MAX_COMPRESSION_PASSES; pass += 1) {
    const next = encode(image, scale, quality, mime);
    if (!next) return null;
    if (approximateBytes(next.src) <= MAX_ASSET_BYTES) return next;
    // Trade resolution and quality together: dropping only one of them takes
    // far more passes to reach the cap on a large photograph.
    scale *= 0.75;
    quality = Math.max(0.5, quality - 0.1);
  }
  return null;
}

/** Redraw the bitmap at `scale` on a detached (never-painted) canvas. */
function encode(
  image: HTMLImageElement,
  scale: number,
  quality: number,
  mime: string,
): { src: string; width: number; height: number } | null {
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(image, 0, 0, width, height);
  try {
    return { src: canvas.toDataURL(mime, quality), width, height };
  } catch {
    // Tainted canvases cannot be exported. Local files never taint, but a future
    // remote provider could, and a thrown error here would kill the batch.
    return null;
  }
}

function readDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('not a string'));
    reader.onerror = () => reject(reader.error ?? new Error('unreadable'));
    reader.readAsDataURL(file);
  });
}

/** Decode a data URL so its natural size is known before anything is stored. */
function decodeImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error('undecodable'));
    element.src = src;
  });
}

/**
 * Decoded size of a data URL, in bytes.
 *
 * The base64 payload is 4 characters per 3 bytes; the exact padding is not worth
 * measuring when this only feeds a budget comparison.
 */
export function approximateBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  const payload = comma === -1 ? dataUrl.length : dataUrl.length - comma - 1;
  return dataUrl.includes(';base64,') ? Math.round((payload * 3) / 4) : payload;
}
