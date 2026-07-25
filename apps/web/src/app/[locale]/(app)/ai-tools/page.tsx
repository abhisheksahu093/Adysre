import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Sparkles } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { AI_TOOLS } from '@/modules/ai-tools/tools/registry';
import { ToolIcon } from '@/modules/ai-tools/components/tool-icon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aiTools' });
  return { title: t('title'), description: t('subtitle') };
}

/**
 * AI Tools index: the full roadmap of image and utility tools. Ready tools open
 * their workspace; upcoming tools are shown so the module's scope is clear.
 * Everything runs in the browser, so nothing here needs a server or an API key.
 */
export default async function AiToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'aiTools' });

  const phases = [1, 2] as const;

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-4 sm:py-8">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t('badge')}
        </span>
        <div className="max-w-3xl space-y-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </div>
      </header>

      {phases.map((phase) => (
        <section key={phase} className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t('phase', { phase })}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AI_TOOLS.filter((tool) => tool.phase === phase).map((tool) => {
              const ready = tool.status === 'ready';
              const card = (
                <div
                  className={cn(
                    'flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors',
                    ready ? 'hover:border-primary/40' : 'opacity-70',
                  )}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ToolIcon name={tool.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold tracking-tight">{t(`tools.${tool.id}.name`)}</span>
                      {!ready && (
                        <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warning">
                          {t('soon')}
                        </span>
                      )}
                    </span>
                    <span className="block text-xs leading-relaxed text-muted-foreground">{t(`tools.${tool.id}.desc`)}</span>
                  </span>
                </div>
              );

              return ready ? (
                <Link key={tool.id} href={`/ai-tools/${tool.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl">
                  {card}
                </Link>
              ) : (
                <div key={tool.id}>{card}</div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
