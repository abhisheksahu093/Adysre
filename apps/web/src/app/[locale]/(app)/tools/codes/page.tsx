import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { QrCode } from 'lucide-react';
import { CodeTabs } from '@/components/tools/codes/code-tabs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.codes' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * Code Generator - QR codes and barcodes on one page, switched by a tab bar.
 * Server shell (header + copy from `tools.codes.*`) around the client
 * `CodeTabs`; each generator's rendering library (qr-code-styling, JsBarcode)
 * is a client bundle loaded only when its tab is active.
 */
export default async function CodesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'tools.codes' });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <QrCode className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t('badge')}
        </span>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </div>
      </header>

      <CodeTabs />
    </div>
  );
}
