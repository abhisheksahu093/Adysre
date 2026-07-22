'use client';

import type { TemplateContent } from '@/data/templates/types';
import { CadenceMentors } from './cadence-mentors';
import { CadenceProof } from './cadence-proof';

/**
 * CADENCE - the mentors page. The people first, then the inverted proof band,
 * because the completion figures are the outcome of exactly what the roster
 * above describes: practitioners with two cohorts a term each.
 */
export function CadenceMentorsPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <CadenceMentors />
      <CadenceProof content={content} />
    </>
  );
}
