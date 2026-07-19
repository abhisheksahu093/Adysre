import type { ComponentEntry } from './types';

/**
 * Globes category.
 *
 * Ten stylised globes with a hard constraint: no WebGL, no three.js, no images -
 * nothing but CSS and inline SVG. A real globe is a texture on a sphere; here the
 * sphere is faked three ways that recur across the set: a dotted disk (an SVG dot
 * `<pattern>` clipped to a circle), a latitude/longitude wireframe (ellipses whose
 * rx/ry encode perspective), and a fixed radial highlight laid *over* a spinning
 * body so the light source stays put while the planet turns. That last split is
 * the load-bearing trick - spin the whole SVG and the highlight rotates with it,
 * which reads as a spinning coin, not a spinning world. Every animation is
 * transform/opacity only (compositor-cheap) and every one honours
 * `prefers-reduced-motion`: the motion is decoration, the globe is the design.
 */
export const globesComponents: ComponentEntry[] = [
  {
    slug: 'globe-dotted-rotating',
    category: 'globes',
    tags: ['globe', 'dotted', 'rotating', 'svg', 'sphere'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2140, copies: 612, downloads: 158 },
    props: [
      { name: 'heading', type: 'ReactNode', descriptionKey: 'heading' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'size', type: 'number', default: '240', descriptionKey: 'size' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The globe is one SVG (dots + wireframe) that spins, with a *separate* static
  highlight div on top so the light source stays fixed while the planet turns.
  The whole thing is aria-hidden: it illustrates, it carries no text.
-->
<style>
  @keyframes gdr-spin { to { transform: rotate(1turn); } }
</style>

<div class="flex w-full flex-col items-center gap-6 px-4 py-8 text-center">
  <div class="relative shrink-0" style="width:240px;height:240px;max-width:100%" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-blue-600/60 [animation:gdr-spin_32s_linear_infinite] motion-reduce:[animation:none] dark:text-blue-400/60">
      <defs>
        <pattern id="gdr-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
        </pattern>
        <clipPath id="gdr-clip"><circle cx="100" cy="100" r="92" /></clipPath>
      </defs>
      <g clip-path="url(#gdr-clip)">
        <rect width="200" height="200" fill="url(#gdr-dots)" />
        <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" stroke-opacity="0.4" />
        <ellipse cx="100" cy="76" rx="74" ry="13" fill="none" stroke="currentColor" stroke-opacity="0.3" />
        <ellipse cx="100" cy="124" rx="74" ry="13" fill="none" stroke="currentColor" stroke-opacity="0.3" />
        <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
        <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
      </g>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.55" />
    </svg>
    <div class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.55),transparent_55%)]"></div>
  </div>

  <div class="max-w-md">
    <h3 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Global by default</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Edge nodes in 34 regions keep every request close to home.</p>
  </div>
</div>`,
      react: `const GDR_KEYFRAMES = \`
  @keyframes gdr-spin { to { transform: rotate(1turn); } }
\`;

export function GlobeDottedRotating({ heading, copy, size = 240, className = '' }) {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      {/* Keyframes travel with the component - nothing to add to a global sheet. */}
      <style>{GDR_KEYFRAMES}</style>

      <div className="relative shrink-0" style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-blue-600/60 animate-[gdr-spin_32s_linear_infinite] motion-reduce:animate-none dark:text-blue-400/60">
          <defs>
            <pattern id="gdr-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gdr-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gdr-clip)">
            <rect width="200" height="200" fill="url(#gdr-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="76" rx="74" ry="13" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="124" rx="74" ry="13" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        {/* Fixed highlight on top of the spinning body - the light stays put. */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GDR_KEYFRAMES = \`
  @keyframes gdr-spin { to { transform: rotate(1turn); } }
\`;

export interface GlobeDottedRotatingProps {
  heading?: ReactNode;
  copy?: string;
  /** Pixel diameter of the globe. Capped at 100% so it never overflows. */
  size?: number;
  className?: string;
}

export function GlobeDottedRotating({
  heading,
  copy,
  size = 240,
  className = '',
}: GlobeDottedRotatingProps): JSX.Element {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GDR_KEYFRAMES}</style>

      <div className="relative shrink-0" style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-blue-600/60 animate-[gdr-spin_32s_linear_infinite] motion-reduce:animate-none dark:text-blue-400/60">
          <defs>
            <pattern id="gdr-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gdr-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gdr-clip)">
            <rect width="200" height="200" fill="url(#gdr-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="76" rx="74" ry="13" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="124" rx="74" ry="13" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'globe-wireframe-sphere',
    category: 'globes',
    tags: ['globe', 'wireframe', 'sphere', 'svg', 'latitude'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1890, copies: 540, downloads: 141 },
    props: [
      { name: 'heading', type: 'ReactNode', descriptionKey: 'heading' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'size', type: 'number', default: '240', descriptionKey: 'size' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  No dots - just the wireframe: perspective parallels (rx wide, ry thin) and
  meridians (rx narrowing, ry full). The rx/ry pairs *are* the illusion; change
  them and the sphere flattens into a target. aria-hidden decoration.
-->
<style>
  @keyframes gws-spin { to { transform: rotate(1turn); } }
</style>

<div class="flex w-full flex-col items-center gap-6 px-4 py-8 text-center">
  <div class="relative shrink-0" style="width:240px;height:240px;max-width:100%" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-indigo-600/70 [animation:gws-spin_40s_linear_infinite] motion-reduce:[animation:none] dark:text-indigo-400/70">
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.6" />
      <ellipse cx="100" cy="100" rx="92" ry="22" fill="none" stroke="currentColor" stroke-opacity="0.45" />
      <ellipse cx="100" cy="66" rx="66" ry="12" fill="none" stroke="currentColor" stroke-opacity="0.35" />
      <ellipse cx="100" cy="134" rx="66" ry="12" fill="none" stroke="currentColor" stroke-opacity="0.35" />
      <ellipse cx="100" cy="42" rx="36" ry="7" fill="none" stroke="currentColor" stroke-opacity="0.28" />
      <ellipse cx="100" cy="158" rx="36" ry="7" fill="none" stroke="currentColor" stroke-opacity="0.28" />
      <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.35" />
      <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
      <line x1="100" y1="8" x2="100" y2="192" stroke="currentColor" stroke-opacity="0.4" />
    </svg>
    <div class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_30%,rgba(129,140,248,0.28),transparent_60%)]"></div>
  </div>

  <div class="max-w-md">
    <h3 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Mapped end to end</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">A clean latitude and longitude grid, drawn entirely in SVG.</p>
  </div>
</div>`,
      react: `const GWS_KEYFRAMES = \`
  @keyframes gws-spin { to { transform: rotate(1turn); } }
\`;

export function GlobeWireframeSphere({ heading, copy, size = 240, className = '' }) {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GWS_KEYFRAMES}</style>

      <div className="relative shrink-0" style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-indigo-600/70 animate-[gws-spin_40s_linear_infinite] motion-reduce:animate-none dark:text-indigo-400/70">
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.6" />
          <ellipse cx="100" cy="100" rx="92" ry="22" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <ellipse cx="100" cy="66" rx="66" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="134" rx="66" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="42" rx="36" ry="7" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <ellipse cx="100" cy="158" rx="36" ry="7" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="currentColor" strokeOpacity="0.4" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_30%,rgba(129,140,248,0.28),transparent_60%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GWS_KEYFRAMES = \`
  @keyframes gws-spin { to { transform: rotate(1turn); } }
\`;

export interface GlobeWireframeSphereProps {
  heading?: ReactNode;
  copy?: string;
  size?: number;
  className?: string;
}

export function GlobeWireframeSphere({
  heading,
  copy,
  size = 240,
  className = '',
}: GlobeWireframeSphereProps): JSX.Element {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GWS_KEYFRAMES}</style>

      <div className="relative shrink-0" style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-indigo-600/70 animate-[gws-spin_40s_linear_infinite] motion-reduce:animate-none dark:text-indigo-400/70">
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.6" />
          <ellipse cx="100" cy="100" rx="92" ry="22" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <ellipse cx="100" cy="66" rx="66" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="134" rx="66" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="42" rx="36" ry="7" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <ellipse cx="100" cy="158" rx="36" ry="7" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="currentColor" strokeOpacity="0.4" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_30%,rgba(129,140,248,0.28),transparent_60%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'globe-connections-arcs',
    category: 'globes',
    tags: ['globe', 'arcs', 'connections', 'pings', 'interactive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 3260, copies: 902, downloads: 244 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'interactive', labelKey: 'interactive' },
    ],
    props: [
      { name: 'points', type: 'GlobePoint[]', required: true, descriptionKey: 'points' },
      { name: 'caption', type: 'string', descriptionKey: 'caption' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two layers over the globe: decorative arcs drawn in the SVG (stroke-dashoffset
  animates them "flowing"), and real <button> location pings on top. The arcs
  are aria-hidden; the pings are focusable buttons with accessible names, because
  a marker a sighted user can hover must be reachable by keyboard too.
-->
<style>
  @keyframes gca-draw { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
</style>

<figure class="mx-auto flex w-full max-w-sm flex-col items-center gap-5 px-4 py-8">
  <div class="relative aspect-square w-full max-w-[280px]">
    <svg viewBox="0 0 200 200" class="h-full w-full text-sky-600/60 dark:text-sky-400/60" aria-hidden="true">
      <defs>
        <pattern id="gca-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.2" fill="currentColor" />
        </pattern>
        <clipPath id="gca-clip"><circle cx="100" cy="100" r="90" /></clipPath>
      </defs>
      <g clip-path="url(#gca-clip)">
        <rect width="200" height="200" fill="url(#gca-dots)" />
      </g>
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-opacity="0.5" />
      <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="260" class="[animation:gca-draw_3.5s_ease-in-out_infinite] motion-reduce:[animation:none]">
        <path d="M58 132 Q100 40 150 92" />
        <path d="M58 132 Q70 70 118 58" />
      </g>
    </svg>

    <button type="button" class="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950" style="left:29%;top:66%">
      <span class="absolute h-3 w-3 animate-ping rounded-full bg-sky-400/70 motion-reduce:hidden"></span>
      <span class="relative h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-gray-950"></span>
      <span class="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">San Francisco</span>
    </button>
    <button type="button" class="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950" style="left:75%;top:46%">
      <span class="absolute h-3 w-3 animate-ping rounded-full bg-sky-400/70 motion-reduce:hidden"></span>
      <span class="relative h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-gray-950"></span>
      <span class="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">London</span>
    </button>
    <button type="button" class="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950" style="left:59%;top:29%">
      <span class="absolute h-3 w-3 animate-ping rounded-full bg-sky-400/70 motion-reduce:hidden"></span>
      <span class="relative h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-gray-950"></span>
      <span class="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">Berlin</span>
    </button>
  </div>
  <figcaption class="text-center text-sm text-gray-600 dark:text-gray-400">Live traffic across 3 regions</figcaption>
</figure>`,
      react: `const GCA_KEYFRAMES = \`
  @keyframes gca-draw { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
\`;

export function GlobeConnectionsArcs({ points, caption, className = '' }) {
  return (
    <figure className={\`mx-auto flex w-full max-w-sm flex-col items-center gap-5 px-4 py-8 \${className}\`}>
      <style>{GCA_KEYFRAMES}</style>
      <div className="relative aspect-square w-full max-w-[280px]">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-600/60 dark:text-sky-400/60" aria-hidden="true">
          <defs>
            <pattern id="gca-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.2" fill="currentColor" />
            </pattern>
            <clipPath id="gca-clip"><circle cx="100" cy="100" r="90" /></clipPath>
          </defs>
          <g clipPath="url(#gca-clip)">
            <rect width="200" height="200" fill="url(#gca-dots)" />
          </g>
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeOpacity="0.5" />
          {/* Arcs "flow" via stroke-dashoffset - decorative, so aria-hidden with the svg. */}
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="260" className="animate-[gca-draw_3.5s_ease-in-out_infinite] motion-reduce:animate-none">
            <path d="M58 132 Q100 40 150 92" />
            <path d="M58 132 Q70 70 118 58" />
          </g>
        </svg>

        {points.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-label={p.label}
            className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            style={{ left: \`\${p.x}%\`, top: \`\${p.y}%\` }}
          >
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-sky-400/70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-gray-950" />
            <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {p.label}
            </span>
          </button>
        ))}
      </div>
      {caption ? <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption> : null}
    </figure>
  );
}`,
      typescript: `const GCA_KEYFRAMES = \`
  @keyframes gca-draw { from { stroke-dashoffset: 260; } to { stroke-dashoffset: 0; } }
\`;

export interface GlobePoint {
  label: string;
  /** Position over the globe box, in percent (0-100). */
  x: number;
  y: number;
}

export interface GlobeConnectionsArcsProps {
  points: GlobePoint[];
  caption?: string;
  className?: string;
}

export function GlobeConnectionsArcs({
  points,
  caption,
  className = '',
}: GlobeConnectionsArcsProps): JSX.Element {
  return (
    <figure className={\`mx-auto flex w-full max-w-sm flex-col items-center gap-5 px-4 py-8 \${className}\`}>
      <style>{GCA_KEYFRAMES}</style>
      <div className="relative aspect-square w-full max-w-[280px]">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-600/60 dark:text-sky-400/60" aria-hidden="true">
          <defs>
            <pattern id="gca-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.2" fill="currentColor" />
            </pattern>
            <clipPath id="gca-clip"><circle cx="100" cy="100" r="90" /></clipPath>
          </defs>
          <g clipPath="url(#gca-clip)">
            <rect width="200" height="200" fill="url(#gca-dots)" />
          </g>
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeOpacity="0.5" />
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="260" className="animate-[gca-draw_3.5s_ease-in-out_infinite] motion-reduce:animate-none">
            <path d="M58 132 Q100 40 150 92" />
            <path d="M58 132 Q70 70 118 58" />
          </g>
        </svg>

        {points.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-label={p.label}
            className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
            style={{ left: \`\${p.x}%\`, top: \`\${p.y}%\` }}
          >
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-sky-400/70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-gray-950" />
            <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {p.label}
            </span>
          </button>
        ))}
      </div>
      {caption ? <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption> : null}
    </figure>
  );
}`,
    },
  },
  {
    slug: 'globe-hero-split',
    category: 'globes',
    tags: ['globe', 'hero', 'split', 'two-column', 'cta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 2980, copies: 831, downloads: 210 },
    props: [
      { name: 'title', type: 'ReactNode', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Start shipping'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
    ],
    code: {
      tailwind: `<!--
  Copy first in the DOM, globe second: on mobile the columns stack in reading
  order so the headline is read before a decorative sphere. The globe column is
  hidden from assistive tech - it is illustration, not content.
-->
<style>
  @keyframes ghs-spin { to { transform: rotate(1turn); } }
</style>

<section class="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">Global infrastructure</p>
    <h1 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">Ship to every region at once</h1>
    <p class="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">One deploy, replicated to the edge worldwide. No regions to wire up, no latency to babysit.</p>
    <a href="#" class="mt-6 inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-gray-900">Start shipping</a>
  </div>

  <div class="relative mx-auto aspect-square w-full max-w-[320px]" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-sky-600/60 [animation:ghs-spin_36s_linear_infinite] motion-reduce:[animation:none] dark:text-sky-400/60">
      <defs>
        <pattern id="ghs-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
        </pattern>
        <clipPath id="ghs-clip"><circle cx="100" cy="100" r="92" /></clipPath>
      </defs>
      <g clip-path="url(#ghs-clip)">
        <rect width="200" height="200" fill="url(#ghs-dots)" />
        <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" stroke-opacity="0.4" />
        <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
        <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
      </g>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.55" />
    </svg>
    <div class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]"></div>
  </div>
</section>`,
      react: `const GHS_KEYFRAMES = \`
  @keyframes ghs-spin { to { transform: rotate(1turn); } }
\`;

export function GlobeHeroSplit({ title, copy, ctaLabel = 'Start shipping', ctaHref = '#' }) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <style>{GHS_KEYFRAMES}</style>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">Global infrastructure</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">{title}</h1>
        {copy ? <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        <a href={ctaHref} className="mt-6 inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[320px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-600/60 animate-[ghs-spin_36s_linear_infinite] motion-reduce:animate-none dark:text-sky-400/60">
          <defs>
            <pattern id="ghs-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="ghs-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#ghs-clip)">
            <rect width="200" height="200" fill="url(#ghs-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GHS_KEYFRAMES = \`
  @keyframes ghs-spin { to { transform: rotate(1turn); } }
\`;

export interface GlobeHeroSplitProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function GlobeHeroSplit({
  title,
  copy,
  ctaLabel = 'Start shipping',
  ctaHref = '#',
}: GlobeHeroSplitProps): JSX.Element {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <style>{GHS_KEYFRAMES}</style>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">Global infrastructure</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">{title}</h1>
        {copy ? <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        <a href={ctaHref} className="mt-6 inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[320px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-600/60 animate-[ghs-spin_36s_linear_infinite] motion-reduce:animate-none dark:text-sky-400/60">
          <defs>
            <pattern id="ghs-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="ghs-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#ghs-clip)">
            <rect width="200" height="200" fill="url(#ghs-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'globe-stats-overlay',
    category: 'globes',
    tags: ['globe', 'stats', 'kpi', 'badges', 'metrics'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2410, copies: 674, downloads: 173 },
    props: [
      { name: 'stats', type: 'GlobeStat[]', required: true, descriptionKey: 'stats' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  KPI badges float around a spinning globe. The badges are real content (a <dl>
  each) and sit outside the aria-hidden globe, so a screen reader reads the
  numbers and skips the decoration. They overlap the globe on wide screens and
  drop below it on phones - absolute positioning only kicks in at sm:.
-->
<style>
  @keyframes gso-spin { to { transform: rotate(1turn); } }
</style>

<div class="mx-auto w-full max-w-md px-4 py-8">
  <div class="relative mx-auto aspect-square w-full max-w-[260px]" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-emerald-600/55 [animation:gso-spin_34s_linear_infinite] motion-reduce:[animation:none] dark:text-emerald-400/55">
      <defs>
        <pattern id="gso-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
        </pattern>
        <clipPath id="gso-clip"><circle cx="100" cy="100" r="92" /></clipPath>
      </defs>
      <g clip-path="url(#gso-clip)">
        <rect width="200" height="200" fill="url(#gso-dots)" />
        <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" stroke-opacity="0.4" />
        <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
      </g>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.5" />
    </svg>
    <div class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]"></div>
  </div>

  <div class="mt-6 flex flex-wrap justify-center gap-3 sm:mt-0 sm:block">
    <dl class="rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur sm:absolute sm:left-2 sm:top-8 dark:border-gray-800 dark:bg-gray-900/90">
      <dt class="text-lg font-bold text-gray-900 dark:text-gray-100">99.99%</dt>
      <dd class="text-xs text-gray-500 dark:text-gray-400">Uptime</dd>
    </dl>
    <dl class="rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur sm:absolute sm:right-2 sm:top-16 dark:border-gray-800 dark:bg-gray-900/90">
      <dt class="text-lg font-bold text-gray-900 dark:text-gray-100">34</dt>
      <dd class="text-xs text-gray-500 dark:text-gray-400">Regions</dd>
    </dl>
    <dl class="rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur sm:absolute sm:bottom-8 sm:left-8 dark:border-gray-800 dark:bg-gray-900/90">
      <dt class="text-lg font-bold text-gray-900 dark:text-gray-100">28ms</dt>
      <dd class="text-xs text-gray-500 dark:text-gray-400">p50 latency</dd>
    </dl>
  </div>
</div>`,
      react: `const GSO_KEYFRAMES = \`
  @keyframes gso-spin { to { transform: rotate(1turn); } }
\`;

const POS = ['sm:absolute sm:left-2 sm:top-8', 'sm:absolute sm:right-2 sm:top-16', 'sm:absolute sm:bottom-8 sm:left-8', 'sm:absolute sm:bottom-6 sm:right-6'];

export function GlobeStatsOverlay({ stats, className = '' }) {
  return (
    <div className={\`mx-auto w-full max-w-md px-4 py-8 \${className}\`}>
      <style>{GSO_KEYFRAMES}</style>
      <div className="relative mx-auto aspect-square w-full max-w-[260px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-emerald-600/55 animate-[gso-spin_34s_linear_infinite] motion-reduce:animate-none dark:text-emerald-400/55">
          <defs>
            <pattern id="gso-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gso-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gso-clip)">
            <rect width="200" height="200" fill="url(#gso-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>

      <div className="relative mt-6 flex flex-wrap justify-center gap-3 sm:mt-0 sm:block">
        {stats.slice(0, 4).map((s, i) => (
          <dl key={s.label} className={\`rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 \${POS[i] ?? ''}\`}>
            <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.value}</dt>
            <dd className="text-xs text-gray-500 dark:text-gray-400">{s.label}</dd>
          </dl>
        ))}
      </div>
    </div>
  );
}`,
      typescript: `const GSO_KEYFRAMES = \`
  @keyframes gso-spin { to { transform: rotate(1turn); } }
\`;

// Up to four anchor positions; extra stats fall back to the in-flow wrap layout.
const POS = [
  'sm:absolute sm:left-2 sm:top-8',
  'sm:absolute sm:right-2 sm:top-16',
  'sm:absolute sm:bottom-8 sm:left-8',
  'sm:absolute sm:bottom-6 sm:right-6',
] as const;

export interface GlobeStat {
  value: string;
  label: string;
}

export interface GlobeStatsOverlayProps {
  stats: GlobeStat[];
  className?: string;
}

export function GlobeStatsOverlay({ stats, className = '' }: GlobeStatsOverlayProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-md px-4 py-8 \${className}\`}>
      <style>{GSO_KEYFRAMES}</style>
      <div className="relative mx-auto aspect-square w-full max-w-[260px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-emerald-600/55 animate-[gso-spin_34s_linear_infinite] motion-reduce:animate-none dark:text-emerald-400/55">
          <defs>
            <pattern id="gso-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gso-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gso-clip)">
            <rect width="200" height="200" fill="url(#gso-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>

      <div className="relative mt-6 flex flex-wrap justify-center gap-3 sm:mt-0 sm:block">
        {stats.slice(0, 4).map((s, i) => (
          <dl key={s.label} className={\`rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-center shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 \${POS[i] ?? ''}\`}>
            <dt className="text-lg font-bold text-gray-900 dark:text-gray-100">{s.value}</dt>
            <dd className="text-xs text-gray-500 dark:text-gray-400">{s.label}</dd>
          </dl>
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'globe-network-nodes',
    category: 'globes',
    tags: ['globe', 'network', 'nodes', 'mesh', 'pulse'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2050, copies: 571, downloads: 149 },
    props: [
      { name: 'heading', type: 'ReactNode', descriptionKey: 'heading' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A mesh laid over the globe: static links in one <g>, nodes that twinkle via
  staggered opacity keyframes in another. All of it is one aria-hidden SVG - it
  is an abstract diagram, not data, so it stays out of the a11y tree.
-->
<style>
  @keyframes gnn-spin { to { transform: rotate(1turn); } }
  @keyframes gnn-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
</style>

<div class="flex w-full flex-col items-center gap-6 px-4 py-8 text-center">
  <div class="relative shrink-0" style="width:250px;height:250px;max-width:100%" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-violet-600/70 dark:text-violet-400/70">
      <defs>
        <clipPath id="gnn-clip"><circle cx="100" cy="100" r="92" /></clipPath>
      </defs>
      <g class="[animation:gnn-spin_44s_linear_infinite] motion-reduce:[animation:none]" style="transform-origin:100px 100px">
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.4" />
        <ellipse cx="100" cy="100" rx="92" ry="24" fill="none" stroke="currentColor" stroke-opacity="0.25" />
        <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.2" />
        <g clip-path="url(#gnn-clip)" stroke="currentColor" stroke-opacity="0.4" stroke-width="1">
          <line x1="52" y1="70" x2="120" y2="52" />
          <line x1="120" y1="52" x2="150" y2="112" />
          <line x1="150" y1="112" x2="96" y2="150" />
          <line x1="96" y1="150" x2="52" y2="70" />
          <line x1="120" y1="52" x2="96" y2="150" />
        </g>
        <g fill="currentColor">
          <circle cx="52" cy="70" r="4" style="animation:gnn-pulse 2.4s ease-in-out infinite" />
          <circle cx="120" cy="52" r="4" style="animation:gnn-pulse 2.4s ease-in-out 0.5s infinite" />
          <circle cx="150" cy="112" r="4" style="animation:gnn-pulse 2.4s ease-in-out 1s infinite" />
          <circle cx="96" cy="150" r="4" style="animation:gnn-pulse 2.4s ease-in-out 1.5s infinite" />
        </g>
      </g>
    </svg>
    <div class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(167,139,250,0.28),transparent_60%)]"></div>
  </div>

  <div class="max-w-md">
    <h3 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">One connected mesh</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Nodes sync peer to peer, so a region can drop without a blip.</p>
  </div>
</div>`,
      react: `const GNN_KEYFRAMES = \`
  @keyframes gnn-spin { to { transform: rotate(1turn); } }
  @keyframes gnn-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
\`;

export function GlobeNetworkNodes({ heading, copy, className = '' }) {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GNN_KEYFRAMES}</style>
      <div className="relative shrink-0" style={{ width: 250, height: 250, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-violet-600/70 dark:text-violet-400/70">
          <defs>
            <clipPath id="gnn-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g className="animate-[gnn-spin_44s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="92" ry="24" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.2" />
            <g clipPath="url(#gnn-clip)" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1">
              <line x1="52" y1="70" x2="120" y2="52" />
              <line x1="120" y1="52" x2="150" y2="112" />
              <line x1="150" y1="112" x2="96" y2="150" />
              <line x1="96" y1="150" x2="52" y2="70" />
              <line x1="120" y1="52" x2="96" y2="150" />
            </g>
            <g fill="currentColor">
              <circle cx="52" cy="70" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out infinite' }} />
              <circle cx="120" cy="52" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 0.5s infinite' }} />
              <circle cx="150" cy="112" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 1s infinite' }} />
              <circle cx="96" cy="150" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 1.5s infinite' }} />
            </g>
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(167,139,250,0.28),transparent_60%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GNN_KEYFRAMES = \`
  @keyframes gnn-spin { to { transform: rotate(1turn); } }
  @keyframes gnn-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
\`;

export interface GlobeNetworkNodesProps {
  heading?: ReactNode;
  copy?: string;
  className?: string;
}

export function GlobeNetworkNodes({ heading, copy, className = '' }: GlobeNetworkNodesProps): JSX.Element {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GNN_KEYFRAMES}</style>
      <div className="relative shrink-0" style={{ width: 250, height: 250, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-violet-600/70 dark:text-violet-400/70">
          <defs>
            <clipPath id="gnn-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g className="animate-[gnn-spin_44s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="92" ry="24" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.2" />
            <g clipPath="url(#gnn-clip)" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1">
              <line x1="52" y1="70" x2="120" y2="52" />
              <line x1="120" y1="52" x2="150" y2="112" />
              <line x1="150" y1="112" x2="96" y2="150" />
              <line x1="96" y1="150" x2="52" y2="70" />
              <line x1="120" y1="52" x2="96" y2="150" />
            </g>
            <g fill="currentColor">
              <circle cx="52" cy="70" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out infinite' }} />
              <circle cx="120" cy="52" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 0.5s infinite' }} />
              <circle cx="150" cy="112" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 1s infinite' }} />
              <circle cx="96" cy="150" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 1.5s infinite' }} />
            </g>
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(167,139,250,0.28),transparent_60%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'globe-dark-glow',
    category: 'globes',
    tags: ['globe', 'dark', 'glow', 'radial', 'ambient'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2620, copies: 743, downloads: 191 },
    props: [
      { name: 'heading', type: 'ReactNode', descriptionKey: 'heading' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The section paints its own near-black surface and its own glow, so it looks
  identical on a light or dark page - there is no dark: variant here, nothing
  inherits the theme. The glow pulses on opacity only (compositor-cheap).
-->
<style>
  @keyframes gdg-spin { to { transform: rotate(1turn); } }
  @keyframes gdg-glow { 0%,100% { opacity: 0.55; } 50% { opacity: 0.9; } }
</style>

<section class="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-14 text-center sm:py-16">
  <div class="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/40 blur-3xl [animation:gdg-glow_6s_ease-in-out_infinite] motion-reduce:[animation:none]" aria-hidden="true"></div>

  <div class="relative mx-auto aspect-square w-full max-w-[220px]" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-sky-400/70 [animation:gdg-spin_38s_linear_infinite] motion-reduce:[animation:none]">
      <defs>
        <pattern id="gdg-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
        </pattern>
        <clipPath id="gdg-clip"><circle cx="100" cy="100" r="92" /></clipPath>
      </defs>
      <g clip-path="url(#gdg-clip)">
        <rect width="200" height="200" fill="url(#gdg-dots)" />
        <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" stroke-opacity="0.4" />
        <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
      </g>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.55" />
    </svg>
    <div class="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.35),transparent_55%)]"></div>
  </div>

  <h3 class="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">Always on, everywhere</h3>
  <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300">A quiet planet in the dark - the glow does the talking.</p>
</section>`,
      react: `const GDG_KEYFRAMES = \`
  @keyframes gdg-spin { to { transform: rotate(1turn); } }
  @keyframes gdg-glow { 0%,100% { opacity: 0.55; } 50% { opacity: 0.9; } }
\`;

export function GlobeDarkGlow({ heading, copy, className = '' }) {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-14 text-center sm:py-16 \${className}\`}>
      <style>{GDG_KEYFRAMES}</style>
      <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/40 blur-3xl animate-[gdg-glow_6s_ease-in-out_infinite] motion-reduce:animate-none" aria-hidden="true" />

      <div className="relative mx-auto aspect-square w-full max-w-[220px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-400/70 animate-[gdg-spin_38s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <pattern id="gdg-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gdg-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gdg-clip)">
            <rect width="200" height="200" fill="url(#gdg-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.35),transparent_55%)]" />
      </div>

      {heading ? <h3 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">{heading}</h3> : null}
      {copy ? <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300">{copy}</p> : null}
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GDG_KEYFRAMES = \`
  @keyframes gdg-spin { to { transform: rotate(1turn); } }
  @keyframes gdg-glow { 0%,100% { opacity: 0.55; } 50% { opacity: 0.9; } }
\`;

export interface GlobeDarkGlowProps {
  heading?: ReactNode;
  copy?: string;
  className?: string;
}

export function GlobeDarkGlow({ heading, copy, className = '' }: GlobeDarkGlowProps): JSX.Element {
  return (
    <section className={\`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-14 text-center sm:py-16 \${className}\`}>
      <style>{GDG_KEYFRAMES}</style>
      <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/40 blur-3xl animate-[gdg-glow_6s_ease-in-out_infinite] motion-reduce:animate-none" aria-hidden="true" />

      <div className="relative mx-auto aspect-square w-full max-w-[220px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-400/70 animate-[gdg-spin_38s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <pattern id="gdg-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gdg-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gdg-clip)">
            <rect width="200" height="200" fill="url(#gdg-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.35),transparent_55%)]" />
      </div>

      {heading ? <h3 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">{heading}</h3> : null}
      {copy ? <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300">{copy}</p> : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'globe-orbit-rings',
    category: 'globes',
    tags: ['globe', 'orbit', 'rings', 'satellite', 'spin'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2330, copies: 651, downloads: 168 },
    props: [
      { name: 'heading', type: 'ReactNode', descriptionKey: 'heading' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Three tilted orbit rings around a small globe, each spinning at its own speed.
  A ring is one rotated <g> of an ellipse plus a satellite dot; spinning the <g>
  sweeps the dot around the tilted ring. All aria-hidden decoration.
-->
<style>
  @keyframes gor-core { to { transform: rotate(1turn); } }
  @keyframes gor-spin { to { transform: rotate(1turn); } }
</style>

<div class="flex w-full flex-col items-center gap-6 px-4 py-8 text-center">
  <div class="relative shrink-0" style="width:250px;height:250px;max-width:100%" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full">
      <g class="text-amber-600/70 dark:text-amber-400/70">
        <g class="[animation:gor-core_30s_linear_infinite] motion-reduce:[animation:none]" style="transform-origin:100px 100px">
          <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" stroke-opacity="0.5" />
          <ellipse cx="100" cy="100" rx="34" ry="10" fill="none" stroke="currentColor" stroke-opacity="0.35" />
          <ellipse cx="100" cy="100" rx="12" ry="34" fill="none" stroke="currentColor" stroke-opacity="0.35" />
        </g>
      </g>
      <g class="text-sky-500/70" style="transform-origin:100px 100px;transform:rotate(0deg)">
        <g class="[animation:gor-spin_7s_linear_infinite] motion-reduce:[animation:none]" style="transform-origin:100px 100px">
          <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" stroke-opacity="0.6" />
          <circle cx="180" cy="100" r="4" fill="currentColor" />
        </g>
      </g>
      <g class="text-violet-500/70" style="transform-origin:100px 100px;transform:rotate(60deg)">
        <g class="[animation:gor-spin_11s_linear_infinite_reverse] motion-reduce:[animation:none]" style="transform-origin:100px 100px">
          <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" stroke-opacity="0.55" />
          <circle cx="10" cy="100" r="4" fill="currentColor" />
        </g>
      </g>
      <g class="text-emerald-500/70" style="transform-origin:100px 100px;transform:rotate(120deg)">
        <g class="[animation:gor-spin_15s_linear_infinite] motion-reduce:[animation:none]" style="transform-origin:100px 100px">
          <ellipse cx="100" cy="100" rx="72" ry="26" fill="none" stroke="currentColor" stroke-opacity="0.5" />
          <circle cx="172" cy="100" r="3.5" fill="currentColor" />
        </g>
      </g>
    </svg>
  </div>

  <div class="max-w-md">
    <h3 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">In constant orbit</h3>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Three rings, three speeds - satellites sweeping a tilted plane.</p>
  </div>
</div>`,
      react: `const GOR_KEYFRAMES = \`
  @keyframes gor-core { to { transform: rotate(1turn); } }
  @keyframes gor-spin { to { transform: rotate(1turn); } }
\`;

export function GlobeOrbitRings({ heading, copy, className = '' }) {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GOR_KEYFRAMES}</style>
      <div className="relative shrink-0" style={{ width: 250, height: 250, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g className="text-amber-600/70 dark:text-amber-400/70">
            <g className="animate-[gor-core_30s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeOpacity="0.5" />
              <ellipse cx="100" cy="100" rx="34" ry="10" fill="none" stroke="currentColor" strokeOpacity="0.35" />
              <ellipse cx="100" cy="100" rx="12" ry="34" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            </g>
          </g>
          {/* Each ring: an outer <g> holds the tilt, an inner <g> does the spin. */}
          <g className="text-sky-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(0deg)' }}>
            <g className="animate-[gor-spin_7s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" strokeOpacity="0.6" />
              <circle cx="180" cy="100" r="4" fill="currentColor" />
            </g>
          </g>
          <g className="text-violet-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(60deg)' }}>
            <g className="animate-[gor-spin_11s_linear_infinite_reverse] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" strokeOpacity="0.55" />
              <circle cx="10" cy="100" r="4" fill="currentColor" />
            </g>
          </g>
          <g className="text-emerald-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(120deg)' }}>
            <g className="animate-[gor-spin_15s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="72" ry="26" fill="none" stroke="currentColor" strokeOpacity="0.5" />
              <circle cx="172" cy="100" r="3.5" fill="currentColor" />
            </g>
          </g>
        </svg>
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GOR_KEYFRAMES = \`
  @keyframes gor-core { to { transform: rotate(1turn); } }
  @keyframes gor-spin { to { transform: rotate(1turn); } }
\`;

export interface GlobeOrbitRingsProps {
  heading?: ReactNode;
  copy?: string;
  className?: string;
}

export function GlobeOrbitRings({ heading, copy, className = '' }: GlobeOrbitRingsProps): JSX.Element {
  return (
    <div className={\`flex w-full flex-col items-center gap-6 px-4 py-8 text-center \${className}\`}>
      <style>{GOR_KEYFRAMES}</style>
      <div className="relative shrink-0" style={{ width: 250, height: 250, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g className="text-amber-600/70 dark:text-amber-400/70">
            <g className="animate-[gor-core_30s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeOpacity="0.5" />
              <ellipse cx="100" cy="100" rx="34" ry="10" fill="none" stroke="currentColor" strokeOpacity="0.35" />
              <ellipse cx="100" cy="100" rx="12" ry="34" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            </g>
          </g>
          <g className="text-sky-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(0deg)' }}>
            <g className="animate-[gor-spin_7s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" strokeOpacity="0.6" />
              <circle cx="180" cy="100" r="4" fill="currentColor" />
            </g>
          </g>
          <g className="text-violet-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(60deg)' }}>
            <g className="animate-[gor-spin_11s_linear_infinite_reverse] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" strokeOpacity="0.55" />
              <circle cx="10" cy="100" r="4" fill="currentColor" />
            </g>
          </g>
          <g className="text-emerald-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(120deg)' }}>
            <g className="animate-[gor-spin_15s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="72" ry="26" fill="none" stroke="currentColor" strokeOpacity="0.5" />
              <circle cx="172" cy="100" r="3.5" fill="currentColor" />
            </g>
          </g>
        </svg>
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'globe-flat-world-dots',
    category: 'globes',
    tags: ['globe', 'map', 'flat', 'dots', 'locations'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2870, copies: 796, downloads: 214 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'interactive', labelKey: 'interactive' },
    ],
    props: [
      { name: 'markers', type: 'MapMarker[]', required: true, descriptionKey: 'markers' },
      { name: 'caption', type: 'string', descriptionKey: 'caption' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A flat dot-map: stylised continents are paths filled with an SVG dot pattern
  (the map is decorative, aria-hidden). Locations on top are real <button>s with
  accessible names and a pulsing ping - hoverable *and* keyboard reachable.
-->
<figure class="mx-auto w-full max-w-lg px-4 py-8">
  <div class="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
    <svg viewBox="0 0 320 170" class="block w-full text-slate-400/70 dark:text-slate-500/70" aria-hidden="true">
      <defs>
        <pattern id="gfw-dots" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <g fill="url(#gfw-dots)">
        <path d="M60 30 C80 25 90 45 85 65 C95 80 80 120 62 130 C50 138 40 120 44 100 C36 80 45 45 60 30 Z" />
        <path d="M150 35 C170 30 180 50 172 68 C185 85 175 125 158 135 C146 140 140 120 146 100 C138 78 138 48 150 35 Z" />
        <path d="M210 40 C245 30 285 45 288 62 C292 80 265 92 240 88 C220 92 200 70 210 40 Z" />
        <path d="M250 108 C266 104 276 118 268 128 C258 136 244 130 246 118 Z" />
      </g>
    </svg>

    <button type="button" class="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900" style="left:20%;top:48%">
      <span class="absolute h-3 w-3 animate-ping rounded-full bg-rose-400/70 motion-reduce:hidden"></span>
      <span class="relative h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900"></span>
      <span class="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">São Paulo</span>
    </button>
    <button type="button" class="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900" style="left:51%;top:34%">
      <span class="absolute h-3 w-3 animate-ping rounded-full bg-rose-400/70 motion-reduce:hidden"></span>
      <span class="relative h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900"></span>
      <span class="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">Lagos</span>
    </button>
    <button type="button" class="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900" style="left:80%;top:38%">
      <span class="absolute h-3 w-3 animate-ping rounded-full bg-rose-400/70 motion-reduce:hidden"></span>
      <span class="relative h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900"></span>
      <span class="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">Singapore</span>
    </button>
  </div>
  <figcaption class="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">3 active regions</figcaption>
</figure>`,
      react: `export function GlobeFlatWorldDots({ markers, caption, className = '' }) {
  return (
    <figure className={\`mx-auto w-full max-w-lg px-4 py-8 \${className}\`}>
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
        <svg viewBox="0 0 320 170" className="block w-full text-slate-400/70 dark:text-slate-500/70" aria-hidden="true">
          <defs>
            <pattern id="gfw-dots" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="1.4" cy="1.4" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <g fill="url(#gfw-dots)">
            <path d="M60 30 C80 25 90 45 85 65 C95 80 80 120 62 130 C50 138 40 120 44 100 C36 80 45 45 60 30 Z" />
            <path d="M150 35 C170 30 180 50 172 68 C185 85 175 125 158 135 C146 140 140 120 146 100 C138 78 138 48 150 35 Z" />
            <path d="M210 40 C245 30 285 45 288 62 C292 80 265 92 240 88 C220 92 200 70 210 40 Z" />
            <path d="M250 108 C266 104 276 118 268 128 C258 136 244 130 246 118 Z" />
          </g>
        </svg>

        {markers.map((m) => (
          <button
            key={m.label}
            type="button"
            aria-label={m.label}
            className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900"
            style={{ left: \`\${m.x}%\`, top: \`\${m.y}%\` }}
          >
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-rose-400/70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
            <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {m.label}
            </span>
          </button>
        ))}
      </div>
      {caption ? <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption> : null}
    </figure>
  );
}`,
      typescript: `export interface MapMarker {
  label: string;
  /** Position over the map box, in percent (0-100). */
  x: number;
  y: number;
}

export interface GlobeFlatWorldDotsProps {
  markers: MapMarker[];
  caption?: string;
  className?: string;
}

export function GlobeFlatWorldDots({
  markers,
  caption,
  className = '',
}: GlobeFlatWorldDotsProps): JSX.Element {
  return (
    <figure className={\`mx-auto w-full max-w-lg px-4 py-8 \${className}\`}>
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
        <svg viewBox="0 0 320 170" className="block w-full text-slate-400/70 dark:text-slate-500/70" aria-hidden="true">
          <defs>
            <pattern id="gfw-dots" width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="1.4" cy="1.4" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <g fill="url(#gfw-dots)">
            <path d="M60 30 C80 25 90 45 85 65 C95 80 80 120 62 130 C50 138 40 120 44 100 C36 80 45 45 60 30 Z" />
            <path d="M150 35 C170 30 180 50 172 68 C185 85 175 125 158 135 C146 140 140 120 146 100 C138 78 138 48 150 35 Z" />
            <path d="M210 40 C245 30 285 45 288 62 C292 80 265 92 240 88 C220 92 200 70 210 40 Z" />
            <path d="M250 108 C266 104 276 118 268 128 C258 136 244 130 246 118 Z" />
          </g>
        </svg>

        {markers.map((m) => (
          <button
            key={m.label}
            type="button"
            aria-label={m.label}
            className="group absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900"
            style={{ left: \`\${m.x}%\`, top: \`\${m.y}%\` }}
          >
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-rose-400/70 motion-reduce:hidden" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900" />
            <span className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded bg-gray-900 px-1.5 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-gray-100 dark:text-gray-900">
              {m.label}
            </span>
          </button>
        ))}
      </div>
      {caption ? <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">{caption}</figcaption> : null}
    </figure>
  );
}`,
    },
  },
  {
    slug: 'globe-cta-band',
    category: 'globes',
    tags: ['globe', 'cta', 'band', 'conversion', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 2510, copies: 705, downloads: 182 },
    props: [
      { name: 'title', type: 'ReactNode', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Get started'", descriptionKey: 'ctaLabel' },
      { name: 'ctaHref', type: 'string', default: "'#'", descriptionKey: 'ctaHref' },
    ],
    code: {
      tailwind: `<!--
  A dark CTA band with a half-globe bleeding off the right edge as backdrop. The
  globe is aria-hidden and clipped by the band's overflow-hidden; the copy and
  button carry all the meaning. Stacks centered on phones, row on md+.
-->
<style>
  @keyframes gcb-spin { to { transform: rotate(1turn); } }
</style>

<section class="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-12 sm:px-10">
  <div class="absolute -right-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 opacity-70 sm:-right-8" aria-hidden="true">
    <svg viewBox="0 0 200 200" class="h-full w-full text-sky-400/60 [animation:gcb-spin_40s_linear_infinite] motion-reduce:[animation:none]">
      <defs>
        <pattern id="gcb-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
        </pattern>
        <clipPath id="gcb-clip"><circle cx="100" cy="100" r="92" /></clipPath>
      </defs>
      <g clip-path="url(#gcb-clip)">
        <rect width="200" height="200" fill="url(#gcb-dots)" />
        <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" stroke-opacity="0.4" />
        <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" stroke-opacity="0.3" />
      </g>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-opacity="0.5" />
    </svg>
  </div>

  <div class="flex max-w-xl flex-col items-start gap-5 text-left">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Deploy where your users are</h2>
      <p class="mt-2 text-sm leading-relaxed text-gray-300 sm:text-base">Spin up in 34 regions in a single command. No infra tickets, no waiting.</p>
    </div>
    <a href="#" class="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none">Get started</a>
  </div>
</section>`,
      react: `const GCB_KEYFRAMES = \`
  @keyframes gcb-spin { to { transform: rotate(1turn); } }
\`;

export function GlobeCtaBand({ title, copy, ctaLabel = 'Get started', ctaHref = '#' }) {
  return (
    <section className="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-12 sm:px-10">
      <style>{GCB_KEYFRAMES}</style>
      <div className="absolute -right-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 opacity-70 sm:-right-8" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-400/60 animate-[gcb-spin_40s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <pattern id="gcb-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gcb-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gcb-clip)">
            <rect width="200" height="200" fill="url(#gcb-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
      </div>

      <div className="flex max-w-xl flex-col items-start gap-5 text-left">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-300 sm:text-base">{copy}</p> : null}
        </div>
        <a href={ctaHref} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none">{ctaLabel}</a>
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

const GCB_KEYFRAMES = \`
  @keyframes gcb-spin { to { transform: rotate(1turn); } }
\`;

export interface GlobeCtaBandProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function GlobeCtaBand({
  title,
  copy,
  ctaLabel = 'Get started',
  ctaHref = '#',
}: GlobeCtaBandProps): JSX.Element {
  return (
    <section className="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-12 sm:px-10">
      <style>{GCB_KEYFRAMES}</style>
      <div className="absolute -right-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 opacity-70 sm:-right-8" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-400/60 animate-[gcb-spin_40s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <pattern id="gcb-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gcb-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gcb-clip)">
            <rect width="200" height="200" fill="url(#gcb-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
      </div>

      <div className="flex max-w-xl flex-col items-start gap-5 text-left">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-300 sm:text-base">{copy}</p> : null}
        </div>
        <a href={ctaHref} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none">{ctaLabel}</a>
      </div>
    </section>
  );
}`,
    },
  },
];
