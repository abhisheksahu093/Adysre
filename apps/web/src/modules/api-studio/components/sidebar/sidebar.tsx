'use client';

import { useTranslations, useLocale } from 'next-intl';
import { FolderPlus, Search, Star, Trash2 } from 'lucide-react';
import { Input, cn } from 'adysre';
import type { ApiCollection, ApiEnvironment, ApiTreeNode, HistoryEntry, SidebarPanel } from '../../types';
import { SIDEBAR_PANELS } from '../../types';
import { METHOD_TONES } from '../../constants/http';
import { formatDuration } from '../../utils/format';
import { PaneTabs } from '../pane-tabs';
import { TonePill } from '../tone';
import { CollectionTree } from './collection-tree';

/**
 * The left rail: collections, history and environments.
 *
 * One panel at a time rather than three stacked accordions, because all three
 * are lists that want the full height and a user works in one of them at a
 * time. The active panel is layout state, so it persists.
 */
export function Sidebar({
  panel,
  onPanel,
  query,
  onQuery,
  collections,
  treeOf,
  expanded,
  selectedId,
  onToggle,
  onOpenNode,
  onFavoriteNode,
  onDeleteNode,
  onNewRequest,
  onNewFolder,
  onNewCollection,
  history,
  onRestore,
  onClearHistory,
  environments,
  activeEnvironmentId,
  onSelectEnvironment,
}: {
  panel: SidebarPanel;
  onPanel: (panel: SidebarPanel) => void;
  query: string;
  onQuery: (query: string) => void;
  collections: ApiCollection[];
  treeOf: (collectionId: string) => ApiTreeNode[];
  expanded: Record<string, boolean>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onOpenNode: (nodeId: string) => void;
  onFavoriteNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onNewRequest: (collectionId: string, parentId: string | null) => void;
  onNewFolder: (collectionId: string) => void;
  onNewCollection: () => void;
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
  environments: ApiEnvironment[];
  activeEnvironmentId: string | null;
  onSelectEnvironment: (id: string | null) => void;
}) {
  const t = useTranslations('apiStudio');
  const locale = useLocale();

  return (
    <div className="flex h-full min-h-0 flex-col border-e border-border bg-card/40">
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <PaneTabs
          tabs={SIDEBAR_PANELS.map((id) => ({ id, label: t(`sidebar.${id}`) }))}
          active={panel}
          onSelect={onPanel}
          label={t('sidebar.paneLabel')}
          className="flex-1"
        />
        {panel === 'collections' && (
          <button
            type="button"
            onClick={onNewCollection}
            aria-label={t('sidebar.newCollection')}
            title={t('sidebar.newCollection')}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FolderPlus className="h-4 w-4" aria-hidden />
          </button>
        )}
        {panel === 'history' && history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            aria-label={t('history.clear')}
            title={t('history.clear')}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {panel !== 'environments' && (
        <div className="relative px-2 py-2">
          <Search
            className="pointer-events-none absolute start-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={t('sidebar.searchPlaceholder')}
            aria-label={t('sidebar.search')}
            className="h-8 ps-8 text-xs"
          />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {panel === 'collections' && (
          <CollectionTree
            collections={collections}
            treeOf={treeOf}
            expanded={expanded}
            selectedId={selectedId}
            onToggle={onToggle}
            onOpen={onOpenNode}
            onFavorite={onFavoriteNode}
            onDelete={onDeleteNode}
            onNewRequest={onNewRequest}
            onNewFolder={onNewFolder}
          />
        )}

        {panel === 'history' && (
          <ul className="divide-y divide-border">
            {history.length === 0 && (
              <li className="px-3 py-6 text-center text-xs text-muted-foreground">{t('history.empty')}</li>
            )}
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onRestore(entry)}
                  className="flex w-full items-start gap-2 px-2 py-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <TonePill tone={METHOD_TONES[entry.method]} className="mt-px w-12 justify-center">
                    {entry.method.slice(0, 4)}
                  </TonePill>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs">{entry.url}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className={cn(entry.status === null && 'text-danger')}>
                        {entry.status ?? t(`errors.${entry.errorCode ?? 'network'}`)}
                      </span>
                      <span>{formatDuration(entry.durationMs, locale)}</span>
                      {entry.favorite && <Star className="h-3 w-3 fill-warning text-warning" aria-hidden />}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {panel === 'environments' && (
          <ul className="p-2 space-y-1">
            <li>
              <EnvironmentRow
                label={t('environment.none')}
                active={activeEnvironmentId === null}
                onSelect={() => onSelectEnvironment(null)}
                detail={t('environment.noneHint')}
              />
            </li>
            {environments.map((environment) => (
              <li key={environment.id}>
                <EnvironmentRow
                  label={environment.name}
                  active={environment.id === activeEnvironmentId}
                  onSelect={() => onSelectEnvironment(environment.id)}
                  detail={t('environment.variableCount', { count: environment.variables.length })}
                />
              </li>
            ))}
            {environments.length === 0 && (
              <li className="px-1 py-4 text-center text-xs text-muted-foreground">
                {t('environment.empty')}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

function EnvironmentRow({
  label,
  detail,
  active,
  onSelect,
}: {
  label: string;
  detail: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        'flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active ? 'bg-primary/10 text-primary' : 'hover:bg-muted',
      )}
    >
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[11px] text-muted-foreground">{detail}</span>
    </button>
  );
}
