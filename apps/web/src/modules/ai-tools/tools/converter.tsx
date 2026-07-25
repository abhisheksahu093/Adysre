'use client';

import { useEffect, useState } from 'react';
import { Label, cn } from 'adysre';
import type { ProcessContext, ToolResult } from '../types';
import { canEncode } from '../engine/image';
import { IMAGE_FORMATS } from '../engine/format';
import { renderImageResult } from './run';

interface ConverterSettings {
  format: string; // png | jpeg | webp | avif
  quality: number; // 1..100 for lossy
}

export const converterDefaults: Record<string, unknown> = { format: 'webp', quality: 85 };

export async function converterProcess(ctx: ProcessContext): Promise<ToolResult> {
  const s = ctx.settings as unknown as ConverterSettings;
  ctx.onProgress(0.25);
  const result = await renderImageResult(ctx.item, { formatId: s.format, quality: s.quality / 100 });
  ctx.onProgress(1);
  return result;
}

export function ConverterPanel({
  settings,
  onChange,
}: {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  const s = settings as unknown as ConverterSettings;
  const [avifOk, setAvifOk] = useState(true);

  // AVIF encoding is browser-dependent; hide it when unsupported so a chosen
  // format always produces a file.
  useEffect(() => {
    let alive = true;
    void canEncode('image/avif').then((ok) => alive && setAvifOk(ok));
    return () => {
      alive = false;
    };
  }, []);

  const formats = IMAGE_FORMATS.filter((f) => f.id !== 'avif' || avifOk);
  const lossy = s.format !== 'png';

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Convert to</Label>
        <div className="grid grid-cols-2 gap-1">
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange({ format: f.id })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                s.format === f.id
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {lossy && (
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
      {!avifOk && <p className="text-xs text-muted-foreground">AVIF export is unavailable in this browser.</p>}
    </div>
  );
}
