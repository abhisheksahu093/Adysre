import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FileSearch } from 'lucide-react';
import { ResumeToolsTabs } from '@/components/tools/resume/resume-tools-tabs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.resume' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * Resume tools. Server shell around two client tools, the ATS scanner and the
 * resume builder, switched by a tab bar. Their PDF/DOCX parsers are a client
 * bundle loaded only when a file is processed.
 */
export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'tools.resume' });

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <FileSearch className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t('badge')}
        </span>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </div>
      </header>

      <ResumeToolsTabs />
    </div>
  );
}
