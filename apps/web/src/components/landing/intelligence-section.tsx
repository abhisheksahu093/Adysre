import { getTranslations } from 'next-intl/server';
import { ArrowRight, Radar } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { INTEL_ROUTE, INTEL_STATS, INTEL_CAPABILITIES } from '@/data/website-intelligence';
import { WebsiteChecker } from './website-checker';
import { SectionHeading } from './section-heading';

/**
 * "Website Intelligence" — the home-page pitch for the scanning platform.
 *
 * Deliberately brief: the in-app overview at {@link INTEL_ROUTE} carries the
 * full capability grid and every metric, so here we keep just the working
 * checker, a couple of headline numbers and the capability names as pills, then
 * send people inside for the detail.
 *
 * Server Component; the whole section is static.
 */
export async function IntelligenceSection() {
  const t = await getTranslations('websiteIntel');

  // Only the headline metrics belong on the teaser; operational detail (like the
  // "no paid AI" note) lives on the inner page.
  const stats = INTEL_STATS.filter((stat) => stat.id !== 'paidAi');

  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <Radar className="h-4 w-4" aria-hidden />
              {t('badge')}
            </span>
          }
          title={t('title')}
          subtitle={t('home.subtitle')}
          className="max-w-3xl"
        />

        {/* The working checker: a real scan runs right here on the public page. */}
        <WebsiteChecker />

        {/* Stats strip. Counts derive from the catalogue (Rule 6). */}
        <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <dd className="text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                {stat.value}
                {stat.suffix}
              </dd>
              <dt className="mt-1 text-xs text-muted-foreground">{t(`stats.${stat.id}`)}</dt>
            </div>
          ))}
        </dl>

        {/* Capability names only - a compact taste of the breadth. The full grid
            with descriptions lives on the inner page. */}
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
          {INTEL_CAPABILITIES.map(({ id }) => (
            <li
              key={id}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {t(`capabilities.${id}.title`)}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href={INTEL_ROUTE} className={cn(buttonVariants({ size: 'lg' }), 'gap-2')}>
            {t('home.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
