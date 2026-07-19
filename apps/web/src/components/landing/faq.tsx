import { getTranslations } from 'next-intl/server';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/data/landing';
import { SectionHeading } from './section-heading';

/**
 * Frequently asked questions. Built on native `<details>`/`<summary>`, so it is
 * keyboard accessible and works without JavaScript - no client bundle needed.
 * The chevron rotates via the `open:` variant on the parent details element.
 */
export async function Faq() {
  const t = await getTranslations('landing');

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading title={t('faq.title')} subtitle={t('faq.subtitle')} />

      <div className="mt-12 divide-y divide-border rounded-xl border border-border bg-card">
        {FAQ_ITEMS.map((id) => (
          <details key={id} className="group px-5 [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-sm font-medium">
              {t(`faq.items.${id}.q`)}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {t(`faq.items.${id}.a`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
