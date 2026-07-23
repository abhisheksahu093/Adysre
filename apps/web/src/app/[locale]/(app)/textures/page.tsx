import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { TexturesView } from '@/components/textures/textures-view';
import { NpmUsage } from '@/components/npm/npm-usage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'textures' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'en' ? '/textures' : `/${locale}/textures` },
  };
}

export const dynamic = 'force-dynamic';

export default async function TexturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <TexturesView />
      <NpmUsage module="textures" />
    </>
  );
}
