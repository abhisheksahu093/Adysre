'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@adysre/ui';
import { AVAILABLE_EDITOR_PANELS, EDITOR_LAYOUT } from '@/config/design-playground';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useDesignPlaygroundStore } from '@/stores/design-playground-store';
import { AiPanel } from './panels/ai-panel';
import { AssetsPanel } from './panels/assets-panel';
import { ComponentsPanel } from './panels/components-panel';
import { ImagesPanel } from './panels/images-panel';
import { LayersPanel } from './panels/layers-panel';
import { PagesPanel } from './panels/pages-panel';
import { SectionsPanel } from './panels/sections-panel';

/**
 * The left rail: an icon column that switches the open panel, plus the panel
 * body beside it.
 *
 * Panels come from `config/design-playground.ts`. Until a panel's module lands
 * its body states what will live there rather than faking content - a shell
 * that lies about being finished is worse than one that says what it is.
 *
 * Narrow viewports do not get a narrower panel, they get a different one: below
 * `EDITOR_LAYOUT.panelDock` the body floats over the canvas as a sheet with a
 * backdrop, because a 16rem column carved out of a phone leaves nothing to draw
 * on. The rail's icon column is the same at every width - it is how a panel gets
 * opened, so it can never be the thing that disappears.
 */
export function EditorRail() {
  const t = useTranslations('designPlayground');
  const tCommon = useTranslations('common');
  const panel = useDesignPlaygroundStore((s) => s.panel);
  const togglePanel = useDesignPlaygroundStore((s) => s.togglePanel);
  const closePanel = useDesignPlaygroundStore((s) => s.closePanel);
  const setInspectorOpen = useDesignPlaygroundStore((s) => s.setInspectorOpen);

  // `undefined` until the browser answers, so the server and the first paint
  // render the docked layout and only a real narrow viewport flips to a sheet.
  const docked = useMediaQuery(`(min-width: ${EDITOR_LAYOUT.panelDock}px)`);
  const floating = docked === false;

  // The open panel persists across sessions, so a phone would otherwise load
  // straight into a sheet covering the canvas - work the user never asked for.
  // Entering the floating layout collapses the rail; reopening is one tap.
  useEffect(() => {
    if (floating) closePanel();
  }, [floating, closePanel]);

  // A hidden panel can still be the persisted choice from an earlier session,
  // so resolve against the available list: it closes instead of reopening.
  const open = AVAILABLE_EDITOR_PANELS.find((p) => p.id === panel) ?? null;

  return (
    <div className="flex min-h-0 shrink-0">
      <nav
        aria-label={t('railLabel')}
        // Above the sheet and its backdrop: the rail is how panels are switched,
        // so a tap on another icon must move straight to that panel rather than
        // being eaten by the backdrop and only dismissing the one on screen.
        className="relative z-40 flex w-12 shrink-0 flex-col items-center gap-0.5 overflow-y-auto border-r border-border bg-card py-2"
      >
        {AVAILABLE_EDITOR_PANELS.map(({ id, icon: Icon }) => {
          const active = panel === id;
          const label = t(`panels.${id}.title`);
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                togglePanel(id);
                // Two sheets do not fit over one phone-width canvas, and the
                // inspector's own backdrop would sit on top of this panel.
                if (floating) setInspectorOpen(false);
              }}
              aria-pressed={active}
              title={label}
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{label}</span>
            </button>
          );
        })}
      </nav>

      {open && floating && (
        // Tapping away closes the sheet, the gesture every drawer teaches. It is
        // only rendered in the floating layout, so a docked panel never sits
        // behind an invisible click-eater.
        <button
          type="button"
          aria-label={t('actions.closePanel')}
          onClick={closePanel}
          className="absolute inset-0 z-20 cursor-default bg-foreground/30 backdrop-blur-[1px]"
        />
      )}

      {open && (
        <aside
          aria-label={t(`panels.${open.id}.title`)}
          className={cn(
            'flex w-64 min-w-0 flex-col overflow-y-auto border-r border-border bg-card p-3',
            floating && 'absolute inset-y-0 left-12 z-30 max-w-[calc(100%-3rem)] shadow-xl',
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`panels.${open.id}.title`)}
            </h2>
            <div className="flex shrink-0 items-center gap-1">
              {!open.ready && (
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {tCommon('comingSoon')}
                </span>
              )}
              {/* A sheet needs its own way out; a docked column does not - the
                  rail icon that opened it is still on screen and toggles it. */}
              {floating && (
                <button
                  type="button"
                  onClick={closePanel}
                  aria-label={t('actions.closePanel')}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          </div>
          <div className="mt-2">
            {/* Implemented panels render themselves; the rest still describe what
                will live there. */}
            {open.id === 'layers' ? (
              <LayersPanel />
            ) : open.id === 'pages' ? (
              <PagesPanel />
            ) : open.id === 'ai' ? (
              <AiPanel />
            ) : open.id === 'assets' ? (
              <AssetsPanel />
            ) : open.id === 'components' ? (
              <ComponentsPanel />
            ) : open.id === 'sections' ? (
              <SectionsPanel />
            ) : open.id === 'images' ? (
              <ImagesPanel />
            ) : (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(`panels.${open.id}.description`)}
              </p>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
