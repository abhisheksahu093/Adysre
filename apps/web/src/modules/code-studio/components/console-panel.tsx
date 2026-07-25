'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Ban, Copy, Info, Terminal, TriangleAlert } from 'lucide-react';
import { Tooltip, cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import type { ConsoleLevel } from '../types';

type PanelTab = 'console' | 'problems';

const LEVEL_STYLE: Record<ConsoleLevel, string> = {
  log: 'text-foreground',
  info: 'text-sky-400',
  debug: 'text-muted-foreground',
  warn: 'text-amber-400',
  error: 'text-danger',
  table: 'text-foreground',
};

function LevelIcon({ level }: { level: ConsoleLevel }) {
  if (level === 'error') return <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" aria-hidden />;
  if (level === 'warn') return <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />;
  if (level === 'info') return <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden />;
  return <span className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />;
}

/**
 * Bottom panel: the captured console and the compile/runtime problems, each a
 * live view of the store. Copy exports the whole log; clear resets it.
 */
export function ConsolePanel() {
  const entries = useStudioStore((s) => s.console);
  const diagnostics = useStudioStore((s) => s.diagnostics);
  const clearConsole = useStudioStore((s) => s.clearConsole);
  const [tab, setTab] = useState<PanelTab>('console');
  const [filter, setFilter] = useState<ConsoleLevel | 'all'>('all');

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.level === filter)),
    [entries, filter],
  );

  const copyAll = () => {
    const text = entries.map((e) => `[${e.level}] ${e.parts.join(' ')}`).join('\n');
    void navigator.clipboard?.writeText(text);
  };

  return (
    <div className="flex h-full flex-col bg-card/30">
      <div className="flex h-8 shrink-0 items-center gap-1 border-b border-border px-2 text-xs">
        <button
          type="button"
          onClick={() => setTab('console')}
          className={cn(
            'flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors',
            tab === 'console' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Terminal className="h-3.5 w-3.5" aria-hidden />
          Console
          {entries.length > 0 && <span className="rounded-full bg-muted px-1.5 text-[10px]">{entries.length}</span>}
        </button>
        <button
          type="button"
          onClick={() => setTab('problems')}
          className={cn(
            'flex items-center gap-1.5 rounded px-2 py-1 font-medium transition-colors',
            tab === 'problems' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <TriangleAlert className="h-3.5 w-3.5" aria-hidden />
          Problems
          {diagnostics.length > 0 && (
            <span className="rounded-full bg-danger/20 px-1.5 text-[10px] text-danger">{diagnostics.length}</span>
          )}
        </button>

        {tab === 'console' && (
          <div className="ml-auto flex items-center gap-0.5">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ConsoleLevel | 'all')}
              aria-label="Filter console"
              className="rounded border border-border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground outline-none"
            >
              <option value="all">All</option>
              <option value="log">Logs</option>
              <option value="warn">Warnings</option>
              <option value="error">Errors</option>
              <option value="info">Info</option>
            </select>
            <Tooltip label="Copy console" side="top">
              <button type="button" aria-label="Copy console" onClick={copyAll} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Copy className="h-3.5 w-3.5" aria-hidden />
              </button>
            </Tooltip>
            <Tooltip label="Clear console" side="top">
              <button type="button" aria-label="Clear console" onClick={clearConsole} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <Ban className="h-3.5 w-3.5" aria-hidden />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-1 font-mono text-xs">
        {tab === 'console' ? (
          visible.length === 0 ? (
            <p className="px-2 py-3 text-muted-foreground">Console output appears here.</p>
          ) : (
            <ul>
              {visible.map((entry) => (
                <li key={entry.id} className={cn('flex gap-2 border-b border-border/40 px-2 py-1', LEVEL_STYLE[entry.level])}>
                  <LevelIcon level={entry.level} />
                  <span className="whitespace-pre-wrap break-words">{entry.parts.join(' ')}</span>
                </li>
              ))}
            </ul>
          )
        ) : diagnostics.length === 0 ? (
          <p className="px-2 py-3 text-muted-foreground">No problems detected.</p>
        ) : (
          <ul>
            {diagnostics.map((diagnostic, index) => (
              <li key={index} className="flex gap-2 px-2 py-1 text-danger">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="whitespace-pre-wrap break-words">
                  {diagnostic.file ? `${diagnostic.file}${diagnostic.line ? `:${diagnostic.line}` : ''}: ` : ''}
                  {diagnostic.message}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
