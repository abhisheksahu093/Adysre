import type { ComponentEntry } from './types';

/**
 * Avatars category.
 *
 * Ten avatars and not one photograph. Initials over a deterministic fill, or an
 * inline SVG glyph, is not a budget constraint - it is the state every real
 * avatar system spends most of its life in: the user who never uploaded a
 * picture. The recurring accessibility move is the mirror image of an <img>:
 * `role="img"` + `aria-label` on the wrapper, with the initials `aria-hidden`.
 * "AL" read aloud is noise; the accessible name is "Ada Lovelace". And wherever
 * a visible name already sits beside the face (`avatar-with-name-role`,
 * `avatar-menu-trigger`), the avatar flips to `aria-hidden` instead - one name,
 * announced once.
 */
export const avatarsComponents: ComponentEntry[] = [
  {
    slug: 'avatar-initials-basic',
    category: 'avatars',
    tags: ['avatar', 'initials', 'fallback', 'deterministic', 'profile'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1840, copies: 512, downloads: 129 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", descriptionKey: 'size' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The JS variants compute the fill from the name; here it is written out. The
  load-bearing part is the aria: role="img" + aria-label make this announce as
  "Ada Lovelace", while the initials themselves are aria-hidden - "A L" spelled
  out is noise, not a name.
-->
<span
  role="img"
  aria-label="Ada Lovelace"
  class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white"
>
  <span aria-hidden="true">AL</span>
</span>`,
      react: `// Each fill is one complete string, never assembled from fragments -
// Tailwind's scanner only keeps classes it can read verbatim in the source.
const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
];

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

// Not a hash for security - only for stability, so "Ada Lovelace" gets the
// same colour on every page she appears on instead of a random one per render.
function fillFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length];
}

export function AvatarInitials({ name, size = 'md', className = '' }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold \${SIZES[size]} \${fillFor(name)} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
      nextjs: `const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
] as const;

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const;

interface AvatarInitialsProps {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function fillFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length] ?? FILLS[0];
}

// No 'use client'. The hash is pure - the same string hashes the same on the
// server and in the browser, so there is no hydration mismatch and no reason
// to ship this as JS at all.
export function AvatarInitials({ name, size = 'md', className = '' }: AvatarInitialsProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold \${SIZES[size]} \${fillFor(name)} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
      typescript: `// Each fill is one complete string, never assembled from fragments -
// Tailwind's scanner only keeps classes it can read verbatim in the source.
const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
] as const;

const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
} as const;

export interface AvatarInitialsProps {
  /** Full name. Drives the initials, the colour and the accessible label. */
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

// Not a hash for security - only for stability, so "Ada Lovelace" gets the
// same colour on every page she appears on instead of a random one per render.
function fillFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length] ?? FILLS[0];
}

