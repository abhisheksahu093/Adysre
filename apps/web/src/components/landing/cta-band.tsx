import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { LANDING_LINKS } from '@/data/landing';
import { LandingBackdrop } from './landing-backdrop';

/** Closing call to action before the footer. Server Component. */
export async function CtaBand() {
  const t = await getTranslations('landing');

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-20">
        <LandingBackdrop />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            {t('cta.subtitle')}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={LANDING_LINKS.app}
              className={cn(buttonVariants({ size: 'lg' }), 'w-full gap-1.5 sm:w-auto')}
            >
              {t('cta.primary')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={LANDING_LINKS.pricing}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
