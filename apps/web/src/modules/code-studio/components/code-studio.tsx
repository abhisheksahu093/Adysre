'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { useStudioStore } from '../store/use-studio-store';
import { studioStorage } from '../services/storage';
import { TEMPLATES, templateFiles } from '../templates';
import { createId } from '../utils/files';
import { useAutosave } from '../hooks/use-autosave';
import { usePreview } from '../hooks/use-preview';
import { useConsoleBridge } from '../hooks/use-console-bridge';
import { clearShareHash, decodeSharedProject, readShareHash } from '../services/share';
import { readFileList, readZip } from '../services/archive';
import { Toolbar } from './toolbar';
import { Explorer } from './explorer';
import { EditorTabs } from './editor-tabs';
import { MonacoEditor } from './monaco-editor';
import { PreviewPane } from './preview-pane';
import { ConsolePanel } from './console-panel';

function defaultProject() {
  const template = TEMPLATES[0]!;
  return {
    id: createId('proj'),
    name: 'Untitled project',
    files: templateFiles(template),
    ...(template.entry ? { entry: template.entry } : {}),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * ADYSRE Code Studio - the IDE shell.
 *
 * Composes the toolbar, explorer, Monaco editor, live preview and console into a
 * resizable, VS Code-style layout, and owns boot (restore the last project and
 * settings from IndexedDB) plus the cross-cutting hooks (autosave, preview
 * compile, console bridge) and global shortcuts.
 */
export function CodeStudio() {
  const t = useTranslations('codeStudio');
  const project = useStudioStore((s) => s.project);
  const loadProject = useStudioStore((s) => s.loadProject);
  const importProject = useStudioStore((s) => s.importProject);
  const setReadOnly = useStudioStore((s) => s.setReadOnly);
  const updateSettings = useStudioStore((s) => s.updateSettings);
  const [booted, setBooted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const { state: saveState, save } = useAutosave();
  const { srcdoc, building, rebuild } = usePreview();
  useConsoleBridge();

  // Boot once: restore settings and the last project, else a starter template.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const settings = await studioStorage.getSettings();
        if (alive && settings) updateSettings(settings);

        // A share link wins over the restored project: open it as a fork.
        const shared = readShareHash();
        if (shared) {
          const decoded = await decodeSharedProject(shared);
          clearShareHash();
          if (alive && decoded) {
            loadProject(decoded.project);
            setReadOnly(decoded.readOnly);
            return;
          }
        }

        const lastId = await studioStorage.getLastProjectId();
        const restored = lastId ? await studioStorage.getProject(lastId) : undefined;
        if (!alive) return;
        loadProject(restored ?? defaultProject());
      } catch {
        if (alive) loadProject(defaultProject());
      } finally {
        if (alive) setBooted(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [loadProject, importProject, setReadOnly, updateSettings]);

  // Global Ctrl/Cmd+S (Monaco has its own binding when the editor is focused).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  // Horizontal resize between editor and preview.
  const splitRef = useRef<HTMLDivElement>(null);
  const [editorPct, setEditorPct] = useState(55);
  const draggingRef = useRef(false);

  const onDividerDown = useCallback(() => {
    draggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setEditorPct(Math.min(80, Math.max(25, pct)));
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const zip = files.find((f) => f.name.toLowerCase().endsWith('.zip'));
    try {
      if (zip) importProject(zip.name.replace(/\.zip$/i, ''), await readZip(zip));
      else importProject('Imported project', await readFileList(files));
    } catch {
      /* an unreadable drop simply does nothing */
    }
  };

  return (
    <div
      className="relative -m-4 flex h-[calc(100%+2rem)] flex-col overflow-hidden bg-background text-foreground sm:-m-6 sm:h-[calc(100%+3rem)]"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={onDrop}
    >
      <Toolbar saveState={saveState} onSave={() => void save()} onRun={() => void rebuild()} />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-border md:block">
          <Explorer />
        </aside>

        <div ref={splitRef} className="flex min-w-0 flex-1">
          <section className="flex min-w-0 flex-col" style={{ width: `${editorPct}%` }}>
            <EditorTabs />
            <div className="min-h-0 flex-1">{booted && project ? <MonacoEditor onSave={() => void save()} /> : null}</div>
            <div className="h-52 shrink-0 border-t border-border">
              <ConsolePanel />
            </div>
          </section>

          <div
            role="separator"
            aria-orientation="vertical"
            onPointerDown={onDividerDown}
            className="w-1 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary"
          />

          <section className="min-w-0 flex-1">
            <PreviewPane srcdoc={srcdoc} building={building} onRebuild={() => void rebuild()} />
          </section>
        </div>
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-40 m-3 flex items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/10 text-sm font-medium text-primary">
          {t('dropToImport')}
        </div>
      )}

      {!booted && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading studio
        </div>
      )}
    </div>
  );
}
