import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PatternsView } from '@/components/patterns/patterns-view';
import { NpmUsage } from '@/components/npm/npm-usage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'patterns' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'en' ? '/patterns' : `/${locale}/patterns` },
  };
}

export const dynamic = 'force-dynamic';

export default async function PatternsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PatternsView />
      <NpmUsage module="patterns" />
    </>
  );
}
