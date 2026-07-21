'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, PanelRight, Redo2, Share2, Undo2 } from 'lucide-react';
import { cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { EDITOR_BREAKPOINTS, EDITOR_TOOLS } from '@/config/design-playground';
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
 */
export function EditorToolbar() {
  const t = useTranslations('designPlayground');
  const tCommon = useTranslations('common');

  const tool = useDesignPlaygroundStore((s) => s.tool);
  const setTool = useDesignPlaygroundStore((s) => s.setTool);
  const breakpoint = useDesignPlaygroundStore((s) => s.breakpoint);
  const setBreakpoint = useDesignPlaygroundStore((s) => s.setBreakpoint);
  const inspectorOpen = useDesignPlaygroundStore((s) => s.inspectorOpen);
  const toggleInspector = useDesignPlaygroundStore((s) => s.toggleInspector);

  // Subscribing to the history itself (not to canUndo()) is what re-renders the
  // buttons when a command lands - a selector over a function would never
  // change identity.
  const history = useDesignDocumentStore((s) => s.history);
  const undo = useDesignDocumentStore((s) => s.undo);
  const redo = useDesignDocumentStore((s) => s.redo);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-2">
      <Link
        href="/components"
        aria-label={t('backToApp')}
        title={t('backToApp')}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <div className="hidden min-w-0 items-center gap-2 sm:flex">
        <ProjectsMenu />
        <SaveStatus />
      </div>

      {/* Tool group - centred on wide viewports, inline on narrow ones. */}
      <div
        role="toolbar"
        aria-label={t('toolbarLabel')}
        className="mx-auto flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5"
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
                'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
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

      <label className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
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

      <div className="ml-auto flex items-center gap-0.5">
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
        <div className="mx-1 h-5 w-px bg-border" aria-hidden />
        <ToolbarAction icon={Share2} label={t('actions.share')} hint={tCommon('comingSoon')} />
        <ExportMenu />
        <button
          type="button"
          onClick={toggleInspector}
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
    </header>
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
