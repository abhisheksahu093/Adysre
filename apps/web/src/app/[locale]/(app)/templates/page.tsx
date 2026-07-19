import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ComingSoon } from '@/components/coming-soon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('templates') };
}

export default function TemplatesPage() {
  return <ComingSoon href="/templates" />;
}
