'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download } from 'lucide-react';
import { cn } from '@adysre/ui';
import { MIME, download, toSvgForSelection } from '@/lib/design-playground/export';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { getNodesDataUrl } from '../canvas/stage-registry';

/**
 * Export what is selected, rather than the whole page.
 *
 * The raster path asks the live renderer for exactly the selected shapes, so a
 * neighbour that merely overlaps their box is not dragged in; the vector path
 * re-emits the chosen subtrees at their absolute positions. Both crop to the
 * selection's own bounds, which is the only reading of "export this" that
 * matches what the user has highlighted.
 */

type SelectionFormat = 'png' | 'jpeg' | 'svg';

const FORMATS: SelectionFormat[] = ['png', 'jpeg', 'svg'];

/** Raster multipliers. 2x is the default because screens outlived 1x. */
const SCALES = [1, 2, 3] as const;

/** Turn a node name into something safe for a file system. */
function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'selection'
  );
}

export function ExportSelection() {
  const t = useTranslations('designPlayground');
  const [scale, setScale] = useState<(typeof SCALES)[number]>(2);
  const [error, setError] = useState<string | null>(null);

  const doc = useDesignDocumentStore((s) => s.document);
  const pageId = useDesignDocumentStore((s) => s.pageId);
  const selection = useDesignDocumentStore((s) => s.selection);
  const page = doc.pages.find((p) => p.id === pageId) ?? doc.pages[0];

  async function run(format: SelectionFormat): Promise<void> {
    if (!page || selection.length === 0) return;
    setError(null);

    const first = selection[0] ? doc.nodes[selection[0]] : undefined;
    const base =
      selection.length === 1 && first ? slug(first.name) : `${slug(doc.name)}-selection`;
    const name = `${base}.${format === 'jpeg' ? 'jpg' : format}`;

    try {
      if (format === 'svg') {
        const svg = toSvgForSelection(doc, page, selection);
        if (!svg) throw new Error('empty');
        download(svg, name, MIME.svg);
        return;
      }

      const dataUrl = getNodesDataUrl(selection, { mimeType: MIME[format], pixelRatio: scale });
      if (!dataUrl) throw new Error('empty');
      download(await (await fetch(dataUrl)).blob(), name, MIME[format]);
    } catch {
      // Same rule as the page exporter: a failure must say so rather than look
      // like a no-op, because nothing was written to disk.
      setError(t('export.failed'));
    }
  }

  if (selection.length === 0) {
    return <p className="text-xs leading-relaxed text-muted-foreground">{t('export.selectFirst')}</p>;
  }

  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <span aria-hidden className="text-[11px] font-medium text-muted-foreground">
          {t('export.scale')}
        </span>
        <div
          role="group"
          aria-label={t('export.scale')}
          className="flex items-center gap-0.5 rounded-md border border-border p-0.5"
        >
          {SCALES.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={scale === option}
              onClick={() => setScale(option)}
              className={cn(
                'h-6 flex-1 rounded text-[11px] font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                scale === option
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {option}×
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {FORMATS.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => void run(format)}
            // The scale only applies to raster output; SVG says so by omission
            // rather than by disabling a control the user just set.
            title={t('export.exportAs', { format: format.toUpperCase() })}
            className="flex h-7 items-center justify-center gap-1 rounded-md border border-border text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="h-3 w-3" aria-hidden />
            {format.toUpperCase()}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-[11px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
