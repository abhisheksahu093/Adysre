import type { ComponentEntry } from './types';

/**
 * Badges category.
 *
 * Ten badges that share one non-negotiable rule: colour is reinforcement,
 * never the message. Roughly 1 in 12 men cannot tell the green dot from the
 * red one, so every badge here pairs its colour with a word, a number or an
 * icon that carries the meaning on its own. The other shared constraint is
 * scale - a badge is the smallest text on the page, usually 11-12px, which is
 * exactly where AA contrast is hardest to hit and easiest to ignore.
 */
export const badgesComponents: ComponentEntry[] = [
  {
    slug: 'badge-status-set',
    category: 'badges',
    tags: ['badge', 'status', 'dot', 'label', 'state'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1840, copies: 512, downloads: 131 },
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      {
        name: 'status',
        type: "'success' | 'warning' | 'danger' | 'info'",
        default: "'info'",
        descriptionKey: 'status',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The dot is aria-hidden and the colour repeats in the text - "Success",
  "Failed" - because the colour alone is invisible to a colour-blind reader
  and to anyone hearing the page. The word is the badge; the dot decorates it.
-->
<div class="badge-status-row">
  <span class="badge-status badge-status--success">
    <span class="badge-status__dot" aria-hidden="true"></span>
    Success
  </span>
  <span class="badge-status badge-status--warning">
    <span class="badge-status__dot" aria-hidden="true"></span>
    Pending review
  </span>
  <span class="badge-status badge-status--danger">
    <span class="badge-status__dot" aria-hidden="true"></span>
    Failed
  </span>
  <span class="badge-status badge-status--info">
    <span class="badge-status__dot" aria-hidden="true"></span>
    In progress
  </span>
</div>`,
      css: `.badge-status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge-status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px var(--badge-ring);
}

.badge-status__dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: var(--badge-dot);
}

/* Text is the 800 shade on a 50 tint - the smallest text on the page needs
   the largest contrast headroom, and 800-on-50 clears 4.5:1 with room. */
.badge-status--success {
  --badge-ring: rgba(22, 163, 74, 0.2);
  --badge-dot: #16a34a;
  background-color: #f0fdf4;
  color: #166534;
}

.badge-status--warning {
  --badge-ring: rgba(217, 119, 6, 0.3);
  --badge-dot: #f59e0b;
  background-color: #fffbeb;
  color: #92400e;
}

.badge-status--danger {
  --badge-ring: rgba(220, 38, 38, 0.2);
  --badge-dot: #dc2626;
  background-color: #fef2f2;
  color: #991b1b;
}

.badge-status--info {
  --badge-ring: rgba(37, 99, 235, 0.2);
  --badge-dot: #2563eb;
  background-color: #eff6ff;
  color: #1e40af;
}

/* Dark mode swaps the tinted surface for a translucent wash and lifts the
   text to the 300 shade - the 800s vanish against a dark page. */
@media (prefers-color-scheme: dark) {
  .badge-status--success {
    --badge-ring: rgba(74, 222, 128, 0.3);
    --badge-dot: #4ade80;
    background-color: rgba(34, 197, 94, 0.1);
    color: #86efac;
  }

  .badge-status--warning {
    --badge-ring: rgba(251, 191, 36, 0.3);
    --badge-dot: #fbbf24;
    background-color: rgba(251, 191, 36, 0.1);
    color: #fcd34d;
  }

  .badge-status--danger {
    --badge-ring: rgba(248, 113, 113, 0.3);
    --badge-dot: #f87171;
    background-color: rgba(239, 68, 68, 0.1);
    color: #fca5a5;
  }

  .badge-status--info {
    --badge-ring: rgba(96, 165, 250, 0.3);
    --badge-dot: #60a5fa;
    background-color: rgba(59, 130, 246, 0.1);
    color: #93c5fd;
  }
}`,
      tailwind: `<!--
  The dot is aria-hidden and the colour repeats in the text - the word is the
  badge, the dot decorates it. Colour must never be the only signal.
-->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/30">
    <span class="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true"></span>
    Success
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/30 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30">
    <span class="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400" aria-hidden="true"></span>
    Pending review
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-800 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30">
    <span class="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" aria-hidden="true"></span>
    Failed
  </span>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30">
    <span class="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
    In progress
  </span>
</div>`,
      react: `const STATUS_STYLES = {
  success: {
    badge:
      'bg-green-50 text-green-800 ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/30',
    dot: 'bg-green-600 dark:bg-green-400',
  },
  warning: {
    badge:
      'bg-amber-50 text-amber-800 ring-amber-600/30 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  danger: {
    badge:
      'bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30',
    dot: 'bg-red-600 dark:bg-red-400',
  },
  info: {
    badge:
      'bg-blue-50 text-blue-800 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30',
    dot: 'bg-blue-600 dark:bg-blue-400',
  },
};

export function StatusBadge({ label, status = 'info', className = '' }) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={\`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset \${styles.badge} \${className}\`}
    >
      {/* Decorative - the label carries the state for readers who cannot
          see (or cannot distinguish) the colour. */}
      <span className={\`h-1.5 w-1.5 rounded-full \${styles.dot}\`} aria-hidden="true" />
      {label}
    </span>
  );
}`,
      typescript: `export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info';

export interface StatusBadgeProps {
  /** The state, in words. Required - colour alone is not a message. */
  label: string;
  status?: BadgeStatus;
  className?: string;
}

const STATUS_STYLES: Record<BadgeStatus, { badge: string; dot: string }> = {
  success: {
    badge:
      'bg-green-50 text-green-800 ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/30',
    dot: 'bg-green-600 dark:bg-green-400',
  },
  warning: {
    badge:
      'bg-amber-50 text-amber-800 ring-amber-600/30 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  danger: {
    badge:
      'bg-red-50 text-red-800 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30',
    dot: 'bg-red-600 dark:bg-red-400',
  },
  info: {
    badge:
      'bg-blue-50 text-blue-800 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30',
    dot: 'bg-blue-600 dark:bg-blue-400',
  },
};

export function StatusBadge({
  label,
  status = 'info',
  className = '',
}: StatusBadgeProps): JSX.Element {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className={\`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset \${styles.badge} \${className}\`}
    >
      <span className={\`h-1.5 w-1.5 rounded-full \${styles.dot}\`} aria-hidden="true" />
      {label}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-pill-soft',
    category: 'badges',
    tags: ['badge', 'pill', 'soft', 'tag', 'label', 'tint'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1620, copies: 448, downloads: 102 },
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      {
        name: 'color',
        type: "'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet'",
        default: "'gray'",
        descriptionKey: 'color',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", descriptionKey: 'size' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Soft pills are for neutral labelling - categories, tags, counts of things
  that are fine. The tint is decoration; the text is the label. If a pill
  means "something is wrong", that belongs to the status badge with its dot.
-->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-500/15 dark:text-gray-300">Design</span>
  <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300">Engineering</span>
  <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-500/15 dark:text-green-300">Marketing</span>
  <span class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">Operations</span>
  <span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800 dark:bg-red-500/15 dark:text-red-300">Urgent</span>
  <span class="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-800 dark:bg-violet-500/15 dark:text-violet-300">Research</span>
</div>`,
      react: `const PILL_COLORS = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
};

const PILL_SIZES = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function PillBadge({ label, color = 'gray', size = 'md', className = '' }) {
  return (
    <span
      className={\`inline-flex items-center rounded-full font-medium \${PILL_COLORS[color]} \${PILL_SIZES[size]} \${className}\`}
    >
      {label}
    </span>
  );
}`,
      nextjs: `// No 'use client' - a pill is text with a background. It has no state and no
// handlers, so it renders as a Server Component and ships zero JS.
export type PillColor = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet';
export type PillSize = 'sm' | 'md' | 'lg';

interface PillBadgeProps {
  label: string;
  color?: PillColor;
  size?: PillSize;
  className?: string;
}

const PILL_COLORS: Record<PillColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
};

const PILL_SIZES: Record<PillSize, string> = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function PillBadge({ label, color = 'gray', size = 'md', className = '' }: PillBadgeProps) {
  return (
    <span
      className={\`inline-flex items-center rounded-full font-medium \${PILL_COLORS[color]} \${PILL_SIZES[size]} \${className}\`}
    >
      {label}
    </span>
  );
}`,
      typescript: `export type PillColor = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'violet';
export type PillSize = 'sm' | 'md' | 'lg';

export interface PillBadgeProps {
  label: string;
  /** Tint only - pick for taste, not for meaning. Meaning lives in the label. */
  color?: PillColor;
  size?: PillSize;
  className?: string;
}

/* Text is the 800 shade on a 100 tint: 12px medium text is the hardest place
   on the page to hit 4.5:1, so the pairs are chosen with headroom, not at the
   limit. Dark mode swaps the tint for a translucent wash so the pill sits on
   any dark surface without inventing a new grey. */
const PILL_COLORS: Record<PillColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
};

const PILL_SIZES: Record<PillSize, string> = {
  sm: 'px-2 py-0.5 text-[0.6875rem]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function PillBadge({
  label,
  color = 'gray',
  size = 'md',
  className = '',
}: PillBadgeProps): JSX.Element {
  return (
    <span
      className={\`inline-flex items-center rounded-full font-medium \${PILL_COLORS[color]} \${PILL_SIZES[size]} \${className}\`}
    >
      {label}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-outline-set',
    category: 'badges',
    tags: ['badge', 'outline', 'border', 'tag', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1210, copies: 334, downloads: 76 },
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      {
        name: 'color',
        type: "'gray' | 'blue' | 'green' | 'amber' | 'red'",
        default: "'gray'",
        descriptionKey: 'color',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The outline badge paints no surface - it borrows the page's - so it works
  on white cards, tinted panels and photos alike. The cost: the text colour
  must clear AA against *any* plausible background, which is why the light
  shades stop at 700 and never reach for a 400.
-->
<div class="flex flex-wrap items-center gap-2">
  <span class="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300">Draft</span>
  <span class="inline-flex items-center rounded-full border border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/40 dark:text-blue-300">Beta</span>
  <span class="inline-flex items-center rounded-full border border-green-300 px-2.5 py-1 text-xs font-medium text-green-700 dark:border-green-500/40 dark:text-green-300">Stable</span>
  <span class="inline-flex items-center rounded-full border border-amber-300 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-500/40 dark:text-amber-300">Deprecated</span>
  <span class="inline-flex items-center rounded-full border border-red-300 px-2.5 py-1 text-xs font-medium text-red-700 dark:border-red-500/40 dark:text-red-300">Removed</span>
</div>`,
      react: `const OUTLINE_COLORS = {
  gray: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  blue: 'border-blue-300 text-blue-700 dark:border-blue-500/40 dark:text-blue-300',
  green: 'border-green-300 text-green-700 dark:border-green-500/40 dark:text-green-300',
  amber: 'border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-300',
  red: 'border-red-300 text-red-700 dark:border-red-500/40 dark:text-red-300',
};

export function OutlineBadge({ label, color = 'gray', className = '' }) {
  return (
    <span
      className={\`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium \${OUTLINE_COLORS[color]} \${className}\`}
    >
      {label}
    </span>
  );
}`,
      typescript: `export type OutlineColor = 'gray' | 'blue' | 'green' | 'amber' | 'red';

export interface OutlineBadgeProps {
  label: string;
  color?: OutlineColor;
  className?: string;
}

/* No background of its own, so the text must clear AA against whatever the
   page provides - light shades stop at 700, dark shades sit at 300. */
const OUTLINE_COLORS: Record<OutlineColor, string> = {
  gray: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  blue: 'border-blue-300 text-blue-700 dark:border-blue-500/40 dark:text-blue-300',
  green: 'border-green-300 text-green-700 dark:border-green-500/40 dark:text-green-300',
  amber: 'border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-300',
  red: 'border-red-300 text-red-700 dark:border-red-500/40 dark:text-red-300',
};

export function OutlineBadge({
  label,
  color = 'gray',
  className = '',
}: OutlineBadgeProps): JSX.Element {
  return (
    <span
      className={\`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium \${OUTLINE_COLORS[color]} \${className}\`}
    >
      {label}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-counter',
    category: 'badges',
    tags: ['badge', 'counter', 'count', 'notification', 'unread'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2110, copies: 604, downloads: 148 },
    props: [
      { name: 'count', type: 'number', required: true, descriptionKey: 'count' },
      { name: 'max', type: 'number', default: '99', descriptionKey: 'max' },
      {
        name: 'srLabel',
        type: 'string',
        descriptionKey: 'srLabel',
        example: 'unread notifications',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The cap ("99+") is a layout decision wearing a content hat: an uncapped
  counter grows one character per order of magnitude and eventually pushes
  its host off-grid. The sr-only suffix is the other half of the component -
  a bare "99+" announced out of context is a number, not a message.
-->
<span class="badge-counter">
  99+
  <span class="badge-counter__sr">unread notifications</span>
</span>`,
      css: `.badge-counter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* min-width, not width: one digit renders a circle, "99+" stretches into a
     pill instead of squeezing the glyphs. */
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background-color: #dc2626;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1;
}

/* Visually hidden, present in the accessibility tree. */
.badge-counter__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* No dark-mode block: red-600 under white text clears AA on its own surface,
   and the badge paints that surface itself - nothing here inherits the theme. */`,
      tailwind: `<!--
  min-w + px, not a fixed width: one digit is a circle, "99+" is a pill.
  The sr-only suffix gives the number its noun - "99+ unread notifications".
-->
<span class="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[0.6875rem] font-semibold leading-none text-white">
  99+
  <span class="sr-only">unread notifications</span>
</span>`,
      react: `export function CounterBadge({ count, max = 99, srLabel = '', className = '' }) {
  // Zero renders nothing: an empty red circle is a false alarm, and "0" is a
  // fact nobody pinned a badge for.
  if (count <= 0) return null;

  const display = count > max ? \`\${max}+\` : String(count);

  return (
    <span
      className={\`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[0.6875rem] font-semibold leading-none text-white \${className}\`}
    >
      {display}
      {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
    </span>
  );
}`,
      typescript: `export interface CounterBadgeProps {
  count: number;
  /** Cap above which the badge shows "max+". Uncapped counters break layouts. */
  max?: number;
  /** The number's noun for screen readers, e.g. 'unread notifications'. */
  srLabel?: string;
  className?: string;
}

export function CounterBadge({
  count,
  max = 99,
  srLabel = '',
  className = '',
}: CounterBadgeProps): JSX.Element | null {
  // Zero renders nothing: an empty red circle is a false alarm.
  if (count <= 0) return null;

  const display = count > max ? \`\${max}+\` : String(count);

  return (
    <span
      className={\`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[0.6875rem] font-semibold leading-none text-white \${className}\`}
    >
      {display}
      {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-removable',
    category: 'badges',
    tags: ['badge', 'removable', 'chip', 'dismiss', 'filter', 'interactive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1930, copies: 517, downloads: 122 },
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'onRemove', type: '() => void', descriptionKey: 'onRemove' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The whole chip is NOT a button - only the × is. Making the entire pill
  clickable would give it two jobs (represent the filter, remove the filter)
  and one accessible name. The button carries "Remove <label>" so a screen
  reader hears the verb, not just an ×.
-->
<span class="inline-flex items-center gap-0.5 rounded-full bg-blue-100 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300">
  React
  <button
    type="button"
    aria-label="Remove React"
    class="-my-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blue-700 hover:bg-blue-600/20 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-100 dark:focus-visible:ring-blue-400"
  >
    <svg viewBox="0 0 8 8" class="h-2 w-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
      <path d="M1 1l6 6M7 1L1 7" />
    </svg>
  </button>
</span>`,
      react: `export function RemovableBadge({ label, onRemove, className = '' }) {
  return (
    <span
      className={\`inline-flex items-center gap-0.5 rounded-full bg-blue-100 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 \${className}\`}
    >
      {label}
      <button
        type="button"
        aria-label={\`Remove \${label}\`}
        onClick={onRemove}
        className="-my-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blue-700 hover:bg-blue-600/20 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-100 dark:focus-visible:ring-blue-400"
      >
        {/* -my-1 lets the 24px hit area overhang the pill without inflating
            its height - the target is bigger than the chip looks. */}
        <svg
          viewBox="0 0 8 8"
          className="h-2 w-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 1l6 6M7 1L1 7" />
        </svg>
      </button>
    </span>
  );
}`,
      nextjs: `'use client';

// 'use client' is required: the × takes an onClick. The chip itself is inert -
// if you render a read-only list without onRemove, drop the button and this
// can go back to being a Server Component.
interface RemovableBadgeProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function RemovableBadge({ label, onRemove, className = '' }: RemovableBadgeProps) {
  return (
    <span
      className={\`inline-flex items-center gap-0.5 rounded-full bg-blue-100 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 \${className}\`}
    >
      {label}
      <button
        type="button"
        aria-label={\`Remove \${label}\`}
        onClick={onRemove}
        className="-my-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blue-700 hover:bg-blue-600/20 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-100 dark:focus-visible:ring-blue-400"
      >
        <svg
          viewBox="0 0 8 8"
          className="h-2 w-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 1l6 6M7 1L1 7" />
        </svg>
      </button>
    </span>
  );
}`,
      typescript: `export interface RemovableBadgeProps {
  label: string;
  /** Called when the × is clicked or activated with Enter/Space. */
  onRemove?: () => void;
  className?: string;
}

export function RemovableBadge({
  label,
  onRemove,
  className = '',
}: RemovableBadgeProps): JSX.Element {
  return (
    <span
      className={\`inline-flex items-center gap-0.5 rounded-full bg-blue-100 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 \${className}\`}
    >
      {label}
      {/* A real <button>: Enter, Space and focus come free. aria-label names
          the action AND the target - a list of chips each announcing just
          "remove" is a guessing game. */}
      <button
        type="button"
        aria-label={\`Remove \${label}\`}
        onClick={onRemove}
        className="-my-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blue-700 hover:bg-blue-600/20 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-100 dark:focus-visible:ring-blue-400"
      >
        <svg
          viewBox="0 0 8 8"
          className="h-2 w-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 1l6 6M7 1L1 7" />
        </svg>
      </button>
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-with-icon',
    category: 'badges',
    tags: ['badge', 'icon', 'svg', 'label', 'inline'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1440, copies: 391, downloads: 88 },
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The icon is aria-hidden and sized in em-relative units (h-3.5 ≈ cap height
  at text-xs) so it scales with the label instead of towering over it. The
  label is never optional - an icon-only badge is a rebus, not a badge.
-->
<span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30">
  <svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
    <path d="M8.9 1.2 3.3 8.5a.5.5 0 0 0 .4.8h2.9l-.6 5a.5.5 0 0 0 .9.4l5.7-7.4a.5.5 0 0 0-.4-.8H9.3l.5-4.9a.5.5 0 0 0-.9-.4Z" />
  </svg>
  Fast track
</span>`,
      react: `const DEFAULT_ICON = (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
    <path d="M8.9 1.2 3.3 8.5a.5.5 0 0 0 .4.8h2.9l-.6 5a.5.5 0 0 0 .9.4l5.7-7.4a.5.5 0 0 0-.4-.8H9.3l.5-4.9a.5.5 0 0 0-.9-.4Z" />
  </svg>
);

export function IconBadge({ label, icon = DEFAULT_ICON, className = '' }) {
  return (
    <span
      className={\`inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30 \${className}\`}
    >
      {icon}
      {label}
    </span>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface IconBadgeProps {
  /** Always visible. The icon decorates the label; it never replaces it. */
  label: string;
  /** Any inline SVG. Mark it aria-hidden and size it h-3.5 to sit on the
      text's cap height - the default bolt shows the pattern. */
  icon?: ReactNode;
  className?: string;
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
    <path d="M8.9 1.2 3.3 8.5a.5.5 0 0 0 .4.8h2.9l-.6 5a.5.5 0 0 0 .9.4l5.7-7.4a.5.5 0 0 0-.4-.8H9.3l.5-4.9a.5.5 0 0 0-.9-.4Z" />
  </svg>
);

export function IconBadge({
  label,
  icon = DEFAULT_ICON,
  className = '',
}: IconBadgeProps): JSX.Element {
  return (
    <span
      className={\`inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30 \${className}\`}
    >
      {icon}
      {label}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-gradient-shine',
    category: 'badges',
    tags: ['badge', 'gradient', 'shine', 'animated', 'highlight', 'new'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1760, copies: 462, downloads: 97 },
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Tailwind cannot declare @keyframes, so the sweep lives in a <style> block.
  The shine strip starts at -translate-x-full; when reduced motion disables
  the animation, that same utility parks it off-canvas permanently - the
  static gradient stays, only the movement goes.
-->
<style>
  @keyframes badge-shine {
    0% { transform: translateX(-100%); }
    60%, 100% { transform: translateX(100%); }
  }
</style>

<span class="relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white">
  <span
    class="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shine_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none"
    aria-hidden="true"
  ></span>
  New feature
</span>`,
      react: `const SHINE_KEYFRAMES = \`
  @keyframes badge-shine {
    0% { transform: translateX(-100%); }
    60%, 100% { transform: translateX(100%); }
  }
\`;

export function GradientShineBadge({ label, className = '' }) {
  return (
    <span
      className={\`relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white \${className}\`}
    >
      {/* Keyframes travel with the component - nothing to add to a config. */}
      <style>{SHINE_KEYFRAMES}</style>
      {/* The animation owns transform while it runs; under reduced motion the
          -translate-x-full utility takes back over and parks the strip
          off-canvas. Static gradient stays - motion is the only casualty. */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shine_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}`,
      typescript: `const SHINE_KEYFRAMES = \`
  @keyframes badge-shine {
    0% { transform: translateX(-100%); }
    60%, 100% { transform: translateX(100%); }
  }
\`;

export interface GradientShineBadgeProps {
  label: string;
  className?: string;
}

export function GradientShineBadge({
  label,
  className = '',
}: GradientShineBadgeProps): JSX.Element {
  return (
    <span
      className={\`relative inline-flex items-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 px-3 py-1 text-xs font-semibold text-white \${className}\`}
    >
      <style>{SHINE_KEYFRAMES}</style>
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full animate-[badge-shine_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-corner-notification',
    category: 'badges',
    tags: ['badge', 'notification', 'corner', 'indicator', 'overlay', 'count'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2050, copies: 559, downloads: 134 },
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'count', type: 'number', default: '0', descriptionKey: 'count' },
      { name: 'max', type: 'number', default: '99', descriptionKey: 'max' },
      { name: 'dot', type: 'boolean', default: 'false', descriptionKey: 'dot' },
      {
        name: 'srLabel',
        type: 'string',
        descriptionKey: 'srLabel',
        example: 'unread messages',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The wrapper is inline-flex + relative; the badge hangs off the top-right
  corner with negative offsets. The ring-2 fakes a cutout between badge and
  host - it is hardcoded to the page background (white / gray-900), so if the
  host sits on a card, match the ring to the card instead.
-->
<span class="relative inline-flex">
  <button
    type="button"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
  >
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" />
    </svg>
    <span class="sr-only">Inbox</span>
  </button>
  <span class="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-semibold leading-none text-white ring-2 ring-white dark:ring-gray-900">
    3
    <span class="sr-only">unread messages</span>
  </span>
</span>`,
      react: `export function CornerBadge({
  children,
  count = 0,
  max = 99,
  dot = false,
  srLabel = '',
  className = '',
}) {
  const show = dot || count > 0;
  const display = count > max ? \`\${max}+\` : String(count);

  return (
    <span className={\`relative inline-flex \${className}\`}>
      {children}
      {show ? (
        dot ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-900">
            {/* A dot has no text of its own - without srLabel it is silent. */}
            {srLabel ? <span className="sr-only">{srLabel}</span> : null}
          </span>
        ) : (
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-semibold leading-none text-white ring-2 ring-white dark:ring-gray-900">
            {display}
            {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
          </span>
        )
      ) : null}
    </span>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

// No 'use client' - the badge positions itself with CSS and holds no state.
// The interactivity, if any, belongs to the child it decorates.
interface CornerBadgeProps {
  children: ReactNode;
  count?: number;
  max?: number;
  dot?: boolean;
  srLabel?: string;
  className?: string;
}

export function CornerBadge({
  children,
  count = 0,
  max = 99,
  dot = false,
  srLabel = '',
  className = '',
}: CornerBadgeProps) {
  const show = dot || count > 0;
  const display = count > max ? \`\${max}+\` : String(count);

  return (
    <span className={\`relative inline-flex \${className}\`}>
      {children}
      {show ? (
        dot ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-900">
            {srLabel ? <span className="sr-only">{srLabel}</span> : null}
          </span>
        ) : (
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-semibold leading-none text-white ring-2 ring-white dark:ring-gray-900">
            {display}
            {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
          </span>
        )
      ) : null}
    </span>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface CornerBadgeProps {
  /** The host the badge hangs off - a button, an avatar, an icon. */
  children: ReactNode;
  count?: number;
  max?: number;
  /** Presence-only mode: a plain dot, no number. Needs srLabel to say why. */
  dot?: boolean;
  /** The count's noun for screen readers, e.g. 'unread messages'. */
  srLabel?: string;
  className?: string;
}

export function CornerBadge({
  children,
  count = 0,
  max = 99,
  dot = false,
  srLabel = '',
  className = '',
}: CornerBadgeProps): JSX.Element {
  const show = dot || count > 0;
  const display = count > max ? \`\${max}+\` : String(count);

  return (
    <span className={\`relative inline-flex \${className}\`}>
      {children}
      {show ? (
        dot ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-900">
            {srLabel ? <span className="sr-only">{srLabel}</span> : null}
          </span>
        ) : (
          /* ring-2 fakes a cutout against the page background. If the host
             sits on a card, retint the ring to the card's surface. */
          <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-semibold leading-none text-white ring-2 ring-white dark:ring-gray-900">
            {display}
            {srLabel ? <span className="sr-only"> {srLabel}</span> : null}
          </span>
        )
      ) : null}
    </span>
  );
}`,
    },
  },
  {
    slug: 'badge-ribbon-corner',
    category: 'badges',
    tags: ['badge', 'ribbon', 'corner', 'card', 'promo', 'overlay'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1380, copies: 296, downloads: 71 },
    props: [
      { name: 'label', type: 'string', default: "'New'", descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The geometry is one equation: the band's centre must sit at equal distances
  from the corner on both axes, or the 45° rotation drifts off the diagonal.
  Here: width 160px → half 80; right -48px puts the centre 32px in from the
  right edge; top 20px + half the 24px band height puts it 32px down. 32 = 32.
  Change one number and you must change its partner.
-->
<div class="ribbon-card">
  <span class="ribbon-card__ribbon">New</span>
  <h3 class="ribbon-card__title">Team workspace</h3>
  <p class="ribbon-card__copy">Shared views, granular roles and an audit trail for every change.</p>
</div>`,
      css: `.ribbon-card {
  /* overflow: hidden is the other half of the ribbon - it trims the band's
     ends into the corner wedge. Without it you have a floating stick. */
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 20rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
}

.ribbon-card__ribbon {
  position: absolute;
  top: 20px;
  right: -48px;
  width: 160px;
  padding: 0.25rem 0;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
  transform: rotate(45deg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.ribbon-card__title {
  margin: 0;
  padding-right: 3.5rem; /* keep the heading out from under the ribbon */
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.ribbon-card__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .ribbon-card {
    border-color: #1f2937;
    background-color: #111827;
  }

  .ribbon-card__title {
    color: #f3f4f6;
  }

  .ribbon-card__copy {
    color: #9ca3af;
  }
}`,
      tailwind: `<!--
  Geometry: w-40 (160px) → half 80; right-[-48px] centres the band 32px from
  the right edge; top-[20px] + half the ~24px band height = 32px down. The two
  32s must stay equal or the 45° band drifts off the corner diagonal. The
  card's overflow-hidden trims the band's ends into a wedge.
-->
<div class="relative w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
  <span class="absolute right-[-48px] top-[20px] w-40 rotate-45 bg-blue-600 py-1 text-center text-[0.6875rem] font-semibold uppercase tracking-wider text-white shadow-sm">
    New
  </span>
  <h3 class="pr-14 text-base font-semibold text-gray-900 dark:text-gray-100">Team workspace</h3>
  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    Shared views, granular roles and an audit trail for every change.
  </p>
</div>`,
      react: `export function RibbonCorner({ label = 'New', children, className = '' }) {
  return (
    <div className={\`relative overflow-hidden \${className}\`}>
      {/* Rendered before children so the ribbon never covers focus rings of
          interactive content painted later in the stacking order. */}
      <span className="absolute right-[-48px] top-[20px] w-40 rotate-45 bg-blue-600 py-1 text-center text-[0.6875rem] font-semibold uppercase tracking-wider text-white shadow-sm">
        {label}
      </span>
      {children}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface RibbonCornerProps {
  /** Keep it to one short word - the band is 160px and clips what overflows. */
  label?: string;
  /** The card content. The wrapper only adds relative + overflow-hidden;
      bring your own card border, radius and padding via className. */
  children: ReactNode;
  className?: string;
}

export function RibbonCorner({
  label = 'New',
  children,
  className = '',
}: RibbonCornerProps): JSX.Element {
  return (
    <div className={\`relative overflow-hidden \${className}\`}>
      <span className="absolute right-[-48px] top-[20px] w-40 rotate-45 bg-blue-600 py-1 text-center text-[0.6875rem] font-semibold uppercase tracking-wider text-white shadow-sm">
        {label}
      </span>
      {children}
    </div>
  );
}`,
    },
  },
  {
    slug: 'badge-verified-check',
    category: 'badges',
    tags: ['badge', 'verified', 'check', 'seal', 'trust', 'svg'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1990, copies: 543, downloads: 126 },
    props: [
      { name: 'label', type: 'string', default: "'Verified'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The seal is aria-hidden and the word "Verified" sits beside it in plain
  text - the blue tick means nothing to a screen reader and less than you
  think to everyone else. Dark mode uses blue-500, not 400: the white check
  needs 3:1 against its own fill, and blue-400 misses it.
-->
<span class="inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100">
  <svg viewBox="0 0 24 24" class="h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-blue-500" fill="currentColor" aria-hidden="true">
    <path d="M12 1.5l2.09 2.02 2.83-.6 1.1 2.67 2.67 1.1-.6 2.83L22.5 12l-2.41 2.48.6 2.83-2.67 1.1-1.1 2.67-2.83-.6L12 22.5l-2.09-2.02-2.83.6-1.1-2.67-2.67-1.1.6-2.83L1.5 12l2.41-2.48-.6-2.83 2.67-1.1 1.1-2.67 2.83.6L12 1.5z" />
    <path d="M8.6 12.3l2.2 2.2 4.6-4.9" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  Verified
</span>`,
      react: `export function VerifiedBadge({ label = 'Verified', className = '' }) {
  return (
    <span
      className={\`inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100 \${className}\`}
    >
      {/* Two paths, one file: the scalloped seal filled with currentColor and
          the check stroked in white on top - no icon library, no sprite. */}
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-blue-500"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 1.5l2.09 2.02 2.83-.6 1.1 2.67 2.67 1.1-.6 2.83L22.5 12l-2.41 2.48.6 2.83-2.67 1.1-1.1 2.67-2.83-.6L12 22.5l-2.09-2.02-2.83.6-1.1-2.67-2.67-1.1.6-2.83L1.5 12l2.41-2.48-.6-2.83 2.67-1.1 1.1-2.67 2.83.6L12 1.5z" />
        <path
          d="M8.6 12.3l2.2 2.2 4.6-4.9"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}`,
      typescript: `export interface VerifiedBadgeProps {
  /** The word next to the seal. The seal alone is decoration, not proof. */
  label?: string;
  className?: string;
}

export function VerifiedBadge({
  label = 'Verified',
  className = '',
}: VerifiedBadgeProps): JSX.Element {
  return (
    <span
      className={\`inline-flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-100 \${className}\`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5 shrink-0 text-blue-600 dark:text-blue-500"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 1.5l2.09 2.02 2.83-.6 1.1 2.67 2.67 1.1-.6 2.83L22.5 12l-2.41 2.48.6 2.83-2.67 1.1-1.1 2.67-2.83-.6L12 22.5l-2.09-2.02-2.83.6-1.1-2.67-2.67-1.1.6-2.83L1.5 12l2.41-2.48-.6-2.83 2.67-1.1 1.1-2.67 2.83.6L12 1.5z" />
        <path
          d="M8.6 12.3l2.2 2.2 4.6-4.9"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}`,
    },
  },
];
