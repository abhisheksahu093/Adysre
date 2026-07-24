/**
 * Resume templates: a palette + a layout variant, as config (the resume is a
 * paper artifact, styled inline like the invoice/signature output). The layout
 * changes the structure, not just the color. Adding a template is one entry.
 */

export interface ResumeTemplate {
  id: string;
  label: string;
  layout: 'classic' | 'sidebar' | 'modern';
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  fontClass: string;
}

export const RESUME_TEMPLATES: readonly ResumeTemplate[] = [
  { id: 'minimal', label: 'Minimal', layout: 'classic', surface: '#ffffff', text: '#18181b', muted: '#71717a', border: '#e4e4e7', accent: '#18181b', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'modern', label: 'Modern', layout: 'modern', surface: '#ffffff', text: '#0f172a', muted: '#64748b', border: '#e2e8f0', accent: '#2563eb', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'corporate', label: 'Corporate', layout: 'sidebar', surface: '#ffffff', text: '#1e293b', muted: '#64748b', border: '#cbd5e1', accent: '#0369a1', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'creative', label: 'Creative', layout: 'sidebar', surface: '#ffffff', text: '#1f2937', muted: '#6b7280', border: '#f3e8ff', accent: '#7c3aed', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'elegant', label: 'Elegant', layout: 'classic', surface: '#fbfaf7', text: '#292524', muted: '#78716c', border: '#e7e5e4', accent: '#9a7b4f', accentText: '#ffffff', fontClass: 'font-serif' },
];

export const RESUME_TEMPLATES_BY_ID: Record<string, ResumeTemplate> = Object.fromEntries(
  RESUME_TEMPLATES.map((t) => [t.id, t]),
);

export const RESUME_FONTS: Array<{ label: string; value: string }> = [
  { label: 'Sans', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: 'Serif', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Modern', value: "'Inter', system-ui, sans-serif" },
];
