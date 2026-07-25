import { normalizePath } from '../utils/files';

/**
 * Read a .zip in the browser, no dependency.
 *
 * Parses the central directory, then inflates each entry with the native
 * `DecompressionStream` (stored entries are copied as-is). Pairs with the app's
 * `createZip` writer so a project can round-trip through export and import.
 */

export interface ArchiveEntry {
  path: string;
  content: string;
}

const SIG_EOCD = 0x06054b50;
const SIG_CENTRAL = 0x02014b50;

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function findEocd(view: DataView): number {
  // The EOCD is at the end, after an optional comment; scan backwards for it.
  for (let i = view.byteLength - 22; i >= 0; i--) {
    if (view.getUint32(i, true) === SIG_EOCD) return i;
  }
  return -1;
}

export async function readZip(file: File): Promise<ArchiveEntry[]> {
  const buffer = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(buffer.buffer);
  const eocd = findEocd(view);
  if (eocd === -1) throw new Error('Not a valid ZIP file');

  const total = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  const entries: ArchiveEntry[] = [];

  for (let i = 0; i < total; i++) {
    if (view.getUint32(offset, true) !== SIG_CENTRAL) break;
    const method = view.getUint16(offset + 10, true);
    const compSize = view.getUint32(offset + 20, true);
    const nameLen = view.getUint16(offset + 28, true);
    const extraLen = view.getUint16(offset + 30, true);
    const commentLen = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = decoder.decode(buffer.subarray(offset + 46, offset + 46 + nameLen));
    offset += 46 + nameLen + extraLen + commentLen;

    if (name.endsWith('/')) continue; // directory marker

    // Jump to the local header to find where the file data actually starts.
    const localNameLen = view.getUint16(localOffset + 26, true);
    const localExtraLen = view.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + localNameLen + localExtraLen;
    const raw = buffer.subarray(dataStart, dataStart + compSize);
    const bytes = method === 0 ? raw : await inflateRaw(raw);

    entries.push({ path: normalizePath(name), content: decoder.decode(bytes) });
  }

  return entries;
}

/**
 * Read a directory upload (`<input webkitdirectory>` or a drop) into entries,
 * dropping the top-level folder name so paths start at the project root.
 */
export async function readFileList(files: FileList | File[]): Promise<ArchiveEntry[]> {
  const list = Array.from(files);
  const relative = (file: File) => (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
  const roots = new Set(list.map((f) => relative(f).split('/')[0]));
  const stripRoot = roots.size === 1;

  const entries = await Promise.all(
    list.map(async (file) => {
      const rel = relative(file);
      const path = stripRoot ? rel.split('/').slice(1).join('/') || rel : rel;
      return { path: normalizePath(path), content: await file.text() };
    }),
  );
  return entries.filter((entry) => entry.path);
}
