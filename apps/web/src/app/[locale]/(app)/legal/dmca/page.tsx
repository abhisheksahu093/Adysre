import type { Metadata } from 'next';
import { Copyright } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalDocument } from '@/components/legal/legal-document';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.dmca' });
  return { title: t('title'), description: t('description') };
}

export default async function DmcaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalDocument namespace="pages.dmca" icon={Copyright} />;
}
