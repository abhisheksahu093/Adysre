'use client';

import { Label, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { canvasToBlob, drawToCanvas, loadImage } from '../engine/image';
import { detectFaces, type FaceBox } from '../engine/face-detect';
import { FORMAT_BY_ID, withExtension } from '../engine/format';
import { safeFormatId } from './run';

interface FaceBlurSettings {
  strength: number; // 10..60, as a fraction of face size
  shape: 'oval' | 'rect';
}

export const faceBlurDefaults: Record<string, unknown> = { strength: 35, shape: 'oval' };

/**
 * Detected faces are cached per (item, rotation) so live preview stays smooth:
 * dragging the strength or switching the shape re-blurs the same boxes instead
 * of re-running detection (the expensive step) on every change. The image and
 * its rotation fully determine detection, so the key is exact; the map is small
 * (one entry per opened image) and lives for the session.
 */
const detectionCache = new Map<string, FaceBox[]>();

/** Blur each detected face region on the canvas, padded so there is no halo. */
function blurFaces(canvas: HTMLCanvasElement, faces: FaceBox[], strength: number, shape: 'oval' | 'rect'): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  for (const face of faces) {
    const radius = Math.max(4, Math.round(Math.max(face.width, face.height) * strength));
    const pad = Math.ceil(radius);
    const rx = Math.max(0, Math.floor(face.x - pad));
    const ry = Math.max(0, Math.floor(face.y - pad));
    const rw = Math.min(canvas.width - rx, Math.ceil(face.width + pad * 2));
    const rh = Math.min(canvas.height - ry, Math.ceil(face.height + pad * 2));
    if (rw <= 0 || rh <= 0) continue;

    // Blur a padded region in a scratch canvas so the blur has surrounding
    // context, then paint only the face back.
    const scratch = document.createElement('canvas');
    scratch.width = rw;
    scratch.height = rh;
    const sctx = scratch.getContext('2d');
    if (!sctx) continue;
    sctx.filter = `blur(${radius}px)`;
    sctx.drawImage(canvas, rx, ry, rw, rh, 0, 0, rw, rh);

    const dx = face.x;
    const dy = face.y;
    const dw = face.width;
    const dh = face.height;
    ctx.save();
    if (shape === 'oval') {
      ctx.beginPath();
      ctx.ellipse(dx + dw / 2, dy + dh / 2, dw / 2, dh / 2, 0, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(scratch, dx - rx, dy - ry, dw, dh, dx, dy, dw, dh);
    ctx.restore();
  }
}

export async function faceBlurProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as FaceBlurSettings;
  const { bitmap } = await loadImage(ctx.item.file);
  try {
    const canvas = drawToCanvas(bitmap, { rotation: ctx.item.rotation });
    ctx.onProgress(0.3);
    const cacheKey = `${ctx.item.id}:${ctx.item.rotation}`;
    let faces = detectionCache.get(cacheKey);
    if (!faces) {
      faces = await detectFaces(canvas);
      detectionCache.set(cacheKey, faces);
    }
    ctx.onProgress(0.7);
    if (faces.length === 0) throw new Error('No faces detected in this image');
    blurFaces(canvas, faces, s.strength / 100, s.shape);
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

export function FaceBlurPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const s = settings as unknown as FaceBlurSettings;
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label>Blur strength</Label>
          <span className="text-xs tabular-nums text-muted-foreground">{s.strength}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={60}
          value={s.strength}
          onChange={(e) => onChange({ strength: Number(e.target.value) })}
          className="w-full accent-primary"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Shape</Label>
        <div className="grid grid-cols-2 gap-1">
          {(['oval', 'rect'] as const).map((shape) => (
            <button
              key={shape}
              type="button"
              onClick={() => onChange({ shape })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                s.shape === shape
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Faces are detected on-device and blurred automatically.</p>
    </div>
  );
}
