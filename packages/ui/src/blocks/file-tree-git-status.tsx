'use client';

/**
 * Live preview for `file-tree-git-status`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

type GitStatus = 'modified' | 'added' | 'deleted' | 'untracked';

interface TreeNode {
  name: string;
  status?: GitStatus;
  children?: TreeNode[];
}

interface FileTreeGitStatusProps {
  nodes: TreeNode[];
  label?: string;
}

// Colour AND a letter - never colour alone. A red dot means nothing to a
// colour-blind reader, so the M/A/D/U letter carries the same meaning.
const STATUS_META: Record<GitStatus, { letter: string; label: string; cls: string }> = {
  modified: { letter: 'M', label: 'modified', cls: 'text-amber-600 dark:text-amber-400' },
  added: { letter: 'A', label: 'added', cls: 'text-emerald-600 dark:text-emerald-400' },
  deleted: { letter: 'D', label: 'deleted', cls: 'text-red-600 dark:text-red-400' },
  untracked: { letter: 'U', label: 'untracked', cls: 'text-sky-600 dark:text-sky-400' },
};

function StatusBadge({ status }: { status: GitStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={'ml-auto shrink-0 pl-2 text-xs font-bold ' + meta.cls}>
      <span className="sr-only">{meta.label}</span>
      <span aria-hidden="true">{meta.letter}</span>
    </span>
  );
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const tint = node.status ? STATUS_META[node.status].cls : '';

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className={'truncate ' + tint}>{node.name}</span>
          {node.status ? <StatusBadge status={node.status} /> : null}
        </span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900"
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          className={
            open
              ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none'
              : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'
          }
        >
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true">
          <path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z" />
        </svg>
        <span className="truncate font-medium text-gray-900 dark:text-gray-100">{node.name}</span>
      </button>
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeGitStatus({ nodes, label = 'Changed files' }: FileTreeGitStatusProps) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'src',
    children: [
      { name: 'app.tsx', status: 'modified' },
      { name: 'router.tsx', status: 'added' },
      { name: 'legacy.ts', status: 'deleted' },
      { name: 'notes.md', status: 'untracked' },
    ],
  },
  { name: 'package.json', status: 'modified' },
];

export default function FileTreeGitStatusPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeGitStatus nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 320;
