'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy, Download, ExternalLink, Loader2, Lock, Sparkles } from 'lucide-react';
import { Button, Dialog } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { useClipboard } from '@/hooks/use-clipboard';
import { TEMPLATE_DOWNLOADS, type TemplateDownloadId, type TemplateSummary } from '@/data/templates/types';

/**
 * Template detail dialog: preview it, clone the idea, or take the code.
 *
 * The zip is built in the browser from the template's embedded sources, so a
 * download costs no round trip - but the scaffold module is ~200 KB of source
 * strings, so it is imported on first use rather than with the gallery.
 */
export function TemplateDialog({
  template,
  onClose,
}: {
  template: TemplateSummary | null;
  onClose: () => void;
}) {
  const t = useTranslations('templates');
  const { copy, copied } = useClipboard();
  const [busy, setBusy] = useState<TemplateDownloadId | null>(null);
  const [failed, setFailed] = useState(false);

  if (!template) return null;

  const previewHref = `/template-preview/${template.slug}`;

  const download = async (target: TemplateDownloadId) => {
    setBusy(target);
    setFailed(false);
    try {
      const [{ buildTemplateDownload }, { createZip, downloadBlob }] = await Promise.all([
        import('@/lib/templates/scaffold'),
        import('@/lib/zip'),
      ]);

      const entries = buildTemplateDownload(template.slug, target);
      downloadBlob(`${template.slug}-${target}.zip`, createZip(entries));
    } catch {
      // A failed download must say so: a button that silently does nothing
      // reads as a broken app.
      setFailed(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      title={template.name}
      description={t(`taglines.${template.taglineKey}`)}
      className="sm:max-w-3xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('actions.close')}
          </Button>
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {t('actions.openTab')}
          </a>
        </>
      }
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
          <div className="relative h-64 w-full overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-[1100px] w-[1440px] origin-top-left scale-[0.46]">
              <iframe
                src={previewHref}
                title={`${template.name} preview`}
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>

        {template.pages.length > 1 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('detail.pages')}
            </h3>
            {/* Each page opens on its own, so a multipage template can be
                inspected page by page rather than only from its home. */}
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {template.pages.map((page) => (
                <li key={page.id}>
                  <a
                    href={`${previewHref}?page=${page.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {page.label}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('detail.sections')}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {template.sections.map((section) => (
              <li
                key={section}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
              >
                {t(`sections.${section}`)}
              </li>
            ))}
          </ul>
        </section>

        {/*
          A locked template shows what it would give you and where to get it,
          rather than dead controls. The prompt is genuinely absent from the
          payload here - the server withheld it - so there is nothing to hide.
        */}
        {template.locked ? (
          <section className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Lock className="h-4 w-4 text-primary" aria-hidden />
              {t('locked.title')}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('locked.body')}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden />
                {t('locked.included.preview')}
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {t('locked.included.prompt')}
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {t('locked.included.download')}
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              {t('locked.cta')}
            </Link>
          </section>
        ) : (
          <>
            <section>
              {/* The action sits on the heading row so the prompt keeps the full
                  width - a narrow column would wrap every line of it. */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('detail.prompt')}
                </h3>
                <Button variant="outline" size="sm" onClick={() => void copy(template.prompt ?? '')}>
                  {copied ? (
                    <Check className="h-4 w-4" aria-hidden />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden />
                  )}
                  {copied ? t('actions.copied') : t('actions.copyPrompt')}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t('detail.promptHint')}</p>
              <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
                {template.prompt}
              </pre>
            </section>

            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('detail.download')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{t('detail.downloadHint')}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {/* Only the formats this template actually ships: a button that
                    produced an empty zip would be worse than its absence. */}
                {TEMPLATE_DOWNLOADS.filter((format) => template.downloads.includes(format.id)).map(
                  (format) => (
                    <Button
                      key={format.id}
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => void download(format.id)}
                      className="justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {busy === format.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                          <Download className="h-4 w-4" aria-hidden />
                        )}
                        {t(`downloads.${format.id}`)}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {t(`kinds.${format.kind}`)}
                      </span>
                    </Button>
                  ),
                )}
              </div>
              <p aria-live="polite" className="mt-2 min-h-5 text-xs text-danger">
                {failed ? t('detail.downloadFailed') : ''}
              </p>
            </section>
          </>
        )}
      </div>
    </Dialog>
  );
}
