'use client';

import { useEffect, useRef, useState } from 'react';
import { Ban, type LucideIcon } from 'lucide-react';
import { cn } from 'adysre';

/**
 * Design Playground - inspector field primitives.
 *
 * Every inspector control shares three rules, so they live here once instead of
 * once per property group:
 *
 *  1. **One edit, one command.** A field never dispatches while the user types -
 *     it holds a local draft and commits on blur / Enter / arrow step. Patching
 *     per keystroke would push a dozen entries onto the undo stack for a single
 *     value change.
 *  2. **Mixed is a first-class state.** With several nodes selected the shown
 *     value is either the one they agree on or nothing at all; a field renders
 *     empty with a "Mixed" placeholder rather than lying about a value.
 *  3. **Real labels.** Each control is wrapped in - or wired to - a `<label>`,
 *     because the compact editor density leaves no room for visible helper text.
 *
 * Chrome uses theme tokens only. The colour a field *edits* is user data and is
 * a literal hex - the one allowed exception (PRD §4.4).
 */

/** Shared input chrome: compact, tokenised, visibly focusable. */
const INPUT_CLASS =
  'h-7 w-full min-w-0 rounded-md border border-border bg-background px-2 text-xs text-foreground ' +
  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const LABEL_CLASS = 'text-[10px] font-medium uppercase tracking-wide text-muted-foreground';

/** Fallback used when a "none" paint is turned back on - black is the neutral pick. */
export const DEFAULT_COLOR = '#000000';

/* ------------------------------------------------------------------ layout */

