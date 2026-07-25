/**
 * Resume templates: a palette + a layout variant, as config (the resume is a
 * paper artifact, styled inline like the invoice/signature output). The layout
 * changes the structure, not just the color. Adding a template is one entry.
 */

export type SkillStyle = 'pill' | 'bar' | 'dots';

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
  /** Sidebar rail background; defaults to `accent` when omitted. */
  sidebar?: string;
  /** Sidebar text / muted text; default to `accentText` / a faded accentText. */
  sidebarText?: string;
  sidebarMuted?: string;
  /** How the sidebar renders skills. Default 'pill'. */
  skillStyle?: SkillStyle;
  /** Show icons beside contact lines in the sidebar. */
  contactIcons?: boolean;
}

export const RESUME_TEMPLATES: readonly ResumeTemplate[] = [
  { id: 'minimal', label: 'Minimal', layout: 'classic', surface: '#ffffff', text: '#18181b', muted: '#71717a', border: '#e4e4e7', accent: '#18181b', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'modern', label: 'Modern', layout: 'modern', surface: '#ffffff', text: '#0f172a', muted: '#64748b', border: '#e2e8f0', accent: '#2563eb', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'corporate', label: 'Corporate', layout: 'sidebar', surface: '#ffffff', text: '#1e293b', muted: '#64748b', border: '#cbd5e1', accent: '#0369a1', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'creative', label: 'Creative', layout: 'sidebar', surface: '#ffffff', text: '#1f2937', muted: '#6b7280', border: '#f3e8ff', accent: '#7c3aed', accentText: '#ffffff', fontClass: 'font-sans' },
  { id: 'elegant', label: 'Elegant', layout: 'classic', surface: '#fbfaf7', text: '#292524', muted: '#78716c', border: '#e7e5e4', accent: '#9a7b4f', accentText: '#ffffff', fontClass: 'font-serif' },
  // Dark navy rail, blue accent, skill bars: a software-engineer look.
  {
    id: 'onyx', label: 'Onyx', layout: 'sidebar', surface: '#ffffff', text: '#1f2937', muted: '#6b7280', border: '#e5e7eb',
    accent: '#2563eb', accentText: '#ffffff', fontClass: 'font-sans',
    sidebar: '#111827', sidebarText: '#f9fafb', sidebarMuted: '#9ca3af', skillStyle: 'bar', contactIcons: true,
  },
  // Deep-blue rail on a cream page, skill bars, icon contacts.
  {
    id: 'azure', label: 'Azure', layout: 'sidebar', surface: '#faf9f6', text: '#1e293b', muted: '#64748b', border: '#e2e8f0',
    accent: '#1e3a8a', accentText: '#ffffff', fontClass: 'font-sans',
    sidebar: '#1e3a5f', sidebarText: '#f8fafc', sidebarMuted: '#cbd5e1', skillStyle: 'bar', contactIcons: true,
  },
  // Light rail, green accent, dot ratings: a clean designer look.
  {
    id: 'verdant', label: 'Verdant', layout: 'sidebar', surface: '#ffffff', text: '#1f2937', muted: '#6b7280', border: '#e5e7eb',
    accent: '#16a34a', accentText: '#ffffff', fontClass: 'font-sans',
    sidebar: '#f6f8f6', sidebarText: '#1f2937', sidebarMuted: '#6b7280', skillStyle: 'dots', contactIcons: true,
  },
];

export const RESUME_TEMPLATES_BY_ID: Record<string, ResumeTemplate> = Object.fromEntries(
  RESUME_TEMPLATES.map((t) => [t.id, t]),
);

export const RESUME_FONTS: Array<{ label: string; value: string }> = [
  { label: 'Sans', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: 'Serif', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Modern', value: "'Inter', system-ui, sans-serif" },
];
