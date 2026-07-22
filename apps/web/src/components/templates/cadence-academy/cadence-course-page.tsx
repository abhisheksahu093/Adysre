'use client';

import type { TemplateContent } from '@/data/templates/types';
import {
  CADENCE_COURSES,
  CADENCE_COURSE_ID,
  type CadenceCourse,
} from '@/data/templates/cadence-academy-content';
import { CadenceCertificate } from './cadence-certificate';
import { CadenceCourseMasthead } from './cadence-course-masthead';
import { CadenceCourseMentor } from './cadence-course-mentor';
import { CadenceCurriculum } from './cadence-curriculum';
import { CadenceFaq } from './cadence-faq';

/**
 * CADENCE - the single-course page.
 *
 * The course is looked up by id rather than passed in, because the detail view
 * is a designed example of one course and the curriculum below it was written
 * for that one. `find` can return undefined, so the first course is the floor:
 * a template has no error route, and an empty page would be worse than the
 * wrong one.
 *
 * The FAQ repeats here on purpose - most of what a visitor would ask before
 * reserving a place (time per week, missed sessions, refunds) is answered in
 * it, and answering before the form is better service than after.
 */
export function CadenceCoursePage({ content }: { content: TemplateContent }) {
  const course: CadenceCourse =
    CADENCE_COURSES.find((item) => item.id === CADENCE_COURSE_ID) ?? CADENCE_COURSES[0]!;

  return (
    <>
      <CadenceCourseMasthead course={course} />
      <CadenceCurriculum />
      <CadenceCourseMentor course={course} />
      <CadenceCertificate />
      <CadenceFaq content={content} />
    </>
  );
}
