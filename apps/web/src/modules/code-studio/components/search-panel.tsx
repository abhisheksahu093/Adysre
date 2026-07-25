'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CaseSensitive, ChevronDown, ChevronRight, Regex, Replace, Search } from 'lucide-react';
import { cn } from 'adysre';
import { useStudioStore } from '../store/use-studio-store';
import { editorBridge } from '../services/editor-bridge';
import { countMatches, replaceInContent, searchProject, type SearchOptions } from '../services/search';
import { baseName } from '../utils/files';

/**
 * Project-wide search and replace, in the sidebar. Results are grouped by file
 * and jump the editor to the match on click; Replace all rewrites every file's
 * content through the store (so it is one undoable-per-file edit and the preview
 * recompiles like any other change).
 */
export function SearchPanel() {
  const t = useTranslations('codeStudio');
  const project = useStudioStore((s) => s.project);
  const openFile = useStudioStore((s) => s.openFile);
  const updateFileContent = useStudioStore((s) => s.updateFileContent);

  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');
  const [options, setOptions] = useState<SearchOptions>({ caseSensitive: false, regex: false });
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const results = useMemo(
    () => (project ? searchProject(project.files, query, options) : []),
    [project, query, options],
  );
  const total = countMatches(results);

  const jump = (fileId: string, line: number, column: number) => {
    openFile(fileId);
    requestAnimationFrame(() => editorBridge.revealPosition?.(line, column));
  };

  const replaceAll = () => {
    for (const file of results) {
      const source = project?.files.find((f) => f.id === file.fileId);
      if (!source) continue;
      updateFileContent(file.fileId, replaceInContent(source.content, query, replacement, options));
    }
    setQuery('');
  };

  const toggleFile = (path: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('search.title')}</span>
      </div>

      <div className="space-y-2 px-3">
        <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-xs outline-none"
          />
          <button
            type="button"
            aria-label={t('search.caseSensitive')}
            aria-pressed={options.caseSensitive}
            onClick={() => setOptions((o) => ({ ...o, caseSensitive: !o.caseSensitive }))}
            className={cn('rounded p-1', options.caseSensitive ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground')}
          >
            <CaseSensitive className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={t('search.regex')}
            aria-pressed={options.regex}
            onClick={() => setOptions((o) => ({ ...o, regex: !o.regex }))}
            className={cn('rounded p-1', options.regex ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground')}
          >
            <Regex className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-border bg-background px-2">
          <Replace className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder={t('search.replacePlaceholder')}
            aria-label={t('search.replacePlaceholder')}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-xs outline-none"
          />
          <button
            type="button"
            onClick={replaceAll}
            disabled={total === 0}
            className="rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
          >
            {t('search.replaceAll')}
          </button>
        </div>

        {query && (
          <p className="text-[11px] text-muted-foreground">
            {t('search.summary', { matches: total, files: results.length })}
          </p>
        )}
      </div>

      <ul className="mt-1 flex-1 overflow-y-auto px-1 pb-3 text-xs">
        {results.map((file) => {
          const isCollapsed = collapsed.has(file.path);
          return (
            <li key={file.fileId}>
              <button
                type="button"
                onClick={() => toggleFile(file.path)}
                className="flex w-full items-center gap-1 rounded px-2 py-1 font-medium text-muted-foreground hover:text-foreground"
              >
                {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" aria-hidden /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                <span className="truncate">{baseName(file.path)}</span>
                <span className="ml-1 rounded-full bg-muted px-1.5 text-[10px]">{file.matches.length}</span>
              </button>
              {!isCollapsed && (
                <ul>
                  {file.matches.map((match, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => jump(file.fileId, match.line, match.column)}
                        className="flex w-full items-center gap-2 rounded px-2 py-1 pl-7 text-left text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <span className="shrink-0 tabular-nums text-[10px] opacity-60">{match.line}</span>
                        <span className="truncate font-mono">{match.preview}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
