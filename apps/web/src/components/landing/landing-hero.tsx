import { getTranslations } from 'next-intl/server';
import { ArrowRight, PenTool } from 'lucide-react';
import { cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { CTA_ARROW, CTA_GLYPH, ctaClass } from './cta';
import { LANDING_LINKS } from '@/data/landing';
import { ICON_COUNT } from '@/data/library-stats';
import {
  ARTBOARD_GRADIENTS,
  ARTBOARD_ICONS,
  ARTBOARD_PALETTES,
  ARTBOARD_PATTERNS,
  ARTBOARD_TEXTURES,
} from '@/data/workbench';
import { TRUSTED_BUILDERS } from '@/config/audience';
import { Artboard } from './workbench/artboard';
import { Hud } from './workbench/panel';

/**
 * The opening of the home page: a claim, three ways in, and the board.
 *
 * Server Component. The hero used to be a centred stack over a glow with a
 * drawing of the workspace beneath it; this one puts a working piece of the
 * workspace on the page and sets the claim beside it. Only the board needs a
 * client bundle, and it receives its material samples as props, so no catalogue
 * crosses into the browser.
 */
export async function LandingHero() {
  const t = await getTranslations('landing');

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-6 pt-10 sm:px-6 sm:pb-8 sm:pt-16">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <Hud>{t('hero.badge')}</Hud>
          <h1 className="mt-4 text-balance text-[38px] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[52px] lg:text-[60px]">
            {t('hero.title')} <span className="text-muted-foreground">{t('hero.titleAccent')}</span>
          </h1>
        </div>

        <div className="lg:pb-2">
          <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            {t('hero.subtitle')}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={LANDING_LINKS.designPlayground}
              className={ctaClass({ size: 'lg', className: 'gap-1.5' })}
            >
              <PenTool className={cn('h-4 w-4', CTA_GLYPH)} aria-hidden />
              {t('hero.ctaPlayground')}
            </Link>
            <Link
              href={LANDING_LINKS.codeStudio}
              className={ctaClass({ tone: 'quiet', size: 'lg', className: 'gap-1.5' })}
            >
              {t('hero.ctaWorkspace')}
              <ArrowRight className={cn('h-4 w-4', CTA_ARROW)} aria-hidden />
            </Link>
            <Link href={LANDING_LINKS.components} className={ctaClass({ tone: 'bare', size: 'lg' })}>
              {t('hero.ctaComponents')}
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Hud>{t('hero.hint')}</Hud>
            <Hud>{t('hero.trust', { count: TRUSTED_BUILDERS })}</Hud>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <Artboard
          palettes={ARTBOARD_PALETTES}
          gradients={ARTBOARD_GRADIENTS}
          patterns={ARTBOARD_PATTERNS}
          textures={ARTBOARD_TEXTURES}
          icons={ARTBOARD_ICONS}
          iconCount={ICON_COUNT}
        />
      </div>
    </section>
  );
}
