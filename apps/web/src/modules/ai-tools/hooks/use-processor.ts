'use client';

import { useCallback, useRef } from 'react';
import { useMediaStore } from '../store/use-media-store';
import { AI_TOOL_BY_ID, type RegistryTool } from '../tools/registry';

/**
 * The processing pipeline. Runs the queue one item at a time (canvas work is
 * CPU-bound, so serial keeps the tab responsive and progress honest), reporting
 * per-item progress and honoring cancel between items. Errors are captured per
 * item so one bad file never stops the batch.
 */
export function useProcessor() {
  const abortRef = useRef<AbortController | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);

  const runItem = useCallback(async (id: string, tool: RegistryTool, controller: AbortController) => {
    const store = useMediaStore.getState();
    const item = store.items.find((i) => i.id === id);
    if (!item || !tool.process) return;
    store.setStatus(id, 'processing');
    store.setProgress(id, 0);
    try {
      const result = await tool.process({
        item,
        settings: useMediaStore.getState().settings,
        onProgress: (fraction) => useMediaStore.getState().setProgress(id, Math.min(1, Math.max(0, fraction))),
        signal: controller.signal,
      });
      if (controller.signal.aborted) {
        useMediaStore.getState().setStatus(id, 'canceled');
        URL.revokeObjectURL(result.url);
        return;
      }
      useMediaStore.getState().setResult(id, result);
    } catch (error) {
      if (controller.signal.aborted) useMediaStore.getState().setStatus(id, 'canceled');
      else useMediaStore.getState().setError(id, error instanceof Error ? error.message : String(error));
    }
  }, []);

  const processAll = useCallback(async () => {
    const state = useMediaStore.getState();
    const tool = state.toolId ? AI_TOOL_BY_ID[state.toolId] : undefined;
    if (!tool?.process || state.running) return;

    const controller = new AbortController();
    abortRef.current = controller;
    state.setRunning(true);

    const queue = state.items.filter((item) => !item.result).map((item) => item.id);
    for (const id of queue) state.setStatus(id, 'queued');

    for (const id of queue) {
      if (controller.signal.aborted) break;
      await runItem(id, tool, controller);
    }

    useMediaStore.getState().setRunning(false);
    abortRef.current = null;
  }, [runItem]);

  const processItem = useCallback(
    async (id: string) => {
      const state = useMediaStore.getState();
      const tool = state.toolId ? AI_TOOL_BY_ID[state.toolId] : undefined;
      if (!tool?.process) return;
      const controller = new AbortController();
      abortRef.current = controller;
      await runItem(id, tool, controller);
      abortRef.current = null;
    },
    [runItem],
  );

  /**
   * Live preview: re-render just the selected item as its settings change, so
   * tools like the enhancer and face blur update the preview without a full
   * batch run. Each call supersedes the previous one (newer settings win), and a
   * stale result is discarded. Preview errors are swallowed - a transient "no
   * faces yet" while dragging shouldn't flash an error on the item.
   */
  const previewItem = useCallback(async (id: string) => {
    const state = useMediaStore.getState();
    const tool = state.toolId ? AI_TOOL_BY_ID[state.toolId] : undefined;
    if (!tool?.process) return;
    const item = state.items.find((i) => i.id === id);
    if (!item) return;

    previewAbortRef.current?.abort();
    const controller = new AbortController();
    previewAbortRef.current = controller;
    useMediaStore.getState().setPreviewing(true);
    try {
      const result = await tool.process({
        item,
        settings: useMediaStore.getState().settings,
        onProgress: () => {},
        signal: controller.signal,
      });
      if (controller.signal.aborted) {
        URL.revokeObjectURL(result.url);
        return;
      }
      useMediaStore.getState().setResult(id, result);
    } catch {
      /* ignore preview errors; the last good result stays on screen */
    } finally {
      if (previewAbortRef.current === controller) {
        previewAbortRef.current = null;
        useMediaStore.getState().setPreviewing(false);
      }
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    const store = useMediaStore.getState();
    for (const item of store.items) {
      if (item.status === 'processing' || item.status === 'queued') store.setStatus(item.id, 'canceled');
    }
    store.setRunning(false);
  }, []);

  return { processAll, processItem, previewItem, cancel };
}
