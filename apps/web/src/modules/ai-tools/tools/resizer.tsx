'use client';

import { Input, Label, Select, cn } from 'adysre';
import type { FitMode } from '../engine/image';
import type { MediaItem, ProcessContext, ToolResult } from '../types';
import { renderImageResult, safeFormatId } from './run';

interface ResizerSettings {
  mode: 'width' | 'height' | 'percentage';
  width: number;
  height: number;
  percentage: number;
  maintainAspect: boolean;
  fit: FitMode;
}

export const resizerDefaults: Record<string, unknown> = {
  mode: 'width',
  width: 1280,
  height: 720,
  percentage: 50,
  maintainAspect: true,
  fit: 'contain',
};

/** Resolve the output pixel size for an item from the resizer settings. */
export function targetSize(item: MediaItem, s: ResizerSettings): { width: number; height: number } {
  // Rotation swaps the source axes, so measure against the rotated dimensions.
  const swapped = item.rotation === 90 || item.rotation === 270;
  const sw = swapped ? item.height : item.width;
  const sh = swapped ? item.width : item.height;
  const ratio = sw > 0 && sh > 0 ? sw / sh : 1;

  if (s.mode === 'percentage') {
    const scale = Math.max(1, s.percentage) / 100;
    return { width: Math.round(sw * scale), height: Math.round(sh * scale) };
  }
  if (s.mode === 'width') {
    const width = Math.max(1, s.width);
    return { width, height: s.maintainAspect ? Math.round(width / ratio) : Math.max(1, s.height) };
  }
  const height = Math.max(1, s.height);
  return { width: s.maintainAspect ? Math.round(height * ratio) : Math.max(1, s.width), height };
}

export async function resizerProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as ResizerSettings;
  const { width, height } = targetSize(ctx.item, s);
  ctx.onProgress(0.25);
  const result = await renderImageResult(ctx.item, {
    formatId: safeFormatId(ctx.item.mime),
    targetWidth: width,
    targetHeight: height,
    fit: s.maintainAspect ? 'stretch' : s.fit,
  });
  ctx.onProgress(1);
  return result;
}

export function ResizerPanel({
  settings,
  onChange,
  selected,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
  selected: MediaItem | null;
}) {
  const s = settings as unknown as ResizerSettings;
  const preview = selected ? targetSize(selected, s) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Resize by</Label>
        <div className="grid grid-cols-3 gap-1">
          {(['width', 'height', 'percentage'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ mode })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                s.mode === mode
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {s.mode === 'percentage' ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Scale</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{s.percentage}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={300}
            value={s.percentage}
            onChange={(e) => onChange({ percentage: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Width</Label>
            <Input
              type="number"
              min={1}
              value={s.width}
              disabled={s.mode === 'height' && s.maintainAspect}
              onChange={(e) => onChange({ width: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Height</Label>
            <Input
              type="number"
              min={1}
              value={s.height}
              disabled={s.mode === 'width' && s.maintainAspect}
              onChange={(e) => onChange({ height: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={s.maintainAspect}
        onClick={() => onChange({ maintainAspect: !s.maintainAspect })}
        className="flex w-full items-center justify-between"
      >
        <span className="text-sm text-muted-foreground">Maintain aspect ratio</span>
        <span className={cn('relative h-5 w-9 rounded-full transition-colors', s.maintainAspect ? 'bg-primary' : 'bg-muted')}>
          <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', s.maintainAspect ? 'left-0.5 translate-x-4' : 'left-0.5')} />
        </span>
      </button>

      {!s.maintainAspect && (
        <div className="space-y-1.5">
          <Label>Fit</Label>
          <Select value={s.fit} onChange={(e) => onChange({ fit: e.target.value as FitMode })}>
            <option value="contain">Contain (letterbox)</option>
            <option value="cover">Cover (fill and crop)</option>
            <option value="stretch">Stretch</option>
          </Select>
        </div>
      )}

      {preview && (
        <p className="text-xs text-muted-foreground">
          Output: {preview.width} × {preview.height} px
        </p>
      )}
    </div>
  );
}
