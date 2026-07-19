import type { ComponentEntry } from './types';

/**
 * Progress category.
 *
 * Ten structurally different progress indicators, not ten recolours of one bar:
 * a labelled linear track, a circular SVG ring, a discrete segmented meter, an
 * animated striped fill, a stacked multi-category bar, a fundraising goal card,
 * a semicircular dashboard gauge, an inline micro-bar, a steps checklist, and a
 * thin indeterminate loader.
 *
 * One rule threads through all of them: a progress indicator is an ARIA widget
 * before it is a rectangle. Every *determinate* component here is a
 * `role="progressbar"` carrying `aria-valuenow/min/max` AND a visible text
 * percentage - the bar is for sighted users, the ARIA values are for everyone
 * else, and the two must never disagree. The single indeterminate component
 * (`progress-indeterminate-thin`) deliberately OMITS `aria-valuenow`, because in
 * ARIA an absent value is exactly how you say "unknown duration". The stacked
 * bar and its legend never lean on colour alone: every swatch is paired with a
 * text label and a number, so the breakdown survives a greyscale print.
 */
export const progressComponents: ComponentEntry[] = [
  {
    slug: 'progress-linear-label',
    category: 'progress',
    tags: ['progress', 'linear', 'bar', 'label', 'percentage'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'min', type: 'number', default: '0', descriptionKey: 'min' },
      { name: 'max', type: 'number', default: '100', descriptionKey: 'max' },
      { name: 'showValue', type: 'boolean', default: 'true', descriptionKey: 'showValue' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The wrapper is the progressbar, not the coloured fill: aria-valuenow lives on
  the element that owns the range, and the fill is a presentational child. The
  visible "68%" and the aria-valuenow are the same number from the same source -
  they must never be allowed to drift.
-->
<div class="w-full">
  <div class="mb-1.5 flex items-center justify-between gap-3">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading files</span>
    <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">68%</span>
  </div>
  <div
    role="progressbar"
    aria-valuenow="68"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Uploading files"
    class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <div
      class="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
      style="width: 68%"
    ></div>
  </div>
</div>`,
      react: `export function ProgressLinearLabel({
  label,
  value,
  min = 0,
  max = 100,
  showValue = true,
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={\`w-full \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showValue ? (
          <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {pct}%
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
      typescript: `export interface ProgressLinearLabelProps {
  /** Names the bar; used both as the visible caption and the accessible name. */
  label: string;
  value: number;
  min?: number;
  max?: number;
  /** Hide the numeric readout when the caption alone is enough. */
  showValue?: boolean;
  className?: string;
}

export function ProgressLinearLabel({
  label,
  value,
  min = 0,
  max = 100,
  showValue = true,
  className = '',
}: ProgressLinearLabelProps): JSX.Element {
  // Clamp so a value past max cannot paint a bar wider than its track.
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={\`w-full \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {showValue ? (
          <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
            {pct}%
          </span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-circular-ring',
    category: 'progress',
    tags: ['progress', 'circular', 'ring', 'svg', 'radial'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'small', labelKey: 'small' },
    ],
    props: [
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'label', type: 'string', default: "'Progress'", descriptionKey: 'label' },
      { name: 'min', type: 'number', default: '0', descriptionKey: 'min' },
      { name: 'max', type: 'number', default: '100', descriptionKey: 'max' },
      { name: 'size', type: 'number', default: '128', descriptionKey: 'size' },
      { name: 'strokeWidth', type: 'number', default: '10', descriptionKey: 'strokeWidth' },
    ],
    code: {
      tailwind: `<!--
  The SVG is rotated -90deg so the ring fills from 12 o'clock, and both circles
  are aria-hidden: the *value* is announced by the numeric %, not by the geometry.
  strokeDashoffset is the whole trick - dasharray is the full circumference and
  the offset hides the unfilled remainder (here r=59, C=370.7, 72% -> 103.8).
-->
<div class="inline-flex flex-col items-center gap-2">
  <div
    role="progressbar"
    aria-valuenow="72"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Storage used"
    class="relative"
    style="width: 128px; height: 128px"
  >
    <svg width="128" height="128" viewBox="0 0 128 128" class="-rotate-90" aria-hidden="true">
      <circle cx="64" cy="64" r="59" fill="none" stroke-width="10" class="stroke-gray-200 dark:stroke-gray-800" />
      <circle
        cx="64" cy="64" r="59" fill="none" stroke-width="10" stroke-linecap="round"
        stroke-dasharray="370.7" stroke-dashoffset="103.8"
        class="stroke-blue-600 transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none dark:stroke-blue-500"
      />
    </svg>
    <span class="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">72%</span>
  </div>
  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Storage used</span>
</div>`,
      react: `export function ProgressCircularRing({
  value,
  label = 'Progress',
  min = 0,
  max = 100,
  size = 128,
  strokeWidth = 10,
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const center = size / 2;
  return (
    <div className={\`inline-flex flex-col items-center gap-2 \${className}\`}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`} className="-rotate-90" aria-hidden="true">
          <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-gray-200 dark:stroke-gray-800" />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none dark:stroke-blue-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {pct}%
        </span>
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}`,
      typescript: `export interface ProgressCircularRingProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  /** Outer diameter in px. */
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressCircularRing({
  value,
  label = 'Progress',
  min = 0,
  max = 100,
  size = 128,
  strokeWidth = 10,
  className = '',
}: ProgressCircularRingProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const center = size / 2;
  return (
    <div className={\`inline-flex flex-col items-center gap-2 \${className}\`}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Geometry is decorative - the % text below is the accessible readout. */}
        <svg width={size} height={size} viewBox={\`0 0 \${size} \${size}\`} className="-rotate-90" aria-hidden="true">
          <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-gray-200 dark:stroke-gray-800" />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none dark:stroke-blue-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {pct}%
        </span>
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-segmented',
    category: 'progress',
    tags: ['progress', 'segmented', 'steps', 'discrete', 'meter'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'dense', labelKey: 'dense' },
    ],
    props: [
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'label', type: 'string', default: "'Progress'", descriptionKey: 'label' },
      { name: 'segments', type: 'number', default: '10', descriptionKey: 'segments' },
      { name: 'min', type: 'number', default: '0', descriptionKey: 'min' },
      { name: 'max', type: 'number', default: '100', descriptionKey: 'max' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The row of pills is decorative; the real range still rides on the wrapper's
  aria-valuenow. The segments only round the value to the nearest notch, so the
  numeric % stays authoritative.
-->
<div class="w-full">
  <div class="mb-1.5 flex items-center justify-between gap-3">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Profile strength</span>
    <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">70%</span>
  </div>
  <div
    role="progressbar"
    aria-valuenow="70"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Profile strength"
    class="flex w-full gap-1"
  >
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-blue-600 dark:bg-blue-500"></span>
    <span class="h-2.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800"></span>
    <span class="h-2.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800"></span>
    <span class="h-2.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800"></span>
  </div>
</div>`,
      react: `export function ProgressSegmented({
  value,
  label = 'Progress',
  segments = 10,
  min = 0,
  max = 100,
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const filled = Math.round((pct / 100) * segments);
  return (
    <div className={\`w-full \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="flex w-full gap-1"
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={\`h-2.5 flex-1 rounded-full \${
              i < filled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'
            }\`}
          />
        ))}
      </div>
    </div>
  );
}`,
      typescript: `export interface ProgressSegmentedProps {
  value: number;
  label?: string;
  /** How many discrete notches the track is divided into. */
  segments?: number;
  min?: number;
  max?: number;
  className?: string;
}

export function ProgressSegmented({
  value,
  label = 'Progress',
  segments = 10,
  min = 0,
  max = 100,
  className = '',
}: ProgressSegmentedProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const filled = Math.round((pct / 100) * segments);
  return (
    <div className={\`w-full \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="flex w-full gap-1"
      >
        {Array.from({ length: segments }, (_, i) => (
          <span
            key={i}
            className={\`h-2.5 flex-1 rounded-full \${
              i < filled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-800'
            }\`}
          />
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-striped-animated',
    category: 'progress',
    tags: ['progress', 'striped', 'animated', 'bar', 'loading'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'active', labelKey: 'active' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'min', type: 'number', default: '0', descriptionKey: 'min' },
      { name: 'max', type: 'number', default: '100', descriptionKey: 'max' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Tailwind can't declare @keyframes, so the barber-pole animation lives in a
  <style> block that travels with the component. motion-reduce:animate-none is
  not optional: the stripes convey nothing the % doesn't, so a reduced-motion
  user gets the same fill standing still.
-->
<style>
  @keyframes progress-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
</style>

<div class="w-full">
  <div class="mb-1.5 flex items-center justify-between gap-3">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Processing</span>
    <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">55%</span>
  </div>
  <div
    role="progressbar"
    aria-valuenow="55"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Processing"
    class="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <div
      class="h-full rounded-full bg-blue-600 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] animate-[progress-stripes_1s_linear_infinite] motion-reduce:animate-none dark:bg-blue-500"
      style="width: 55%"
    ></div>
  </div>
</div>`,
      react: `const STRIPE_KEYFRAMES = \`
  @keyframes progress-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
\`;

export function ProgressStripedAnimated({ label, value, min = 0, max = 100, className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={\`w-full \${className}\`}>
      {/* Keyframes ship with the component so it stays copy-pasteable. */}
      <style>{STRIPE_KEYFRAMES}</style>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-600 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] animate-[progress-stripes_1s_linear_infinite] motion-reduce:animate-none dark:bg-blue-500"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
      typescript: `const STRIPE_KEYFRAMES = \`
  @keyframes progress-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
\`;

export interface ProgressStripedAnimatedProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  className?: string;
}

export function ProgressStripedAnimated({
  label,
  value,
  min = 0,
  max = 100,
  className = '',
}: ProgressStripedAnimatedProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={\`w-full \${className}\`}>
      <style>{STRIPE_KEYFRAMES}</style>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {/* Stripes are pure decoration - motion-reduce freezes them, the % stays. */}
        <div
          className="h-full rounded-full bg-blue-600 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] animate-[progress-stripes_1s_linear_infinite] motion-reduce:animate-none dark:bg-blue-500"
          style={{ width: \`\${pct}%\` }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-multi-stacked',
    category: 'progress',
    tags: ['progress', 'stacked', 'multi', 'legend', 'breakdown'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'storage', labelKey: 'storage' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'segments', type: 'ProgressSegment[]', required: true, descriptionKey: 'segments' },
      { name: 'max', type: 'number', descriptionKey: 'max' },
      { name: 'unit', type: 'string', default: "''", descriptionKey: 'unit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A stacked bar must never encode meaning by colour alone: each swatch is decorative
  (aria-hidden) and every legend row carries a text label AND a number, so the
  breakdown survives greyscale, colour-blindness and a black-and-white printout.
  aria-valuenow on the wrapper is the *used* total against max.
-->
<div class="w-full max-w-md">
  <div class="mb-1.5 flex items-center justify-between gap-3">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Disk usage</span>
    <span class="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">180 / 256 GB</span>
  </div>
  <div
    role="progressbar"
    aria-valuenow="180"
    aria-valuemin="0"
    aria-valuemax="256"
    aria-label="Disk usage"
    class="flex h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <span class="h-full bg-blue-600 dark:bg-blue-500" style="width: 37.5%"></span>
    <span class="h-full bg-emerald-500 dark:bg-emerald-400" style="width: 23.4%"></span>
    <span class="h-full bg-amber-500 dark:bg-amber-400" style="width: 9.4%"></span>
  </div>
  <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
    <li class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
      <span class="h-2.5 w-2.5 rounded-sm bg-blue-600 dark:bg-blue-500" aria-hidden="true"></span>
      <span class="font-medium text-gray-700 dark:text-gray-300">Media</span>
      <span class="tabular-nums">96 GB</span>
    </li>
    <li class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
      <span class="h-2.5 w-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400" aria-hidden="true"></span>
      <span class="font-medium text-gray-700 dark:text-gray-300">Documents</span>
      <span class="tabular-nums">60 GB</span>
    </li>
    <li class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
      <span class="h-2.5 w-2.5 rounded-sm bg-amber-500 dark:bg-amber-400" aria-hidden="true"></span>
      <span class="font-medium text-gray-700 dark:text-gray-300">Apps</span>
      <span class="tabular-nums">24 GB</span>
    </li>
  </ul>
</div>`,
      react: `export function ProgressMultiStacked({ label, segments, max, unit = '', className = '' }) {
  const used = segments.reduce((sum, seg) => sum + seg.value, 0);
  const total = max ?? used;
  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {used} / {total}{unit ? \` \${unit}\` : ''}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
        className="flex h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {segments.map((seg) => (
          <span key={seg.label} className={\`h-full \${seg.className}\`} style={{ width: \`\${(seg.value / total) * 100}%\` }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className={\`h-2.5 w-2.5 rounded-sm \${seg.className}\`} aria-hidden="true" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{seg.label}</span>
            <span className="tabular-nums">{seg.value}{unit ? \` \${unit}\` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `export interface ProgressSegment {
  label: string;
  value: number;
  /** Tailwind background class - the swatch and bar slice share it. */
  className: string;
}

export interface ProgressMultiStackedProps {
  label: string;
  segments: ProgressSegment[];
  /** Track total; defaults to the sum of the segments (a full bar). */
  max?: number;
  unit?: string;
  className?: string;
}

export function ProgressMultiStacked({
  label,
  segments,
  max,
  unit = '',
  className = '',
}: ProgressMultiStackedProps): JSX.Element {
  const used = segments.reduce((sum, seg) => sum + seg.value, 0);
  const total = max ?? used;
  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-gray-100">
          {used} / {total}{unit ? \` \${unit}\` : ''}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label}
        className="flex h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {segments.map((seg) => (
          <span key={seg.label} className={\`h-full \${seg.className}\`} style={{ width: \`\${(seg.value / total) * 100}%\` }} />
        ))}
      </div>
      {/* Never colour alone: every legend row is swatch + text label + number. */}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className={\`h-2.5 w-2.5 rounded-sm \${seg.className}\`} aria-hidden="true" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{seg.label}</span>
            <span className="tabular-nums">{seg.value}{unit ? \` \${unit}\` : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-goal-card',
    category: 'progress',
    tags: ['progress', 'goal', 'card', 'fundraising', 'target'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'current', type: 'number', required: true, descriptionKey: 'current' },
      { name: 'goal', type: 'number', required: true, descriptionKey: 'goal' },
      { name: 'prefix', type: 'string', default: "''", descriptionKey: 'prefix' },
      { name: 'caption', type: 'string', descriptionKey: 'caption' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A goal card is still a progressbar: aria-valuenow is the raw amount raised and
  aria-valuemax is the goal, so a screen reader hears "18,500 of 25,000", while
  the bar clamps its width to 100% so an over-funded goal can't overflow.
-->
<div class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-baseline justify-between gap-3">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Community fund</h3>
    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">74%</span>
  </div>
  <p class="mt-2 flex items-baseline gap-1.5">
    <span class="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">$18,500</span>
    <span class="text-sm text-gray-500 dark:text-gray-400">of $25,000</span>
  </p>
  <div
    role="progressbar"
    aria-valuenow="18500"
    aria-valuemin="0"
    aria-valuemax="25000"
    aria-label="Community fund"
    class="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <div class="h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-emerald-500" style="width: 74%"></div>
  </div>
  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">312 backers &middot; 6 days left</p>
</div>`,
      react: `export function ProgressGoalCard({ title, current, goal, prefix = '', caption, className = '' }) {
  const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
  return (
    <div className={\`w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{pct}%</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {prefix}{current.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">of {prefix}{goal.toLocaleString()}</span>
      </p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={title}
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-emerald-500"
          style={{ width: \`\${Math.min(100, pct)}%\` }}
        />
      </div>
      {caption ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{caption}</p> : null}
    </div>
  );
}`,
      typescript: `export interface ProgressGoalCardProps {
  title: string;
  current: number;
  goal: number;
  /** Currency or unit symbol prepended to both amounts, e.g. '$'. */
  prefix?: string;
  caption?: string;
  className?: string;
}

export function ProgressGoalCard({
  title,
  current,
  goal,
  prefix = '',
  caption,
  className = '',
}: ProgressGoalCardProps): JSX.Element {
  const pct = goal > 0 ? Math.round((current / goal) * 100) : 0;
  return (
    <div className={\`w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{pct}%</span>
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
          {prefix}{current.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">of {prefix}{goal.toLocaleString()}</span>
      </p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-label={title}
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {/* Clamp the fill so an over-funded goal can't paint past the track. */}
        <div
          className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-emerald-500"
          style={{ width: \`\${Math.min(100, pct)}%\` }}
        />
      </div>
      {caption ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{caption}</p> : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-radial-dashboard',
    category: 'progress',
    tags: ['progress', 'radial', 'gauge', 'dashboard', 'semicircle'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'score', labelKey: 'score' },
    ],
    props: [
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'label', type: 'string', default: "'Score'", descriptionKey: 'label' },
      { name: 'min', type: 'number', default: '0', descriptionKey: 'min' },
      { name: 'max', type: 'number', default: '100', descriptionKey: 'max' },
      { name: 'unit', type: 'string', default: "''", descriptionKey: 'unit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The gauge is one SVG arc drawn twice. pathLength="100" re-scales the path to a
  0-100 length regardless of its real geometry, so the value arc is just
  stroke-dasharray="<pct> 100" - no trigonometry. The arc is aria-hidden; the big
  numeral is the readout, and aria-valuenow on the wrapper is the source of truth.
-->
<div
  role="progressbar"
  aria-valuenow="68"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Performance score"
  class="relative inline-block w-full max-w-[240px]"
>
  <svg viewBox="0 0 200 110" class="w-full" aria-hidden="true">
    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke-width="16" stroke-linecap="round" pathLength="100" class="stroke-gray-200 dark:stroke-gray-800" />
    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke-width="16" stroke-linecap="round" pathLength="100" stroke-dasharray="68 100" class="stroke-indigo-600 transition-[stroke-dasharray] duration-500 ease-out motion-reduce:transition-none dark:stroke-indigo-500" />
  </svg>
  <div class="absolute inset-x-0 bottom-0 flex flex-col items-center">
    <span class="text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">68</span>
    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Performance score</span>
  </div>
</div>`,
      react: `export function ProgressRadialDashboard({ value, label = 'Score', min = 0, max = 100, unit = '', className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  const arc = 'M 20 100 A 80 80 0 0 1 180 100';
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={\`relative inline-block w-full max-w-[240px] \${className}\`}
    >
      <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true">
        <path d={arc} fill="none" strokeWidth={16} strokeLinecap="round" pathLength={100} className="stroke-gray-200 dark:stroke-gray-800" />
        <path
          d={arc}
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={\`\${pct} 100\`}
          className="stroke-indigo-600 transition-[stroke-dasharray] duration-500 ease-out motion-reduce:transition-none dark:stroke-indigo-500"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}{unit}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}`,
      typescript: `export interface ProgressRadialDashboardProps {
  value: number;
  label?: string;
  min?: number;
  max?: number;
  /** Appended to the numeral, e.g. '%' or ' pts'. */
  unit?: string;
  className?: string;
}

export function ProgressRadialDashboard({
  value,
  label = 'Score',
  min = 0,
  max = 100,
  unit = '',
  className = '',
}: ProgressRadialDashboardProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  // pathLength=100 normalises the arc so the value stroke is just "<pct> 100".
  const arc = 'M 20 100 A 80 80 0 0 1 180 100';
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={\`relative inline-block w-full max-w-[240px] \${className}\`}
    >
      <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true">
        <path d={arc} fill="none" strokeWidth={16} strokeLinecap="round" pathLength={100} className="stroke-gray-200 dark:stroke-gray-800" />
        <path
          d={arc}
          fill="none"
          strokeWidth={16}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={\`\${pct} 100\`}
          className="stroke-indigo-600 transition-[stroke-dasharray] duration-500 ease-out motion-reduce:transition-none dark:stroke-indigo-500"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}{unit}</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-mini-inline',
    category: 'progress',
    tags: ['progress', 'inline', 'mini', 'compact', 'row'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'list', labelKey: 'list' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'number', required: true, descriptionKey: 'value' },
      { name: 'min', type: 'number', default: '0', descriptionKey: 'min' },
      { name: 'max', type: 'number', default: '100', descriptionKey: 'max' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Built for table cells and list rows. min-w-0 on the track lets it shrink inside
  a flex row instead of forcing horizontal overflow at 320px, and the label and %
  are shrink-0 so only the bar gives up width.
-->
<div class="flex items-center gap-3">
  <span class="shrink-0 text-sm text-gray-700 dark:text-gray-300">Onboarding</span>
  <div
    role="progressbar"
    aria-valuenow="42"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Onboarding"
    class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <div class="h-full rounded-full bg-blue-600 dark:bg-blue-500" style="width: 42%"></div>
  </div>
  <span class="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-400">42%</span>
</div>`,
      react: `export function ProgressMiniInline({ label, value, min = 0, max = 100, className = '' }) {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={\`flex items-center gap-3 \${className}\`}>
      <span className="shrink-0 text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: \`\${pct}%\` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-400">
        {pct}%
      </span>
    </div>
  );
}`,
      typescript: `export interface ProgressMiniInlineProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  className?: string;
}

export function ProgressMiniInline({
  label,
  value,
  min = 0,
  max = 100,
  className = '',
}: ProgressMiniInlineProps): JSX.Element {
  const pct = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
  return (
    <div className={\`flex items-center gap-3 \${className}\`}>
      <span className="shrink-0 text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={label}
        className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: \`\${pct}%\` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-600 dark:text-gray-400">
        {pct}%
      </span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-steps-checklist',
    category: 'progress',
    tags: ['progress', 'checklist', 'steps', 'onboarding', 'tasks'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'setup', labelKey: 'setup' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'steps', type: 'ChecklistStep[]', required: true, descriptionKey: 'steps' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The bar's range is steps, not percent: aria-valuenow="2" against
  aria-valuemax="4" reads as "2 of 4" without inventing a fake percentage. The
  check glyphs are aria-hidden because the list order and the strike-through
  already tell the story to assistive tech.
-->
<div class="w-full max-w-sm">
  <div class="mb-1.5 flex items-center justify-between gap-3">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Account setup</h3>
    <span class="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">2 of 4</span>
  </div>
  <div
    role="progressbar"
    aria-valuenow="2"
    aria-valuemin="0"
    aria-valuemax="4"
    aria-label="Account setup"
    class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <div class="h-full rounded-full bg-green-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-green-500" style="width: 50%"></div>
  </div>
  <ul class="mt-3 space-y-2">
    <li class="flex items-center gap-2.5 text-sm">
      <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white dark:bg-green-500" aria-hidden="true">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <span class="text-gray-500 line-through dark:text-gray-400">Verify email</span>
    </li>
    <li class="flex items-center gap-2.5 text-sm">
      <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white dark:bg-green-500" aria-hidden="true">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <span class="text-gray-500 line-through dark:text-gray-400">Add your name</span>
    </li>
    <li class="flex items-center gap-2.5 text-sm">
      <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-transparent dark:border-gray-700" aria-hidden="true">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <span class="text-gray-700 dark:text-gray-300">Invite a teammate</span>
    </li>
    <li class="flex items-center gap-2.5 text-sm">
      <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-transparent dark:border-gray-700" aria-hidden="true">
        <svg viewBox="0 0 12 12" class="h-3 w-3" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
      <span class="text-gray-700 dark:text-gray-300">Connect a repo</span>
    </li>
  </ul>
</div>`,
      react: `function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
      <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProgressStepsChecklist({ title, steps, className = '' }) {
  const done = steps.filter((s) => s.done).length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
          {done} of {steps.length}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label={title}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="h-full rounded-full bg-green-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-green-500" style={{ width: \`\${pct}%\` }} />
      </div>
      <ul className="mt-3 space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={\`flex h-5 w-5 shrink-0 items-center justify-center rounded-full \${
                step.done
                  ? 'bg-green-600 text-white dark:bg-green-500'
                  : 'border border-gray-300 text-transparent dark:border-gray-700'
              }\`}
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className={step.done ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `export interface ChecklistStep {
  label: string;
  done: boolean;
}

export interface ProgressStepsChecklistProps {
  title: string;
  steps: ChecklistStep[];
  className?: string;
}

function CheckIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
      <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProgressStepsChecklist({
  title,
  steps,
  className = '',
}: ProgressStepsChecklistProps): JSX.Element {
  const done = steps.filter((s) => s.done).length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  return (
    <div className={\`w-full max-w-sm \${className}\`}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
          {done} of {steps.length}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-label={title}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="h-full rounded-full bg-green-600 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-green-500" style={{ width: \`\${pct}%\` }} />
      </div>
      <ul className="mt-3 space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-2.5 text-sm">
            {/* Check is decorative - order + strike-through carry the state. */}
            <span
              className={\`flex h-5 w-5 shrink-0 items-center justify-center rounded-full \${
                step.done
                  ? 'bg-green-600 text-white dark:bg-green-500'
                  : 'border border-gray-300 text-transparent dark:border-gray-700'
              }\`}
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className={step.done ? 'text-gray-500 line-through dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'progress-indeterminate-thin',
    category: 'progress',
    tags: ['progress', 'indeterminate', 'loading', 'thin', 'linear'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'top', labelKey: 'top' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Loading…'", descriptionKey: 'label' },
      { name: 'showLabel', type: 'boolean', default: 'true', descriptionKey: 'showLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  This is the one bar with NO aria-valuenow - and that is correct. In ARIA an
  absent value on role="progressbar" is exactly how you announce "in progress,
  duration unknown"; adding a number here would be a lie. motion-reduce swaps the
  sliding chip for a static one so the state stays visible without any movement.
-->
<style>
  @keyframes progress-indeterminate {
    0%   { left: -40%; width: 40%; }
    50%  { left: 30%;  width: 55%; }
    100% { left: 100%; width: 40%; }
  }
</style>

<div class="w-full">
  <div
    role="progressbar"
    aria-label="Loading"
    aria-busy="true"
    class="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
  >
    <div class="absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-600 animate-[progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:hidden dark:bg-blue-500"></div>
    <div class="absolute inset-y-0 left-0 hidden w-1/3 rounded-full bg-blue-600 motion-reduce:block dark:bg-blue-500" aria-hidden="true"></div>
  </div>
  <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Loading…</p>
</div>`,
      react: `const INDETERMINATE_KEYFRAMES = \`
  @keyframes progress-indeterminate {
    0%   { left: -40%; width: 40%; }
    50%  { left: 30%;  width: 55%; }
    100% { left: 100%; width: 40%; }
  }
\`;

export function ProgressIndeterminateThin({ label = 'Loading…', showLabel = true, className = '' }) {
  return (
    <div className={\`w-full \${className}\`}>
      <style>{INDETERMINATE_KEYFRAMES}</style>
      <div
        role="progressbar"
        aria-label={label}
        aria-busy="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-600 animate-[progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:hidden dark:bg-blue-500" />
        {/* Reduced-motion fallback: a static chip keeps the loading state visible. */}
        <div className="absolute inset-y-0 left-0 hidden w-1/3 rounded-full bg-blue-600 motion-reduce:block dark:bg-blue-500" aria-hidden="true" />
      </div>
      {showLabel ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</p> : null}
    </div>
  );
}`,
      typescript: `const INDETERMINATE_KEYFRAMES = \`
  @keyframes progress-indeterminate {
    0%   { left: -40%; width: 40%; }
    50%  { left: 30%;  width: 55%; }
    100% { left: 100%; width: 40%; }
  }
\`;

export interface ProgressIndeterminateThinProps {
  label?: string;
  showLabel?: boolean;
  className?: string;
}

// No aria-valuenow on purpose: an indeterminate progressbar omits the value to
// signal an unknown duration. aria-busy tells AT the region is still working.
export function ProgressIndeterminateThin({
  label = 'Loading…',
  showLabel = true,
  className = '',
}: ProgressIndeterminateThinProps): JSX.Element {
  return (
    <div className={\`w-full \${className}\`}>
      <style>{INDETERMINATE_KEYFRAMES}</style>
      <div
        role="progressbar"
        aria-label={label}
        aria-busy="true"
        className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-blue-600 animate-[progress-indeterminate_1.4s_ease-in-out_infinite] motion-reduce:hidden dark:bg-blue-500" />
        <div className="absolute inset-y-0 left-0 hidden w-1/3 rounded-full bg-blue-600 motion-reduce:block dark:bg-blue-500" aria-hidden="true" />
      </div>
      {showLabel ? <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</p> : null}
    </div>
  );
}`,
    },
  },
];
