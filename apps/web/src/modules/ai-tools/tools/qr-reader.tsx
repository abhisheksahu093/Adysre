'use client';

import type { ProcessContext, ToolResult } from '../types';
import { QR_FORMATS, detectCodes } from '../engine/scan';
import { parseQrPayload, payloadToText } from '../engine/qr-parse';
import { textResult } from './run';

export const qrReaderDefaults: Record<string, unknown> = {};

export async function qrReaderProcess(ctx: ProcessContext): Promise<ToolResult> {
  ctx.onProgress(0.2);
  const codes = await detectCodes(ctx.item.file, QR_FORMATS);
  ctx.onProgress(0.8);
  if (codes.length === 0) throw new Error('No QR code found in this image');
  const text = codes.map((c) => payloadToText(parseQrPayload(c.rawValue))).join('\n\n');
  ctx.onProgress(1);
  return textResult(ctx.item, text);
}
