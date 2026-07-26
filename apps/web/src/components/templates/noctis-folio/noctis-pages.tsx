'use client';

import { NOCTIS_MASTHEADS } from '@/data/templates/noctis-folio-content';
import {
  NoctisApproach,
  NoctisContact,
  NoctisFaq,
  NoctisFilmStrip,
  NoctisHero,
  NoctisJournal,
  NoctisMarquee,
  NoctisMasthead,
  NoctisSeriesList,
  NoctisServices,
  NoctisStudio,
} from './noctis-sections';

/**
 * NOCTIS - what each page is made of.
 *
 * Composition only: no page holds markup of its own.
 *
 * The film strip appears on home and on the work page, but the work PAGE also
 * carries the plain list. That is not redundancy: the strip is the showpiece
 * and the list is how you actually find a series you half-remember, and a
 * portfolio that only offers the showpiece is a portfolio you cannot search.
 */

export function NoctisHomePage() {
  return (
    <>
      <NoctisHero />
      <NoctisMarquee />
      <NoctisFilmStrip />
      <NoctisStudio />
      <NoctisApproach />
      <NoctisFaq />
      <NoctisContact />
    </>
  );
}

export function NoctisWorkPage() {
  return (
    <>
      <NoctisMasthead masthead={NOCTIS_MASTHEADS.work} />
      <NoctisFilmStrip />
      <NoctisSeriesList />
      <NoctisContact />
    </>
  );
}

export function NoctisAboutPage() {
  return (
    <>
      <NoctisMasthead masthead={NOCTIS_MASTHEADS.about} />
      <NoctisStudio />
      <NoctisApproach />
      <NoctisServices />
      <NoctisFaq />
    </>
  );
}

export function NoctisJournalPage() {
  return (
    <>
      <NoctisMasthead masthead={NOCTIS_MASTHEADS.journal} />
      <NoctisJournal />
      <NoctisContact />
    </>
  );
}

export function NoctisContactPage() {
  return (
    <>
      <NoctisMasthead masthead={NOCTIS_MASTHEADS.contact} />
      <NoctisServices />
      <NoctisContact />
      <NoctisFaq />
    </>
  );
}
