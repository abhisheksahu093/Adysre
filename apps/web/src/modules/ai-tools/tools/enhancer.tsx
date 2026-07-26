'use client';

import { Label } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { canvasToBlob, drawToCanvas, loadImage } from '../engine/image';
import { convolve3x3, denoise, sharpenKernel } from '../engine/filters';
import { FORMAT_BY_ID, withExtension } from '../engine/format';
import { safeFormatId } from './run';

interface EnhancerSettings {
  brightness: number; // -100..100
  contrast: number; // -100..100
  saturation: number; // -100..100
  sharpen: number; // 0..100
  denoise: number; // 0..100
}

export const enhancerDefaults: Record<string, unknown> = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  sharpen: 0,
  denoise: 0,
};

export async function enhancerProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as EnhancerSettings;
  const { bitmap } = await loadImage(ctx.item.file);
  try {
    // Rotation + full-resolution base.
    const base = drawToCanvas(bitmap, { rotation: ctx.item.rotation });
    ctx.onProgress(0.3);

    // Brightness / contrast / saturation via the cheap native filter.
    const out = document.createElement('canvas');
    out.width = base.width;
    out.height = base.height;
    const octx = out.getContext('2d');
    if (!octx) throw new Error('Canvas 2D context unavailable');
    octx.filter = `brightness(${1 + s.brightness / 100}) contrast(${1 + s.contrast / 100}) saturate(${1 + s.saturation / 100})`;
    octx.drawImage(base, 0, 0);
    octx.filter = 'none';
    ctx.onProgress(0.5);

    // Sharpen / denoise (per-pixel) only when requested.
    if (s.sharpen > 0 || s.denoise > 0) {
      let data = octx.getImageData(0, 0, out.width, out.height);
      if (s.denoise > 0) data = denoise(data, s.denoise / 100);
      if (s.sharpen > 0) data = convolve3x3(data, sharpenKernel(s.sharpen / 100));
      octx.putImageData(data, 0, 0);
    }
    ctx.onProgress(0.85);

    const format = FORMAT_BY_ID[safeFormatId(ctx.item.mime)]!;
    const blob = await canvasToBlob(out, format.mime, 0.95);
    ctx.onProgress(1);
    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: out.width,
      height: out.height,
      filename: withExtension(ctx.item.name, format.ext),
      mime: format.mime,
    };
  } finally {
    bitmap.close();
  }
}

const SLIDERS: { key: keyof EnhancerSettings; label: string; min: number; max: number }[] = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'sharpen', label: 'Sharpen', min: 0, max: 100 },
  { key: 'denoise', label: 'Denoise', min: 0, max: 100 },
];

export function EnhancerPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const s = settings as unknown as EnhancerSettings;
  return (
    <div className="space-y-3">
      {SLIDERS.map(({ key, label, min, max }) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>{label}</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{s[key]}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={s[key]}
            onChange={(e) => onChange({ [key]: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      ))}
    </div>
  );
}
