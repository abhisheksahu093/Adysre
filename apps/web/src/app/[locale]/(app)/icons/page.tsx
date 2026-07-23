import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IconsView } from '@/components/icons/icons-view';
import { ICON_COUNT } from '@/data/icons';
import { NpmUsage } from '@/components/npm/npm-usage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'icons' });
  return {
    title: t('title'),
    description: t('subtitle', { count: ICON_COUNT }),
    alternates: { canonical: locale === 'en' ? '/icons' : `/${locale}/icons` },
  };
}

/** Icons are static, unlocalised data, so the whole page is the client view. */
// The grid reads the active category from `?category=` (sidebar submenu).
export const dynamic = 'force-dynamic';

export default async function IconsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <IconsView />
      <NpmUsage module="icons" />
    </>
  );
}
