'use client';

import { PRISM_MASTHEADS } from '@/data/templates/prism-studio-content';
import {
  PrismContact,
  PrismFaq,
  PrismHero,
  PrismMarquee,
  PrismMasthead,
  PrismProcess,
  PrismServices,
  PrismStudio,
  PrismWorkList,
  PrismWorkRail,
} from './prism-sections';

/**
 * PRISM - what each page is made of.
 *
 * Composition only: no page holds markup of its own.
 *
 * The work rail appears on home and on the work page, but the work PAGE also
 * carries the plain list. That is not redundancy: the rail is the showpiece and
 * the list is how you actually find a project you half-remember, and a
 * portfolio that only offers the showpiece is a portfolio you cannot search.
 */

export function PrismHomePage() {
  return (
    <>
      <PrismHero />
      <PrismMarquee />
      <PrismWorkRail />
      <PrismStudio />
      <PrismProcess />
      <PrismFaq />
      <PrismContact />
    </>
  );
}

export function PrismWorkPage() {
  return (
    <>
      <PrismMasthead masthead={PRISM_MASTHEADS.work} />
      <PrismWorkRail />
      <PrismWorkList />
      <PrismContact />
    </>
  );
}

export function PrismStudioPage() {
  return (
    <>
      <PrismMasthead masthead={PRISM_MASTHEADS.studio} />
      <PrismStudio />
      <PrismProcess />
      <PrismFaq />
      <PrismContact />
    </>
  );
}

export function PrismServicesPage() {
  return (
    <>
      <PrismMasthead masthead={PRISM_MASTHEADS.services} />
      <PrismServices />
      <PrismProcess />
      <PrismFaq />
      <PrismContact />
    </>
  );
}

export function PrismContactPage() {
  return (
    <>
      <PrismMasthead masthead={PRISM_MASTHEADS.contact} />
      <PrismContact />
      <PrismFaq />
    </>
  );
}
