'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@adysre/ui';
import { EDITOR_PANELS } from '@/config/design-playground';
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
 */
export function EditorRail() {
  const t = useTranslations('designPlayground');
  const tCommon = useTranslations('common');
  const panel = useDesignPlaygroundStore((s) => s.panel);
  const togglePanel = useDesignPlaygroundStore((s) => s.togglePanel);

  const open = EDITOR_PANELS.find((p) => p.id === panel) ?? null;

  return (
    <div className="flex min-h-0 shrink-0">
      <nav
        aria-label={t('railLabel')}
        className="flex w-12 shrink-0 flex-col items-center gap-0.5 border-r border-border bg-card py-2"
      >
        {EDITOR_PANELS.map(({ id, icon: Icon }) => {
          const active = panel === id;
          const label = t(`panels.${id}.title`);
          return (
            <button
              key={id}
              type="button"
              onClick={() => togglePanel(id)}
              aria-pressed={active}
              title={label}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
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

      {open && (
        <aside
          aria-label={t(`panels.${open.id}.title`)}
          className="hidden w-64 min-w-0 flex-col overflow-y-auto border-r border-border bg-card p-3 md:flex"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`panels.${open.id}.title`)}
            </h2>
            {!open.ready && (
              <span className="shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {tCommon('comingSoon')}
              </span>
            )}
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
