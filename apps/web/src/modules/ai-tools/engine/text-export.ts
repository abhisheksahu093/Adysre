/**
 * Export decoded text (OCR, readers) as plain text, JSON, CSV or Word (.docx).
 * Everything is built in the browser from the text already in memory, so no
 * data leaves ADYSRE and no export library is needed.
 */

import { buildDocx } from './docx';

export type TextExportFormat = 'txt' | 'json' | 'csv' | 'docx';

export const TEXT_EXPORT_FORMATS: { id: TextExportFormat; label: string; ext: string }[] = [
  { id: 'txt', label: 'Text (.txt)', ext: 'txt' },
  { id: 'json', label: 'JSON (.json)', ext: 'json' },
  { id: 'csv', label: 'CSV (.csv)', ext: 'csv' },
  { id: 'docx', label: 'Word (.docx)', ext: 'docx' },
];

const EXT_BY_ID = Object.fromEntries(TEXT_EXPORT_FORMATS.map((f) => [f.id, f.ext])) as Record<TextExportFormat, string>;

/** Swap (or add) a filename's extension. */
function withExt(filename: string, ext: string): string {
  const dot = filename.lastIndexOf('.');
  const base = dot === -1 ? filename : filename.slice(0, dot);
  return `${base}.${ext}`;
}

/** Quote a CSV field per RFC 4180 (escape quotes, wrap when needed). */
function csvField(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** True for a value the export UI recognizes; falls back to 'txt' otherwise. */
export function isTextExportFormat(value: unknown): value is TextExportFormat {
  return value === 'txt' || value === 'json' || value === 'csv' || value === 'docx';
}

/** Build a downloadable export of `text` in the chosen format. */
export function buildTextExport(
  text: string,
  sourceFilename: string,
  format: TextExportFormat,
): { blob: Blob; filename: string } {
  const filename = withExt(sourceFilename, EXT_BY_ID[format]);
  const lines = text.split('\n');

  switch (format) {
    case 'json': {
      const payload = {
        source: sourceFilename,
        characters: text.length,
        lineCount: lines.length,
        lines,
        text,
      };
      return { blob: new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), filename };
    }
    case 'csv': {
      const rows = ['line,text', ...lines.map((line, i) => `${i + 1},${csvField(line)}`)];
      return { blob: new Blob([rows.join('\r\n')], { type: 'text/csv' }), filename };
    }
    case 'docx':
      return { blob: buildDocx(text), filename };
    case 'txt':
    default:
      return { blob: new Blob([text], { type: 'text/plain' }), filename };
  }
}
