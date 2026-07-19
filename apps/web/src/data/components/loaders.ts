import type { ComponentEntry } from './types';

/**
 * Loaders category.
 *
 * The skeleton is announced once via a `role="status"` wrapper with a visually
 * hidden label - the shimmering bars themselves are `aria-hidden`, because a
 * screen reader reading out eight empty placeholders is noise, not progress.
 * The shimmer is an `::after` overlay that sweeps across its bar, so it drops to
 * a flat block under `prefers-reduced-motion` without the layout shifting. Every
 * variant here documents that same mechanism, and it is the one `globals.css`
 * ships for the previews - keep the three in step.
 */
export const loaderComponents: ComponentEntry[] = [
  {
    slug: 'skeleton-loader',
    category: 'loaders',
    tags: ['skeleton', 'shimmer', 'placeholder', 'loading', 'suspense'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-09',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1680, copies: 470, downloads: 118 },
    variants: [
      { id: 'text', labelKey: 'text' },
      { id: 'avatar', labelKey: 'avatar' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'lines', type: 'number', default: '3', descriptionKey: 'lines' },
      { name: 'showAvatar', type: 'boolean', default: 'true', descriptionKey: 'showAvatar' },
      { name: 'label', type: 'string', default: "'Loading…'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<div class="skeleton" role="status">
  <span class="skeleton__label">Loading…</span>

  <div class="skeleton__header" aria-hidden="true">
    <div class="skeleton__avatar"></div>
    <div class="skeleton__meta">
      <div class="skeleton__bar skeleton__bar--title"></div>
      <div class="skeleton__bar skeleton__bar--subtitle"></div>
    </div>
  </div>

  <div class="skeleton__body" aria-hidden="true">
    <div class="skeleton__bar"></div>
    <div class="skeleton__bar"></div>
    <div class="skeleton__bar skeleton__bar--short"></div>
  </div>
</div>`,
      css: `.skeleton {
  display: grid;
  gap: 1rem;
  max-width: 24rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
}

/* Visible to assistive tech only - the bars below are decorative. */
.skeleton__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.skeleton__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skeleton__meta {
  display: grid;
  gap: 0.5rem;
  flex: 1;
}

.skeleton__body {
  display: grid;
  gap: 0.625rem;
}

/* position/overflow are load-bearing: the highlight below is an absolutely
   positioned overlay, and the bar is what positions and clips it. */
.skeleton__avatar,
.skeleton__bar {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
}

.skeleton__avatar::after,
.skeleton__bar::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.7) 20%,
    rgba(255, 255, 255, 0.9) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: skeleton-shimmer 1.6s infinite;
}

.skeleton__avatar {
  flex: none;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
}

.skeleton__bar {
  height: 0.625rem;
  border-radius: 9999px;
}

.skeleton__bar--title {
  height: 0.75rem;
  width: 45%;
}

.skeleton__bar--subtitle {
  width: 30%;
}

.skeleton__bar--short {
  width: 60%;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* No travelling highlight for reduced-motion users - just a static block. */
@media (prefers-reduced-motion: reduce) {
  .skeleton__avatar::after,
  .skeleton__bar::after {
    content: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The highlight is white on both themes; over a dark bar it only needs a
 * fraction of the opacity to read as a sweep rather than a flash.
 */
@media (prefers-color-scheme: dark) {
  .skeleton {
    border-color: #1f2937;
    background: #111827;
  }

  .skeleton__avatar,
  .skeleton__bar {
    background-color: #1f2937;
  }

  .skeleton__avatar::after,
  .skeleton__bar::after {
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.08) 20%,
      rgba(255, 255, 255, 0.14) 60%,
      rgba(255, 255, 255, 0)
    );
  }
}`,
      tailwind: `<!--
  Add the .skeleton-shimmer helper once, in your global stylesheet. Every bar
  that uses it must also carry "relative overflow-hidden" - the highlight is an
  absolutely positioned overlay, so the bar has to be what positions and clips
  it. Without those two utilities the sweep escapes to the nearest positioned
  ancestor and washes over the whole page.

  @keyframes skeleton-shimmer {
    100% { transform: translateX(100%); }
  }
  .skeleton-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgb(255 255 255 / 0) 0, rgb(255 255 255 / 0.7) 20%, rgb(255 255 255 / 0.9) 60%, rgb(255 255 255 / 0));
    animation: skeleton-shimmer 1.6s infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton-shimmer::after { content: none; }
  }

  Dark mode uses prefers-color-scheme, matching Tailwind's default dark:
  variant. Over a dark bar the white highlight only needs a fraction of the
  opacity to read as a sweep rather than a flash:

  @media (prefers-color-scheme: dark) {
    .skeleton-shimmer::after {
      background-image: linear-gradient(90deg, rgb(255 255 255 / 0) 0, rgb(255 255 255 / 0.08) 20%, rgb(255 255 255 / 0.14) 60%, rgb(255 255 255 / 0));
    }
  }
-->
<div class="grid max-w-sm gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900" role="status">
  <span class="sr-only">Loading…</span>

  <div class="flex items-center gap-3" aria-hidden="true">
    <div class="skeleton-shimmer relative h-11 w-11 flex-none overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    <div class="grid flex-1 gap-2">
      <div class="skeleton-shimmer relative h-3 w-[45%] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
      <div class="skeleton-shimmer relative h-2.5 w-[30%] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    </div>
  </div>

  <div class="grid gap-2.5" aria-hidden="true">
    <div class="skeleton-shimmer relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    <div class="skeleton-shimmer relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    <div class="skeleton-shimmer relative h-2.5 w-3/5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
  </div>
</div>`,
      react: `// Requires the .skeleton-shimmer helper from the Tailwind tab in your global CSS.
// \`relative overflow-hidden\` is not decoration: the helper's highlight is an
// absolutely positioned overlay, so every bar must be what positions and clips
// it. Drop them and the sweep escapes to the nearest positioned ancestor.
const BAR = 'skeleton-shimmer relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800';

export function SkeletonLoader({
  lines = 3,
  showAvatar = true,
  label = 'Loading…',
  className = '',
}) {
  return (
    <div
      role="status"
      className={\`grid max-w-sm gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className="sr-only">{label}</span>

      {showAvatar && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className={\`\${BAR} h-11 w-11 flex-none\`} />
          <div className="grid flex-1 gap-2">
            <div className={\`\${BAR} h-3 w-[45%]\`} />
            <div className={\`\${BAR} h-2.5 w-[30%]\`} />
          </div>
        </div>
      )}

      <div className="grid gap-2.5" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={\`\${BAR} h-2.5\`}
            style={{ width: index === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    </div>
  );
}`,
      nextjs: `// Pure markup - no state, no effects, so it stays a Server Component and can be
// dropped straight into a <Suspense fallback={…}>.
// Requires the .skeleton-shimmer helper from the Tailwind tab in your global CSS.
// \`relative overflow-hidden\` is not decoration: the helper's highlight is an
// absolutely positioned overlay, so every bar must be what positions and clips
// it. Drop them and the sweep escapes to the nearest positioned ancestor.
const BAR = 'skeleton-shimmer relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800';

interface SkeletonLoaderProps {
  lines?: number;
  showAvatar?: boolean;
  label?: string;
  className?: string;
}

export function SkeletonLoader({
  lines = 3,
  showAvatar = true,
  label = 'Loading…',
  className = '',
}: SkeletonLoaderProps) {
  return (
    <div
      role="status"
      className={\`grid max-w-sm gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className="sr-only">{label}</span>

      {showAvatar && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className={\`\${BAR} h-11 w-11 flex-none\`} />
          <div className="grid flex-1 gap-2">
            <div className={\`\${BAR} h-3 w-[45%]\`} />
            <div className={\`\${BAR} h-2.5 w-[30%]\`} />
          </div>
        </div>
      )}

      <div className="grid gap-2.5" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={\`\${BAR} h-2.5\`}
            style={{ width: index === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    </div>
  );
}`,
      typescript: `// Requires the .skeleton-shimmer helper from the Tailwind tab in your global CSS.
// \`relative overflow-hidden\` is not decoration: the helper's highlight is an
// absolutely positioned overlay, so every bar must be what positions and clips
// it. Drop them and the sweep escapes to the nearest positioned ancestor.
const BAR = 'skeleton-shimmer relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800';

export interface SkeletonLoaderProps {
  lines?: number;
  showAvatar?: boolean;
  label?: string;
  className?: string;
}

export function SkeletonLoader({
  lines = 3,
  showAvatar = true,
  label = 'Loading…',
  className = '',
}: SkeletonLoaderProps): JSX.Element {
  return (
    <div
      role="status"
      className={\`grid max-w-sm gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className="sr-only">{label}</span>

      {showAvatar ? (
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className={\`\${BAR} h-11 w-11 flex-none\`} />
          <div className="grid flex-1 gap-2">
            <div className={\`\${BAR} h-3 w-[45%]\`} />
            <div className={\`\${BAR} h-2.5 w-[30%]\`} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-2.5" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index: number) => (
          <div
            key={index}
            className={\`\${BAR} h-2.5\`}
            style={{ width: index === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'spinner-ring',
    category: 'loaders',
    tags: ['spinner', 'ring', 'busy', 'inline', 'reduced-motion'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-02',
    updatedAt: '2026-06-20',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2260, copies: 731, downloads: 196 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Loading…'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The ring is aria-hidden and the wrapper is role="status" with a visually hidden
  label. A spinning SVG has nothing an assistive tech can read; the sentence next
  to it is the whole accessible interface.

  The ring itself is one trick: a full circular border where one side is
  transparent, rotated. The gap is what makes rotation visible - a solid ring
  spinning looks identical to a solid ring standing still.
-->
<div class="spinner" role="status">
  <span class="spinner__ring" aria-hidden="true"></span>
  <span class="spinner__label">Loading…</span>
</div>`,
      css: `.spinner {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

/*
 * currentColor on three sides, transparent on the fourth. The gap is the only
 * reason the rotation reads at all.
 */
.spinner__ring {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #93c5fd;
  border-top-color: #1d4ed8;
  border-radius: 9999px;
  animation: spinner-rotate 700ms linear infinite;
}

.spinner__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

/*
 * Reduced motion: the ring stops, it does not disappear. Something must still
 * mark the spot as busy, and the two-tone gap is legible standing still.
 * (The role="status" label is what actually carries the meaning either way, so
 * nothing is lost.)
 */
@media (prefers-reduced-motion: reduce) {
  .spinner__ring {
    animation: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * blue-400 track / blue-300 head both clear 3:1 against gray-900 as non-text
 * graphics.
 */
@media (prefers-color-scheme: dark) {
  .spinner__ring {
    border-color: #1e40af;
    border-top-color: #93c5fd;
  }
}`,
      tailwind: `<!--
  animate-spin + motion-reduce:animate-none - the ring stops rather than
  vanishing, because something still has to mark the spot as busy. The sr-only
  label is what actually carries the meaning; the ring is aria-hidden decoration.
  The transparent quarter is load-bearing: a solid ring spinning looks exactly
  like a solid ring at rest.
-->
<div class="inline-flex items-center gap-2.5" role="status">
  <span
    class="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700 motion-reduce:animate-none dark:border-blue-800 dark:border-t-blue-300"
    aria-hidden="true"
  ></span>
  <span class="sr-only">Loading…</span>
</div>`,
      react: `export function SpinnerRing({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      {/* Decoration. The label below is the accessible interface. */}
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700 motion-reduce:animate-none dark:border-blue-800 dark:border-t-blue-300"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}`,
      nextjs: `// No state, no effects - a Server Component, and a natural
// <Suspense fallback={<SpinnerRing />}>.
interface SpinnerRingProps {
  label?: string;
  className?: string;
}

export function SpinnerRing({ label = 'Loading…', className = '' }: SpinnerRingProps) {
  return (
    <div role="status" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700 motion-reduce:animate-none dark:border-blue-800 dark:border-t-blue-300"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}`,
      typescript: `export interface SpinnerRingProps {
  /** Announced by the role="status" wrapper. Never leave this empty. */
  label?: string;
  className?: string;
}

export function SpinnerRing({
  label = 'Loading…',
  className = '',
}: SpinnerRingProps): JSX.Element {
  return (
    <div role="status" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700 motion-reduce:animate-none dark:border-blue-800 dark:border-t-blue-300"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'loader-dots',
    category: 'loaders',
    tags: ['dots', 'typing', 'bounce', 'inline', 'reduced-motion'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-27',
    updatedAt: '2026-06-24',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1370, copies: 402, downloads: 108 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Loading…'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Three dots on a stagger - the "someone is typing" loader. The stagger IS the
  component: identical delays give you three dots bouncing in unison, which
  reads as one blinking blob rather than a wave.

  Same accessibility shape as every loader here: dots aria-hidden, one
  role="status" wrapper with a hidden sentence.
-->
<div class="dots" role="status">
  <span class="dots__group" aria-hidden="true">
    <span class="dots__dot"></span>
    <span class="dots__dot"></span>
    <span class="dots__dot"></span>
  </span>
  <span class="dots__label">Loading…</span>
</div>`,
      css: `.dots {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.dots__group {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.dots__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #1d4ed8;
  animation: dots-bounce 1.2s ease-in-out infinite;
}

/* The stagger is the component. Drop these two rules and you get one blinking
   blob instead of a wave. */
.dots__dot:nth-child(2) {
  animation-delay: 160ms;
}

.dots__dot:nth-child(3) {
  animation-delay: 320ms;
}

.dots__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@keyframes dots-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-0.3125rem);
    opacity: 1;
  }
}

/*
 * Reduced motion: the dots settle, at full opacity, in a row. Still visibly a
 * loader; no bouncing. Note the reset of opacity - without it the dots freeze
 * at whatever the keyframe's 0% said (0.45) and look disabled rather than busy.
 */
@media (prefers-reduced-motion: reduce) {
  .dots__dot {
    animation: none;
    opacity: 1;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * blue-300 on gray-900 is 9.84:1 - far past the 3:1 a non-text graphic needs.
 */
@media (prefers-color-scheme: dark) {
  .dots__dot {
    background: #93c5fd;
  }
}`,
      tailwind: `<!--
  animate-bounce with per-dot animation-delay via inline style - Tailwind has no
  delay utility for animations, and the stagger is the whole point.
  motion-reduce:animate-none stops them; motion-reduce:opacity-100 is the part
  people forget - without it the dots freeze mid-fade and read as disabled.
-->
<div class="inline-flex items-center gap-2.5" role="status">
  <span class="inline-flex items-center gap-1" aria-hidden="true">
    <span class="h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300"></span>
    <span class="h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300" style="animation-delay: 160ms"></span>
    <span class="h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300" style="animation-delay: 320ms"></span>
  </span>
  <span class="sr-only">Loading…</span>
</div>`,
      react: `const DOT =
  'h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300';

// Tailwind has no animation-delay utility, and the stagger is the component -
// so the delays are the one thing that has to be inline.
const DELAYS = [0, 160, 320];

export function LoaderDots({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {DELAYS.map((delay) => (
          <span key={delay} className={DOT} style={{ animationDelay: \`\${delay}ms\` }} />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}`,
      nextjs: `// Pure markup - stays a Server Component and drops into a Suspense fallback.
const DOT =
  'h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300';

const DELAYS = [0, 160, 320];

interface LoaderDotsProps {
  label?: string;
  className?: string;
}

export function LoaderDots({ label = 'Loading…', className = '' }: LoaderDotsProps) {
  return (
    <div role="status" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {DELAYS.map((delay) => (
          <span key={delay} className={DOT} style={{ animationDelay: \`\${delay}ms\` }} />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}`,
      typescript: `const DOT =
  'h-2 w-2 animate-bounce rounded-full bg-blue-700 motion-reduce:animate-none motion-reduce:opacity-100 dark:bg-blue-300';

const DELAYS: readonly number[] = [0, 160, 320];

export interface LoaderDotsProps {
  label?: string;
  className?: string;
}

export function LoaderDots({
  label = 'Loading…',
  className = '',
}: LoaderDotsProps): JSX.Element {
  return (
    <div role="status" className={\`inline-flex items-center gap-2.5 \${className}\`}>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {DELAYS.map((delay: number) => (
          <span key={delay} className={DOT} style={{ animationDelay: \`\${delay}ms\` }} />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-bar',
    category: 'loaders',
    tags: ['progress', 'determinate', 'progressbar', 'percentage', 'upload'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-13',
    updatedAt: '2026-07-07',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1930, copies: 548, downloads: 152 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'value', type: 'number', required: true, descriptionKey: 'progressValue', example: '64' },
      { name: 'label', type: 'string', default: "'Uploading'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  DETERMINATE. That word is the entire spec of this component, and it is what
  separates it from loader-bar-indeterminate:

    aria-valuenow present  -> "43% complete"     (this component)
    aria-valuenow absent   -> "busy, unknown"    (the indeterminate bar)

  So: only set aria-valuenow if you actually know the number. A hardcoded
  aria-valuenow="50" on a bar that has no idea is a lie the screen reader will
  repeat with total confidence.

  role="progressbar" is NOT a live region and browsers do not announce value
  changes on their own - the visible percentage is what most sighted users read,
  and assistive tech reads the value when the user lands on the bar. Do not add
  aria-live to it: a bar ticking 1→100 would fire a hundred announcements.

  aria-valuemin/max default to 0/100, but write them anyway - the defaults are
  inconsistently implemented, and the day someone switches to bytes the omission
  becomes a bug.
-->
<div class="progress">
  <div class="progress__head">
    <span class="progress__label" id="upload-label">Uploading backup.tar.gz</span>
    <span class="progress__value">43%</span>
  </div>

  <div
    class="progress__track"
    role="progressbar"
    aria-labelledby="upload-label"
    aria-valuenow="43"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progress__fill" style="width: 43%"></div>
  </div>
</div>`,
      css: `.progress {
  display: grid;
  gap: 0.375rem;
  width: 100%;
  max-width: 20rem;
}

.progress__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.progress__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #111827;
}

/* gray-600 on white is 7.56:1. The number is text; it gets text contrast. */
.progress__value {
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: #4b5563;
}

.progress__track {
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  background: #e5e7eb;
  overflow: hidden;
}

/* blue-700 against the gray-200 track is 4.6:1 - well past the 3:1 a non-text
   graphic needs, so the bar is still readable in greyscale. */
.progress__fill {
  height: 100%;
  border-radius: 9999px;
  background: #1d4ed8;
  transition: width 300ms ease-out;
}

/*
 * The bar is not animated - it only tweens between real values. Reduced motion
 * therefore just means "snap to the value", which is honest: the number was
 * already true before the tween finished.
 */
@media (prefers-reduced-motion: reduce) {
  .progress__fill {
    transition: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .progress__label {
    color: #f3f4f6;
  }

  .progress__value {
    color: #9ca3af; /* 6.99:1 on gray-900 */
  }

  .progress__track {
    background: #1f2937;
  }

  .progress__fill {
    background: #60a5fa;
  }
}`,
      tailwind: `<!--
  Determinate: aria-valuenow carries the real number. Omit it (and this whole
  component) if you don't know the value - see loader-bar-indeterminate.
  No aria-live on the track: role="progressbar" isn't a live region, and making
  it one turns a 1→100 tick into a hundred announcements.
  transition-[width] + motion-reduce:transition-none: reduced motion snaps to
  the value, which is honest - the number was already true.
-->
<div class="grid w-full max-w-xs gap-1.5">
  <div class="flex items-baseline justify-between gap-3">
    <span class="text-[0.8125rem] font-medium text-gray-900 dark:text-gray-100" id="upload-label">Uploading backup.tar.gz</span>
    <span class="text-xs tabular-nums text-gray-600 dark:text-gray-400">43%</span>
  </div>

  <div
    class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
    role="progressbar"
    aria-labelledby="upload-label"
    aria-valuenow="43"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="h-full rounded-full bg-blue-700 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400" style="width: 43%"></div>
  </div>
</div>`,
      react: `import { useId } from 'react';

export function ProgressBar({ value, label = 'Uploading', className = '' }) {
  const labelId = useId();
  // Clamp before it reaches ARIA. A value of 143 announced as "143%" is worse
  // than a bar that's merely wrong.
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={\`grid w-full max-w-xs gap-1.5 \${className}\`}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-[0.8125rem] font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
        <span className="text-xs tabular-nums text-gray-600 dark:text-gray-400">{pct}%</span>
      </div>

      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-700 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

// The value changes over time, which is what makes this a Client Component -
// the markup itself has nothing client-only about it.
import { useId } from 'react';

interface ProgressBarProps {
  /** 0-100. Clamped before it reaches ARIA. */
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label = 'Uploading', className = '' }: ProgressBarProps) {
  const labelId = useId();
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={\`grid w-full max-w-xs gap-1.5 \${className}\`}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-[0.8125rem] font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
        <span className="text-xs tabular-nums text-gray-600 dark:text-gray-400">{pct}%</span>
      </div>

      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-700 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
      typescript: `import { useId } from 'react';

export interface ProgressBarProps {
  /** 0-100. Clamped before it reaches ARIA. */
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  label = 'Uploading',
  className = '',
}: ProgressBarProps): JSX.Element {
  const labelId: string = useId();
  const pct: number = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={\`grid w-full max-w-xs gap-1.5 \${className}\`}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-[0.8125rem] font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
        <span className="text-xs tabular-nums text-gray-600 dark:text-gray-400">{pct}%</span>
      </div>

      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-700 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'loader-skeleton-card',
    category: 'loaders',
    tags: ['skeleton', 'card', 'media', 'placeholder', 'shimmer'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1180, copies: 331, downloads: 89 },
    variants: [
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Loading card…'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A media card's skeleton, not a generic one: cover block, title, two body lines,
  footer row. The shapes are copied from the loaded card on purpose - a skeleton
  whose proportions don't match the real thing produces a visible jolt at swap
  time, which is worse than showing nothing at all.

  The cover block reserves its aspect ratio (16/9) rather than a fixed height, so
  the swap is stable at every width.

  One role="status" for the card. The bars are aria-hidden - a screen reader
  reading out nine anonymous placeholders is noise, not progress.
-->
<div class="sk-card" role="status">
  <span class="sk-card__label">Loading card…</span>

  <div class="sk-card__cover" aria-hidden="true"></div>

  <div class="sk-card__body" aria-hidden="true">
    <div class="sk-card__bar sk-card__bar--title"></div>
    <div class="sk-card__bar"></div>
    <div class="sk-card__bar sk-card__bar--short"></div>

    <div class="sk-card__footer">
      <div class="sk-card__avatar"></div>
      <div class="sk-card__bar sk-card__bar--name"></div>
    </div>
  </div>
</div>`,
      css: `.sk-card {
  width: 100%;
  max-width: 20rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  overflow: hidden;
}

.sk-card__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* aspect-ratio, not height: the reserved box has to track the real cover at
   every width or the swap still jolts. */
.sk-card__cover {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.sk-card__body {
  display: grid;
  gap: 0.625rem;
  padding: 0.875rem 1rem 1rem;
}

.sk-card__footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.375rem;
}

/* position/overflow are load-bearing: the highlight is an absolutely positioned
   overlay, and these elements are what position and clip it. */
.sk-card__cover,
.sk-card__bar,
.sk-card__avatar {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
}

.sk-card__cover::after,
.sk-card__bar::after,
.sk-card__avatar::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.7) 20%,
    rgba(255, 255, 255, 0.9) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: skeleton-shimmer 1.6s infinite;
}

.sk-card__bar {
  height: 0.625rem;
  border-radius: 9999px;
}

.sk-card__bar--title {
  height: 0.875rem;
  width: 70%;
}

.sk-card__bar--short {
  width: 55%;
}

.sk-card__bar--name {
  width: 35%;
}

.sk-card__avatar {
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
}

@keyframes skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* No travelling highlight for reduced-motion users - just flat blocks. The
   layout is identical either way, so nothing shifts. */
@media (prefers-reduced-motion: reduce) {
  .sk-card__cover::after,
  .sk-card__bar::after,
  .sk-card__avatar::after {
    content: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The highlight is white on both themes; over a dark block it only needs a
 * fraction of the opacity to read as a sweep rather than a flash.
 */
@media (prefers-color-scheme: dark) {
  .sk-card {
    border-color: #1f2937;
    background: #111827;
  }

  .sk-card__cover,
  .sk-card__bar,
  .sk-card__avatar {
    background-color: #1f2937;
  }

  .sk-card__cover::after,
  .sk-card__bar::after,
  .sk-card__avatar::after {
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.08) 20%,
      rgba(255, 255, 255, 0.14) 60%,
      rgba(255, 255, 255, 0)
    );
  }
}`,
      tailwind: `<!--
  Add the .skeleton-shimmer helper once, in your global stylesheet. Every block
  that uses it must also carry "relative overflow-hidden" - the highlight is an
  absolutely positioned overlay, so the block has to be what positions and clips
  it. Without those two utilities the sweep escapes to the nearest positioned
  ancestor and washes over the whole page.

  @keyframes skeleton-shimmer {
    100% { transform: translateX(100%); }
  }
  .skeleton-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgb(255 255 255 / 0) 0, rgb(255 255 255 / 0.7) 20%, rgb(255 255 255 / 0.9) 60%, rgb(255 255 255 / 0));
    animation: skeleton-shimmer 1.6s infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton-shimmer::after { content: none; }
  }

  Dark mode uses prefers-color-scheme, matching Tailwind's default dark:
  variant. Over a dark block the white highlight only needs a fraction of the
  opacity to read as a sweep rather than a flash:

  @media (prefers-color-scheme: dark) {
    .skeleton-shimmer::after {
      background-image: linear-gradient(90deg, rgb(255 255 255 / 0) 0, rgb(255 255 255 / 0.08) 20%, rgb(255 255 255 / 0.14) 60%, rgb(255 255 255 / 0));
    }
  }

  aspect-video on the cover, not a fixed height: the reserved box has to track
  the real cover at every width or the swap jolts anyway.
-->
<div class="w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900" role="status">
  <span class="sr-only">Loading card…</span>

  <div class="skeleton-shimmer relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-800" aria-hidden="true"></div>

  <div class="grid gap-2.5 px-4 pb-4 pt-3.5" aria-hidden="true">
    <div class="skeleton-shimmer relative h-3.5 w-[70%] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    <div class="skeleton-shimmer relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    <div class="skeleton-shimmer relative h-2.5 w-[55%] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>

    <div class="mt-1.5 flex items-center gap-2">
      <div class="skeleton-shimmer relative h-6 w-6 flex-none overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
      <div class="skeleton-shimmer relative h-2.5 w-[35%] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"></div>
    </div>
  </div>
</div>`,
      react: `// Requires the .skeleton-shimmer helper from the Tailwind tab in your global CSS.
// \`relative overflow-hidden\` is not decoration: the helper's highlight is an
// absolutely positioned overlay, so every block must be what positions and clips
// it. Drop them and the sweep escapes to the nearest positioned ancestor.
const BLOCK = 'skeleton-shimmer relative overflow-hidden bg-gray-200 dark:bg-gray-800';
const BAR = \`\${BLOCK} rounded-full\`;

export function LoaderSkeletonCard({ label = 'Loading card…', className = '' }) {
  return (
    <div
      role="status"
      className={\`w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className="sr-only">{label}</span>

      {/* aspect-video, not a fixed height - the reserved box must track the real
          cover at every width or the swap jolts anyway. */}
      <div className={\`\${BLOCK} aspect-video w-full\`} aria-hidden="true" />

      <div className="grid gap-2.5 px-4 pb-4 pt-3.5" aria-hidden="true">
        <div className={\`\${BAR} h-3.5 w-[70%]\`} />
        <div className={\`\${BAR} h-2.5 w-full\`} />
        <div className={\`\${BAR} h-2.5 w-[55%]\`} />

        <div className="mt-1.5 flex items-center gap-2">
          <div className={\`\${BAR} h-6 w-6 flex-none\`} />
          <div className={\`\${BAR} h-2.5 w-[35%]\`} />
        </div>
      </div>
    </div>
  );
}`,
      nextjs: `// Pure markup - no state, no effects, so it stays a Server Component and can be
// dropped straight into a <Suspense fallback={…}>.
// Requires the .skeleton-shimmer helper from the Tailwind tab in your global CSS.
// \`relative overflow-hidden\` is not decoration: the helper's highlight is an
// absolutely positioned overlay, so every block must be what positions and clips
// it. Drop them and the sweep escapes to the nearest positioned ancestor.
const BLOCK = 'skeleton-shimmer relative overflow-hidden bg-gray-200 dark:bg-gray-800';
const BAR = \`\${BLOCK} rounded-full\`;

interface LoaderSkeletonCardProps {
  label?: string;
  className?: string;
}

export function LoaderSkeletonCard({
  label = 'Loading card…',
  className = '',
}: LoaderSkeletonCardProps) {
  return (
    <div
      role="status"
      className={\`w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className="sr-only">{label}</span>

      <div className={\`\${BLOCK} aspect-video w-full\`} aria-hidden="true" />

      <div className="grid gap-2.5 px-4 pb-4 pt-3.5" aria-hidden="true">
        <div className={\`\${BAR} h-3.5 w-[70%]\`} />
        <div className={\`\${BAR} h-2.5 w-full\`} />
        <div className={\`\${BAR} h-2.5 w-[55%]\`} />

        <div className="mt-1.5 flex items-center gap-2">
          <div className={\`\${BAR} h-6 w-6 flex-none\`} />
          <div className={\`\${BAR} h-2.5 w-[35%]\`} />
        </div>
      </div>
    </div>
  );
}`,
      typescript: `// Requires the .skeleton-shimmer helper from the Tailwind tab in your global CSS.
// \`relative overflow-hidden\` is not decoration: the helper's highlight is an
// absolutely positioned overlay, so every block must be what positions and clips
// it. Drop them and the sweep escapes to the nearest positioned ancestor.
const BLOCK = 'skeleton-shimmer relative overflow-hidden bg-gray-200 dark:bg-gray-800';
const BAR = \`\${BLOCK} rounded-full\`;

export interface LoaderSkeletonCardProps {
  label?: string;
  className?: string;
}

export function LoaderSkeletonCard({
  label = 'Loading card…',
  className = '',
}: LoaderSkeletonCardProps): JSX.Element {
  return (
    <div
      role="status"
      className={\`w-full max-w-xs overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span className="sr-only">{label}</span>

      <div className={\`\${BLOCK} aspect-video w-full\`} aria-hidden="true" />

      <div className="grid gap-2.5 px-4 pb-4 pt-3.5" aria-hidden="true">
        <div className={\`\${BAR} h-3.5 w-[70%]\`} />
        <div className={\`\${BAR} h-2.5 w-full\`} />
        <div className={\`\${BAR} h-2.5 w-[55%]\`} />

        <div className="mt-1.5 flex items-center gap-2">
          <div className={\`\${BAR} h-6 w-6 flex-none\`} />
          <div className={\`\${BAR} h-2.5 w-[35%]\`} />
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'loader-bar-indeterminate',
    category: 'loaders',
    tags: ['progress', 'indeterminate', 'bar', 'unknown', 'reduced-motion'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-29',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 870, copies: 219, downloads: 58 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Loading…'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  INDETERMINATE - the sibling of progress-bar, and the difference is one
  attribute:

    progress-bar             aria-valuenow="43"  -> "43% complete"
    loader-bar-indeterminate NO aria-valuenow    -> "busy, unknown"

  Omitting aria-valuenow is not an oversight to be tidied up later. It is the
  semantic. A progressbar with no valuenow is defined to mean "in progress,
  amount unknown", which is exactly the truth here. Adding a fake number -
  aria-valuenow="50" on a bar that has no idea - is worse than useless: the
  screen reader states it as fact.

  Given that, role="status" with a real sentence is the more useful choice than
  role="progressbar" for a bar that will never have a value: "Loading results"
  beats "busy". Both are defensible; hardcoding a number is not.
-->
<div class="ind" role="status">
  <span class="ind__label">Loading results…</span>
  <div class="ind__track" aria-hidden="true">
    <div class="ind__fill"></div>
  </div>
</div>`,
      css: `.ind {
  width: 100%;
  max-width: 20rem;
}

.ind__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.ind__track {
  position: relative;
  width: 100%;
  height: 0.25rem;
  border-radius: 9999px;
  background: #e5e7eb;
  overflow: hidden;
}

/*
 * A 40%-wide segment sweeping the full track. It leaves the right edge before
 * it re-enters at the left, which is what says "still working, no idea how
 * long" - a bar that fills up implies a finish line this component cannot
 * promise.
 */
.ind__fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 40%;
  border-radius: 9999px;
  background: #1d4ed8;
  animation: ind-sweep 1.4s ease-in-out infinite;
}

@keyframes ind-sweep {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}

/*
 * Reduced motion: the sweep stops and the segment becomes the full track at
 * reduced opacity. A static 40% stub is the failure mode to avoid - frozen
 * mid-sweep it reads as "40% done", which is precisely the claim this component
 * exists not to make.
 */
@media (prefers-reduced-motion: reduce) {
  .ind__fill {
    position: static;
    width: 100%;
    opacity: 0.5;
    animation: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .ind__track {
    background: #1f2937;
  }

  .ind__fill {
    background: #60a5fa;
  }
}`,
      tailwind: `<!--
  Add the .ind-sweep helper once, in your global stylesheet - Tailwind has no
  utility for these keyframes.

  @keyframes ind-sweep {
    from { transform: translateX(-100%); }
    to   { transform: translateX(250%); }
  }
  .ind-sweep { animation: ind-sweep 1.4s ease-in-out infinite; }

  Reduced motion needs more than animation: none here. A 40% stub frozen
  mid-sweep reads as "40% done" - the exact claim an indeterminate bar must not
  make. So the segment becomes the whole track instead:

  @media (prefers-reduced-motion: reduce) {
    .ind-sweep {
      position: static;
      width: 100%;
      opacity: 0.5;
      animation: none;
    }
  }

  Note what is NOT here: aria-valuenow. Its absence is the semantic - see the
  HTML tab.
-->
<div class="w-full max-w-xs" role="status">
  <span class="sr-only">Loading results…</span>
  <div class="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
    <div class="ind-sweep absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-700 dark:bg-blue-400"></div>
  </div>
</div>`,
      react: `// Requires the .ind-sweep helper from the Tailwind tab in your global CSS -
// including its reduced-motion block, which does more than stop the animation.
// No aria-valuenow, on purpose: its absence is what means "unknown". See the
// HTML tab.
export function LoaderBarIndeterminate({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" className={\`w-full max-w-xs \${className}\`}>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="ind-sweep absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-700 dark:bg-blue-400" />
      </div>
    </div>
  );
}`,
      nextjs: `// Pure markup - a Server Component, and a natural route-level
// <Suspense fallback={…}> for a page whose load time you can't predict.
// Requires the .ind-sweep helper from the Tailwind tab in your global CSS.
interface LoaderBarIndeterminateProps {
  label?: string;
  className?: string;
}

export function LoaderBarIndeterminate({
  label = 'Loading…',
  className = '',
}: LoaderBarIndeterminateProps) {
  return (
    <div role="status" className={\`w-full max-w-xs \${className}\`}>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="ind-sweep absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-700 dark:bg-blue-400" />
      </div>
    </div>
  );
}`,
      typescript: `// Requires the .ind-sweep helper from the Tailwind tab in your global CSS.
export interface LoaderBarIndeterminateProps {
  /** Announced by the role="status" wrapper - the only signal a screen reader
   *  gets, since there is deliberately no aria-valuenow. */
  label?: string;
  className?: string;
}

export function LoaderBarIndeterminate({
  label = 'Loading…',
  className = '',
}: LoaderBarIndeterminateProps): JSX.Element {
  return (
    <div role="status" className={\`w-full max-w-xs \${className}\`}>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="ind-sweep absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-700 dark:bg-blue-400" />
      </div>
    </div>
  );
}`,
    },
  },
];
