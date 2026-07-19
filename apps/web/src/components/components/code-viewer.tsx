'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Download, Check, Copy } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import { useClipboard } from '@/hooks/use-clipboard';
import type { Framework } from '@/data/components';

export interface CodeTab {
  framework: Framework;
  label: string;
  /** Raw source - what Copy and Download hand over. */
  code: string;
  /** Shiki-rendered HTML, highlighted on the server. */
  html: string;
  /** File extension for the download, e.g. 'tsx'. */
  ext: string;
}

interface CodeViewerProps {
  tabs: CodeTab[];
  /** Used to name the downloaded file. */
  slug: string;
}

/**
 * Framework tabs + highlighted source, with copy and download.
 *
 * The highlighting arrives as pre-rendered HTML: Shiki's grammars are megabytes
 * and there is no reason to ship them to a browser to colour static text. This
 * component only switches which pre-rendered block is visible.
 */
export function CodeViewer({ tabs, slug }: CodeViewerProps) {
  const t = useTranslations('components');
  const tCommon = useTranslations('common');
  const [active, setActive] = useState<Framework>(tabs[0]?.framework ?? 'html');
  const { copy, copied } = useClipboard();

  const current = tabs.find((tab) => tab.framework === active) ?? tabs[0];
  if (!current) return null;

  function download() {
    if (!current) return;
    // Blob + object URL: no server round-trip for text we already hold.
    const blob = new Blob([current.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.${current.ext}`;
    a.click();
    // Revoke or the blob leaks for the life of the document.
    URL.revokeObjectURL(url);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-2">
        {/* Horizontal scroll rather than wrap: six tabs must not become two
            rows on a phone and push the code off-screen. */}
        <div
          role="tablist"
          aria-label={t('frameworks')}
          className="flex flex-1 gap-1 overflow-x-auto py-2"
        >
          {tabs.map((tab) => (
            <button
              key={tab.framework}
              type="button"
              role="tab"
              id={`tab-${tab.framework}`}
              aria-selected={active === tab.framework}
              aria-controls={`panel-${tab.framework}`}
              onClick={() => setActive(tab.framework)}
              className={cn(
                'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active === tab.framework
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('downloadFile', { ext: current.ext })}
            title={t('downloadFile', { ext: current.ext })}
            onClick={download}
            className="text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={copied ? tCommon('copied') : tCommon('copy')}
            onClick={() => void copy(current.code)}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? tCommon('copied') : tCommon('copy')}</span>
          </Button>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.framework}`}
        aria-labelledby={`tab-${current.framework}`}
        // `shiki-code` styles line numbers and the light/dark swap in globals.css.
        // No vertical cap: the block grows to the code's height so the PAGE
        // scrolls, not a nested box — a fixed max-height trapped page scroll on
        // long snippets. Only long lines scroll, horizontally.
        className="shiki-code overflow-x-auto text-xs"
        // Shiki output, generated server-side from our own registry - not user
        // input. It is <pre><code> with spans; nothing here is attacker-supplied.
        dangerouslySetInnerHTML={{ __html: current.html }}
      />
    </div>
  );
}
