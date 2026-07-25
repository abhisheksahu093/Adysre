'use client';

import { Input, Label, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { canvasToBlob, drawToCanvas, loadImage } from '../engine/image';
import { segmentForeground } from '../engine/segment';
import { withExtension } from '../engine/format';
import type { FaceBox } from '../engine/face-detect';

type BackgroundMode = 'transparent' | 'white' | 'black' | 'color' | 'gradient';

interface BgSettings {
  background: BackgroundMode;
  color: string;
  color2: string;
  feather: number; // 0..100
  autoCrop: boolean;
}

export const backgroundRemoverDefaults: Record<string, unknown> = {
  background: 'transparent',
  color: '#3b82f6',
  color2: '#ec4899',
  feather: 40,
  autoCrop: false,
};

/** Paint the chosen background onto a context sized w×h. */
function fillBackground(ctx: CanvasRenderingContext2D, s: BgSettings, w: number, h: number): void {
  if (s.background === 'transparent') return;
  if (s.background === 'gradient') {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, s.color);
    g.addColorStop(1, s.color2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = s.background === 'white' ? '#ffffff' : s.background === 'black' ? '#000000' : s.color;
  }
  ctx.fillRect(0, 0, w, h);
}

/** Bounding box of pixels above the alpha threshold, for auto crop. */
function foregroundBounds(alpha: Float32Array, w: number, h: number): FaceBox | null {
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  let found = false;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (alpha[y * w + x]! > 0.5) {
        found = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return null;
  const pad = Math.round(Math.max(w, h) * 0.02);
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  return { x, y, width: Math.min(w, maxX + pad) - x, height: Math.min(h, maxY + pad) - y };
}

export async function backgroundRemoverProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as BgSettings;
  const { bitmap } = await loadImage(ctx.item.file);
  try {
    const source = drawToCanvas(bitmap, { rotation: ctx.item.rotation });
    const w = source.width;
    const h = source.height;
    ctx.onProgress(0.25);

    const mask = await segmentForeground(source, w, h);
    ctx.onProgress(0.7);

    // Turn the soft confidence mask into an alpha channel with a feather band.
    const band = Math.max(0.02, (s.feather / 100) * 0.5);
    const image = source.getContext('2d')!.getImageData(0, 0, w, h);
    const alpha = new Float32Array(w * h);
    for (let i = 0; i < alpha.length; i++) {
      const a = Math.min(1, Math.max(0, (mask[i]! - (0.5 - band)) / (2 * band)));
      alpha[i] = a;
      image.data[i * 4 + 3] = Math.round(a * 255);
    }

    // Composite foreground over the chosen background.
    const cutout = document.createElement('canvas');
    cutout.width = w;
    cutout.height = h;
    cutout.getContext('2d')!.putImageData(image, 0, 0);

    const bounds = s.autoCrop ? foregroundBounds(alpha, w, h) : null;
    const outW = bounds ? bounds.width : w;
    const outH = bounds ? bounds.height : h;
    const out = document.createElement('canvas');
    out.width = outW;
    out.height = outH;
    const octx = out.getContext('2d')!;
    fillBackground(octx, s, outW, outH);
    if (bounds) octx.drawImage(cutout, bounds.x, bounds.y, outW, outH, 0, 0, outW, outH);
    else octx.drawImage(cutout, 0, 0);
    ctx.onProgress(0.9);

    const blob = await canvasToBlob(out, 'image/png');
    ctx.onProgress(1);
    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: outW,
      height: outH,
      filename: withExtension(ctx.item.name, 'png'),
      mime: 'image/png',
    };
  } finally {
    bitmap.close();
  }
}

const MODES: BackgroundMode[] = ['transparent', 'white', 'black', 'color', 'gradient'];

export function BackgroundRemoverPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const s = settings as unknown as BgSettings;
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Background</Label>
        <div className="grid grid-cols-3 gap-1">
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ background: mode })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                s.background === mode
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {(s.background === 'color' || s.background === 'gradient') && (
        <div className="flex items-center gap-2">
          <input type="color" value={s.color} onChange={(e) => onChange({ color: e.target.value })} aria-label="Color" className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background" />
          <Input value={s.color} onChange={(e) => onChange({ color: e.target.value })} className="font-mono" />
          {s.background === 'gradient' && (
            <input type="color" value={s.color2} onChange={(e) => onChange({ color2: e.target.value })} aria-label="Second color" className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background" />
          )}
        </div>
      )}

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Feather (edge softness)</Label>
          <span className="text-xs tabular-nums text-muted-foreground">{s.feather}%</span>
        </div>
        <input type="range" min={0} max={100} value={s.feather} onChange={(e) => onChange({ feather: Number(e.target.value) })} className="w-full accent-primary" />
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={s.autoCrop}
        onClick={() => onChange({ autoCrop: !s.autoCrop })}
        className="flex w-full items-center justify-between"
      >
        <span className="text-sm text-muted-foreground">Auto crop to subject</span>
        <span className={cn('relative h-5 w-9 rounded-full transition-colors', s.autoCrop ? 'bg-primary' : 'bg-muted')}>
          <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', s.autoCrop ? 'left-0.5 translate-x-4' : 'left-0.5')} />
        </span>
      </button>
    </div>
  );
}
