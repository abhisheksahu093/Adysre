'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { cn } from 'adysre';
import { useClipboard } from '@/hooks/use-clipboard';
import type { PackageManager } from '@/data/install';

/**
 * The install line: a package-manager tab strip over a terminal-styled command
 * with one-click copy.
 *
 * Client Component for the two pieces of state it genuinely needs - which tab is
 * active, and whether the copy just fired. The commands themselves are computed
 * on the server and handed in, so no catalogue reaches this bundle.
 *
 * The tab strip is a real `tablist`: arrow keys move between managers and only
 * the active tab is in the tab order, which is what a keyboard user expects from
 * something that looks like this. The `$` prompt is decorative and marked so,
 * because copying it would break the command it decorates.
 */
export function InstallCommand({ managers }: { managers: PackageManager[] }) {
  const t = useTranslations('landing.install');
  const { copy, copied } = useClipboard();
  const [active, setActive] = useState(managers[0]?.id ?? 'npm');

  const current = managers.find((m) => m.id === active) ?? managers[0];
  if (!current) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const i = managers.findIndex((m) => m.id === active);
    const next = managers[(i + delta + managers.length) % managers.length];
    if (next) setActive(next.id);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Token-coloured halo. Decorative, and behind the card so it never eats a click. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 opacity-70 blur-md"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/5">
        <div
          role="tablist"
          aria-label={t('tabsLabel')}
          onKeyDown={onKeyDown}
          className="flex items-center gap-1 border-b border-border bg-muted/40 px-2"
        >
          {managers.map((manager) => {
            const selected = manager.id === active;
            return (
              <button
                key={manager.id}
                role="tab"
                type="button"
                id={`install-tab-${manager.id}`}
                aria-selected={selected}
                aria-controls="install-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(manager.id)}
                className={cn(
                  'relative px-3.5 py-2.5 font-mono text-xs transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
                  selected
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {manager.id}
                {selected && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          id="install-panel"
          role="tabpanel"
          aria-labelledby={`install-tab-${current.id}`}
          className="flex items-center gap-3 px-4 py-4 sm:px-5"
        >
          <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground sm:text-base">
            <span aria-hidden className="mr-2 select-none text-primary">
              $
            </span>
            {current.command}
          </code>

          <button
            type="button"
            onClick={() => void copy(current.command)}
            aria-label={copied ? t('copied') : t('copy')}
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border',
              'text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
