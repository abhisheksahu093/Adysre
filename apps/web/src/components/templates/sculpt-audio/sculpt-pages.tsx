'use client';

import { SCULPT_MASTHEADS } from '@/data/templates/sculpt-audio-content';
import {
  SculptAbout,
  SculptContact,
  SculptFaq,
  SculptHero,
  SculptMarquee,
  SculptMasthead,
  SculptProducts,
  SculptSupport,
  SculptTechnology,
} from './sculpt-sections';

/**
 * SCULPT - what each page is made of.
 *
 * Composition only: no page holds markup of its own, so a section moves between
 * pages by moving one line. Sections repeat across pages on purpose - the FAQ
 * answers different anxieties on products than it does on home, and a five-page
 * site where each page ends in a dead end converts nothing.
 */

export function SculptHomePage() {
  return (
    <>
      <SculptHero />
      <SculptMarquee />
      <SculptAbout />
      <SculptProducts />
      <SculptTechnology />
      <SculptFaq />
      <SculptContact />
    </>
  );
}

export function SculptProductsPage() {
  return (
    <>
      <SculptMasthead masthead={SCULPT_MASTHEADS.products} />
      <SculptProducts />
      <SculptFaq />
      <SculptContact />
    </>
  );
}

export function SculptTechnologyPage() {
  return (
    <>
      <SculptMasthead masthead={SCULPT_MASTHEADS.technology} />
      <SculptTechnology />
      <SculptAbout />
      <SculptContact />
    </>
  );
}

export function SculptSupportPage() {
  return (
    <>
      <SculptMasthead masthead={SCULPT_MASTHEADS.support} />
      <SculptSupport />
      <SculptFaq />
      <SculptContact />
    </>
  );
}

export function SculptContactPage() {
  return (
    <>
      <SculptMasthead masthead={SCULPT_MASTHEADS.contact} />
      <SculptContact />
      <SculptFaq />
    </>
  );
}
