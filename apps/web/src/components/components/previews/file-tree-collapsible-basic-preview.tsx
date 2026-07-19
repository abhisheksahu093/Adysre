'use client';

/**
 * Live preview for `file-tree-collapsible-basic`. Mirrors the `typescript` variant
 * verbatim, rendered with a small sample project. Keep in step with
 * `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  // Presence of `children` (even empty) marks a folder; its absence marks a file.
  children?: TreeNode[];
}

interface FileTreeCollapsibleBasicProps {
  nodes: TreeNode[];
  label?: string;
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
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

function FileTreeCollapsibleBasic({ nodes, label = 'Project files' }: FileTreeCollapsibleBasicProps) {
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
      { name: 'components', children: [{ name: 'button.tsx' }, { name: 'card.tsx' }] },
      { name: 'hooks', children: [{ name: 'use-auth.ts' }] },
      { name: 'index.ts' },
    ],
  },
  { name: 'package.json' },
  { name: 'README.md' },
];

export default function FileTreeCollapsibleBasicPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeCollapsibleBasic nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 340;
