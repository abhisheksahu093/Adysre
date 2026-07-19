import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { FEATURE_MODULES } from '@/data/landing';
import { SectionHeading } from './section-heading';
import { ACCENT_ICON, ACCENT_HOVER_BORDER } from './accent';

/**
 * The module grid: one card per building block, each linking to its live route.
 * Server Component (Server Components first). Copy comes from the `landing`
 * namespace; the "coming soon" pill reuses the shared `common` label so it
 * matches the sidebar badge exactly.
 */
export async function FeatureGrid() {
  const [t, tCommon] = await Promise.all([
    getTranslations('landing'),
    getTranslations('common'),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading title={t('features.title')} subtitle={t('features.subtitle')} />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              href={m.href}
              className={cn(
                'group relative flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5',
                ACCENT_HOVER_BORDER[m.accent],
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'inline-flex h-11 w-11 items-center justify-center rounded-lg',
                    ACCENT_ICON[m.accent],
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {m.comingSoon ? (
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {tCommon('comingSoon')}
                  </span>
                ) : (
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    aria-hidden
                  />
                )}
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {t(`features.items.${m.id}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`features.items.${m.id}.desc`)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
