'use client';

import { X } from 'lucide-react';
import { Tooltip, cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import { baseName } from '../utils/files';

/**
 * Open-file tabs above the editor. Mirrors the store's `openTabIds`; the active
 * tab drives which model Monaco shows.
 */
export function EditorTabs() {
  const project = useStudioStore((s) => s.project);
  const openTabIds = useStudioStore((s) => s.openTabIds);
  const activeFileId = useStudioStore((s) => s.activeFileId);
  const setActiveFile = useStudioStore((s) => s.setActiveFile);
  const closeTab = useStudioStore((s) => s.closeTab);

  if (!project) return null;

  const tabs = openTabIds
    .map((id) => project.files.find((f) => f.id === id))
    .filter((file): file is NonNullable<typeof file> => Boolean(file));

  return (
    <div role="tablist" aria-label="Open files" className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-border bg-card/40">
      {tabs.map((file) => {
        const active = file.id === activeFileId;
        return (
          <div
            key={file.id}
            role="tab"
            aria-selected={active}
            className={cn(
              'group flex items-center gap-2 border-r border-border px-3 text-xs transition-colors',
              active ? 'bg-background text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <button type="button" onClick={() => setActiveFile(file.id)} className="max-w-40 truncate">
              {baseName(file.path)}
            </button>
            <Tooltip label={`Close ${baseName(file.path)}`} side="bottom">
              <button
                type="button"
                aria-label={`Close ${baseName(file.path)}`}
                onClick={() => closeTab(file.id)}
                className="rounded p-0.5 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
