import { getTranslations } from 'next-intl/server';
import { ArrowRight, Radar } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { INTEL_ROUTE, INTEL_STATS } from '@/data/website-intelligence';
import { IntelCapabilitiesGrid } from '@/components/website-intelligence/capabilities-grid';
import { WebsiteChecker } from './website-checker';
import { SectionHeading } from './section-heading';

/**
 * "Website Intelligence" — the home-page pitch for the scanning platform.
 *
 * Shares the capability grid with the in-app overview ({@link IntelCapabilitiesGrid}),
 * so the eleven analyses are described in exactly one place. The CTA links into
 * the app at {@link INTEL_ROUTE}; the "in development" badge keeps the section
 * honest about what is shippable today.
 *
 * Server Component; the whole section is static.
 */
export async function IntelligenceSection() {
  const t = await getTranslations('websiteIntel');

  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <Radar className="h-4 w-4" aria-hidden />
              {t('badge')}
            </span>
          }
          title={t('title')}
          subtitle={t('subtitle')}
          className="max-w-3xl"
        />

        {/* The working checker: a real scan runs right here on the public page. */}
        <WebsiteChecker />

        {/* Stats strip. Counts derive from the catalogue (Rule 6). */}
        <dl className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {INTEL_STATS.map((stat) => (
            <div key={stat.id} className="text-center">
              <dd className="text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                {stat.value}
                {stat.suffix}
              </dd>
              <dt className="mt-1 text-xs text-muted-foreground">{t(`stats.${stat.id}`)}</dt>
            </div>
          ))}
        </dl>

        <IntelCapabilitiesGrid className="mt-14" />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Link href={INTEL_ROUTE} className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
            {t('home.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
