'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import { Check, Copy, Download, ImagePlus, Loader2, QrCode, Save, Trash2 } from 'lucide-react';
import { Button, Input, Label, Select, cn } from 'adysre';
import {
  QR_CATEGORIES,
  CATEGORY_LABELS,
  QR_TYPES_BY_ID,
  typesForCategory,
  isComplete,
  type QrCategoryId,
  type QrField,
} from '@/lib/tools/qr/registry';
import {
  DEFAULT_DESIGN,
  DOT_STYLES,
  CORNER_STYLES,
  ERROR_LEVELS,
  toStylingOptions,
  type QrDesign,
} from '@/lib/tools/qr/designer';

/**
 * QR Code Generator + Designer.
 *
 * A real, working tool: pick a type, fill its fields, and a QR renders live and
 * downloads as PNG or SVG - all client-side with the open-source
 * `qr-code-styling` (no external API). The payload comes from the pure encoders
 * in `@/lib/tools/qr`, the look from the designer model; this component only
 * wires them to inputs and the live canvas.
 *
 * The QR instance lives outside React (the library appends its own SVG to a
 * container), so it is created once in a ref and `update()`d whenever the data
 * or design changes.
 */

const DOWNLOADS = [
  { ext: 'png', label: 'PNG' },
  { ext: 'svg', label: 'SVG' },
  { ext: 'jpeg', label: 'JPG' },
] as const;

