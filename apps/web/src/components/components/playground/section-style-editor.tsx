'use client';

import { useState, type CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import { Ban, Paintbrush, RotateCcw } from 'lucide-react';
import { Button, cn } from '@adysre/ui';
import type { PlaygroundSlot } from '@/data/playground';
import { GRADIENTS, type Gradient } from '@/data/gradients';
import { PATTERNS, type Pattern } from '@/data/patterns';
import { TEXTURES, type Texture } from '@/data/textures';
import { gradientToCss } from '@/lib/gradients/css';
import { patternToStyle } from '@/lib/patterns/css';
import { textureToStyle } from '@/lib/textures/css';
import {
  BORDER_STYLES,
  DEFAULT_BORDER,
  sectionStyleEditCount,
  type SectionBackgroundKind,
  type SectionBorderStyle,
  type SectionStylePatch,
} from '@/lib/playground/section-style';
import { useGradientsStore } from '@/stores/gradients-store';
import { usePatternsStore } from '@/stores/patterns-store';
import { useTexturesStore } from '@/stores/textures-store';
import { usePlaygroundStore } from '@/stores/playground-store';

interface SectionStyleEditorProps {
  /** The slot being styled - styling is keyed by slot, not by variation. */
  slot: PlaygroundSlot;
  /** Localised name of the slot, e.g. "Header". */
  slotLabel: string;
  /** False when the slot is empty, so there is nothing on screen to style. */
  hasSection: boolean;
  /** Fill a height-constrained parent (the builder sidebar tab) and scroll. */
  fill?: boolean;
}

const BACKGROUND_KINDS: SectionBackgroundKind[] = [
  'none',
  'color',
  'gradient',
  'pattern',
  'texture',
];

/** Neutral fallbacks offered whenever the project has no palette of its own. */
const NEUTRAL_SWATCHES = ['#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#334155', '#0f172a'];

/**
 * Background, text colour and border for one section.
 *
 * Every control writes straight into the playground store, which the canvas
 * pushes into the section's live preview and every exporter reads - so what the
 * user sets here is exactly what lands in the downloaded code.
 *
 * The gradient / pattern / texture choices are the app's own libraries, saved
 * items first: a user who made something on those pages can drop it into a
 * section without rebuilding it.
 */
export function SectionStyleEditor({
  slot,
  slotLabel,
  hasSection,
  fill = false,
}: SectionStyleEditorProps) {
  const t = useTranslations('components');
  const style = usePlaygroundStore((s) => s.sectionStyles[slot.id]);
  const setSectionStyle = usePlaygroundStore((s) => s.setSectionStyle);
  const resetSectionStyle = usePlaygroundStore((s) => s.resetSectionStyle);
  const palette = usePlaygroundStore((s) => s.palette);

  const savedGradients = useGradientsStore((s) => s.savedGradients);
  const savedPatterns = usePatternsStore((s) => s.savedPatterns);
  const savedTextures = useTexturesStore((s) => s.savedTextures);

  const background = style?.background ?? { kind: 'none' };
  // The tab the user last opened, so switching to "Color" and back to "None"
  // doesn't lose which picker they were in.
  const [kind, setKind] = useState<SectionBackgroundKind>(background.kind);
  const activeKind = background.kind === 'none' ? kind : background.kind;
  const editCount = sectionStyleEditCount(style);
  const border = style?.border ?? DEFAULT_BORDER;
  const swatches = palette?.colors.length ? palette.colors : NEUTRAL_SWATCHES;

  const set = (patch: SectionStylePatch) => setSectionStyle(slot.id, patch);

  /** Switch background kind, seeding the new kind with a sensible first pick. */
  function chooseKind(next: SectionBackgroundKind): void {
    setKind(next);
    if (next === 'none') return set({ background: undefined });
    if (background.kind === next) return;
    switch (next) {
      case 'color':
        return set({ background: { kind: 'color', color: swatches[0] ?? '#ffffff' } });
      case 'gradient': {
        const g = savedGradients[0] ?? GRADIENTS[0];
        return g ? set({ background: { kind: 'gradient', gradient: g } }) : undefined;
      }
      case 'pattern': {
        const p = savedPatterns[0] ?? PATTERNS[0];
        return p ? set({ background: { kind: 'pattern', pattern: p } }) : undefined;
      }
      case 'texture': {
        const x = savedTextures[0] ?? TEXTURES[0];
        return x ? set({ background: { kind: 'texture', texture: x } }) : undefined;
      }
    }
  }

  /** Merge a change into the pattern currently in use (colour, size, angle). */
  function patchPattern(patch: Partial<Pattern>): void {
    if (background.kind !== 'pattern') return;
    set({ background: { kind: 'pattern', pattern: { ...background.pattern, ...patch } } });
  }

  function patchTexture(patch: Partial<Texture>): void {
    if (background.kind !== 'texture') return;
    set({ background: { kind: 'texture', texture: { ...background.texture, ...patch } } });
  }

  function patchGradient(patch: Partial<Gradient>): void {
    if (background.kind !== 'gradient') return;
    set({ background: { kind: 'gradient', gradient: { ...background.gradient, ...patch } } });
  }

  const gradients = dedupe([...savedGradients, ...GRADIENTS]);
  const patterns = dedupe([...savedPatterns, ...PATTERNS]);
  const textures = dedupe([...savedTextures, ...TEXTURES]);

  return (
    <div
      data-tour="style"
      className={cn(
        'bg-card',
        fill ? 'flex min-h-0 flex-1 flex-col' : 'rounded-lg border border-border',
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <Paintbrush className="h-4 w-4 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">
            {t('playground.style.title')}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{slotLabel}</p>
        </div>
        {editCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t('playground.style.reset')}
            title={t('playground.style.reset')}
            onClick={() => resetSectionStyle(slot.id)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {!hasSection ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-muted-foreground">
          <Paintbrush className="h-5 w-5" aria-hidden />
          <p className="text-xs">{t('playground.style.empty')}</p>
        </div>
      ) : (
        <div
          className={cn('space-y-5 overflow-y-auto p-3', fill ? 'min-h-0 flex-1' : 'max-h-[26rem]')}
        >
          {/* ── Background ───────────────────────────────────────────────── */}
          <section className="space-y-2">
            <GroupLabel>{t('playground.style.background')}</GroupLabel>
            <div role="tablist" aria-label={t('playground.style.background')} className="flex flex-wrap gap-1">
              {BACKGROUND_KINDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={id === 'none' ? background.kind === 'none' : activeKind === id}
                  onClick={() => chooseKind(id)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    (id === 'none' ? background.kind === 'none' : activeKind === id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(`playground.style.kind.${id}`)}
                </button>
              ))}
            </div>

            {background.kind === 'color' && (
              <ColorField
                label={t('playground.style.backgroundColor')}
                value={background.color}
                swatches={swatches}
                onChange={(color) => set({ background: { kind: 'color', color } })}
              />
            )}

            {activeKind === 'gradient' && background.kind !== 'none' && (
              <div className="space-y-2">
                <AssetGrid
                  items={gradients}
                  selectedId={background.kind === 'gradient' ? background.gradient.id : null}
                  styleOf={(g) => ({ backgroundImage: gradientToCss(g) })}
                  onPick={(gradient) => set({ background: { kind: 'gradient', gradient } })}
                />
                {background.kind === 'gradient' && background.gradient.type !== 'radial' && (
                  <RangeField
                    label={t('playground.style.angle')}
                    value={background.gradient.angle}
                    min={0}
                    max={360}
                    suffix="°"
                    onChange={(angle) => patchGradient({ angle })}
                  />
                )}
              </div>
            )}

            {activeKind === 'pattern' && background.kind !== 'none' && (
              <div className="space-y-2">
                <AssetGrid
                  items={patterns}
                  selectedId={background.kind === 'pattern' ? background.pattern.id : null}
                  styleOf={patternToStyle}
                  onPick={(pattern) => set({ background: { kind: 'pattern', pattern } })}
                />
                {background.kind === 'pattern' && (
                  <>
                    <ColorField
                      label={t('playground.style.patternFg')}
                      value={background.pattern.fg}
                      swatches={swatches}
                      onChange={(fg) => patchPattern({ fg })}
                    />
                    <ColorField
                      label={t('playground.style.patternBg')}
                      value={background.pattern.bg}
                      swatches={swatches}
                      onChange={(bg) => patchPattern({ bg })}
                    />
                    <RangeField
                      label={t('playground.style.scale')}
                      value={background.pattern.size}
                      min={6}
                      max={64}
                      suffix="px"
                      onChange={(size) => patchPattern({ size })}
                    />
                    {background.pattern.type === 'lines' && (
                      <RangeField
                        label={t('playground.style.angle')}
                        value={background.pattern.angle}
                        min={-90}
                        max={90}
                        suffix="°"
                        onChange={(angle) => patchPattern({ angle })}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {activeKind === 'texture' && background.kind !== 'none' && (
              <div className="space-y-2">
                <AssetGrid
                  items={textures}
                  selectedId={background.kind === 'texture' ? background.texture.id : null}
                  styleOf={textureToStyle}
                  onPick={(texture) => set({ background: { kind: 'texture', texture } })}
                />
                {background.kind === 'texture' && (
                  <>
                    <ColorField
                      label={t('playground.style.patternFg')}
                      value={background.texture.fg}
                      swatches={swatches}
                      onChange={(fg) => patchTexture({ fg })}
                    />
                    <ColorField
                      label={t('playground.style.patternBg')}
                      value={background.texture.bg}
                      swatches={swatches}
                      onChange={(bg) => patchTexture({ bg })}
                    />
                    <RangeField
                      label={t('playground.style.opacity')}
                      value={background.texture.opacity}
                      min={0}
                      max={100}
                      suffix="%"
                      onChange={(opacity) => patchTexture({ opacity })}
                    />
                    <RangeField
                      label={t('playground.style.scale')}
                      value={background.texture.scale}
                      min={12}
                      max={200}
                      suffix="px"
                      onChange={(scale) => patchTexture({ scale })}
                    />
                  </>
                )}
              </div>
            )}
          </section>

          {/* ── Text ─────────────────────────────────────────────────────── */}
          <section className="space-y-2">
            <GroupLabel>
              {t('playground.style.text')}
              {style?.textColor && (
                <ClearButton
                  label={t('playground.style.clearText')}
                  onClick={() => set({ textColor: undefined })}
                />
              )}
            </GroupLabel>
            <ColorField
              label={t('playground.style.textColor')}
              value={style?.textColor ?? '#0f172a'}
              swatches={swatches}
              onChange={(textColor) => set({ textColor })}
            />
            <p className="text-[11px] leading-snug text-muted-foreground">
              {t('playground.style.textHint')}
            </p>
          </section>

          {/* ── Border ───────────────────────────────────────────────────── */}
          <section className="space-y-2">
            <GroupLabel>
              {t('playground.style.border')}
              {style?.border && (
                <ClearButton
                  label={t('playground.style.clearBorder')}
                  onClick={() => set({ border: undefined })}
                />
              )}
            </GroupLabel>
            <RangeField
              label={t('playground.style.borderWidth')}
              value={border.width}
              min={0}
              max={12}
              suffix="px"
              onChange={(width) => set({ border: { ...border, width } })}
            />
            <div className="flex flex-wrap gap-1">
              {BORDER_STYLES.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={border.style === id}
                  onClick={() => set({ border: { ...border, style: id as SectionBorderStyle } })}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    border.style === id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(`playground.style.borderStyle.${id}`)}
                </button>
              ))}
            </div>
            <ColorField
              label={t('playground.style.borderColor')}
              value={border.color}
              swatches={swatches}
              onChange={(color) => set({ border: { ...border, color } })}
            />
            <RangeField
              label={t('playground.style.radius')}
              value={border.radius}
              min={0}
              max={48}
              suffix="px"
              onChange={(radius) => set({ border: { ...border, radius } })}
            />
          </section>
        </div>
      )}
    </div>
  );
}

/** Keep the first entry per id, so a saved copy shadows the curated original. */
function dedupe<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(item.id) ? false : (seen.add(item.id), true)));
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

function ClearButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="ml-auto flex items-center gap-1 rounded px-1 text-[10px] font-medium normal-case text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Ban className="h-3 w-3" aria-hidden />
      {label}
    </button>
  );
}

/** A colour picker, a hex field, and the project palette as one-click swatches. */
function ColorField({
  label,
  value,
  swatches,
  onChange,
}: {
  label: string;
  value: string;
  swatches: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono uppercase">{value}</span>
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={value}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 shrink-0 cursor-pointer rounded border border-border bg-background p-0.5"
        />
        <input
          type="text"
          value={value}
          spellCheck={false}
          onChange={(e) => {
            const next = e.target.value.trim();
            // Only commit a complete hex, so typing "#1" doesn't blank the section.
            if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(next)) onChange(next);
          }}
          className="w-24 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex flex-1 flex-wrap justify-end gap-1">
          {swatches.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-label={c}
              title={c}
              className={cn(
                'h-5 w-5 rounded border transition-transform hover:scale-110',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                c.toLowerCase() === value.toLowerCase() ? 'border-primary' : 'border-border',
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span className="tabular-nums">
          {value}
          {suffix}
        </span>
      </label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-primary,#2563eb)]"
      />
    </div>
  );
}

/**
 * The picker grid shared by gradients, patterns and textures: each item renders
 * as its own real CSS, so the swatch is the thing itself, not an approximation.
 */
function AssetGrid<T extends { id: string; name: string }>({
  items,
  selectedId,
  styleOf,
  onPick,
}: {
  items: T[];
  selectedId: string | null;
  styleOf: (item: T) => CSSProperties;
  onPick: (item: T) => void;
}) {
  return (
    <ul className="grid max-h-44 grid-cols-3 gap-1.5 overflow-y-auto pr-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onPick(item)}
            title={item.name}
            aria-label={item.name}
            aria-pressed={selectedId === item.id}
            className={cn(
              'block h-12 w-full overflow-hidden rounded-md border transition-transform hover:scale-[1.03]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selectedId === item.id ? 'border-primary ring-2 ring-primary/40' : 'border-border',
            )}
            style={styleOf(item)}
          />
        </li>
      ))}
    </ul>
  );
}
