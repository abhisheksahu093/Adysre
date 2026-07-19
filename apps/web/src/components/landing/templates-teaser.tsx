import { getTranslations } from 'next-intl/server';
import { LayoutTemplate, ArrowRight } from 'lucide-react';
import { buttonVariants, cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { LANDING_LINKS } from '@/data/landing';
import { LandingBackdrop } from './landing-backdrop';

/**
 * Teaser for the Templates module, which is still in development. Server
 * Component. Kept visually distinct from the shipped modules so the "coming
 * soon" status reads clearly, while still linking through to the live (empty)
 * templates route.
 */
export async function TemplatesTeaser() {
  const t = await getTranslations('landing');

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 sm:px-12">
        <LandingBackdrop className="opacity-70" />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"
            aria-hidden
          >
            <LayoutTemplate className="h-6 w-6" />
          </span>
          <span className="mt-5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('templates.badge')}
          </span>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t('templates.title')}
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            {t('templates.subtitle')}
          </p>

          <Link
            href={LANDING_LINKS.templates}
            className={cn(buttonVariants({ size: 'lg' }), 'mt-7 gap-1.5')}
          >
            {t('templates.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">{t('templates.note')}</p>
        </div>
      </div>
    </section>
  );
}
