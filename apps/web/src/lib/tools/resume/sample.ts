import type { ResumeData, ResumeSection } from './types';

/** Default section order + visibility. */
export const DEFAULT_SECTIONS: ResumeSection[] = [
  { id: 's-summary', type: 'summary', title: 'Summary', visible: true },
  { id: 's-experience', type: 'experience', title: 'Experience', visible: true },
  { id: 's-projects', type: 'projects', title: 'Projects', visible: true },
  { id: 's-skills', type: 'skills', title: 'Skills', visible: true },
  { id: 's-education', type: 'education', title: 'Education', visible: true },
  { id: 's-certifications', type: 'certifications', title: 'Certifications', visible: false },
  { id: 's-links', type: 'links', title: 'Links', visible: true },
];

export const SAMPLE_RESUME: ResumeData = {
  templateId: 'modern',
  design: { accent: '#2563eb', font: "'Helvetica Neue', Helvetica, Arial, sans-serif", pageSize: 'A4' },
  photo: '',
  contact: {
    name: 'Jane Doe',
    headline: 'Senior Frontend Engineer',
    email: 'jane@example.com',
    phone: '+1 555 010 2040',
    location: 'San Francisco, CA',
    website: 'janedoe.dev',
  },
  summary:
    'Frontend engineer with 8 years building fast, accessible web apps. Led design systems, performance and CI/CD across product teams.',
  experience: [
    { id: 'e1', role: 'Senior Frontend Engineer', company: 'Acme Studio', period: '2021 to Present', location: 'Remote', bullets: 'Led the React/Next.js design system used across 12 products.\nCut LCP by 40% and set up the CI/CD pipeline.\nMentored 4 engineers.' },
    { id: 'e2', role: 'Frontend Engineer', company: 'Northwind', period: '2018 to 2021', location: 'Portland, OR', bullets: 'Built the customer dashboard in TypeScript and Tailwind.\nDrove accessibility to WCAG AA.' },
  ],
  education: [{ id: 'ed1', degree: 'B.S. Computer Science', school: 'State University', period: '2014 to 2018', details: '' }],
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'Testing', 'CI/CD', 'Accessibility', 'Performance'],
  projects: [{ id: 'p1', name: 'Adysre UI', url: 'github.com/adysre/ui', description: 'Open-source component library with 460+ blocks and icons.' }],
  certifications: [{ id: 'c1', name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023' }],
  links: [
    { id: 'l1', label: 'GitHub', url: 'github.com/jane' },
    { id: 'l2', label: 'LinkedIn', url: 'linkedin.com/in/jane' },
  ],
  sections: DEFAULT_SECTIONS,
};
