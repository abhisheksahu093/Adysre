'use client';

import { Label, Select, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { renderImageResult, safeFormatId } from './run';

const LEVEL_QUALITY: Record<string, number> = { low: 0.4, medium: 0.6, high: 0.82 };

interface CompressorSettings {
  format: string; // 'source' | 'png' | 'jpeg' | 'webp'
  level: string; // 'low' | 'medium' | 'high' | 'custom'
  quality: number; // 1..100, used when level === 'custom'
}

export const compressorDefaults: Record<string, unknown> = { format: 'source', level: 'medium', quality: 70 };

export async function compressorProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as CompressorSettings;
  const formatId = s.format === 'source' ? safeFormatId(ctx.item.mime) : s.format;
  const quality = s.level === 'custom' ? Math.min(1, Math.max(0.05, s.quality / 100)) : LEVEL_QUALITY[s.level] ?? 0.6;
  ctx.onProgress(0.25);
  const result = await renderImageResult(ctx.item, { formatId, quality });
  ctx.onProgress(1);
  return result;
}

const LEVELS = ['low', 'medium', 'high', 'custom'];

export function CompressorPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const s = settings as unknown as CompressorSettings;
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Output format</Label>
        <Select value={s.format} onChange={(e) => onChange({ format: e.target.value })}>
          <option value="source">Same as source</option>
          <option value="png">PNG</option>
          <option value="jpeg">JPG</option>
          <option value="webp">WEBP</option>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Compression</Label>
        <div className="grid grid-cols-4 gap-1">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange({ level })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors',
                s.level === level
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {s.level === 'custom' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Quality</Label>
            <span className="text-xs tabular-nums text-muted-foreground">{s.quality}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            value={s.quality}
            onChange={(e) => onChange({ quality: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>
      )}
      <p className="text-xs text-muted-foreground">Ignored for PNG (lossless). Lower quality means smaller files.</p>
    </div>
  );
}
