'use client';

import { MARFA_MASTHEADS } from '@/data/templates/marfa-studio-content';
import {
  MarfaApproach,
  MarfaContact,
  MarfaFaq,
  MarfaFeatured,
  MarfaHero,
  MarfaMarquee,
  MarfaMasthead,
  MarfaServices,
  MarfaStudio,
  MarfaWords,
  MarfaWorkIndex,
} from './marfa-sections';

/**
 * MARFA - what each page is made of.
 *
 * Composition only: no page holds markup of its own.
 *
 * The home page shows three featured projects as parallax rows; the work page
 * shows the full index as magnetic thumbnails. That is not redundancy: the
 * home page is a considered selection, the work page is the complete record.
 */

export function MarfaHomePage() {
  return (
    <>
      <MarfaHero />
      <MarfaMarquee />
      <MarfaFeatured />
      <MarfaStudio />
      <MarfaApproach />
      <MarfaFaq />
      <MarfaContact />
    </>
  );
}

export function MarfaWorkPage() {
  return (
    <>
      <MarfaMasthead masthead={MARFA_MASTHEADS.work} />
      <MarfaWorkIndex />
      <MarfaContact />
    </>
  );
}

export function MarfaStudioPage() {
  return (
    <>
      <MarfaMasthead masthead={MARFA_MASTHEADS.studio} />
      <MarfaStudio />
      <MarfaApproach />
      <MarfaServices />
      <MarfaFaq />
    </>
  );
}

export function MarfaWordsPage() {
  return (
    <>
      <MarfaMasthead masthead={MARFA_MASTHEADS.words} />
      <MarfaWords />
      <MarfaContact />
    </>
  );
}

export function MarfaContactPage() {
  return (
    <>
      <MarfaMasthead masthead={MARFA_MASTHEADS.contact} />
      <MarfaServices />
      <MarfaContact />
      <MarfaFaq />
    </>
  );
}
