import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TemplateGallery } from '@/components/templates/template-gallery';
import { templateSummaries } from '@/data/templates';
import { getAccessLevel } from '@/lib/access-server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'templates' });
  return { title: t('meta.title'), description: t('meta.description') };
}

/**
 * Templates - the gallery page.
 *
 * A Server Component that resolves the visitor's entitlement and only then
 * builds the payload: a premium template leaves here with no prompt and no
 * download formats for a free visitor, so the paywall does not depend on the
 * client honouring it (see `toSummary`).
 *
 * Dynamic because the payload varies per visitor - caching one rendering across
 * tiers would hand paid content to everyone.
 */
export const dynamic = 'force-dynamic';

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'templates' });
  const accessLevel = await getAccessLevel();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t('subtitle')}</p>
      </header>

      <TemplateGallery templates={templateSummaries(accessLevel)} />
    </div>
  );
}
