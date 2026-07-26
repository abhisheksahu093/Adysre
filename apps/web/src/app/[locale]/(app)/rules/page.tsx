import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RulesPlayground } from '@/modules/rules/components/rules-playground';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'rules' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * The business rules builder, running against a sample order.
 *
 * The builder is a Client Component - it is an editor, and every part of it is
 * stateful - so this server route only sets metadata and mounts it, the same
 * shape API Studio uses.
 *
 * Not in the sidebar yet: `@adysre/rules-*` is a package ecosystem whose storage
 * and Next.js adapters are still ahead of it, so this is a sandbox to drive the
 * builder rather than a module to manage rules in. The `NAV_ITEMS` entry is
 * written and commented out, exactly as Settings is, so revealing it later is
 * one line.
 */
export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RulesPlayground />;
}
