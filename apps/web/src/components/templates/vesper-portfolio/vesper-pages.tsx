'use client';

import { VESPER_MASTHEADS } from '@/data/templates/vesper-portfolio-content';
import {
  VesperAbout,
  VesperApproach,
  VesperContact,
  VesperFaq,
  VesperHero,
  VesperMarquee,
  VesperMasthead,
  VesperServices,
  VesperStack,
  VesperWork,
} from './vesper-sections';

/**
 * VESPER - what each page is made of.
 *
 * Composition only: no page holds markup of its own.
 */

export function VesperHomePage() {
  return (
    <>
      <VesperHero />
      <VesperMarquee />
      <VesperWork />
      <VesperApproach />
      <VesperAbout />
      <VesperFaq />
      <VesperContact />
    </>
  );
}

export function VesperWorkPage() {
  return (
    <>
      <VesperMasthead masthead={VESPER_MASTHEADS.work} />
      <VesperWork />
      <VesperApproach />
      <VesperContact />
    </>
  );
}

export function VesperAboutPage() {
  return (
    <>
      <VesperMasthead masthead={VESPER_MASTHEADS.about} />
      <VesperAbout />
      <VesperServices />
      <VesperFaq />
      <VesperContact />
    </>
  );
}

export function VesperStackPage() {
  return (
    <>
      <VesperMasthead masthead={VESPER_MASTHEADS.stack} />
      <VesperStack />
      <VesperServices />
      <VesperContact />
    </>
  );
}

export function VesperContactPage() {
  return (
    <>
      <VesperMasthead masthead={VESPER_MASTHEADS.contact} />
      <VesperContact />
      <VesperFaq />
    </>
  );
}
