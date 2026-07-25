'use client';

import { Label, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { extractPageText, getPdfDocument, isPdf, renderPageToCanvas } from '../engine/pdf';
import { TEXT_EXPORT_FORMATS } from '../engine/text-export';
import { textResult } from './run';

/**
 * Optical character recognition, fully on-device.
 *
 * Images and PDFs are supported. Tesseract runs as WebAssembly in a worker; the
 * engine and the English model are vendored under `public/models/tesseract`, so
 * recognition works offline and the file never leaves the browser. For PDFs the
 * embedded text of each page is used directly when present (digital documents),
 * and pages without text (scans) are rasterized with pdf.js and recognized. The
 * heavy libraries are dynamic-imported so their weight only loads on use.
 */

const BASE = '/models/tesseract';

/** A page needs at least this many embedded characters to skip rasterized OCR. */
const DIGITAL_TEXT_MIN = 16;
/** Rasterization scale for scanned pages (~2x for legible recognition). */
const RASTER_SCALE = 2;

export const ocrDefaults: Record<string, unknown> = { exportFormat: 'txt' };

interface TesseractProgress {
  status: string;
  progress: number;
}

async function createOcrWorker(onProgress?: (fraction: number) => void) {
  const { createWorker } = await import('tesseract.js');
  return createWorker('eng', 1, {
    workerPath: `${BASE}/worker.min.js`,
    corePath: BASE,
    langPath: BASE,
    logger: (m: TesseractProgress) => {
      if (m.status === 'recognizing text') onProgress?.(m.progress);
    },
  });
}

function tidy(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

/** Recognize a single image file. */
async function ocrImage(ctx: ProcessContext): Promise<ToolResult> {
  ctx.onProgress(0.03);
  const worker = await createOcrWorker((p) => ctx.onProgress(0.15 + p * 0.8));
  try {
    const { data } = await worker.recognize(ctx.item.file);
    const text = tidy(data.text ?? '');
    if (!text) throw new Error('No readable text was found in this image');
    ctx.onProgress(1);
    return textResult(ctx.item, text);
  } finally {
    await worker.terminate();
  }
}

/**
 * Recognize a PDF: embedded page text when available, otherwise rasterize the
 * page and OCR it. The Tesseract worker is created lazily, only if a page needs
 * it, and reused across pages.
 */
async function ocrPdf(ctx: ProcessContext): Promise<ToolResult> {
  ctx.onProgress(0.03);
  const doc = await getPdfDocument(ctx.item.file);
  let worker: Awaited<ReturnType<typeof createOcrWorker>> | null = null;
  const pages: string[] = [];

  try {
    for (let i = 1; i <= doc.numPages; i += 1) {
      ctx.onProgress(0.05 + 0.9 * ((i - 1) / doc.numPages));
      const page = await doc.getPage(i);
      try {
        const embedded = await extractPageText(page);
        let text = embedded;
        if (embedded.length < DIGITAL_TEXT_MIN) {
          worker ??= await createOcrWorker();
          const canvas = await renderPageToCanvas(page, RASTER_SCALE);
          const { data } = await worker.recognize(canvas);
          text = (data.text ?? '').trim();
        }
        if (text) pages.push(text);
      } finally {
        page.cleanup();
      }
    }
  } finally {
    if (worker) await worker.terminate();
    await doc.destroy();
  }

  const combined = tidy(pages.join('\n\n'));
  if (!combined) throw new Error('No readable text was found in this PDF');
  ctx.onProgress(1);
  return textResult(ctx.item, combined);
}

export async function ocrProcess(ctx: ProcessContext): Promise<ToolResult> {
  return isPdf(ctx.item.file) ? ocrPdf(ctx) : ocrImage(ctx);
}

export function OcrPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const format = typeof settings.exportFormat === 'string' ? settings.exportFormat : 'txt';
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Export as</Label>
        <div className="grid grid-cols-2 gap-1">
          {TEXT_EXPORT_FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange({ exportFormat: f.id })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                format === f.id
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Images and PDFs are supported. Digital PDF text is read directly; scanned pages are recognized on-device.
      </p>
    </div>
  );
}
