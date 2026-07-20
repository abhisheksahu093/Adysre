'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { buttonVariants, cn } from '@adysre/ui';
import { Link } from '@/i18n/navigation';
import { FEATURE_MODULES, LANDING_LINKS } from '@/data/landing';
import { TRUSTED_BUILDERS } from '@/config/audience';
import { LandingBackdrop } from './landing-backdrop';
import { WorkspacePreview } from './workspace-preview';

/**
 * Hero section: value proposition, primary calls to action, and a stylised
 * preview of the workspace. Client Component for the entrance animation, which
 * collapses to a static render when the visitor asks for reduced motion.
 */
export function LandingHero() {
  const t = useTranslations('landing');
  const reduce = useReducedMotion();

  // A gentle stagger: each child rises a little and fades in. Disabled outright
  // under prefers-reduced-motion so the content simply appears.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="relative isolate overflow-hidden">
      <LandingBackdrop />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('hero.title')}{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('hero.titleAccent')}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={LANDING_LINKS.app}
              className={cn(buttonVariants({ size: 'lg' }), 'w-full gap-1.5 sm:w-auto')}
            >
              {t('hero.ctaPrimary')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={LANDING_LINKS.components}
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full sm:w-auto')}
            >
              {t('hero.ctaSecondary')}
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground sm:flex-row sm:gap-4"
          >
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-success" aria-hidden />
              {t('hero.hint')}
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            {/* `number` formatting, not a literal: Hindi groups as 18,000. */}
            <span>{t('hero.trust', { count: TRUSTED_BUILDERS })}</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.35, ease: 'easeOut' }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <WorkspacePreview modules={FEATURE_MODULES} />
        </motion.div>
      </div>
    </section>
  );
}
