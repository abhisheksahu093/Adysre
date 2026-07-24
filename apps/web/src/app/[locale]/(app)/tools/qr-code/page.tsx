import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { QrCode } from 'lucide-react';
import { QrGenerator } from '@/components/tools/qr/qr-generator';
import { SavedCodes } from '@/components/tools/qr/saved-codes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.qr' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * QR Code Generator - the first tool in the Tools module.
 *
 * A Server Component shell (header + copy from `tools.qr.*`) around the client
 * `QrGenerator`, which does the interactive work. The generator and its heavy
 * rendering library are a client bundle loaded only on this route, so the rest
 * of the app never pays for it.
 */
export default async function QrCodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'tools.qr' });

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

      <QrGenerator />
      <SavedCodes />
    </div>
  );
}
