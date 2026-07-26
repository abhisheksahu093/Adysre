'use client';

import { CRESTLINE_MASTHEADS } from '@/data/templates/crestline-advisory-content';
import {
  CrestlineAbout,
  CrestlineContact,
  CrestlineFaq,
  CrestlineHero,
  CrestlineMarquee,
  CrestlineMasthead,
  CrestlineServices,
  CrestlineValues,
  CrestlineWhy,
} from './crestline-sections';

/**
 * CRESTLINE - what each page is made of.
 *
 * Composition only: no page holds markup of its own. Home leads with the hero;
 * the inner pages open with a masthead and recompose the shared sections, so the
 * four-page site is one design that never contradicts itself.
 */

export function CrestlineHomePage() {
  return (
    <>
      <CrestlineHero />
      <CrestlineMarquee />
      <CrestlineAbout />
      <CrestlineServices />
      <CrestlineWhy />
      <CrestlineFaq />
      <CrestlineContact />
    </>
  );
}

export function CrestlineAboutPage() {
  return (
    <>
      <CrestlineMasthead masthead={CRESTLINE_MASTHEADS.about} />
      <CrestlineAbout />
      <CrestlineValues />
      <CrestlineWhy />
      <CrestlineMarquee />
      <CrestlineContact />
    </>
  );
}

export function CrestlineServicesPage() {
  return (
    <>
      <CrestlineMasthead masthead={CRESTLINE_MASTHEADS.services} />
      <CrestlineServices />
      <CrestlineWhy />
      <CrestlineFaq />
      <CrestlineContact />
    </>
  );
}

export function CrestlineContactPage() {
  return (
    <>
      <CrestlineMasthead masthead={CRESTLINE_MASTHEADS.contact} />
      <CrestlineContact />
      <CrestlineMarquee />
    </>
  );
}
