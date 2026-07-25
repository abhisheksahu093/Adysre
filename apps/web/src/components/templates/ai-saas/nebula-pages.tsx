'use client';

import { NEBULA_MASTHEADS } from '@/data/templates/ai-saas-content';
import {
  NebulaContact,
  NebulaCta,
  NebulaFaq,
  NebulaFeatures,
  NebulaHero,
  NebulaHowItWorks,
  NebulaIntegrations,
  NebulaMarquee,
  NebulaMasthead,
  NebulaPricing,
  NebulaStats,
  NebulaWhy,
} from './nebula-sections';

/**
 * NEBULA - what each page is made of. Composition only; Home leads with the
 * hero, inner pages open with a masthead and recompose the shared sections, so
 * the eight-page site is one design that never contradicts itself.
 */

export function NebulaHomePage() {
  return (
    <>
      <NebulaHero />
      <NebulaMarquee />
      <NebulaStats />
      <NebulaFeatures />
      <NebulaHowItWorks />
      <NebulaWhy />
      <NebulaIntegrations />
      <NebulaPricing />
      <NebulaFaq />
      <NebulaCta />
    </>
  );
}

export function NebulaFeaturesPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.features} />
      <NebulaFeatures />
      <NebulaHowItWorks />
      <NebulaWhy />
      <NebulaCta />
    </>
  );
}

export function NebulaSolutionsPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.solutions} />
      <NebulaWhy />
      <NebulaHowItWorks />
      <NebulaStats />
      <NebulaCta />
    </>
  );
}

export function NebulaPricingPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.pricing} />
      <NebulaPricing />
      <NebulaFaq />
      <NebulaCta />
    </>
  );
}

export function NebulaIntegrationsPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.integrations} />
      <NebulaIntegrations />
      <NebulaFeatures />
      <NebulaCta />
    </>
  );
}

export function NebulaAboutPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.about} />
      <NebulaHowItWorks />
      <NebulaWhy />
      <NebulaStats />
      <NebulaCta />
    </>
  );
}

export function NebulaBlogPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.blog} />
      <NebulaCta />
    </>
  );
}

export function NebulaContactPage() {
  return (
    <>
      <NebulaMasthead masthead={NEBULA_MASTHEADS.contact} />
      <NebulaContact />
    </>
  );
}
