'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useStudioStore } from '../store/use-studio-store';
import { buildPreview } from '../services/compiler';

/**
 * Compiles the current project into an iframe `srcdoc`, debounced so a burst of
 * keystrokes triggers one rebuild. Returns the document plus a manual rebuild
 * for the toolbar's Run button.
 */
export function usePreview(debounceMs = 450) {
  const project = useStudioStore((s) => s.project);
  const setDiagnostics = useStudioStore((s) => s.setDiagnostics);
  const [srcdoc, setSrcdoc] = useState('');
  const [building, setBuilding] = useState(false);
  const runId = useRef(0);

  const rebuild = useCallback(async () => {
    const current = useStudioStore.getState().project;
    if (!current) return;
    const id = (runId.current += 1);
    setBuilding(true);
    const result = await buildPreview(current);
    if (id !== runId.current) return; // a newer build superseded this one
    setSrcdoc(result.srcdoc);
    setDiagnostics(result.error ? [{ message: result.error }] : []);
    setBuilding(false);
  }, [setDiagnostics]);

  const updatedAt = project?.updatedAt ?? 0;
  const projectId = project?.id ?? null;

  useEffect(() => {
    if (!projectId) return;
    const handle = window.setTimeout(() => void rebuild(), debounceMs);
    return () => window.clearTimeout(handle);
  }, [updatedAt, projectId, debounceMs, rebuild]);

  return { srcdoc, building, rebuild };
}
