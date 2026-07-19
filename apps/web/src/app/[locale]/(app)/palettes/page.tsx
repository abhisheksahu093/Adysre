import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PalettesView } from '@/components/palettes/palettes-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'palettes' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'en' ? '/palettes' : `/${locale}/palettes` },
  };
}

/** Palettes are static, unlocalised data, so the whole page is the client view. */
export default async function PalettesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PalettesView />;
}
