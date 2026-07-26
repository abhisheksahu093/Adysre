import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  RulesCapabilitiesGrid,
  RulesDecisionsList,
} from '@/components/rules-engine/capabilities-grid';
import { RulesPackagesGrid } from '@/components/rules-engine/packages-grid';
import { RulesStats } from '@/components/rules-engine/rules-stats';
import { RulesUsageGuide } from '@/components/rules-engine/usage-guide';
import { RulesPlayground } from '@/modules/rules/components/rules-playground';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'rules' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * The Business Rules Engine, shown and running.
 *
 * A Server Component that renders the description and mounts one Client
 * Component for the sandbox. Everything above the sandbox is static - a
 * package matrix, the figures, the decisions - so shipping it to the browser
 * would cost a chunk to achieve nothing.
 *
 * The order answers the questions a visitor asks in the order they ask them:
 * what is this, how big is it, what can it do, can I try it, what is it made
 * of, and why should I believe any of it. The sandbox sits in the middle rather
 * than at the end, because a reader who is convinced by the first two sections
 * should not have to scroll past the package matrix to touch the thing.
 *
 * Every figure derives from the engine (`@/data/rules-engine`), so this page
 * cannot claim a number the registry does not have.
 */
export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'rules' });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="max-w-3xl text-base text-muted-foreground">{t('subtitle')}</p>
      </header>

      <RulesStats locale={locale} />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">{t('sections.capabilities')}</h2>
        <RulesCapabilitiesGrid locale={locale} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">{t('sections.sandbox')}</h2>
          <p className="text-sm text-muted-foreground">{t('sections.sandboxHint')}</p>
        </div>
        <RulesPlayground />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">{t('guide.title')}</h2>
        <RulesUsageGuide locale={locale} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-medium">{t('sections.packages')}</h2>
          <p className="text-sm text-muted-foreground">{t('sections.packagesHint')}</p>
        </div>
        <RulesPackagesGrid locale={locale} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">{t('sections.decisions')}</h2>
        <RulesDecisionsList locale={locale} />
      </section>
    </div>
  );
}
