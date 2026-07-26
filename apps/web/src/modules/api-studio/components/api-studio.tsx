'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, PanelLeftClose, PanelLeftOpen, RefreshCw } from 'lucide-react';
import { Button, Select, cn } from 'adysre';
import type { ApiTab, Assertion, HistoryEntry, RequestDefinition } from '../types';
import { EMPTY_REQUEST } from '../constants/defaults';
import {
  useCollectionsStore,
  useExecutionStore,
  useHistoryStore,
  useLayoutStore,
  useTabsStore,
  useWorkspaceStore,
  type ExecutionEntry,
} from '../stores';
import { apiStudioClient } from '../services/api-client';
import { useBootstrap } from '../hooks/use-bootstrap';
import { useSend } from '../hooks/use-send';
import { Sidebar } from './sidebar/sidebar';
import { TabBar } from './tab-bar';
import { RequestBuilder } from './request/request-builder';
import { ResponseViewer } from './response/response-viewer';

/**
 * ADYSRE API Studio - the shell.
 *
 * Composes the sidebar, tabs, builder and response pane, and owns the three
 * things that span them: boot, the actions that touch both a store and the API,
 * and the global shortcuts.
 *
 * Persistence failing does NOT take the studio down. The runner needs no
 * database, so a scratch request can still be built and sent while a banner
 * explains why the sidebar is empty. That is the difference between a tool that
 * degrades and one that is either perfect or useless.
 */
