'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, RotateCw, Redo2, Undo2, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from 'adysre';
import { useMediaStore } from '../store/use-media-store';
import { downloadResult } from '../engine/download';
import { humanSize, percentSaved } from '../engine/format';
import type { MediaItem } from '../types';

function ToolButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/**
 * The preview. For image tools it is a draggable before/after slider with zoom,
 * rotate and undo/redo, plus size stats. For readers (text output) it shows the
 * source alongside the decoded text with a copy button.
 */
export function CompareView({ item }: { item: MediaItem }) {
  const rotate = useMediaStore((s) => s.rotate);
  const undo = useMediaStore((s) => s.undo);
  const redo = useMediaStore((s) => s.redo);
  const zoom = useMediaStore((s) => s.zoom);
  const setZoom = useMediaStore((s) => s.setZoom);

  const [pos, setPos] = useState(50);
  const [copied, setCopied] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const result = item.result;
  const isText = Boolean(result?.text);

  useEffect(() => setPos(50), [item.id, result?.url]);

  const move = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => dragging.current && move(e.clientX);
    const onUp = () => (dragging.current = false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [move]);

  const copy = () => {
    if (!result?.text) return;
    void navigator.clipboard?.writeText(result.text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-2">
        {!isText && (
          <>
            <ToolButton label="Rotate 90°" onClick={() => rotate(item.id, 90)}>
              <RotateCw className="h-4 w-4" aria-hidden />
            </ToolButton>
            <ToolButton label="Undo" onClick={() => undo(item.id)} disabled={item.historyIndex <= 0}>
              <Undo2 className="h-4 w-4" aria-hidden />
            </ToolButton>
            <ToolButton label="Redo" onClick={() => redo(item.id)} disabled={item.historyIndex >= item.history.length - 1}>
              <Redo2 className="h-4 w-4" aria-hidden />
            </ToolButton>
            <div className="mx-1 h-5 w-px bg-border" aria-hidden />
            <ToolButton label="Zoom out" onClick={() => setZoom(zoom - 0.25)}>
              <ZoomOut className="h-4 w-4" aria-hidden />
            </ToolButton>
            <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <ToolButton label="Zoom in" onClick={() => setZoom(zoom + 0.25)}>
              <ZoomIn className="h-4 w-4" aria-hidden />
            </ToolButton>
          </>
        )}
        <div className="ml-auto flex items-center gap-1">
          {isText && result && (
            <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
          {result && (
            <button
              type="button"
              onClick={() => downloadResult(item)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              Download
            </button>
          )}
        </div>
      </div>

      {isText && result ? (
        <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2">
          <div className="grid place-items-center rounded-lg border border-border bg-muted/20 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.srcUrl} alt="" className="max-h-[50vh] max-w-full object-contain" />
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Decoded</p>
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground">{result.text}</pre>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 overflow-auto bg-[repeating-conic-gradient(#0000_0deg_90deg,rgba(255,255,255,0.04)_90deg_180deg)] [background-size:20px_20px]">
          <div className="grid min-h-full place-items-center p-4">
            <div ref={frameRef} className="relative max-w-full select-none" style={{ transform: `scale(${zoom})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result ? result.url : item.srcUrl} alt="" className="block max-h-[60vh] max-w-full object-contain" draggable={false} />
              {result && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.srcUrl}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 block h-full w-full object-contain"
                    style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                  />
                  <div
                    className="absolute inset-y-0 z-10 w-0.5 cursor-ew-resize bg-primary"
                    style={{ left: `${pos}%` }}
                    onPointerDown={() => (dragging.current = true)}
                  >
                    <span className="absolute top-1/2 -left-3 -translate-y-1/2 rounded-full bg-primary px-1 py-2 text-[9px] text-primary-foreground">||</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-1 border-t border-border px-3 py-2 text-xs text-muted-foreground">
        <span>Original: {humanSize(item.size)}{item.width > 0 ? ` · ${item.width}×${item.height}` : ''}</span>
        {result && !isText && (
          <>
            <span>Output: {humanSize(result.size)} · {result.width}×{result.height}</span>
            <span className={cn('font-semibold', result.size < item.size ? 'text-success' : 'text-muted-foreground')}>
              {result.size < item.size ? `${percentSaved(item.size, result.size)}% smaller` : `${percentSaved(result.size, item.size)}% larger`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
