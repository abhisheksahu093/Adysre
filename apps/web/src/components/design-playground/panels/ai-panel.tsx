'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Sparkles } from 'lucide-react';
import { toTemplate, type AiSection } from '@/lib/design-playground/ai-template';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * The AI panel: describe a section, get an editable one on the canvas.
 *
 * The model never touches the document. It returns layout DATA, which
 * `toTemplate` re-validates and clamps, and which is then inserted through the
 * same command every manual placement uses - so an AI section is undoable,
 * selectable and editable exactly like a hand-drawn one (PRD §7.10).
 */

/** Starting points, so an empty panel is not a blank page. */
const EXAMPLES = ['hero', 'pricing', 'features', 'cta'] as const;

type Status = 'idle' | 'working' | 'error';

export function AiPanel() {
  const t = useTranslations('designPlayground');
  const insertTemplate = useDesignDocumentStore((s) => s.insertTemplate);

  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorKey, setErrorKey] = useState<string>('failed');

  async function generate(value: string): Promise<void> {
    const trimmed = value.trim();
    if (trimmed.length === 0 || status === 'working') return;

    setStatus('working');
    try {
      const response = await fetch('/api/design-playground/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        // The route's error codes map 1:1 onto messages, so an unconfigured
        // deployment reads differently from a rate limit or a refusal.
        setErrorKey(body.error ?? 'failed');
        setStatus('error');
        return;
      }

      const { section } = (await response.json()) as { section: AiSection };
      insertTemplate(toTemplate(section));
      setStatus('idle');
    } catch {
      setErrorKey('failed');
      setStatus('error');
    }
  }

  const working = status === 'working';

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed text-muted-foreground">{t('panels.ai.description')}</p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void generate(prompt);
        }}
        className="space-y-2"
      >
        <label htmlFor="ai-prompt" className="sr-only">
          {t('panels.ai.label')}
        </label>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            // ⌘/Ctrl+Enter submits; plain Enter stays a newline, because a
            // prompt is prose and often runs to several lines.
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              void generate(prompt);
            }
          }}
          rows={4}
          maxLength={600}
          placeholder={t('panels.ai.placeholder')}
          className="w-full resize-y rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <button
          type="submit"
          disabled={working || prompt.trim().length === 0}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {working ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : (
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
          )}
          {working ? t('panels.ai.working') : t('panels.ai.generate')}
        </button>
      </form>

      {status === 'error' && (
        <p role="alert" className="rounded-md bg-danger/10 px-2 py-1.5 text-[11px] text-danger">
          {t(`panels.ai.errors.${errorKey}`)}
        </p>
      )}

      <div>
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {t('panels.ai.examplesTitle')}
        </h3>
        <ul className="mt-1.5 space-y-1">
          {EXAMPLES.map((example) => {
            const value = t(`panels.ai.examples.${example}`);
            return (
              <li key={example}>
                <button
                  type="button"
                  disabled={working}
                  onClick={() => {
                    setPrompt(value);
                    void generate(value);
                  }}
                  className="w-full rounded-md border border-border px-2 py-1.5 text-left text-[11px] leading-snug text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {value}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
