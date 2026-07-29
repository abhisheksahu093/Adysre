import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ColorsSurfacesTabs } from '@/components/colors-surfaces/colors-surfaces-tabs';
import { NpmUsage } from '@/components/npm/npm-usage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'colorsSurfaces' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: { canonical: locale === 'en' ? '/colors-surfaces' : `/${locale}/colors-surfaces` },
  };
}

/** The active tab and tag come from `?tab=`/`?tag=`, read client-side by the views. */
export const dynamic = 'force-dynamic';

const TAB_MODULES = ['palettes', 'gradients', 'patterns', 'textures', 'icons'] as const;
type TabModule = (typeof TAB_MODULES)[number];

/**
 * Colours & Surfaces: palettes, gradients, patterns, textures and icons on one
 * tabbed page. The tabs (a client component) render the active family view; the
 * npm usage panel below is chosen server-side to match the active tab.
 *
 * This list must stay in step with `TABS` in `colors-surfaces-tabs.tsx`. It is
 * separate because the panel is picked on the server, where the client tab
 * component (and the whole family view tree it imports) has no business being.
 */
export default async function ColorsSurfacesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { locale } = await params;
  const { tab } = await searchParams;
  setRequestLocale(locale);
  const raw = Array.isArray(tab) ? tab[0] : tab;
  const activeModule: TabModule = TAB_MODULES.includes(raw as TabModule)
    ? (raw as TabModule)
    : 'palettes';

  return (
    <>
      <ColorsSurfacesTabs />
      <NpmUsage module={activeModule} />
    </>
  );
}
