'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, FolderOpen } from 'lucide-react';
import { cn } from '@adysre/ui';
import {
  MIME,
  download,
  fileName,
  toHtml,
  toJson,
  toSvg,
  type ExportFormat,
} from '@/lib/design-playground/export';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { getStageDataUrl } from './canvas/stage-registry';

/** Formats offered, in menu order. */
const FORMATS: ExportFormat[] = ['png', 'jpeg', 'svg', 'html', 'json'];

/**
 * The Export button and its menu.
 *
 * Raster formats are asked of the live stage (only the renderer knows what is
 * actually painted); vector, code and data formats are generated from the
 * document, so they are independent of zoom and scroll.
 */
export function ExportMenu() {
  const t = useTranslations('designPlayground');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const importDocument = useDesignDocumentStore((s) => s.importDocument);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doc = useDesignDocumentStore((s) => s.document);
  const pageId = useDesignDocumentStore((s) => s.pageId);
  const page = doc.pages.find((p) => p.id === pageId) ?? doc.pages[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent): void => {
      if (!menuRef.current?.contains(event.target as globalThis.Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function run(format: ExportFormat): Promise<void> {
    if (!page) return;
    setBusy(format);
    setError(null);
    try {
      const name = fileName(doc.name, page.name, format);

      if (format === 'png' || format === 'jpeg') {
        // 2x so an exported bitmap holds up on a retina screen or in print.
        const dataUrl = getStageDataUrl({ mimeType: MIME[format], pixelRatio: 2 });
        if (!dataUrl) throw new Error('stage-unavailable');
        const blob = await (await fetch(dataUrl)).blob();
        download(blob, name, MIME[format]);
      } else {
        const content =
          format === 'svg' ? toSvg(doc, page) : format === 'html' ? toHtml(doc, page) : toJson(doc);
        download(content, name, MIME[format]);
      }
      setOpen(false);
    } catch {
      // A tainted canvas or a blocked download must say so rather than look
      // like a no-op - the user needs to know nothing was written.
      setError(t('export.failed'));
    } finally {
      setBusy(null);
    }
  }

  async function openFile(file: File): Promise<void> {
    setError(null);
    const ok = importDocument(await file.text());
    // A file that fails to parse leaves the open document untouched, so the
    // only thing to do is say so - never half-load someone's work.
    if (!ok) setError(t('export.importFailed'));
    else setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-label={t('export.import')}
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset the input so re-picking the same file still fires a change.
          event.target.value = '';
          if (file) void openFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        title={t('actions.export')}
        className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Download className="h-4 w-4" />
        <span className="hidden lg:inline">{t('actions.export')}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('actions.export')}
          className="absolute right-0 top-9 z-50 min-w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          {FORMATS.map((format) => (
            <button
              key={format}
              type="button"
              role="menuitem"
              disabled={busy !== null}
              onClick={() => void run(format)}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                'text-muted-foreground hover:bg-muted hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <span>{t(`export.formats.${format}`)}</span>
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                {busy === format ? t('export.working') : format}
              </span>
            </button>
          ))}

          <div className="my-1 h-px bg-border" aria-hidden />
          <button
            type="button"
            role="menuitem"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors',
              'text-muted-foreground hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            )}
          >
            <FolderOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {t('export.import')}
          </button>

          {error && (
            <p role="alert" className="px-2 py-1.5 text-[11px] text-danger">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
