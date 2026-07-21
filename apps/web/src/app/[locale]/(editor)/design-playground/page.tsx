import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { EditorShell } from '@/components/design-playground/editor-shell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'designPlayground' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: locale === 'en' ? '/design-playground' : `/${locale}/design-playground`,
    },
  };
}

export default async function DesignPlaygroundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EditorShell />;
}
