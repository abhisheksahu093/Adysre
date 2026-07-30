import { getTranslations } from 'next-intl/server';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { FAQ_ITEMS, LANDING_LINKS } from '@/data/landing';
import { WorkbenchSection } from './workbench/section';

/**
 * Frequently asked questions, as one ruled stack.
 *
 * Built on native `<details>`/`<summary>`, so it stays keyboard accessible and
 * needs no client JavaScript: the chevron and the open state come from the
 * `open:`/`group-open:` variants. The rows share a surface rather than sitting
 * in separate cards, because a list of questions is a list, not a gallery.
 */
export async function Faq() {
  const t = await getTranslations('landing');

  return (
    <WorkbenchSection
      label={t('faq.badge')}
      title={t('faq.title')}
      description={t('faq.subtitle')}
      actions={
        <Link
          href={LANDING_LINKS.contact}
          className="inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-foreground transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('faq.helpCta')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      }
    >
      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        {FAQ_ITEMS.map((id) => (
          <details
            key={id}
            className="group border-b border-line px-4 last:border-b-0 open:bg-panel-raised sm:px-5 [&_summary]:list-none"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-medium">
              <span>{t(`faq.items.${id}.q`)}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-signal"
                aria-hidden
              />
            </summary>
            <p className="max-w-3xl pb-5 text-sm leading-relaxed text-muted-foreground">
              {t(`faq.items.${id}.a`)}
            </p>
          </details>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t('faq.help')}</p>
    </WorkbenchSection>
  );
}
