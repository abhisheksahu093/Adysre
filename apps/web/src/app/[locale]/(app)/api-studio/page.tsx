import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ApiStudio } from '@/modules/api-studio/components/api-studio';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'apiStudio' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * ADYSRE API Studio - the self-hosted HTTP client.
 *
 * The workspace is a Client Component: it is an editor, and every part of it is
 * stateful. This server route only sets metadata and mounts it full-bleed, the
 * same shape Code Studio uses.
 */
export default async function ApiStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ApiStudio />;
}
