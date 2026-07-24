import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FileText } from 'lucide-react';
import { DocumentTabs } from '@/components/tools/documents/document-tabs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.documents' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * Document Generator, Tools module. One page hosting the invoice and salary-slip
 * generators as tabs (client `DocumentTabs`); the heavy editors are a client
 * bundle scoped to this route.
 */
export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'tools.documents' });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 py-4 sm:py-6 lg:h-[calc(100dvh-6.5rem)]">
      <header className="shrink-0 space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <FileText className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t('badge')}
        </span>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </div>
      </header>

      <DocumentTabs />
    </div>
  );
}
