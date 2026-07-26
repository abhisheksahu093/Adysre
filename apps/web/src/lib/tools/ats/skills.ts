/**
 * A rule-based skills dictionary for the ATS scanner. Matching is substring on
 * word boundaries, so multi-word skills ("machine learning") and acronyms
 * ("aws") both work. No AI: a job description and a resume are compared against
 * this list. Extend it freely; it is the tuning surface for match quality.
 */

export const SKILLS: readonly string[] = [
  // languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift',
  'kotlin', 'scala', 'sql', 'html', 'css', 'bash', 'shell',
  // frontend
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'redux', 'tailwind', 'tailwindcss', 'sass',
  // backend
  'node.js', 'nodejs', 'express', 'nestjs', 'django', 'flask', 'spring', 'rails', 'graphql', 'rest', 'grpc',
  'microservices', 'api',
  // data / infra
  'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq',
  'docker', 'kubernetes', 'terraform', 'aws', 'gcp', 'azure', 'ci/cd', 'jenkins', 'github actions', 'linux',
  // data science
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'data analysis', 'nlp',
  // practices
  'agile', 'scrum', 'kanban', 'tdd', 'testing', 'unit testing', 'accessibility', 'seo', 'performance',
  // product / business
  'product management', 'roadmap', 'stakeholder', 'analytics', 'a/b testing', 'figma', 'ux', 'ui',
  'wireframe', 'user research', 'go-to-market', 'kpi', 'okr', 'leadership', 'communication', 'mentoring',
  // marketing / sales
  'salesforce', 'hubspot', 'crm', 'content marketing', 'copywriting', 'campaign', 'lead generation',
  'google analytics', 'excel', 'powerpoint',
];

/** Common English stopwords, excluded from JD keyword extraction. */
export const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'our', 'are', 'will', 'have', 'has', 'that', 'this', 'from',
  'their', 'they', 'them', 'a', 'an', 'to', 'of', 'in', 'on', 'as', 'at', 'by', 'be', 'or', 'is', 'we', 'it',
  'work', 'team', 'role', 'job', 'company', 'ability', 'strong', 'good', 'great', 'other', 'more', 'must',
  'should', 'can', 'who', 'what', 'when', 'where', 'which', 'about', 'across', 'within', 'using', 'used',
  'including', 'etc', 'per', 'via', 'plus', 'years', 'year', 'experience', 'skills', 'required', 'preferred',
]);