export function QrGenerator() {
  const [category, setCategory] = useState<QrCategoryId>('basic');
  const [typeId, setTypeId] = useState<string>('url');
  const [values, setValues] = useState<Record<string, string>>({});
  const [design, setDesign] = useState<QrDesign>(DEFAULT_DESIGN);
  const [ready, setReady] = useState(false);

  // Save-to-my-codes state.
  const [saveName, setSaveName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ name: string; shortUrl: string | null } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const type = QR_TYPES_BY_ID[typeId];
  const complete = type ? isComplete(type, values) : false;
  const data = useMemo(() => (type && complete ? type.build(values) : ''), [type, complete, values]);

  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  // Create the QR instance once, on the client only.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { default: QRCodeStylingCtor } = await import('qr-code-styling');
      if (cancelled || !containerRef.current) return;
      const qr = new QRCodeStylingCtor(toStylingOptions(data, design));
      containerRef.current.replaceChildren();
      qr.append(containerRef.current);
      qrRef.current = qr;
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally once: subsequent changes flow through the update effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render on any data or design change.
  useEffect(() => {
    qrRef.current?.update(toStylingOptions(data, design));
  }, [data, design]);

  function selectCategory(next: QrCategoryId) {
    setCategory(next);
    const first = typesForCategory(next)[0];
    if (first) {
      setTypeId(first.id);
      setValues({});
    }
  }

  function selectType(id: string) {
    setTypeId(id);
    setValues({});
  }

  const setField = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const patchDesign = useCallback((patch: Partial<QrDesign>) => {
    setDesign((prev) => ({ ...prev, ...patch }));
  }, []);

  function onLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patchDesign({ logo: typeof reader.result === 'string' ? reader.result : null });
    reader.readAsDataURL(file);
  }

  async function download(ext: (typeof DOWNLOADS)[number]['ext']) {
    if (!data) return;
    await qrRef.current?.download({ name: `qr-${typeId}`, extension: ext });
  }

  // A fresh edit invalidates a prior save result.
  useEffect(() => {
    setSaved(null);
    setSaveError(null);
  }, [data]);

  async function save() {
    if (!complete || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/tools/qr/codes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: typeId, name: saveName, payload: values, design }),
      });
      const json = (await res.json()) as
        | { success: true; data: { name: string; shortUrl: string | null } }
        | { success: false; message: string };
      if (!res.ok || !json.success) {
        setSaveError('message' in json ? json.message : 'Could not save the code.');
        return;
      }
      setSaved({ name: json.data.name, shortUrl: json.data.shortUrl });
      window.dispatchEvent(new CustomEvent('qr:saved'));
    } catch {
      setSaveError('Could not save the code.');
    } finally {
      setSaving(false);
    }
  }

  async function copyShort() {
    if (!saved?.shortUrl) return;
    await navigator.clipboard.writeText(saved.shortUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* ── Left: content + design ─────────────────────────────────────────── */}
      {/* `relative` contains the sr-only logo input (absolute); otherwise it
          escapes to <html> and adds a stray body scroll. */}
      <div className="relative space-y-8">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="QR category">
          {QR_CATEGORIES.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={category === id}
              onClick={() => selectCategory(id)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                category === id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {CATEGORY_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Type + fields */}
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="qr-type">Type</Label>
            <Select id="qr-type" value={typeId} onChange={(e) => selectType(e.target.value)}>
              {typesForCategory(category).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
            {type && <p className="text-xs text-muted-foreground">{type.hint}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {type?.fields.map((field) => (
              <FieldControl
                key={field.name}
                field={field}
                value={values[field.name] ?? ''}
                onChange={(v) => setField(field.name, v)}
              />
            ))}
          </div>
        </section>

        {/* Designer */}
        <section className="space-y-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Design</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorControl
              label="Foreground"
              value={design.foreground}
              onChange={(v) => patchDesign({ foreground: v })}
            />
            <ColorControl
              label="Background"
              value={design.background}
              onChange={(v) => patchDesign({ background: v })}
              disabled={design.transparentBackground}
            />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Toggle
              label="Transparent background"
              on={design.transparentBackground}
              onChange={(on) => patchDesign({ transparentBackground: on })}
            />
            <Toggle
              label="Gradient"
              on={design.useGradient}
              onChange={(on) => patchDesign({ useGradient: on })}
            />
            {design.useGradient && (
              <ColorControl
                label="Gradient to"
                value={design.gradientColor}
                onChange={(v) => patchDesign({ gradientColor: v })}
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SelectControl
              label="Dot style"
              value={design.dotStyle}
              options={DOT_STYLES}
              onChange={(v) => patchDesign({ dotStyle: v as QrDesign['dotStyle'] })}
            />
            <SelectControl
              label="Eye style"
              value={design.cornerStyle}
              options={CORNER_STYLES}
              onChange={(v) => patchDesign({ cornerStyle: v as QrDesign['cornerStyle'] })}
            />
            <SelectControl
              label="Error correction"
              value={design.errorCorrection}
              options={ERROR_LEVELS}
              onChange={(v) => patchDesign({ errorCorrection: v as QrDesign['errorCorrection'] })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <RangeControl
              label={`Size (${design.size}px)`}
              min={160}
              max={640}
              step={16}
              value={design.size}
              onChange={(v) => patchDesign({ size: v })}
            />
            <RangeControl
              label={`Padding (${design.margin}px)`}
              min={0}
              max={48}
              step={2}
              value={design.margin}
              onChange={(v) => patchDesign({ margin: v })}
            />
          </div>

          {/* Logo */}
          <div className="space-y-1.5">
            <Label>Logo</Label>
            <div className="flex flex-wrap items-center gap-2">
              <label
                className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                )}
              >
                <ImagePlus className="h-4 w-4" aria-hidden />
                {design.logo ? 'Replace logo' : 'Upload logo'}
                <input type="file" accept="image/*" className="sr-only" onChange={onLogoChange} />
              </label>
              {design.logo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => patchDesign({ logo: null })}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── Right: live preview + downloads ────────────────────────────────── */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div
            className={cn(
              'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-border',
              design.transparentBackground
                ? 'bg-[repeating-conic-gradient(theme(colors.muted.DEFAULT)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]'
                : 'bg-muted/30',
            )}
          >
            <div ref={containerRef} className={cn('[&>*]:h-auto [&>*]:max-w-full', !ready && 'opacity-0')} />
            {!ready && (
              <Loader2 className="absolute h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
            )}
            {ready && !complete && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/80 text-center text-sm text-muted-foreground">
                <QrCode className="h-6 w-6" aria-hidden />
                <p className="px-6">Fill the required fields to generate your QR.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DOWNLOADS.map(({ ext, label }) => (
              <Button
                key={ext}
                type="button"
                variant="outline"
                size="sm"
                disabled={!complete}
                onClick={() => void download(ext)}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                {label}
              </Button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Rendered locally. Nothing leaves your browser.
          </p>
        </div>

        {/* Save → dynamic QR with a trackable short link + analytics. */}
        <div className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-5">
          <Label htmlFor="qr-save-name">Save to my codes</Label>
          <div className="flex gap-2">
            <Input
              id="qr-save-name"
              value={saveName}
              placeholder={type?.label ?? 'Name'}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <Button type="button" size="sm" disabled={!complete || saving} onClick={() => void save()}>
              {saving ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Save className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              )}
              Save
            </Button>
          </div>

          {saveError && <p className="text-xs text-destructive">{saveError}</p>}

          {saved && (
            <div className="space-y-1.5 rounded-lg border border-success/30 bg-success/10 p-3 text-sm">
              <p className="font-medium text-success">Saved “{saved.name}”.</p>
              {saved.shortUrl ? (
                <>
                  <p className="text-xs text-muted-foreground">
                    Tracked short link. Scans are counted in analytics:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded bg-background px-2 py-1 text-xs">
                      {saved.shortUrl}
                    </code>
                    <Button type="button" variant="outline" size="sm" onClick={() => void copyShort()}>
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-success" aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Stored in your library. This type encodes content directly, so it isn’t tracked.
                </p>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

/** One form field, rendered by its declared type. */
function FieldControl({
  field,
  value,
  onChange,
}: {
  field: QrField;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `qr-field-${field.name}`;
  const wide = field.type === 'textarea';
  return (
    <div className={cn('space-y-1.5', wide && 'sm:col-span-2')}>
      <Label htmlFor={id}>
        {field.label}
        {field.required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {field.type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : field.type === 'select' ? (
        <Select id={id} value={value || field.options?.[0]?.value || ''} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={id}
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className={cn('flex items-center gap-2', disabled && 'opacity-50')}>
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background"
          aria-label={label}
        />
        <Input value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="font-mono" />
      </div>
    </div>
  );
}

function SelectControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

function RangeControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 w-full cursor-pointer accent-primary"
      />
    </div>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span
        className={cn(
          'relative h-5 w-9 rounded-full border transition-colors',
          on ? 'border-primary bg-primary/20' : 'border-border bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all',
            on ? 'left-[1.15rem] bg-primary' : 'left-0.5 bg-muted-foreground',
          )}
        />
      </span>
      {label}
    </button>
  );
}
