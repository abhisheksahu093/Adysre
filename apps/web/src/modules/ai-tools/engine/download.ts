import { createZip, downloadBlob, type ZipEntry } from '@/lib/zip';
import type { MediaItem } from '../types';

/** Download one processed result. */
export function downloadResult(item: MediaItem): void {
  if (!item.result) return;
  downloadBlob(item.result.filename, item.result.blob);
}

/** Bundle every completed result into a single .zip and download it. */
export async function downloadAllResults(items: MediaItem[], zipName = 'adysre-images.zip'): Promise<void> {
  const done = items.filter((item) => item.result);
  if (done.length === 0) return;

  const seen = new Map<string, number>();
  const entries: ZipEntry[] = [];
  for (const item of done) {
    const result = item.result!;
    let name = result.filename;
    const count = seen.get(name) ?? 0;
    if (count > 0) {
      const dot = name.lastIndexOf('.');
      name = dot === -1 ? `${name}-${count}` : `${name.slice(0, dot)}-${count}${name.slice(dot)}`;
    }
    seen.set(result.filename, count + 1);
    entries.push({ path: name, content: new Uint8Array(await result.blob.arrayBuffer()) });
  }

  downloadBlob(zipName, createZip(entries));
}
