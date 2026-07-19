import type { ComponentEntry } from './types';

/**
 * Color-pickers category.
 *
 * Ten pickers built from what the platform ships natively - `<input type="range">`,
 * `<input type="color">` and CSS gradients - with no canvas and no color library.
 * The shared constraint runs through every one: a colour cannot be the ONLY signal.
 * A swatch is chosen because it also carries a ring and a check, a contrast result
 * passes because it also says "AA" with a tick, an invalid hex is flagged with an
 * icon and text - never a red border alone. And because the value is the point, it
 * is always printed as visible text and mirrored into an `aria-label`, so the answer
 * is legible to eyes and to a screen reader at the same time.
 */
export const colorPickersComponents: ComponentEntry[] = [
  {
    slug: 'color-picker-swatch-grid',
    category: 'color-pickers',
    tags: ['color', 'swatch', 'grid', 'palette', 'radiogroup'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'colors', type: 'string[]', descriptionKey: 'colors' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'onChange', type: '(color: string) => void', descriptionKey: 'onChange' },
      { name: 'label', type: 'string', default: "'Choose a color'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!--
  Static snapshot - the interactive selection lives in the React / TypeScript tabs.
  The grid is a radiogroup: one <button role="radio"> per swatch. The chosen swatch
  carries a ring AND a check so it is distinguishable without relying on colour, and
  the check uses mix-blend-mode:difference so it stays visible on any swatch.
-->
<div role="radiogroup" aria-label="Choose a color" class="w-full max-w-xs">
  <div class="grid grid-cols-6 gap-2">
    <button type="button" role="radio" aria-checked="false" aria-label="#ef4444" class="aspect-square w-full rounded-lg border border-black/10 dark:border-white/15" style="background-color:#ef4444"></button>
    <button type="button" role="radio" aria-checked="true" aria-label="#3b82f6" class="relative flex aspect-square w-full items-center justify-center rounded-lg border border-black/10 ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:border-white/15 dark:ring-blue-400 dark:ring-offset-gray-950" style="background-color:#3b82f6">
      <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="#fff" stroke-width="3" style="mix-blend-mode:difference" aria-hidden="true"><path d="M4 10l4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button type="button" role="radio" aria-checked="false" aria-label="#22c55e" class="aspect-square w-full rounded-lg border border-black/10 dark:border-white/15" style="background-color:#22c55e"></button>
  </div>
  <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">Selected <span class="font-mono font-semibold text-gray-900 dark:text-gray-100">#3b82f6</span></p>
</div>`,
      react: `import { useState } from 'react';

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
  '#6366f1', '#a855f7', '#ec4899', '#64748b', '#111827', '#ffffff',
];

export function ColorPickerSwatchGrid({
  colors = DEFAULT_COLORS,
  value,
  onChange,
  label = 'Choose a color',
}) {
  const [internal, setInternal] = useState(value ?? colors[0] ?? '#000000');
  const selected = value ?? internal;

  const select = (color) => {
    setInternal(color);
    onChange?.(color);
  };

  return (
    <div role="radiogroup" aria-label={label} className="w-full max-w-xs">
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => {
          const isSelected = color.toLowerCase() === selected.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color}
              onClick={() => select(color)}
              style={{ backgroundColor: color }}
              className={\`relative flex aspect-square w-full items-center justify-center rounded-lg border border-black/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-blue-400 dark:ring-offset-gray-950' : ''}\`}
            >
              {isSelected ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#fff" strokeWidth="3" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Selected <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{selected}</span>
      </p>
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface ColorPickerSwatchGridProps {
  /** Hex swatches to offer. */
  colors?: string[];
  /** Controlled selection; omit to let the component own it. */
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
  '#6366f1', '#a855f7', '#ec4899', '#64748b', '#111827', '#ffffff',
];

export function ColorPickerSwatchGrid({
  colors = DEFAULT_COLORS,
  value,
  onChange,
  label = 'Choose a color',
}: ColorPickerSwatchGridProps): JSX.Element {
  const [internal, setInternal] = useState<string>(value ?? colors[0] ?? '#000000');
  const selected = value ?? internal;

  const select = (color: string) => {
    setInternal(color);
    onChange?.(color);
  };

  return (
    <div role="radiogroup" aria-label={label} className="w-full max-w-xs">
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => {
          const isSelected = color.toLowerCase() === selected.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={color}
              onClick={() => select(color)}
              style={{ backgroundColor: color }}
              className={\`relative flex aspect-square w-full items-center justify-center rounded-lg border border-black/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-blue-400 dark:ring-offset-gray-950' : ''}\`}
            >
              {/* mix-blend-mode:difference keeps the tick legible on light and dark swatches alike. */}
              {isSelected ? (
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="#fff" strokeWidth="3" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Selected <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{selected}</span>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-hue-slider',
    category: 'color-pickers',
    tags: ['color', 'hue', 'slider', 'range', 'gradient'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'hue', type: 'number', descriptionKey: 'hue' },
      { name: 'onChange', type: '(hue: number) => void', descriptionKey: 'onChange' },
      { name: 'label', type: 'string', default: "'Hue'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!--
  A single native range whose track is painted with the hue wheel as a CSS gradient.
  The aria-label carries the resolved hex so the value is announced, not just the
  raw 0-360 the slider reports. Static snapshot - see the React / TypeScript tabs.
-->
<div class="w-full max-w-xs">
  <div class="mb-3 flex items-center gap-3">
    <span class="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style="background-color:#00a2ff"></span>
    <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">#00a2ff</span>
    <span class="ml-auto text-sm text-gray-500 dark:text-gray-400">Hue 200&deg;</span>
  </div>
  <input type="range" min="0" max="360" value="200" aria-label="Hue, #00a2ff"
    class="h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    style="background:linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)" />
</div>`,
      react: `import { useState } from 'react';

function hueToHex(h) {
  const s = 1, l = 0.5;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

export function ColorPickerHueSlider({ hue, onChange, label = 'Hue' }) {
  const [internal, setInternal] = useState(hue ?? 200);
  const current = hue ?? internal;
  const hex = hueToHex(current);

  const handle = (event) => {
    const next = Number(event.target.value);
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{label} {current}&deg;</span>
      </div>
      <input
        type="range"
        min={0}
        max={360}
        value={current}
        onChange={handle}
        aria-label={\`\${label}, \${hex}\`}
        className="h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ background: 'linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)' }}
      />
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerHueSliderProps {
  /** Controlled hue in degrees, 0-360. */
  hue?: number;
  onChange?: (hue: number) => void;
  label?: string;
}

// Pure HSL->hex at full saturation and 50% lightness, so 0-360 maps to a vivid hue.
function hueToHex(h: number): string {
  const s = 1, l = 0.5;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

export function ColorPickerHueSlider({ hue, onChange, label = 'Hue' }: ColorPickerHueSliderProps): JSX.Element {
  const [internal, setInternal] = useState<number>(hue ?? 200);
  const current = hue ?? internal;
  const hex = hueToHex(current);

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
        <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{label} {current}&deg;</span>
      </div>
      <input
        type="range"
        min={0}
        max={360}
        value={current}
        onChange={handle}
        aria-label={\`\${label}, \${hex}\`}
        className="h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ background: 'linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)' }}
      />
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-hsl-sliders',
    category: 'color-pickers',
    tags: ['color', 'hsl', 'sliders', 'range', 'gradient'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'value', type: '{ h: number; s: number; l: number }', descriptionKey: 'value' },
      { name: 'onChange', type: '(hsl: { h: number; s: number; l: number }) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Three native ranges for H, S and L. Each track is a live CSS gradient showing what
  moving THAT channel does while the other two hold, so the slider previews its own
  effect. The resolved hex is printed and set as each slider's aria-label. Static
  snapshot - interactive logic lives in the React / TypeScript tabs.
-->
<div class="w-full max-w-xs space-y-3">
  <div class="flex items-center gap-3">
    <span class="h-10 w-10 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style="background-color:#3b82f6"></span>
    <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">#3b82f6</span>
    <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">hsl(217 91% 60%)</span>
  </div>
  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Hue
    <input type="range" min="0" max="360" value="217" aria-label="Hue, #3b82f6" class="mt-1 h-3 w-full cursor-pointer appearance-none rounded-full" style="background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" />
  </label>
  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Saturation
    <input type="range" min="0" max="100" value="91" aria-label="Saturation, #3b82f6" class="mt-1 h-3 w-full cursor-pointer appearance-none rounded-full" style="background:linear-gradient(to right,#808080,#3b82f6)" />
  </label>
  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Lightness
    <input type="range" min="0" max="100" value="60" aria-label="Lightness, #3b82f6" class="mt-1 h-3 w-full cursor-pointer appearance-none rounded-full" style="background:linear-gradient(to right,#000,#3b82f6,#fff)" />
  </label>
</div>`,
      react: `import { useState } from 'react';

function hslToHex(h, s, l) {
  const sn = s / 100, ln = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

export function ColorPickerHslSliders({ value, onChange }) {
  const [internal, setInternal] = useState(value ?? { h: 217, s: 91, l: 60 });
  const hsl = value ?? internal;
  const hex = hslToHex(hsl.h, hsl.s, hsl.l);

  const set = (key) => (event) => {
    const next = { ...hsl, [key]: Number(event.target.value) };
    setInternal(next);
    onChange?.(next);
  };

  const track = (key) => {
    if (key === 'h') return 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';
    if (key === 's') return \`linear-gradient(to right,\${hslToHex(hsl.h, 0, hsl.l)},\${hslToHex(hsl.h, 100, hsl.l)})\`;
    return \`linear-gradient(to right,#000,\${hslToHex(hsl.h, hsl.s, 50)},#fff)\`;
  };

  const rows = [
    { key: 'h', label: 'Hue', max: 360 },
    { key: 's', label: 'Saturation', max: 100 },
    { key: 'l', label: 'Lightness', max: 100 },
  ];

  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">hsl({hsl.h} {hsl.s}% {hsl.l}%)</span>
      </div>
      {rows.map((row) => (
        <label key={row.key} className="block text-xs font-medium text-gray-600 dark:text-gray-400">
          {row.label}
          <input
            type="range"
            min={0}
            max={row.max}
            value={hsl[row.key]}
            onChange={set(row.key)}
            aria-label={\`\${row.label}, \${hex}\`}
            className="mt-1 h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            style={{ background: track(row.key) }}
          />
        </label>
      ))}
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface ColorPickerHslSlidersProps {
  value?: Hsl;
  onChange?: (hsl: Hsl) => void;
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

export function ColorPickerHslSliders({ value, onChange }: ColorPickerHslSlidersProps): JSX.Element {
  const [internal, setInternal] = useState<Hsl>(value ?? { h: 217, s: 91, l: 60 });
  const hsl = value ?? internal;
  const hex = hslToHex(hsl.h, hsl.s, hsl.l);

  const set = (key: keyof Hsl) => (event: ChangeEvent<HTMLInputElement>) => {
    const next = { ...hsl, [key]: Number(event.target.value) };
    setInternal(next);
    onChange?.(next);
  };

  // Each track shows the effect of ITS channel while the others hold - the slider
  // is its own live preview, which is worth more than a static rainbow for S and L.
  const track = (key: keyof Hsl): string => {
    if (key === 'h') return 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';
    if (key === 's') return \`linear-gradient(to right,\${hslToHex(hsl.h, 0, hsl.l)},\${hslToHex(hsl.h, 100, hsl.l)})\`;
    return \`linear-gradient(to right,#000,\${hslToHex(hsl.h, hsl.s, 50)},#fff)\`;
  };

  const rows: Array<{ key: keyof Hsl; label: string; max: number }> = [
    { key: 'h', label: 'Hue', max: 360 },
    { key: 's', label: 'Saturation', max: 100 },
    { key: 'l', label: 'Lightness', max: 100 },
  ];

  return (
    <div className="w-full max-w-xs space-y-3">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: hex }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">hsl({hsl.h} {hsl.s}% {hsl.l}%)</span>
      </div>
      {rows.map((row) => (
        <label key={row.key} className="block text-xs font-medium text-gray-600 dark:text-gray-400">
          {row.label}
          <input
            type="range"
            min={0}
            max={row.max}
            value={hsl[row.key]}
            onChange={set(row.key)}
            aria-label={\`\${row.label}, \${hex}\`}
            className="mt-1 h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            style={{ background: track(row.key) }}
          />
        </label>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-hex-input',
    category: 'color-pickers',
    tags: ['color', 'hex', 'input', 'validation', 'native'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'value', type: 'string', default: "'#3b82f6'", descriptionKey: 'value' },
      { name: 'onChange', type: '(hex: string) => void', descriptionKey: 'onChange' },
      { name: 'label', type: 'string', default: "'Hex color'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!--
  A typed hex field paired with a native <input type="color"> so both editing modes
  agree. An invalid entry is flagged with aria-invalid, an icon AND a text message -
  never a bare red border, which colour-blind users cannot see. Static snapshot.
-->
<div class="w-full max-w-xs">
  <label for="hex-in" class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Hex color</label>
  <div class="flex items-center gap-2">
    <label class="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/15" style="background-color:#3b82f6">
      <span class="sr-only">Pick with system color picker</span>
      <input type="color" value="#3b82f6" class="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
    </label>
    <input id="hex-in" type="text" value="#3b82f6" inputmode="text" spellcheck="false" aria-invalid="false"
      class="h-10 w-full rounded-lg border border-gray-300 bg-transparent px-3 font-mono text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
  </div>
  <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Enter a 6-digit hex, e.g. #1e293b.</p>
</div>`,
      react: `import { useState } from 'react';

const HEX = /^#[0-9a-fA-F]{6}$/;

export function ColorPickerHexInput({ value = '#3b82f6', onChange, label = 'Hex color' }) {
  const [draft, setDraft] = useState(value);
  const valid = HEX.test(draft);

  const commit = (next) => {
    setDraft(next);
    if (HEX.test(next)) onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="hex-in" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <label className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: valid ? draft : '#e5e7eb' }}>
          <span className="sr-only">Pick with system color picker</span>
          <input type="color" value={valid ? draft : '#3b82f6'} onChange={(e) => commit(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
        <input
          id="hex-in"
          type="text"
          value={draft}
          onChange={(e) => commit(e.target.value)}
          inputMode="text"
          spellCheck={false}
          aria-invalid={!valid}
          aria-describedby="hex-hint"
          className={\`h-10 w-full rounded-lg border bg-transparent px-3 font-mono text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 dark:text-gray-100 \${valid ? 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400' : 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-400'}\`}
        />
      </div>
      {valid ? (
        <p id="hex-hint" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Enter a 6-digit hex, e.g. #1e293b.</p>
      ) : (
        <p id="hex-hint" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.9.9 0 01.9.9v4a.9.9 0 01-1.8 0v-4A.9.9 0 018 4zm0 8.4a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" /></svg>
          Not a valid 6-digit hex.
        </p>
      )}
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerHexInputProps {
  value?: string;
  onChange?: (hex: string) => void;
  label?: string;
}

const HEX = /^#[0-9a-fA-F]{6}$/;

export function ColorPickerHexInput({ value = '#3b82f6', onChange, label = 'Hex color' }: ColorPickerHexInputProps): JSX.Element {
  const [draft, setDraft] = useState<string>(value);
  const valid = HEX.test(draft);

  // Only fire onChange for a *valid* hex; a half-typed '#3b8' must not repaint the app.
  const commit = (next: string) => {
    setDraft(next);
    if (HEX.test(next)) onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="hex-in" className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <label className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundColor: valid ? draft : '#e5e7eb' }}>
          <span className="sr-only">Pick with system color picker</span>
          <input type="color" value={valid ? draft : '#3b82f6'} onChange={(e: ChangeEvent<HTMLInputElement>) => commit(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
        <input
          id="hex-in"
          type="text"
          value={draft}
          onChange={(e: ChangeEvent<HTMLInputElement>) => commit(e.target.value)}
          inputMode="text"
          spellCheck={false}
          aria-invalid={!valid}
          aria-describedby="hex-hint"
          className={\`h-10 w-full rounded-lg border bg-transparent px-3 font-mono text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 dark:text-gray-100 \${valid ? 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400' : 'border-rose-500 focus-visible:ring-rose-500 dark:border-rose-400'}\`}
        />
      </div>
      {valid ? (
        <p id="hex-hint" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">Enter a 6-digit hex, e.g. #1e293b.</p>
      ) : (
        <p id="hex-hint" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.9.9 0 01.9.9v4a.9.9 0 01-1.8 0v-4A.9.9 0 018 4zm0 8.4a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" /></svg>
          Not a valid 6-digit hex.
        </p>
      )}
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-saturation-pane',
    category: 'color-pickers',
    tags: ['color', 'saturation', 'value', 'pane', 'pointer'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'hue', type: 'number', default: '217', descriptionKey: 'hue' },
      { name: 'onChange', type: '(hex: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  The classic saturation/value square: a white->hue gradient with a transparent->black
  gradient over it, so x is saturation and y is value. The thumb is a role="slider"
  with aria-valuetext set to the resolved hex, and it is keyboard-driveable with the
  arrow keys - a 2D picker that is pointer-only is not accessible. Static snapshot.
-->
<div class="w-full max-w-xs">
  <div class="relative h-44 w-full rounded-lg border border-black/10 dark:border-white/15" style="background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(217 100% 50%))">
    <span class="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/30" style="left:80%;top:20%"></span>
  </div>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected <span class="font-mono font-semibold text-gray-900 dark:text-gray-100">#1e66d0</span></p>
</div>`,
      react: `import { useRef, useState } from 'react';

function svToHex(h, s, v) {
  const nv = v / 100;
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return nv - nv * (s / 100) * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(5))}\${toHex(f(3))}\${toHex(f(1))}\`;
}

export function ColorPickerSaturationPane({ hue = 217, onChange }) {
  const paneRef = useRef(null);
  const [sat, setSat] = useState(80);
  const [val, setVal] = useState(80);
  const hex = svToHex(hue, sat, val);

  const apply = (s, v) => {
    setSat(s);
    setVal(v);
    onChange?.(svToHex(hue, s, v));
  };

  const fromPointer = (event) => {
    const el = paneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    apply(Math.round(x * 100), Math.round((1 - y) * 100));
  };

  const onKeyDown = (event) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowRight') apply(Math.min(100, sat + step), val);
    else if (event.key === 'ArrowLeft') apply(Math.max(0, sat - step), val);
    else if (event.key === 'ArrowUp') apply(sat, Math.min(100, val + step));
    else if (event.key === 'ArrowDown') apply(sat, Math.max(0, val - step));
    else return;
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-xs">
      <div
        ref={paneRef}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuetext={hex}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
        onPointerMove={(e) => { if (e.buttons === 1) fromPointer(e); }}
        onKeyDown={onKeyDown}
        className="relative h-44 w-full cursor-crosshair touch-none rounded-lg border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ background: \`linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(\${hue} 100% 50%))\` }}
      >
        <span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/30" style={{ left: \`\${sat}%\`, top: \`\${100 - val}%\` }} />
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Selected <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
      </p>
    </div>
  );
}`,
      typescript: `import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

export interface ColorPickerSaturationPaneProps {
  hue?: number;
  onChange?: (hex: string) => void;
}

// HSV->hex directly: x on the pane is saturation, y (inverted) is value/brightness.
function svToHex(h: number, s: number, v: number): string {
  const nv = v / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return nv - nv * (s / 100) * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(5))}\${toHex(f(3))}\${toHex(f(1))}\`;
}

export function ColorPickerSaturationPane({ hue = 217, onChange }: ColorPickerSaturationPaneProps): JSX.Element {
  const paneRef = useRef<HTMLDivElement>(null);
  const [sat, setSat] = useState<number>(80);
  const [val, setVal] = useState<number>(80);
  const hex = svToHex(hue, sat, val);

  const apply = (s: number, v: number) => {
    setSat(s);
    setVal(v);
    onChange?.(svToHex(hue, s, v));
  };

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const el = paneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    apply(Math.round(x * 100), Math.round((1 - y) * 100));
  };

  // Arrow keys are not optional: a 2D picker reachable only by mouse excludes anyone
  // who navigates by keyboard. Shift takes a coarse step.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowRight') apply(Math.min(100, sat + step), val);
    else if (event.key === 'ArrowLeft') apply(Math.max(0, sat - step), val);
    else if (event.key === 'ArrowUp') apply(sat, Math.min(100, val + step));
    else if (event.key === 'ArrowDown') apply(sat, Math.max(0, val - step));
    else return;
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-xs">
      <div
        ref={paneRef}
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuetext={hex}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
        onPointerMove={(e) => { if (e.buttons === 1) fromPointer(e); }}
        onKeyDown={onKeyDown}
        className="relative h-44 w-full cursor-crosshair touch-none rounded-lg border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ background: \`linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(\${hue} 100% 50%))\` }}
      >
        <span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-black/30" style={{ left: \`\${sat}%\`, top: \`\${100 - val}%\` }} />
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Selected <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{hex}</span>
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-alpha-slider',
    category: 'color-pickers',
    tags: ['color', 'alpha', 'opacity', 'slider', 'checkerboard'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'color', type: 'string', default: "'#3b82f6'", descriptionKey: 'color' },
      { name: 'alpha', type: 'number', default: '100', descriptionKey: 'alpha' },
      { name: 'onChange', type: '(alpha: number) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Alpha over a checkerboard so "transparent" reads as transparent, not as white. The
  track layers a colour->transparent gradient on top of a CSS checkerboard, and the
  rgba() string is printed and announced. Static snapshot.
-->
<div class="w-full max-w-xs">
  <div class="mb-3 flex items-center gap-3">
    <span class="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style="background-image:linear-gradient(rgba(59,130,246,0.6),rgba(59,130,246,0.6)),repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%);background-size:auto,10px 10px"></span>
    <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">rgba(59, 130, 246, 0.60)</span>
  </div>
  <input type="range" min="0" max="100" value="60" aria-label="Opacity, rgba(59, 130, 246, 0.60)"
    class="h-4 w-full cursor-pointer appearance-none rounded-full border border-black/10 dark:border-white/15"
    style="background-image:linear-gradient(to right,rgba(59,130,246,0),rgba(59,130,246,1)),repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%);background-size:auto,12px 12px" />
</div>`,
      react: `import { useState } from 'react';

function toRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function ColorPickerAlphaSlider({ color = '#3b82f6', alpha = 100, onChange }) {
  const [internal, setInternal] = useState(alpha);
  const [r, g, b] = toRgb(color);
  const a = (internal / 100).toFixed(2);
  const rgba = \`rgba(\${r}, \${g}, \${b}, \${a})\`;
  const check = 'repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%)';

  const handle = (event) => {
    const next = Number(event.target.value);
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundImage: \`linear-gradient(\${rgba},\${rgba}),\${check}\`, backgroundSize: 'auto,10px 10px' }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{rgba}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={internal}
        onChange={handle}
        aria-label={\`Opacity, \${rgba}\`}
        className="h-4 w-full cursor-pointer appearance-none rounded-full border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ backgroundImage: \`linear-gradient(to right,rgba(\${r},\${g},\${b},0),rgba(\${r},\${g},\${b},1)),\${check}\`, backgroundSize: 'auto,12px 12px' }}
      />
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerAlphaSliderProps {
  /** Base colour as #rrggbb. */
  color?: string;
  /** Controlled alpha 0-100. */
  alpha?: number;
  onChange?: (alpha: number) => void;
}

function toRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function ColorPickerAlphaSlider({ color = '#3b82f6', alpha = 100, onChange }: ColorPickerAlphaSliderProps): JSX.Element {
  const [internal, setInternal] = useState<number>(alpha);
  const [r, g, b] = toRgb(color);
  const a = (internal / 100).toFixed(2);
  const rgba = \`rgba(\${r}, \${g}, \${b}, \${a})\`;
  // The checkerboard is what turns a translucent swatch honest - over white, half
  // alpha and full alpha look nearly identical.
  const check = 'repeating-conic-gradient(#ccc 0% 25%,#fff 0% 50%)';

  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-9 w-9 shrink-0 rounded-lg border border-black/10 dark:border-white/15" style={{ backgroundImage: \`linear-gradient(\${rgba},\${rgba}),\${check}\`, backgroundSize: 'auto,10px 10px' }} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{rgba}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={internal}
        onChange={handle}
        aria-label={\`Opacity, \${rgba}\`}
        className="h-4 w-full cursor-pointer appearance-none rounded-full border border-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 focus-visible:ring-offset-white dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        style={{ backgroundImage: \`linear-gradient(to right,rgba(\${r},\${g},\${b},0),rgba(\${r},\${g},\${b},1)),\${check}\`, backgroundSize: 'auto,12px 12px' }}
      />
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-palette-generator',
    category: 'color-pickers',
    tags: ['color', 'palette', 'tints', 'shades', 'scale'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'base', type: 'string', default: "'#3b82f6'", descriptionKey: 'base' },
      { name: 'onSelect', type: '(hex: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  A 10-step tint/shade ramp derived from one base colour by holding H and S and
  walking lightness. Every step is a button whose label is its own hex, so the scale
  is legible without hovering and each swatch announces its value. Static snapshot.
-->
<div class="w-full max-w-sm">
  <div class="mb-3 flex items-center gap-3">
    <input type="color" value="#3b82f6" aria-label="Base color" class="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
    <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">Base #3b82f6</span>
  </div>
  <div class="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
    <button type="button" aria-label="#eff6ff" class="flex aspect-square items-end justify-center rounded-md border border-black/10 pb-0.5 text-[9px] font-medium text-gray-700 dark:border-white/15" style="background-color:#eff6ff">50</button>
    <button type="button" aria-label="#3b82f6" class="flex aspect-square items-end justify-center rounded-md border border-black/10 pb-0.5 text-[9px] font-medium text-white dark:border-white/15" style="background-color:#3b82f6">500</button>
    <button type="button" aria-label="#1e3a8a" class="flex aspect-square items-end justify-center rounded-md border border-black/10 pb-0.5 text-[9px] font-medium text-white dark:border-white/15" style="background-color:#1e3a8a">900</button>
  </div>
</div>`,
      react: `import { useState } from 'react';

const STEPS = [
  { name: '50', l: 97 }, { name: '100', l: 94 }, { name: '200', l: 86 }, { name: '300', l: 77 },
  { name: '400', l: 68 }, { name: '500', l: 58 }, { name: '600', l: 48 }, { name: '700', l: 39 },
  { name: '800', l: 30 }, { name: '900', l: 22 },
];

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100) };
}

function hslToHex(h, s, l) {
  const sn = s / 100, ln = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

export function ColorPickerPaletteGenerator({ base = '#3b82f6', onSelect }) {
  const [color, setColor] = useState(base);
  const { h, s } = hexToHsl(color);
  const ramp = STEPS.map((step) => ({ name: step.name, hex: hslToHex(h, s, step.l), dark: step.l < 55 }));

  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex items-center gap-3">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Base color" className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">Base {color}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {ramp.map((step) => (
          <button
            key={step.name}
            type="button"
            onClick={() => onSelect?.(step.hex)}
            aria-label={step.hex}
            style={{ backgroundColor: step.hex }}
            className={\`flex aspect-square items-end justify-center rounded-md border border-black/10 pb-0.5 text-[9px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${step.dark ? 'text-white' : 'text-gray-700'}\`}
          >
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerPaletteGeneratorProps {
  base?: string;
  onSelect?: (hex: string) => void;
}

const STEPS: Array<{ name: string; l: number }> = [
  { name: '50', l: 97 }, { name: '100', l: 94 }, { name: '200', l: 86 }, { name: '300', l: 77 },
  { name: '400', l: 68 }, { name: '500', l: 58 }, { name: '600', l: 48 }, { name: '700', l: 39 },
  { name: '800', l: 30 }, { name: '900', l: 22 },
];

function hexToHsl(hex: string): { h: number; s: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return \`#\${toHex(f(0))}\${toHex(f(8))}\${toHex(f(4))}\`;
}

export function ColorPickerPaletteGenerator({ base = '#3b82f6', onSelect }: ColorPickerPaletteGeneratorProps): JSX.Element {
  const [color, setColor] = useState<string>(base);
  // Hold hue and saturation from the base; only lightness walks. That is what keeps
  // a generated scale reading as one family instead of ten unrelated colours.
  const { h, s } = hexToHsl(color);
  const ramp = STEPS.map((step) => ({ name: step.name, hex: hslToHex(h, s, step.l), dark: step.l < 55 }));

  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex items-center gap-3">
        <input type="color" value={color} onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)} aria-label="Base color" className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">Base {color}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {ramp.map((step) => (
          <button
            key={step.name}
            type="button"
            onClick={() => onSelect?.(step.hex)}
            aria-label={step.hex}
            style={{ backgroundColor: step.hex }}
            className={\`flex aspect-square items-end justify-center rounded-md border border-black/10 pb-0.5 text-[9px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${step.dark ? 'text-white' : 'text-gray-700'}\`}
          >
            {step.name}
          </button>
        ))}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-gradient-builder',
    category: 'color-pickers',
    tags: ['color', 'gradient', 'builder', 'linear', 'css'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'from', type: 'string', default: "'#6366f1'", descriptionKey: 'from' },
      { name: 'to', type: 'string', default: "'#ec4899'", descriptionKey: 'to' },
      { name: 'angle', type: 'number', default: '90', descriptionKey: 'angle' },
      { name: 'onChange', type: '(css: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  Two native colour inputs plus an angle range compose a linear-gradient, previewed
  live and printed as a copy-ready CSS string. Static snapshot.
-->
<div class="w-full max-w-sm">
  <div class="h-28 w-full rounded-xl border border-black/10 dark:border-white/15" style="background:linear-gradient(90deg,#6366f1,#ec4899)"></div>
  <div class="mt-3 flex flex-wrap items-center gap-3">
    <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value="#6366f1" aria-label="From color" class="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />From</label>
    <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value="#ec4899" aria-label="To color" class="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />To</label>
    <label class="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">Angle<input type="range" min="0" max="360" value="90" aria-label="Angle, 90 degrees" class="w-24 accent-indigo-600 dark:accent-indigo-400" /></label>
  </div>
  <code class="mt-3 block overflow-x-auto whitespace-nowrap rounded-md bg-gray-100 px-3 py-2 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">linear-gradient(90deg, #6366f1, #ec4899)</code>
</div>`,
      react: `import { useState } from 'react';

export function ColorPickerGradientBuilder({ from = '#6366f1', to = '#ec4899', angle = 90, onChange }) {
  const [f, setF] = useState(from);
  const [t, setT] = useState(to);
  const [a, setA] = useState(angle);
  const css = \`linear-gradient(\${a}deg, \${f}, \${t})\`;

  return (
    <div className="w-full max-w-sm">
      <div className="h-28 w-full rounded-xl border border-black/10 dark:border-white/15" style={{ background: css }} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="color" value={f} onChange={(e) => { setF(e.target.value); onChange?.(\`linear-gradient(\${a}deg, \${e.target.value}, \${t})\`); }} aria-label="From color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />
          From
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="color" value={t} onChange={(e) => { setT(e.target.value); onChange?.(\`linear-gradient(\${a}deg, \${f}, \${e.target.value})\`); }} aria-label="To color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />
          To
        </label>
        <label className="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          Angle
          <input type="range" min={0} max={360} value={a} onChange={(e) => { const n = Number(e.target.value); setA(n); onChange?.(\`linear-gradient(\${n}deg, \${f}, \${t})\`); }} aria-label={\`Angle, \${a} degrees\`} className="w-24 accent-indigo-600 dark:accent-indigo-400" />
        </label>
      </div>
      <code className="mt-3 block overflow-x-auto whitespace-nowrap rounded-md bg-gray-100 px-3 py-2 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">{css}</code>
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerGradientBuilderProps {
  from?: string;
  to?: string;
  angle?: number;
  onChange?: (css: string) => void;
}

export function ColorPickerGradientBuilder({ from = '#6366f1', to = '#ec4899', angle = 90, onChange }: ColorPickerGradientBuilderProps): JSX.Element {
  const [f, setF] = useState<string>(from);
  const [t, setT] = useState<string>(to);
  const [a, setA] = useState<number>(angle);
  const css = \`linear-gradient(\${a}deg, \${f}, \${t})\`;

  // The <code> block is horizontally scrollable, never wrapped: a wrapped gradient
  // string is easy to mis-copy, and this is a copy-paste target.
  return (
    <div className="w-full max-w-sm">
      <div className="h-28 w-full rounded-xl border border-black/10 dark:border-white/15" style={{ background: css }} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="color" value={f} onChange={(e: ChangeEvent<HTMLInputElement>) => { setF(e.target.value); onChange?.(\`linear-gradient(\${a}deg, \${e.target.value}, \${t})\`); }} aria-label="From color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />
          From
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <input type="color" value={t} onChange={(e: ChangeEvent<HTMLInputElement>) => { setT(e.target.value); onChange?.(\`linear-gradient(\${a}deg, \${f}, \${e.target.value})\`); }} aria-label="To color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />
          To
        </label>
        <label className="ml-auto flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          Angle
          <input type="range" min={0} max={360} value={a} onChange={(e: ChangeEvent<HTMLInputElement>) => { const n = Number(e.target.value); setA(n); onChange?.(\`linear-gradient(\${n}deg, \${f}, \${t})\`); }} aria-label={\`Angle, \${a} degrees\`} className="w-24 accent-indigo-600 dark:accent-indigo-400" />
        </label>
      </div>
      <code className="mt-3 block overflow-x-auto whitespace-nowrap rounded-md bg-gray-100 px-3 py-2 font-mono text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">{css}</code>
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-contrast-checker',
    category: 'color-pickers',
    tags: ['color', 'contrast', 'wcag', 'accessibility', 'checker'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'foreground', type: 'string', default: "'#1e293b'", descriptionKey: 'foreground' },
      { name: 'background', type: 'string', default: "'#f8fafc'", descriptionKey: 'background' },
    ],
    code: {
      tailwind: `<!--
  A WCAG contrast checker. The verdicts are the point: each threshold shows a tick or
  a cross AND the words "Pass" / "Fail", so the result never depends on the badge's
  own colour. The ratio is printed numerically too. Static snapshot.
-->
<div class="w-full max-w-sm">
  <div class="rounded-xl border border-black/10 p-4 dark:border-white/15" style="background-color:#f8fafc;color:#1e293b">
    <p class="text-base font-semibold">Sample text</p>
    <p class="text-sm">The quick brown fox.</p>
  </div>
  <div class="mt-3 flex flex-wrap items-center gap-3">
    <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value="#1e293b" aria-label="Text color" class="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Text</label>
    <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value="#f8fafc" aria-label="Background color" class="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Background</label>
    <span class="ml-auto font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">14.8:1</span>
  </div>
  <ul class="mt-3 flex flex-wrap gap-2">
    <li class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">&#10003; AA Pass</li>
    <li class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">&#10003; AAA Pass</li>
  </ul>
</div>`,
      react: `import { useState } from 'react';

function channel(hex, i) {
  const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
}

function ratio(fg, bg) {
  const a = luminance(fg), b = luminance(bg);
  const lighter = Math.max(a, b), darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function Verdict({ label, passed }) {
  return (
    <li className={\`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold \${passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}\`}>
      <span aria-hidden="true">{passed ? '\\u2713' : '\\u2717'}</span>
      {label} {passed ? 'Pass' : 'Fail'}
    </li>
  );
}

export function ColorPickerContrastChecker({ foreground = '#1e293b', background = '#f8fafc' }) {
  const [fg, setFg] = useState(foreground);
  const [bg, setBg] = useState(background);
  const r = ratio(fg, bg);

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-black/10 p-4 dark:border-white/15" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-base font-semibold">Sample text</p>
        <p className="text-sm">The quick brown fox.</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} aria-label="Text color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Text</label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Background color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Background</label>
        <span className="ml-auto font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{r.toFixed(2)}:1</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-live="polite">
        <Verdict label="AA" passed={r >= 4.5} />
        <Verdict label="AAA" passed={r >= 7} />
      </ul>
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerContrastCheckerProps {
  foreground?: string;
  background?: string;
}

// sRGB relative luminance per WCAG 2.1, computed per channel to avoid array indexing.
function channel(hex: string, i: number): number {
  const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
}

function ratio(fg: string, bg: string): number {
  const a = luminance(fg), b = luminance(bg);
  const lighter = Math.max(a, b), darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

// Tick/cross AND the word Pass/Fail - the verdict must not rest on the badge colour,
// which is exactly the kind of signal this component exists to catch.
function Verdict({ label, passed }: { label: string; passed: boolean }): JSX.Element {
  return (
    <li className={\`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold \${passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}\`}>
      <span aria-hidden="true">{passed ? '\\u2713' : '\\u2717'}</span>
      {label} {passed ? 'Pass' : 'Fail'}
    </li>
  );
}

export function ColorPickerContrastChecker({ foreground = '#1e293b', background = '#f8fafc' }: ColorPickerContrastCheckerProps): JSX.Element {
  const [fg, setFg] = useState<string>(foreground);
  const [bg, setBg] = useState<string>(background);
  const r = ratio(fg, bg);

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-black/10 p-4 dark:border-white/15" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-base font-semibold">Sample text</p>
        <p className="text-sm">The quick brown fox.</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value={fg} onChange={(e: ChangeEvent<HTMLInputElement>) => setFg(e.target.value)} aria-label="Text color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Text</label>
        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><input type="color" value={bg} onChange={(e: ChangeEvent<HTMLInputElement>) => setBg(e.target.value)} aria-label="Background color" className="h-8 w-8 cursor-pointer rounded-md border border-black/10 bg-transparent dark:border-white/15" />Background</label>
        <span className="ml-auto font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">{r.toFixed(2)}:1</span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-live="polite">
        <Verdict label="AA" passed={r >= 4.5} />
        <Verdict label="AAA" passed={r >= 7} />
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'color-picker-recent-colors',
    category: 'color-pickers',
    tags: ['color', 'recent', 'history', 'swatch', 'native'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'value', type: 'string', default: "'#3b82f6'", descriptionKey: 'value' },
      { name: 'recent', type: 'string[]', descriptionKey: 'recent' },
      { name: 'onChange', type: '(hex: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<!--
  A native colour input backed by a most-recently-used strip. Picking a new colour
  unshifts it into the history (de-duplicated, capped); the current swatch carries a
  ring and a check so it is identifiable without colour. Static snapshot.
-->
<div class="w-full max-w-xs">
  <div class="mb-3 flex items-center gap-3">
    <input type="color" value="#3b82f6" aria-label="Current color" class="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
    <span class="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">#3b82f6</span>
  </div>
  <p class="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">Recent</p>
  <div class="flex flex-wrap gap-2">
    <button type="button" aria-label="#3b82f6" aria-pressed="true" class="relative flex h-8 w-8 items-center justify-center rounded-md border border-black/10 ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:border-white/15 dark:ring-blue-400 dark:ring-offset-gray-950" style="background-color:#3b82f6"><svg viewBox="0 0 20 20" class="h-3.5 w-3.5" fill="none" stroke="#fff" stroke-width="3" style="mix-blend-mode:difference" aria-hidden="true"><path d="M4 10l4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button type="button" aria-label="#ec4899" aria-pressed="false" class="h-8 w-8 rounded-md border border-black/10 dark:border-white/15" style="background-color:#ec4899"></button>
    <button type="button" aria-label="#22c55e" aria-pressed="false" class="h-8 w-8 rounded-md border border-black/10 dark:border-white/15" style="background-color:#22c55e"></button>
  </div>
</div>`,
      react: `import { useState } from 'react';

export function ColorPickerRecentColors({ value = '#3b82f6', recent = ['#3b82f6', '#ec4899', '#22c55e', '#eab308'], onChange }) {
  const [current, setCurrent] = useState(value);
  const [history, setHistory] = useState(recent);

  const pick = (hex) => {
    setCurrent(hex);
    setHistory((prev) => [hex, ...prev.filter((c) => c.toLowerCase() !== hex.toLowerCase())].slice(0, 8));
    onChange?.(hex);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <input type="color" value={current} onChange={(e) => pick(e.target.value)} aria-label="Current color" className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">{current}</span>
      </div>
      <p className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">Recent</p>
      <div className="flex flex-wrap gap-2">
        {history.map((hex) => {
          const active = hex.toLowerCase() === current.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              onClick={() => pick(hex)}
              aria-label={hex}
              aria-pressed={active}
              style={{ backgroundColor: hex }}
              className={\`relative flex h-8 w-8 items-center justify-center rounded-md border border-black/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${active ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-blue-400 dark:ring-offset-gray-950' : ''}\`}
            >
              {active ? (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="3" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}`,
      typescript: `import { useState, type ChangeEvent } from 'react';

export interface ColorPickerRecentColorsProps {
  value?: string;
  recent?: string[];
  onChange?: (hex: string) => void;
}

export function ColorPickerRecentColors({ value = '#3b82f6', recent = ['#3b82f6', '#ec4899', '#22c55e', '#eab308'], onChange }: ColorPickerRecentColorsProps): JSX.Element {
  const [current, setCurrent] = useState<string>(value);
  const [history, setHistory] = useState<string[]>(recent);

  // De-dupe on insert and cap the list: a history that repeats or grows without bound
  // stops being a shortcut and becomes noise.
  const pick = (hex: string) => {
    setCurrent(hex);
    setHistory((prev) => [hex, ...prev.filter((c) => c.toLowerCase() !== hex.toLowerCase())].slice(0, 8));
    onChange?.(hex);
  };

  return (
    <div className="w-full max-w-xs">
      <div className="mb-3 flex items-center gap-3">
        <input type="color" value={current} onChange={(e: ChangeEvent<HTMLInputElement>) => pick(e.target.value)} aria-label="Current color" className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-black/10 bg-transparent dark:border-white/15" />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100" aria-live="polite">{current}</span>
      </div>
      <p className="mb-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">Recent</p>
      <div className="flex flex-wrap gap-2">
        {history.map((hex) => {
          const active = hex.toLowerCase() === current.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              onClick={() => pick(hex)}
              aria-label={hex}
              aria-pressed={active}
              style={{ backgroundColor: hex }}
              className={\`relative flex h-8 w-8 items-center justify-center rounded-md border border-black/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-white/15 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${active ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white dark:ring-blue-400 dark:ring-offset-gray-950' : ''}\`}
            >
              {active ? (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="#fff" strokeWidth="3" style={{ mixBlendMode: 'difference' }} aria-hidden="true">
                  <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}`,
    },
  },
];
