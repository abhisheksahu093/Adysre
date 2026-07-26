import { getTranslations } from 'next-intl/server';
import { GUIDE_STEPS, type GuideCopy } from '@/data/rules-guide';
import { CopyButton } from '@/components/ui/copy-button';
import { DownloadGuide } from './download-guide';

/**
 * How to set up and work with the engine.
 *
 * A Server Component: eight code blocks and some prose, so shipping it to the
 * browser would cost a chunk to achieve nothing. Only the copy and download
 * buttons are interactive.
 *
 * The copy is resolved here and handed to the download button as a prop, so the
 * Markdown a visitor downloads is the page they were reading, in the language
 * they were reading it in - and there is no second copy of the instructions to
 * go stale.
 */
export async function RulesUsageGuide({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'rules' });

  const copy: GuideCopy = {
    title: t('guide.title'),
    intro: t('guide.intro'),
    packagesTitle: t('sections.packages'),
    steps: Object.fromEntries(
      GUIDE_STEPS.map((step) => [
        step.id,
        { title: t(`guide.steps.${step.id}.title`), body: t(`guide.steps.${step.id}.body`) },
      ]),
    ),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-3xl text-sm text-muted-foreground">{copy.intro}</p>
        <DownloadGuide copy={copy} filename="adysre-rules-engine.md" label={t('guide.download')} />
      </div>

      <ol className="flex list-none flex-col gap-6 p-0">
        {GUIDE_STEPS.map((step, index) => (
          <li key={step.id} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-medium text-foreground">
                {copy.steps[step.id]?.title ?? step.id}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground">{copy.steps[step.id]?.body ?? ''}</p>

            <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
              <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
                <span className="font-mono text-xs text-muted-foreground">{step.filename}</span>
                <CopyButton value={step.code} />
              </div>
              {/* Scrolls inside its own box: a long line must not make the page
                  scroll sideways on a phone. */}
              <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">
                {step.code}
              </pre>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
