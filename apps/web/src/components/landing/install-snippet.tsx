'use client';

import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { cn } from 'adysre';
import { useClipboard } from '@/hooks/use-clipboard';

interface InstallSnippetProps {
  /** Step number shown in the corner chip. */
  step: number;
  title: string;
  description: string;
  /** Filename shown in the window bar, e.g. `app/globals.css`. */
  filename: string;
  /** Raw source — what Copy hands over. */
  code: string;
  /** Shiki-rendered HTML, highlighted on the server. */
  html: string;
  className?: string;
}

/**
 * One setup step: a titled window with highlighted code and a copy button.
 *
 * The highlighting arrives as pre-rendered HTML for the same reason the
 * component detail page does it that way — Shiki's grammars are megabytes, and
 * shipping them to colour eight static lines would cost more than the page.
 * This component only owns the copy interaction.
 */
export function InstallSnippet({
  step,
  title,
  description,
  filename,
  code,
  html,
  className,
}: InstallSnippetProps) {
  const t = useTranslations('landing.install');
  const { copy, copied } = useClipboard();

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card',
        'transition-colors hover:border-primary/40',
        className,
      )}
    >
      <div className="flex items-start gap-3 p-5 sm:p-6">
        <span
          aria-hidden
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary"
        >
          {step}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mt-auto border-t border-border bg-muted/30">
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <span className="truncate font-mono text-[11px] text-muted-foreground">{filename}</span>
          <button
            type="button"
            onClick={() => void copy(code)}
            aria-label={copied ? t('copied') : t('copy')}
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground',
              'transition-colors hover:bg-muted hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" aria-hidden />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>

        {/* Shiki output is generated on our server from our own strings; the
            `shiki-code` class carries the dual-theme swap defined in globals.css. */}
        <div
          className="shiki-code max-h-80 overflow-auto px-4 pb-4 text-[13px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
