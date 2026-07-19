import type { ComponentEntry } from './types';

/**
 * Gradients category.
 *
 * Ten ways to put colour in motion (or hold it still) without giving up either
 * of the two budgets a gradient always spends: frames and contrast. Every
 * animated entry moves only `transform` or `opacity` - the gradient itself is
 * painted once and the compositor does the rest - and every entry that puts
 * text over colour picks one of two contrast strategies: cap the gradient's
 * opacity so the base surface still guarantees AA (mesh, blobs), or paint an
 * explicit scrim over pixels the component does not control (aurora, noise).
 * The scrim idea is inherited from `hero-gradient-bg`, for the same reason it
 * exists there: a moving gradient passes contrast on one frame and fails on
 * the next, and only a flat layer makes 4.5:1 true at every frame.
 */
export const gradientsComponents: ComponentEntry[] = [
  {
    slug: 'gradient-mesh-background',
    category: 'gradients',
    tags: ['gradient', 'mesh', 'background', 'radial', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1840, copies: 512, downloads: 131 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker', example: 'Platform' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A mesh is stacked radial gradients, not an image: three blurred, low-opacity
  pools over an opaque base. The opacity cap IS the contrast strategy - the
  text sits on the base surface, and no pool is allowed to get saturated enough
  to drag it below AA, so no scrim layer is needed. Turn a pool up past ~40%
  and that stops being true.
-->
<section class="gradient-mesh">
  <div class="gradient-mesh__pools" aria-hidden="true">
    <div class="gradient-mesh__pool gradient-mesh__pool--a"></div>
    <div class="gradient-mesh__pool gradient-mesh__pool--b"></div>
    <div class="gradient-mesh__pool gradient-mesh__pool--c"></div>
  </div>

  <div class="gradient-mesh__content">
    <p class="gradient-mesh__kicker">Platform</p>
    <h2 class="gradient-mesh__title">One surface for every team</h2>
    <p class="gradient-mesh__copy">
      Plan, build and measure on a single canvas - the mesh stays in the
      background, where it belongs.
    </p>
  </div>
</section>`,
      css: `.gradient-mesh {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  border-radius: 1rem;
  background-color: #fff;
}

.gradient-mesh__pools {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.gradient-mesh__pool {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
}

.gradient-mesh__pool--a {
  top: -5rem;
  left: -5rem;
  width: 16rem;
  height: 16rem;
  background-image: radial-gradient(circle at center, rgba(59, 130, 246, 0.35), transparent 70%);
}

.gradient-mesh__pool--b {
  top: 2.5rem;
  right: -4rem;
  width: 14rem;
  height: 14rem;
  background-image: radial-gradient(circle at center, rgba(168, 85, 247, 0.3), transparent 70%);
}

.gradient-mesh__pool--c {
  bottom: -6rem;
  left: 25%;
  width: 16rem;
  height: 16rem;
  background-image: radial-gradient(circle at center, rgba(34, 211, 238, 0.28), transparent 70%);
}

@media (min-width: 640px) {
  .gradient-mesh__pool--a { width: 24rem; height: 24rem; }
  .gradient-mesh__pool--b { width: 20rem; height: 20rem; }
  .gradient-mesh__pool--c { width: 24rem; height: 24rem; }
}

.gradient-mesh__content {
  padding: 3.5rem 1.5rem;
  text-align: center;
}

@media (min-width: 640px) {
  .gradient-mesh__content {
    padding: 5rem 2rem;
  }
}

.gradient-mesh__kicker {
  margin: 0;
  color: #1d4ed8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.gradient-mesh__title {
  margin: 0.75rem 0 0;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: #111827;
}

.gradient-mesh__copy {
  max-width: 36rem;
  margin: 1rem auto 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
}

/*
 * The pools survive the theme switch untouched: at these opacities they read
 * as tint on white and as glow on near-black. Only the base surface and the
 * text flip.
 */
@media (prefers-color-scheme: dark) {
  .gradient-mesh {
    background-color: #030712;
  }

  .gradient-mesh__kicker {
    color: #60a5fa;
  }

  .gradient-mesh__title {
    color: #f3f4f6;
  }

  .gradient-mesh__copy {
    color: #9ca3af;
  }
}`,
      tailwind: `<!--
  A mesh is stacked radial gradients, not an image: three blurred, low-opacity
  pools over an opaque base. The opacity cap IS the contrast strategy - the
  text sits on the base surface, and no pool is allowed to get saturated enough
  to drag it below AA, so no scrim layer is needed.
-->
<section class="relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950">
  <div class="absolute inset-0 -z-10" aria-hidden="true">
    <div class="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl sm:h-96 sm:w-96"></div>
    <div class="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3),transparent_70%)] blur-2xl sm:h-80 sm:w-80"></div>
    <div class="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_70%)] blur-2xl sm:h-96 sm:w-96"></div>
  </div>

  <div class="px-6 py-14 text-center sm:px-8 sm:py-20">
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
      Platform
    </p>

    <h2 class="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
      One surface for every team
    </h2>

    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
      Plan, build and measure on a single canvas - the mesh stays in the
      background, where it belongs.
    </p>
  </div>
</section>`,
      react: `export function GradientMeshBackground({ title, kicker, copy, className = '' }) {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 \${className}\`}
    >
      {/* Low-opacity pools over an opaque base: the base surface, not the
          mesh, is what guarantees AA for the text. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3),transparent_70%)] blur-2xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
      </div>
    </section>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface GradientMeshBackgroundProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

// No 'use client' - the mesh is static CSS. The whole section renders as a
// Server Component and ships zero JS.
export function GradientMeshBackground({
  title,
  kicker,
  copy,
  className = '',
}: GradientMeshBackgroundProps) {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 \${className}\`}
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3),transparent_70%)] blur-2xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface GradientMeshBackgroundProps {
  /** An h2, not an h1 - a decorated section rarely owns the page title. */
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

export function GradientMeshBackground({
  title,
  kicker,
  copy,
  className = '',
}: GradientMeshBackgroundProps): JSX.Element {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 \${className}\`}
    >
      {/* Low-opacity pools over an opaque base: the base surface, not the
          mesh, is what guarantees AA for the text. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3),transparent_70%)] blur-2xl sm:h-80 sm:w-80" />
        <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.28),transparent_70%)] blur-2xl sm:h-96 sm:w-96" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'gradient-animated-blobs',
    category: 'gradients',
    tags: ['gradient', 'blobs', 'animated', 'background', 'motion'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1620, copies: 447, downloads: 108 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Tailwind has no utility that declares @keyframes, so the drift lives in a
  <style> block. Both keyframes animate transform ONLY - translate and scale.
  The blur is the expensive part of a blob, and a transform-only animation lets
  the browser rasterise it once and move the bitmap on the compositor;
  animating left/top or width would re-run the blur every frame.
-->
<style>
  @keyframes blob-drift-a {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(2.5rem, -2rem, 0) scale(1.15); }
  }
  @keyframes blob-drift-b {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(-2rem, 2rem, 0) scale(0.9); }
  }
</style>

<section class="relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950">
  <div class="absolute inset-0 -z-10" aria-hidden="true">
    <div class="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl animate-[blob-drift-a_18s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80"></div>
    <div class="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.3),transparent_70%)] blur-2xl animate-[blob-drift-b_24s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80"></div>
    <div class="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_70%)] blur-2xl animate-[blob-drift-a_28s_ease-in-out_-9s_infinite] motion-reduce:animate-none sm:h-64 sm:w-64"></div>
  </div>

  <div class="px-6 py-14 text-center sm:px-8 sm:py-20">
    <h2 class="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
      Calm on the surface
    </h2>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
      Three blobs drifting on twenty-second loops - slow enough to feel like
      weather, not like a screensaver.
    </p>
  </div>
</section>`,
      react: `const DRIFT_KEYFRAMES = \`
  @keyframes blob-drift-a {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(2.5rem, -2rem, 0) scale(1.15); }
  }
  @keyframes blob-drift-b {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(-2rem, 2rem, 0) scale(0.9); }
  }
\`;

export function GradientAnimatedBlobs({ title, copy, className = '' }) {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 \${className}\`}
    >
      {/* Keyframes travel with the component so it stays copy-pasteable. Both
          animate transform only - the blur is rasterised once and the
          compositor moves the bitmap. */}
      <style>{DRIFT_KEYFRAMES}</style>

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl animate-[blob-drift-a_18s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80" />
        <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.3),transparent_70%)] blur-2xl animate-[blob-drift-b_24s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_70%)] blur-2xl animate-[blob-drift-a_28s_ease-in-out_-9s_infinite] motion-reduce:animate-none sm:h-64 sm:w-64" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const DRIFT_KEYFRAMES = \`
  @keyframes blob-drift-a {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(2.5rem, -2rem, 0) scale(1.15); }
  }
  @keyframes blob-drift-b {
    0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(-2rem, 2rem, 0) scale(0.9); }
  }
\`;

export interface GradientAnimatedBlobsProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

export function GradientAnimatedBlobs({
  title,
  copy,
  className = '',
}: GradientAnimatedBlobsProps): JSX.Element {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-950 \${className}\`}
    >
      {/* Both keyframes animate transform only - translate and scale. The blur
          is the expensive part of a blob; a transform-only animation lets the
          browser rasterise it once and move the bitmap on the compositor.
          Reduced motion freezes the blobs in place and keeps the colour. */}
      <style>{DRIFT_KEYFRAMES}</style>

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_70%)] blur-2xl animate-[blob-drift-a_18s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80" />
        <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.3),transparent_70%)] blur-2xl animate-[blob-drift-b_24s_ease-in-out_infinite] motion-reduce:animate-none sm:h-80 sm:w-80" />
        <div className="absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.25),transparent_70%)] blur-2xl animate-[blob-drift-a_28s_ease-in-out_-9s_infinite] motion-reduce:animate-none sm:h-64 sm:w-64" />
      </div>

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'gradient-aurora',
    category: 'gradients',
    tags: ['gradient', 'aurora', 'animated', 'dark', 'background'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2210, copies: 604, downloads: 149 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Three layers, same contract as an animated hero: the aurora (decorative,
  aria-hidden), a flat scrim, then the content. The ribbons drift through
  bright emerald and cyan, so white text over the raw aurora passes contrast on
  one frame and fails on the next - the gray-950/45 scrim is what makes 4.5:1
  true at every frame. The sweep animates transform only (translate + skew), so
  the heavily blurred ribbons are rasterised once and panned by the compositor.
-->
<style>
  @keyframes aurora-sweep {
    0%, 100% { transform: translateX(-8%) skewX(-12deg); }
    50% { transform: translateX(8%) skewX(-12deg); }
  }
</style>

<section class="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950">
  <div class="absolute left-[-20%] right-[-20%] top-[-45%] -z-20 h-[120%]" aria-hidden="true">
    <div class="absolute inset-0 animate-[aurora-sweep_18s_ease-in-out_infinite] bg-[linear-gradient(100deg,transparent_10%,rgba(16,185,129,0.45)_35%,rgba(34,211,238,0.35)_50%,rgba(139,92,246,0.4)_65%,transparent_90%)] blur-3xl motion-reduce:animate-none"></div>
    <div class="absolute inset-0 animate-[aurora-sweep_26s_ease-in-out_-8s_infinite_reverse] bg-[linear-gradient(80deg,transparent_20%,rgba(59,130,246,0.3)_45%,rgba(16,185,129,0.25)_60%,transparent_85%)] blur-3xl motion-reduce:animate-none"></div>
  </div>
  <div class="absolute inset-0 -z-10 bg-gray-950/45" aria-hidden="true"></div>

  <div class="px-6 py-14 text-center sm:px-8 sm:py-20">
    <p class="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
      Aurora release
    </p>

    <h2 class="mt-5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
      Interfaces that glow in the dark
    </h2>

    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">
      A northern-lights sweep on a self-painted night sky - it looks identical
      on a white page and a black one.
    </p>
  </div>
</section>`,
      react: `const AURORA_KEYFRAMES = \`
  @keyframes aurora-sweep {
    0%, 100% { transform: translateX(-8%) skewX(-12deg); }
    50% { transform: translateX(8%) skewX(-12deg); }
  }
\`;

export function GradientAurora({ title, kicker, copy, className = '' }) {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 \${className}\`}
    >
      <style>{AURORA_KEYFRAMES}</style>

      {/* Ribbons drift through bright stops, so the scrim below - not the
          text colour - is what guarantees AA at every frame of the sweep. */}
      <div className="absolute left-[-20%] right-[-20%] top-[-45%] -z-20 h-[120%]" aria-hidden="true">
        <div className="absolute inset-0 animate-[aurora-sweep_18s_ease-in-out_infinite] bg-[linear-gradient(100deg,transparent_10%,rgba(16,185,129,0.45)_35%,rgba(34,211,238,0.35)_50%,rgba(139,92,246,0.4)_65%,transparent_90%)] blur-3xl motion-reduce:animate-none" />
        <div className="absolute inset-0 animate-[aurora-sweep_26s_ease-in-out_-8s_infinite_reverse] bg-[linear-gradient(80deg,transparent_20%,rgba(59,130,246,0.3)_45%,rgba(16,185,129,0.25)_60%,transparent_85%)] blur-3xl motion-reduce:animate-none" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gray-950/45" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const AURORA_KEYFRAMES = \`
  @keyframes aurora-sweep {
    0%, 100% { transform: translateX(-8%) skewX(-12deg); }
    50% { transform: translateX(8%) skewX(-12deg); }
  }
\`;

export interface GradientAuroraProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

export function GradientAurora({
  title,
  kicker,
  copy,
  className = '',
}: GradientAuroraProps): JSX.Element {
  return (
    <section
      className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 \${className}\`}
    >
      <style>{AURORA_KEYFRAMES}</style>

      {/* Ribbons drift through bright emerald and cyan, so white text over the
          raw aurora passes contrast on one frame and fails on the next. The
          scrim below is what makes 4.5:1 true at every frame. The sweep
          animates transform only (translate + skew): the blur-3xl ribbons are
          rasterised once and panned by the compositor. No dark: variants - the
          section paints its own night sky, so both themes see the same thing. */}
      <div className="absolute left-[-20%] right-[-20%] top-[-45%] -z-20 h-[120%]" aria-hidden="true">
        <div className="absolute inset-0 animate-[aurora-sweep_18s_ease-in-out_infinite] bg-[linear-gradient(100deg,transparent_10%,rgba(16,185,129,0.45)_35%,rgba(34,211,238,0.35)_50%,rgba(139,92,246,0.4)_65%,transparent_90%)] blur-3xl motion-reduce:animate-none" />
        <div className="absolute inset-0 animate-[aurora-sweep_26s_ease-in-out_-8s_infinite_reverse] bg-[linear-gradient(80deg,transparent_20%,rgba(59,130,246,0.3)_45%,rgba(16,185,129,0.25)_60%,transparent_85%)] blur-3xl motion-reduce:animate-none" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gray-950/45" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-300">{copy}</p>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'gradient-radial-spotlight',
    category: 'gradients',
    tags: ['gradient', 'spotlight', 'hover', 'card', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1980, copies: 566, downloads: 122 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The one place this category genuinely needs JavaScript: CSS cannot read the
  pointer. The script only writes two custom properties - no classes toggle,
  no layout runs. The reveal itself is a pure-CSS opacity fade on hover, which
  means the spotlight simply never exists for touch and keyboard users: the
  card must read complete without it.
-->
<div
  id="spotlight-card"
  class="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(59,130,246,0.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none dark:bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(96,165,250,0.2),transparent_70%)]"
    aria-hidden="true"
  ></div>

  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Hover to light it up</h3>
  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    The gradient's centre rides two CSS custom properties; the pointer just
    moves them around.
  </p>
</div>

<script>
  const card = document.getElementById('spotlight-card');
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', \`\${event.clientX - rect.left}px\`);
    card.style.setProperty('--spot-y', \`\${event.clientY - rect.top}px\`);
  });
</script>`,
      react: `export function GradientRadialSpotlight({ title, copy, className = '' }) {
  // Writing a custom property does not re-render React and does not run
  // layout - the browser repaints one composited layer. That is why the
  // handler can fire on every pointer move without a setState storm.
  function handlePointerMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', \`\${event.clientX - rect.left}px\`);
    event.currentTarget.style.setProperty('--spot-y', \`\${event.clientY - rect.top}px\`);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={\`group relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {/* Revealed by opacity only. The spotlight never exists for touch and
          keyboard users, so the card must read complete without it. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(59,130,246,0.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none dark:bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(96,165,250,0.2),transparent_70%)]"
        aria-hidden="true"
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { PointerEvent, ReactNode } from 'react';

export interface GradientRadialSpotlightProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

export function GradientRadialSpotlight({
  title,
  copy,
  className = '',
}: GradientRadialSpotlightProps): JSX.Element {
  // Writing a custom property does not re-render React and does not run
  // layout - the browser repaints one composited layer. That is why the
  // handler can fire on every pointer move without a setState storm.
  function handlePointerMove(event: PointerEvent<HTMLDivElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spot-x', \`\${event.clientX - rect.left}px\`);
    event.currentTarget.style.setProperty('--spot-y', \`\${event.clientY - rect.top}px\`);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={\`group relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {/* Revealed by opacity only - hover fades it in, the pointer moves its
          centre. The spotlight never exists for touch and keyboard users, so
          the card must read complete without it. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(59,130,246,0.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none dark:bg-[radial-gradient(240px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgba(96,165,250,0.2),transparent_70%)]"
        aria-hidden="true"
      />

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'gradient-conic-ring',
    category: 'gradients',
    tags: ['gradient', 'conic', 'border', 'animated', 'card'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1750, copies: 489, downloads: 117 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'glow', labelKey: 'glow' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The ring is the 1px of spinning gradient the p-px padding leaves exposed.
  inset-[-100%] makes the conic layer 3x the card so its corners never show
  while it rotates, and the spin is pure transform - the gradient is painted
  once and rotated by the compositor. Reduced motion stops the spin and leaves
  a static conic arc: the motion is the decoration, the ring is the design.
-->
<style>
  @keyframes conic-spin {
    to { transform: rotate(1turn); }
  }
</style>

<div class="relative w-full max-w-sm overflow-hidden rounded-2xl p-px">
  <div
    class="absolute inset-[-100%] animate-[conic-spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_100deg,#a855f7_180deg,#22d3ee_260deg,transparent_360deg)] motion-reduce:animate-none"
    aria-hidden="true"
  ></div>

  <!-- The inner surface must be fully opaque, or the gradient shows through
       the card instead of just around it. Radius = outer minus the 1px ring. -->
  <div class="relative rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Realtime sync</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Every change lands on every device before you lift your finger off the
      key.
    </p>
  </div>
</div>`,
      react: `const SPIN_KEYFRAMES = \`
  @keyframes conic-spin {
    to { transform: rotate(1turn); }
  }
\`;

export function GradientConicRing({ title, copy, className = '' }) {
  return (
    <div className={\`relative w-full max-w-sm overflow-hidden rounded-2xl p-px \${className}\`}>
      <style>{SPIN_KEYFRAMES}</style>

      {/* 3x the card so the rotating layer's corners never show; the spin is
          pure transform, so the conic gradient is painted exactly once. */}
      <div
        className="absolute inset-[-100%] animate-[conic-spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_100deg,#a855f7_180deg,#22d3ee_260deg,transparent_360deg)] motion-reduce:animate-none"
        aria-hidden="true"
      />

      <div className="relative rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>
    </div>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

const SPIN_KEYFRAMES = \`
  @keyframes conic-spin {
    to { transform: rotate(1turn); }
  }
\`;

interface GradientConicRingProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

// No 'use client' - the spin is a CSS animation and the reduced-motion
// opt-out is a media query. The card renders as a Server Component.
export function GradientConicRing({ title, copy, className = '' }: GradientConicRingProps) {
  return (
    <div className={\`relative w-full max-w-sm overflow-hidden rounded-2xl p-px \${className}\`}>
      <style>{SPIN_KEYFRAMES}</style>

      <div
        className="absolute inset-[-100%] animate-[conic-spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_100deg,#a855f7_180deg,#22d3ee_260deg,transparent_360deg)] motion-reduce:animate-none"
        aria-hidden="true"
      />

      <div className="relative rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const SPIN_KEYFRAMES = \`
  @keyframes conic-spin {
    to { transform: rotate(1turn); }
  }
\`;

export interface GradientConicRingProps {
  title: ReactNode;
  copy?: string;
  className?: string;
}

export function GradientConicRing({
  title,
  copy,
  className = '',
}: GradientConicRingProps): JSX.Element {
  return (
    <div className={\`relative w-full max-w-sm overflow-hidden rounded-2xl p-px \${className}\`}>
      <style>{SPIN_KEYFRAMES}</style>

      {/* inset-[-100%] makes the conic layer 3x the card so its corners never
          show while it rotates; the spin is pure transform, so the gradient is
          painted once and rotated by the compositor. Reduced motion leaves a
          static conic arc - the motion is the decoration, the ring is the
          design. */}
      <div
        className="absolute inset-[-100%] animate-[conic-spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_100deg,#a855f7_180deg,#22d3ee_260deg,transparent_360deg)] motion-reduce:animate-none"
        aria-hidden="true"
      />

      {/* Opaque inner surface, or the gradient shows through the card instead
          of just around it. Radius = outer radius minus the 1px ring. */}
      <div className="relative rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'gradient-text',
    category: 'gradients',
    tags: ['gradient', 'text', 'headline', 'clip', 'typography'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2640, copies: 803, downloads: 176 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  bg-clip-text does not change what the text *is*: it stays real, selectable,
  announced text - only the paint changes. The two things that do change are
  contrast (judge the darkest and lightest stop against the page, never the
  average) and clipping: the gradient is clipped at the content box, so a
  tight line-height puts descenders outside it. The bottom padding on the
  title is not rhythm - it is where the descenders live.
-->
<div class="gradient-text">
  <p class="gradient-text__kicker">The 2026 report</p>
  <h2 class="gradient-text__title">Design is how it works</h2>
  <p class="gradient-text__copy">
    One gradient across the headline, solid ink everywhere else - the copy has
    to carry the reading, so it stays flat.
  </p>
</div>`,
      css: `.gradient-text {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  text-align: center;
}

.gradient-text__kicker {
  margin: 0;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.gradient-text__title {
  margin: 0.75rem 0 0;
  /* Descender room: background-clip:text clips at the content box, and a
     tight line-height would slice the tails off g, y and j. */
  padding-bottom: 0.25rem;
  font-size: clamp(1.875rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
  /* Solid fallback first: browsers without background-clip:text show this
     instead of invisible text. -webkit-text-fill-color only wins where the
     clip actually works. */
  color: #7c3aed;
  background-image: linear-gradient(90deg, #2563eb, #7c3aed, #c026d3);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text__copy {
  max-width: 36rem;
  margin: 1rem auto 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
}

/*
 * The dark stops are one shade lighter across the board: #2563eb on near-black
 * is muddy, #60a5fa is not. Judge each stop on its own - the darkest one
 * decides legibility, not the average.
 */
@media (prefers-color-scheme: dark) {
  .gradient-text__kicker {
    color: #9ca3af;
  }

  .gradient-text__title {
    color: #a78bfa;
    background-image: linear-gradient(90deg, #60a5fa, #a78bfa, #e879f9);
  }

  .gradient-text__copy {
    color: #9ca3af;
  }
}`,
      tailwind: `<!--
  bg-clip-text keeps the text real - selectable, findable, announced - only
  the paint changes. The pb-1 on the title is not rhythm: the gradient is
  clipped at the content box, and a tight line-height puts the descenders of
  g, y and j outside it. Contrast is judged per stop, not on the average; the
  dark: stops are each a shade lighter for the same reason.
-->
<div class="mx-auto w-full max-w-2xl px-4 py-10 text-center sm:py-14">
  <p class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
    The 2026 report
  </p>

  <h2 class="mt-3 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text pb-1 text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
    Design is how it works
  </h2>

  <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
    One gradient across the headline, solid ink everywhere else - the copy has
    to carry the reading, so it stays flat.
  </p>
</div>`,
      react: `export function GradientText({ title, kicker, copy, className = '' }) {
  return (
    <div className={\`mx-auto w-full max-w-2xl px-4 py-10 text-center sm:py-14 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {kicker}
        </p>
      ) : null}

      {/* pb-1 is descender room, not rhythm - bg-clip-text clips at the
          content box and a tight line-height slices the tails off g, y, j. */}
      <h2 className="mt-3 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text pb-1 text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
        {title}
      </h2>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
    </div>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface GradientTextProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

// No 'use client' - painted text is still just text. Renders as a Server
// Component and ships zero JS.
export function GradientText({ title, kicker, copy, className = '' }: GradientTextProps) {
  return (
    <div className={\`mx-auto w-full max-w-2xl px-4 py-10 text-center sm:py-14 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {kicker}
        </p>
      ) : null}

      <h2 className="mt-3 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text pb-1 text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
        {title}
      </h2>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface GradientTextProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

export function GradientText({
  title,
  kicker,
  copy,
  className = '',
}: GradientTextProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-2xl px-4 py-10 text-center sm:py-14 \${className}\`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {kicker}
        </p>
      ) : null}

      {/* bg-clip-text keeps the text real - selectable, findable, announced.
          pb-1 is descender room, not rhythm: the gradient clips at the content
          box and a tight line-height slices the tails off g, y and j. The
          dark: stops are each a shade lighter - contrast is judged per stop,
          never on the average. */}
      <h2 className="mt-3 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text pb-1 text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
        {title}
      </h2>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'gradient-border-card',
    category: 'gradients',
    tags: ['gradient', 'border', 'card', 'padding-trick', 'static'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2380, copies: 720, downloads: 168 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Upgrade'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  CSS borders cannot take a gradient and keep their corner radius
  (border-image discards border-radius), so the "border" here is the 1px of
  gradient background the p-px padding leaves exposed around an opaque inner
  card. Two consequences: the inner surface must be fully opaque or the
  gradient shows *through* the card instead of around it, and the inner radius
  must be the outer radius minus the ring width or the corners pinch.
-->
<div class="w-full max-w-sm rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 p-px">
  <div class="rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Pro plan</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Everything in Free, plus unlimited projects and priority support.
    </p>
    <a
      href="#"
      class="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      Upgrade
    </a>
  </div>
</div>`,
      react: `export function GradientBorderCard({
  title,
  copy,
  ctaLabel = 'Upgrade',
  ctaHref = '#',
  className = '',
}) {
  return (
    <div
      className={\`w-full max-w-sm rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 p-px \${className}\`}
    >
      {/* Opaque inner surface, inner radius = outer minus the 1px ring - both
          are what keep the gradient a border instead of a background. */}
      <div className="rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface GradientBorderCardProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

// No 'use client' - a static gradient ring holds no state. Renders as a
// Server Component and ships zero JS.
export function GradientBorderCard({
  title,
  copy,
  ctaLabel = 'Upgrade',
  ctaHref = '#',
  className = '',
}: GradientBorderCardProps) {
  return (
    <div
      className={\`w-full max-w-sm rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 p-px \${className}\`}
    >
      <div className="rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface GradientBorderCardProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function GradientBorderCard({
  title,
  copy,
  ctaLabel = 'Upgrade',
  ctaHref = '#',
  className = '',
}: GradientBorderCardProps): JSX.Element {
  return (
    <div
      className={\`w-full max-w-sm rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 p-px \${className}\`}
    >
      {/* CSS borders cannot take a gradient and keep their radius, so the
          "border" is the 1px of gradient the p-px padding leaves exposed. The
          inner surface must be fully opaque - any alpha and the gradient shows
          through the card, not just around it - and the inner radius is the
          outer radius minus the ring width, or the corners pinch. */}
      <div className="rounded-[calc(1rem_-_1px)] bg-white p-6 dark:bg-gray-950">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
        <a
          href={ctaHref}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'gradient-noise-overlay',
    category: 'gradients',
    tags: ['gradient', 'noise', 'grain', 'svg', 'texture'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1490, copies: 402, downloads: 96 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The grain is an inline SVG feTurbulence filter, not a PNG - zero network
  requests and it stays crisp at any density. Stacking order, bottom to top:
  gradient, grain, scrim, content. The scrim sits *above* the grain on
  purpose: it guarantees AA for the white text over both the gradient and the
  noise speckle, whatever opacity the grain runs at.

  One caveat that is invisible until it bites: SVG filter ids are
  document-global. Render this panel twice and both <rect>s resolve to the
  first filter - give each instance its own id.
-->
<section class="relative isolate w-full overflow-hidden rounded-2xl">
  <div
    class="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#1e3a8a,#6d28d9,#be185d)]"
    aria-hidden="true"
  ></div>

  <svg class="absolute inset-0 -z-20 h-full w-full opacity-25 mix-blend-soft-light" aria-hidden="true">
    <filter id="gradient-noise-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#gradient-noise-grain)" />
  </svg>

  <div class="absolute inset-0 -z-10 bg-black/30" aria-hidden="true"></div>

  <div class="px-6 py-14 text-center sm:px-8 sm:py-20">
    <h2 class="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
      Texture without the texture file
    </h2>
    <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">
      Film grain from a four-line SVG filter - the banding a smooth gradient
      shows on cheap panels disappears under it.
    </p>
  </div>
</section>`,
      react: `export function GradientNoiseOverlay({
  title,
  copy,
  filterId = 'gradient-noise-grain',
  className = '',
}) {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl \${className}\`}>
      <div
        className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#1e3a8a,#6d28d9,#be185d)]"
        aria-hidden="true"
      />

      {/* SVG filter ids are document-global: two instances with the same id
          both resolve to the first one's filter. Pass a unique filterId per
          instance if the panel appears more than once. */}
      <svg
        className="absolute inset-0 -z-20 h-full w-full opacity-25 mix-blend-soft-light"
        aria-hidden="true"
      >
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={\`url(#\${filterId})\`} />
      </svg>

      {/* Above the grain, below the text: the scrim guarantees AA over both
          the gradient and the noise speckle. */}
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface GradientNoiseOverlayProps {
  title: ReactNode;
  copy?: string;
  /**
   * SVG filter ids are document-global - two instances with the same id both
   * resolve to the first one's filter. Give each instance its own.
   */
  filterId?: string;
  className?: string;
}

export function GradientNoiseOverlay({
  title,
  copy,
  filterId = 'gradient-noise-grain',
  className = '',
}: GradientNoiseOverlayProps): JSX.Element {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl \${className}\`}>
      <div
        className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#1e3a8a,#6d28d9,#be185d)]"
        aria-hidden="true"
      />

      {/* Grain from feTurbulence - no PNG, no network request, crisp at any
          density. Static, so it costs one paint, ever. */}
      <svg
        className="absolute inset-0 -z-20 h-full w-full opacity-25 mix-blend-soft-light"
        aria-hidden="true"
      >
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={\`url(#\${filterId})\`} />
      </svg>

      {/* Above the grain, below the text: the scrim guarantees AA over both
          the gradient and the noise speckle, whatever opacity the grain runs
          at. */}
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />

      <div className="px-6 py-14 text-center sm:px-8 sm:py-20">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'gradient-section-divider',
    category: 'gradients',
    tags: ['gradient', 'divider', 'separator', 'section', 'hairline'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1310, copies: 386, downloads: 84 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'glow', labelKey: 'glow' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'glow', type: 'boolean', default: 'true', descriptionKey: 'glow' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  aria-hidden, not <hr>, on purpose: an <hr> announces "separator" to a screen
  reader, and between two <section>s that is noise - the headings already
  carry the structure. If the break IS semantic (say, the end of an article
  before comments), drop aria-hidden and use a real <hr> instead.
-->
<div class="gradient-divider" aria-hidden="true">
  <div class="gradient-divider__glow"></div>
  <div class="gradient-divider__line"></div>
</div>`,
      css: `.gradient-divider {
  position: relative;
  isolation: isolate;
  width: 100%;
  padding: 1.5rem 0;
}

/* The hairline fades out at both ends instead of hitting the container edge -
   that fade is what makes it read as a breath between sections rather than a
   rule across the page. */
.gradient-divider__line {
  height: 1px;
  width: 100%;
  background-image: linear-gradient(90deg, transparent, #d1d5db, transparent);
}

.gradient-divider__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: -1;
  height: 4rem;
  width: 66%;
  max-width: 28rem;
  transform: translate(-50%, -50%);
  background-image: radial-gradient(closest-side, rgba(59, 130, 246, 0.2), transparent);
  filter: blur(24px);
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  .gradient-divider__line {
    background-image: linear-gradient(90deg, transparent, #374151, transparent);
  }

  .gradient-divider__glow {
    background-image: radial-gradient(closest-side, rgba(96, 165, 250, 0.18), transparent);
  }
}`,
      tailwind: `<!--
  aria-hidden, not <hr>, on purpose: an <hr> announces "separator", and
  between two <section>s that is noise - the headings already carry the
  structure. The hairline fades out at both ends instead of hitting the
  container edge; that fade is what makes it read as a breath between
  sections rather than a rule across the page.
-->
<div class="relative isolate w-full py-6" aria-hidden="true">
  <div class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-16 w-2/3 max-w-md -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(59,130,246,0.2),transparent)] blur-xl dark:bg-[radial-gradient(closest-side,rgba(96,165,250,0.18),transparent)]"></div>
  <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"></div>
</div>`,
      react: `export function GradientSectionDivider({ glow = true, className = '' }) {
  return (
    <div className={\`relative isolate w-full py-6 \${className}\`} aria-hidden="true">
      {glow ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-16 w-2/3 max-w-md -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(59,130,246,0.2),transparent)] blur-xl dark:bg-[radial-gradient(closest-side,rgba(96,165,250,0.18),transparent)]" />
      ) : null}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
    </div>
  );
}`,
      typescript: `export interface GradientSectionDividerProps {
  /** Soft accent glow behind the hairline. */
  glow?: boolean;
  className?: string;
}

export function GradientSectionDivider({
  glow = true,
  className = '',
}: GradientSectionDividerProps): JSX.Element {
  return (
    /* aria-hidden, not <hr>, on purpose: an <hr> announces "separator" and
       between two <section>s that is noise - the headings already carry the
       structure. If the break IS semantic, drop aria-hidden and use <hr>. */
    <div className={\`relative isolate w-full py-6 \${className}\`} aria-hidden="true">
      {glow ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-16 w-2/3 max-w-md -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(59,130,246,0.2),transparent)] blur-xl dark:bg-[radial-gradient(closest-side,rgba(96,165,250,0.18),transparent)]" />
      ) : null}
      {/* The fade at both ends is what makes it read as a breath between
          sections rather than a rule across the page. */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
    </div>
  );
}`,
    },
  },
  {
    slug: 'gradient-button-set',
    category: 'gradients',
    tags: ['gradient', 'button', 'cta', 'hover', 'interactive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2050, copies: 631, downloads: 143 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'href', type: 'string', default: "'#'", descriptionKey: 'href' },
      {
        name: 'variant',
        type: "'solid' | 'outline'",
        default: "'solid'",
        descriptionKey: 'variant',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The hover shift is two stacked static gradients cross-faded with opacity,
  not one gradient with an animated background-position. Position animation
  repaints the gradient every frame; an opacity fade is compositor work. The
  label sits in its own relative <span> so it stays above both layers.

  The outline button is the border-card padding trick at button scale - and
  its hover fill reuses the gradient the ring already paints, so the label
  flips to white over stops that were chosen to clear AA under white.
-->
<div class="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
  <a
    href="#"
    class="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span class="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" aria-hidden="true"></span>
    <span class="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" aria-hidden="true"></span>
    <span class="relative">Start free trial</span>
  </a>

  <a
    href="#"
    class="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-fuchsia-600 p-px text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <span class="inline-flex w-full items-center justify-center rounded-[calc(0.5rem_-_1px)] bg-white px-5 py-2.5 text-gray-900 transition-colors group-hover:bg-transparent group-hover:text-white motion-reduce:transition-none dark:bg-gray-950 dark:text-gray-100">
      Book a demo
    </span>
  </a>
</div>`,
      react: `export function GradientButton({ label, href = '#', variant = 'solid', className = '' }) {
  if (variant === 'outline') {
    // The border-card padding trick at button scale: the gradient the ring
    // paints is the same one the hover fill reveals.
    return (
      <a
        href={href}
        className={\`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-fuchsia-600 p-px text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
      >
        <span className="inline-flex w-full items-center justify-center rounded-[calc(0.5rem_-_1px)] bg-white px-5 py-2.5 text-gray-900 transition-colors group-hover:bg-transparent group-hover:text-white motion-reduce:transition-none dark:bg-gray-950 dark:text-gray-100">
          {label}
        </span>
      </a>
    );
  }

  // Two stacked static gradients cross-faded with opacity - a
  // background-position animation would repaint the gradient every frame.
  return (
    <a
      href={href}
      className={\`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" aria-hidden="true" />
      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" aria-hidden="true" />
      <span className="relative">{label}</span>
    </a>
  );
}`,
      typescript: `export interface GradientButtonProps {
  label: string;
  href?: string;
  /** 'solid' paints the gradient; 'outline' wears it as a 1px ring. */
  variant?: 'solid' | 'outline';
  className?: string;
}

export function GradientButton({
  label,
  href = '#',
  variant = 'solid',
  className = '',
}: GradientButtonProps): JSX.Element {
  if (variant === 'outline') {
    // The border-card padding trick at button scale. The hover fill reuses
    // the gradient the ring already paints, and the label flips to white -
    // the stops were chosen to clear AA under white in both themes, which is
    // why there are no dark: overrides on the gradient itself.
    return (
      <a
        href={href}
        className={\`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-fuchsia-600 p-px text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
      >
        <span className="inline-flex w-full items-center justify-center rounded-[calc(0.5rem_-_1px)] bg-white px-5 py-2.5 text-gray-900 transition-colors group-hover:bg-transparent group-hover:text-white motion-reduce:transition-none dark:bg-gray-950 dark:text-gray-100">
          {label}
        </span>
      </a>
    );
  }

  // Two stacked static gradients cross-faded with opacity, not one gradient
  // with an animated background-position: position animation repaints the
  // gradient every frame, an opacity fade is compositor work.
  return (
    <a
      href={href}
      className={\`group relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600" aria-hidden="true" />
      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none" aria-hidden="true" />
      <span className="relative">{label}</span>
    </a>
  );
}`,
    },
  },
];
