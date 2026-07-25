'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useStudioStore } from '../store/use-studio-store';
import { monacoLanguageOf } from '../utils/files';
import { loadMonaco, type MonacoApi, type MonacoEditorInstance, type MonacoTextModel } from '../services/monaco-loader';
import { editorBridge } from '../services/editor-bridge';
import type { EditorTheme } from '../types';

function resolveTheme(theme: EditorTheme): string {
  if (theme === 'system') {
    const dark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return dark ? 'vs-dark' : 'vs';
  }
  return theme === 'dark' ? 'vs-dark' : 'vs';
}

/**
 * The Monaco editor surface.
 *
 * One editor instance drives every file: each file owns a persistent model, and
 * switching tabs just swaps the model in, so cursor position, undo history and
 * folding survive a tab change. Edits flow one-way into the store (the source of
 * truth); models are only rebuilt when the project itself is replaced.
 */
export function MonacoEditor({ onSave }: { onSave: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MonacoEditorInstance | null>(null);
  const monacoRef = useRef<MonacoApi | null>(null);
  const modelsRef = useRef<Map<string, { model: MonacoTextModel; path: string; dispose: () => void }>>(new Map());
  const [ready, setReady] = useState(false);

  const project = useStudioStore((s) => s.project);
  const activeFileId = useStudioStore((s) => s.activeFileId);
  const settings = useStudioStore((s) => s.settings);
  const readOnly = useStudioStore((s) => s.readOnly);
  const updateFileContent = useStudioStore((s) => s.updateFileContent);

  const projectId = project?.id ?? null;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Boot Monaco once, into the container.
  useEffect(() => {
    let editor: MonacoEditorInstance | null = null;
    let disposed = false;
    loadMonaco()
      .then((monaco) => {
        if (disposed || !containerRef.current) return;
        monacoRef.current = monaco;
        editor = monaco.editor.create(containerRef.current, {
          model: null,
          automaticLayout: true,
          fontSize: settings.fontSize,
          tabSize: settings.tabSize,
          wordWrap: settings.wordWrap ? 'on' : 'off',
          minimap: { enabled: settings.minimap },
          theme: resolveTheme(settings.theme),
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          padding: { top: 12 },
          fontLigatures: true,
        });
        editor.addCommand(monaco.KeyMod.CtrlCmd | (monaco.KeyCode.KeyS ?? 0), () => onSaveRef.current());
        editorRef.current = editor;
        editorBridge.format = () => editor?.getAction('editor.action.formatDocument')?.run();
        editorBridge.revealPosition = (line, column = 1) => {
          editor?.revealLineInCenter(line);
          editor?.setPosition({ lineNumber: line, column });
          editor?.focus();
        };
        setReady(true);
      })
      .catch(() => setReady(false));

    return () => {
      disposed = true;
      editorBridge.format = null;
      editorBridge.revealPosition = null;
      editor?.dispose();
      editorRef.current = null;
    };
    // Only boot once; settings are applied by a separate effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild models whenever the project is replaced (load, reset, fork).
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco || !ready || !project) return;

    for (const entry of modelsRef.current.values()) entry.dispose();
    modelsRef.current.clear();

    for (const file of project.files) {
      const model = monaco.editor.createModel(
        file.content,
        monacoLanguageOf(file.path),
        monaco.Uri.parse(`inmemory://studio/${file.id}/${file.path}`),
      );
      const listener = model.onDidChangeContent(() => updateFileContent(file.id, model.getValue()));
      modelsRef.current.set(file.id, {
        model,
        path: file.path,
        dispose: () => {
          listener.dispose();
          model.dispose();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, ready]);

  // Keep model languages in step with renames without losing edit history.
  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco || !ready || !project) return;
    for (const file of project.files) {
      const entry = modelsRef.current.get(file.id);
      if (entry && entry.path !== file.path) {
        monaco.editor.setModelLanguage(entry.model, monacoLanguageOf(file.path));
        entry.path = file.path;
      }
    }
  }, [project, ready]);

  // Swap the active model in.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !ready) return;
    const entry = activeFileId ? modelsRef.current.get(activeFileId) : null;
    editor.setModel(entry ? entry.model : null);
    if (entry) editor.focus();
  }, [activeFileId, ready, projectId]);

  // Apply editor settings live.
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco || !ready) return;
    editor.updateOptions({
      fontSize: settings.fontSize,
      tabSize: settings.tabSize,
      wordWrap: settings.wordWrap ? 'on' : 'off',
      minimap: { enabled: settings.minimap },
      readOnly,
    });
    monaco.editor.setTheme(resolveTheme(settings.theme));
  }, [settings, readOnly, ready]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" aria-label="Code editor" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading editor
        </div>
      )}
    </div>
  );
}
