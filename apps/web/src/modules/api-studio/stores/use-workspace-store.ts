'use client';

import { create } from 'zustand';
import type { ApiEnvironment, ApiVariable, ApiWorkspace, VariableLayer } from '../types';

/**
 * Workspace, environments and the global variable layer.
 *
 * This store owns the two outermost layers of the variable stack (global, then
 * the active environment). The inner three (collection, folder, request) belong
 * to the nodes being edited, so the full stack is assembled by a hook, not
 * here: a store that reached into another store would make either one
 * impossible to test alone.
 *
 * No IO. Loading is a caller's job; this holds the result and the status of it.
 */

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface WorkspaceState {
  status: LoadStatus;
  /** Message key or text for the failure banner. Cleared on a new load. */
  error: string | null;

  workspaces: ApiWorkspace[];
  activeWorkspaceId: string | null;

  environments: ApiEnvironment[];
  /** `null` means "no environment": only globals resolve. */
  activeEnvironmentId: string | null;
  globals: ApiVariable[];

  beginLoad: () => void;
  failLoad: (error: string) => void;
  load: (payload: {
    workspaces: ApiWorkspace[];
    environments: ApiEnvironment[];
    globals: ApiVariable[];
    activeWorkspaceId?: string | null;
  }) => void;

  setActiveWorkspace: (id: string | null) => void;
  setActiveEnvironment: (id: string | null) => void;

  upsertEnvironment: (environment: ApiEnvironment) => void;
  removeEnvironment: (id: string) => void;

  setGlobals: (variables: ApiVariable[]) => void;
  upsertVariable: (environmentId: string | null, variable: ApiVariable) => void;
  removeVariable: (environmentId: string | null, variableId: string) => void;

  /** The active environment, or `undefined` when none is selected. */
  activeEnvironment: () => ApiEnvironment | undefined;
  /** The active workspace, or `undefined` before one is chosen. */
  activeWorkspace: () => ApiWorkspace | undefined;
  /**
   * The outer variable layers, least specific first. The caller appends the
   * collection, folder and request layers before resolving.
   */
  variableLayers: () => VariableLayer[];
}

function replaceById<T extends { id: string }>(list: T[], next: T): T[] {
  const index = list.findIndex((item) => item.id === next.id);
  if (index === -1) return [...list, next];
  const copy = [...list];
  copy[index] = next;
  return copy;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  status: 'idle',
  error: null,
  workspaces: [],
  activeWorkspaceId: null,
  environments: [],
  activeEnvironmentId: null,
  globals: [],

  beginLoad: () => set({ status: 'loading', error: null }),
  failLoad: (error) => set({ status: 'error', error }),

  load: ({ workspaces, environments, globals, activeWorkspaceId }) => {
    const active =
      activeWorkspaceId !== undefined
        ? activeWorkspaceId
        : (get().activeWorkspaceId ?? workspaces[0]?.id ?? null);
    // The workspace's default environment is a flag on the environment, not a
    // pointer on the workspace, so it is read from the list rather than stored.
    const preferred = environments.find((environment) => environment.workspaceId === active);

    set({
      status: 'ready',
      error: null,
      workspaces,
      environments,
      globals,
      activeWorkspaceId: active,
      activeEnvironmentId: get().activeEnvironmentId ?? preferred?.id ?? null,
    });
  },

  setActiveWorkspace: (id) =>
    set((state) => ({
      activeWorkspaceId: id,
      // An environment belongs to one workspace: keeping it selected across a
      // switch would resolve variables from a workspace the user has left.
      activeEnvironmentId:
        state.environments.find((environment) => environment.id === state.activeEnvironmentId)
          ?.workspaceId === id
          ? state.activeEnvironmentId
          : null,
    })),

  setActiveEnvironment: (activeEnvironmentId) => set({ activeEnvironmentId }),

  upsertEnvironment: (environment) =>
    set((state) => ({ environments: replaceById(state.environments, environment) })),

  removeEnvironment: (id) =>
    set((state) => ({
      environments: state.environments.filter((environment) => environment.id !== id),
      activeEnvironmentId: state.activeEnvironmentId === id ? null : state.activeEnvironmentId,
    })),

  setGlobals: (globals) => set({ globals }),

  upsertVariable: (environmentId, variable) =>
    set((state) => {
      if (environmentId === null) {
        return { globals: replaceById(state.globals, variable) };
      }
      return {
        environments: state.environments.map((environment) =>
          environment.id === environmentId
            ? { ...environment, variables: replaceById(environment.variables, variable) }
            : environment,
        ),
      };
    }),

  removeVariable: (environmentId, variableId) =>
    set((state) => {
      if (environmentId === null) {
        return { globals: state.globals.filter((variable) => variable.id !== variableId) };
      }
      return {
        environments: state.environments.map((environment) =>
          environment.id === environmentId
            ? {
                ...environment,
                variables: environment.variables.filter((v) => v.id !== variableId),
              }
            : environment,
        ),
      };
    }),

  activeEnvironment: () => {
    const { environments, activeEnvironmentId } = get();
    return environments.find((environment) => environment.id === activeEnvironmentId);
  },

  activeWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();
    return workspaces.find((workspace) => workspace.id === activeWorkspaceId);
  },

  variableLayers: () => {
    const { globals } = get();
    const environment = get().activeEnvironment();
    const layers: VariableLayer[] = [{ scope: 'global', ownerId: null, variables: globals }];

    if (environment) {
      layers.push({
        scope: 'environment',
        ownerId: environment.id,
        variables: environment.variables,
      });
    }

    return layers;
  },
}));
