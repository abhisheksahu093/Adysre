'use client';

import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useTranslations } from 'next-intl';
import { ImagePlus, Loader2, Trash2, TriangleAlert } from 'lucide-react';
import { cn } from 'adysre';
import { box, type TemplateSpec } from '@/lib/design-playground/templates';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_LIBRARY_BYTES,
  useDesignAssetsStore,
  type AssetImportFailure,
  type DesignAsset,
} from '@/stores/design-assets-store';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * The images panel: the uploaded image library, and the way images get onto the
 * canvas.
 *
 * The panel is deliberately thin. Reading, downscaling, budgeting and persisting
 * all live in `design-assets-store`, so this file only decides what the user
 * SEES: a drop target, a grid, and an honest account of what happened to each
 * file. An import that silently drops a photo is the failure mode to avoid -
 * every rejection is named, with the file name attached.
 *
 * Placement goes through `insertTemplate`, like every other panel that puts
 * something on the canvas. The panel never builds a `Node`.
 */

/** Long-edge cap for a placed image, in canvas pixels. A 4000px photo dropped at
 *  its natural size lands mostly off-screen and reads as a bug. */
const MAX_PLACED_EDGE = 640;

export function ImagesPanel() {
  const t = useTranslations('designPlayground');
  const inputId = useId();

  const assets = useDesignAssetsStore((s) => s.assets);
  const storageFailed = useDesignAssetsStore((s) => s.storageFailed);
  const importFiles = useDesignAssetsStore((s) => s.importFiles);
  const remove = useDesignAssetsStore((s) => s.remove);
  const insertTemplate = useDesignDocumentStore((s) => s.insertTemplate);

  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [failures, setFailures] = useState<{ name: string; reason: AssetImportFailure }[]>([]);
  // Depth counter, not a boolean: dragging over a child element fires `dragleave`
  // on the parent, which would otherwise flicker the highlight off mid-drag.
  const dragDepth = useRef(0);

  const usedBytes = assets.reduce((total, asset) => total + asset.bytes, 0);
  const usedPercent = Math.min(100, Math.round((usedBytes / MAX_LIBRARY_BYTES) * 100));

  const runImport = async (files: readonly File[]): Promise<void> => {
    if (files.length === 0) return;
    setImporting(true);
    setFailures([]);
    // `importFiles` swallows its own errors and reports them as failure codes,
    // so there is no rejection path that can leave the spinner stuck on.
    const result = await importFiles(files);
    setFailures(result.failures);
    setImporting(false);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    void runImport(Array.from(event.target.files ?? []));
    // Reset so re-picking the same file still fires `change`.
    event.target.value = '';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    void runImport(Array.from(event.dataTransfer.files));
  };

  const place = (asset: DesignAsset): void => {
    const { width, height } = placedSize(asset);
    const spec: TemplateSpec = {
      type: 'image',
      name: asset.name,
      transform: box(width, height),
      // `cover` matches the canvas renderer's default crop, so what the thumbnail
      // implies is what the node draws.
      image: { src: asset.src, alt: asset.name, fit: 'cover' },
    };
    // No drop point: the panel cannot see the workspace's pan offset (it is local
    // state there), so the node lands at the page origin - and selected, so the
    // very next drag moves it.
    insertTemplate(spec);
  };

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragging(false);
      }}
      onDrop={onDrop}
      className={cn(
        'flex min-h-0 flex-col gap-2 rounded-md',
        dragging && 'ring-2 ring-ring ring-offset-2 ring-offset-card',
      )}
    >
      {/* A real label wired to a real file input: the button IS the input's
          label, so it is focusable, announced and works without JavaScript. */}
      <label
        htmlFor={inputId}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-1 rounded-md border border-dashed border-border px-3 py-4 text-center',
          'text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground',
          'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring',
          dragging && 'border-primary/60 bg-primary/10 text-primary',
        )}
      >
        {importing ? (
          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus aria-hidden className="h-4 w-4" />
        )}
        <span className="font-medium text-foreground">
          {importing ? t('panels.images.importing') : t('panels.images.upload')}
        </span>
        <span className="leading-relaxed">{t('panels.images.uploadHint')}</span>
        <input
          id={inputId}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={onInputChange}
          disabled={importing}
          className="sr-only"
        />
      </label>

      {/* Failures are listed per file, because "3 images failed" leaves the user
          guessing which ones and why. `role="status"` so it is announced. */}
      {failures.length > 0 && (
        <ul
          role="status"
          className="space-y-1 rounded-md border border-danger/40 bg-danger/10 p-2 text-[11px] leading-relaxed text-danger"
        >
          {failures.map((failure) => (
            <li key={`${failure.name}-${failure.reason}`} className="flex items-start gap-1.5">
              <TriangleAlert aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="min-w-0">
                <span className="font-medium">{failure.name}</span>{' '}
                {t(`panels.images.errors.${failure.reason}`)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {storageFailed && (
        <p
          role="status"
          className="rounded-md border border-border bg-muted p-2 text-[11px] leading-relaxed text-muted-foreground"
        >
          {t('panels.images.storageFailed')}
        </p>
      )}

      {assets.length === 0 ? (
        <p className="rounded-md border border-dashed border-border p-3 text-center text-xs leading-relaxed text-muted-foreground">
          {t('panels.images.empty')}
        </p>
      ) : (
        <>
          <div role="list" className="grid grid-cols-3 gap-1.5">
            {assets.map((asset) => (
              <div key={asset.id} role="listitem" className="group relative">
                <button
                  type="button"
                  onClick={() => place(asset)}
                  title={asset.name}
                  className={cn(
                    'block aspect-square w-full overflow-hidden rounded-md border border-border bg-muted',
                    'transition-colors hover:border-primary/60',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  {/* Plain <img>: the source is a data URL the user just made, so
                      there is nothing for the image optimiser to optimise. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.src}
                    alt={asset.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="sr-only">{t('panels.images.place')}</span>
                </button>

                {/* Kept in the DOM (not hover-only rendering) so keyboard users
                    can tab to it; it only fades in visually. */}
                <button
                  type="button"
                  onClick={() => remove(asset.id)}
                  title={t('panels.images.remove')}
                  className={cn(
                    'absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded',
                    'bg-card/90 text-muted-foreground hover:text-foreground',
                    'opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <Trash2 aria-hidden className="h-3 w-3" />
                  <span className="sr-only">
                    {t('panels.images.removeNamed', { name: asset.name })}
                  </span>
                </button>

                <p className="mt-1 truncate text-[10px] text-muted-foreground" title={asset.name}>
                  {asset.name}
                </p>
              </div>
            ))}
          </div>

          {/* The library's budget is not obvious from a grid of thumbnails, so it
              is stated before the user hits the cap rather than after. */}
          <p className="text-[10px] text-muted-foreground">
            {t('panels.images.usage', {
              used: formatBytes(usedBytes),
              total: formatBytes(MAX_LIBRARY_BYTES),
              percent: usedPercent,
            })}
          </p>
        </>
      )}
    </div>
  );
}

/** Canvas size for a placed asset: its own aspect ratio, capped on the long edge. */
function placedSize(asset: DesignAsset): { width: number; height: number } {
  const longEdge = Math.max(asset.width, asset.height);
  if (longEdge === 0) return { width: MAX_PLACED_EDGE, height: MAX_PLACED_EDGE };
  const scale = Math.min(1, MAX_PLACED_EDGE / longEdge);
  return {
    width: Math.max(1, Math.round(asset.width * scale)),
    height: Math.max(1, Math.round(asset.height * scale)),
  };
}

/** Compact byte size. Not localised units: KB/MB read the same in every locale. */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
