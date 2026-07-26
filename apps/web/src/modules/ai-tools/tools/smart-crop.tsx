'use client';

import { Label, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { canvasToBlob, drawToCanvas, loadImage } from '../engine/image';
import { foregroundBounds, segmentForeground, type Box } from '../engine/segment';
import { FORMAT_BY_ID, withExtension } from '../engine/format';
import { safeFormatId } from './run';

/** Named aspect presets (width / height). */
const PRESETS: { id: string; label: string; ratio: number }[] = [
  { id: 'square', label: 'Square 1:1', ratio: 1 },
  { id: 'portrait', label: 'Portrait 4:5', ratio: 4 / 5 },
  { id: 'landscape', label: 'Landscape 3:2', ratio: 3 / 2 },
  { id: 'instagram', label: 'Instagram 4:5', ratio: 4 / 5 },
  { id: 'youtube', label: 'YouTube 16:9', ratio: 16 / 9 },
  { id: 'linkedin', label: 'LinkedIn 1.91:1', ratio: 1.91 },
];
const RATIO_BY_ID = Object.fromEntries(PRESETS.map((p) => [p.id, p.ratio]));

interface SmartCropSettings {
  preset: string;
  padding: number; // 0..60, percent of subject size
}

export const smartCropDefaults: Record<string, unknown> = { preset: 'square', padding: 15 };

/**
 * The crop rectangle of aspect `ratio` that contains the padded subject box,
 * centred on the subject and clamped inside the image.
 */
export function computeCrop(subject: Box, imgW: number, imgH: number, ratio: number, padding: number): Box {
  const cx = subject.x + subject.width / 2;
  const cy = subject.y + subject.height / 2;
  const bw = subject.width * (1 + padding * 2);
  const bh = subject.height * (1 + padding * 2);

  let cw = Math.max(bw, bh * ratio);
  let ch = cw / ratio;
  if (cw > imgW) {
    cw = imgW;
    ch = cw / ratio;
  }
  if (ch > imgH) {
    ch = imgH;
    cw = ch * ratio;
  }

  let x = cx - cw / 2;
  let y = cy - ch / 2;
  x = Math.max(0, Math.min(imgW - cw, x));
  y = Math.max(0, Math.min(imgH - ch, y));
  return { x: Math.round(x), y: Math.round(y), width: Math.round(cw), height: Math.round(ch) };
}

export async function smartCropProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as SmartCropSettings;
  const { bitmap } = await loadImage(ctx.item.file);
  try {
    const source = drawToCanvas(bitmap, { rotation: ctx.item.rotation });
    const w = source.width;
    const h = source.height;
    ctx.onProgress(0.3);

    const fg = await segmentForeground(source, w, h);
    ctx.onProgress(0.7);
    // No detected subject: fall back to a centred crop of the whole frame.
    const subject = foregroundBounds(fg, w, h) ?? { x: 0, y: 0, width: w, height: h };
    const ratio = RATIO_BY_ID[s.preset] ?? 1;
    const crop = computeCrop(subject, w, h, ratio, s.padding / 100);

    const out = document.createElement('canvas');
    out.width = crop.width;
    out.height = crop.height;
    out.getContext('2d')!.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    const format = FORMAT_BY_ID[safeFormatId(ctx.item.mime)]!;
    const blob = await canvasToBlob(out, format.mime, 0.95);
    ctx.onProgress(1);
    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: crop.width,
      height: crop.height,
      filename: withExtension(ctx.item.name, format.ext),
      mime: format.mime,
    };
  } finally {
    bitmap.close();
  }
}

export function SmartCropPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const s = settings as unknown as SmartCropSettings;
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Aspect</Label>
        <div className="grid grid-cols-2 gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange({ preset: p.id })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                s.preset === p.id
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Padding around subject</Label>
          <span className="text-xs tabular-nums text-muted-foreground">{s.padding}%</span>
        </div>
        <input type="range" min={0} max={60} value={s.padding} onChange={(e) => onChange({ padding: Number(e.target.value) })} className="w-full accent-primary" />
      </div>
      <p className="text-xs text-muted-foreground">The subject is detected on-device, then framed to the chosen aspect.</p>
    </div>
  );
}
