/**
 * Resume model for the builder. Section content lives in typed fields; a
 * separate `sections` array holds the order and visibility, so drag-reordering
 * and show/hide are just edits to that array and the preview renders it in
 * order. The look comes from a template + a small design object (like the
 * invoice/signature tools).
 */

export const SECTION_TYPES = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'links',
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
}

export interface Contact {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
  details: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  url: string;
  description: string;
}

export interface CertItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface ResumeDesign {
  accent: string;
  font: string;
  pageSize: 'A4' | 'Letter';
}

export interface ResumeData {
  templateId: string;
  design: ResumeDesign;
  photo: string;
  contact: Contact;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertItem[];
  links: LinkItem[];
  sections: ResumeSection[];
}
