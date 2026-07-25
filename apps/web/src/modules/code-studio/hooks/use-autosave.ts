'use client';

import { useEffect, useRef, useState } from 'react';
import { useStudioStore } from '../store/use-studio-store';
import { studioStorage } from '../services/storage';

export type SaveState = 'idle' | 'saving' | 'saved';

/**
 * Persists the project to IndexedDB on a short debounce (the spec's ~2s), plus a
 * manual save the toolbar and Ctrl+S call. Settings are persisted too, so the
 * studio reopens exactly as it was left. When a backend sync lands, this is the
 * single seam that gains a network write.
 */
export function useAutosave(intervalMs = 2000) {
  const project = useStudioStore((s) => s.project);
  const settings = useStudioStore((s) => s.settings);
  const [state, setState] = useState<SaveState>('idle');
  const savedTimer = useRef<number | null>(null);

  const updatedAt = project?.updatedAt ?? 0;
  const projectId = project?.id ?? null;

  const flush = useRef(async () => {
    const current = useStudioStore.getState().project;
    if (!current) return;
    setState('saving');
    await studioStorage.saveProject(current);
    await studioStorage.setLastProjectId(current.id);
    setState('saved');
    if (savedTimer.current) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setState('idle'), 1500);
  });

  // Debounced autosave on every change, when enabled.
  useEffect(() => {
    if (!projectId || !settings.autosave) return;
    const handle = window.setTimeout(() => void flush.current(), intervalMs);
    return () => window.clearTimeout(handle);
  }, [updatedAt, projectId, settings.autosave, intervalMs]);

  // Persist settings whenever they change.
  useEffect(() => {
    void studioStorage.saveSettings(settings);
  }, [settings]);

  return { state, save: () => flush.current() };
}
