'use client';

import { useEffect, useRef } from 'react';
import { Loader2, Maximize2, Minimize2, Monitor, RotateCw, Smartphone, Tablet, Laptop } from 'lucide-react';
import { cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import { PREVIEW_VIEWPORTS, type PreviewDevice } from '../types';

const DEVICE_ICON: Record<PreviewDevice, typeof Monitor> = {
  desktop: Monitor,
  laptop: Laptop,
  tablet: Tablet,
  mobile: Smartphone,
};

/**
 * The live preview: a sandboxed iframe fed the compiled `srcdoc`. The iframe has
 * no `allow-same-origin`, so preview code cannot reach the parent window; it
 * talks back only through `postMessage` (the console bridge).
 */
export function PreviewPane({ srcdoc, building, onRebuild }: { srcdoc: string; building: boolean; onRebuild: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const device = useStudioStore((s) => s.device);
  const setDevice = useStudioStore((s) => s.setDevice);
  const fullscreen = useStudioStore((s) => s.previewFullscreen);
  const toggleFullscreen = useStudioStore((s) => s.togglePreviewFullscreen);
  const clearConsole = useStudioStore((s) => s.clearConsole);

  // A fresh document per build: clearing the console keeps it aligned with the
  // run currently on screen rather than accumulating across rebuilds.
  useEffect(() => {
    clearConsole();
  }, [srcdoc, clearConsole]);

  const viewport = PREVIEW_VIEWPORTS.find((v) => v.id === device) ?? PREVIEW_VIEWPORTS[0]!;
  const framed = viewport.width !== null;

  return (
    <div className={cn('flex h-full flex-col bg-background', fullscreen && 'fixed inset-0 z-50')}>
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-border px-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
        <div className="flex items-center gap-0.5">
          {PREVIEW_VIEWPORTS.map((v) => {
            const Icon = DEVICE_ICON[v.id];
            return (
              <button
                key={v.id}
                type="button"
                aria-label={v.id}
                aria-pressed={device === v.id}
                onClick={() => setDevice(v.id)}
                className={cn(
                  'rounded p-1.5 transition-colors',
                  device === v.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          {building && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden />}
          <button
            type="button"
            aria-label="Reload preview"
            onClick={onRebuild}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCw className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen preview'}
            onClick={toggleFullscreen}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" aria-hidden /> : <Maximize2 className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      <div className={cn('relative flex-1 overflow-auto', framed ? 'grid place-items-center bg-muted/20 p-4' : '')}>
        <iframe
          ref={iframeRef}
          title="Live preview"
          sandbox="allow-scripts allow-modals allow-popups allow-forms"
          srcDoc={srcdoc}
          className={cn('border-0 bg-white', framed ? 'rounded-lg shadow-lg' : 'h-full w-full')}
          style={
            framed
              ? { width: `${viewport.width}px`, height: `${viewport.height}px`, maxWidth: '100%', maxHeight: '100%' }
              : undefined
          }
        />
      </div>
    </div>
  );
}