export function ApiStudio() {
  const t = useTranslations('apiStudio');
  const send = useSend();

  const names = useMemo(
    () => ({ workspace: t('defaults.workspace'), collection: t('defaults.collection') }),
    [t],
  );
  const { ready, error, retry } = useBootstrap(names);

  const collections = useCollectionsStore((s) => s.collections);
  const expanded = useCollectionsStore((s) => s.expanded);
  const selectedNodeId = useCollectionsStore((s) => s.selectedNodeId);
  const query = useCollectionsStore((s) => s.query);

  const tabs = useTabsStore((s) => s.tabs);
  const activeTabId = useTabsStore((s) => s.activeTabId);
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const executions = useExecutionStore((s) => s.byTab);
  const history = useHistoryStore((s) => s.entries);
  const environments = useWorkspaceStore((s) => s.environments);
  const activeEnvironmentId = useWorkspaceStore((s) => s.activeEnvironmentId);

  const layout = useLayoutStore((s) => s.layout);
  const setActivePanel = useLayoutStore((s) => s.setActivePanel);
  const toggleSidebar = useLayoutStore((s) => s.toggleSidebar);
  const setRequestPaneRatio = useLayoutStore((s) => s.setRequestPaneRatio);

  // Subscribing to the node map is what re-renders the tree: the selector below
  // reads through the store's memo, which is keyed on this exact object.
  const nodeMap = useCollectionsStore((s) => s.nodes);
  const treeOf = useCallback(
    (collectionId: string) => {
      void nodeMap;
      return useCollectionsStore.getState().tree(collectionId);
    },
    [nodeMap],
  );

  /** Open a saved request in a tab. */
  const openNode = useCallback((nodeId: string) => {
    const node = useCollectionsStore.getState().requestNode(nodeId);
    if (!node) return;
    useCollectionsStore.getState().setSelected(nodeId);
    useTabsStore.getState().openRequest(node);
  }, []);

  const newScratch = useCallback(() => {
    useTabsStore.getState().openScratch(t('tabs.untitled'));
  }, [t]);

  const createRequest = useCallback(
    async (collectionId: string, parentId: string | null) => {
      const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      if (!workspaceId) return;

      const created = await apiStudioClient.createNode({
        workspaceId,
        collectionId,
        parentId,
        kind: 'request',
        name: t('defaults.request'),
        request: structuredClone(EMPTY_REQUEST),
      });
      if (!created.ok) return;

      useCollectionsStore.getState().upsertNode(created.data);
      if (parentId) useCollectionsStore.getState().setExpanded(parentId, true);
      openNode(created.data.id);
    },
    [openNode, t],
  );

  const createFolder = useCallback(
    async (collectionId: string) => {
      const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      if (!workspaceId) return;
      const created = await apiStudioClient.createNode({
        workspaceId,
        collectionId,
        parentId: null,
        kind: 'folder',
        name: t('defaults.folder'),
      });
      if (created.ok) useCollectionsStore.getState().upsertNode(created.data);
    },
    [t],
  );

  const createCollection = useCallback(async () => {
    const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    if (!workspaceId) return;
    const created = await apiStudioClient.createCollection({
      workspaceId,
      name: t('defaults.collection'),
    });
    if (created.ok) useCollectionsStore.getState().upsertCollection(created.data);
  }, [t]);

  const deleteNode = useCallback(async (nodeId: string) => {
    // Optimistic: the tree is the user's own workspace, and a failed delete
    // restores itself on the next load rather than blocking the interaction.
    useCollectionsStore.getState().removeNode(nodeId);
    await apiStudioClient.deleteNode(nodeId);
  }, []);

  const favoriteNode = useCallback(async (nodeId: string) => {
    useCollectionsStore.getState().toggleFavorite(nodeId);
    const node = useCollectionsStore.getState().nodes[nodeId];
    if (node) await apiStudioClient.updateNode(nodeId, { favorite: node.favorite });
  }, []);

  const saveTab = useCallback(
    async (tab: ApiTab) => {
      if (tab.nodeId) {
        const saved = await apiStudioClient.updateNode(tab.nodeId, { request: tab.draft });
        if (!saved.ok) return;
        useCollectionsStore.getState().upsertNode(saved.data);
        useTabsStore.getState().markSaved(tab.id, tab.nodeId);
        return;
      }

      // A scratch tab saves into the first collection: somewhere real, chosen
      // for the user, rather than a modal in the middle of a debugging session.
      const collection = useCollectionsStore.getState().collections[0];
      const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      if (!collection || !workspaceId) return;

      const created = await apiStudioClient.createNode({
        workspaceId,
        collectionId: collection.id,
        parentId: null,
        kind: 'request',
        name: tab.title,
        request: tab.draft,
      });
      if (!created.ok) return;

      useCollectionsStore.getState().upsertNode(created.data);
      useTabsStore.getState().markSaved(tab.id, created.data.id);
    },
    [],
  );

  const restoreHistory = useCallback(
    (entry: HistoryEntry) => {
      useTabsStore.getState().openScratch(entry.url || t('tabs.untitled'), entry.request);
    },
    [t],
  );

  const clearHistory = useCallback(async () => {
    const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    useHistoryStore.getState().clear();
    if (workspaceId) await apiStudioClient.clearHistory(workspaceId);
  }, []);

  const updateDraft = useCallback((patch: Partial<RequestDefinition>) => {
    const id = useTabsStore.getState().activeTabId;
    if (id) useTabsStore.getState().updateDraft(id, patch);
  }, []);

  const updateAssertions = useCallback((assertions: Assertion[]) => {
    const id = useTabsStore.getState().activeTabId;
    if (id) useTabsStore.getState().setAssertions(id, assertions);
  }, []);

  /** Send, then hand the assertion and script outcomes to the response pane. */
  const sendTab = useCallback(
    async (tab: ApiTab) => {
      const output = await send(tab);
      useExecutionStore.getState().setOutcome(tab.id, output);
    },
    [send],
  );

  // Global shortcuts. Kept to the ones with no in-page equivalent; everything
  // else is a button that is reachable by tab.
  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;
      const key = event.key.toLowerCase();
      const tab = useTabsStore.getState().activeTab();

      if (key === 'enter' && tab) {
        event.preventDefault();
        void sendTab(tab);
      } else if (key === 's' && tab) {
        event.preventDefault();
        void saveTab(tab);
      } else if (key === 't' && !event.shiftKey) {
        event.preventDefault();
        newScratch();
      } else if (key === 't' && event.shiftKey) {
        event.preventDefault();
        useTabsStore.getState().reopenClosed();
      } else if (key === 'b') {
        event.preventDefault();
        useLayoutStore.getState().toggleSidebar();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [newScratch, saveTab, sendTab]);

  // Open something on first load, so the studio is never a blank canvas.
  const bootedTabs = useRef(false);
  useEffect(() => {
    if (!ready || bootedTabs.current) return;
    bootedTabs.current = true;
    if (useTabsStore.getState().tabs.length === 0) newScratch();
  }, [newScratch, ready]);

  const execution = activeTab ? (executions[activeTab.id] ?? IDLE) : IDLE;
  const sending = execution.status === 'sending';

  return (
    <div className="relative -m-4 flex h-[calc(100%+2rem)] flex-col overflow-hidden bg-background text-foreground sm:-m-6 sm:h-[calc(100%+3rem)]">
      <header className="flex shrink-0 items-center gap-2 border-b border-border px-2 py-1.5">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={layout.sidebarCollapsed ? t('sidebar.show') : t('sidebar.hide')}
          aria-expanded={!layout.sidebarCollapsed}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {layout.sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden />
          )}
        </button>

        <h1 className="text-sm font-semibold tracking-tight">{t('title')}</h1>

        <div className="ms-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="environment-select">
            {t('environment.select')}
          </label>
          <Select
            id="environment-select"
            value={activeEnvironmentId ?? ''}
            onChange={(event) =>
              useWorkspaceStore.getState().setActiveEnvironment(event.target.value || null)
            }
            className="h-8 w-auto min-w-36 text-xs"
          >
            <option value="">{t('environment.none')}</option>
            {environments.map((environment) => (
              <option key={environment.id} value={environment.id}>
                {environment.name}
              </option>
            ))}
          </Select>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-2 border-b border-border bg-warning/10 px-3 py-2 text-xs text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          <span className="flex-1">{t('errors.storageUnavailable')}</span>
          <Button variant="ghost" size="sm" onClick={retry} className="h-7 gap-1.5 text-xs">
            <RefreshCw className="h-3 w-3" aria-hidden />
            {t('actions.retry')}
          </Button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        {!layout.sidebarCollapsed && (
          <div className="hidden w-72 shrink-0 md:block">
            <Sidebar
              panel={layout.activePanel}
              onPanel={setActivePanel}
              query={query}
              onQuery={(value) => useCollectionsStore.getState().setQuery(value)}
              collections={collections}
              treeOf={treeOf}
              expanded={expanded}
              selectedId={selectedNodeId}
              onToggle={(id) => useCollectionsStore.getState().toggleExpanded(id)}
              onOpenNode={openNode}
              onFavoriteNode={(id) => void favoriteNode(id)}
              onDeleteNode={(id) => void deleteNode(id)}
              onNewRequest={(collectionId, parentId) => void createRequest(collectionId, parentId)}
              onNewFolder={(collectionId) => void createFolder(collectionId)}
              onNewCollection={() => void createCollection()}
              history={history}
              onRestore={restoreHistory}
              onClearHistory={() => void clearHistory()}
              environments={environments}
              activeEnvironmentId={activeEnvironmentId}
              onSelectEnvironment={(id) => useWorkspaceStore.getState().setActiveEnvironment(id)}
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <TabBar
            tabs={tabs}
            activeId={activeTabId}
            onSelect={(id) => useTabsStore.getState().setActive(id)}
            onClose={(id) => useTabsStore.getState().closeTab(id)}
            onPin={(id, pinned) => useTabsStore.getState().setPinned(id, pinned)}
            onNew={newScratch}
          />

          {activeTab ? (
            <Split
              ratio={layout.requestPaneRatio}
              onRatio={setRequestPaneRatio}
              top={
                <RequestBuilder
                  tab={activeTab}
                  sending={sending}
                  onChange={updateDraft}
                  onSend={() => void sendTab(activeTab)}
                  onCancel={() => useExecutionStore.getState().cancel(activeTab.id)}
                  onSave={() => void saveTab(activeTab)}
                  onAssertions={updateAssertions}
                  canSave={activeTab.dirty || activeTab.nodeId === null}
                />
              }
              bottom={<ResponseViewer entry={execution} />}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t('empty.title')}</p>
                <Button size="sm" onClick={newScratch} className="mt-3">
                  {t('tabs.new')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** What a tab that has never been sent shows. */
const IDLE: ExecutionEntry = {
  status: 'idle',
  startedAt: null,
  finishedAt: null,
  response: null,
  error: null,
  progress: null,
  controller: null,
  tests: null,
  scripts: [],
};

/**
 * The builder/response split.
 *
 * Draggable on wide screens; a plain stack below `lg`, where a 40% tall pane
 * would be unusable and a drag handle would be a target nobody can hit.
 */
function Split({
  ratio,
  onRatio,
  top,
  bottom,
}: {
  ratio: number;
  onRatio: (ratio: number) => void;
  top: React.ReactNode;
  bottom: React.ReactNode;
}) {
  const t = useTranslations('apiStudio');
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!dragging) return;

    function onMove(event: PointerEvent): void {
      const box = containerRef.current?.getBoundingClientRect();
      if (!box || box.height === 0) return;
      onRatio((event.clientY - box.top) / box.height);
    }
    function onUp(): void {
      setDragging(false);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, onRatio]);

  return (
    <div ref={containerRef} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-auto lg:flex-none" style={{ flexBasis: `${ratio * 100}%` }}>
        {top}
      </div>

      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label={t('actions.resize')}
        tabIndex={0}
        onPointerDown={() => setDragging(true)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') onRatio(ratio - 0.05);
          else if (event.key === 'ArrowDown') onRatio(ratio + 0.05);
          else return;
          event.preventDefault();
        }}
        className={cn(
          'hidden h-1.5 shrink-0 cursor-row-resize border-y border-border bg-muted/40 transition-colors lg:block',
          'hover:bg-primary/20 focus-visible:outline-none focus-visible:bg-primary/30',
          dragging && 'bg-primary/30',
        )}
      />

      <div className="min-h-0 flex-1 overflow-auto border-t border-border lg:border-t-0">{bottom}</div>
    </div>
  );
}
