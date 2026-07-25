/**
 * Output formats and human-readable size helpers.
 *
 * `reliable` marks formats that `canvas.toBlob` always encodes (PNG, JPEG,
 * WEBP). AVIF encoding is browser-dependent, so tools capability-check it with
 * `canEncode` before offering it.
 */

export interface ImageFormat {
  id: string;
  label: string;
  mime: string;
  ext: string;
  reliable: boolean;
}

export const IMAGE_FORMATS: ImageFormat[] = [
  { id: 'png', label: 'PNG', mime: 'image/png', ext: 'png', reliable: true },
  { id: 'jpeg', label: 'JPG', mime: 'image/jpeg', ext: 'jpg', reliable: true },
  { id: 'webp', label: 'WEBP', mime: 'image/webp', ext: 'webp', reliable: true },
  { id: 'avif', label: 'AVIF', mime: 'image/avif', ext: 'avif', reliable: false },
];

export const FORMAT_BY_ID: Record<string, ImageFormat> = Object.fromEntries(
  IMAGE_FORMATS.map((f) => [f.id, f]),
);

/** Whether a format keeps alpha (transparency). */
export function hasAlpha(formatId: string): boolean {
  return formatId === 'png' || formatId === 'webp' || formatId === 'avif';
}

export function formatFromMime(mime: string): ImageFormat | undefined {
  return IMAGE_FORMATS.find((f) => f.mime === mime);
}

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function percentSaved(original: number, compressed: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

/** Swap a filename's extension, keeping the base name. */
export function withExtension(name: string, ext: string): string {
  const dot = name.lastIndexOf('.');
  const base = dot === -1 ? name : name.slice(0, dot);
  return `${base}.${ext}`;
}
