/**
 * Salary-slip designs. Each is a layout plus a palette, as config, so the
 * preview renders genuinely different documents (a bordered classic slip, a
 * clean modern statement, a green corporate slip) rather than one recolored.
 * Colors are explicit hex because the slip is a paper artifact, like the QR/
 * invoice output. Adding a design is one entry here plus a branch in the preview.
 */

export interface SalaryDesign {
  id: string;
  label: string;
  layout: 'classic' | 'modern' | 'corporate';
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  /** Soft accent used for the net-pay highlight cards. */
  accentSoft: string;
}

export const SALARY_DESIGNS: readonly SalaryDesign[] = [
  {
    id: 'classic',
    label: 'Classic (bordered)',
    layout: 'classic',
    surface: '#ffffff',
    text: '#111111',
    muted: '#4b5563',
    border: '#111111',
    accent: '#111111',
    accentText: '#ffffff',
    accentSoft: '#f3f4f6',
  },
  {
    id: 'modern',
    label: 'Modern (clean)',
    layout: 'modern',
    surface: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#16a34a',
    accentText: '#ffffff',
    accentSoft: '#dcfce7',
  },
  {
    id: 'corporate',
    label: 'Corporate (green)',
    layout: 'corporate',
    surface: '#ffffff',
    text: '#14532d',
    muted: '#4b5563',
    border: '#d1d5db',
    accent: '#15803d',
    accentText: '#ffffff',
    accentSoft: '#dcfce7',
  },
];

export const SALARY_DESIGNS_BY_ID: Record<string, SalaryDesign> = Object.fromEntries(
  SALARY_DESIGNS.map((d) => [d.id, d]),
);
