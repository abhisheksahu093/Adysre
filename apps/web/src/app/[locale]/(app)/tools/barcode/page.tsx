import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Barcode } from 'lucide-react';
import { BarcodeGenerator } from '@/components/tools/barcode/barcode-generator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.barcode' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * Barcode Generator - Tools module. Server shell around the client
 * `BarcodeGenerator`, whose JsBarcode rendering is a client-only bundle scoped
 * to this route.
 */
export default async function BarcodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'tools.barcode' });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Barcode className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t('badge')}
        </span>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </div>
      </header>

      <BarcodeGenerator />
    </div>
  );
}