/** One property group: a titled `<section>` so the panel is navigable. */
export function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="border-b border-border px-3 py-3 last:border-b-0">
      <h3 className={cn(LABEL_CLASS, 'mb-2 font-semibold')}>{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

/** Two equal columns - the editor's default pairing for x/y, w/h, gap/padding. */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

/* ------------------------------------------------------------------ number */

/** Trim float noise so 1.2 + 0.1 reads as 1.3, not 1.3000000000000003. */
function round(value: number): number {
  return Math.round(value * 1e4) / 1e4;
}

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

export function NumberField({
  label,
  value,
  onCommit,
  mixedLabel,
  step = 1,
  min,
  max,
  suffix,
}: {
  label: string;
  /** null means the selection disagrees. */
  value: number | null;
  onCommit: (value: number) => void;
  mixedLabel: string;
  /** Arrow-key increment; shift multiplies it by ten. */
  step?: number;
  min?: number;
  max?: number;
  /** Unit hint drawn inside the field, e.g. `%` or `°`. */
  suffix?: string;
}) {
  // `null` draft means "show the model". Keeping the draft separate is what lets
  // Escape revert and stops a half-typed "-" from being committed.
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? (value === null ? '' : String(round(value)));

  function commit(raw: string): void {
    setDraft(null);
    const parsed = Number.parseFloat(raw);
    // Junk (empty, "-", "e") snaps back to the model rather than writing NaN.
    if (!Number.isFinite(parsed)) return;
    const next = round(clamp(parsed, min, max));
    // A no-op edit must not take a slot in the undo stack.
    if (value !== null && next === value) return;
    onCommit(next);
  }

  function stepBy(delta: number): void {
    // Step from whatever the user can see: their own draft, else the model.
    const base = draft !== null ? Number.parseFloat(draft) : value;
    if (base === null || !Number.isFinite(base)) return;
    const next = round(clamp(base + delta, min, max));
    setDraft(null);
    if (next !== value) onCommit(next);
  }

  return (
    <label className="grid min-w-0 gap-1">
      <span className={LABEL_CLASS}>{label}</span>
      <span className="relative block">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={display}
          placeholder={value === null ? mixedLabel : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commit(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit(event.currentTarget.value);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setDraft(null);
              event.currentTarget.blur();
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              // Own the arrows so shift can mean "coarse"; a native number input
              // would step by `step` regardless of modifiers.
              event.preventDefault();
              const direction = event.key === 'ArrowUp' ? 1 : -1;
              stepBy(direction * step * (event.shiftKey ? 10 : 1));
            }
          }}
          className={cn(INPUT_CLASS, 'tabular-nums', suffix && 'pr-6')}
        />
        {suffix ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-muted-foreground"
          >
            {suffix}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------- colour */

/** Accepts `#rgb`, `#rrggbb`, `#rrggbbaa` with or without the hash. */
function normalizeHex(raw: string): string | null {
  const body = raw.trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(body)) return null;
  const expanded =
    body.length === 3
      ? body
          .split('')
          .map((char) => char + char)
          .join('')
      : body;
  return `#${expanded.toLowerCase()}`;
}

/** The picker cannot render "none" or "mixed", so it falls back to opaque black. */
function pickerValue(value: string | null): string {
  if (!value) return DEFAULT_COLOR;
  return normalizeHex(value)?.slice(0, 7) ?? DEFAULT_COLOR;
}

export function ColorField({
  label,
  value,
  mixed,
  onCommit,
  mixedLabel,
  noneLabel,
  pickerLabel,
  hexLabel,
}: {
  label: string;
  /** null is a real value here: no paint at all. */
  value: string | null;
  /** True when the selection disagrees; `value` is then meaningless. */
  mixed: boolean;
  onCommit: (value: string | null) => void;
  mixedLabel: string;
  noneLabel: string;
  pickerLabel: string;
  hexLabel: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? (mixed ? '' : (value ?? ''));
  const isNone = !mixed && value === null;
  const pickerRef = useRef<HTMLInputElement>(null);

  function commitHex(raw: string): void {
    setDraft(null);
    // Emptying the field is how the keyboard says "no paint".
    if (raw.trim() === '') {
      if (!isNone) onCommit(null);
      return;
    }
    const next = normalizeHex(raw);
    if (!next || next === value) return;
    onCommit(next);
  }

  // React maps `onChange` to the DOM's `input` event, which a colour picker
  // fires continuously while you drag. The event that means "the user settled
  // on this colour" is the DOM's own `change`, fired when the picker closes -
  // and React has no prop for it, so it is subscribed here. Without this the
  // pick was only ever held as a draft, and the next render snapped the swatch
  // back to the stored colour: picking a colour appeared to do nothing.
  useEffect(() => {
    const element = pickerRef.current;
    if (!element) return;
    const onChange = (): void => commitHex(element.value);
    element.addEventListener('change', onChange);
    return () => element.removeEventListener('change', onChange);
    // `commitHex` closes over the current value/draft; re-subscribing per render
    // keeps it from committing a stale one.
  });

  return (
    <div className="grid gap-1">
      {/* Two controls edit one property, so each carries its own composed
          aria-label; a single wrapping <label> could only name one of them. */}
      <span aria-hidden className={LABEL_CLASS}>
        {label}
      </span>
      <div className="flex items-center gap-1">
        <input
          ref={pickerRef}
          type="color"
          aria-label={`${label} - ${pickerLabel}`}
          // Show what is being picked, not what is stored - otherwise the swatch
          // fights the user mid-drag.
          value={pickerValue(draft ?? value)}
          // Commit on blur, not on change: the native picker streams a value for
          // every pixel of drag, and each one would be an undo entry.
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commitHex(event.target.value)}
          className="h-7 w-7 shrink-0 cursor-pointer rounded-md border border-border bg-background p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <input
          type="text"
          aria-label={`${label} - ${hexLabel}`}
          autoComplete="off"
          spellCheck={false}
          value={display}
          placeholder={mixed ? mixedLabel : noneLabel}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => commitHex(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commitHex(event.currentTarget.value);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setDraft(null);
              event.currentTarget.blur();
            }
          }}
          className={cn(INPUT_CLASS, 'font-mono')}
        />
        <button
          type="button"
          aria-pressed={isNone}
          title={noneLabel}
          // A toggle, so the keyboard can both clear a paint and bring one back.
          onClick={() => onCommit(isNone ? DEFAULT_COLOR : null)}
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            isNone
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Ban className="h-3.5 w-3.5" />
          <span className="sr-only">{noneLabel}</span>
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- text */

/**
 * Multi-line text content. Enter inserts a newline - it is content, not a
 * submit - so commit happens on blur, with Escape to abandon the edit.
 */
export function TextAreaField({
  label,
  value,
  mixed,
  onCommit,
  mixedLabel,
}: {
  label: string;
  value: string;
  mixed: boolean;
  onCommit: (value: string) => void;
  mixedLabel: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? (mixed ? '' : value);

  function commit(raw: string): void {
    setDraft(null);
    if (!mixed && raw === value) return;
    onCommit(raw);
  }

  return (
    <label className="grid gap-1">
      <span className={LABEL_CLASS}>{label}</span>
      <textarea
        rows={2}
        value={display}
        placeholder={mixed ? mixedLabel : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            setDraft(null);
            event.currentTarget.blur();
          }
        }}
        className={cn(INPUT_CLASS, 'h-auto resize-y py-1.5 leading-relaxed')}
      />
    </label>
  );
}

/* ------------------------------------------------------------------- select */

/**
 * An exclusive choice with too many options to segment.
 *
 * `SegmentedField` is the default for a choice, but it lays every option out
 * side by side - past three or four labels in a 16rem panel they are unreadable.
 * A native `<select>` degrades to the platform's own picker instead, which is
 * also the accessible default on touch.
 *
 * There is no draft state here: a select commits the moment it changes, and one
 * change is already one value - the rule number 1 above exists for typing, not
 * for picking.
 */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  mixedLabel,
}: {
  label: string;
  /** null means the selection disagrees. */
  value: T | null;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  mixedLabel: string;
}) {
  return (
    <label className="grid min-w-0 gap-1">
      <span className={LABEL_CLASS}>{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(INPUT_CLASS, 'cursor-pointer appearance-none pr-2')}
      >
        {/* Only present while the selection disagrees, so "Mixed" can never be
            chosen - picking it back would mean writing a value that is not one. */}
        {value === null ? (
          <option value="" disabled>
            {mixedLabel}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------------------------------------------------------------- segmented */

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
}

/** A small exclusive choice (layout mode, direction, alignment). */
export function SegmentedField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  /** null means the selection disagrees - nothing reads as pressed. */
  value: T | null;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1">
      <span className={LABEL_CLASS}>{label}</span>
      <div
        role="group"
        aria-label={label}
        className="flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5"
      >
        {options.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              title={option.label}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex h-6 flex-1 items-center justify-center gap-1 rounded px-1.5 text-[11px] font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
              <span className={cn(Icon && 'sr-only')}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
