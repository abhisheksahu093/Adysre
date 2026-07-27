/**
 * Reading an uploaded image into a document, safely.
 *
 * Every generator here keeps its artwork as a data URL inside the document, so
 * the whole thing stays one JSON value that exports, imports and prints with no
 * server and no object URLs to revoke. The catch is size: a photo straight off
 * a phone is 3-6 MB, which becomes ~8 MB of base64, and
 *
 *   - the resume autosaves to localStorage, whose quota is ~5 MB. The write
 *     throws `QuotaExceededError`, which is how "upload does nothing" happens;
 *   - a JSON export becomes megabytes of one line;
 *   - the print preview re-decodes the full-resolution bitmap on every render.
 *
 * None of that buys anything: the artwork lands in a 96px avatar or a small
 * logo. So the file is decoded, scaled to fit a sensible box and re-encoded
 * before it ever reaches the document.
 */

/** Longest edge, in CSS pixels, of the stored image. */
export const AVATAR_MAX_EDGE = 512;
export const LOGO_MAX_EDGE = 640;

export interface ImageReadOptions {
  /** Longest edge to keep. Smaller images are never scaled up. */
  maxEdge?: number;
  /** JPEG quality for photographs; ignored when the result keeps alpha. */
  quality?: number;
}

/** Anything a browser can decode into an `<img>`. */
function isImage(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * SVG has no intrinsic bitmap to resample, and rasterising it would throw away
 * the one thing it is good at, so it is stored as-is.
 */
function isVector(file: File): boolean {
  return file.type === 'image/svg+xml';
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error('The file could not be read.'));
    };
    reader.readAsDataURL(file);
  });
}

function decode(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('The image could not be decoded.'));
    };
    image.src = dataUrl;
  });
}

/**
 * Read an image file into a data URL small enough to live in a document.
 *
 * @returns the data URL, or `null` when the file is not an image the browser
 * can decode. Never throws for a bad file: a caller in an `onChange` handler
 * has nowhere useful to put an exception, and the honest answer is "no image".
 */
export async function readImageFile(
  file: File,
  options: ImageReadOptions = {},
): Promise<string | null> {
  if (!isImage(file)) return null;

  let dataUrl: string;
  try {
    dataUrl = await readAsDataUrl(file);
  } catch {
    return null;
  }
  if (dataUrl === '') return null;

  // Vectors are already small and scale for free.
  if (isVector(file)) return dataUrl;

  const maxEdge = options.maxEdge ?? AVATAR_MAX_EDGE;

  try {
    const image = await decode(dataUrl);
    const longest = Math.max(image.naturalWidth, image.naturalHeight);
    // Already small enough: re-encoding would only cost a generation of quality.
    if (longest === 0 || longest <= maxEdge) return dataUrl;

    const scale = maxEdge / longest;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const context = canvas.getContext('2d');
    if (context === null) return dataUrl;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    // PNG keeps transparency, which a logo usually depends on; everything else
    // is a photograph and compresses far better as JPEG.
    const keepsAlpha = file.type === 'image/png' || file.type === 'image/webp';
    return keepsAlpha
      ? canvas.toDataURL('image/png')
      : canvas.toDataURL('image/jpeg', options.quality ?? 0.85);
  } catch {
    // Decoding or canvas export failed (a tainted or malformed file). The
    // original still displays, so hand it back rather than losing the upload.
    return dataUrl;
  }
}
