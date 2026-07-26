import type { Project } from '../types';
import { createId } from '../utils/files';

/**
 * Client-side sharing: a whole project is compressed into the URL hash, so a
 * link is self-contained and never touches a server (nothing to store, nothing
 * to leak). Opening a link forks the project into a fresh local copy; the
 * `readOnly` flag rides along so a "view" link can lock editing.
 */

const HASH_KEY = 'studio';

interface SharePayload {
  name: string;
  entry?: string;
  readOnly?: boolean;
  files: { path: string; content: string }[];
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '==='.slice((padded.length + 3) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deflate(text: string): Promise<Uint8Array> {
  const stream = new Blob([new TextEncoder().encode(text) as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function inflate(bytes: Uint8Array): Promise<string> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(stream).text();
}

/** Build a shareable absolute URL for the given project. */
export async function createShareUrl(project: Project, options: { readOnly: boolean }): Promise<string> {
  const payload: SharePayload = {
    name: project.name,
    ...(project.entry ? { entry: project.entry } : {}),
    ...(options.readOnly ? { readOnly: true } : {}),
    files: project.files.map((file) => ({ path: file.path, content: file.content })),
  };
  const encoded = toBase64Url(await deflate(JSON.stringify(payload)));
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#${HASH_KEY}=${encoded}`;
}

/** Read a shared payload from the current URL hash, if present. */
export function readShareHash(): string | null {
  const hash = window.location.hash.replace(/^#/, '');
  for (const part of hash.split('&')) {
    const [key, value] = part.split('=');
    if (key === HASH_KEY && value) return value;
  }
  return null;
}

export function clearShareHash(): void {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

/** Decode a shared payload into a fresh, forked project. */
export async function decodeSharedProject(
  encoded: string,
): Promise<{ project: Project; readOnly: boolean } | null> {
  try {
    const json = await inflate(fromBase64Url(encoded));
    const payload = JSON.parse(json) as SharePayload;
    if (!Array.isArray(payload.files) || payload.files.length === 0) return null;
    const now = Date.now();
    const project: Project = {
      id: createId('proj'),
      name: payload.name || 'Shared project',
      files: payload.files.map((file) => ({ id: createId(), path: file.path, content: file.content })),
      ...(payload.entry ? { entry: payload.entry } : {}),
      createdAt: now,
      updatedAt: now,
    };
    return { project, readOnly: Boolean(payload.readOnly) };
  } catch {
    return null;
  }
}
