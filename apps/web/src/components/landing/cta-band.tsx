import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { LANDING_LINKS } from '@/data/landing';
import { CTA_ARROW, ctaClass } from './cta';
import { Hud } from './workbench/panel';

/**
 * The closing call to action: one last panel, lit rather than inverted.
 *
 * It used to flip foreground and background, which meant it read as a black slab
 * on the light theme and a white one on the dark - the only surface on the page
 * that argued with the theme the visitor chose. The emphasis now comes from the
 * brand wash across the panel instead, so the band is the loudest thing on the
 * page in both themes without either of them fighting it.
 */
export async function CtaBand() {
  const t = await getTranslations('landing');

  return (
    <section className="section-deferred mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 sm:pb-24">
      <div className="cta-band overflow-hidden rounded-xl border border-line px-6 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-balance text-[28px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[38px]">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">
              {t('cta.subtitle')}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* The same pair as the hero, in the same order: a visitor who
                scrolled the whole page should recognise the way in. */}
            <Link
              href={LANDING_LINKS.codeStudio}
              className={ctaClass({ size: 'lg', className: 'gap-1.5' })}
            >
              {t('cta.primary')}
              <ArrowRight className={cn('h-4 w-4', CTA_ARROW)} aria-hidden />
            </Link>
            <Link
              href={LANDING_LINKS.pricing}
              className={ctaClass({ tone: 'quiet', size: 'lg' })}
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5">
          <Hud>{t('hero.hint')}</Hud>
          <Hud>{t('footer.built')}</Hud>
        </div>
      </div>
    </section>
  );
}
