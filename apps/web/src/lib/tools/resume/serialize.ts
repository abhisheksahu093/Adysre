import type { ResumeData, ResumeSection } from './types';
import { SAMPLE_RESUME } from './sample';

/**
 * Resume export/import. JSON is the loss-less round-trip; importing merges onto
 * the sample so a partial or older file still yields a complete, renderable
 * resume. Pure and unit-tested.
 */

export function orderedVisibleSections(data: ResumeData): ResumeSection[] {
  return data.sections.filter((s) => s.visible);
}

export function toJson(data: ResumeData): string {
  return JSON.stringify(data, null, 2);
}

/** Parse a resume JSON; returns null on invalid JSON, merges missing fields. */
export function fromJson(raw: string): ResumeData | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const p = parsed as Partial<ResumeData>;

  return {
    ...SAMPLE_RESUME,
    ...p,
    design: { ...SAMPLE_RESUME.design, ...(p.design ?? {}) },
    contact: { ...SAMPLE_RESUME.contact, ...(p.contact ?? {}) },
    sections: Array.isArray(p.sections) && p.sections.length > 0 ? p.sections : SAMPLE_RESUME.sections,
    experience: Array.isArray(p.experience) ? p.experience : [],
    education: Array.isArray(p.education) ? p.education : [],
    projects: Array.isArray(p.projects) ? p.projects : [],
    certifications: Array.isArray(p.certifications) ? p.certifications : [],
    links: Array.isArray(p.links) ? p.links : [],
    skills: Array.isArray(p.skills) ? p.skills.filter((s): s is string => typeof s === 'string') : [],
  };
}
