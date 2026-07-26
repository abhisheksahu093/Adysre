import { createZip, downloadBlob, type ZipEntry } from '@/lib/zip';
import type { MediaItem } from '../types';
import { buildTextExport, isTextExportFormat } from './text-export';

/**
 * The downloadable blob + filename for a result. Text results (OCR, readers)
 * honor the chosen export format (txt/json/csv/docx); image results download as
 * produced.
 */
function resolveDownload(item: MediaItem, exportFormat?: string): { blob: Blob; filename: string } {
  const result = item.result!;
  if (result.text != null && isTextExportFormat(exportFormat) && exportFormat !== 'txt') {
    return buildTextExport(result.text, result.filename, exportFormat);
  }
  return { blob: result.blob, filename: result.filename };
}

/** Download one processed result, in the chosen export format when text. */
export function downloadResult(item: MediaItem, exportFormat?: string): void {
  if (!item.result) return;
  const { blob, filename } = resolveDownload(item, exportFormat);
  downloadBlob(filename, blob);
}

/** Bundle every completed result into a single .zip and download it. */
export async function downloadAllResults(
  items: MediaItem[],
  zipName = 'adysre-images.zip',
  exportFormat?: string,
): Promise<void> {
  const done = items.filter((item) => item.result);
  if (done.length === 0) return;

  const seen = new Map<string, number>();
  const entries: ZipEntry[] = [];
  for (const item of done) {
    const { blob, filename } = resolveDownload(item, exportFormat);
    let name = filename;
    const count = seen.get(filename) ?? 0;
    if (count > 0) {
      const dot = name.lastIndexOf('.');
      name = dot === -1 ? `${name}-${count}` : `${name.slice(0, dot)}-${count}${name.slice(dot)}`;
    }
    seen.set(filename, count + 1);
    entries.push({ path: name, content: new Uint8Array(await blob.arrayBuffer()) });
  }

  downloadBlob(zipName, createZip(entries));
}
