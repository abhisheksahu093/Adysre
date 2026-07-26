import { canvasToBlob, drawToCanvas, loadImage, type FitMode } from '../engine/image';
import { FORMAT_BY_ID, hasAlpha, withExtension } from '../engine/format';
import type { MediaItem, ToolResult } from '../types';

export interface RenderOptions {
  formatId: string;
  quality?: number;
  targetWidth?: number;
  targetHeight?: number;
  fit?: FitMode;
}

/**
 * The shared image render used by the compressor, converter and resizer: decode
 * → draw (with the item's rotation, and any resize/fit) → encode. Alpha formats
 * keep transparency; others get a white matte so JPEG never turns black.
 */
export async function renderImageResult(item: MediaItem, options: RenderOptions): Promise<ToolResult> {
  const format = FORMAT_BY_ID[options.formatId] ?? FORMAT_BY_ID.png!;
  const { bitmap } = await loadImage(item.file);
  try {
    const canvas = drawToCanvas(bitmap, {
      rotation: item.rotation,
      ...(options.targetWidth !== undefined ? { targetWidth: options.targetWidth } : {}),
      ...(options.targetHeight !== undefined ? { targetHeight: options.targetHeight } : {}),
      ...(options.fit ? { fit: options.fit } : {}),
      ...(hasAlpha(format.id) ? {} : { background: '#ffffff' }),
    });
    const blob = await canvasToBlob(canvas, format.mime, options.quality);
    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: canvas.width,
      height: canvas.height,
      filename: withExtension(item.name, format.ext),
      mime: format.mime,
    };
  } finally {
    bitmap.close();
  }
}

/** Pick an output format id that this browser can reliably encode. */
export function safeFormatId(sourceMime: string): string {
  if (sourceMime === 'image/jpeg') return 'jpeg';
  if (sourceMime === 'image/webp') return 'webp';
  return 'png';
}

/** Build a text result (readers, OCR): downloads as .txt and shows in a panel. */
export function textResult(item: MediaItem, text: string): ToolResult {
  const blob = new Blob([text], { type: 'text/plain' });
  return {
    blob,
    url: URL.createObjectURL(blob),
    size: blob.size,
    width: item.width,
    height: item.height,
    filename: withExtension(item.name, 'txt'),
    text,
    mime: 'text/plain',
  };
}
