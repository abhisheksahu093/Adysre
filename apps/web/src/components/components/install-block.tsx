'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import { useClipboard } from '@/hooks/use-clipboard';
import type { Dependency } from '@/data/components';

/** Install command per manager. The spec lists all four. */
const MANAGERS = [
  { id: 'npm', label: 'npm', cmd: (pkgs: string) => `npm install ${pkgs}` },
  { id: 'pnpm', label: 'pnpm', cmd: (pkgs: string) => `pnpm add ${pkgs}` },
  { id: 'yarn', label: 'yarn', cmd: (pkgs: string) => `yarn add ${pkgs}` },
  { id: 'bun', label: 'bun', cmd: (pkgs: string) => `bun add ${pkgs}` },
] as const;

type ManagerId = (typeof MANAGERS)[number]['id'];

export function InstallBlock({ dependencies }: { dependencies: Dependency[] }) {
  const t = useTranslations('components');
  const tCommon = useTranslations('common');
  const [manager, setManager] = useState<ManagerId>('pnpm');
  const { copy, copied } = useClipboard();

  // Version-pinned so a copied command installs what the snippet was written
  // against, not whatever `latest` happens to be today.
  const pkgs = dependencies.map((d) => `${d.name}@${d.version}`).join(' ');
  const command = MANAGERS.find((m) => m.id === manager)!.cmd(pkgs);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex items-center gap-1 border-b border-border px-2 py-2">
          <div role="tablist" aria-label={t('packageManager')} className="flex flex-1 gap-1">
            {MANAGERS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={manager === m.id}
                onClick={() => setManager(m.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  manager === m.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={copied ? tCommon('copied') : tCommon('copy')}
            onClick={() => void copy(command)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? tCommon('copied') : tCommon('copy')}</span>
          </Button>
        </div>
        <pre className="overflow-x-auto bg-muted px-4 py-3 font-mono text-xs text-foreground">
          {command}
        </pre>
      </div>

      <ul className="space-y-1.5">
        {dependencies.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-xs">
            <a
              href={d.url ?? `https://www.npmjs.com/package/${d.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
            >
              {d.name}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
            <span className="font-mono text-muted-foreground">{d.version}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
