import { createZip, downloadBlob, type ZipEntry } from '@/lib/zip';
import type { Project } from '../types';

/**
 * Export a project as a .zip: every source file at its path, plus a
 * `studio.manifest.json` describing the project. Reuses the app's dependency-free
 * ZIP writer so no library is pulled in.
 */
export function downloadProjectZip(project: Project): void {
  const manifest = {
    name: project.name,
    generator: 'ADYSRE Code Studio',
    exportedAt: new Date().toISOString(),
    entry: project.entry ?? null,
    files: project.files.map((file) => file.path),
  };

  const entries: ZipEntry[] = [
    ...project.files.map((file) => ({ path: file.path, content: file.content })),
    { path: 'studio.manifest.json', content: JSON.stringify(manifest, null, 2) },
  ];

  const safeName = project.name.trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '') || 'project';
  downloadBlob(`${safeName}.zip`, createZip(entries));
}
