import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { cn } from 'adysre';
import { CTA_ARROW, ctaClass } from './cta';
import { Link } from '@/i18n/navigation';
import {
  INTEL_CHECK_COUNT,
  INTEL_ROUTE,
  INTEL_STATS,
  INTEL_CAPABILITIES,
} from '@/data/website-intelligence';
import { WebsiteChecker } from './website-checker';
import { WorkbenchSection } from './workbench/section';
import { Hud, Panel } from './workbench/panel';

/**
 * "Website Intelligence" - the home-page pitch for the scanning platform.
 *
 * Deliberately brief: the in-app overview at {@link INTEL_ROUTE} carries the
 * full capability grid and every metric, so here we keep the working checker,
 * a couple of headline numbers and the capability names, then send people
 * inside for the detail.
 *
 * Docked as a panel because it is the one section a visitor can operate: a real
 * scan of a real URL runs from here, on the public page.
 *
 * Server Component; only the checker itself is interactive.
 */
export async function IntelligenceSection() {
  const [t, tLanding] = await Promise.all([
    getTranslations('websiteIntel'),
    getTranslations('landing'),
  ]);

  // Only the headline metrics belong on the teaser; operational detail (like the
  // "no paid AI" note) lives on the inner page.
  const stats = INTEL_STATS.filter((stat) => stat.id !== 'paidAi');

  return (
    <WorkbenchSection
      label={t('badge')}
      title={t('title')}
      description={t('home.subtitle', { count: INTEL_CHECK_COUNT })}
      actions={
        <Link href={INTEL_ROUTE} className={ctaClass({ size: 'sm', className: 'gap-1.5' })}>
          {t('home.cta')}
          <ArrowRight className={cn('h-4 w-4', CTA_ARROW)} aria-hidden />
        </Link>
      }
    >
      <Panel
        title={tLanding('workbench.panels.scanner')}
        actions={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {stats.map((stat) => (
              <span key={stat.id} className="flex items-baseline gap-1.5">
                <Hud strong>
                  {stat.value}
                  {stat.suffix}
                </Hud>
                <Hud>{t(`stats.${stat.id}`)}</Hud>
              </span>
            ))}
          </span>
        }
      >
        <WebsiteChecker />

        {/* Capability names only - a compact taste of the breadth. The full grid
            with descriptions lives on the inner page. */}
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4">
          {INTEL_CAPABILITIES.map(({ id }) => (
            <li key={id}>
              <Hud>{t(`capabilities.${id}.title`)}</Hud>
            </li>
          ))}
        </ul>
      </Panel>
    </WorkbenchSection>
  );
}
