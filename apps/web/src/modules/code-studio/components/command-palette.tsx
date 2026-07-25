'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, CornerDownLeft, FileCode2, Search, TerminalSquare } from 'lucide-react';
import { cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import { fuzzyMatch, type StudioCommand } from '../services/commands';
import { baseName } from '../utils/files';

type Row = { kind: 'file'; id: string; label: string; sub: string } | { kind: 'command'; command: StudioCommand };

/**
 * VS Code-style command palette. A leading ">" switches from "open file" to
 * "run command"; the palette opens in the right mode for the shortcut used
 * (Ctrl+P files, Ctrl+Shift+P commands). Keyboard-first: arrows move, Enter
 * runs, Escape closes.
 */
export function CommandPalette({
  open,
  mode,
  commands,
  onClose,
}: {
  open: boolean;
  mode: 'files' | 'commands';
  commands: StudioCommand[];
  onClose: () => void;
}) {
  const t = useTranslations('codeStudio');
  const project = useStudioStore((s) => s.project);
  const openFile = useStudioStore((s) => s.openFile);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery(mode === 'commands' ? '>' : '');
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, mode]);

  const commandMode = query.startsWith('>');
  const term = commandMode ? query.slice(1) : query;

  const rows = useMemo<Row[]>(() => {
    if (commandMode) {
      return commands
        .filter((command) => fuzzyMatch(term, command.title))
        .map((command) => ({ kind: 'command', command }));
    }
    return (project?.files ?? [])
      .filter((file) => fuzzyMatch(term, file.path))
      .map((file) => ({ kind: 'file', id: file.id, label: baseName(file.path), sub: file.path }));
  }, [commandMode, term, commands, project]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const choose = (row: Row) => {
    if (row.kind === 'file') openFile(row.id);
    else row.command.run();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(rows.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = rows[active];
      if (row) choose(row);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 pt-[12vh]" onMouseDown={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          {commandMode ? (
            <TerminalSquare className="h-4 w-4 text-muted-foreground" aria-hidden />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t(commandMode ? 'palette.commandPlaceholder' : 'palette.filePlaceholder')}
            aria-label={t('palette.title')}
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <ul ref={listRef} className="max-h-80 overflow-y-auto p-1.5">
          {rows.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t('palette.empty')}</li>
          ) : (
            rows.map((row, index) => (
              <li key={row.kind === 'file' ? row.id : row.command.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(row)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    index === active ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  {row.kind === 'file' ? (
                    <>
                      <FileCode2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="truncate">{row.label}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">{row.sub}</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="truncate">{row.command.title}</span>
                      {row.command.hint && (
                        <span className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {row.command.hint}
                        </span>
                      )}
                    </>
                  )}
                  {index === active && <CornerDownLeft className="ml-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
