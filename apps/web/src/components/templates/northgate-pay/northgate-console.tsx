'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  NORTHGATE_LABELS,
  type NorthgateSnippet,
} from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the API console.
 *
 * A fake request and response, side by side, in the mono face. Deliberately
 * NOT syntax-highlighted: a highlighter means a parser, a parser means a
 * dependency, and the texture this design wants comes from the mono face, the
 * gutter rule and the numbered lines rather than from colour. The bodies are
 * plain strings printed inside `<pre>`, so nothing here can throw.
 *
 * When more than one snippet is passed the panel grows a real tablist - roles,
 * `aria-selected` and `aria-controls` - because these are tabs, not links.
 */
export function NorthgateConsole({ snippets }: { snippets: NorthgateSnippet[] }) {
  const [activeId, setActiveId] = useState(snippets[0]?.id ?? '');
  const active = snippets.find((snippet) => snippet.id === activeId) ?? snippets[0];
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');

  if (!active) return null;

  const onCopy = () => {
    // Guarded rather than assumed: the Clipboard API is unavailable on
    // insecure origins, and a template dropped into any host may well be on
    // one. Failure is reported in the same live region as success.
    void (async () => {
      try {
        await navigator.clipboard.writeText(active.request);
        setCopied('done');
      } catch {
        setCopied('failed');
      }
    })();
  };

  const select = (id: string) => {
    setActiveId(id);
    setCopied('idle');
  };

  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{NORTHGATE_LABELS.consoleEyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{NORTHGATE_LABELS.consoleTitle}</h2>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {NORTHGATE_LABELS.consoleSubtitle}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <div className="ngp-console overflow-hidden">
            {/* Chrome bar: the endpoint on the left, the copy action on the
                right. The three dots are decoration and are hidden from AT. */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ngp-deep-rule)] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-4">
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ngp-deep-rule-strong)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ngp-deep-rule-strong)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ngp-deep-rule-strong)]" />
                </span>
                <p className="ngp-mono text-[12px] text-[var(--ngp-on-deep-soft)]">
                  <span className="text-[var(--ngp-cyan-bright)]">{active.method}</span>{' '}
                  {active.path}
                </p>
              </div>

              <button
                type="button"
                onClick={onCopy}
                className="ngp-mono inline-flex items-center gap-2 rounded-full border border-[var(--ngp-deep-rule-strong)] px-4 py-2 text-[11.5px] tracking-[0.1em] text-[var(--ngp-on-deep)] transition-colors hover:border-[var(--ngp-cyan-bright)] hover:text-[var(--ngp-cyan-bright)]"
              >
                {copied === 'done' ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
                {NORTHGATE_LABELS.consoleCopy}
              </button>
            </div>

            {snippets.length > 1 && (
              <div
                role="tablist"
                aria-label={NORTHGATE_LABELS.consoleEyebrow}
                className="flex flex-wrap gap-2 border-b border-[var(--ngp-deep-rule)] px-5 py-3 sm:px-7"
              >
                {snippets.map((snippet) => {
                  const selected = snippet.id === active.id;
                  return (
                    <button
                      key={snippet.id}
                      type="button"
                      role="tab"
                      id={`northgate-tab-${snippet.id}`}
                      aria-selected={selected}
                      aria-controls={`northgate-panel-${snippet.id}`}
                      onClick={() => select(snippet.id)}
                      className={`rounded-full px-4 py-1.5 text-[12.5px] transition-colors ${
                        selected
                          ? 'bg-[var(--ngp-on-deep)] text-[var(--ngp-deep)]'
                          : 'text-[var(--ngp-on-deep-faint)] hover:text-[var(--ngp-on-deep)]'
                      }`}
                    >
                      {snippet.title}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              id={`northgate-panel-${active.id}`}
              {...(snippets.length > 1
                ? { role: 'tabpanel' as const, 'aria-labelledby': `northgate-tab-${active.id}` }
                : {})}
              className="grid lg:grid-cols-2"
            >
              {(
                [
                  { label: NORTHGATE_LABELS.consoleRequest, body: active.request },
                  { label: NORTHGATE_LABELS.consoleResponse, body: active.response },
                ] as const
              ).map((pane, index) => (
                <div
                  key={pane.label}
                  className={
                    index === 0
                      ? 'border-b border-[var(--ngp-deep-rule)] lg:border-b-0 lg:border-r'
                      : ''
                  }
                >
                  <p className="ngp-mono border-b border-[var(--ngp-deep-rule)] px-5 py-3 text-[10.5px] uppercase tracking-[0.2em] text-[var(--ngp-on-deep-faint)] sm:px-7">
                    {pane.label}
                  </p>
                  {/* Horizontal scroll is confined to the code block itself, so
                      a long line never makes the page scroll sideways. */}
                  <div className="overflow-x-auto px-5 py-6 sm:px-7">
                    <pre className="ngp-code">{pane.body}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p
            aria-live="polite"
            className="ngp-mono mt-4 min-h-5 text-[12px] text-[var(--ngp-indigo-deep)]"
          >
            {copied === 'done' ? NORTHGATE_LABELS.consoleCopied : ''}
            {copied === 'failed' ? NORTHGATE_LABELS.consoleCopyFailed : ''}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
