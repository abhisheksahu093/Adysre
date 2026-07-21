'use client';

import { useTranslations } from 'next-intl';
import { Grid2x2, Maximize2, Minus, Plus } from 'lucide-react';
import { cn } from '@adysre/ui';
import { useDesignPlaygroundStore } from '@/stores/design-playground-store';

/**
 * The bar under the canvas: pointer coordinates, grid toggle and zoom.
 *
 * Coordinates are passed in rather than read from a store because they change
 * on every pointer move - routing them through global state would re-render the
 * whole editor at pointer frequency.
 */
export function EditorStatusBar({
  pointer,
  label,
  onFit,
}: {
  pointer: { x: number; y: number } | null;
  label: string;
  onFit: () => void;
}) {
  const t = useTranslations('designPlayground');
  const zoom = useDesignPlaygroundStore((s) => s.zoom);
  const stepZoom = useDesignPlaygroundStore((s) => s.stepZoom);
  const resetZoom = useDesignPlaygroundStore((s) => s.resetZoom);
  const gridVisible = useDesignPlaygroundStore((s) => s.gridVisible);
  const toggleGrid = useDesignPlaygroundStore((s) => s.toggleGrid);

  return (
    <div className="flex h-8 shrink-0 items-center gap-3 border-t border-border bg-card px-3 text-xs text-muted-foreground">
      <span className="tabular-nums" aria-label={label}>
        {pointer ? `${Math.round(pointer.x)}, ${Math.round(pointer.y)}` : '—'}
      </span>

      <button
        type="button"
        onClick={toggleGrid}
        aria-pressed={gridVisible}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          gridVisible ? 'text-foreground' : 'hover:text-foreground',
        )}
      >
        <Grid2x2 className="h-3.5 w-3.5" />
        {t('status.grid')}
      </button>

      <div className="ml-auto flex items-center gap-0.5">
        <button
          type="button"
          onClick={onFit}
          title={t('actions.zoomToFit')}
          aria-keyshortcuts="Shift+1"
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="sr-only">{t('actions.zoomToFit')}</span>
        </button>
        <button
          type="button"
          onClick={() => stepZoom(-1)}
          aria-label={t('actions.zoomOut')}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={resetZoom}
          title={t('actions.resetZoom')}
          className="min-w-14 rounded-md px-1.5 py-0.5 text-center tabular-nums transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => stepZoom(1)}
          aria-label={t('actions.zoomIn')}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
