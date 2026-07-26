'use client';

import { create } from 'zustand';
import type { ExecutionError, ExecutionResponse, ExecutionResult } from '../types';
import { MAX_CONCURRENT_REQUESTS } from '../constants/limits';

/**
 * In-flight requests, their results, and the handles that cancel them.
 *
 * Execution state is per TAB, not global: two tabs sending at once each need
 * their own spinner, their own response and their own abort. A single "loading"
 * boolean would make the second send erase the first one's result.
 *
 * The store holds `AbortController`s but never calls fetch. Holding the handle
 * is state; using it is IO, and that lives in the service layer.
 */

export type ExecutionStatus = 'idle' | 'sending' | 'success' | 'error' | 'cancelled';

export interface ExecutionEntry {
  status: ExecutionStatus;
  /** Epoch ms, for the live elapsed timer while `sending`. */
  startedAt: number | null;
  finishedAt: number | null;
  response: ExecutionResponse | null;
  error: ExecutionError | null;
  /** Upload progress 0 to 1, or `null` when the runtime cannot report it. */
  progress: number | null;
  controller: AbortController | null;
}

const IDLE: ExecutionEntry = {
  status: 'idle',
  startedAt: null,
  finishedAt: null,
  response: null,
  error: null,
  progress: null,
  controller: null,
};

interface ExecutionState {
  byTab: Record<string, ExecutionEntry>;

  /** Register a send. Replaces any previous result for that tab. */
  start: (tabId: string, controller: AbortController) => void;
  setProgress: (tabId: string, progress: number | null) => void;
  /** Record a completed exchange, successful or not, from the runner. */
  finish: (tabId: string, result: ExecutionResult) => void;
  /** Record a failure that never reached the runner (offline, refused). */
  fail: (tabId: string, error: ExecutionError) => void;
  /** Abort an in-flight request. Safe to call when nothing is in flight. */
  cancel: (tabId: string) => void;
  /** Cancel everything, e.g. when the module unmounts. */
  cancelAll: () => void;
  clear: (tabId: string) => void;

  entry: (tabId: string) => ExecutionEntry;
  isSending: (tabId: string) => boolean;
  inFlightCount: () => number;
  /** False once the browser is at its concurrent-request ceiling. */
  canSend: () => boolean;
}

export const useExecutionStore = create<ExecutionState>((set, get) => ({
  byTab: {},

  start: (tabId, controller) =>
    set((state) => ({
      byTab: {
        ...state.byTab,
        [tabId]: {
          ...IDLE,
          status: 'sending',
          startedAt: Date.now(),
          controller,
        },
      },
    })),

  setProgress: (tabId, progress) =>
    set((state) => {
      const entry = state.byTab[tabId];
      if (!entry || entry.status !== 'sending') return {};
      return { byTab: { ...state.byTab, [tabId]: { ...entry, progress } } };
    }),

  finish: (tabId, result) =>
    set((state) => {
      const entry = state.byTab[tabId] ?? IDLE;
      return {
        byTab: {
          ...state.byTab,
          [tabId]: {
            ...entry,
            status: result.ok ? 'success' : 'error',
            finishedAt: Date.now(),
            response: result.ok ? result.response : null,
            error: result.ok ? null : result.error,
            progress: null,
            controller: null,
          },
        },
      };
    }),

  fail: (tabId, error) =>
    set((state) => {
      const entry = state.byTab[tabId] ?? IDLE;
      return {
        byTab: {
          ...state.byTab,
          [tabId]: {
            ...entry,
            status: 'error',
            finishedAt: Date.now(),
            response: null,
            error,
            progress: null,
            controller: null,
          },
        },
      };
    }),

  cancel: (tabId) => {
    const entry = get().byTab[tabId];
    if (!entry || entry.status !== 'sending') return;
    entry.controller?.abort();
    set((state) => ({
      byTab: {
        ...state.byTab,
        [tabId]: {
          ...entry,
          status: 'cancelled',
          finishedAt: Date.now(),
          progress: null,
          controller: null,
        },
      },
    }));
  },

  cancelAll: () => {
    for (const tabId of Object.keys(get().byTab)) get().cancel(tabId);
  },

  clear: (tabId) =>
    set((state) => {
      const { [tabId]: _removed, ...rest } = state.byTab;
      return { byTab: rest };
    }),

  entry: (tabId) => get().byTab[tabId] ?? IDLE,
  isSending: (tabId) => get().byTab[tabId]?.status === 'sending',
  inFlightCount: () =>
    Object.values(get().byTab).filter((entry) => entry.status === 'sending').length,
  canSend: () => get().inFlightCount() < MAX_CONCURRENT_REQUESTS,
}));
