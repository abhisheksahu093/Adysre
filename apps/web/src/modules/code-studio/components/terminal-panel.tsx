'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStudioStore } from '../store/use-studio-store';
import { findByPath } from '../utils/files';

/**
 * A project command console.
 *
 * There is no backend, so this is not a system shell: it is a real REPL over the
 * project's virtual file system and the studio's own actions (ls, cat, new, rm,
 * open, run, save, download, format). Every command actually mutates the store
 * or performs the action, so nothing here is a mock.
 */
export interface TerminalActions {
  run: () => void;
  save: () => void;
  download: () => void;
  format: () => void;
}

interface Line {
  text: string;
  kind: 'input' | 'output' | 'error';
}

const HELP = [
  'Commands:',
  '  help              show this help',
  '  ls                list files',
  '  cat <path>        print a file',
  '  open <path>       open a file in the editor',
  '  new <path>        create a file',
  '  rm <path>         delete a file',
  '  run               rebuild the preview',
  '  save              save the project',
  '  download          download the project as a zip',
  '  format            format the active file',
  '  clear             clear the terminal',
];

export function TerminalPanel({ actions }: { actions: TerminalActions }) {
  const [lines, setLines] = useState<Line[]>([{ text: 'ADYSRE Studio terminal. Type "help".', kind: 'output' }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const emit = (text: string, kind: Line['kind'] = 'output') => setLines((prev) => [...prev, { text, kind }]);
  const emitAll = (texts: string[]) => setLines((prev) => [...prev, ...texts.map((text) => ({ text, kind: 'output' as const }))]);

  const run = (raw: string) => {
    const line = raw.trim();
    setLines((prev) => [...prev, { text: line, kind: 'input' }]);
    if (!line) return;

    const [cmd, ...rest] = line.split(/\s+/);
    const arg = rest.join(' ');
    const store = useStudioStore.getState();
    const project = store.project;

    switch (cmd) {
      case 'help':
        emitAll(HELP);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'ls':
        if (project) emitAll(project.files.map((f) => f.path).sort());
        break;
      case 'cat': {
        const file = project && findByPath(project.files, arg);
        if (file) emitAll(file.content.split('\n'));
        else emit(`cat: ${arg}: no such file`, 'error');
        break;
      }
      case 'open': {
        const file = project && findByPath(project.files, arg);
        if (file) {
          store.openFile(file.id);
          emit(`opened ${file.path}`);
        } else emit(`open: ${arg}: no such file`, 'error');
        break;
      }
      case 'new': {
        const created = store.createFile(arg);
        emit(created ? `created ${created.path}` : `new: could not create ${arg}`, created ? 'output' : 'error');
        break;
      }
      case 'rm': {
        const file = project && findByPath(project.files, arg);
        if (file) {
          store.deleteFile(file.id);
          emit(`removed ${file.path}`);
        } else emit(`rm: ${arg}: no such file`, 'error');
        break;
      }
      case 'run':
        actions.run();
        emit('rebuilding preview');
        break;
      case 'save':
        actions.save();
        emit('saved');
        break;
      case 'download':
        actions.download();
        emit('downloading zip');
        break;
      case 'format':
        actions.format();
        emit('formatted active file');
        break;
      case 'echo':
        emit(arg);
        break;
      default:
        emit(`${cmd}: command not found. Type "help".`, 'error');
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      if (input.trim()) setHistory((prev) => [...prev, input.trim()]);
      setInput('');
      setHistoryIndex(null);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? '');
      }
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0b0b0f] font-mono text-xs text-zinc-200" onClick={() => inputRef.current?.focus()}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2">
        {lines.map((line, index) => (
          <div
            key={index}
            className={
              line.kind === 'error' ? 'text-red-400' : line.kind === 'input' ? 'text-emerald-400' : 'text-zinc-300'
            }
          >
            {line.kind === 'input' ? `$ ${line.text}` : line.text}
          </div>
        ))}
        <div className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent text-zinc-100 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
