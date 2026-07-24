import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AnnouncementBar } from '@/components/landing/announcement-bar';
import { LandingHeader } from '@/components/landing/landing-header';
import { LandingHero } from '@/components/landing/landing-hero';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { WorkflowSteps } from '@/components/landing/workflow-steps';
import { Showcase } from '@/components/landing/showcase';
import { StatsBand } from '@/components/landing/stats-band';
import { InstallSection } from '@/components/landing/install-section';
import { LANDING_STATS } from '@/data/library-stats';
import { TemplatesTeaser } from '@/components/landing/templates-teaser';
import { IntelligenceSection } from '@/components/landing/intelligence-section';
import { Faq } from '@/components/landing/faq';
import { CtaBand } from '@/components/landing/cta-band';
import { LandingFooter } from '@/components/landing/landing-footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing' });
  return { title: t('meta.title'), description: t('meta.description') };
}

/**
 * Public landing page - the first thing a visitor sees at `/`.
 *
 * It lives directly under `[locale]`, outside the `(app)` route group, so it
 * gets marketing chrome (its own header and footer) rather than the app shell's
 * sidebar and topbar. Every call to action links into the app, where the side
 * menu takes over. Server Component; only the hero, stats and header opt into a
 * client bundle for their interactions.
 */
export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'landing' });

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {t('nav.skip')}
      </a>

      <AnnouncementBar />
      <LandingHeader />

      <main id="main">
        <LandingHero />
        {/* Second: the working website checker is the strongest interactive
            hook, so it sits right below the hero - a visitor can scan a real URL
            before scrolling anything else. */}
        <IntelligenceSection />
        <FeatureGrid />
        {/* A visitor who has just seen what the modules are should be told they
            can install the whole thing before being asked to browse. */}
        <InstallSection />
        <WorkflowSteps />
        <Showcase />
        <StatsBand stats={LANDING_STATS} />
        <TemplatesTeaser />
        <Faq />
        <CtaBand />
      </main>

      <LandingFooter />
    </div>
  );
}
