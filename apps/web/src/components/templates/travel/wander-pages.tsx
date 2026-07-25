'use client';

import { WANDER_MASTHEADS } from '@/data/templates/travel-content';
import {
  WanderAbout,
  WanderContact,
  WanderCta,
  WanderDestinations,
  WanderExperiences,
  WanderFaq,
  WanderGallery,
  WanderHero,
  WanderMap,
  WanderMarquee,
  WanderMasthead,
  WanderReviews,
  WanderStats,
  WanderSteps,
  WanderTours,
  WanderWhy,
} from './wander-sections';

/**
 * WANDER - what each page is made of. Composition only; Home leads with the
 * immersive hero, inner pages open with a masthead and recompose the shared
 * sections, so the eight-page site is one design that never contradicts itself.
 */

export function WanderHomePage() {
  return (
    <>
      <WanderHero />
      <WanderMarquee />
      <WanderDestinations />
      <WanderExperiences />
      <WanderTours />
      <WanderMap />
      <WanderWhy />
      <WanderSteps />
      <WanderGallery />
      <WanderStats />
      <WanderReviews />
      <WanderFaq />
      <WanderCta />
    </>
  );
}

export function WanderDestinationsPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.destinations} />
      <WanderDestinations />
      <WanderMap />
      <WanderExperiences />
      <WanderCta />
    </>
  );
}

export function WanderToursPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.tours} />
      <WanderTours />
      <WanderSteps />
      <WanderWhy />
      <WanderCta />
    </>
  );
}

export function WanderPackagesPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.packages} />
      <WanderTours />
      <WanderSteps />
      <WanderStats />
      <WanderCta />
    </>
  );
}

export function WanderGalleryPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.gallery} />
      <WanderGallery />
      <WanderReviews />
      <WanderCta />
    </>
  );
}

export function WanderReviewsPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.reviews} />
      <WanderReviews />
      <WanderStats />
      <WanderCta />
    </>
  );
}

export function WanderAboutPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.about} />
      <WanderAbout />
      <WanderWhy />
      <WanderStats />
      <WanderCta />
    </>
  );
}

export function WanderContactPage() {
  return (
    <>
      <WanderMasthead masthead={WANDER_MASTHEADS.contact} />
      <WanderContact />
    </>
  );
}
