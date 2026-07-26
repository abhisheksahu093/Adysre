'use client';

import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  File as FileIcon,
  FileCode2,
  FilePlus,
  FileText,
  Folder,
  FolderOpen,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Tooltip, cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import type { ProjectFile } from '../types';
import { baseName, dirName, languageOf } from '../utils/files';

interface TreeNode {
  name: string;
  path: string;
  file?: ProjectFile;
  children: TreeNode[];
}

function buildTree(files: ProjectFile[]): TreeNode {
  const root: TreeNode = { name: '', path: '', children: [] };
  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    const segments = file.path.split('/');
    let node = root;
    segments.forEach((segment, index) => {
      const path = segments.slice(0, index + 1).join('/');
      let child = node.children.find((c) => c.name === segment && (index < segments.length - 1) === !c.file);
      if (!child) {
        child = { name: segment, path, children: [] };
        node.children.push(child);
      }
      if (index === segments.length - 1) child.file = file;
      node = child;
    });
  }
  const sort = (n: TreeNode) => {
    n.children.sort((a, b) => (!a.file === !b.file ? a.name.localeCompare(b.name) : a.file ? 1 : -1));
    n.children.forEach(sort);
  };
  sort(root);
  return root;
}

function FileGlyph({ path }: { path: string }) {
  const lang = languageOf(path);
  const cls = 'h-4 w-4 shrink-0';
  if (lang === 'html') return <FileCode2 className={cn(cls, 'text-orange-400')} aria-hidden />;
  if (lang === 'css') return <FileCode2 className={cn(cls, 'text-sky-400')} aria-hidden />;
  if (lang === 'javascript' || lang === 'jsx') return <FileCode2 className={cn(cls, 'text-yellow-400')} aria-hidden />;
  if (lang === 'typescript' || lang === 'tsx') return <FileCode2 className={cn(cls, 'text-blue-400')} aria-hidden />;
  if (lang === 'vue') return <FileCode2 className={cn(cls, 'text-emerald-400')} aria-hidden />;
  if (lang === 'json') return <FileText className={cn(cls, 'text-amber-300')} aria-hidden />;
  return <FileIcon className={cn(cls, 'text-muted-foreground')} aria-hidden />;
}

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [open, setOpen] = useState(true);
  const activeFileId = useStudioStore((s) => s.activeFileId);
  const openFile = useStudioStore((s) => s.openFile);
  const deleteFile = useStudioStore((s) => s.deleteFile);
  const duplicateFile = useStudioStore((s) => s.duplicateFile);
  const renameFile = useStudioStore((s) => s.renameFile);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState('');

  const indent = { paddingLeft: `${depth * 12 + 8}px` } as const;

  if (node.file) {
    const file = node.file;
    const active = file.id === activeFileId;
    const commitRename = () => {
      const next = dirName(file.path) ? `${dirName(file.path)}/${draft}` : draft;
      if (draft.trim()) renameFile(file.id, next);
      setRenaming(false);
    };
    return (
      <li>
        <div
          className={cn(
            'group flex items-center gap-1.5 rounded py-1 pr-1 text-sm transition-colors',
            active ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
          style={indent}
        >
          <FileGlyph path={file.path} />
          {renaming ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') setRenaming(false);
              }}
              className="min-w-0 flex-1 rounded border border-primary/50 bg-background px-1 py-0.5 text-xs outline-none"
            />
          ) : (
            <button type="button" onClick={() => openFile(file.id)} className="min-w-0 flex-1 truncate text-left">
              {baseName(file.path)}
            </button>
          )}
          <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
            <Tooltip label="Rename" side="top">
              <button
                type="button"
                aria-label="Rename"
                onClick={() => {
                  setDraft(baseName(file.path));
                  setRenaming(true);
                }}
                className="rounded p-1 hover:bg-background hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
              </button>
            </Tooltip>
            <Tooltip label="Duplicate" side="top">
              <button
                type="button"
                aria-label="Duplicate"
                onClick={() => duplicateFile(file.id)}
                className="rounded p-1 hover:bg-background hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
              </button>
            </Tooltip>
            <Tooltip label="Delete" side="top">
              <button
                type="button"
                aria-label="Delete"
                onClick={() => deleteFile(file.id)}
                className="rounded p-1 hover:bg-background hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </Tooltip>
          </span>
        </div>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1 rounded py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        style={indent}
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" aria-hidden /> : <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
        {open ? <FolderOpen className="h-4 w-4 text-primary/70" aria-hidden /> : <Folder className="h-4 w-4 text-primary/70" aria-hidden />}
        <span className="truncate">{node.name}</span>
      </button>
      {open && (
        <ul>
          {node.children.map((child) => (
            <TreeRow key={child.path} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Explorer() {
  const project = useStudioStore((s) => s.project);
  const createFile = useStudioStore((s) => s.createFile);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const tree = useMemo(() => (project ? buildTree(project.files) : null), [project]);

  const commit = () => {
    if (draft.trim()) createFile(draft.trim());
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
        <Tooltip label="New file" side="bottom">
          <button
            type="button"
            aria-label="New file"
            onClick={() => setAdding(true)}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <FilePlus className="h-4 w-4" aria-hidden />
          </button>
        </Tooltip>
      </div>

      {adding && (
        <div className="px-3 pb-2">
          <input
            autoFocus
            value={draft}
            placeholder="path/to/file.tsx"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') {
                setDraft('');
                setAdding(false);
              }
            }}
            className="w-full rounded border border-primary/50 bg-background px-2 py-1 text-xs outline-none"
          />
        </div>
      )}

      <ul className="flex-1 overflow-y-auto px-1 pb-3">
        {tree?.children.map((node) => (
          <TreeRow key={node.path} node={node} depth={0} />
        ))}
      </ul>
    </div>
  );
}
