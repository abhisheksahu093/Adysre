'use client';

import { ASTER_MASTHEADS } from '@/data/templates/healthcare-content';
import {
  AsterAbout,
  AsterBlog,
  AsterContact,
  AsterCta,
  AsterDepartments,
  AsterDoctors,
  AsterFaq,
  AsterHero,
  AsterMarquee,
  AsterMasthead,
  AsterStats,
  AsterSteps,
  AsterTestimonials,
  AsterWhy,
} from './aster-sections';

/**
 * ASTER - what each page is made of. Composition only; Home leads with the
 * hero, inner pages open with a masthead and recompose the shared sections, so
 * the seven-page site is one design that never contradicts itself.
 */

export function AsterHomePage() {
  return (
    <>
      <AsterHero />
      <AsterMarquee />
      <AsterAbout />
      <AsterDepartments />
      <AsterWhy />
      <AsterDoctors />
      <AsterSteps />
      <AsterStats />
      <AsterTestimonials />
      <AsterBlog />
      <AsterFaq />
      <AsterCta />
    </>
  );
}

export function AsterDoctorsPage() {
  return (
    <>
      <AsterMasthead masthead={ASTER_MASTHEADS.doctors} />
      <AsterDoctors />
      <AsterDepartments />
      <AsterCta />
    </>
  );
}

export function AsterDepartmentsPage() {
  return (
    <>
      <AsterMasthead masthead={ASTER_MASTHEADS.departments} />
      <AsterDepartments />
      <AsterWhy />
      <AsterCta />
    </>
  );
}

export function AsterAppointmentsPage() {
  return (
    <>
      <AsterMasthead masthead={ASTER_MASTHEADS.appointments} />
      <AsterSteps />
      <AsterContact />
      <AsterCta />
    </>
  );
}

export function AsterBlogPage() {
  return (
    <>
      <AsterMasthead masthead={ASTER_MASTHEADS.blog} />
      <AsterBlog />
      <AsterCta />
    </>
  );
}

export function AsterAboutPage() {
  return (
    <>
      <AsterMasthead masthead={ASTER_MASTHEADS.about} />
      <AsterAbout />
      <AsterWhy />
      <AsterStats />
      <AsterTestimonials />
      <AsterCta />
    </>
  );
}

export function AsterContactPage() {
  return (
    <>
      <AsterMasthead masthead={ASTER_MASTHEADS.contact} />
      <AsterContact />
    </>
  );
}
