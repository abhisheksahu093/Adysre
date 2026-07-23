'use client';

/**
 * Live preview for `file-tree-search-filter`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FileTreeSearchFilterProps {
  nodes: TreeNode[];
  label?: string;
}

// A matching file must drag its folders into view, so a folder survives the
// filter when its own name matches OR any descendant does - never on its own.
function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  const out: TreeNode[] = [];
  for (const node of nodes) {
    const children = node.children;
    if (children) {
      if (node.name.toLowerCase().includes(q)) {
        out.push(node);
        continue;
      }
      const kept = filterTree(children, q);
      if (kept.length > 0) out.push({ name: node.name, children: kept });
    } else if (node.name.toLowerCase().includes(q)) {
      out.push(node);
    }
  }
  return out;
}

function Highlight({ text, q }: { text: string; q: string }) {
  const idx = q ? text.toLowerCase().indexOf(q) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-200 text-inherit dark:bg-yellow-500/30 dark:text-yellow-100">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function TreeItem({ node, level, q, expandAll }: { node: TreeNode; level: number; q: string; expandAll: boolean }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const isOpen = expandAll || open;

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">
            <Highlight text={node.name} q={q} />
          </span>
        </span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={isOpen}>
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
            isOpen
              ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none'
              : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'
          }
        >
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true">
          <path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z" />
        </svg>
        <span className="truncate font-medium text-gray-900 dark:text-gray-100">
          <Highlight text={node.name} q={q} />
        </span>
      </button>
      {isOpen ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} q={q} expandAll={expandAll} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeSearchFilter({ nodes, label = 'Search files' }: FileTreeSearchFilterProps) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = filterTree(nodes, q);

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <div className="relative mb-2">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        >
          <path d="M7 2a5 5 0 0 1 3.9 8.1l3 3-1 1-3-3A5 5 0 1 1 7 2zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter files…"
          aria-label={label}
          className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      {filtered.length > 0 ? (
        <ul role="tree" aria-label="Files" className="space-y-0.5">
          {filtered.map((node, i) => (
            <TreeItem key={node.name + i} node={node} level={0} q={q} expandAll={q.length > 0} />
          ))}
        </ul>
      ) : (
        <p className="px-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No files match “{query}”.</p>
      )}
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'src',
    children: [
      { name: 'components', children: [{ name: 'button.tsx' }, { name: 'modal.tsx' }] },
      { name: 'utils', children: [{ name: 'format-date.ts' }, { name: 'clsx.ts' }] },
      { name: 'index.ts' },
    ],
  },
  { name: 'package.json' },
];

export default function FileTreeSearchFilterPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeSearchFilter nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 400;
