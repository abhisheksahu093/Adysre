import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { FEATURE_MODULES } from '@/data/landing';
import { WorkbenchSection } from './workbench/section';
import { Hud } from './workbench/panel';

/**
 * The modules, as a rack of tools rather than a grid of marketing cards.
 *
 * Each module is a flat cell on one ruled surface: name, what it holds, and the
 * way in. The tinted icon chips are gone - six coloured squares said nothing the
 * names did not already say, and colour on this page is reserved for material.
 *
 * Server Component (Server Components first). Copy comes from the `landing`
 * namespace; the "coming soon" label reuses the shared `common` string so it
 * matches the sidebar badge exactly.
 */
export async function FeatureGrid() {
  const [t, tCommon] = await Promise.all([getTranslations('landing'), getTranslations('common')]);

  return (
    <WorkbenchSection
      label={t('workbench.panels.library')}
      title={t('features.title')}
      description={t('features.subtitle')}
    >
      <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_MODULES.map((m, i) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.id}
              href={m.href}
              className={cn(
                'group flex min-h-40 flex-col bg-panel p-5 transition-colors',
                'hover:bg-panel-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                <Hud>{String(i + 1).padStart(2, '0')}</Hud>
                {m.comingSoon ? (
                  <span className="ml-auto">
                    <Hud>{tCommon('comingSoon')}</Hud>
                  </span>
                ) : (
                  <ArrowUpRight
                    className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                    aria-hidden
                  />
                )}
              </div>

              <h3 className="mt-4 text-[17px] font-semibold tracking-tight">
                {t(`features.items.${m.id}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t(`features.items.${m.id}.desc`)}
              </p>
            </Link>
          );
        })}
      </div>
    </WorkbenchSection>
  );
}
