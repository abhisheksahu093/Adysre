'use client';

import { HALCYON_MASTHEADS } from '@/data/templates/halcyon-ai-content';
import { HalcyonHero } from './halcyon-hero';
import {
  HalcyonAbout,
  HalcyonCapabilities,
  HalcyonContact,
  HalcyonFaq,
  HalcyonMarquee,
  HalcyonMasthead,
  HalcyonModels,
  HalcyonPricing,
  HalcyonStory,
  HalcyonWhy,
} from './halcyon-sections';

/**
 * HALCYON - what each page is made of.
 *
 * Composition only: no page holds markup of its own, so a section can be moved
 * between pages by moving one line. Sections repeat across pages on purpose -
 * the FAQ answers different anxieties on pricing than it does on home, and a
 * five-page site where each page ends in a dead end converts nothing.
 */

export function HalcyonHomePage() {
  return (
    <>
      <HalcyonHero />
      <HalcyonMarquee />
      <HalcyonAbout />
      <HalcyonCapabilities />
      <HalcyonWhy />
      <HalcyonFaq />
      <HalcyonContact />
    </>
  );
}

export function HalcyonPlatformPage() {
  return (
    <>
      <HalcyonMasthead masthead={HALCYON_MASTHEADS.platform} />
      <HalcyonCapabilities />
      <HalcyonModels />
      <HalcyonWhy />
      <HalcyonContact />
    </>
  );
}

export function HalcyonPricingPage() {
  return (
    <>
      <HalcyonMasthead masthead={HALCYON_MASTHEADS.pricing} />
      <HalcyonPricing />
      <HalcyonFaq />
      <HalcyonContact />
    </>
  );
}

export function HalcyonAboutPage() {
  return (
    <>
      <HalcyonMasthead masthead={HALCYON_MASTHEADS.about} />
      <HalcyonAbout />
      <HalcyonStory />
      <HalcyonContact />
    </>
  );
}

export function HalcyonContactPage() {
  return (
    <>
      <HalcyonMasthead masthead={HALCYON_MASTHEADS.contact} />
      <HalcyonContact />
      <HalcyonFaq />
    </>
  );
}
