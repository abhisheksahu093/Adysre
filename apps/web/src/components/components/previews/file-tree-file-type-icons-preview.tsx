'use client';

/**
 * Live preview for `file-tree-file-type-icons`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FileTreeFileTypeIconsProps {
  nodes: TreeNode[];
  label?: string;
}

// The colour carries a hint of file type without a bespoke icon per extension -
// aria-hidden so a screen reader is never asked to read a decorative glyph.
function extColor(name: string): string {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'text-blue-500';
    case 'js':
    case 'jsx':
      return 'text-yellow-500';
    case 'json':
      return 'text-amber-500';
    case 'css':
      return 'text-sky-500';
    case 'md':
      return 'text-gray-400';
    case 'svg':
    case 'png':
      return 'text-purple-500';
    default:
      return 'text-gray-400';
  }
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className={'h-4 w-4 shrink-0 ' + extColor(node.name)} aria-hidden="true">
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

function FileTreeFileTypeIcons({ nodes, label = 'Project files' }: FileTreeFileTypeIconsProps) {
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
    name: 'app',
    children: [
      { name: 'layout.tsx' },
      { name: 'page.tsx' },
      { name: 'globals.css' },
      { name: 'logo.svg' },
    ],
  },
  { name: 'tsconfig.json' },
  { name: 'README.md' },
];

export default function FileTreeFileTypeIconsPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeFileTypeIcons nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 340;
