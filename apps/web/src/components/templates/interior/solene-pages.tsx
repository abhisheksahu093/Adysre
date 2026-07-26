'use client';

import { SOLENE_MASTHEADS } from '@/data/templates/interior-content';
import {
  SoleneAbout,
  SoleneApproach,
  SoleneContact,
  SoleneCta,
  SoleneFaq,
  SoleneHero,
  SoleneMarquee,
  SoleneMasthead,
  SolenePortfolio,
  SoleneProjects,
  SoleneServices,
  SoleneStats,
  SoleneTestimonials,
} from './solene-sections';

/**
 * SOLÈNE - what each page is made of. Composition only; Home leads with the
 * editorial hero, inner pages open with a masthead and recompose the shared
 * sections, so the seven-page site is one design that never contradicts itself.
 */

export function SoleneHomePage() {
  return (
    <>
      <SoleneHero />
      <SoleneMarquee />
      <SoleneAbout />
      <SoleneProjects />
      <SoleneServices />
      <SolenePortfolio />
      <SoleneStats />
      <SoleneTestimonials />
      <SoleneFaq />
      <SoleneCta />
    </>
  );
}

export function SoleneProjectsPage() {
  return (
    <>
      <SoleneMasthead masthead={SOLENE_MASTHEADS.projects} />
      <SoleneProjects />
      <SolenePortfolio />
      <SoleneStats />
      <SoleneCta />
    </>
  );
}

export function SoleneServicesPage() {
  return (
    <>
      <SoleneMasthead masthead={SOLENE_MASTHEADS.services} />
      <SoleneServices />
      <SoleneApproach />
      <SoleneCta />
    </>
  );
}

export function SolenePortfolioPage() {
  return (
    <>
      <SoleneMasthead masthead={SOLENE_MASTHEADS.portfolio} />
      <SolenePortfolio />
      <SoleneProjects />
      <SoleneCta />
    </>
  );
}

export function SoleneAboutPage() {
  return (
    <>
      <SoleneMasthead masthead={SOLENE_MASTHEADS.about} />
      <SoleneAbout />
      <SoleneApproach />
      <SoleneStats />
      <SoleneCta />
    </>
  );
}

export function SoleneTestimonialsPage() {
  return (
    <>
      <SoleneMasthead masthead={SOLENE_MASTHEADS.testimonials} />
      <SoleneTestimonials />
      <SoleneStats />
      <SoleneCta />
    </>
  );
}

export function SoleneContactPage() {
  return (
    <>
      <SoleneMasthead masthead={SOLENE_MASTHEADS.contact} />
      <SoleneContact />
    </>
  );
}
