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
import { RulesSection } from '@/components/landing/rules-section';
import { ApiStudioSection } from '@/components/landing/api-studio-section';
import { Faq } from '@/components/landing/faq';
import { CtaBand } from '@/components/landing/cta-band';
import { LandingFooter } from '@/components/landing/landing-footer';
import { WorkbenchCanvas } from '@/components/landing/workbench/canvas';

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
    // One canvas from the announcement bar to the footer: the dot grid is the
    // page, every section is a panel resting on it, and the surface drifts and
    // answers the cursor.
    <WorkbenchCanvas>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
      >
        {t('nav.skip')}
      </a>

      <AnnouncementBar />
      <LandingHeader />

      <main id="main">
        <LandingHero />
        {/* The board's own readings come first: what the library actually
            contains, straight under the thing it is made of. */}
        <StatsBand stats={LANDING_STATS} />
        {/* Then the working checker - the strongest interactive hook on the
            page, and a visitor can scan a real URL before scrolling further. */}
        <IntelligenceSection />
        <FeatureGrid />
        {/* The material itself, once the modules holding it have been named. */}
        <Showcase />
        <RulesSection />
        {/* The two developer modules sit together: a rule engine and an API
            client are for the same visitor, and both previews are built the
            same way, so the page keeps its rhythm across them. */}
        <ApiStudioSection />
        {/* A visitor who has just seen what the modules are should be told they
            can install the whole thing before being asked to browse. */}
        <InstallSection />
        <TemplatesTeaser />
        <WorkflowSteps />
        <Faq />
        <CtaBand />
      </main>

      <LandingFooter />
    </WorkbenchCanvas>
  );
}
