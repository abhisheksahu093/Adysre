'use client';

import { SOLSTICE_MASTHEADS } from '@/data/templates/solstice-hotel-content';
import {
  SolsticeAbout,
  SolsticeContact,
  SolsticeDining,
  SolsticeExperiences,
  SolsticeFacts,
  SolsticeFaq,
  SolsticeHero,
  SolsticeMarquee,
  SolsticeMasthead,
  SolsticeRooms,
} from './solstice-sections';

/**
 * SOLSTICE - what each page is made of.
 *
 * Composition only: no page holds markup of its own. The dark dining band is
 * placed roughly two thirds down every page it appears on, because it is the
 * one tonal inversion on the site and it reads as a pause rather than a
 * different website only if it arrives after the paper has established itself.
 */

export function SolsticeHomePage() {
  return (
    <>
      <SolsticeHero />
      <SolsticeMarquee />
      <SolsticeAbout />
      <SolsticeRooms />
      <SolsticeDining />
      <SolsticeExperiences />
      <SolsticeFaq />
      <SolsticeContact />
    </>
  );
}

export function SolsticeRoomsPage() {
  return (
    <>
      <SolsticeMasthead masthead={SOLSTICE_MASTHEADS.rooms} />
      <SolsticeRooms />
      <SolsticeFacts />
      <SolsticeFaq />
      <SolsticeContact />
    </>
  );
}

export function SolsticeDiningPage() {
  return (
    <>
      <SolsticeMasthead masthead={SOLSTICE_MASTHEADS.dining} />
      <SolsticeDining />
      <SolsticeAbout />
      <SolsticeContact />
    </>
  );
}

export function SolsticeExperiencesPage() {
  return (
    <>
      <SolsticeMasthead masthead={SOLSTICE_MASTHEADS.experiences} />
      <SolsticeExperiences />
      <SolsticeFacts />
      <SolsticeDining />
      <SolsticeContact />
    </>
  );
}

export function SolsticeContactPage() {
  return (
    <>
      <SolsticeMasthead masthead={SOLSTICE_MASTHEADS.contact} />
      <SolsticeContact />
      <SolsticeFaq />
    </>
  );
}
