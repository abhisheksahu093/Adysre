import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PricingGrid } from '@/components/pricing/pricing-grid';
import { FaqAccordion } from '@/components/pricing/faq-accordion';
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });
  return { title: t('metaTitle'), description: t('subtitle') };
}

/** Server Component; only the cards and FAQ are client boundaries. */
export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return (
    <div className="mx-auto max-w-6xl space-y-16 py-4 sm:py-8">
      <section className="space-y-8">
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </header>

        <PricingGrid />
      </section>

      <section className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-3 text-center">
          <h2 className="text-xl font-bold tracking-tight sm:text-3xl">{t('faq.title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t.rich('faq.subtitle', {
              email: SUPPORT_EMAIL,
              a: (chunks) => (
                <a href={SUPPORT_MAILTO} className="text-primary hover:underline">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </header>
        <FaqAccordion />
      </section>
    </div>
  );
}
