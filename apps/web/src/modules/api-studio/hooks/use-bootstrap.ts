'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCollectionsStore, useHistoryStore, useWorkspaceStore } from '../stores';
import { apiStudioClient } from '../services/api-client';

/**
 * Load the workspace the studio opens with.
 *
 * Sequence: workspaces, then the first one's collections, its tree, its
 * environments and its history. A first-time visitor has none of those, so a
 * workspace and a collection are created rather than shown an empty screen
 * with a setup task; the names come from the caller, translated.
 *
 * Failure is a STATE, not an exception. If storage is unreachable the studio
 * stays usable: the runner needs no database, so a scratch request can still be
 * built and sent while the sidebar shows why it is empty. That is also why this
 * hook exposes `retry` rather than reloading the page.
 */

export interface BootstrapNames {
  workspace: string;
  collection: string;
}

export interface BootstrapState {
  ready: boolean;
  /** Message key under `apiStudio.errors`, or `null`. */
  error: string | null;
  retry: () => void;
}

export function useBootstrap(names: BootstrapNames): BootstrapState {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setError(null);
    setReady(false);
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    let alive = true;

    async function load(): Promise<void> {
      useWorkspaceStore.getState().beginLoad();
      useCollectionsStore.getState().beginLoad();

      const workspaces = await apiStudioClient.listWorkspaces();
      if (!alive) return;

      if (!workspaces.ok) {
        useWorkspaceStore.getState().failLoad(workspaces.code);
        useCollectionsStore.getState().failLoad(workspaces.code);
        setError(workspaces.code);
        setReady(true);
        return;
      }

      let workspace = workspaces.data[0];
      if (!workspace) {
        const created = await apiStudioClient.createWorkspace({ name: names.workspace });
        if (!alive) return;
        if (!created.ok) {
          useWorkspaceStore.getState().failLoad(created.code);
          setError(created.code);
          setReady(true);
          return;
        }
        workspace = created.data;
      }

      const [environments, collections, history] = await Promise.all([
        apiStudioClient.listEnvironments(workspace.id),
        apiStudioClient.listCollections(workspace.id),
        apiStudioClient.listHistory(workspace.id),
      ]);
      if (!alive) return;

      useWorkspaceStore.getState().load({
        workspaces: workspaces.data.length > 0 ? workspaces.data : [workspace],
        environments: environments.ok ? environments.data : [],
        globals: [],
        activeWorkspaceId: workspace.id,
      });

      if (history.ok) useHistoryStore.getState().load(history.data);

      if (!collections.ok) {
        useCollectionsStore.getState().failLoad(collections.code);
        setError(collections.code);
        setReady(true);
        return;
      }

      let list = collections.data;
      if (list.length === 0) {
        const created = await apiStudioClient.createCollection({
          workspaceId: workspace.id,
          name: names.collection,
        });
        if (!alive) return;
        if (created.ok) list = [created.data];
      }

      // One request per collection, in parallel: a workspace usually has a
      // handful, and the tree is unusable until they are all in.
      const trees = await Promise.all(list.map((collection) => apiStudioClient.listNodes(collection.id)));
      if (!alive) return;

      useCollectionsStore.getState().load({
        collections: list,
        nodes: trees.flatMap((tree) => (tree.ok ? tree.data : [])),
      });
      setReady(true);
    }

    void load();
    return () => {
      alive = false;
    };
  }, [attempt, names.collection, names.workspace]);

  return { ready, error, retry };
}
