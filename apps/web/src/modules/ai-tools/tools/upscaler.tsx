'use client';

import { Label, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { canvasToBlob, drawToCanvas, loadImage } from '../engine/image';
import { convolve3x3, sharpenKernel } from '../engine/filters';
import { FORMAT_BY_ID, withExtension } from '../engine/format';
import { safeFormatId } from './run';

/**
 * Upscaler. Enlarges 2x / 4x / 8x with high-quality stepwise resampling: each
 * step doubles with high-quality interpolation (smoother than one big jump),
 * then an unsharp pass restores edge detail. Fast and fully offline; no model.
 * (Neural super-resolution is a heavier future option.)
 */

interface UpscalerSettings {
  scale: number; // 2 | 4 | 8
  sharpen: number; // 0..100
}

export const upscalerDefaults: Record<string, unknown> = { scale: 2, sharpen: 30 };

const SCALES = [2, 4, 8];

function resizeCanvas(source: HTMLCanvasElement, width: number, height: number): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = width;
  out.height = height;
  const ctx = out.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return out;
}

export async function upscalerProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as UpscalerSettings;
  const scale = SCALES.includes(s.scale) ? s.scale : 2;
  const { bitmap } = await loadImage(ctx.item.file);
  try {
    let canvas = drawToCanvas(bitmap, { rotation: ctx.item.rotation });
    const targetW = canvas.width * scale;
    const targetH = canvas.height * scale;

    // Double repeatedly (gentler than a single large jump), then land exactly.
    let factor = 1;
    while (factor * 2 <= scale) {
      canvas = resizeCanvas(canvas, canvas.width * 2, canvas.height * 2);
      factor *= 2;
      ctx.onProgress(0.2 + 0.5 * (Math.log2(factor) / Math.log2(scale)));
    }
    if (canvas.width !== targetW) canvas = resizeCanvas(canvas, targetW, targetH);
    ctx.onProgress(0.8);

    // Unsharp mask to recover the crispness enlargement softens.
    if (s.sharpen > 0) {
      const context = canvas.getContext('2d')!;
      const data = context.getImageData(0, 0, canvas.width, canvas.height);
      context.putImageData(convolve3x3(data, sharpenKernel((s.sharpen / 100) * 0.8)), 0, 0);
    }
    ctx.onProgress(0.95);

    const format = FORMAT_BY_ID[safeFormatId(ctx.item.mime)]!;
    const blob = await canvasToBlob(canvas, format.mime, 0.95);
    ctx.onProgress(1);
    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: canvas.width,
      height: canvas.height,
      filename: withExtension(ctx.item.name, format.ext),
      mime: format.mime,
    };
  } finally {
    bitmap.close();
  }
}

export function UpscalerPanel({
  settings,
  onChange,
  selected,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
  selected: { width: number; height: number } | null;
}) {
  const s = settings as unknown as UpscalerSettings;
  const scale = SCALES.includes(s.scale) ? s.scale : 2;
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Scale</Label>
        <div className="grid grid-cols-3 gap-1">
          {SCALES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ scale: value })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                scale === value
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {value}×
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Detail (sharpen)</Label>
          <span className="text-xs tabular-nums text-muted-foreground">{s.sharpen}%</span>
        </div>
        <input type="range" min={0} max={100} value={s.sharpen} onChange={(e) => onChange({ sharpen: Number(e.target.value) })} className="w-full accent-primary" />
      </div>
      {selected && selected.width > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.width}×{selected.height} → {selected.width * scale}×{selected.height * scale} px
        </p>
      )}
    </div>
  );
}
