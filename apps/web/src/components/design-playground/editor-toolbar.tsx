'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, PanelRight, Redo2, Share2, Undo2 } from 'lucide-react';
import { cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import {
  EDITOR_BREAKPOINTS,
  EDITOR_LAYOUT,
  EDITOR_TOOLS,
} from '@/config/design-playground';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { useDesignPlaygroundStore } from '@/stores/design-playground-store';
import { ExportMenu } from './export-menu';
import { ProjectsMenu } from './projects-menu';
import { SaveStatus } from './save-status';

/**
 * The editor's top bar: a way out, the tool group, the breakpoint being
 * designed, and the (Phase 3) share/export actions.
 *
 * Tools and breakpoints are rendered from `config/design-playground.ts` - a new
 * tool is an entry there, never a button added here. Tools whose engine has not
 * landed render disabled rather than absent, so the shape of the finished editor
 * is legible while it is being built.
 *
 * Below `EDITOR_LAYOUT.toolbarSingleRow` the row cannot hold everything, so the
 * context controls (project, save state, breakpoint) move to a second row rather
 * than being dropped - they used to be `hidden sm:flex`, which left a phone with
 * no way to switch project or breakpoint at all. `EditorContext` is rendered in
 * exactly one of the two rows, never both.
 */
export function EditorToolbar() {
  const t = useTranslations('designPlayground');
  const tCommon = useTranslations('common');

  const tool = useDesignPlaygroundStore((s) => s.tool);
  const setTool = useDesignPlaygroundStore((s) => s.setTool);

  const singleRow = useMediaQuery(`(min-width: ${EDITOR_LAYOUT.toolbarSingleRow}px)`);
  const stacked = singleRow === false;

  return (
    <header className="shrink-0 border-b border-border bg-card">
      <div className="flex h-12 items-center gap-1 px-1.5 sm:gap-2 sm:px-2">
        <Link
          href="/components"
          aria-label={t('backToApp')}
          title={t('backToApp')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {!stacked && (
          <div className="flex min-w-0 items-center gap-2">
            <EditorContext />
          </div>
        )}

        {/* Tool group - centred once there is room for it to be centred. Narrow,
            it takes the leftover width and scrolls, so a seventh tool can never
            push the undo and export buttons off the edge of a phone. */}
        <div
          role="toolbar"
          aria-label={t('toolbarLabel')}
          className={cn(
            'flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto rounded-lg border border-border bg-background p-0.5',
            'md:mx-auto md:flex-none md:overflow-x-visible',
          )}
        >
          {EDITOR_TOOLS.map(({ id, icon: Icon, shortcut, ready }) => {
            const active = tool === id;
            const label = t(`tools.${id}`);
            return (
              <button
                key={id}
                type="button"
                disabled={!ready}
                aria-pressed={active}
                aria-keyshortcuts={shortcut}
                title={ready ? `${label} (${shortcut})` : `${label} - ${tCommon('comingSoon')}`}
                onClick={() => setTool(id)}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-40',
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
        </div>

        <ToolbarActions />
      </div>

      {stacked && (
        <div className="flex h-10 items-center gap-2 border-t border-border px-2">
          <EditorContext />
        </div>
      )}
    </header>
  );
}

/**
 * What is being edited: the project, whether it is saved, and the breakpoint.
 *
 * Its own component so the toolbar can place it in either row without two
 * instances of the same controls existing at once.
 */
function EditorContext() {
  const t = useTranslations('designPlayground');
  const breakpoint = useDesignPlaygroundStore((s) => s.breakpoint);
  const setBreakpoint = useDesignPlaygroundStore((s) => s.setBreakpoint);

  return (
    <>
      <ProjectsMenu />
      <SaveStatus />
      <label className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground md:ml-0">
        <span className="sr-only sm:not-sr-only">{t('breakpointLabel')}</span>
        <select
          value={breakpoint}
          onChange={(event) => setBreakpoint(event.target.value)}
          className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {EDITOR_BREAKPOINTS.map((bp) => (
            <option key={bp.id} value={bp.id}>
              {t(`breakpoints.${bp.id}`)}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

/**
 * The right-hand action cluster: history, share, export, inspector.
 *
 * Everything here stays reachable at every width - undo is the one control a
 * touch user needs most, because a fat-fingered drag is easy to make and
 * impossible to take back without it.
 */
function ToolbarActions() {
  const t = useTranslations('designPlayground');
  const tCommon = useTranslations('common');

  const inspectorOpen = useDesignPlaygroundStore((s) => s.inspectorOpen);
  const toggleInspector = useDesignPlaygroundStore((s) => s.toggleInspector);
  const closePanel = useDesignPlaygroundStore((s) => s.closePanel);

  // Only where the rail panel is ALSO a sheet: between the two dock widths the
  // panel is a real column and closing it for an inspector that floats over the
  // canvas would take away something the inspector never covers.
  const panelFloating = useMediaQuery(`(min-width: ${EDITOR_LAYOUT.panelDock}px)`) === false;

  // Subscribing to the history itself (not to canUndo()) is what re-renders the
  // buttons when a command lands - a selector over a function would never
  // change identity.
  const history = useDesignDocumentStore((s) => s.history);
  const undo = useDesignDocumentStore((s) => s.undo);
  const redo = useDesignDocumentStore((s) => s.redo);

  return (
    <div className="ml-auto flex shrink-0 items-center gap-0.5">
      <IconButton
        icon={Undo2}
        label={t('actions.undo')}
        disabled={history.past.length === 0}
        onClick={undo}
      />
      <IconButton
        icon={Redo2}
        label={t('actions.redo')}
        disabled={history.future.length === 0}
        onClick={redo}
      />
      <div className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden />
      {/* Disabled until Phase 3. It is the one control worth spending no width
          on, so a narrow toolbar drops it rather than a working one. */}
      <div className="hidden sm:block">
        <ToolbarAction icon={Share2} label={t('actions.share')} hint={tCommon('comingSoon')} />
      </div>
      <ExportMenu />
      <button
        type="button"
        onClick={() => {
          if (panelFloating && !inspectorOpen) closePanel();
          toggleInspector();
        }}
        aria-pressed={inspectorOpen}
        title={t('actions.toggleInspector')}
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          inspectorOpen
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <PanelRight className="h-4 w-4" />
        <span className="sr-only">{t('actions.toggleInspector')}</span>
      </button>
    </div>
  );
}

/** A square icon action in the top bar. */
function IconButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: typeof Undo2;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

/** A top-bar action that is specified but not yet built (Phase 3). */
function ToolbarAction({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof Share2;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      disabled
      title={`${label} - ${hint}`}
      className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
