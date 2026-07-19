import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { GradientsView } from '@/components/gradients/gradients-view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'gradients' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'en' ? '/gradients' : `/${locale}/gradients` },
  };
}

/** Gradients are static, unlocalised data, so the whole page is the client view. */
// The grid reads the active tag from `?tag=` (sidebar submenu).
export const dynamic = 'force-dynamic';

export default async function GradientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GradientsView />;
}
