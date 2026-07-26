import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ComingSoon } from '@/components/coming-soon';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('apiStudio'), description: t('descriptions.apiStudio') };
}

/**
 * ADYSRE API Studio - the self-hosted HTTP client (collections, environments,
 * request runner, response viewer). This route is the module's entry point; the
 * workspace shell replaces this placeholder once Phase 1 lands. Title and
 * description come from the sidebar entry, so the two can never drift.
 */
export default async function ApiStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoon href="/api-studio" />;
}
