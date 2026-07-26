'use client';

import type { ProcessContext, ToolResult } from '../types';
import { BARCODE_FORMATS, detectCodes } from '../engine/scan';
import { textResult } from './run';

export const barcodeReaderDefaults: Record<string, unknown> = {};

export async function barcodeReaderProcess(ctx: ProcessContext): Promise<ToolResult> {
  ctx.onProgress(0.2);
  const codes = await detectCodes(ctx.item.file, BARCODE_FORMATS);
  ctx.onProgress(0.8);
  if (codes.length === 0) throw new Error('No barcode found in this image');
  const text = codes
    .map((c) => `Format: ${c.format.toUpperCase().replace(/_/g, ' ')}\nValue: ${c.rawValue}`)
    .join('\n\n');
  ctx.onProgress(1);
  return textResult(ctx.item, text);
}
