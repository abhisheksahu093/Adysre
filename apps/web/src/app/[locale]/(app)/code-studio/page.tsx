import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CodeStudio } from '@/modules/code-studio/components/code-studio';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'codeStudio' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * ADYSRE Code Studio - a browser IDE (Monaco editor, multi-language live
 * preview, console) that runs entirely client-side. The shell is a Client
 * Component: Monaco and the compilers load from a CDN in the browser, so this
 * server route only sets metadata and mounts it full-bleed.
 */
export default async function CodeStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CodeStudio />;
}
