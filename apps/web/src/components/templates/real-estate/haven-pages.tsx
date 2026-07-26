'use client';

import { HAVEN_MASTHEADS, type HavenPageId } from '@/data/templates/real-estate-content';
import {
  HavenAbout,
  HavenAgents,
  HavenContact,
  HavenCta,
  HavenFaq,
  HavenFooter,
  HavenHero,
  HavenMarquee,
  HavenMasthead,
  HavenMortgage,
  HavenProperties,
  HavenResidence,
  HavenServices,
  HavenStats,
  HavenSteps,
  HavenTestimonials,
  HavenWhy,
} from './haven-sections';

/**
 * HAVEN - page composition. Each page is a sequence of shared sections; the home
 * page leads with the hero, every other page opens with its masthead and
 * recomposes the same library in a different order. The template shell switches
 * on `page` and remounts this, so each route animates in fresh.
 */

export function HavenPage({ page }: { page: HavenPageId }) {
  if (page === 'home') {
    return (
      <>
        <HavenHero />
        <HavenMarquee />
        <HavenAbout />
        <HavenProperties />
        <HavenServices />
        <HavenMortgage />
        <HavenAgents />
        <HavenWhySteps />
        <HavenStats />
        <HavenTestimonials />
        <HavenFaq />
        <HavenCta />
      </>
    );
  }

  const masthead = HAVEN_MASTHEADS[page];

  if (page === 'properties') {
    return (
      <>
        <HavenMasthead masthead={masthead} />
        <HavenProperties />
        <HavenMortgage />
        <HavenServices />
        <HavenCta />
      </>
    );
  }

  if (page === 'details') {
    return (
      <>
        <HavenMasthead masthead={masthead} />
        <HavenResidence />
        <HavenMortgage />
        <HavenAgents />
        <HavenCta />
      </>
    );
  }

  if (page === 'agents') {
    return (
      <>
        <HavenMasthead masthead={masthead} />
        <HavenAgents />
        <HavenStats />
        <HavenTestimonials />
        <HavenCta />
      </>
    );
  }

  if (page === 'pricing') {
    return (
      <>
        <HavenMasthead masthead={masthead} />
        <HavenServices />
        <HavenMortgage />
        <HavenFaq />
        <HavenCta />
      </>
    );
  }

  if (page === 'about') {
    return (
      <>
        <HavenMasthead masthead={masthead} />
        <HavenAbout />
        <HavenSteps />
        <HavenStats />
        <HavenTestimonials />
        <HavenCta />
      </>
    );
  }

  // contact
  return (
    <>
      <HavenMasthead masthead={masthead} />
      <HavenContact />
      <HavenAgents />
    </>
  );
}

/** Home pairs Why with Steps under one flow. */
function HavenWhySteps() {
  return (
    <>
      <HavenWhy />
      <HavenSteps />
    </>
  );
}

// Re-exported so the shell can render the footer once, outside the page switch.
export { HavenFooter };
