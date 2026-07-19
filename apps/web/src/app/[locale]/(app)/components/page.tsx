import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ComponentsView } from '@/components/components/playground/components-view';
import { getComponents } from '@/data/components';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'components' });
  return {
    title: t('metaTitle'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'en' ? '/components' : `/${locale}/components` },
  };
}

// The grid reads the active category from `?category=` (chosen in the sidebar
// submenu) via useSearchParams, so this route renders per-request.
export const dynamic = 'force-dynamic';

/** Server Component: resolves prose for the locale, grid is the client boundary. */
export default async function ComponentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, components] = await Promise.all([
    getTranslations({ locale, namespace: 'components' }),
    getComponents(locale),
  ]);

  return (
    <ComponentsView
      components={components}
      header={
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
        </header>
      }
    />
  );
}