export function AvatarInitials({
  name,
  size = 'md',
  className = '',
}: AvatarInitialsProps): JSX.Element {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold \${SIZES[size]} \${fillFor(name)} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'avatar-sizes-scale',
    category: 'avatars',
    tags: ['avatar', 'sizes', 'scale', 'initials', 'system'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 960, copies: 244, downloads: 61 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'",
        default: "'md'",
        descriptionKey: 'size',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The full scale, xs → 2xl. Type moves with the box: initials that stay text-sm
  inside an h-16 disc look lost, and text-base inside h-6 clips. One size prop
  drives both dimensions and the font - never let them drift apart.
-->
<div class="flex flex-wrap items-end gap-3">
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white"><span aria-hidden="true">AL</span></span>
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"><span aria-hidden="true">AL</span></span>
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"><span aria-hidden="true">AL</span></span>
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-base font-semibold text-white"><span aria-hidden="true">AL</span></span>
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-14 w-14 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white"><span aria-hidden="true">AL</span></span>
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-16 w-16 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white"><span aria-hidden="true">AL</span></span>
</div>`,
      react: `// One prop drives box and font together - the two failure modes of an avatar
// scale are text-sm floating inside h-16 and text-base clipping inside h-6.
const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
  '2xl': 'h-16 w-16 text-xl',
};

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarSized({ name, size = 'md', className = '' }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-blue-600 font-semibold text-white \${SIZES[size]} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
      typescript: `// One prop drives box and font together - the two failure modes of an avatar
// scale are text-sm floating inside h-16 and text-base clipping inside h-6.
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZES: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-14 w-14 text-lg',
  '2xl': 'h-16 w-16 text-xl',
};

export interface AvatarSizedProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarSized({ name, size = 'md', className = '' }: AvatarSizedProps): JSX.Element {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-blue-600 font-semibold text-white \${SIZES[size]} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'avatar-squared',
    category: 'avatars',
    tags: ['avatar', 'squared', 'rounded', 'shape', 'workspace'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 720, copies: 188, downloads: 44 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      {
        name: 'shape',
        type: "'squared' | 'circle'",
        default: "'squared'",
        descriptionKey: 'shape',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A rounded square instead of a disc. The convention this trades on: circles
  read as *people*, rounded squares read as *things* - teams, workspaces,
  projects. Keep the two shapes for the two meanings and users can tell an
  owner from an org at a glance.
-->
<span
  role="img"
  aria-label="Design Systems"
  class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white"
>
  <span aria-hidden="true">DS</span>
</span>`,
      react: `const SHAPES = {
  squared: 'rounded-xl',
  circle: 'rounded-full',
};

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarSquared({ name, shape = 'squared', className = '' }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white \${SHAPES[shape]} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
      typescript: `// Circles read as people, rounded squares read as things - teams, workspaces,
// projects. The shape prop exists so a UI can keep both meanings side by side.
const SHAPES = {
  squared: 'rounded-xl',
  circle: 'rounded-full',
} as const;

export interface AvatarSquaredProps {
  name: string;
  shape?: keyof typeof SHAPES;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarSquared({
  name,
  shape = 'squared',
  className = '',
}: AvatarSquaredProps): JSX.Element {
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white \${SHAPES[shape]} \${className}\`}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'avatar-status-dot',
    category: 'avatars',
    tags: ['avatar', 'status', 'presence', 'online', 'indicator'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1420, copies: 402, downloads: 97 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      {
        name: 'status',
        type: "'online' | 'away' | 'offline'",
        default: "'offline'",
        descriptionKey: 'status',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The dot is colour, and colour alone is not information - a green and a grey
  dot are the same dot to plenty of eyes. The sr-only text inside the dot is
  the accessible half of the indicator; the ring around it is what separates
  the dot from the avatar's own pixels.
-->
<span class="avatar-presence">
  <span class="avatar-presence__face" role="img" aria-label="Priya Patel">
    <span aria-hidden="true">PP</span>
  </span>
  <span class="avatar-presence__dot avatar-presence__dot--online">
    <span class="sr-only">Online</span>
  </span>
</span>`,
      css: `.avatar-presence {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.avatar-presence__face {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-image: linear-gradient(to bottom right, #3b82f6, #7c3aed);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  user-select: none;
}

.avatar-presence__dot {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  /* The ring matches the page surface - it is what cuts the dot out of the
     avatar behind it. Without it a green dot on a green-ish gradient vanishes. */
  box-shadow: 0 0 0 2px #fff;
}

.avatar-presence__dot--online {
  background-color: #10b981;
}

.avatar-presence__dot--away {
  background-color: #fbbf24;
}

.avatar-presence__dot--offline {
  background-color: #9ca3af;
}

/* Hidden from sight, not from the accessibility tree. */
.sr-only {
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

@media (prefers-color-scheme: dark) {
  .avatar-presence__dot {
    box-shadow: 0 0 0 2px #030712;
  }
}`,
      tailwind: `<span class="relative inline-flex shrink-0">
  <span
    role="img"
    aria-label="Priya Patel"
    class="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-semibold text-white"
  >
    <span aria-hidden="true">PP</span>
  </span>
  <!-- ring-white matches the page surface and cuts the dot out of the avatar;
       the sr-only text is the status for everyone the colour doesn't reach. -->
  <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950">
    <span class="sr-only">Online</span>
  </span>
</span>`,
      react: `// Dot colour AND label live in one record so they cannot drift apart - a
// status whose text says "Away" under a green dot is worse than no dot.
const STATUS = {
  online: { dot: 'bg-emerald-500', label: 'Online' },
  away: { dot: 'bg-amber-400', label: 'Away' },
  offline: { dot: 'bg-gray-400 dark:bg-gray-500', label: 'Offline' },
};

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarStatusDot({ name, status = 'offline', className = '' }) {
  return (
    <span className={\`relative inline-flex shrink-0 \${className}\`}>
      <span
        role="img"
        aria-label={name}
        className="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">{initialsOf(name)}</span>
      </span>
      <span
        className={\`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-950 \${STATUS[status].dot}\`}
      >
        <span className="sr-only">{STATUS[status].label}</span>
      </span>
    </span>
  );
}`,
      typescript: `export type PresenceStatus = 'online' | 'away' | 'offline';

// Dot colour AND label live in one record so they cannot drift apart - a
// status whose text says "Away" under a green dot is worse than no dot.
const STATUS: Record<PresenceStatus, { dot: string; label: string }> = {
  online: { dot: 'bg-emerald-500', label: 'Online' },
  away: { dot: 'bg-amber-400', label: 'Away' },
  offline: { dot: 'bg-gray-400 dark:bg-gray-500', label: 'Offline' },
};

export interface AvatarStatusDotProps {
  name: string;
  status?: PresenceStatus;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarStatusDot({
  name,
  status = 'offline',
  className = '',
}: AvatarStatusDotProps): JSX.Element {
  return (
    <span className={\`relative inline-flex shrink-0 \${className}\`}>
      <span
        role="img"
        aria-label={name}
        className="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">{initialsOf(name)}</span>
      </span>
      {/* ring-white matches the page surface and cuts the dot out of the
          avatar; the sr-only text is the status for everyone the colour
          doesn't reach. */}
      <span
        className={\`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-950 \${STATUS[status].dot}\`}
      >
        <span className="sr-only">{STATUS[status].label}</span>
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'avatar-badge-count',
    category: 'avatars',
    tags: ['avatar', 'badge', 'count', 'notifications', 'unread'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 890, copies: 231, downloads: 58 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'count', type: 'number', default: '0', descriptionKey: 'count' },
      { name: 'max', type: 'number', default: '9', descriptionKey: 'max' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<span class="relative inline-flex shrink-0">
  <span
    role="img"
    aria-label="Marcus Webb"
    class="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-semibold text-white"
  >
    <span aria-hidden="true">MW</span>
  </span>
  <!-- min-w + px, not a fixed width: "3" stays a circle, "9+" stretches into a
       pill instead of squeezing. The visible number is aria-hidden; the sr-only
       sentence carries the real count, uncapped. -->
  <span class="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-950">
    <span aria-hidden="true">9+</span>
    <span class="sr-only">12 unread notifications</span>
  </span>
</span>`,
      react: `function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarBadgeCount({ name, count = 0, max = 9, className = '' }) {
  // The badge caps at "9+"; the sr-only text does not. A screen reader user
  // gets the real number - the cap is a layout decision, not information.
  const shown = count > max ? \`\${max}+\` : String(count);

  return (
    <span className={\`relative inline-flex shrink-0 \${className}\`}>
      <span
        role="img"
        aria-label={name}
        className="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">{initialsOf(name)}</span>
      </span>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-950">
          <span aria-hidden="true">{shown}</span>
          <span className="sr-only">{count} unread notifications</span>
        </span>
      ) : null}
    </span>
  );
}`,
      typescript: `export interface AvatarBadgeCountProps {
  name: string;
  /** Unread count. 0 renders no badge at all, not an empty dot. */
  count?: number;
  /** Cap after which the badge shows "9+" instead of stretching. */
  max?: number;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarBadgeCount({
  name,
  count = 0,
  max = 9,
  className = '',
}: AvatarBadgeCountProps): JSX.Element {
  // The badge caps at "9+"; the sr-only text does not. A screen reader user
  // gets the real number - the cap is a layout decision, not information.
  const shown = count > max ? \`\${max}+\` : String(count);

  return (
    <span className={\`relative inline-flex shrink-0 \${className}\`}>
      <span
        role="img"
        aria-label={name}
        className="inline-flex h-10 w-10 select-none items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-sm font-semibold text-white"
      >
        <span aria-hidden="true">{initialsOf(name)}</span>
      </span>
      {count > 0 ? (
        // min-w + px, not a fixed width: "3" stays a circle, "9+" stretches
        // into a pill instead of squeezing.
        <span className="absolute -right-1 -top-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-950">
          <span aria-hidden="true">{shown}</span>
          <span className="sr-only">{count} unread notifications</span>
        </span>
      ) : null}
    </span>
  );
}`,
    },
  },
  {
    slug: 'avatar-group-stack',
    category: 'avatars',
    tags: ['avatar', 'group', 'stack', 'overlap', 'team'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1610, copies: 447, downloads: 112 },
    props: [
      { name: 'names', type: 'string[]', required: true, descriptionKey: 'names' },
      { name: 'max', type: 'number', default: '4', descriptionKey: 'max' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  -space-x-2 does the overlap; ring-2 in the page colour cuts each face out of
  the one beneath it - without the ring the stack is one blurry blob. The +N
  chip is the honest end of the line: it renders the true remainder, and its
  sr-only text says so in words.
-->
<div role="group" aria-label="6 people" class="flex items-center -space-x-2">
  <span role="img" aria-label="Ada Lovelace" class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white ring-2 ring-white dark:ring-gray-950"><span aria-hidden="true">AL</span></span>
  <span role="img" aria-label="Grace Hopper" class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white ring-2 ring-white dark:ring-gray-950"><span aria-hidden="true">GH</span></span>
  <span role="img" aria-label="Alan Turing" class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white ring-2 ring-white dark:ring-gray-950"><span aria-hidden="true">AT</span></span>
  <span role="img" aria-label="Katherine Johnson" class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-rose-600 text-sm font-semibold text-white ring-2 ring-white dark:ring-gray-950"><span aria-hidden="true">KJ</span></span>
  <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
    <span aria-hidden="true">+2</span>
    <span class="sr-only">2 more people</span>
  </span>
</div>`,
      react: `const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
];

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

function fillFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length];
}

export function AvatarGroupStack({ names, max = 4, className = '' }) {
  const visible = names.slice(0, max);
  const extra = names.length - visible.length;

  return (
    <div role="group" aria-label={\`\${names.length} people\`} className={\`flex items-center -space-x-2 \${className}\`}>
      {visible.map((name) => (
        <span
          key={name}
          role="img"
          aria-label={name}
          className={\`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full text-sm font-semibold ring-2 ring-white dark:ring-gray-950 \${fillFor(name)}\`}
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      ))}
      {extra > 0 ? (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
          <span aria-hidden="true">+{extra}</span>
          <span className="sr-only">{extra} more people</span>
        </span>
      ) : null}
    </div>
  );
}`,
      nextjs: `const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
] as const;

interface AvatarGroupStackProps {
  names: string[];
  max?: number;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function fillFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length] ?? FILLS[0];
}

// No 'use client' - the slice, the hash and the overlap are all deterministic,
// so the whole stack renders on the server and ships no JS.
export function AvatarGroupStack({ names, max = 4, className = '' }: AvatarGroupStackProps) {
  const visible = names.slice(0, max);
  const extra = names.length - visible.length;

  return (
    <div role="group" aria-label={\`\${names.length} people\`} className={\`flex items-center -space-x-2 \${className}\`}>
      {visible.map((name) => (
        <span
          key={name}
          role="img"
          aria-label={name}
          className={\`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full text-sm font-semibold ring-2 ring-white dark:ring-gray-950 \${fillFor(name)}\`}
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      ))}
      {extra > 0 ? (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
          <span aria-hidden="true">+{extra}</span>
          <span className="sr-only">{extra} more people</span>
        </span>
      ) : null}
    </div>
  );
}`,
      typescript: `const FILLS = [
  'bg-blue-600 text-white',
  'bg-emerald-600 text-white',
  'bg-violet-600 text-white',
  'bg-rose-600 text-white',
  'bg-amber-500 text-gray-900',
  'bg-cyan-600 text-white',
] as const;

export interface AvatarGroupStackProps {
  /** Full names in display order - each is also its face's accessible name. */
  names: string[];
  /** Faces shown before the +N chip takes over. */
  max?: number;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

function fillFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
  return FILLS[hash % FILLS.length] ?? FILLS[0];
}

export function AvatarGroupStack({
  names,
  max = 4,
  className = '',
}: AvatarGroupStackProps): JSX.Element {
  const visible = names.slice(0, max);
  const extra = names.length - visible.length;

  return (
    // role="group" + a count label makes the stack one announced unit - six
    // anonymous images in a row tell a screen reader user nothing about "team".
    <div role="group" aria-label={\`\${names.length} people\`} className={\`flex items-center -space-x-2 \${className}\`}>
      {visible.map((name) => (
        <span
          key={name}
          role="img"
          aria-label={name}
          // ring-2 in the page colour, not a border: it cuts each face out of
          // the one beneath it. Without the ring the overlap is one blurry blob.
          className={\`inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full text-sm font-semibold ring-2 ring-white dark:ring-gray-950 \${fillFor(name)}\`}
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      ))}
      {extra > 0 ? (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-950">
          <span aria-hidden="true">+{extra}</span>
          <span className="sr-only">{extra} more people</span>
        </span>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'avatar-ring-story',
    category: 'avatars',
    tags: ['avatar', 'ring', 'story', 'gradient', 'seen'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1130, copies: 298, downloads: 73 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'seen', type: 'boolean', default: 'false', descriptionKey: 'seen' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Three nested circles: gradient ring, page-colour gap, face. The gap is a
  padded span in the page background - a transparent border would let the
  gradient bleed through to the avatar's edge and the ring stops reading as a
  ring. "Unseen" is a colour difference only, so the state also rides the
  aria-label in words.
-->
<span class="inline-flex shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[2px]">
  <span class="rounded-full bg-white p-[2px] dark:bg-gray-950">
    <span
      role="img"
      aria-label="Noor Haddad, new story"
      class="flex h-12 w-12 select-none items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white"
    >
      <span aria-hidden="true">NH</span>
    </span>
  </span>
</span>`,
      react: `function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarRingStory({ name, seen = false, className = '' }) {
  return (
    <span
      className={\`inline-flex shrink-0 rounded-full p-[2px] \${
        seen
          ? 'bg-gray-300 dark:bg-gray-700'
          : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
      } \${className}\`}
    >
      {/* The page-colour gap is what makes the ring read as a ring instead of
          a gradient border glued to the face. */}
      <span className="rounded-full bg-white p-[2px] dark:bg-gray-950">
        <span
          role="img"
          aria-label={seen ? name : \`\${name}, new story\`}
          className="flex h-12 w-12 select-none items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white"
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      </span>
    </span>
  );
}`,
      typescript: `export interface AvatarRingStoryProps {
  name: string;
  /** Story already viewed - the ring greys out and the label drops "new". */
  seen?: boolean;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarRingStory({
  name,
  seen = false,
  className = '',
}: AvatarRingStoryProps): JSX.Element {
  return (
    <span
      className={\`inline-flex shrink-0 rounded-full p-[2px] \${
        seen
          ? 'bg-gray-300 dark:bg-gray-700'
          : 'bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600'
      } \${className}\`}
    >
      {/* The page-colour gap is what makes the ring read as a ring instead of
          a gradient border glued to the face. */}
      <span className="rounded-full bg-white p-[2px] dark:bg-gray-950">
        {/* Unseen-vs-seen is a colour difference only, so the state also rides
            the label in words - a grey ring and a gradient ring are the same
            ring to a screen reader otherwise. */}
        <span
          role="img"
          aria-label={seen ? name : \`\${name}, new story\`}
          className="flex h-12 w-12 select-none items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-semibold text-white"
        >
          <span aria-hidden="true">{initialsOf(name)}</span>
        </span>
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'avatar-with-name-role',
    category: 'avatars',
    tags: ['avatar', 'name', 'role', 'identity', 'truncate'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1290, copies: 356, downloads: 84 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'role', type: 'string', descriptionKey: 'role' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The avatar is aria-hidden here - the visible name right beside it already
  carries the identity, and labelling the picture too would announce every
  person twice.
-->
<div class="avatar-id">
  <span class="avatar-id__face" aria-hidden="true">SC</span>
  <span class="avatar-id__text">
    <span class="avatar-id__name">Sarah Chen-Nakamura</span>
    <span class="avatar-id__role">Principal Product Designer</span>
  </span>
</div>`,
      css: `.avatar-id {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 20rem;
}

.avatar-id__face {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-image: linear-gradient(to bottom right, #14b8a6, #2563eb);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  user-select: none;
}

/* min-width: 0 is the whole trick. A flex child refuses to shrink below its
   content's width by default, so without it a long name pushes the row wide
   and ellipsis never happens. */
.avatar-id__text {
  display: block;
  min-width: 0;
}

.avatar-id__name {
  display: block;
  overflow: hidden;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-id__role {
  display: block;
  overflow: hidden;
  color: #6b7280;
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  .avatar-id__name {
    color: #f3f4f6;
  }

  .avatar-id__role {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex w-full max-w-xs items-center gap-3">
  <!-- aria-hidden: the visible name beside it already carries the identity. -->
  <span
    aria-hidden="true"
    class="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-semibold text-white"
  >
    SC
  </span>
  <!-- min-w-0 is the whole trick: flex children refuse to shrink below their
       content without it, and truncate silently does nothing. -->
  <span class="min-w-0">
    <span class="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
      Sarah Chen-Nakamura
    </span>
    <span class="block truncate text-xs text-gray-500 dark:text-gray-400">
      Principal Product Designer
    </span>
  </span>
</div>`,
      react: `function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarWithNameRole({ name, role, className = '' }) {
  return (
    <div className={\`flex w-full max-w-xs items-center gap-3 \${className}\`}>
      {/* aria-hidden: the visible name beside it already carries the identity -
          labelling the picture too would announce the person twice. */}
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      {/* min-w-0 is the whole trick: flex children refuse to shrink below
          their content without it, and truncate silently does nothing. */}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {name}
        </span>
        {role ? (
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{role}</span>
        ) : null}
      </span>
    </div>
  );
}`,
      nextjs: `interface AvatarWithNameRoleProps {
  name: string;
  role?: string;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

// Stateless - renders as a Server Component with zero client JS.
export function AvatarWithNameRole({ name, role, className = '' }: AvatarWithNameRoleProps) {
  return (
    <div className={\`flex w-full max-w-xs items-center gap-3 \${className}\`}>
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {name}
        </span>
        {role ? (
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{role}</span>
        ) : null}
      </span>
    </div>
  );
}`,
      typescript: `export interface AvatarWithNameRoleProps {
  name: string;
  /** Secondary line - job title, email, team. Omitted cleanly when absent. */
  role?: string;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarWithNameRole({
  name,
  role,
  className = '',
}: AvatarWithNameRoleProps): JSX.Element {
  return (
    <div className={\`flex w-full max-w-xs items-center gap-3 \${className}\`}>
      {/* aria-hidden: the visible name beside it already carries the identity -
          labelling the picture too would announce the person twice. */}
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      {/* min-w-0 is the whole trick: flex children refuse to shrink below
          their content without it, and truncate silently does nothing. */}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
          {name}
        </span>
        {role ? (
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{role}</span>
        ) : null}
      </span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'avatar-menu-trigger',
    category: 'avatars',
    tags: ['avatar', 'menu', 'trigger', 'button', 'account', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1050, copies: 269, downloads: 66 },
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      {
        name: 'onToggle',
        type: '(open: boolean) => void',
        descriptionKey: 'onToggle',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Closed state shown; the JS variants flip aria-expanded and rotate the
  chevron. The contract with whatever menu you attach is exactly two
  attributes: aria-haspopup="menu" promises one, aria-expanded reports it.
  No open/closed text needed - expanded state is announced natively.
-->
<button
  type="button"
  aria-haspopup="menu"
  aria-expanded="false"
  class="inline-flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
>
  <span
    aria-hidden="true"
    class="inline-flex h-8 w-8 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
  >
    SC
  </span>
  <span class="max-w-[9rem] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
    Sarah Chen
  </span>
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none dark:text-gray-400">
    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clip-rule="evenodd" />
  </svg>
  <span class="sr-only">Account menu</span>
</button>`,
      react: `import { useState } from 'react';

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
  return (first + last).toUpperCase();
}

export function AvatarMenuTrigger({ name, onToggle, className = '' }) {
  const [open, setOpen] = useState(false);

  function toggle() {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  return (
    // The whole contract with your menu is two attributes: aria-haspopup
    // promises one, aria-expanded reports it. Render the menu adjacent and
    // drive it from onToggle - no dropdown library required for the trigger.
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
      className={\`inline-flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
        open ? 'bg-gray-100 dark:bg-gray-800' : ''
      } \${className}\`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      <span className="max-w-[9rem] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
        {name}
      </span>
      {/* The rotation is decoration; aria-expanded is the announcement. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={\`h-4 w-4 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none dark:text-gray-400 \${
          open ? 'rotate-180' : ''
        }\`}
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="sr-only">Account menu</span>
    </button>
  );
}`,
      nextjs: `'use client';

// 'use client' is required: aria-expanded is state, and state is the point.
import { useState } from 'react';

interface AvatarMenuTriggerProps {
  name: string;
  onToggle?: (open: boolean) => void;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarMenuTrigger({ name, onToggle, className = '' }: AvatarMenuTriggerProps) {
  const [open, setOpen] = useState(false);

  function toggle(): void {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
      className={\`inline-flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
        open ? 'bg-gray-100 dark:bg-gray-800' : ''
      } \${className}\`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      <span className="max-w-[9rem] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
        {name}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={\`h-4 w-4 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none dark:text-gray-400 \${
          open ? 'rotate-180' : ''
        }\`}
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="sr-only">Account menu</span>
    </button>
  );
}`,
      typescript: `import { useState } from 'react';

export interface AvatarMenuTriggerProps {
  name: string;
  /** Fires with the next open state - attach and drive your menu from here. */
  onToggle?: (open: boolean) => void;
  className?: string;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '?';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase();
}

export function AvatarMenuTrigger({
  name,
  onToggle,
  className = '',
}: AvatarMenuTriggerProps): JSX.Element {
  const [open, setOpen] = useState(false);

  function toggle(): void {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  }

  return (
    // The whole contract with your menu is two attributes: aria-haspopup
    // promises one, aria-expanded reports it. No "open"/"closed" text needed -
    // expanded state is announced natively. min-h-10 keeps the tap target
    // honest even though the avatar inside is only 32px.
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
      className={\`inline-flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${
        open ? 'bg-gray-100 dark:bg-gray-800' : ''
      } \${className}\`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 select-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xs font-semibold text-white"
      >
        {initialsOf(name)}
      </span>
      <span className="max-w-[9rem] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
        {name}
      </span>
      {/* The rotation is decoration; aria-expanded is the announcement. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={\`h-4 w-4 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none dark:text-gray-400 \${
          open ? 'rotate-180' : ''
        }\`}
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="sr-only">Account menu</span>
    </button>
  );
}`,
    },
  },
  {
    slug: 'avatar-skeleton',
    category: 'avatars',
    tags: ['avatar', 'skeleton', 'loading', 'shimmer', 'placeholder'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 830, copies: 214, downloads: 52 },
    props: [
      { name: 'loading', type: 'boolean', default: 'true', descriptionKey: 'loading' },
      { name: 'name', type: 'string', default: "'Unknown user'", descriptionKey: 'name' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Two states of "no data yet": still loading (shimmer, role="status" so the
  wait is announced) and loaded-but-anonymous (an inline SVG glyph - the user
  who exists but never uploaded a face).
-->
<span class="avatar-skeleton" role="status">
  <span class="avatar-skeleton__shimmer" aria-hidden="true"></span>
  <span class="sr-only">Loading user</span>
</span>

<span class="avatar-anon" role="img" aria-label="Unknown user">
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z" />
  </svg>
</span>`,
      css: `.avatar-skeleton {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  overflow: hidden;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
}

/* A translucent white sweep over the grey disc. Animating transform keeps it
   on the compositor; animating background-position would repaint every frame. */
.avatar-skeleton__shimmer {
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: avatar-shimmer 1.6s ease-in-out infinite;
}

@keyframes avatar-shimmer {
  to {
    transform: translateX(100%);
  }
}

/* Reduced motion keeps the grey disc - the shimmer is decoration; the
   role="status" text is the actual "still loading" signal. */
@media (prefers-reduced-motion: reduce) {
  .avatar-skeleton__shimmer {
    animation: none;
  }
}

.avatar-anon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #e5e7eb;
  color: #6b7280;
}

.sr-only {
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

@media (prefers-color-scheme: dark) {
  .avatar-skeleton,
  .avatar-anon {
    background-color: #1f2937;
  }

  .avatar-skeleton__shimmer {
    background-image: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.08),
      transparent
    );
  }

  .avatar-anon {
    color: #9ca3af;
  }
}`,
      tailwind: `<!--
  Tailwind cannot declare @keyframes, so the sweep travels in a <style> block -
  nothing to add to a config. Reduced motion keeps the static grey disc; the
  role="status" text, not the shimmer, is the actual "still loading" signal.
-->
<style>
  @keyframes avatar-shimmer {
    to { transform: translateX(100%); }
  }
</style>

<span role="status" class="relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
  <span
    aria-hidden="true"
    class="absolute inset-0 -translate-x-full animate-[avatar-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none dark:via-white/10"
  ></span>
  <span class="sr-only">Loading user</span>
</span>

<!-- The loaded-but-anonymous sibling: an inline SVG glyph for the user who
     exists but never uploaded a face. -->
<span role="img" aria-label="Unknown user" class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z" />
  </svg>
</span>`,
      react: `const SHIMMER_KEYFRAMES = \`
  @keyframes avatar-shimmer {
    to { transform: translateX(100%); }
  }
\`;

export function AvatarSkeleton({ loading = true, name = 'Unknown user', className = '' }) {
  if (loading) {
    return (
      // role="status" announces the wait; the shimmer is only its decoration.
      <span
        role="status"
        className={\`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 \${className}\`}
      >
        <style>{SHIMMER_KEYFRAMES}</style>
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full animate-[avatar-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none dark:via-white/10"
        />
        <span className="sr-only">Loading user</span>
      </span>
    );
  }

  // Loaded but anonymous - the user who exists but never uploaded a face.
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 \${className}\`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z" />
      </svg>
    </span>
  );
}`,
      nextjs: `const SHIMMER_KEYFRAMES = \`
  @keyframes avatar-shimmer {
    to { transform: translateX(100%); }
  }
\`;

interface AvatarSkeletonProps {
  loading?: boolean;
  name?: string;
  className?: string;
}

// No 'use client' - the animation is CSS and the branch is a prop, so this
// works as a Server Component and drops straight into a Suspense fallback.
export function AvatarSkeleton({
  loading = true,
  name = 'Unknown user',
  className = '',
}: AvatarSkeletonProps) {
  if (loading) {
    return (
      <span
        role="status"
        className={\`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 \${className}\`}
      >
        <style>{SHIMMER_KEYFRAMES}</style>
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full animate-[avatar-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none dark:via-white/10"
        />
        <span className="sr-only">Loading user</span>
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 \${className}\`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z" />
      </svg>
    </span>
  );
}`,
      typescript: `// Keyframes travel with the component in a <style> tag so it stays
// copy-pasteable - Tailwind has no utility that declares @keyframes.
const SHIMMER_KEYFRAMES = \`
  @keyframes avatar-shimmer {
    to { transform: translateX(100%); }
  }
\`;

export interface AvatarSkeletonProps {
  /** True while the user record is in flight. */
  loading?: boolean;
  /** Accessible name for the loaded-but-anonymous glyph state. */
  name?: string;
  className?: string;
}

export function AvatarSkeleton({
  loading = true,
  name = 'Unknown user',
  className = '',
}: AvatarSkeletonProps): JSX.Element {
  if (loading) {
    return (
      // role="status" announces the wait; the shimmer is only its decoration -
      // which is why reduced motion can drop the sweep and lose nothing.
      <span
        role="status"
        className={\`relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 \${className}\`}
      >
        <style>{SHIMMER_KEYFRAMES}</style>
        {/* Animating transform keeps the sweep on the compositor; animating
            background-position would repaint every frame. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full animate-[avatar-shimmer_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none dark:via-white/10"
        />
        <span className="sr-only">Loading user</span>
      </span>
    );
  }

  // Loaded but anonymous - the user who exists but never uploaded a face.
  return (
    <span
      role="img"
      aria-label={name}
      className={\`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 \${className}\`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z" />
      </svg>
    </span>
  );
}`,
    },
  },
];
