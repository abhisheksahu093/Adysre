'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { FRAME_PRESETS, FRAME_PRESET_GROUPS } from '@/config/design-playground';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { useDesignPlaygroundStore } from '@/stores/design-playground-store';

/**
 * Frame presets, as a tab of the right sidebar.
 *
 * These used to live only in the canvas's empty state, which meant the sizes
 * vanished the moment the page had anything on it - exactly when you want to
 * add a second artboard. As a tab they are always reachable, and the empty
 * state can point here instead of duplicating the list.
 *
 * New frames are placed to the RIGHT of everything already on the page rather
 * than at the origin, so adding a second artboard never lands on top of the
 * first.
 */

/** Gap between artboards, in canvas pixels. */
const FRAME_GUTTER = 120;

export function FramesPanel() {
  const t = useTranslations('designPlayground');
  const doc = useDesignDocumentStore((s) => s.document);
  const pageId = useDesignDocumentStore((s) => s.pageId);
  const createNodeAt = useDesignDocumentStore((s) => s.createNodeAt);
  const setTool = useDesignPlaygroundStore((s) => s.setTool);

  const page = doc.pages.find((p) => p.id === pageId) ?? doc.pages[0];

  function addFrame(width: number, height: number): void {
    if (!page) return;
    const roots = (doc.nodes[page.rootId]?.children ?? [])
      .map((id) => doc.nodes[id])
      .filter((node) => node !== undefined);

    const x = roots.length
      ? Math.max(...roots.map((node) => node.transform.x + node.transform.width)) + FRAME_GUTTER
      : 0;

    createNodeAt('frame', { x, y: 0, width, height, rotation: 0 });
    // Placing is a one-shot action; leave the pointer armed so the new frame can
    // be moved straight away.
    setTool('select');
  }

  return (
    <div className="grid gap-3 p-3">
      <p className="text-xs leading-relaxed text-muted-foreground">{t('frames.description')}</p>

      {FRAME_PRESET_GROUPS.map((groupId) => (
        <div key={groupId}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {t(`frameGroups.${groupId}`)}
          </h3>
          <ul className="mt-1.5 grid gap-1">
            {FRAME_PRESETS.filter((preset) => preset.groupId === groupId).map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  onClick={() => addFrame(preset.width, preset.height)}
                  className="group flex w-full items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="truncate">{t(`frames.${preset.id}`)}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-[11px] tabular-nums text-muted-foreground">
                    {preset.width}×{preset.height}
                    <Plus className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
