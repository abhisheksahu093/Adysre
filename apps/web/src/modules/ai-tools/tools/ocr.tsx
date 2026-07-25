'use client';

import type { ProcessContext, ToolResult } from '../types';
import { textResult } from './run';

/**
 * Optical character recognition, fully on-device.
 *
 * Tesseract runs as WebAssembly in a worker; the engine and the English model
 * are vendored under `public/models/tesseract`, so recognition works offline and
 * the image never leaves the browser. The library is dynamic-imported so its
 * weight only loads when OCR is actually used.
 */

const BASE = '/models/tesseract';

export const ocrDefaults: Record<string, unknown> = {};

interface TesseractProgress {
  status: string;
  progress: number;
}

export async function ocrProcess(ctx: ProcessContext): Promise<ToolResult> {
  ctx.onProgress(0.03);
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng', 1, {
    workerPath: `${BASE}/worker.min.js`,
    corePath: BASE,
    langPath: BASE,
    logger: (m: TesseractProgress) => {
      if (m.status === 'recognizing text') ctx.onProgress(0.15 + m.progress * 0.8);
    },
  });

  try {
    const { data } = await worker.recognize(ctx.item.file);
    const text = (data.text ?? '').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) throw new Error('No readable text was found in this image');
    ctx.onProgress(1);
    return textResult(ctx.item, text);
  } finally {
    await worker.terminate();
  }
}
