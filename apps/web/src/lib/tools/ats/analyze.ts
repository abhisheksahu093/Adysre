import { SKILLS, STOPWORDS } from './skills';

/**
 * ATS resume analysis — entirely rule-based, no AI. Given the extracted resume
 * text and a job description, it scores keyword overlap, skills overlap, section
 * completeness, formatting and ATS-friendliness, and returns concrete
 * suggestions. Pure and unit-tested; the file extraction (PDF/DOCX/TXT) is a
 * separate client concern.
 */

export const RESUME_SECTIONS = [
  'contact',
  'summary',
  'experience',
  'projects',
  'skills',
  'education',
  'certifications',
  'languages',
  'links',
] as const;
export type SectionId = (typeof RESUME_SECTIONS)[number];

export interface AtsBreakdown {
  keywords: number;
  skills: number;
  sections: number;
  formatting: number;
  ats: number;
}

export interface AtsReport {
  overall: number;
  breakdown: AtsBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  sections: Record<SectionId, boolean>;
  suggestions: string[];
  stats: { wordCount: number; sectionCount: number; hasEmail: boolean; hasPhone: boolean; hasLinks: boolean };
}

const SECTION_PATTERNS: Record<Exclude<SectionId, 'contact' | 'links'>, RegExp> = {
  summary: /\b(summary|profile|objective|about me)\b/,
  experience: /\b(experience|employment|work history|professional background)\b/,
  projects: /\bprojects?\b/,
  skills: /\b(skills|technologies|technical|competenc|proficienc)\b/,
  education: /\b(education|academic|degree|university|college)\b/,
  certifications: /\b(certificat|licens|credential)\b/,
  languages: /\blanguages?\b/,
};

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /(\+?\d[\d\s().-]{7,}\d)/;
const LINK = /(https?:\/\/|linkedin\.com|github\.com|behance\.net|dribbble\.com|www\.)/;

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) ?? [];
}

/** Top keywords in the job description by frequency, minus stopwords. */
function jobKeywords(jd: string, limit = 20): string[] {
  const counts = new Map<string, number>();
  for (const w of words(jd)) {
    if (w.length < 4 || STOPWORDS.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([w]) => w);
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function analyzeResume(resumeText: string, jobDescription: string): AtsReport {
  const resume = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();
  const resumeWordCount = words(resumeText).length;

  // ── Skills ──────────────────────────────────────────────────────────────
  const has = (haystack: string, skill: string) => haystack.includes(skill);
  const jdSkills = SKILLS.filter((s) => has(jd, s));
  const matchedSkills = jdSkills.filter((s) => has(resume, s));
  const missingSkills = jdSkills.filter((s) => !has(resume, s));
  const skillsScore = jdSkills.length ? (matchedSkills.length / jdSkills.length) * 100 : 100;

  // ── Keywords ────────────────────────────────────────────────────────────
  const keywords = jobKeywords(jd);
  const matchedKeywords = keywords.filter((k) => resume.includes(k));
  const missingKeywords = keywords.filter((k) => !resume.includes(k));
  const keywordScore = keywords.length ? (matchedKeywords.length / keywords.length) * 100 : 100;

  // ── Sections ────────────────────────────────────────────────────────────
  const sections = { contact: EMAIL.test(resume) || PHONE.test(resume), links: LINK.test(resume) } as Record<SectionId, boolean>;
  for (const [id, re] of Object.entries(SECTION_PATTERNS)) sections[id as SectionId] = re.test(resume);
  const essential: SectionId[] = ['contact', 'experience', 'education', 'skills'];
  const essentialPresent = essential.filter((s) => sections[s]).length;
  const bonus = (['summary', 'projects', 'certifications'] as SectionId[]).filter((s) => sections[s]).length;
  const sectionsScore = clamp((essentialPresent / essential.length) * 85 + bonus * 5);
  const sectionCount = RESUME_SECTIONS.filter((s) => sections[s]).length;

  // ── Formatting (length-based; ATS parsers favour 400–900 words) ──────────
  const formattingScore =
    resumeWordCount < 150 ? 30 : resumeWordCount < 300 ? 65 : resumeWordCount <= 900 ? 100 : resumeWordCount <= 1200 ? 80 : 55;

  // ── ATS friendliness ──────────────────────────────────────────────────────
  const hasEmail = EMAIL.test(resume);
  const hasPhone = PHONE.test(resume);
  const hasLinks = LINK.test(resume);
  let atsScore = 100;
  if (!hasEmail) atsScore -= 25;
  if (!hasPhone) atsScore -= 10;
  if (!sections.skills) atsScore -= 15;
  if (!sections.experience) atsScore -= 15;
  if (resumeWordCount < 150) atsScore -= 15;
  atsScore = clamp(atsScore);

  const breakdown: AtsBreakdown = {
    keywords: clamp(keywordScore),
    skills: clamp(skillsScore),
    sections: sectionsScore,
    formatting: formattingScore,
    ats: atsScore,
  };

  const overall = clamp(
    breakdown.keywords * 0.3 + breakdown.skills * 0.3 + breakdown.sections * 0.2 + breakdown.formatting * 0.1 + breakdown.ats * 0.1,
  );

  // ── Suggestions ───────────────────────────────────────────────────────────
  const suggestions: string[] = [];
  if (missingSkills.length) suggestions.push(`Add these job-relevant skills if you have them: ${missingSkills.slice(0, 8).join(', ')}.`);
  if (missingKeywords.length) suggestions.push(`Weave in keywords from the posting: ${missingKeywords.slice(0, 6).join(', ')}.`);
  for (const s of essential) if (!sections[s]) suggestions.push(`Add a clear ${s} section.`);
  if (!hasEmail) suggestions.push('Include an email address at the top.');
  if (!hasPhone) suggestions.push('Include a phone number.');
  if (!hasLinks) suggestions.push('Add a LinkedIn or portfolio link.');
  if (resumeWordCount < 300) suggestions.push('Resume looks thin; expand achievements with metrics.');
  if (resumeWordCount > 1200) suggestions.push('Resume is long; tighten to 1–2 pages.');

  return {
    overall,
    breakdown,
    matchedKeywords,
    missingKeywords,
    matchedSkills,
    missingSkills,
    sections,
    suggestions,
    stats: { wordCount: resumeWordCount, sectionCount, hasEmail, hasPhone, hasLinks },
  };
}
