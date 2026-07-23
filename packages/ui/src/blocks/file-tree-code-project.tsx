'use client';

/**
 * Live preview for `file-tree-code-project`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FileTreeCodeProjectProps {
  nodes: TreeNode[];
  label?: string;
  // Full slash path of the open file, e.g. 'src/app.tsx'.
  activeFile?: string;
}

function TreeItem({
  node,
  level,
  path,
  activeFile,
}: {
  node: TreeNode;
  level: number;
  path: string;
  activeFile: string;
}) {
  const children = node.children;
  const [open, setOpen] = useState(true);

  if (!children) {
    const active = path === activeFile;
    return (
      <li role="treeitem" aria-current={active ? 'true' : undefined}>
        <span
          className={
            active
              ? 'flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-blue-400 bg-white/10 px-2 py-1.5 text-white'
              : 'flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-transparent px-2 py-1.5 text-gray-300 hover:bg-white/5'
          }
        >
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true">
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
        className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          className={
            open
              ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-500 transition-transform motion-reduce:transition-none'
              : 'h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none'
          }
        >
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <span className="truncate font-medium uppercase tracking-wide text-gray-300">{node.name}</span>
      </button>
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-white/10 pl-2 sm:ml-4">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} path={path + '/' + child.name} activeFile={activeFile} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCodeProject({ nodes, label = 'Explorer', activeFile = '' }: FileTreeCodeProjectProps) {
  return (
    <nav className="w-full max-w-xs overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-sm">
      <p className="border-b border-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <ul role="tree" aria-label={label} className="space-y-0.5 p-2">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} path={node.name} activeFile={activeFile} />
        ))}
      </ul>
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'src',
    children: [
      { name: 'app.tsx' },
      { name: 'router.tsx' },
      { name: 'lib', children: [{ name: 'api.ts' }, { name: 'store.ts' }] },
    ],
  },
  { name: 'vite.config.ts' },
];

export default function FileTreeCodeProjectPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeCodeProject nodes={SAMPLE} activeFile="src/router.tsx" />
    </div>
  );
}

export const minHeight = 340;
